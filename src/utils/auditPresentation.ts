import { validateServiceItems, needsMigration, type ValidationResult } from './visualDataValidator';
import { resolveBackgroundImageUrl } from './backgroundResolver';
import { WORSHIP_BACKGROUNDS } from '../assets/backgrounds';
import type { Service, ServiceItem } from '../types/service';

/**
 * Presentation System Audit Utility
 * 
 * Comprehensive diagnostic tool for identifying issues in:
 * - Service items and visual data
 * - Background resolution
 * - Data integrity
 * 
 * Created: Phase 3 of presentation system overhaul
 */

export interface AuditReport {
  timestamp: string;
  totalServices: number;
  totalItems: number;
  summary: {
    validItems: number;
    invalidItems: number;
    itemsWithVisualData: number;
    itemsWithoutVisualData: number;
    itemsNeedingMigration: number;
    backgroundIssues: number;
  };
  itemsByType: Record<string, number>;
  backgroundAnalysis: {
    totalBackgrounds: number;
    availableBackgrounds: number;
    unresolvedBackgroundIds: Set<string>;
    mostUsedBackgrounds: Array<{ id: string; count: number }>;
  };
  issues: Array<{
    severity: 'error' | 'warning' | 'info';
    itemId: string;
    itemTitle: string;
    itemType: string;
    message: string;
  }>;
  validationResults: ValidationResult[];
}

/**
 * Run a comprehensive audit on all services
 * 
 * @param services - Array of services to audit
 * @returns Detailed audit report
 */
export async function auditServices(services: Service[]): Promise<AuditReport> {
  const report: AuditReport = {
    timestamp: new Date().toISOString(),
    totalServices: services.length,
    totalItems: 0,
    summary: {
      validItems: 0,
      invalidItems: 0,
      itemsWithVisualData: 0,
      itemsWithoutVisualData: 0,
      itemsNeedingMigration: 0,
      backgroundIssues: 0
    },
    itemsByType: {},
    backgroundAnalysis: {
      totalBackgrounds: 0,
      availableBackgrounds: WORSHIP_BACKGROUNDS.length,
      unresolvedBackgroundIds: new Set(),
      mostUsedBackgrounds: []
    },
    issues: [],
    validationResults: []
  };

  // Collect all items from all services
  const allItems: ServiceItem[] = [];
  const backgroundUsage = new Map<string, number>();

  for (const service of services) {
    if (!service.items) continue;
    
    for (const item of service.items) {
      allItems.push(item);
      
      // Count by type
      report.itemsByType[item.type] = (report.itemsByType[item.type] || 0) + 1;
      
      // Analyze backgrounds
      if (item.backgroundId) {
        backgroundUsage.set(item.backgroundId, (backgroundUsage.get(item.backgroundId) || 0) + 1);
        
        // Check if background can be resolved
        const resolved = WORSHIP_BACKGROUNDS.find(bg => bg.id === item.backgroundId);
        if (!resolved) {
          report.backgroundAnalysis.unresolvedBackgroundIds.add(item.backgroundId);
          report.summary.backgroundIssues++;
          report.issues.push({
            severity: 'warning',
            itemId: item.id,
            itemTitle: item.title || item.songTitle || 'Untitled',
            itemType: item.type,
            message: `Background ID "${item.backgroundId}" not found in WORSHIP_BACKGROUNDS`
          });
        }
      }
      
      // Check for visual data and parse backgrounds
      if (item.content && item.content.trim().startsWith('{')) {
        try {
          const visualData = JSON.parse(item.content);
          if (visualData.background) {
            const bgId = visualData.background.imageId || visualData.background.imageUrl;
            if (bgId && !bgId.startsWith('http')) {
              backgroundUsage.set(bgId, (backgroundUsage.get(bgId) || 0) + 1);
              
              // Try to resolve
              const url = resolveBackgroundImageUrl(visualData.background);
              if (!url) {
                report.backgroundAnalysis.unresolvedBackgroundIds.add(bgId);
                report.summary.backgroundIssues++;
              }
            }
          }
        } catch (error) {
          // Invalid JSON - will be caught by validator
        }
      }
    }
  }

  // Update total items
  report.totalItems = allItems.length;
  report.backgroundAnalysis.totalBackgrounds = backgroundUsage.size;

  // Sort backgrounds by usage
  const sortedBackgrounds = Array.from(backgroundUsage.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  
  report.backgroundAnalysis.mostUsedBackgrounds = sortedBackgrounds.map(([id, count]) => ({
    id,
    count
  }));

  // Validate all items
  const validation = validateServiceItems(allItems);
  report.validationResults = validation.results;
  report.summary.validItems = validation.validItems;
  report.summary.invalidItems = validation.results.filter(r => !r.isValid).length;
  report.summary.itemsWithVisualData = validation.itemsWithVisualData;
  report.summary.itemsWithoutVisualData = validation.totalItems - validation.itemsWithVisualData;

  // Check migration needs
  for (const item of allItems) {
    if (needsMigration(item)) {
      report.summary.itemsNeedingMigration++;
      report.issues.push({
        severity: 'info',
        itemId: item.id,
        itemTitle: item.title || item.songTitle || 'Untitled',
        itemType: item.type,
        message: 'Item uses plain text instead of visual data format'
      });
    }
  }

  // Add validation errors and warnings to issues
  validation.results.forEach((result, index) => {
    const item = allItems[index];
    
    result.errors.forEach(error => {
      report.issues.push({
        severity: 'error',
        itemId: item.id,
        itemTitle: result.itemTitle,
        itemType: result.itemType,
        message: error
      });
    });
    
    result.warnings.forEach(warning => {
      report.issues.push({
        severity: 'warning',
        itemId: item.id,
        itemTitle: result.itemTitle,
        itemType: result.itemType,
        message: warning
      });
    });
  });

  return report;
}

/**
 * Generate a human-readable audit report
 * 
 * @param report - Audit report data
 * @returns Formatted report string
 */
export function formatAuditReport(report: AuditReport): string {
  const lines: string[] = [];
  
  lines.push('╔═══════════════════════════════════════════════════════════════╗');
  lines.push('║         PRESENTATION SYSTEM AUDIT REPORT                      ║');
  lines.push('╚═══════════════════════════════════════════════════════════════╝');
  lines.push('');
  lines.push(`Generated: ${new Date(report.timestamp).toLocaleString()}`);
  lines.push('');
  
  // Overview
  lines.push('📊 OVERVIEW');
  lines.push('─'.repeat(65));
  lines.push(`Total Services: ${report.totalServices}`);
  lines.push(`Total Items: ${report.totalItems}`);
  lines.push('');
  
  // Summary
  lines.push('📈 SUMMARY');
  lines.push('─'.repeat(65));
  lines.push(`✅ Valid Items: ${report.summary.validItems} (${((report.summary.validItems / report.totalItems) * 100).toFixed(1)}%)`);
  lines.push(`❌ Invalid Items: ${report.summary.invalidItems} (${((report.summary.invalidItems / report.totalItems) * 100).toFixed(1)}%)`);
  lines.push(`🎨 Items with Visual Data: ${report.summary.itemsWithVisualData}`);
  lines.push(`📝 Items without Visual Data: ${report.summary.itemsWithoutVisualData}`);
  lines.push(`🔄 Items Needing Migration: ${report.summary.itemsNeedingMigration}`);
  lines.push(`⚠️  Background Issues: ${report.summary.backgroundIssues}`);
  lines.push('');
  
  // Items by type
  lines.push('📂 ITEMS BY TYPE');
  lines.push('─'.repeat(65));
  Object.entries(report.itemsByType)
    .sort((a, b) => b[1] - a[1])
    .forEach(([type, count]) => {
      lines.push(`  ${type.padEnd(20)}: ${count}`);
    });
  lines.push('');
  
  // Background analysis
  lines.push('🖼️  BACKGROUND ANALYSIS');
  lines.push('─'.repeat(65));
  lines.push(`Total Unique Backgrounds Used: ${report.backgroundAnalysis.totalBackgrounds}`);
  lines.push(`Available in Library: ${report.backgroundAnalysis.availableBackgrounds}`);
  lines.push(`Unresolved Background IDs: ${report.backgroundAnalysis.unresolvedBackgroundIds.size}`);
  
  if (report.backgroundAnalysis.unresolvedBackgroundIds.size > 0) {
    lines.push('');
    lines.push('⚠️  Unresolved Background IDs:');
    Array.from(report.backgroundAnalysis.unresolvedBackgroundIds).forEach(id => {
      lines.push(`  - ${id}`);
    });
  }
  
  lines.push('');
  lines.push('Top 10 Most Used Backgrounds:');
  report.backgroundAnalysis.mostUsedBackgrounds.forEach((bg, index) => {
    lines.push(`  ${(index + 1).toString().padStart(2)}. ${bg.id.padEnd(30)} (${bg.count} uses)`);
  });
  lines.push('');
  
  // Issues
  if (report.issues.length > 0) {
    lines.push('⚠️  ISSUES FOUND');
    lines.push('─'.repeat(65));
    
    const errors = report.issues.filter(i => i.severity === 'error');
    const warnings = report.issues.filter(i => i.severity === 'warning');
    const infos = report.issues.filter(i => i.severity === 'info');
    
    if (errors.length > 0) {
      lines.push(`\n❌ ERRORS (${errors.length}):`);
      errors.slice(0, 20).forEach(issue => {
        lines.push(`  [${issue.itemType}] ${issue.itemTitle}`);
        lines.push(`    → ${issue.message}`);
      });
      if (errors.length > 20) {
        lines.push(`  ... and ${errors.length - 20} more errors`);
      }
    }
    
    if (warnings.length > 0) {
      lines.push(`\n⚠️  WARNINGS (${warnings.length}):`);
      warnings.slice(0, 20).forEach(issue => {
        lines.push(`  [${issue.itemType}] ${issue.itemTitle}`);
        lines.push(`    → ${issue.message}`);
      });
      if (warnings.length > 20) {
        lines.push(`  ... and ${warnings.length - 20} more warnings`);
      }
    }
    
    if (infos.length > 0 && infos.length <= 10) {
      lines.push(`\nℹ️  INFO (${infos.length}):`);
      infos.forEach(issue => {
        lines.push(`  [${issue.itemType}] ${issue.itemTitle}`);
        lines.push(`    → ${issue.message}`);
      });
    }
  } else {
    lines.push('✨ NO ISSUES FOUND - Everything looks great!');
  }
  
  lines.push('');
  lines.push('═'.repeat(65));
  lines.push('End of Report');
  lines.push('');
  
  return lines.join('\n');
}

/**
 * Console-friendly audit function
 * Run this to audit all services and log report to console
 * 
 * @param services - Array of services to audit
 */
export async function runAudit(services: Service[]): Promise<void> {
  console.log('🔍 Starting presentation system audit...\n');
  
  const report = await auditServices(services);
  const formatted = formatAuditReport(report);
  
  console.log(formatted);
  
  // Save to localStorage for later review
  try {
    localStorage.setItem('last_audit_report', JSON.stringify(report));
    localStorage.setItem('last_audit_timestamp', report.timestamp);
    console.log('💾 Report saved to localStorage (key: "last_audit_report")');
  } catch (error) {
    console.warn('⚠️  Could not save report to localStorage:', error);
  }
}

/**
 * Quick health check - returns simple pass/fail status
 * 
 * @param services - Array of services to check
 * @returns True if no critical issues found
 */
export async function healthCheck(services: Service[]): Promise<boolean> {
  const report = await auditServices(services);
  
  // Consider healthy if:
  // - No invalid items
  // - Less than 10% background issues
  // - Less than 20% items need migration
  
  const hasErrors = report.summary.invalidItems > 0;
  const hasExcessiveBackgroundIssues = (report.summary.backgroundIssues / report.totalItems) > 0.1;
  const hasExcessiveMigrationNeeds = (report.summary.itemsNeedingMigration / report.totalItems) > 0.2;
  
  return !hasErrors && !hasExcessiveBackgroundIssues && !hasExcessiveMigrationNeeds;
}

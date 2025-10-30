import { getDatabase } from './db';
import type { DesignTemplate } from '../types';

export class TemplateService {
  /**
   * Get all design templates from the database
   */
  static getAllTemplates(): DesignTemplate[] {
    const db = getDatabase();
    const stmt = db.prepare(`
      SELECT * FROM design_templates 
      ORDER BY created_at ASC
    `);
    
    const rows = stmt.all() as Array<{
      id: string;
      name: string;
      template_data: string;
      is_ai_generated: number;
      created_at: string;
    }>;

    return rows.map(row => ({
      id: row.id,
      name: row.name,
      templateData: JSON.parse(row.template_data),
      isAiGenerated: row.is_ai_generated === 1,
      createdAt: row.created_at,
    }));
  }

  /**
   * Get a single template by ID
   */
  static getTemplateById(id: string): DesignTemplate | null {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM design_templates WHERE id = ?');
    const row = stmt.get(id) as any;

    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      templateData: JSON.parse(row.template_data),
      isAiGenerated: row.is_ai_generated === 1,
      createdAt: row.created_at,
    };
  }
}

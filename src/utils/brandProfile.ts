/**
 * Brand Profile Management
 * 
 * Handles loading, saving, and applying brand profiles
 */

import type { BrandProfile, LogoConfiguration, SlideType, BrandProfileStats } from '../types/brandProfile';
import { DEFAULT_BRAND_PROFILE } from '../types/brandProfile';
import { getBrandAssetById } from './brandAssetStorage';

const BRAND_PROFILE_KEY = 'brandProfile_v1';

/**
 * Get current brand profile (with graceful fallback)
 */
export function getBrandProfile(): BrandProfile {
  try {
    const stored = localStorage.getItem(BRAND_PROFILE_KEY);
    if (!stored) {
      console.log('📋 No brand profile found, using defaults');
      return { ...DEFAULT_BRAND_PROFILE };
    }
    
    const profile = JSON.parse(stored);
    console.log('📋 Loaded brand profile:', profile.churchName || 'Unnamed');
    return profile;
  } catch (error) {
    console.error('❌ Failed to load brand profile:', error);
    return { ...DEFAULT_BRAND_PROFILE };
  }
}

/**
 * Save brand profile
 */
export function saveBrandProfile(profile: BrandProfile): void {
  try {
    profile.updatedAt = Date.now();
    if (!profile.createdAt) {
      profile.createdAt = Date.now();
    }
    localStorage.setItem(BRAND_PROFILE_KEY, JSON.stringify(profile));
    console.log('✅ Saved brand profile:', profile.churchName);
  } catch (error) {
    console.error('❌ Failed to save brand profile:', error);
    throw new Error('Could not save brand profile');
  }
}

/**
 * Reset brand profile to defaults
 */
export function resetBrandProfile(): void {
  localStorage.removeItem(BRAND_PROFILE_KEY);
  console.log('🔄 Brand profile reset to defaults');
}

/**
 * Check if branding is configured and enabled
 */
export function isBrandingConfigured(): boolean {
  const profile = getBrandProfile();
  return !!(
    profile.logos.primary.assetId && 
    profile.logos.primary.visible
  );
}

/**
 * Check if branding should be applied to a specific slide type
 */
export function shouldApplyBranding(slideType: SlideType, isTitle: boolean = false): boolean {
  if (!isBrandingConfigured()) {
    return false;
  }
  
  const profile = getBrandProfile();
  const config = profile.logos.primary;
  
  // Check if excluded from title slides
  if (isTitle && config.excludeFromTitleSlides) {
    return false;
  }
  
  // Check if this slide type is in the useOn list
  return config.useOn.includes(slideType) || config.useOn.includes('all');
}

/**
 * Detect if a background is dark or light
 * Uses simple heuristic based on background color/image
 */
export function isBackgroundDark(background: any): boolean {
  if (!background) return false;
  
  // For solid colors
  if (background.type === 'solid' && background.color) {
    const color = background.color;
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128;
  }
  
  // For images with overlay
  if (background.type === 'image' && background.overlay?.enabled) {
    const opacity = background.overlay.opacity || 50;
    // If overlay is significant, consider it dark
    return opacity > 30;
  }
  
  // For images without overlay, assume dark (common for worship backgrounds)
  if (background.type === 'image') {
    return true;
  }
  
  // Default to light
  return false;
}

/**
 * Get appropriate logo based on background
 */
export function getLogoForBackground(backgroundIsDark: boolean): string | null {
  const profile = getBrandProfile();
  
  if (!profile.logos.primary.assetId) {
    return null;
  }
  
  // Try appropriate version first
  if (backgroundIsDark && profile.logos.whiteVersion?.assetId) {
    const asset = getBrandAssetById(profile.logos.whiteVersion.assetId);
    if (asset) {
      console.log('🎨 Using white logo for dark background');
      return asset.dataUrl;
    }
  }
  
  if (!backgroundIsDark && profile.logos.colorVersion?.assetId) {
    const asset = getBrandAssetById(profile.logos.colorVersion.assetId);
    if (asset) {
      console.log('🎨 Using color logo for light background');
      return asset.dataUrl;
    }
  }
  
  // Fallback to primary logo
  const primaryAsset = getBrandAssetById(profile.logos.primary.assetId);
  if (primaryAsset) {
    console.log('🎨 Using primary logo');
    return primaryAsset.dataUrl;
  }
  
  console.warn('⚠️ Logo asset not found');
  return null;
}

/**
 * Get position coordinates based on placement setting
 */
function getLogoPosition(placement: string, size: { width: number; height: number }): { x: number; y: number } {
  const padding = 50; // pixels from edge
  
  const positions = {
    'top-left': { x: padding, y: padding },
    'top-right': { x: 1920 - size.width - padding, y: padding },
    'bottom-left': { x: padding, y: 1080 - size.height - padding },
    'bottom-right': { x: 1920 - size.width - padding, y: 1080 - size.height - padding },
    'center-bottom': { x: (1920 - size.width) / 2, y: 1080 - size.height - padding },
  };
  
  return positions[placement as keyof typeof positions] || positions['bottom-right'];
}

/**
 * Get logo size in pixels
 */
function getLogoSize(sizeKey: string): { width: number; height: number } {
  const sizes = {
    'small': { width: 100, height: 100 },
    'medium': { width: 150, height: 150 },
    'large': { width: 200, height: 200 },
  };
  
  return sizes[sizeKey as keyof typeof sizes] || sizes['medium'];
}

/**
 * Create a logo element for visual data
 */
export function createLogoElement(
  backgroundIsDark: boolean = false,
  config?: Partial<LogoConfiguration>
): any | null {
  const profile = getBrandProfile();
  const logoConfig = { ...profile.logos.primary, ...config };
  
  const logoDataUrl = getLogoForBackground(backgroundIsDark);
  if (!logoDataUrl) {
    return null;
  }
  
  const size = getLogoSize(logoConfig.size);
  const position = getLogoPosition(logoConfig.placement, size);
  
  return {
    id: `brand-logo-${Date.now()}`,
    type: 'image',
    content: logoDataUrl,
    position,
    size,
    zIndex: 100, // Above other elements
    visible: true,
    opacity: logoConfig.opacity,
    rotation: 0,
    locked: true, // Prevent accidental deletion/movement
    isBrandElement: true, // Flag for identification
  };
}

/**
 * Apply branding to a slide's visual data
 */
export function applyBrandingToSlide(
  visualData: any,
  slideType: SlideType,
  isTitle: boolean = false
): any {
  if (!shouldApplyBranding(slideType, isTitle)) {
    console.log('⏭️ Branding not configured or not applicable');
    return visualData;
  }
  
  // Remove existing brand elements
  visualData.elements = visualData.elements.filter((el: any) => !el.isBrandElement);
  
  // Detect background darkness
  const backgroundIsDark = isBackgroundDark(visualData.background);
  
  // Create and add logo element
  const logoElement = createLogoElement(backgroundIsDark);
  if (logoElement) {
    visualData.elements.push(logoElement);
    console.log('✅ Applied branding to slide:', slideType, isTitle ? '(title)' : '');
  }
  
  return visualData;
}

/**
 * Remove branding from a slide's visual data
 */
export function removeBrandingFromSlide(visualData: any): any {
  visualData.elements = visualData.elements.filter((el: any) => !el.isBrandElement);
  console.log('🗑️ Removed branding from slide');
  return visualData;
}

/**
 * Check if a slide has branding applied
 */
export function hasBranding(visualData: any): boolean {
  if (!visualData || !visualData.elements) return false;
  return visualData.elements.some((el: any) => el.isBrandElement);
}

/**
 * Get brand profile statistics
 */
export function getBrandProfileStats(): BrandProfileStats {
  const profile = getBrandProfile();
  
  return {
    isConfigured: isBrandingConfigured(),
    hasPrimaryLogo: !!profile.logos.primary.assetId,
    hasAlternativeLogos: !!(profile.logos.whiteVersion || profile.logos.colorVersion),
    totalAppliedSlides: 0, // TODO: Calculate from database
    autoApplyEnabled: Object.values(profile.autoApply).some(v => v === true),
  };
}

/**
 * Get configuration for a specific slide type (including overrides)
 */
export function getConfigForSlideType(slideType: SlideType): LogoConfiguration {
  const profile = getBrandProfile();
  const override = profile.overrides?.[slideType as keyof typeof profile.overrides];
  
  return {
    ...profile.logos.primary,
    ...override,
  };
}

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
  console.log(`🔍 DEBUG shouldApplyBranding: slideType="${slideType}", isTitle=${isTitle}`);
  
  if (!isBrandingConfigured()) {
    console.log('🔍 DEBUG: Branding NOT configured (no logo or not visible)');
    return false;
  }
  
  const profile = getBrandProfile();
  const config = profile.logos.primary;
  
  console.log('🔍 DEBUG: Logo config:', {
    assetId: config.assetId,
    visible: config.visible,
    useOn: config.useOn,
    excludeFromTitleSlides: config.excludeFromTitleSlides
  });
  
  // Check if excluded from title slides
  if (isTitle && config.excludeFromTitleSlides) {
    console.log('🔍 DEBUG: Excluded because this is a title slide');
    return false;
  }
  
  // Check if this slide type is in the useOn list
  const shouldApply = config.useOn.includes(slideType) || config.useOn.includes('all');
  console.log(`🔍 DEBUG: Should apply? ${shouldApply}`);
  return shouldApply;
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
  console.log(`🔍 DEBUG getLogoForBackground: backgroundIsDark=${backgroundIsDark}`);
  
  const profile = getBrandProfile();
  
  console.log('🔍 DEBUG: Primary logo assetId:', profile.logos.primary.assetId);
  
  if (!profile.logos.primary.assetId) {
    console.error('❌ No primary logo assetId configured');
    return null;
  }
  
  // Try appropriate version first
  if (backgroundIsDark && profile.logos.whiteVersion?.assetId) {
    console.log('🔍 DEBUG: Trying white version for dark background, assetId:', profile.logos.whiteVersion.assetId);
    const asset = getBrandAssetById(profile.logos.whiteVersion.assetId);
    if (asset) {
      console.log('🎨 Using white logo for dark background');
      return asset.dataUrl;
    } else {
      console.log('⚠️ White logo asset not found in storage');
    }
  }
  
  if (!backgroundIsDark && profile.logos.colorVersion?.assetId) {
    console.log('🔍 DEBUG: Trying color version for light background, assetId:', profile.logos.colorVersion.assetId);
    const asset = getBrandAssetById(profile.logos.colorVersion.assetId);
    if (asset) {
      console.log('🎨 Using color logo for light background');
      return asset.dataUrl;
    } else {
      console.log('⚠️ Color logo asset not found in storage');
    }
  }
  
  // Fallback to primary logo
  console.log('🔍 DEBUG: Using primary logo fallback, assetId:', profile.logos.primary.assetId);
  const primaryAsset = getBrandAssetById(profile.logos.primary.assetId);
  if (primaryAsset) {
    console.log('🎨 Using primary logo');
    console.log('🔍 DEBUG: Primary logo found, dataUrl length:', primaryAsset.dataUrl?.length || 0);
    return primaryAsset.dataUrl;
  }
  
  console.error('❌ Primary logo asset not found in storage!');
  console.error('🔍 DEBUG: Attempted to retrieve assetId:', profile.logos.primary.assetId);
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
  console.log(`🔍 DEBUG createLogoElement: backgroundIsDark=${backgroundIsDark}`);
  
  const profile = getBrandProfile();
  const logoConfig = { ...profile.logos.primary, ...config };
  
  console.log('🔍 DEBUG: Logo config:', {
    placement: logoConfig.placement,
    size: logoConfig.size,
    opacity: logoConfig.opacity,
    assetId: logoConfig.assetId
  });
  
  const logoDataUrl = getLogoForBackground(backgroundIsDark);
  console.log('🔍 DEBUG: Logo data URL retrieved:', logoDataUrl ? `YES (${logoDataUrl.substring(0, 50)}...)` : 'NO (null)');
  
  if (!logoDataUrl) {
    console.error('❌ No logo data URL - cannot create logo element');
    return null;
  }
  
  const size = getLogoSize(logoConfig.size);
  const position = getLogoPosition(logoConfig.placement, size);
  
  console.log('🔍 DEBUG: Logo element properties:', { position, size, opacity: logoConfig.opacity });
  
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
  console.log(`🔍 DEBUG applyBrandingToSlide: slideType="${slideType}", isTitle=${isTitle}`);
  
  if (!shouldApplyBranding(slideType, isTitle)) {
    console.log('🔍 DEBUG: shouldApplyBranding returned false, skipping branding');
    return visualData;
  }
  
  console.log('🔍 DEBUG: Branding approved, proceeding...');
  
  // Remove existing branding first (prevent duplicates)
  visualData = removeBrandingFromSlide(visualData);
  
  // Detect background brightness
  const backgroundIsDark = isBackgroundDark(visualData.background);
  console.log(`🔍 DEBUG: Background is ${backgroundIsDark ? 'dark' : 'light'}`);
  
  // Create logo element
  const logoElement = createLogoElement(backgroundIsDark);
  console.log('🔍 DEBUG: Logo element created:', logoElement ? 'SUCCESS' : 'FAILED (null)');
  
  if (logoElement) {
    visualData.elements.push(logoElement);
    console.log('✨ Added brand logo to slide');
    console.log('🔍 DEBUG: Logo element details:', {
      id: logoElement.id,
      type: logoElement.type,
      position: logoElement.position,
      size: logoElement.size,
      opacity: logoElement.opacity,
      hasContent: !!logoElement.content
    });
  } else {
    console.error('❌ Failed to create logo element');
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

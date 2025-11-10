/**
 * Brand Profile System
 * 
 * Central configuration for church branding across all presentation types
 */

export type LogoPlacement = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center-bottom';
export type LogoSize = 'small' | 'medium' | 'large';
export type SlideType = 'songs' | 'sermons' | 'announcements' | 'scripture' | 'all';

export interface LogoConfiguration {
  assetId: string;                  // Links to BrandAsset ID
  useOn: SlideType[];               // Which slide types to apply to
  placement: LogoPlacement;         // Position on slide
  size: LogoSize;                   // Small=100px, Medium=150px, Large=200px
  opacity: number;                  // 0.0 to 1.0
  visible: boolean;                 // Master on/off switch
  excludeFromTitleSlides?: boolean; // Don't show on title slides
}

export interface AlternativeLogo {
  assetId: string;
  useWhen: 'dark-backgrounds' | 'light-backgrounds';
}

export interface WatermarkConfiguration {
  assetId: string;
  opacity: number;
  useOn: SlideType[];
  placement: LogoPlacement;
  size: LogoSize;
}

export interface BrandProfile {
  // Church Identity
  churchName: string;
  
  // Logo Configuration
  logos: {
    primary: LogoConfiguration;
    whiteVersion?: AlternativeLogo;      // For dark backgrounds
    colorVersion?: AlternativeLogo;      // For light backgrounds
    watermark?: WatermarkConfiguration;  // Subtle watermark option
  };
  
  // Auto-Apply Rules
  autoApply: {
    toNewSongs: boolean;
    toNewSermons: boolean;
    toNewAnnouncements: boolean;
    toNewScripture: boolean;
  };
  
  // Per-Type Overrides
  overrides?: {
    songs?: Partial<LogoConfiguration>;
    sermons?: Partial<LogoConfiguration>;
    announcements?: Partial<LogoConfiguration>;
    scripture?: Partial<LogoConfiguration>;
  };
  
  // Metadata
  createdAt?: number;
  updatedAt?: number;
}

export const DEFAULT_BRAND_PROFILE: BrandProfile = {
  churchName: '',
  logos: {
    primary: {
      assetId: '',
      useOn: ['all'],
      placement: 'bottom-right',
      size: 'medium',
      opacity: 0.8,
      visible: false, // Off by default until configured
      excludeFromTitleSlides: false,
    },
  },
  autoApply: {
    toNewSongs: true,
    toNewSermons: true,
    toNewAnnouncements: false,
    toNewScripture: false,
  },
};

export interface BrandProfileStats {
  isConfigured: boolean;
  hasPrimaryLogo: boolean;
  hasAlternativeLogos: boolean;
  totalAppliedSlides: number;
  autoApplyEnabled: boolean;
}

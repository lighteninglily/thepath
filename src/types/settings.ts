/**
 * Application settings types
 */

export type BlankScreenMode = 'black' | 'logo' | 'custom';
export type TransitionType = 'none' | 'fade' | 'slide';

export interface BlankScreenSettings {
  mode: BlankScreenMode;
  logoUrl?: string;
  backgroundColor?: string;
  customSlideId?: string;
}

export interface PresentationSettings {
  blankScreen: BlankScreenSettings;
  transitionType: TransitionType;
  transitionDuration: number; // in milliseconds
  defaultTargetDuration?: number; // in seconds
  autoSelectExternalDisplay: boolean;
}

export interface AppSettings {
  presentation: PresentationSettings;
  // Future: other settings categories
}

// Default settings
export const DEFAULT_SETTINGS: AppSettings = {
  presentation: {
    blankScreen: {
      mode: 'black',
      backgroundColor: '#000000',
    },
    transitionType: 'fade',
    transitionDuration: 300,
    autoSelectExternalDisplay: true,
  },
};

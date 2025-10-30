// Application constants

export const APP_NAME = 'The Path';
export const APP_VERSION = '1.0.0';

export const DEFAULT_KEYBOARD_SHORTCUTS = {
  nextSlide: 'Space',
  previousSlide: 'Backspace',
  exitPresentation: 'Escape',
  blankScreen: 'b',
  gotoSlide: 'g',
};

export const DEFAULT_SETTINGS = {
  churchName: 'The Way',
  primaryColor: '#A8C5DD',
  secondaryColor: '#C9B8A8',
  defaultPresentationDisplay: 1,
  keyboardShortcuts: DEFAULT_KEYBOARD_SHORTCUTS,
  autoSaveInterval: 30000, // 30 seconds
};

export const MAX_LINES_PER_SLIDE = 8;
export const MIN_LINES_PER_SLIDE = 4;

export const SLIDE_TYPES = {
  VERSE: 'verse',
  CHORUS: 'chorus',
  BRIDGE: 'bridge',
  CUSTOM: 'custom',
} as const;

export const ROUTES = {
  LIBRARY: 'library',
  PLANNER: 'planner',
  SETTINGS: 'settings',
  PRESENTATION: 'presentation',
} as const;

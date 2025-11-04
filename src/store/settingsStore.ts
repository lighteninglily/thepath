import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppSettings, BlankScreenMode, TransitionType } from '../types/settings';
import { DEFAULT_SETTINGS } from '../types/settings';

interface SettingsState extends AppSettings {
  // Actions
  setBlankScreenMode: (mode: BlankScreenMode) => void;
  setBlankScreenLogo: (logoUrl: string) => void;
  setBlankScreenBackground: (color: string) => void;
  setTransitionType: (type: TransitionType) => void;
  setTransitionDuration: (duration: number) => void;
  setDefaultTargetDuration: (duration: number | undefined) => void;
  setAutoSelectExternalDisplay: (enabled: boolean) => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // Initial state from defaults
      ...DEFAULT_SETTINGS,

      // Actions
      setBlankScreenMode: (mode) =>
        set((state) => ({
          presentation: {
            ...state.presentation,
            blankScreen: {
              ...state.presentation.blankScreen,
              mode,
            },
          },
        })),

      setBlankScreenLogo: (logoUrl) =>
        set((state) => ({
          presentation: {
            ...state.presentation,
            blankScreen: {
              ...state.presentation.blankScreen,
              logoUrl,
            },
          },
        })),

      setBlankScreenBackground: (backgroundColor) =>
        set((state) => ({
          presentation: {
            ...state.presentation,
            blankScreen: {
              ...state.presentation.blankScreen,
              backgroundColor,
            },
          },
        })),

      setTransitionType: (transitionType) =>
        set((state) => ({
          presentation: {
            ...state.presentation,
            transitionType,
          },
        })),

      setTransitionDuration: (transitionDuration) =>
        set((state) => ({
          presentation: {
            ...state.presentation,
            transitionDuration,
          },
        })),

      setDefaultTargetDuration: (defaultTargetDuration) =>
        set((state) => ({
          presentation: {
            ...state.presentation,
            defaultTargetDuration,
          },
        })),

      setAutoSelectExternalDisplay: (autoSelectExternalDisplay) =>
        set((state) => ({
          presentation: {
            ...state.presentation,
            autoSelectExternalDisplay,
          },
        })),

      resetSettings: () => set(DEFAULT_SETTINGS),
    }),
    {
      name: 'app-settings-storage',
      version: 1,
    }
  )
);

/// <reference types="vite/client" />

import { ElectronAPI } from '../electron/types';

// Declare window.electron for Electron preload bridge
declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

// Declare module types for image imports
declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '*.jpeg' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  const value: string;
  export default value;
}

declare module '*.gif' {
  const value: string;
  export default value;
}

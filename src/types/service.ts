/**
 * Service Planner Types - Complete system for planning worship services
 */

export type ServiceItemType = 
  | 'song'           // Worship song with lyrics
  | 'scripture'      // Bible verse/passage
  | 'welcome'        // Welcome/logo slide
  | 'announcement'   // Announcement slide
  | 'sermon'         // Sermon title slide
  | 'sermon-slides'  // AI-generated sermon slides from notes
  | 'offering'       // Offering slide
  | 'closing'        // Closing slide
  | 'blank'          // Blank/transition slide
  | 'custom';        // Custom text slide

export interface ServiceItem {
  id: string;
  type: ServiceItemType;
  order: number;
  duration?: number; // Estimated minutes
  
  // Song-specific
  songId?: string;
  songTitle?: string;
  
  // Scripture-specific
  scriptureReference?: string; // e.g., "John 3:16-17"
  scriptureText?: string;
  scriptureVersion?: string; // e.g., "NIV", "ESV", "KJV"
  
  // Text-based slides
  title?: string;
  content?: string;
  backgroundId?: string;
  textColor?: 'light' | 'dark';
  
  // Metadata
  notes?: string; // Presenter notes
  skipInPresentation?: boolean;
}

export interface Service {
  id: string;
  name: string;
  date: string;
  items: ServiceItem[];
  
  // Church branding
  churchName?: string;
  churchLogo?: string; // URL or data URI
  
  // Settings
  defaultBackgroundId?: string;
  theme?: 'light' | 'dark';
  
  // Metadata
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceInput {
  name: string;
  date: string;
  churchName?: string;
  churchLogo?: string;
}

export interface BibleVerse {
  reference: string;
  text: string;
  version: string;
  book: string;
  chapter: number;
  verse: number;
}

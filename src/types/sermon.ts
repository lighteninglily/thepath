// Sermon-specific type definitions

export interface SermonSubPoint {
  id: string;
  content: string;
  order: number;
  scripture?: string; // Optional supporting verse
}

export interface SermonPoint {
  id: string;
  number: number;
  title: string;           // Main point title
  description?: string;    // Optional summary
  subPoints: SermonSubPoint[];  // Array of sub-points
  scripture?: string;      // Main scripture for this point
}

export interface SermonAnalysis {
  title?: string;
  mainScripture?: string;
  theme?: string;
  scriptures: ScriptureReference[];
  mainPoints: SermonPoint[];
  introduction?: string;
  conclusion?: string;
}

export interface ScriptureReference {
  reference: string;      // "John 3:16-17"
  book: string;           // "John"
  chapter: number;        // 3
  startVerse: number;     // 16
  endVerse?: number;      // 17 (optional)
  context?: string;       // Text around the reference
}

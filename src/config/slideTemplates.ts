/**
 * SLIDE TEMPLATES SYSTEM
 * Based on the beautiful designs in src/assets/*.jpg
 * Fully editable in visual editor
 */

export interface SlideTemplate {
  id: string;
  name: string;
  category: 'sermon' | 'announcement' | 'scripture' | 'welcome' | 'closing' | 'offering' | 'generic';
  thumbnail: string; // Path to preview image
  description: string;
  visualData: {
    elements: Array<{
      id: string;
      type: 'text' | 'image' | 'shape';
      content?: string;
      position: { x: number; y: number };
      size: { width: number; height: number };
      fontSize?: number;
      fontFamily?: string;
      fontWeight?: number;
      fontStyle?: string;
      color?: string;
      textAlign?: 'left' | 'center' | 'right';
      zIndex?: number;
      opacity?: number;
      backgroundColor?: string;
      borderRadius?: number;
      rotation?: number;
    }>;
    backgroundType?: 'color' | 'image' | 'gradient';
    backgroundColor?: string;
    backgroundImage?: string;
    backgroundGradient?: string;
  };
}

// ===== SERMON TEMPLATES =====

export const SERMON_TEMPLATES: SlideTemplate[] = [
  {
    id: 'sermon-title-1',
    name: 'Elegant Script Title',
    category: 'sermon',
    thumbnail: '/src/assets/1.jpg',
    description: 'Large script title with church logo and date',
    visualData: {
      backgroundImage: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1920&q=80',
      elements: [
        // Church Logo (top left)
        {
          id: 'logo',
          type: 'text',
          content: '🏛️ Your Church',
          position: { x: 40, y: 40 },
          size: { width: 300, height: 60 },
          fontSize: 24,
          fontFamily: 'Outfit',
          fontWeight: 600,
          color: '#FFFFFF',
          textAlign: 'left',
          zIndex: 10,
        },
        // Event Type (top right)
        {
          id: 'event-type',
          type: 'text',
          content: 'Sunday Sermon',
          position: { x: 1520, y: 40 },
          size: { width: 360, height: 60 },
          fontSize: 24,
          fontFamily: 'Outfit',
          color: '#FFFFFF',
          textAlign: 'right',
          zIndex: 10,
        },
        // Main Title (script font)
        {
          id: 'main-title',
          type: 'text',
          content: 'Grace',
          position: { x: 200, y: 200 },
          size: { width: 1520, height: 300 },
          fontSize: 180,
          fontFamily: 'Pacifico',
          color: '#FFFFFF',
          textAlign: 'center',
          zIndex: 10,
        },
        // Subtitle
        {
          id: 'subtitle',
          type: 'text',
          content: 'That Transforms',
          position: { x: 200, y: 480 },
          size: { width: 1520, height: 100 },
          fontSize: 64,
          fontFamily: 'Outfit',
          fontWeight: 300,
          color: '#FFFFFF',
          textAlign: 'center',
          zIndex: 10,
        },
        // Speaker Name (bottom left)
        {
          id: 'speaker',
          type: 'text',
          content: 'Pastor Name',
          position: { x: 40, y: 1000 },
          size: { width: 400, height: 40 },
          fontSize: 24,
          fontFamily: 'Outfit',
          fontWeight: 600,
          color: '#FFFFFF',
          textAlign: 'left',
          zIndex: 10,
        },
        // Date (bottom right)
        {
          id: 'date',
          type: 'text',
          content: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          position: { x: 1480, y: 1000 },
          size: { width: 400, height: 40 },
          fontSize: 24,
          fontFamily: 'Outfit',
          color: '#FFFFFF',
          textAlign: 'right',
          zIndex: 10,
        },
      ],
    },
  },

  {
    id: 'sermon-title-2',
    name: 'Clean Title on Dark',
    category: 'sermon',
    thumbnail: '/src/assets/9.jpg',
    description: 'Script title centered on dramatic background',
    visualData: {
      backgroundImage: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1920&q=80',
      elements: [
        // "God's Grace" (small header)
        {
          id: 'header',
          type: 'text',
          content: "God's Grace",
          position: { x: 200, y: 180 },
          size: { width: 1520, height: 60 },
          fontSize: 48,
          fontFamily: 'Outfit',
          fontWeight: 400,
          color: '#FFFFFF',
          textAlign: 'center',
          zIndex: 10,
        },
        // Main Title (script)
        {
          id: 'main-title',
          type: 'text',
          content: 'Empowers',
          position: { x: 200, y: 260 },
          size: { width: 1520, height: 280 },
          fontSize: 160,
          fontFamily: 'Pacifico',
          color: '#FFFFFF',
          textAlign: 'center',
          zIndex: 10,
        },
      ],
    },
  },

  {
    id: 'sermon-title-3',
    name: 'Light Background Title',
    category: 'sermon',
    thumbnail: '/src/assets/15.jpg',
    description: 'Thank You / Closing slide with elegant script',
    visualData: {
      backgroundColor: '#2A2A2A',
      backgroundImage: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1920&q=80',
      elements: [
        // Main Title (script)
        {
          id: 'main-title',
          type: 'text',
          content: 'Thank You',
          position: { x: 200, y: 280 },
          size: { width: 1520, height: 280 },
          fontSize: 160,
          fontFamily: 'Pacifico',
          color: '#FFFFFF',
          textAlign: 'center',
          zIndex: 10,
        },
        // Subtitle
        {
          id: 'subtitle',
          type: 'text',
          content: "Let's Pray",
          position: { x: 200, y: 540 },
          size: { width: 1520, height: 100 },
          fontSize: 56,
          fontFamily: 'Outfit',
          fontWeight: 300,
          color: '#FFFFFF',
          textAlign: 'center',
          zIndex: 10,
        },
      ],
    },
  },
];

// ===== ANNOUNCEMENT TEMPLATES =====
// Based on assets folder JPEGs - Modern, Dramatic, Nature themes

export const ANNOUNCEMENT_TEMPLATES: SlideTemplate[] = [
  // BB Series - Modern Worship Backgrounds
  {
    id: 'announcement-bb-1',
    name: 'Modern Worship 1',
    category: 'announcement',
    thumbnail: '/src/assets/bb (1).jpg',
    description: 'Clean modern design with worship background',
    visualData: {
      backgroundImage: '/src/assets/bb (1).jpg',
      elements: [
        {
          id: 'title',
          type: 'text',
          content: 'Announcement Title',
          position: { x: 260, y: 400 },
          size: { width: 1400, height: 200 },
          fontSize: 80,
          fontWeight: 700,
          color: '#FFFFFF',
          textAlign: 'center',
          zIndex: 10,
        },
        {
          id: 'subtitle',
          type: 'text',
          content: 'Details go here',
          position: { x: 360, y: 650 },
          size: { width: 1200, height: 100 },
          fontSize: 40,
          fontWeight: 400,
          color: '#FFFFFF',
          textAlign: 'center',
          zIndex: 10,
        },
      ],
    },
  },
  {
    id: 'announcement-bb-2',
    name: 'Modern Worship 2',
    category: 'announcement',
    thumbnail: '/src/assets/bb (2).jpg',
    description: 'Bold modern worship slide',
    visualData: {
      backgroundImage: '/src/assets/bb (2).jpg',
      elements: [
        {
          id: 'title',
          type: 'text',
          content: 'ANNOUNCEMENT',
          position: { x: 260, y: 450 },
          size: { width: 1400, height: 180 },
          fontSize: 80,
          fontWeight: 800,
          color: '#FFFFFF',
          textAlign: 'center',
          zIndex: 10,
        },
      ],
    },
  },
  {
    id: 'announcement-bb-3',
    name: 'Modern Worship 3',
    category: 'announcement',
    thumbnail: '/src/assets/bb (3).jpg',
    description: 'Large title modern design',
    visualData: {
      backgroundImage: '/src/assets/bb (3).jpg',
      elements: [
        {
          id: 'title',
          type: 'text',
          content: 'Your Title Here',
          position: { x: 160, y: 540 },
          size: { width: 1600, height: 200 },
          fontSize: 90,
          fontWeight: 800,
          color: '#FFFFFF',
          textAlign: 'center',
          zIndex: 10,
        },
      ],
    },
  },
  {
    id: 'announcement-bb-4',
    name: 'Modern Worship 4',
    category: 'announcement',
    thumbnail: '/src/assets/bb (4).jpg',
    description: 'Centered modern announcement',
    visualData: {
      backgroundImage: '/src/assets/bb (4).jpg',
      elements: [
        {
          id: 'title',
          type: 'text',
          content: 'Announcement',
          position: { x: 260, y: 500 },
          size: { width: 1400, height: 180 },
          fontSize: 80,
          fontWeight: 700,
          color: '#FFFFFF',
          textAlign: 'center',
          zIndex: 10,
        },
      ],
    },
  },
  {
    id: 'announcement-bb-5',
    name: 'Modern Worship 5',
    category: 'announcement',
    thumbnail: '/src/assets/bb (5).jpg',
    description: 'Professional modern look',
    visualData: {
      backgroundImage: '/src/assets/bb (5).jpg',
      elements: [
        {
          id: 'title',
          type: 'text',
          content: 'Your Message',
          position: { x: 210, y: 540 },
          size: { width: 1500, height: 200 },
          fontSize: 85,
          fontWeight: 700,
          color: '#FFFFFF',
          textAlign: 'center',
          zIndex: 10,
        },
      ],
    },
  },
  
  // B&W Series - Dramatic Black & White
  {
    id: 'announcement-bw-1',
    name: 'Dramatic B&W 1',
    category: 'announcement',
    thumbnail: '/src/assets/11 -bw (1).jpg',
    description: 'High-impact black and white design',
    visualData: {
      backgroundImage: '/src/assets/11 -bw (1).jpg',
      elements: [
        {
          id: 'title',
          type: 'text',
          content: 'BOLD STATEMENT',
          position: { x: 160, y: 500 },
          size: { width: 1600, height: 200 },
          fontSize: 90,
          fontWeight: 900,
          color: '#FFFFFF',
          textAlign: 'center',
          zIndex: 10,
        },
      ],
    },
  },
  {
    id: 'announcement-bw-2',
    name: 'Dramatic B&W 2',
    category: 'announcement',
    thumbnail: '/src/assets/11 -bw (2).jpg',
    description: 'Powerful monochrome slide',
    visualData: {
      backgroundImage: '/src/assets/11 -bw (2).jpg',
      elements: [
        {
          id: 'title',
          type: 'text',
          content: 'IMPORTANT MESSAGE',
          position: { x: 210, y: 540 },
          size: { width: 1500, height: 180 },
          fontSize: 80,
          fontWeight: 800,
          color: '#FFFFFF',
          textAlign: 'center',
          zIndex: 10,
        },
      ],
    },
  },
  {
    id: 'announcement-bw-3',
    name: 'Dramatic B&W 3',
    category: 'announcement',
    thumbnail: '/src/assets/11 -bw (3).jpg',
    description: 'Strong dramatic impact',
    visualData: {
      backgroundImage: '/src/assets/11 -bw (3).jpg',
      elements: [
        {
          id: 'title',
          type: 'text',
          content: 'Announcement',
          position: { x: 260, y: 500 },
          size: { width: 1400, height: 200 },
          fontSize: 85,
          fontWeight: 700,
          color: '#FFFFFF',
          textAlign: 'center',
          zIndex: 10,
        },
      ],
    },
  },
  
  // RP Series - Nature/Worship Scenes
  {
    id: 'announcement-rp-1',
    name: 'Nature Scene 1',
    category: 'announcement',
    thumbnail: '/src/assets/Rp (1).jpg',
    description: 'Peaceful nature background',
    visualData: {
      backgroundImage: '/src/assets/Rp (1).jpg',
      elements: [
        {
          id: 'title',
          type: 'text',
          content: 'Announcement',
          position: { x: 260, y: 480 },
          size: { width: 1400, height: 180 },
          fontSize: 75,
          fontWeight: 700,
          color: '#FFFFFF',
          textAlign: 'center',
          zIndex: 10,
        },
      ],
    },
  },
  {
    id: 'announcement-rp-2',
    name: 'Nature Scene 2',
    category: 'announcement',
    thumbnail: '/src/assets/Rp (2).jpg',
    description: 'Serene worship setting',
    visualData: {
      backgroundImage: '/src/assets/Rp (2).jpg',
      elements: [
        {
          id: 'title',
          type: 'text',
          content: 'Your Title',
          position: { x: 210, y: 520 },
          size: { width: 1500, height: 200 },
          fontSize: 80,
          fontWeight: 700,
          color: '#FFFFFF',
          textAlign: 'center',
          zIndex: 10,
        },
      ],
    },
  },
  {
    id: 'announcement-rp-3',
    name: 'Nature Scene 3',
    category: 'announcement',
    thumbnail: '/src/assets/Rp (3).jpg',
    description: 'Beautiful outdoor worship',
    visualData: {
      backgroundImage: '/src/assets/Rp (3).jpg',
      elements: [
        {
          id: 'title',
          type: 'text',
          content: 'Message Here',
          position: { x: 160, y: 500 },
          size: { width: 1600, height: 200 },
          fontSize: 85,
          fontWeight: 700,
          color: '#FFFFFF',
          textAlign: 'center',
          zIndex: 10,
        },
      ],
    },
  },
  
  // Keep original Key Points Grid template

  {
    id: 'announcement-cards-1',
    name: 'Key Points Grid',
    category: 'announcement',
    thumbnail: '/src/assets/5.jpg',
    description: '6-card grid for multiple announcements',
    visualData: {
      backgroundColor: '#E8E3DC',
      elements: [
        // Title
        {
          id: 'title',
          type: 'text',
          content: 'Key Takeaways',
          position: { x: 200, y: 100 },
          size: { width: 1520, height: 100 },
          fontSize: 72,
          fontFamily: 'Pacifico',
          fontStyle: 'italic',
          color: '#2A2A2A',
          textAlign: 'center',
          zIndex: 10,
        },
        // Subtitle
        {
          id: 'subtitle',
          type: 'text',
          content: 'What should we do to focus on our faith to God',
          position: { x: 200, y: 200 },
          size: { width: 1520, height: 50 },
          fontSize: 24,
          fontFamily: 'Outfit',
          color: '#666666',
          textAlign: 'center',
          zIndex: 10,
        },
        // Card 1
        {
          id: 'card-1',
          type: 'shape',
          position: { x: 80, y: 320 },
          size: { width: 540, height: 160 },
          backgroundColor: '#F5F5F5',
          borderRadius: 16,
          zIndex: 5,
        },
        {
          id: 'card-1-text',
          type: 'text',
          content: 'What is grace?',
          position: { x: 120, y: 370 },
          size: { width: 460, height: 60 },
          fontSize: 32,
          fontFamily: 'Outfit',
          fontWeight: 600,
          color: '#2A2A2A',
          textAlign: 'center',
          zIndex: 10,
        },
        // Card 2
        {
          id: 'card-2',
          type: 'shape',
          position: { x: 690, y: 320 },
          size: { width: 540, height: 160 },
          backgroundColor: '#F5F5F5',
          borderRadius: 16,
          zIndex: 5,
        },
        {
          id: 'card-2-text',
          type: 'text',
          content: 'Grace Forgives',
          position: { x: 730, y: 370 },
          size: { width: 460, height: 60 },
          fontSize: 32,
          fontFamily: 'Outfit',
          fontWeight: 600,
          color: '#2A2A2A',
          textAlign: 'center',
          zIndex: 10,
        },
        // Card 3
        {
          id: 'card-3',
          type: 'shape',
          position: { x: 1300, y: 320 },
          size: { width: 540, height: 160 },
          backgroundColor: '#F5F5F5',
          borderRadius: 16,
          zIndex: 5,
        },
        {
          id: 'card-3-text',
          type: 'text',
          content: 'Grace Heals',
          position: { x: 1340, y: 370 },
          size: { width: 460, height: 60 },
          fontSize: 32,
          fontFamily: 'Outfit',
          fontWeight: 600,
          color: '#2A2A2A',
          textAlign: 'center',
          zIndex: 10,
        },
        // Card 4
        {
          id: 'card-4',
          type: 'shape',
          position: { x: 80, y: 540 },
          size: { width: 540, height: 160 },
          backgroundColor: '#F5F5F5',
          borderRadius: 16,
          zIndex: 5,
        },
        {
          id: 'card-4-text',
          type: 'text',
          content: 'Grace Empowers',
          position: { x: 120, y: 590 },
          size: { width: 460, height: 60 },
          fontSize: 32,
          fontFamily: 'Outfit',
          fontWeight: 600,
          color: '#2A2A2A',
          textAlign: 'center',
          zIndex: 10,
        },
        // Card 5
        {
          id: 'card-5',
          type: 'shape',
          position: { x: 690, y: 540 },
          size: { width: 540, height: 160 },
          backgroundColor: '#F5F5F5',
          borderRadius: 16,
          zIndex: 5,
        },
        {
          id: 'card-5-text',
          type: 'text',
          content: 'Grace Is a Gift',
          position: { x: 730, y: 590 },
          size: { width: 460, height: 60 },
          fontSize: 32,
          fontFamily: 'Outfit',
          fontWeight: 600,
          color: '#2A2A2A',
          textAlign: 'center',
          zIndex: 10,
        },
        // Card 6
        {
          id: 'card-6',
          type: 'shape',
          position: { x: 1300, y: 540 },
          size: { width: 540, height: 160 },
          backgroundColor: '#F5F5F5',
          borderRadius: 16,
          zIndex: 5,
        },
        {
          id: 'card-6-text',
          type: 'text',
          content: 'Reflection',
          position: { x: 1340, y: 590 },
          size: { width: 460, height: 60 },
          fontSize: 32,
          fontFamily: 'Outfit',
          fontWeight: 600,
          color: '#2A2A2A',
          textAlign: 'center',
          zIndex: 10,
        },
      ],
    },
  },

  {
    id: 'announcement-simple-1',
    name: 'Large Question',
    category: 'announcement',
    thumbnail: '/src/assets/3.jpg',
    description: 'Dramatic framed question slide with beautiful background',
    visualData: {
      backgroundImage: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1920&q=80',
      backgroundColor: '#3A3A3A',
      elements: [
        // White/cream frame card (the beautiful border)
        {
          id: 'frame-card',
          type: 'shape',
          position: { x: 100, y: 100 },
          size: { width: 1720, height: 880 },
          backgroundColor: '#F5F3EF',
          borderRadius: 0,
          zIndex: 1,
        },
        // Small header at top
        {
          id: 'header',
          type: 'text',
          content: 'Q U E S T I O N',
          position: { x: 460, y: 150 },
          size: { width: 1000, height: 50 },
          fontSize: 22,
          fontFamily: 'Outfit',
          fontWeight: 400,
          color: '#2A2A2A',
          textAlign: 'center',
          zIndex: 10,
        },
        // Main question "What is" (regular font, light weight)
        {
          id: 'question-1',
          type: 'text',
          content: 'What is',
          position: { x: 460, y: 260 },
          size: { width: 1000, height: 100 },
          fontSize: 90,
          fontFamily: 'Outfit',
          fontWeight: 300,
          color: '#2A2A2A',
          textAlign: 'center',
          zIndex: 10,
        },
        // Script word "Grace" (HUGE, script font - the star of the show!)
        {
          id: 'question-2',
          type: 'text',
          content: 'grace',
          position: { x: 280, y: 340 },
          size: { width: 1000, height: 280 },
          fontSize: 220,
          fontFamily: 'Pacifico',
          color: '#2A2A2A',
          textAlign: 'left',
          zIndex: 10,
        },
        // Question mark (huge, right of grace)
        {
          id: 'question-mark',
          type: 'text',
          content: '?',
          position: { x: 1280, y: 340 },
          size: { width: 180, height: 280 },
          fontSize: 220,
          fontFamily: 'Outfit',
          fontWeight: 300,
          color: '#2A2A2A',
          textAlign: 'left',
          zIndex: 10,
        },
        // Dot at bottom center (decorative)
        {
          id: 'dot',
          type: 'text',
          content: '•',
          position: { x: 920, y: 680 },
          size: { width: 80, height: 80 },
          fontSize: 60,
          fontFamily: 'Outfit',
          fontWeight: 700,
          color: '#2A2A2A',
          textAlign: 'center',
          zIndex: 10,
        },
      ],
    },
  },

  {
    id: 'announcement-3-column',
    name: 'Three Steps',
    category: 'announcement',
    thumbnail: '/src/assets/14.jpg',
    description: 'Three-column call to action',
    visualData: {
      backgroundColor: '#E8E3DC',
      elements: [
        // Title
        {
          id: 'title',
          type: 'text',
          content: 'Call To Action',
          position: { x: 200, y: 100 },
          size: { width: 1520, height: 80 },
          fontSize: 56,
          fontFamily: 'Pacifico',
          fontStyle: 'italic',
          color: '#2A2A2A',
          textAlign: 'center',
          zIndex: 10,
        },
        // Column 1 Number
        {
          id: 'step-1-num',
          type: 'text',
          content: '01.',
          position: { x: 100, y: 260 },
          size: { width: 560, height: 120 },
          fontSize: 96,
          fontFamily: 'Outfit',
          fontWeight: 300,
          fontStyle: 'italic',
          color: '#2A2A2A',
          textAlign: 'center',
          zIndex: 10,
        },
        // Column 1 Title
        {
          id: 'step-1-title',
          type: 'text',
          content: "Receive God's\ngrace today",
          position: { x: 100, y: 380 },
          size: { width: 560, height: 140 },
          fontSize: 42,
          fontFamily: 'Pacifico',
          fontStyle: 'italic',
          color: '#2A2A2A',
          textAlign: 'center',
          zIndex: 10,
        },
        // Column 1 Body
        {
          id: 'step-1-body',
          type: 'text',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer euismod auctor magna vitae consequat.',
          position: { x: 120, y: 540 },
          size: { width: 520, height: 140 },
          fontSize: 20,
          fontFamily: 'Outfit',
          color: '#666666',
          textAlign: 'center',
          zIndex: 10,
        },
        // Column 2 Number
        {
          id: 'step-2-num',
          type: 'text',
          content: '02.',
          position: { x: 680, y: 260 },
          size: { width: 560, height: 120 },
          fontSize: 96,
          fontFamily: 'Outfit',
          fontWeight: 300,
          fontStyle: 'italic',
          color: '#2A2A2A',
          textAlign: 'center',
          zIndex: 10,
        },
        // Column 2 Title
        {
          id: 'step-2-title',
          type: 'text',
          content: 'Lay down your\nstriving',
          position: { x: 680, y: 380 },
          size: { width: 560, height: 140 },
          fontSize: 42,
          fontFamily: 'Pacifico',
          fontStyle: 'italic',
          color: '#2A2A2A',
          textAlign: 'center',
          zIndex: 10,
        },
        // Column 2 Body
        {
          id: 'step-2-body',
          type: 'text',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer euismod auctor magna vitae consequat.',
          position: { x: 700, y: 540 },
          size: { width: 520, height: 140 },
          fontSize: 20,
          fontFamily: 'Outfit',
          color: '#666666',
          textAlign: 'center',
          zIndex: 10,
        },
        // Column 3 Number
        {
          id: 'step-3-num',
          type: 'text',
          content: '03.',
          position: { x: 1260, y: 260 },
          size: { width: 560, height: 120 },
          fontSize: 96,
          fontFamily: 'Outfit',
          fontWeight: 300,
          fontStyle: 'italic',
          color: '#2A2A2A',
          textAlign: 'center',
          zIndex: 10,
        },
        // Column 3 Title
        {
          id: 'step-3-title',
          type: 'text',
          content: 'Accept\nthe gift.',
          position: { x: 1260, y: 380 },
          size: { width: 560, height: 140 },
          fontSize: 42,
          fontFamily: 'Pacifico',
          fontStyle: 'italic',
          color: '#2A2A2A',
          textAlign: 'center',
          zIndex: 10,
        },
        // Column 3 Body
        {
          id: 'step-3-body',
          type: 'text',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer euismod auctor magna vitae consequat.',
          position: { x: 1280, y: 540 },
          size: { width: 520, height: 140 },
          fontSize: 20,
          fontFamily: 'Outfit',
          color: '#666666',
          textAlign: 'center',
          zIndex: 10,
        },
      ],
    },
  },
];

// ===== SCRIPTURE TEMPLATES =====

export const SCRIPTURE_TEMPLATES: SlideTemplate[] = [
  {
    id: 'scripture-split-1',
    name: 'Split Screen with Cross',
    category: 'scripture',
    thumbnail: '/src/assets/2.jpg',
    description: 'Left: cross image, Right: numbered points',
    visualData: {
      backgroundColor: '#E8E3DC',
      elements: [
        // Title
        {
          id: 'title',
          type: 'text',
          content: 'Overview',
          position: { x: 960, y: 100 },
          size: { width: 900, height: 100 },
          fontSize: 72,
          fontFamily: 'Pacifico',
          fontStyle: 'italic',
          color: '#2A2A2A',
          textAlign: 'left',
          zIndex: 10,
        },
        // Point 1
        {
          id: 'point-1',
          type: 'text',
          content: '01.    What is grace?',
          position: { x: 960, y: 260 },
          size: { width: 900, height: 70 },
          fontSize: 32,
          fontFamily: 'Outfit',
          fontStyle: 'italic',
          color: '#2A2A2A',
          textAlign: 'left',
          zIndex: 10,
        },
        // Point 2
        {
          id: 'point-2',
          type: 'text',
          content: '02.    Grace Forgives',
          position: { x: 960, y: 360 },
          size: { width: 900, height: 70 },
          fontSize: 32,
          fontFamily: 'Outfit',
          fontStyle: 'italic',
          color: '#2A2A2A',
          textAlign: 'left',
          zIndex: 10,
        },
        // Point 3
        {
          id: 'point-3',
          type: 'text',
          content: '03.    Grace Heals',
          position: { x: 960, y: 460 },
          size: { width: 900, height: 70 },
          fontSize: 32,
          fontFamily: 'Outfit',
          fontStyle: 'italic',
          color: '#2A2A2A',
          textAlign: 'left',
          zIndex: 10,
        },
        // Point 4
        {
          id: 'point-4',
          type: 'text',
          content: '04.    Grace Empowers',
          position: { x: 960, y: 560 },
          size: { width: 900, height: 70 },
          fontSize: 32,
          fontFamily: 'Outfit',
          fontStyle: 'italic',
          color: '#2A2A2A',
          textAlign: 'left',
          zIndex: 10,
        },
        // Point 5
        {
          id: 'point-5',
          type: 'text',
          content: '05.    Grace Is a Gift',
          position: { x: 960, y: 660 },
          size: { width: 900, height: 70 },
          fontSize: 32,
          fontFamily: 'Outfit',
          fontStyle: 'italic',
          color: '#2A2A2A',
          textAlign: 'left',
          zIndex: 10,
        },
      ],
    },
  },

  {
    id: 'scripture-verse-1',
    name: 'Verse with Reference',
    category: 'scripture',
    thumbnail: '/src/assets/6.jpg',
    description: 'Scripture text with reference call-out',
    visualData: {
      backgroundColor: '#E8E3DC',
      elements: [
        // Main Quote (left side)
        {
          id: 'scripture-quote',
          type: 'text',
          content: "God's grace\nwipes the\nslate clean.",
          position: { x: 100, y: 280 },
          size: { width: 800, height: 360 },
          fontSize: 72,
          fontFamily: 'Pacifico',
          fontStyle: 'italic',
          color: '#2A2A2A',
          textAlign: 'left',
          zIndex: 10,
        },
        // Reference Box (dark background)
        {
          id: 'ref-box',
          type: 'shape',
          position: { x: 1020, y: 200 },
          size: { width: 800, height: 480 },
          backgroundColor: '#3A3A3A',
          zIndex: 5,
        },
        // Scripture Reference
        {
          id: 'scripture-ref',
          type: 'text',
          content: 'Isaiah 1:18',
          position: { x: 1100, y: 260 },
          size: { width: 640, height: 100 },
          fontSize: 56,
          fontFamily: 'Pacifico',
          fontStyle: 'italic',
          color: '#FFFFFF',
          textAlign: 'center',
          zIndex: 10,
        },
        // Scripture Text Box
        {
          id: 'verse-box',
          type: 'shape',
          position: { x: 1080, y: 380 },
          size: { width: 700, height: 240 },
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          zIndex: 8,
        },
        // Scripture Text
        {
          id: 'scripture-text',
          type: 'text',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed consectetur ex arcu, vitae semper mauris lacinia eu.',
          position: { x: 1120, y: 420 },
          size: { width: 620, height: 160 },
          fontSize: 24,
          fontFamily: 'Outfit',
          color: '#2A2A2A',
          textAlign: 'center',
          zIndex: 10,
        },
      ],
    },
  },
];

// ===== ALL TEMPLATES =====

export const ALL_TEMPLATES: SlideTemplate[] = [
  ...SERMON_TEMPLATES,
  ...ANNOUNCEMENT_TEMPLATES,
  ...SCRIPTURE_TEMPLATES,
];

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: SlideTemplate['category']): SlideTemplate[] {
  return ALL_TEMPLATES.filter(t => t.category === category);
}

/**
 * Get template by ID
 */
export function getTemplateById(id: string): SlideTemplate | undefined {
  return ALL_TEMPLATES.find(t => t.id === id);
}

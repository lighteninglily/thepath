/**
 * Pre-designed announcement templates
 * These are complete slide designs ready to customize
 */

// Import background images for templates
import bb1 from './bb (1).jpg';
import bb2 from './bb (2).jpg';
import bb3 from './bb (3).jpg';
import bb4 from './bb (4).jpg';
import bb5 from './bb (5).jpg';
import bb6 from './bb (6).jpg';
import bb7 from './bb (7).jpg';
import bb8 from './bb (8).jpg';
import bb9 from './bb (9).jpg';
import bb10 from './bb (10).jpg';
import bb11 from './bb (11).jpg';

import bw1 from './11 -bw (1).jpg';
import bw2 from './11 -bw (2).jpg';
import bw3 from './11 -bw (3).jpg';
import bw4 from './11 -bw (4).jpg';
import bw5 from './11 -bw (5).jpg';
import bw6 from './11 -bw (6).jpg';
import bw7 from './11 -bw (7).jpg';
import bw8 from './11 -bw (8).jpg';
import bw9 from './11 -bw (9).jpg';
import bw10 from './11 -bw (10).jpg';

import rp1 from './Rp (1).jpg';
import rp2 from './Rp (2).jpg';
import rp3 from './Rp (3).jpg';
import rp4 from './Rp (4).jpg';
import rp5 from './Rp (5).jpg';
import rp6 from './Rp (6).jpg';
import rp7 from './Rp (7).jpg';
import rp8 from './Rp (8).jpg';
import rp9 from './Rp (9).jpg';
import rp10 from './Rp (10).jpg';

export interface AnnouncementTemplate {
  id: string;
  name: string;
  serviceType: 'scripture' | 'announcement' | 'sermon' | 'offering' | 'welcome' | 'closing' | 'generic';
  category: 'modern' | 'classic' | 'dramatic' | 'minimal' | 'nature';
  thumbnail: string;
  description?: string;
  visualData: {
    background: {
      type: 'image';
      imageUrl: string;
    };
    elements: any[];
  };
}

/**
 * Pre-designed announcement templates
 * Users can select these and customize the text/content
 */
export const ANNOUNCEMENT_TEMPLATES: AnnouncementTemplate[] = [
  // BB Series - Modern Worship
  {
    id: 'bb-1',
    name: 'Modern Worship 1',
    serviceType: 'announcement',
    category: 'modern',
    thumbnail: bb1,
    visualData: {
      background: { type: 'image', imageUrl: bb1 },
      elements: [
        {
          id: 'title-1',
          type: 'text',
          content: 'Announcement Title',
          position: { x: 960, y: 400 },
          size: { width: 1400, height: 200 },
          fontSize: 80,
          fontWeight: 700,
          color: '#FFFFFF',
          textAlign: 'center',
          zIndex: 10,
        },
        {
          id: 'subtitle-1',
          type: 'text',
          content: 'Details go here',
          position: { x: 960, y: 650 },
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
    id: 'bb-2',
    name: 'Modern Worship 2',
    serviceType: 'announcement',
    category: 'modern',
    thumbnail: bb2,
    visualData: {
      background: { type: 'image', imageUrl: bb2 },
      elements: [
        {
          id: 'title-1',
          type: 'text',
          content: 'Announcement',
          position: { x: 960, y: 450 },
          size: { width: 1400, height: 150 },
          fontSize: 70,
          fontWeight: 700,
          color: '#FFFFFF',
          textAlign: 'center',
          zIndex: 10,
        },
      ],
    },
  },
  {
    id: 'bb-3',
    name: 'Modern Worship 3',
    serviceType: 'announcement',
    category: 'modern',
    thumbnail: bb3,
    visualData: {
      background: { type: 'image', imageUrl: bb3 },
      elements: [
        {
          id: 'title-1',
          type: 'text',
          content: 'Title Here',
          position: { x: 960, y: 540 },
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
    id: 'bb-4',
    name: 'Modern Worship 4',
    serviceType: 'announcement',
    category: 'modern',
    thumbnail: bb4,
    visualData: {
      background: { type: 'image', imageUrl: bb4 },
      elements: [
        {
          id: 'title-1',
          type: 'text',
          content: 'Announcement',
          position: { x: 960, y: 500 },
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
    id: 'bb-5',
    name: 'Modern Worship 5',
    serviceType: 'announcement',
    category: 'modern',
    thumbnail: bb5,
    visualData: {
      background: { type: 'image', imageUrl: bb5 },
      elements: [
        {
          id: 'title-1',
          type: 'text',
          content: 'Your Message',
          position: { x: 960, y: 540 },
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

  // B&W Series - Dramatic
  {
    id: 'bw-1',
    name: 'Dramatic B&W 1',
    serviceType: 'announcement',
    category: 'dramatic',
    thumbnail: bw1,
    visualData: {
      background: { type: 'image', imageUrl: bw1 },
      elements: [
        {
          id: 'title-1',
          type: 'text',
          content: 'Bold Statement',
          position: { x: 960, y: 500 },
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
    id: 'bw-2',
    name: 'Dramatic B&W 2',
    serviceType: 'announcement',
    category: 'dramatic',
    thumbnail: bw2,
    visualData: {
      background: { type: 'image', imageUrl: bw2 },
      elements: [
        {
          id: 'title-1',
          type: 'text',
          content: 'Important Message',
          position: { x: 960, y: 540 },
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
    id: 'bw-3',
    name: 'Dramatic B&W 3',
    serviceType: 'announcement',
    category: 'dramatic',
    thumbnail: bw3,
    visualData: {
      background: { type: 'image', imageUrl: bw3 },
      elements: [
        {
          id: 'title-1',
          type: 'text',
          content: 'Announcement',
          position: { x: 960, y: 500 },
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

  // RP Series - Nature
  {
    id: 'rp-1',
    name: 'Nature Scene 1',
    serviceType: 'announcement',
    category: 'nature',
    thumbnail: rp1,
    visualData: {
      background: { type: 'image', imageUrl: rp1 },
      elements: [
        {
          id: 'title-1',
          type: 'text',
          content: 'Announcement',
          position: { x: 960, y: 480 },
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
    id: 'rp-2',
    name: 'Nature Scene 2',
    serviceType: 'announcement',
    category: 'nature',
    thumbnail: rp2,
    visualData: {
      background: { type: 'image', imageUrl: rp2 },
      elements: [
        {
          id: 'title-1',
          type: 'text',
          content: 'Your Title',
          position: { x: 960, y: 520 },
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
    id: 'rp-3',
    name: 'Nature Scene 3',
    serviceType: 'announcement',
    category: 'nature',
    thumbnail: rp3,
    visualData: {
      background: { type: 'image', imageUrl: rp3 },
      elements: [
        {
          id: 'title-1',
          type: 'text',
          content: 'Message Here',
          position: { x: 960, y: 500 },
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
];

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: AnnouncementTemplate['category']) {
  return ANNOUNCEMENT_TEMPLATES.filter(t => t.category === category);
}

/**
 * Get random template
 */
export function getRandomTemplate() {
  return ANNOUNCEMENT_TEMPLATES[Math.floor(Math.random() * ANNOUNCEMENT_TEMPLATES.length)];
}

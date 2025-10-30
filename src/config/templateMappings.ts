import { SongAnalysis } from '../services/openaiService';

export interface TemplateMappingRule {
  conditions: {
    mood?: string[];
    energy?: string[];
    themePack?: string[];
    season?: string[];
  };
  templateId: string;
  themePack: string; // Use existing theme packs
  backgroundIndex?: number; // Which background in the pack
  name: string;
  priority: number;
}

/**
 * Maps AI analysis to existing theme packs and backgrounds
 * IMPORTANT: These use YOUR existing backgrounds, no external templates needed!
 */
export const templateMappings: TemplateMappingRule[] = [
  // Seasonal (Highest Priority)
  {
    conditions: { season: ['christmas'] },
    templateId: 'internal_christmas',
    themePack: 'nature',
    backgroundIndex: 0,
    name: 'Christmas Nature',
    priority: 100
  },
  {
    conditions: { season: ['easter'] },
    templateId: 'internal_easter',
    themePack: 'clouds',
    backgroundIndex: 2,
    name: 'Easter Hope',
    priority: 100
  },

  // Theme Pack Mappings
  {
    conditions: { themePack: ['mountains'] },
    templateId: 'internal_mountains',
    themePack: 'mountains',
    name: 'Mountain Majesty',
    priority: 90
  },
  {
    conditions: { themePack: ['waves'] },
    templateId: 'internal_waves',
    themePack: 'waves',
    name: 'Ocean Waves',
    priority: 90
  },
  {
    conditions: { themePack: ['clouds'] },
    templateId: 'internal_clouds',
    themePack: 'clouds',
    name: 'Heavenly Clouds',
    priority: 90
  },

  // Mood + Energy Combinations - ONLY Mountains, Clouds, Waves (NO PEOPLE)
  {
    conditions: { mood: ['joyful'], energy: ['high'] },
    templateId: 'internal_joyful_high',
    themePack: 'waves',
    backgroundIndex: 1,
    name: 'Joyful Waves',
    priority: 80
  },
  {
    conditions: { mood: ['peaceful'], energy: ['low'] },
    templateId: 'internal_peaceful',
    themePack: 'clouds',  // Peaceful = clouds
    backgroundIndex: 2,
    name: 'Peaceful Clouds',
    priority: 80
  },
  {
    conditions: { mood: ['powerful'] },
    templateId: 'internal_powerful',
    themePack: 'mountains',  // Powerful = mountains
    backgroundIndex: 1,
    name: 'Powerful Mountains',
    priority: 70
  },
  {
    conditions: { mood: ['reflective'] },
    templateId: 'internal_reflective',
    themePack: 'clouds',  // Reflective = clouds
    backgroundIndex: 3,
    name: 'Reflective Clouds',
    priority: 70
  },
  {
    conditions: { mood: ['celebratory'] },
    templateId: 'internal_celebratory',
    themePack: 'waves',  // Celebratory = waves
    backgroundIndex: 4,
    name: 'Celebration Waves',
    priority: 70
  },

  // Default fallback - Rotate between the 3 allowed themes
  {
    conditions: {},
    templateId: 'internal_default',
    themePack: 'waves',  // Default to waves
    backgroundIndex: 0,
    name: 'Default Waves',
    priority: 1
  }
];

/**
 * Select best template mapping based on AI analysis
 * Returns theme pack and background to use from existing assets
 */
export function selectTemplate(analysis: SongAnalysis): {
  themePack: string;
  backgroundIndex: number;
  templateName: string;
} {
  const matchingRules = templateMappings.filter(rule => {
    const { mood, energy, themePack, season } = rule.conditions;
    
    return (
      (!mood || mood.includes(analysis.mood)) &&
      (!energy || energy.includes(analysis.energy)) &&
      (!themePack || themePack.includes(analysis.suggestedThemePack || '')) &&
      (!season || season.includes(analysis.season || 'general'))
    );
  });

  // Sort by priority and return highest
  matchingRules.sort((a, b) => b.priority - a.priority);
  
  const selected = matchingRules[0] || templateMappings[templateMappings.length - 1];
  
  return {
    themePack: selected.themePack,
    backgroundIndex: selected.backgroundIndex ?? 0,
    templateName: selected.name
  };
}

import { searchLyrics } from './lyricsApi';
import { openaiService, SongAnalysis } from './openaiService';
import { selectTemplate } from '../config/templateMappings';
import { getEnabledBackgrounds } from '../config/backgroundConfig';

export interface GeneratedSlide {
  id: string;
  content: string;
  type: string;
  order: number;
  backgroundId: string;
  layout: string;
  visualData?: any; // For visual editor compatibility
}

export interface GenerationProgress {
  step: number;
  totalSteps: number;
  message: string;
  progress: number;
}

export type ProgressCallback = (progress: GenerationProgress) => void;

export interface GenerationResult {
  slides: GeneratedSlide[];
  analysis: SongAnalysis;
  songInfo: {
    title: string;
    artist: string;
    lyrics: string;
  };
  metadata: {
    themePack: string;
    templateName: string;
    generatedAt: string;
    method: 'ai-generated';
  };
}

/**
 * Get background packs from config file
 * This allows easy enable/disable of backgrounds
 */
function getBackgroundPacks() {
  return [
    {
      id: 'mountains',
      name: 'Mountains',
      backgrounds: getEnabledBackgrounds('mountains')
    },
    {
      id: 'waves',
      name: 'Ocean Waves',
      backgrounds: getEnabledBackgrounds('waves')
    },
    {
      id: 'clouds',
      name: 'Heavenly Clouds',
      backgrounds: getEnabledBackgrounds('clouds')
    }
  ];
}

export class SlideGeneratorService {
  /**
   * Generate complete song with slides using AI
   */
  async generateSongSlides(
    title: string,
    artist: string,
    onProgress?: ProgressCallback,
    themePack?: 'mountains' | 'waves' | 'clouds'
  ): Promise<GenerationResult> {
    const totalSteps = 4;

    try {
      // Step 1: Fetch lyrics from Genius
      onProgress?.({
        step: 1,
        totalSteps,
        message: 'Fetching lyrics from Genius...',
        progress: 25
      });

      const lyricsResult = await searchLyrics(title, artist);
      
      if (!lyricsResult || !lyricsResult.lyrics) {
        throw new Error('Could not find song lyrics. Please try a different search or add manually.');
      }

      // Step 2: Analyze song with AI
      onProgress?.({
        step: 2,
        totalSteps,
        message: 'Analyzing song mood and theme with AI...',
        progress: 50
      });

      const analysis = await openaiService.analyzeSong(
        lyricsResult.title,
        lyricsResult.artist,
        lyricsResult.lyrics
      );

      // Step 3: Break into slides and select template
      onProgress?.({
        step: 3,
        totalSteps,
        message: 'Breaking lyrics into slides...',
        progress: 75
      });

      const slideBreakdown = await openaiService.breakIntoSlides(lyricsResult.lyrics);
      
      // SAFETY CHECK: Split slides that are too long (more than 8 lines)
      const safeSlides: any[] = [];
      slideBreakdown.slides.forEach((slide, idx) => {
        const lines = slide.content.split('\n');
        if (lines.length > 8) {
          console.warn(`⚠️ Slide ${idx} has ${lines.length} lines - splitting into multiple slides`);
          // Split into chunks of 6 lines
          for (let i = 0; i < lines.length; i += 6) {
            const chunk = lines.slice(i, i + 6).join('\n');
            safeSlides.push({
              content: chunk,
              type: slide.type,
              order: safeSlides.length
            });
          }
        } else {
          safeSlides.push({
            ...slide,
            order: safeSlides.length
          });
        }
      });
      
      slideBreakdown.slides = safeSlides;
      console.log(`✅ Final slide count: ${slideBreakdown.slides.length} slides`);
      
      // Use user-selected theme pack if provided, otherwise let AI choose
      let selectedThemePack: string;
      if (themePack) {
        selectedThemePack = themePack;
        console.log(`🎨 User selected theme pack: ${themePack}`);
      } else {
        const templateSelection = selectTemplate(analysis);
        selectedThemePack = templateSelection.themePack;
        console.log(`🤖 AI selected theme pack: ${selectedThemePack}`);
      }

      // Get background pack from config (respects enabled/disabled settings)
      const pack = getBackgroundPacks().find(p => p.id === selectedThemePack);
      if (!pack) {
        throw new Error(`Theme pack ${selectedThemePack} not found`);
      }
      
      console.log(`✅ Using theme pack: ${pack.name} with ${pack.backgrounds.length} enabled backgrounds`);

      // Step 4: Create slides using existing backgrounds
      onProgress?.({
        step: 4,
        totalSteps,
        message: 'Creating beautiful slides...',
        progress: 90
      });

      const generatedSlides: GeneratedSlide[] = slideBreakdown.slides.map((slide, index) => {
        // Rotate through backgrounds in the pack
        const backgroundIndex = index % pack.backgrounds.length;
        const background = pack.backgrounds[backgroundIndex];

        return {
          id: `slide_${Date.now()}_${index}`,
          content: slide.content,
          type: slide.type,
          order: slide.order,
          backgroundId: background.id,
          layout: 'center', // Default layout
          // Optional: Create visualData for visual editor
          visualData: {
            background: {
              type: 'image',
              imageId: background.id
            },
            elements: [
              {
                id: `text_${Date.now()}_${index}`,
                type: 'text',
                content: slide.content,
                visible: true,  // CRITICAL: Must be true to render!
                opacity: 1,
                zIndex: 10,  // Above background
                rotation: 0,
                position: { x: 160, y: 340 },  // TOP-LEFT position for centered 1600x400 element
                size: { width: 1600, height: 400 },
                style: {
                  fontSize: 64,  // Larger font for better readability
                  fontFamily: 'Inter',
                  fontWeight: 700,  // Bolder for better visibility
                  color: '#ffffff',
                  textAlign: 'center',
                  lineHeight: 1.3,
                  textShadow: '3px 3px 12px rgba(0, 0, 0, 0.9)'  // Stronger shadow for readability
                }
              }
            ]
          }
        };
      });

      onProgress?.({
        step: 4,
        totalSteps,
        message: 'Complete!',
        progress: 100
      });

      return {
        slides: generatedSlides,
        analysis,
        songInfo: {
          title: lyricsResult.title,
          artist: lyricsResult.artist,
          lyrics: lyricsResult.lyrics
        },
        metadata: {
          themePack: selectedThemePack,
          templateName: pack.name,
          generatedAt: new Date().toISOString(),
          method: 'ai-generated'
        }
      };

    } catch (error: any) {
      console.error('Slide generation failed:', error);
      throw error;
    }
  }

  /**
   * Check if all required services are available
   */
  checkAvailability(): {
    genius: boolean;
    openai: boolean;
    canGenerate: boolean;
  } {
    const genius = !!(window as any).electron?.lyrics;
    const openai = openaiService.isConfigured();
    
    return {
      genius,
      openai,
      canGenerate: genius && openai
    };
  }
}

export const slideGeneratorService = new SlideGeneratorService();

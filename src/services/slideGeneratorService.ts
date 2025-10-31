import { searchLyrics } from './lyricsApi';
import { openaiService, SongAnalysis } from './openaiService';
import { selectTemplate } from '../config/templateMappings';
import { getEnabledBackgrounds } from '../config/backgroundConfig';
import { calculateSongLyricsFontSize } from '../utils/fontSizeCalculator';

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
  structureDetection?: {
    hasChorus: boolean;
    chorusStartIndex?: number;
    chorusEndIndex?: number;
    recommendedDuplications?: number;
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
    },
    {
      id: 'forest',
      name: 'Forests',
      backgrounds: getEnabledBackgrounds('forest')
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
    themePack?: 'mountains' | 'waves' | 'clouds' | 'forest'
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

      // Step 2.5: Detect song structure (chorus detection)
      onProgress?.({
        step: 2,
        totalSteps,
        message: 'Analyzing song structure...',
        progress: 60
      });

      const structureDetection = await openaiService.detectSongStructure(lyricsResult.lyrics);
      console.log('📊 Structure detection:', structureDetection);

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
      console.log(`✅ Initial slide count: ${slideBreakdown.slides.length} slides`);
      
      // SMART MERGE: If still too many slides, merge consecutive short slides
      if (safeSlides.length > 30) {
        console.warn(`⚠️ Too many slides (${safeSlides.length})! Attempting to merge...`);
        const mergedSlides: any[] = [];
        let i = 0;
        
        while (i < safeSlides.length) {
          const currentSlide = safeSlides[i];
          const currentLines = currentSlide.content.split('\n').filter((l: string) => l.trim()).length;
          
          // If current slide is short (≤3 lines) and next slide exists and is same type
          if (i < safeSlides.length - 1 && currentLines <= 3) {
            const nextSlide = safeSlides[i + 1];
            const nextLines = nextSlide.content.split('\n').filter((l: string) => l.trim()).length;
            
            // Merge if combined total is ≤6 lines and same section type
            if (currentLines + nextLines <= 6 && currentSlide.type === nextSlide.type) {
              mergedSlides.push({
                content: `${currentSlide.content}\n${nextSlide.content}`,
                type: currentSlide.type,
                order: mergedSlides.length
              });
              i += 2; // Skip both slides
              console.log(`🔗 Merged slides ${i-1} and ${i} (${currentLines}+${nextLines} lines)`);
              continue;
            }
          }
          
          // Keep slide as-is
          mergedSlides.push({
            ...currentSlide,
            order: mergedSlides.length
          });
          i++;
        }
        
        slideBreakdown.slides = mergedSlides;
        console.log(`✅ After merging: ${mergedSlides.length} slides (reduced from ${safeSlides.length})`);
      }
      
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

        // ⭐ Calculate dynamic font size based on content
        const optimalFontSize = calculateSongLyricsFontSize(slide.content);
        console.log(`📏 Slide ${index + 1}: ${optimalFontSize}px font`);

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
                  fontSize: optimalFontSize,  // ⭐ DYNAMIC font size (44-88px)
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

      // ⭐ CREATE BEAUTIFUL TITLE SLIDE as first slide
      const titleSlide: GeneratedSlide = {
        id: `slide_title_${Date.now()}`,
        content: `${lyricsResult.title}\n${lyricsResult.artist}`,
        type: 'title',
        order: 0,
        backgroundId: pack.backgrounds[0].id,
        layout: 'center',
        visualData: {
          background: {
            type: 'image',
            imageId: pack.backgrounds[0].id,
            imageUrl: pack.backgrounds[0].id,
            overlay: {
              enabled: true,
              color: '#000000',
              opacity: 50,  // 50% overlay for readability
              blendMode: 'normal' as const
            }
          },
          elements: [
            // Song Title - Beautiful script font (Allura)
            {
              id: `text_song_title_${Date.now()}`,
              type: 'text',
              content: lyricsResult.title,
              visible: true,
              opacity: 1,
              zIndex: 10,
              rotation: 0,
              position: { x: 160, y: 350 },  // Upper position
              size: { width: 1600, height: 200 },
              style: {
                fontSize: 120,  // Large, elegant
                fontFamily: 'Allura',  // Beautiful script font
                fontWeight: 400,  // Regular for script fonts
                color: '#ffffff',
                textAlign: 'center',
                lineHeight: 1.2,
                textShadow: '4px 4px 20px rgba(0, 0, 0, 0.9)'  // Strong shadow for contrast
              }
            },
            // Artist Name - Clean modern font (Outfit)
            {
              id: `text_artist_name_${Date.now()}`,
              type: 'text',
              content: lyricsResult.artist,
              visible: true,
              opacity: 1,
              zIndex: 10,
              rotation: 0,
              position: { x: 160, y: 580 },  // Below title
              size: { width: 1600, height: 100 },
              style: {
                fontSize: 48,  // Smaller, subtle
                fontFamily: 'Outfit',  // Clean sans-serif
                fontWeight: 400,  // Regular weight
                color: '#ffffff',
                textAlign: 'center',
                lineHeight: 1.2,
                textShadow: '3px 3px 12px rgba(0, 0, 0, 0.9)'  // Shadow for readability
              }
            }
          ]
        }
      };

      // Update order for all lyric slides to start from 1
      generatedSlides.forEach((slide, index) => {
        slide.order = index + 1;
      });

      // Insert title slide at the beginning
      const allSlides = [titleSlide, ...generatedSlides];

      onProgress?.({
        step: 4,
        totalSteps,
        message: 'Complete!',
        progress: 100
      });

      return {
        slides: allSlides,
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
        },
        structureDetection: {
          hasChorus: structureDetection.hasChorus,
          chorusStartIndex: structureDetection.chorusStartIndex,
          chorusEndIndex: structureDetection.chorusEndIndex,
          recommendedDuplications: structureDetection.recommendedDuplications
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

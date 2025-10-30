import { useState, useEffect } from 'react';
import { X, Eye, Edit, Sparkles } from 'lucide-react';
import { parseLyricsIntoSlides } from '../../utils/lyricsParser';
import { TemplateSelector } from '../templates/TemplateSelector';
import { BackgroundPicker } from '../backgrounds/BackgroundPicker';
import { BackgroundPackPicker } from '../backgrounds/BackgroundPackPicker';
import { QuickLookPicker } from '../backgrounds/QuickLookPicker';
import { AdvancedSlidePreview } from '../slides/AdvancedSlidePreview';
import { SlideEditor } from '../slides/SlideEditor';
import { SlideDesigner } from '../designer/SlideDesigner';
import { LyricsSearchModal } from '../lyrics/LyricsSearchModal';
import { simpleToVisualSlide, visualToSimpleSlide } from '../../utils/slideConverter';
import { assignRandomLayouts } from '../../utils/layouts';
import { assignBackgroundsFromPack } from '../../assets/backgroundPacks';
import { getLayoutsForStyle } from '../../assets/quickLooks';
import { WORSHIP_BACKGROUNDS } from '../../assets/backgrounds';
import type { Song, CreateSongInput, DesignTemplate } from '../../types';
import type { BackgroundImage } from '../../assets/backgrounds';
import type { BackgroundPack } from '../../assets/backgroundPacks';
import type { QuickLook } from '../../assets/quickLooks';
import type { LayoutType } from '../../utils/layouts';

interface SongFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSongInput) => void;
  song?: Song | null;
  isLoading?: boolean;
}

export function SongFormModal({ isOpen, onClose, onSubmit, song, isLoading }: SongFormModalProps) {
  const [formData, setFormData] = useState<CreateSongInput>({
    title: '',
    artist: null,
    lyrics: '',
    slidesData: null,
    designTheme: null,
    ccliNumber: null,
    key: null,
    tempo: null,
    tags: [],
  });
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<DesignTemplate | null>(null);
  const [selectedBackground, setSelectedBackground] = useState<BackgroundImage | null>(null);
  const [selectedPack, setSelectedPack] = useState<BackgroundPack | null>(null);
  const [selectedLook, setSelectedLook] = useState<QuickLook | null>(null);
  const [useAdvancedLayouts, setUseAdvancedLayouts] = useState(true);
  const [usePacks, setUsePacks] = useState(false);
  const [useQuickLooks, setUseQuickLooks] = useState(true);
  const [showSlideEditor, setShowSlideEditor] = useState(false);
  const [showVisualDesigner, setShowVisualDesigner] = useState(false);
  const [showLyricsSearch, setShowLyricsSearch] = useState(false);
  const [slideBackgrounds, setSlideBackgrounds] = useState<(BackgroundImage | null)[]>([]);
  const [slideLayouts, setSlideLayouts] = useState<LayoutType[]>([]);

  const [initialFormData, setInitialFormData] = useState<CreateSongInput | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (song) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📂 LOADING SONG INTO FORM');
      console.log('📝 Song title:', song.title);
      console.log('📄 Song has slidesData:', !!song.slidesData);
      console.log('📊 Slides count:', song.slidesData?.length || 0);
      
      // Check for visualData in slides
      if (song.slidesData) {
        song.slidesData.forEach((slide, idx) => {
          console.log(`  Slide ${idx + 1} has visualData:`, !!slide.visualData);
        });
      }
      
      const loadedData = {
        title: song.title,
        artist: song.artist,
        lyrics: song.lyrics,
        slidesData: song.slidesData,
        designTheme: song.designTheme,
        backgroundId: song.backgroundId,
        ccliNumber: song.ccliNumber,
        key: song.key,
        tempo: song.tempo,
        tags: song.tags,
      };
      
      setFormData(loadedData);
      setInitialFormData(JSON.parse(JSON.stringify(loadedData))); // Deep copy
      
      console.log('✅ FormData populated');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      // Load saved background if exists
      if (song.backgroundId) {
        const savedBg = WORSHIP_BACKGROUNDS.find((bg) => bg.id === song.backgroundId);
        if (savedBg) {
          setSelectedBackground(savedBg);
          setUseAdvancedLayouts(true); // Switch to advanced mode
          console.log('Loaded saved background:', savedBg.name);
        }
      }
    } else {
      const emptyData = {
        title: '',
        artist: null,
        lyrics: '',
        slidesData: null,
        designTheme: null,
        backgroundId: null,
        ccliNumber: null,
        key: null,
        tempo: null,
        tags: [],
      };
      setFormData(emptyData);
      setInitialFormData(JSON.parse(JSON.stringify(emptyData)));
    }
  }, [song]);

  // Detect changes
  useEffect(() => {
    if (!initialFormData) return;
    const changed = JSON.stringify(formData) !== JSON.stringify(initialFormData);
    setHasChanges(changed);
  }, [formData, initialFormData]);

  // 🔥 AUTOSAVE: Save changes automatically 2 seconds after editing stops (songs are bigger)
  useEffect(() => {
    if (!song || !hasChanges || !formData.title.trim()) return; // Only autosave for existing songs with title

    console.log('💾 Song Autosave: Changes detected, scheduling save...');
    
    const timer = setTimeout(() => {
      console.log('✅ Song Autosave: Saving song...');
      onSubmit(formData);
      setInitialFormData(JSON.parse(JSON.stringify(formData))); // Update baseline
      setHasChanges(false);
    }, 2000); // Wait 2 seconds for songs (more complex data)

    return () => clearTimeout(timer);
  }, [formData, song, hasChanges, onSubmit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📤 FORM SUBMIT: Preparing data');
    console.log('📋 formData.slidesData:', formData.slidesData);
    console.log('🎨 Selected pack:', selectedPack?.name);
    console.log('🖼️ Slide backgrounds:', slideBackgrounds.map(bg => bg?.name));
    
    // Use slides from formData if they were edited, otherwise parse from lyrics
    let slides = formData.slidesData || parseLyricsIntoSlides(formData.lyrics);
    console.log('📊 Final slides count:', slides.length);
    
    // ✅ APPLY BACKGROUNDS FROM PACK TO SLIDES!
    if (slideBackgrounds.length > 0 && (usePacks || selectedPack || useAdvancedLayouts)) {
      console.log('🎨 Applying backgrounds from pack to slides...');
      slides = slides.map((slide, idx) => {
        const newSlide = {
          ...slide,
          backgroundId: slideBackgrounds[idx]?.id || slide.backgroundId,
          layout: slideLayouts[idx] || slide.layout,
        };
        
        // If slide has visualData, update its background too!
        if (newSlide.visualData && slideBackgrounds[idx]) {
          console.log(`  📄 Updating visualData background for slide ${idx + 1}`);
          newSlide.visualData = {
            ...newSlide.visualData,
            background: {
              type: 'image' as const,
              imageUrl: slideBackgrounds[idx].id,
              overlay: {
                enabled: true,
                color: '#000000',
                opacity: 20,
                blendMode: 'normal' as const,
              },
            },
          };
        }
        
        return newSlide;
      });
      console.log('✅ Backgrounds applied to all slides (including visualData)!');
    }
    
    // Check each slide for visualData
    slides.forEach((slide, idx) => {
      console.log(`📄 Slide ${idx + 1}:`, {
        id: slide.id,
        content: slide.content.substring(0, 30) + '...',
        backgroundId: slide.backgroundId,
        hasVisualData: !!slide.visualData,
        visualDataPreview: slide.visualData ? {
          elements: slide.visualData.elements?.length || 0,
          background: slide.visualData.background?.type
        } : null
      });
    });
    
    // Include selected template design or background
    const design = selectedTemplate?.templateData || formData.designTheme;
    const backgroundId = selectedBackground?.id || selectedPack?.backgrounds[0]?.id || null;
    
    const dataToSubmit = {
      ...formData,
      slidesData: slides, // Now includes backgrounds from pack!
      designTheme: design,
      backgroundId,
    };
    
    console.log('📦 Data being submitted to onSubmit:', dataToSubmit);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    onSubmit(dataToSubmit);
  };

  const handleTemplateSelect = (template: DesignTemplate) => {
    setSelectedTemplate(template);
    setFormData({
      ...formData,
      designTheme: template.templateData,
    });
  };

  // Auto-parse lyrics into slides when lyrics change
  const currentSlides = formData.slidesData || parseLyricsIntoSlides(formData.lyrics);

  // Initialize slide backgrounds and layouts when slides change
  useEffect(() => {
    if (currentSlides.length > 0 && (slideBackgrounds.length === 0 || slideBackgrounds.length !== currentSlides.length)) {
      console.log('🔄 Auto-initializing backgrounds and layouts for', currentSlides.length, 'slides');
      
      let newBackgrounds: (BackgroundImage | null)[];
      let newLayouts: LayoutType[];
      
      if (useQuickLooks && selectedLook) {
        // Use Quick Look - complete pre-designed combination!
        console.log('✨ Using Quick Look:', selectedLook.name);
        newBackgrounds = assignBackgroundsFromPack(selectedLook.backgroundPack, currentSlides.length);
        newLayouts = getLayoutsForStyle(selectedLook.layoutStyle, currentSlides.length);
        console.log('🎨 Applied Quick Look with', newBackgrounds.length, 'backgrounds and', newLayouts.length, 'layouts');
      } else if (usePacks && selectedPack) {
        // Use pack - auto-rotate through 3-4 backgrounds!
        console.log('🎨 Using background pack:', selectedPack.name);
        newBackgrounds = assignBackgroundsFromPack(selectedPack, currentSlides.length);
        newLayouts = assignRandomLayouts(currentSlides.length);
        console.log('✨ Assigned varied backgrounds:', newBackgrounds.map(bg => bg?.name));
      } else if (selectedBackground) {
        // Use single background for all
        newBackgrounds = currentSlides.map(() => selectedBackground);
        newLayouts = assignRandomLayouts(currentSlides.length);
      } else {
        newBackgrounds = currentSlides.map(() => null);
        newLayouts = assignRandomLayouts(currentSlides.length);
      }
      
      setSlideBackgrounds(newBackgrounds);
      setSlideLayouts(newLayouts);
    }
  }, [currentSlides.length, selectedBackground, selectedPack, selectedLook, usePacks, useQuickLooks, slideBackgrounds.length]);

  const handleOpenSlideEditor = () => {
    console.log('Opening slide editor...');
    console.log('Current slides:', currentSlides.length);
    
    // ALWAYS ensure we have backgrounds and layouts matching current slides
    let newBackgrounds: (BackgroundImage | null)[];
    let newLayouts: LayoutType[];
    
    if (useQuickLooks && selectedLook) {
      // Use Quick Look - complete pre-designed combination
      console.log('✨ Using Quick Look:', selectedLook.name);
      newBackgrounds = assignBackgroundsFromPack(selectedLook.backgroundPack, currentSlides.length);
      newLayouts = getLayoutsForStyle(selectedLook.layoutStyle, currentSlides.length);
    } else if (usePacks && selectedPack) {
      // Use pack - auto-rotate backgrounds
      newBackgrounds = assignBackgroundsFromPack(selectedPack, currentSlides.length);
      newLayouts = assignRandomLayouts(currentSlides.length);
      console.log('🎨 Using pack backgrounds:', newBackgrounds.map(bg => bg?.name));
    } else {
      newBackgrounds = currentSlides.map(() => selectedBackground);
      newLayouts = assignRandomLayouts(currentSlides.length);
    }
    
    console.log('Setting backgrounds:', newBackgrounds.length);
    console.log('Setting layouts:', newLayouts.length);
    
    setSlideBackgrounds(newBackgrounds);
    setSlideLayouts(newLayouts);
    setShowSlideEditor(true);
  };

  const handleSaveSlides = (
    newSlides: typeof currentSlides,
    newBackgrounds: (BackgroundImage | null)[],
    newLayouts: LayoutType[]
  ) => {
    console.log('💾 SAVING SLIDES WITH PER-SLIDE DATA!');
    console.log('New slides:', newSlides);
    console.log('New backgrounds:', newBackgrounds);
    console.log('New layouts:', newLayouts);
    
    // Embed background and layout INTO each slide!
    const slidesWithMetadata = newSlides.map((slide, index) => ({
      ...slide,
      backgroundId: newBackgrounds[index]?.id || null,
      layout: newLayouts[index] || null,
    }));
    
    console.log('📦 Slides with embedded metadata:', slidesWithMetadata);
    
    // Update form data with slides that include their backgrounds/layouts
    setFormData({ 
      ...formData, 
      slidesData: slidesWithMetadata 
    });
    
    // Update backgrounds and layouts
    setSlideBackgrounds(newBackgrounds);
    setSlideLayouts(newLayouts);
    
    // If we have a background selected from editor, update it
    if (newBackgrounds.length > 0 && newBackgrounds[0]) {
      setSelectedBackground(newBackgrounds[0]);
    }
    
    setShowSlideEditor(false);
    
    console.log('✅ Slides saved with per-slide backgrounds and layouts!');
  };

  // Visual Designer handlers
  const handleOpenVisualDesigner = () => {
    if (currentSlides.length === 0) {
      alert('Please generate slides first by entering lyrics!');
      return;
    }
    setShowVisualDesigner(true);
  };

  const handleSaveVisualSlides = (visualSlides: any[]) => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('💾 VISUAL DESIGNER: Saving slides');
    console.log('📥 Input visual slides:', visualSlides);
    
    // Convert all visual slides back to simple format
    const simpleSlides = visualSlides.map(visualSlide => {
      const converted = visualToSimpleSlide(visualSlide);
      console.log('🔄 Converted slide:', {
        id: converted.id,
        hasVisualData: !!converted.visualData,
        visualDataKeys: converted.visualData ? Object.keys(converted.visualData) : []
      });
      return converted;
    });
    
    console.log('📤 Output simple slides with visualData:', simpleSlides);
    
    // Update form data with all converted slides
    setFormData({ 
      ...formData, 
      slidesData: simpleSlides 
    });
    
    console.log('✅ FormData updated - slides now in formData.slidesData');
    console.log('⚠️  Remember: Click "Update Song" to save to database!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    setShowVisualDesigner(false);
  };

  const handleImportLyrics = (data: { title: string; artist: string; lyrics: string }) => {
    console.log('🎵 Importing lyrics:', data.title, 'by', data.artist);
    
    setFormData({
      ...formData,
      title: data.title,
      artist: data.artist || null,
      lyrics: data.lyrics,
      slidesData: null, // Reset slides - will be regenerated from new lyrics
    });
    
    console.log('✅ Lyrics imported - slides will be auto-generated');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-brand-warmGray flex items-center justify-between">
          <h2 className="text-2xl font-bold text-brand-charcoal">
            {song ? 'Edit Song' : 'Add New Song'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-brand-warmGray/20 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs for Form/Preview */}
        <div className="border-b border-brand-warmGray px-6">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowPreview(false);
              }}
              className={`px-4 py-3 border-b-2 transition-colors ${
                !showPreview
                  ? 'border-brand-skyBlue text-brand-skyBlue font-medium'
                  : 'border-transparent text-brand-umber hover:text-brand-charcoal'
              }`}
            >
              Song Details
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowPreview(true);
              }}
              className={`px-4 py-3 border-b-2 transition-colors flex items-center gap-2 ${
                showPreview
                  ? 'border-brand-skyBlue text-brand-skyBlue font-medium'
                  : 'border-transparent text-brand-umber hover:text-brand-charcoal'
              }`}
            >
              <Eye size={18} />
              Preview Slides ({currentSlides.length})
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleOpenSlideEditor();
              }}
              className="px-4 py-3 border-b-2 border-transparent text-brand-umber 
                hover:text-brand-charcoal transition-colors flex items-center gap-2"
            >
              <Edit size={18} />
              Edit Slides
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleOpenVisualDesigner();
              }}
              className="px-4 py-3 border-b-2 border-transparent text-brand-skyBlue 
                hover:text-brand-powderBlue transition-colors flex items-center gap-2 font-medium"
            >
              <Sparkles size={18} />
              Visual Editor
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {!showPreview ? (
            <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-brand-charcoal mb-2">
                Song Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="
                  w-full px-4 py-2 rounded-lg
                  border border-brand-warmGray
                  bg-brand-offWhite
                  text-brand-charcoal
                  focus:outline-none focus:ring-2 focus:ring-brand-skyBlue
                "
                placeholder="Amazing Grace"
              />
            </div>

            {/* Artist & CCLI */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-charcoal mb-2">
                  Artist / Author
                </label>
                <input
                  type="text"
                  value={formData.artist || ''}
                  onChange={(e) => setFormData({ ...formData, artist: e.target.value || null })}
                  className="
                    w-full px-4 py-2 rounded-lg
                    border border-brand-warmGray
                    bg-brand-offWhite
                    text-brand-charcoal
                    focus:outline-none focus:ring-2 focus:ring-brand-skyBlue
                  "
                  placeholder="John Newton"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-charcoal mb-2">
                  CCLI Number
                </label>
                <input
                  type="text"
                  value={formData.ccliNumber || ''}
                  onChange={(e) => setFormData({ ...formData, ccliNumber: e.target.value || null })}
                  className="
                    w-full px-4 py-2 rounded-lg
                    border border-brand-warmGray
                    bg-brand-offWhite
                    text-brand-charcoal
                    focus:outline-none focus:ring-2 focus:ring-brand-skyBlue
                  "
                  placeholder="22025"
                />
              </div>
            </div>

            {/* Key & Tempo */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-charcoal mb-2">
                  Key
                </label>
                <input
                  type="text"
                  value={formData.key || ''}
                  onChange={(e) => setFormData({ ...formData, key: e.target.value || null })}
                  className="
                    w-full px-4 py-2 rounded-lg
                    border border-brand-warmGray
                    bg-brand-offWhite
                    text-brand-charcoal
                    focus:outline-none focus:ring-2 focus:ring-brand-skyBlue
                  "
                  placeholder="G"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-charcoal mb-2">
                  Tempo (BPM)
                </label>
                <input
                  type="number"
                  value={formData.tempo || ''}
                  onChange={(e) => setFormData({ ...formData, tempo: e.target.value ? parseInt(e.target.value) : null })}
                  className="
                    w-full px-4 py-2 rounded-lg
                    border border-brand-warmGray
                    bg-brand-offWhite
                    text-brand-charcoal
                    focus:outline-none focus:ring-2 focus:ring-brand-skyBlue
                  "
                  placeholder="120"
                />
              </div>
            </div>

            {/* Lyrics */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-brand-charcoal">
                  Lyrics *
                </label>
                <button
                  type="button"
                  onClick={() => setShowLyricsSearch(true)}
                  className="
                    flex items-center gap-2 px-3 py-1.5
                    text-sm font-medium
                    text-brand-skyBlue hover:text-brand-clay
                    border border-brand-skyBlue hover:border-brand-clay
                    rounded-lg
                    transition-colors
                  "
                >
                  <Sparkles className="w-4 h-4" />
                  Search Lyrics
                </button>
              </div>
              <textarea
                required
                value={formData.lyrics}
                onChange={(e) => setFormData({ ...formData, lyrics: e.target.value })}
                rows={12}
                className="
                  w-full px-4 py-2 rounded-lg
                  border border-brand-warmGray
                  bg-brand-offWhite
                  text-brand-charcoal
                  focus:outline-none focus:ring-2 focus:ring-brand-skyBlue
                  font-mono text-sm
                "
                placeholder="Amazing grace, how sweet the sound
That saved a wretch like me

I once was lost, but now I'm found
Was blind, but now I see"
              />
              <p className="text-xs text-brand-umber mt-2">
                Separate verses with blank lines. We'll automatically format them into slides.
              </p>
            </div>

            {/* Design Options Toggle */}
            <div className="pt-6 border-t border-brand-warmGray">
              <div className="flex gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => {
                    setUseAdvancedLayouts(false);
                    setUsePacks(false);
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors text-sm ${
                    !useAdvancedLayouts
                      ? 'border-brand-skyBlue bg-brand-skyBlue/10 text-brand-skyBlue'
                      : 'border-brand-warmGray text-brand-umber hover:border-brand-powderBlue'
                  }`}
                >
                  Simple
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUseAdvancedLayouts(true);
                    setUsePacks(true);
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors text-sm ${
                    useAdvancedLayouts && usePacks
                      ? 'border-brand-skyBlue bg-brand-skyBlue/10 text-brand-skyBlue'
                      : 'border-brand-warmGray text-brand-umber hover:border-brand-powderBlue'
                  }`}
                >
                  Theme Pack ⭐
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUseAdvancedLayouts(true);
                    setUsePacks(false);
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors text-sm ${
                    useAdvancedLayouts && !usePacks
                      ? 'border-brand-skyBlue bg-brand-skyBlue/10 text-brand-skyBlue'
                      : 'border-brand-warmGray text-brand-umber hover:border-brand-powderBlue'
                  }`}
                >
                  Single
                </button>
              </div>

              {!useAdvancedLayouts ? (
                <TemplateSelector
                  selectedTemplateId={selectedTemplate?.id}
                  onSelectTemplate={handleTemplateSelect}
                />
              ) : usePacks ? (
                <BackgroundPackPicker
                  selectedPack={selectedPack}
                  onSelectPack={(pack) => {
                    console.log('🎨 Pack selected:', pack.name);
                    setSelectedPack(pack);
                    // Auto-select first background as fallback
                    if (pack.backgrounds.length > 0) {
                      setSelectedBackground(pack.backgrounds[0]);
                    }
                    
                    // UPDATE EXISTING SLIDES WITH NEW PACK BACKGROUNDS
                    if (formData.slidesData && formData.slidesData.length > 0) {
                      console.log('🔄 Updating', formData.slidesData.length, 'slides with new pack');
                      const newBackgrounds = assignBackgroundsFromPack(pack, formData.slidesData.length);
                      
                      const updatedSlides = formData.slidesData.map((slide, idx) => {
                        const newBg = newBackgrounds[idx];
                        if (!newBg) {
                          console.log('⚠️ No background for slide', idx);
                          return slide;
                        }
                        
                        console.log(`🎨 Updating slide ${idx}: ${newBg.name} (${newBg.id})`);
                        
                        // Update visualData background if it exists
                        if (slide.visualData?.background) {
                          return {
                            ...slide,
                            backgroundId: newBg.id,
                            visualData: {
                              ...slide.visualData,
                              background: {
                                ...slide.visualData.background,
                                type: 'image',
                                imageId: newBg.id,
                                imageUrl: newBg.id
                              }
                            }
                          };
                        }
                        
                        // Update backgroundId for simple slides
                        return {
                          ...slide,
                          backgroundId: newBg.id
                        };
                      });
                      
                      console.log('✅ Updated', updatedSlides.length, 'slides with pack backgrounds');
                      // Use functional setState to get current state
                      setFormData(prevData => ({ ...prevData, slidesData: updatedSlides }));
                      setSlideBackgrounds(newBackgrounds);
                    }
                  }}
                />
              ) : (
                <BackgroundPicker
                  selectedBackground={selectedBackground}
                  onSelectBackground={setSelectedBackground}
                />
              )}
            </div>
          </div>
          ) : (
            /* Preview Mode */
            <div className="space-y-4">
              <div className="bg-brand-skyBlue/10 border border-brand-skyBlue/20 rounded-lg p-4">
                <p className="text-sm text-brand-charcoal">
                  <strong>{currentSlides.length} slides</strong> generated from your lyrics.
                  {selectedTemplate && (
                    <span className="ml-2">
                      Using <strong>{selectedTemplate.name}</strong> template.
                    </span>
                  )}
                </p>
              </div>

              {currentSlides.length === 0 ? (
                <div className="text-center py-12 text-brand-umber">
                  <p>Add some lyrics to see the slide preview</p>
                </div>
              ) : useAdvancedLayouts && selectedBackground ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentSlides.map((slide, index) => {
                    const layouts = assignRandomLayouts(currentSlides.length);
                    return (
                      <div key={slide.id}>
                        <div className="text-xs text-brand-umber mb-2 font-medium">
                          Slide {index + 1} - {slide.type}
                        </div>
                        <AdvancedSlidePreview
                          slide={slide}
                          background={selectedBackground}
                          layout={layouts[index]}
                          className="rounded-lg border border-brand-warmGray shadow-sm"
                        />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-brand-umber">
                  <p>Select a background to preview slides</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-brand-warmGray flex items-center justify-between">
          {/* Autosave Status (only for existing songs) */}
          {song && (
            <div className="text-sm text-brand-umber">
              {hasChanges ? (
                <span className="text-orange-600 flex items-center gap-1">
                  <span className="inline-block w-2 h-2 bg-orange-600 rounded-full animate-pulse"></span>
                  Saving...
                </span>
              ) : (
                <span className="text-green-600 flex items-center gap-1">
                  <span className="inline-block w-2 h-2 bg-green-600 rounded-full"></span>
                  All changes saved
                </span>
              )}
            </div>
          )}
          
          <div className="flex items-center gap-3 ml-auto">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onClose();
              }}
              className="px-4 py-2 rounded-lg border border-brand-warmGray text-brand-charcoal hover:bg-brand-warmGray/10 transition-colors"
              disabled={isLoading}
            >
              {song ? 'Close' : 'Cancel'}
            </button>
            
            {/* Only show "Add Song" button for new songs */}
            {!song && (
              <button
                type="submit"
                disabled={isLoading || !formData.title.trim()}
                className="px-6 py-2 rounded-lg bg-brand-skyBlue text-white hover:bg-brand-powderBlue transition-all duration-200 shadow-md hover:shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Adding...' : 'Add Song'}
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Slide Editor Modal */}
      {showSlideEditor && (
        <SlideEditor
          slides={currentSlides}
          backgrounds={slideBackgrounds}
          layouts={slideLayouts}
          onSave={handleSaveSlides}
          onClose={() => setShowSlideEditor(false)}
        />
      )}

      {/* Visual Designer Modal */}
      {showVisualDesigner && currentSlides.length > 0 && (
        <SlideDesigner
          slides={currentSlides.map(slide => {
            // Apply song's background to slide if it doesn't have one
            const slideWithBackground = {
              ...slide,
              backgroundId: slide.backgroundId || selectedBackground?.id || formData.backgroundId || null
            };
            return simpleToVisualSlide(slideWithBackground);
          })}
          initialSlideIndex={0}
          onSave={handleSaveVisualSlides}
          onClose={() => setShowVisualDesigner(false)}
        />
      )}

      {/* Lyrics Search Modal */}
      <LyricsSearchModal
        isOpen={showLyricsSearch}
        onClose={() => setShowLyricsSearch(false)}
        onImport={handleImportLyrics}
      />
    </div>
  );
}

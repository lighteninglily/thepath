import { X, Upload, FileText, Loader2, CheckCircle2, AlertCircle, Trash2, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { parseDocument, detectFileType, validateFileSize } from '../../services/documentParser';
import { openaiService } from '../../services/openaiService';
import { createScriptureSlides, createPointSlide, createSermonTitleSlide } from '../../utils/sermonSlideBuilders';
import { SermonSlideEditor } from '../sermons/SermonSlideEditor';
import type { Slide } from '../../types';
import type { BackgroundImage } from '../../assets/backgrounds';
import type { LayoutType } from '../../utils/layouts';

interface AddSermonSlidesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSlides: (slides: Slide[], title: string, sermonNotes?: string) => void;
}

type ProcessingStep = 'upload' | 'parsing' | 'analyzing' | 'fetching' | 'generating' | 'complete';

export function AddSermonSlidesModal({ isOpen, onClose, onAddSlides }: AddSermonSlidesModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedText, setParsedText] = useState('');
  const [generatedSlides, setGeneratedSlides] = useState<Slide[]>([]);
  const [slidePreview, setSlidePreview] = useState<{
    scriptures: number;
    points: number;
    total: number;
  } | null>(null);
  const [sermonTitle, setSermonTitle] = useState('');
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<ProcessingStep>('upload');
  const [progress, setProgress] = useState(0);
  const [includeAllScriptures, setIncludeAllScriptures] = useState(false); // Default: main scriptures only
  const [showSlideEditor, setShowSlideEditor] = useState(false);
  const [slideBackgrounds, setSlideBackgrounds] = useState<(BackgroundImage | null)[]>([]);
  const [slideLayouts, setSlideLayouts] = useState<LayoutType[]>([]);
  const [bibleTranslation, setBibleTranslation] = useState('NIV'); // Default to NIV

  if (!isOpen) return null;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const fileType = detectFileType(file.name);
    if (!fileType) {
      setError('Unsupported file type. Please upload .txt, .docx, or .pdf files.');
      return;
    }

    // Validate file size (5MB max)
    if (!validateFileSize(file.size)) {
      setError('File is too large. Maximum size is 5MB.');
      return;
    }

    setSelectedFile(file);
    setError('');
    setParsedText('');
    setGeneratedSlides([]);
    setSlidePreview(null);
  };

  const handleProcess = async () => {
    if (!selectedFile) return;

    setProcessing(true);
    setError('');
    setProgress(0);

    try {
      // Step 1: Parse document
      setCurrentStep('parsing');
      setProgress(20);
      console.log('📄 Step 1: Parsing document...');

      const fileType = detectFileType(selectedFile.name);
      if (!fileType) throw new Error('Invalid file type');

      // Create temporary blob URL for parser
      const tempPath = URL.createObjectURL(selectedFile);
      
      const parsed = await parseDocument(tempPath, fileType);
      if (!parsed.success) {
        throw new Error(parsed.error || 'Failed to parse document');
      }

      setParsedText(parsed.text);
      console.log(`✅ Parsed: ${parsed.wordCount} words`);

      // Step 2: Analyze with GPT-5
      setCurrentStep('analyzing');
      setProgress(40);
      console.log('🤖 Step 2: Analyzing with GPT-5 AI...');
      console.log(`⚙️ Settings:`);
      console.log(`  - Scripture mode: ${includeAllScriptures ? 'ALL scriptures' : 'MAIN scriptures only'}`);
      console.log(`  - Bible translation: ${bibleTranslation}`);

      const analysis = await openaiService.analyzeSermonNotes(parsed.text, includeAllScriptures);
      console.log(`✅ Analysis complete:`, {
        scriptures: analysis.scriptures.length,
        points: analysis.mainPoints.length
      });

      // Determine sermon title
      const title = analysis.title || 'Untitled Sermon';
      setSermonTitle(title);

      // Step 3: Fetch scripture texts
      setCurrentStep('fetching');
      setProgress(60);
      console.log('📖 Step 3: Fetching scripture texts...');

      // Process scriptures (no artificial limits - trust the AI's judgment)
      const scripturesToProcess = analysis.scriptures;
      const scriptureSlides: Slide[] = [];
      
      console.log(`📖 Processing ${scripturesToProcess.length} scriptures (Mode: ${includeAllScriptures ? 'ALL REFERENCES' : 'FOUNDATIONAL ONLY'})`);
      
      for (const scripture of scripturesToProcess) {
        try {
          const result = await openaiService.lookupScripture(scripture.reference, bibleTranslation);
          const slides = await createScriptureSlides({
            reference: scripture.reference,
            text: result.fullText,
            version: bibleTranslation
          });
          scriptureSlides.push(...slides);
          console.log(`  ✅ ${scripture.reference} (${bibleTranslation}): ${slides.length} slides`);
        } catch (err) {
          console.warn(`  ⚠️ Failed to fetch ${scripture.reference}:`, err);
        }
      }
      
      console.log(`📊 Total scripture slides created: ${scriptureSlides.length}`);

      // Step 4: Generate point slides
      setCurrentStep('generating');
      setProgress(80);
      console.log('🎯 Step 4: Generating point slides...');

      // Generate slides for all high-level points (AI should only return high-level points)
      const pointSlides: Slide[] = analysis.mainPoints.map(point => 
        createPointSlide({ point })
      );
      
      console.log(`🎯 Generated ${pointSlides.length} point slides from high-level structure`);

      // Step 5: Assemble all slides
      setProgress(90);
      const allSlides: Slide[] = [];
      
      // Add title slide
      allSlides.push(createSermonTitleSlide(title, analysis.mainScripture));

      // Add MAIN scripture slides right after title (primary sermon text)
      const mainScriptureSlides = scriptureSlides.filter(slide => {
        const slideRef = slide.visualData?.elements?.find((e: any) => 
          e.content?.match(/[A-Za-z]+ \d+:\d+/)
        )?.content;
        return slideRef && analysis.mainScripture && slideRef.includes(analysis.mainScripture);
      });
      allSlides.push(...mainScriptureSlides);

      // Interleave points and their associated scriptures
      analysis.mainPoints.forEach((point, index) => {
        // Add point slide
        const pointSlide = pointSlides[index];
        if (pointSlide) {
          allSlides.push(pointSlide);
        }

        // Add scripture associated with this specific point (not main scripture)
        const pointScripture = scripturesToProcess.find(s => 
          point.scripture && 
          s.reference.includes(point.scripture) &&
          (!analysis.mainScripture || !s.reference.includes(analysis.mainScripture))
        );
        if (pointScripture) {
          const relatedSlides = scriptureSlides.filter(s => 
            s.content.includes(pointScripture.reference)
          );
          allSlides.push(...relatedSlides);
        }
      });

      // Add remaining scriptures not yet included
      const usedScriptures = new Set([
        analysis.mainScripture,
        ...analysis.mainPoints.map(p => p.scripture).filter(Boolean)
      ]);
      const remainingScriptureSlides = scriptureSlides.filter(slide => {
        const slideRef = slide.visualData?.elements?.find((e: any) => 
          e.content?.match(/[A-Za-z]+ \d+:\d+/)
        )?.content;
        return slideRef && !Array.from(usedScriptures).some(ref => 
          ref && slideRef.includes(ref as string)
        );
      });
      allSlides.push(...remainingScriptureSlides);
      
      console.log(`📊 Total slides generated: ${allSlides.length} (${scriptureSlides.length} scripture + ${pointSlides.length} points + 1 title)`);

      // Update order
      allSlides.forEach((slide, index) => {
        slide.order = index;
      });

      setGeneratedSlides(allSlides);
      setSlidePreview({
        scriptures: scriptureSlides.length,
        points: pointSlides.length,
        total: allSlides.length
      });

      // Initialize backgrounds and layouts
      const initialBackgrounds: (BackgroundImage | null)[] = allSlides.map(() => null);
      const initialLayouts: LayoutType[] = allSlides.map(() => 'center' as LayoutType);
      setSlideBackgrounds(initialBackgrounds);
      setSlideLayouts(initialLayouts);

      // Complete
      setCurrentStep('complete');
      setProgress(100);
      console.log(`✅ Complete! Generated ${allSlides.length} slides`);

      // Auto-open slide editor
      setTimeout(() => {
        setShowSlideEditor(true);
      }, 500);

    } catch (err) {
      console.error('❌ Error processing sermon notes:', err);
      setError(err instanceof Error ? err.message : 'Failed to process sermon notes');
      setCurrentStep('upload');
      setProgress(0);
    } finally {
      setProcessing(false);
    }
  };

  const handleAdd = () => {
    if (generatedSlides.length === 0) return;
    onAddSlides(generatedSlides, sermonTitle, parsedText);
    handleClose();
  };

  const handleSaveSlides = (
    updatedSlides: Slide[],
    updatedBackgrounds: (BackgroundImage | null)[],
    updatedLayouts: LayoutType[]
  ) => {
    console.log('💾 Saving edited sermon slides');
    setGeneratedSlides(updatedSlides);
    setSlideBackgrounds(updatedBackgrounds);
    setSlideLayouts(updatedLayouts);
    setShowSlideEditor(false);
    
    // Automatically add to service after editing
    onAddSlides(updatedSlides, sermonTitle, parsedText);
    handleClose();
  };

  const handleClose = () => {
    setSelectedFile(null);
    setParsedText('');
    setGeneratedSlides([]);
    setSlidePreview(null);
    setError('');
    setCurrentStep('upload');
    setProgress(0);
    setProcessing(false);
    onClose();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setError('');
  };

  const stepLabels: Record<ProcessingStep, string> = {
    upload: 'Upload file',
    parsing: 'Parsing document...',
    analyzing: 'Analyzing with AI...',
    fetching: 'Fetching scripture texts...',
    generating: 'Generating slides...',
    complete: 'Complete!'
  };

  if (showSlideEditor) {
    return (
      <SermonSlideEditor
        slides={generatedSlides}
        backgrounds={slideBackgrounds}
        layouts={slideLayouts}
        sermonNotes={parsedText}
        onSave={handleSaveSlides}
        onClose={() => setShowSlideEditor(false)}
        sermonTitle={sermonTitle}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <FileText size={24} className="text-purple-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Add Sermon Slides</h2>
              <p className="text-sm text-gray-600 mt-0.5">
                Upload your sermon notes and AI will create slides
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={processing}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* File Upload Section */}
          {!selectedFile && currentStep === 'upload' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Upload Sermon Notes
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                <p className="text-gray-600 mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Supports: .txt, .docx, .pdf (max 5MB)
                </p>
                <input
                  type="file"
                  accept=".txt,.doc,.docx,.pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                  disabled={processing}
                />
                <label
                  htmlFor="file-upload"
                  className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer font-medium"
                >
                  Choose File
                </label>
              </div>

              {/* Scripture Settings */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <BookOpen size={18} className="text-purple-600" />
                  Scripture Options
                </h3>
                
                {/* Bible Translation Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bible Translation
                  </label>
                  <select
                    value={bibleTranslation}
                    onChange={(e) => setBibleTranslation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    disabled={processing}
                  >
                    <option value="NIV">NIV - New International Version</option>
                    <option value="ESV">ESV - English Standard Version</option>
                    <option value="KJV">KJV - King James Version</option>
                    <option value="NKJV">NKJV - New King James Version</option>
                    <option value="NLT">NLT - New Living Translation</option>
                    <option value="NASB">NASB - New American Standard Bible</option>
                    <option value="CSB">CSB - Christian Standard Bible</option>
                  </select>
                </div>

                {/* Include All Scriptures Checkbox */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeAllScriptures}
                    onChange={(e) => setIncludeAllScriptures(e.target.checked)}
                    className="mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Include All Scripture References</p>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {includeAllScriptures 
                        ? '✅ Extracts EVERY scripture reference (main texts, supporting verses, illustrations)'
                        : '📌 Extracts only FOUNDATIONAL scriptures that carry the sermon message'}
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Selected File */}
          {selectedFile && currentStep === 'upload' && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="text-purple-600" size={24} />
                  <div>
                    <p className="font-medium text-gray-900">{selectedFile.name}</p>
                    <p className="text-sm text-gray-600">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleRemoveFile}
                  className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
                  disabled={processing}
                >
                  <Trash2 size={18} className="text-gray-600" />
                </button>
              </div>
            </div>
          )}

          {/* Processing Steps */}
          {processing && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Loader2 className="animate-spin text-purple-600" size={24} />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{stepLabels[currentStep]}</p>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-600 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Success Preview */}
          {currentStep === 'complete' && generatedSlides.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600 mb-4">
                <CheckCircle2 size={24} />
                <p className="font-semibold text-lg">Slides Generated Successfully!</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Preview</h3>
                  <span className="text-sm text-gray-600 font-medium">{sermonTitle}</span>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-white rounded-lg p-3 border border-gray-200 text-center">
                    <p className="text-2xl font-bold text-blue-600">{slidePreview?.scriptures || 0}</p>
                    <p className="text-xs text-gray-600 mt-1">Scripture Slides</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-gray-200 text-center">
                    <p className="text-2xl font-bold text-purple-600">{slidePreview?.points || 0}</p>
                    <p className="text-xs text-gray-600 mt-1">Point Slides</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-gray-200 text-center">
                    <p className="text-2xl font-bold text-green-600">{slidePreview?.total || 0}</p>
                    <p className="text-xs text-gray-600 mt-1">Total Slides</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-300 max-h-64 overflow-y-auto">
                  <div className="divide-y divide-gray-200">
                    {generatedSlides.map((slide, index) => (
                      <div key={slide.id} className="p-3 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-xs font-semibold">
                            {index + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                                slide.content.includes('Point') || slide.content.includes('1.') || slide.content.includes('2.') || slide.content.includes('3.')
                                  ? 'bg-purple-100 text-purple-700'
                                  : index === 0
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}>
                                {index === 0 ? '📖 Title' :
                                 slide.content.includes('Point') || slide.content.includes('1.') || slide.content.includes('2.') || slide.content.includes('3.')
                                  ? '🎯 Point'
                                  : '📜 Scripture'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-900 line-clamp-3 whitespace-pre-wrap">
                              {slide.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-medium text-red-900">Error</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={handleClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            disabled={processing}
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            {selectedFile && currentStep === 'upload' && (
              <button
                onClick={handleProcess}
                disabled={processing}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Generate Slides
              </button>
            )}

            {currentStep === 'complete' && (
              <button
                onClick={handleAdd}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Add to Service
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

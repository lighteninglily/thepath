import { X, Save, Type, Undo, Redo, Copy, Files, ArrowUp, ArrowDown, RefreshCw, Image as ImageIcon, Palette } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { VisualCanvas } from '../designer/VisualCanvas';
import { useHistory } from '../../hooks/useHistory';
import { WORSHIP_BACKGROUNDS } from '../../assets/backgrounds';
import { TemplatePickerModal } from './TemplatePickerModal';
import { uploadImageFile, getAllImages, type StoredImage } from '../../utils/imageStorage';
import { AssetPickerModal } from './AssetPickerModal';
import { getRecommendedSize } from '../../utils/brandAssetStorage';
import type { BrandAsset } from '../../types/brandAsset';
import { FONT_COMBINATIONS, applyFontCombination, isLikelyHeading } from '../../config/fontCombinations';
import { AddScriptureModal } from './AddScriptureModal';
import type { ServiceItem } from '../../types/service';
import type { SlideTemplate } from '../../config/slideTemplatesFixed';

interface VisualItemEditorModalProps {
  item: ServiceItem | null;
  allItems?: ServiceItem[];
  itemIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: ServiceItem) => void;
}

export function VisualItemEditorModal({ item, allItems, itemIndex, isOpen, onClose, onSave }: VisualItemEditorModalProps) {
  const { state: slide, setState: setSlide, undo, redo, canUndo, canRedo } = useHistory<any | null>(null);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [copiedElement, setCopiedElement] = useState<any | null>(null);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [showAssetPicker, setShowAssetPicker] = useState(false);
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [showScriptureLookup, setShowScriptureLookup] = useState(false);
  const [, setUploadedImages] = useState<StoredImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (item && item.content) {
      console.log('🔵 TEMPLATE LOAD START:', item.title || item.id);
      console.log('🔵 Item content type:', typeof item.content);
      
      try {
        // Parse visualData from content
        const visualData = typeof item.content === 'string'
          ? JSON.parse(item.content)
          : item.content;
        
        console.log('🔵 Parsed visualData:', {
          backgroundImage: visualData.backgroundImage?.slice(0, 50),
          backgroundColor: visualData.backgroundColor,
          elementCount: visualData.elements?.length
        });
        
        // Convert template elements to VisualCanvas format
        const elements = (visualData.elements || []).map((el: any, index: number) => {
          console.log(`🔵 Converting element ${index}:`, {
            id: el.id,
            type: el.type,
            content: el.content?.slice(0, 30),
            position: el.position,
            size: el.size
          });
          
          // Create element with ALL required properties
          const convertedElement = {
            // Core properties (REQUIRED)
            id: el.id || `element_${Date.now()}_${index}`,
            type: el.type || 'text',
            content: el.content || '',
            
            // Position (NEVER MODIFY - use exact values from template)
            position: {
              x: el.position?.x ?? 0,
              y: el.position?.y ?? 0
            },
            
            // Size
            size: {
              width: el.size?.width ?? 400,
              height: el.size?.height ?? 100
            },
            
            // Visibility & interaction
            visible: el.visible !== false,  // Default true
            locked: el.locked || false,
            rotation: el.rotation || 0,
            opacity: el.opacity !== undefined ? el.opacity : 1,
            zIndex: el.zIndex !== undefined ? el.zIndex : 10,
            
            // Style object (nested structure for VisualCanvas)
            style: {
              color: el.color || el.style?.color || '#000000',
              backgroundColor: el.backgroundColor || el.style?.backgroundColor || 'transparent',
              fontFamily: el.fontFamily || el.style?.fontFamily || 'Inter',
              fontSize: el.fontSize || el.style?.fontSize || 24,
              fontWeight: el.fontWeight || el.style?.fontWeight || 400,
              fontStyle: el.fontStyle || el.style?.fontStyle || 'normal',
              textAlign: el.textAlign || el.style?.textAlign || 'left',
              textTransform: 'none' as const,
              textDecoration: 'none' as const,
              lineHeight: 1.2,
              letterSpacing: 0,
              borderRadius: el.borderRadius || el.style?.borderRadius || 0,
              textShadow: el.textShadow || el.style?.textShadow,
            }
          };
          
          console.log(`✅ Converted element ${index}:`, {
            id: convertedElement.id,
            type: convertedElement.type,
            position: convertedElement.position,
            size: convertedElement.size,
            visible: convertedElement.visible,
            fontSize: convertedElement.style.fontSize,
            color: convertedElement.style.color
          });
          
          return convertedElement;
        });
        
        console.log('✅ Total converted elements:', elements.length);
        
        // Create background object
        const background = visualData.backgroundImage ? {
          type: 'image' as const,
          imageUrl: visualData.backgroundImage
        } : {
          type: 'solid' as const,
          color: visualData.backgroundColor || '#E8E3DC'
        };
        
        console.log('🎨 Background:', background);
        
        // Create slide object
        const convertedSlide: any = {
          id: item.id,
          elements,
          background,
          content: '',
          order: 0,
          aspectRatio: '16:9' as const,
          padding: { top: 0, right: 0, bottom: 0, left: 0 },
          isVisualMode: true,
        };
        
        console.log('🎨 Final slide:', {
          id: convertedSlide.id,
          elementCount: convertedSlide.elements.length,
          backgroundType: convertedSlide.background.type,
          backgroundUrl: convertedSlide.background.imageUrl?.slice(0, 50)
        });
        
        setSlide(convertedSlide);
        
      } catch (error) {
        console.error('❌ TEMPLATE LOAD FAILED:', error);
        console.error('❌ Item content:', item.content);
        
        // Create empty slide if parsing fails
        setSlide({
          id: item.id,
          elements: [],
          background: { type: 'solid', color: '#E8E3DC' },
          content: '',
          order: 0,
          aspectRatio: '16:9' as const,
          padding: { top: 0, right: 0, bottom: 0, left: 0 },
          isVisualMode: true,
        });
      }
    }
  }, [item]);

  // Load uploaded images when modal opens
  useEffect(() => {
    if (isOpen) {
      setUploadedImages(getAllImages());
    }
  }, [isOpen]);

  // Copy element
  const handleCopy = () => {
    if (!selectedElementId || !slide) return;
    const element = slide.elements.find((el: any) => el.id === selectedElementId);
    if (element) {
      setCopiedElement(element);
      console.log('📋 Element copied:', element.id);
    }
  };

  // Paste element
  const handlePaste = () => {
    if (!copiedElement || !slide) return;
    
    const newElement = {
      ...copiedElement,
      id: `element-${Date.now()}`,
      position: {
        x: copiedElement.position.x + 20,
        y: copiedElement.position.y + 20
      }
    };
    
    setSlide({
      ...slide,
      elements: [...slide.elements, newElement]
    });
    setSelectedElementId(newElement.id);
    console.log('📌 Element pasted:', newElement.id);
  };

  // Duplicate element
  const handleDuplicate = () => {
    if (!selectedElementId || !slide) return;
    const element = slide.elements.find((el: any) => el.id === selectedElementId);
    if (!element) return;
    
    const newElement = {
      ...element,
      id: `element-${Date.now()}`,
      position: {
        x: element.position.x + 20,
        y: element.position.y + 20
      }
    };
    
    setSlide({
      ...slide,
      elements: [...slide.elements, newElement]
    });
    setSelectedElementId(newElement.id);
    console.log('✨ Element duplicated:', newElement.id);
  };

  // Bring element forward
  const handleBringForward = () => {
    if (!selectedElementId || !slide) return;
    
    const selectedElement = slide.elements.find((el: any) => el.id === selectedElementId);
    if (!selectedElement) return;
    
    const currentZIndex = selectedElement.zIndex || 0;
    const newZIndex = currentZIndex + 1;
    
    // Update the element's zIndex
    const updatedElements = slide.elements.map((el: any) => {
      if (el.id === selectedElementId) {
        return { ...el, zIndex: newZIndex };
      }
      return el;
    });
    
    setSlide({
      ...slide,
      elements: updatedElements
    });
    
    console.log('⬆️ Element brought forward - zIndex:', currentZIndex, '→', newZIndex);
  };

  // Send element backward
  const handleSendBackward = () => {
    if (!selectedElementId || !slide) return;
    
    const selectedElement = slide.elements.find((el: any) => el.id === selectedElementId);
    if (!selectedElement) return;
    
    const currentZIndex = selectedElement.zIndex || 0;
    const newZIndex = Math.max(0, currentZIndex - 1); // Don't go below 0
    
    // Update the element's zIndex
    const updatedElements = slide.elements.map((el: any) => {
      if (el.id === selectedElementId) {
        return { ...el, zIndex: newZIndex };
      }
      return el;
    });
    
    setSlide({
      ...slide,
      elements: updatedElements
    });
    
    console.log('⬇️ Element sent backward - zIndex:', currentZIndex, '→', newZIndex);
  };

  // Delete element
  const handleDelete = () => {
    if (!selectedElementId || !slide) return;
    
    setSlide({
      ...slide,
      elements: slide.elements.filter((el: any) => el.id !== selectedElementId)
    });
    setSelectedElementId(null);
    console.log('🗑️ Element deleted');
  };

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;
      
      // Undo (Ctrl/Cmd+Z)
      if (cmdOrCtrl && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
        console.log('↩️ Undo');
        return;
      }
      
      // Redo (Ctrl/Cmd+Shift+Z or Ctrl/Cmd+Y)
      if (cmdOrCtrl && ((e.key === 'z' && e.shiftKey) || e.key === 'y')) {
        e.preventDefault();
        redo();
        console.log('↪️ Redo');
        return;
      }
      
      // Copy (Ctrl/Cmd+C)
      if (cmdOrCtrl && e.key === 'c' && selectedElementId) {
        e.preventDefault();
        handleCopy();
        return;
      }
      
      // Paste (Ctrl/Cmd+V)
      if (cmdOrCtrl && e.key === 'v' && copiedElement) {
        e.preventDefault();
        handlePaste();
        return;
      }
      
      // Duplicate (Ctrl/Cmd+D)
      if (cmdOrCtrl && e.key === 'd' && selectedElementId) {
        e.preventDefault();
        handleDuplicate();
        return;
      }
      
      // Bring Forward (Ctrl/Cmd+])
      if (cmdOrCtrl && e.key === ']' && selectedElementId) {
        e.preventDefault();
        handleBringForward();
        return;
      }
      
      // Send Backward (Ctrl/Cmd+[)
      if (cmdOrCtrl && e.key === '[' && selectedElementId) {
        e.preventDefault();
        handleSendBackward();
        return;
      }
      
      // Delete key - delete selected element
      if (e.key === 'Delete' && selectedElementId) {
        e.preventDefault();
        handleDelete();
        return;
      }
      
      // Escape key - deselect
      if (e.key === 'Escape') {
        e.preventDefault();
        setSelectedElementId(null);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedElementId, slide, copiedElement, canUndo, canRedo]);

  if (!isOpen || !item || !slide) return null;

  const handleUpdateElement = (elementId: string, updates: any) => {
    if (!slide) return;

    const updatedElements = slide.elements.map((el: any) => {
      if (el.id !== elementId) return el;
      
      // Update both top-level and style object
      const updated = {
        ...el,
        ...updates,
        style: {
          ...el.style,
          // Sync specific properties to style (preserve existing style values!)
          fontFamily: updates.fontFamily !== undefined ? updates.fontFamily : (el.style?.fontFamily || el.fontFamily),
          fontSize: updates.fontSize !== undefined ? updates.fontSize : (el.style?.fontSize || el.fontSize),
          fontWeight: updates.fontWeight !== undefined ? updates.fontWeight : (el.style?.fontWeight || el.fontWeight),
          color: updates.color !== undefined ? updates.color : (el.style?.color || el.color),
          textAlign: updates.textAlign !== undefined ? updates.textAlign : (el.style?.textAlign || el.textAlign),
          backgroundColor: updates.backgroundColor !== undefined ? updates.backgroundColor : (el.style?.backgroundColor || el.backgroundColor),
        }
      };
      
      console.log('🔄 Updated element:', elementId, updates);
      return updated;
    });

    setSlide({
      ...slide,
      elements: updatedElements,
    });
  };

  // Handle image upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const savedImage = await uploadImageFile(file, 'custom');
      setUploadedImages(getAllImages());
      
      // Add image to canvas
      handleAddImageElement(savedImage.dataUrl);
      
      console.log('✅ Image uploaded and added to canvas');
    } catch (error) {
      console.error('❌ Image upload failed:', error);
      alert(error instanceof Error ? error.message : 'Failed to upload image');
    }
    
    // Reset input
    if (event.target) event.target.value = '';
  };

  // Add image element to canvas
  const handleAddImageElement = (imageUrl: string) => {
    if (!slide) return;

    const newElement: any = {
      id: `image-${Date.now()}`,
      type: 'image',
      content: imageUrl,
      position: { x: 400, y: 300 },
      size: { width: 400, height: 300 },
      zIndex: 20,
      visible: true,
      locked: false,
      rotation: 0,
      opacity: 1,
      style: {}
    };

    const updatedSlide = {
      ...slide,
      elements: [...slide.elements, newElement],
    };

    setSlide(updatedSlide);
    setSelectedElementId(newElement.id);
    
    console.log('✅ Added image element:', newElement.id);
  };

  // Handle brand asset selection
  const handleSelectBrandAsset = (asset: BrandAsset) => {
    if (!slide) return;

    // Get recommended size for asset type
    const recommendedSize = getRecommendedSize(asset.type);
    
    // Calculate position (center of canvas)
    const position = {
      x: Math.round((1920 - recommendedSize.width) / 2),
      y: Math.round((1080 - recommendedSize.height) / 2),
    };

    const newElement: any = {
      id: `asset-${Date.now()}`,
      type: 'image',
      content: asset.dataUrl,
      position,
      size: recommendedSize,
      zIndex: 20,
      visible: true,
      locked: false,
      rotation: 0,
      opacity: 1,
      style: {}
    };

    const updatedSlide = {
      ...slide,
      elements: [...slide.elements, newElement],
    };

    setSlide(updatedSlide);
    setSelectedElementId(newElement.id);
    
    console.log('✅ Added brand asset:', asset.name, newElement.id);
  };

  const handleAddTextElement = () => {
    if (!slide) return;

    const newElement: any = {
      id: `text-${Date.now()}`,
      type: 'text',
      content: 'New Text',
      position: { x: 400, y: 300 },
      size: { width: 520, height: 100 },
      fontSize: 48,
      fontFamily: 'Outfit',
      fontWeight: 400,
      color: '#2A2A2A',
      textAlign: 'center',
      zIndex: 20,
      visible: true,
      locked: false,
      rotation: 0,
      opacity: 1,
      style: {
        color: '#2A2A2A',
        fontFamily: 'Outfit',
        fontSize: 48,
        fontWeight: 400,
        fontStyle: 'normal',
        textAlign: 'center',
        lineHeight: 1.2,
        letterSpacing: 0,
        textTransform: 'none',
        textDecoration: 'none',
      }
    };

    const updatedSlide = {
      ...slide,
      elements: [...slide.elements, newElement],
    };

    setSlide(updatedSlide);
    
    // Auto-select the new element
    setSelectedElementId(newElement.id);
    
    console.log('✅ Added new text element:', newElement.id);
  };

  // Apply font combination to selected element
  const handleApplyFontCombination = (combinationId: string) => {
    if (!selectedElementId || !slide) return;
    
    const combination = FONT_COMBINATIONS.find(c => c.id === combinationId);
    if (!combination) return;
    
    const element = slide.elements.find((el: any) => el.id === selectedElementId);
    if (!element || element.type !== 'text') return;
    
    // Determine if this element is a heading or body text
    const isHeading = isLikelyHeading(element);
    const updatedElement = applyFontCombination(element, combination, isHeading);
    
    const updatedElements = slide.elements.map((el: any) =>
      el.id === selectedElementId ? updatedElement : el
    );
    
    setSlide({
      ...slide,
      elements: updatedElements,
    });
    
    setShowFontMenu(false);
    console.log(`✨ Applied ${combination.name} to element:`, selectedElementId);
  };

  // Insert scripture as formatted text elements
  const handleInsertScripture = (scripture: { reference: string; text: string; version: string }) => {
    if (!slide) return;
    
    console.log('📖 Inserting scripture:', scripture.reference);
    
    // Create reference text element
    const refElement: any = {
      id: `scripture-ref-${Date.now()}`,
      type: 'text',
      content: scripture.reference.toUpperCase(),
      position: { x: 360, y: 200 },
      size: { width: 1200, height: 80 },
      fontSize: 36,
      fontFamily: 'Inter',
      fontWeight: 600,
      color: '#ffd700',
      textAlign: 'center',
      zIndex: 20,
      visible: true,
      locked: false,
      rotation: 0,
      opacity: 1,
    };
    
    // Create scripture text element
    const textElement: any = {
      id: `scripture-text-${Date.now()}`,
      type: 'text',
      content: scripture.text,
      position: { x: 260, y: 320 },
      size: { width: 1400, height: 500 },
      fontSize: 48,
      fontFamily: 'Georgia, serif',
      fontWeight: 400,
      color: '#ffffff',
      textAlign: 'center',
      zIndex: 20,
      visible: true,
      locked: false,
      rotation: 0,
      opacity: 1,
    };
    
    const updatedSlide = {
      ...slide,
      elements: [...slide.elements, refElement, textElement],
    };
    
    setSlide(updatedSlide);
    setSelectedElementId(refElement.id);
    setShowScriptureLookup(false);
    
    console.log('✅ Scripture inserted successfully');
  };

  const handleChangeTemplate = (template: SlideTemplate) => {
    console.log('🔄 Changing to template:', template.name);
    
    // Convert template elements to VisualCanvas format
    const elements = (template.visualData.elements || []).map((el: any, index: number) => ({
      id: el.id || `element_${Date.now()}_${index}`,
      type: el.type || 'text',
      content: el.content || '',
      position: {
        x: el.position?.x ?? 0,
        y: el.position?.y ?? 0
      },
      size: {
        width: el.size?.width ?? 400,
        height: el.size?.height ?? 100
      },
      visible: el.visible !== false,
      locked: el.locked || false,
      rotation: el.rotation || 0,
      opacity: el.opacity !== undefined ? el.opacity : 1,
      zIndex: el.zIndex !== undefined ? el.zIndex : 10,
      style: {
        color: el.color || el.style?.color || '#000000',
        backgroundColor: el.backgroundColor || el.style?.backgroundColor || 'transparent',
        fontFamily: el.fontFamily || el.style?.fontFamily || 'Inter',
        fontSize: el.fontSize || el.style?.fontSize || 24,
        fontWeight: el.fontWeight || el.style?.fontWeight || 400,
        fontStyle: el.fontStyle || el.style?.fontStyle || 'normal',
        textAlign: el.textAlign || el.style?.textAlign || 'left',
        textTransform: 'none' as const,
        textDecoration: 'none' as const,
        lineHeight: 1.2,
        letterSpacing: 0,
        borderRadius: el.borderRadius || el.style?.borderRadius || 0,
        textShadow: el.textShadow || el.style?.textShadow,
      }
    }));

    setSlide({
      background: {
        type: template.visualData.backgroundGradient ? 'gradient' : 'color',
        color: template.visualData.backgroundColor || '#FFFFFF',
        gradient: template.visualData.backgroundGradient,
      },
      elements
    });
    
    setSelectedElementId(null);
    setShowTemplatePicker(false);
    console.log('✅ Template changed successfully');
  };

  const handleSave = () => {
    if (!slide) return;

    // Convert back to template format
    const visualData = {
      elements: slide.elements,
      backgroundType: slide.background?.type === 'image' ? 'image' : 'color',
      backgroundColor: slide.background?.color,
      backgroundImage: slide.background?.imageUrl,
      backgroundGradient: slide.background?.gradient,
    };

    const updatedItem: ServiceItem = {
      ...item,
      content: JSON.stringify(visualData),
    };

    onSave(updatedItem);
    onClose();
  };

  const selectedElement = slide?.elements?.find((el: any) => el.id === selectedElementId);

  // Get display title with auto-numbering for announcements/sermons
  const getItemDisplayTitle = () => {
    if (!item) return 'Template';
    
    // Announcements get auto-numbered
    if (item.type === 'announcement' && allItems && itemIndex !== undefined) {
      const announcementNumber = allItems
        .slice(0, itemIndex)
        .filter(i => i.type === 'announcement').length + 1;
      
      if (item.title && item.title !== 'Announcement') {
        return `Announcement ${announcementNumber}: ${item.title}`;
      }
      return `Announcement ${announcementNumber}`;
    }
    
    // Sermons get auto-numbered
    if (item.type === 'sermon' && allItems && itemIndex !== undefined) {
      const sermonNumber = allItems
        .slice(0, itemIndex)
        .filter(i => i.type === 'sermon').length + 1;
      
      if (item.title && item.title !== 'Sermon') {
        return `Sermon ${sermonNumber}: ${item.title}`;
      }
      return `Sermon ${sermonNumber}`;
    }
    
    // Everything else
    return item.title || item.type || 'Template';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      <div className="bg-white rounded-xl shadow-2xl w-full h-full max-w-[95vw] max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-brand-warmGray bg-brand-offWhite">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-brand-charcoal">
              Edit {getItemDisplayTitle()}
            </h2>
            <span className="text-sm text-brand-umber">
              Visual Editor
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Undo/Redo */}
            <div className="flex items-center gap-1 border-r border-brand-warmGray pr-2">
              <button
                onClick={undo}
                disabled={!canUndo}
                className="p-2 hover:bg-brand-warmGray rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Undo (Ctrl+Z)"
              >
                <Undo className="w-4 h-4 text-brand-umber" />
              </button>
              <button
                onClick={redo}
                disabled={!canRedo}
                className="p-2 hover:bg-brand-warmGray rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Redo (Ctrl+Shift+Z)"
              >
                <Redo className="w-4 h-4 text-brand-umber" />
              </button>
            </div>
            
            {/* Element Actions */}
            <div className="flex items-center gap-1 border-r border-brand-warmGray pr-2">
              <button
                onClick={handleCopy}
                disabled={!selectedElementId}
                className="p-2 hover:bg-brand-warmGray rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Copy (Ctrl+C)"
              >
                <Copy className="w-4 h-4 text-brand-umber" />
              </button>
              <button
                onClick={handleDuplicate}
                disabled={!selectedElementId}
                className="p-2 hover:bg-brand-warmGray rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Duplicate (Ctrl+D)"
              >
                <Files className="w-4 h-4 text-brand-umber" />
              </button>
            </div>
            
            {/* Layer Management */}
            <div className="flex items-center gap-1 border-r border-brand-warmGray pr-2">
              <button
                onClick={handleBringForward}
                disabled={!selectedElementId}
                className="p-2 hover:bg-brand-warmGray rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Bring Forward (Ctrl+])"
              >
                <ArrowUp className="w-4 h-4 text-brand-umber" />
              </button>
              <button
                onClick={handleSendBackward}
                disabled={!selectedElementId}
                className="p-2 hover:bg-brand-warmGray rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Send Backward (Ctrl+[)"
              >
                <ArrowDown className="w-4 h-4 text-brand-umber" />
              </button>
            </div>
            
            {/* Change Template */}
            <button
              onClick={() => setShowTemplatePicker(true)}
              className="px-4 py-2 bg-brand-taupe hover:bg-opacity-90 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
              title="Change to a different template"
            >
              <RefreshCw className="w-4 h-4" />
              Change Template
            </button>
            
            {/* Brand Assets */}
            <button
              onClick={() => setShowAssetPicker(true)}
              className="px-4 py-2 bg-brand-skyBlue hover:bg-brand-powderBlue text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
              title="Insert from brand assets library"
            >
              <Files className="w-4 h-4" />
              Brand Assets
            </button>
            
            {/* Insert Scripture */}
            <button
              onClick={() => setShowScriptureLookup(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
              title="Insert scripture verse"
            >
              <Type className="w-4 h-4" />
              Insert Scripture
            </button>
            
            {/* Add Image */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
              title="Upload and add new image"
            >
              <ImageIcon className="w-4 h-4" />
              Upload
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            
            {/* Add Text */}
            <button
              onClick={handleAddTextElement}
              className="px-4 py-2 bg-brand-skyBlue hover:bg-opacity-90 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Type className="w-4 h-4" />
              Add Text
            </button>
            
            {/* Font Combinations */}
            <div className="relative">
              <button
                onClick={() => setShowFontMenu(!showFontMenu)}
                disabled={!selectedElementId || selectedElement?.type !== 'text'}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Apply font combination to selected text"
              >
                <Palette className="w-4 h-4" />
                Font Style
              </button>
              
              {/* Font Menu Dropdown */}
              {showFontMenu && selectedElementId && selectedElement?.type === 'text' && (
                <div className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-xl border border-gray-200 z-50 w-72 max-h-96 overflow-y-auto">
                  <div className="p-3 border-b border-gray-200">
                    <p className="text-xs font-semibold text-gray-600 uppercase">Quick Font Styles</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {isLikelyHeading(selectedElement) ? 'Heading style' : 'Body text style'}
                    </p>
                  </div>
                  {FONT_COMBINATIONS.map((combo) => (
                    <button
                      key={combo.id}
                      onClick={() => handleApplyFontCombination(combo.id)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">
                            {combo.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">{combo.description}</p>
                          <div className="mt-2 text-xs text-gray-400">
                            <span style={{ fontFamily: isLikelyHeading(selectedElement) ? combo.heading.fontFamily : combo.body.fontFamily }}>
                              Preview Text
                            </span>
                          </div>
                        </div>
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">
                          {combo.category}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Save & Close */}
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-brand-clay hover:bg-opacity-90 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-brand-warmGray rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-brand-umber" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Canvas Area */}
          <div className="flex-1 bg-gray-900 p-8 overflow-hidden">
            <VisualCanvas
              slide={slide}
              selectedElementId={selectedElementId}
              onSelectElement={setSelectedElementId}
              onUpdateElement={handleUpdateElement}
              zoom={1}
            />
          </div>

          {/* Properties Panel */}
          <div className="w-80 bg-white border-l border-brand-warmGray p-4 overflow-y-auto">
            <h3 className="font-semibold text-brand-charcoal mb-4">Properties</h3>

            {/* Background Section (always visible) */}
            {!selectedElement && (
              <div className="space-y-4 mb-6">
                <h4 className="font-medium text-brand-charcoal text-sm">Slide Background</h4>
                
                {/* Background Type */}
                <div>
                  <label className="block text-xs font-medium text-brand-umber mb-1">
                    Background Type
                  </label>
                  <select
                    value={slide.background?.type || 'solid'}
                    onChange={(e) => {
                      const newType = e.target.value as 'solid' | 'image';
                      setSlide({
                        ...slide,
                        background: {
                          type: newType,
                          color: newType === 'solid' ? '#E8E3DC' : undefined,
                          imageUrl: newType === 'image' ? 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1920&q=80' : undefined,
                        }
                      });
                    }}
                    className="w-full px-3 py-2 border border-brand-warmGray rounded-lg text-sm"
                  >
                    <option value="solid">Solid Color</option>
                    <option value="image">Image</option>
                  </select>
                </div>

                {/* Solid Color */}
                {slide.background?.type === 'solid' && (
                  <div>
                    <label className="block text-xs font-medium text-brand-umber mb-1">
                      Background Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={slide.background.color || '#E8E3DC'}
                        onChange={(e) => setSlide({
                          ...slide,
                          background: { ...slide.background, color: e.target.value }
                        })}
                        className="w-12 h-10 border border-brand-warmGray rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={slide.background.color || '#E8E3DC'}
                        onChange={(e) => setSlide({
                          ...slide,
                          background: { ...slide.background, color: e.target.value }
                        })}
                        className="flex-1 px-3 py-2 border border-brand-warmGray rounded-lg text-sm font-mono"
                      />
                    </div>
                  </div>
                )}

                {/* Image URL */}
                {slide.background?.type === 'image' && (
                  <div>
                    <label className="block text-xs font-medium text-brand-umber mb-1">
                      Image URL
                    </label>
                    <textarea
                      value={slide.background.imageUrl || ''}
                      onChange={(e) => setSlide({
                        ...slide,
                        background: { ...slide.background, imageUrl: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-brand-warmGray rounded-lg text-sm resize-none font-mono"
                      rows={3}
                      placeholder="https://..."
                    />
                    <p className="text-xs text-brand-umber mt-1">Background Library ({WORSHIP_BACKGROUNDS.length} backgrounds):</p>
                    <div className="mt-2 max-h-64 overflow-y-auto border border-brand-warmGray rounded-lg p-2">
                      <div className="grid grid-cols-4 gap-2">
                        {WORSHIP_BACKGROUNDS.map((bg) => (
                          <button
                            key={bg.id}
                            onClick={() => setSlide({
                              ...slide,
                              background: { ...slide.background, type: 'image', imageUrl: bg.url }
                            })}
                            className="group relative aspect-video rounded overflow-hidden border-2 border-transparent hover:border-brand-skyBlue transition-all"
                            title={bg.name}
                          >
                            <img 
                              src={bg.url} 
                              alt={bg.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-white text-xs font-medium text-center px-1">
                                {bg.name}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 italic">
                      Categories: Mountains, Nature, Water, Sky, Light, Waves, Clouds, Cross
                    </p>
                  </div>
                )}
              </div>
            )}

            {selectedElement ? (
              <div className="space-y-4">
                {/* Element Type */}
                <div>
                  <label className="block text-xs font-medium text-brand-umber mb-1">
                    Type
                  </label>
                  <div className="text-sm text-brand-charcoal capitalize">
                    {selectedElement.type}
                  </div>
                </div>

                {/* Text Content (for text elements) */}
                {selectedElement.type === 'text' && (
                  <div>
                    <label className="block text-xs font-medium text-brand-umber mb-1">
                      Text Content
                    </label>
                    <textarea
                      value={selectedElement.content || ''}
                      onChange={(e) => handleUpdateElement(selectedElement.id, { content: e.target.value })}
                      className="w-full px-3 py-2 border border-brand-warmGray rounded-lg text-sm resize-none"
                      rows={3}
                    />
                  </div>
                )}

                {/* Font Size */}
                {selectedElement.type === 'text' && (
                  <div>
                    <label className="block text-xs font-medium text-brand-umber mb-1">
                      Font Size
                    </label>
                    <input
                      type="number"
                      value={selectedElement.fontSize || selectedElement.style?.fontSize || 48}
                      onChange={(e) => handleUpdateElement(selectedElement.id, { fontSize: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-brand-warmGray rounded-lg text-sm"
                      min="8"
                      max="300"
                    />
                  </div>
                )}

                {/* Font Weight */}
                {selectedElement.type === 'text' && (
                  <div>
                    <label className="block text-xs font-medium text-brand-umber mb-1">
                      Font Weight
                    </label>
                    <select
                      value={selectedElement.fontWeight || selectedElement.style?.fontWeight || 400}
                      onChange={(e) => handleUpdateElement(selectedElement.id, { fontWeight: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-brand-warmGray rounded-lg text-sm"
                    >
                      <option value="100">Thin (100)</option>
                      <option value="200">Extra Light (200)</option>
                      <option value="300">Light (300)</option>
                      <option value="400">Regular (400)</option>
                      <option value="500">Medium (500)</option>
                      <option value="600">Semi Bold (600)</option>
                      <option value="700">Bold (700)</option>
                      <option value="800">Extra Bold (800)</option>
                      <option value="900">Black (900)</option>
                    </select>
                  </div>
                )}

                {/* Font Family */}
                {selectedElement.type === 'text' && (
                  <div>
                    <label className="block text-xs font-medium text-brand-umber mb-1">
                      Font Family
                    </label>
                    <select
                      value={selectedElement.fontFamily || selectedElement.style?.fontFamily || 'Outfit'}
                      onChange={(e) => handleUpdateElement(selectedElement.id, { fontFamily: e.target.value })}
                      className="w-full px-3 py-2 border border-brand-warmGray rounded-lg text-sm"
                    >
                      <optgroup label="Sans Serif - Modern">
                        <option value="Outfit">Outfit (Modern)</option>
                        <option value="Inter">Inter (Clean)</option>
                        <option value="Poppins">Poppins (Friendly)</option>
                        <option value="Montserrat">Montserrat (Strong)</option>
                        <option value="Roboto">Roboto (Classic)</option>
                        <option value="Open Sans">Open Sans (Readable)</option>
                      </optgroup>
                      <optgroup label="Serif - Traditional">
                        <option value="Playfair Display">Playfair Display (Elegant)</option>
                        <option value="Merriweather">Merriweather (Classic)</option>
                        <option value="Lora">Lora (Beautiful)</option>
                        <option value="Georgia">Georgia (Traditional)</option>
                        <option value="Times New Roman">Times New Roman</option>
                      </optgroup>
                      <optgroup label="Script - Elegant">
                        <option value="Pacifico">Pacifico (Casual)</option>
                        <option value="Dancing Script">Dancing Script (Flowing)</option>
                        <option value="Great Vibes">Great Vibes (Formal)</option>
                        <option value="Satisfy">Satisfy (Relaxed)</option>
                        <option value="Allura">Allura (Sophisticated)</option>
                      </optgroup>
                      <optgroup label="Display - Bold">
                        <option value="Bebas Neue">Bebas Neue (Impact)</option>
                        <option value="Oswald">Oswald (Strong)</option>
                        <option value="Anton">Anton (Bold)</option>
                        <option value="Cinzel">Cinzel (Refined)</option>
                      </optgroup>
                      <optgroup label="Handwriting">
                        <option value="Caveat">Caveat (Handwritten)</option>
                        <option value="Patrick Hand">Patrick Hand (Friendly)</option>
                      </optgroup>
                      <optgroup label="System">
                        <option value="Arial">Arial</option>
                        <option value="Helvetica">Helvetica</option>
                        <option value="Verdana">Verdana</option>
                      </optgroup>
                    </select>
                  </div>
                )}

                {/* Text Color */}
                {selectedElement.type === 'text' && (
                  <div>
                    <label className="block text-xs font-medium text-brand-umber mb-1">
                      Text Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={selectedElement.color || selectedElement.style?.color || '#000000'}
                        onChange={(e) => handleUpdateElement(selectedElement.id, { color: e.target.value })}
                        className="w-12 h-10 border border-brand-warmGray rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={selectedElement.color || selectedElement.style?.color || '#000000'}
                        onChange={(e) => handleUpdateElement(selectedElement.id, { color: e.target.value })}
                        className="flex-1 px-3 py-2 border border-brand-warmGray rounded-lg text-sm font-mono"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                )}

                {/* Text Align */}
                {selectedElement.type === 'text' && (
                  <div>
                    <label className="block text-xs font-medium text-brand-umber mb-1">
                      Text Align
                    </label>
                    <div className="flex gap-1">
                      {(['left', 'center', 'right'] as const).map((align) => (
                        <button
                          key={align}
                          onClick={() => handleUpdateElement(selectedElement.id, { textAlign: align })}
                          className={`flex-1 px-3 py-2 rounded border transition-colors capitalize text-sm ${
                            (selectedElement.textAlign || selectedElement.style?.textAlign) === align
                              ? 'bg-brand-skyBlue text-white border-brand-skyBlue'
                              : 'bg-white text-brand-charcoal border-brand-warmGray hover:bg-brand-warmGray'
                          }`}
                        >
                          {align}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Background Color (for shape elements) */}
                {selectedElement.type === 'shape' && (
                  <div>
                    <label className="block text-xs font-medium text-brand-umber mb-1">
                      Background Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={selectedElement.backgroundColor || '#FFFFFF'}
                        onChange={(e) => handleUpdateElement(selectedElement.id, { backgroundColor: e.target.value })}
                        className="w-12 h-10 border border-brand-warmGray rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={selectedElement.backgroundColor || '#FFFFFF'}
                        onChange={(e) => handleUpdateElement(selectedElement.id, { backgroundColor: e.target.value })}
                        className="flex-1 px-3 py-2 border border-brand-warmGray rounded-lg text-sm font-mono"
                        placeholder="#FFFFFF"
                      />
                    </div>
                  </div>
                )}

                {/* Position */}
                <div>
                  <label className="block text-xs font-medium text-brand-umber mb-2">
                    Position
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-brand-umber mb-1">X</label>
                      <input
                        type="number"
                        value={selectedElement.position.x}
                        onChange={(e) => handleUpdateElement(selectedElement.id, {
                          position: { ...selectedElement.position, x: parseInt(e.target.value) }
                        })}
                        className="w-full px-2 py-1 border border-brand-warmGray rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-brand-umber mb-1">Y</label>
                      <input
                        type="number"
                        value={selectedElement.position.y}
                        onChange={(e) => handleUpdateElement(selectedElement.id, {
                          position: { ...selectedElement.position, y: parseInt(e.target.value) }
                        })}
                        className="w-full px-2 py-1 border border-brand-warmGray rounded text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Size */}
                <div>
                  <label className="block text-xs font-medium text-brand-umber mb-2">
                    Size
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-brand-umber mb-1">Width</label>
                      <input
                        type="number"
                        value={selectedElement.size.width}
                        onChange={(e) => handleUpdateElement(selectedElement.id, {
                          size: { ...selectedElement.size, width: parseInt(e.target.value) }
                        })}
                        className="w-full px-2 py-1 border border-brand-warmGray rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-brand-umber mb-1">Height</label>
                      <input
                        type="number"
                        value={selectedElement.size.height}
                        onChange={(e) => handleUpdateElement(selectedElement.id, {
                          size: { ...selectedElement.size, height: parseInt(e.target.value) }
                        })}
                        className="w-full px-2 py-1 border border-brand-warmGray rounded text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Opacity */}
                <div>
                  <label className="block text-xs font-medium text-brand-umber mb-1 flex items-center justify-between">
                    <span>Opacity</span>
                    <span className="text-xs text-brand-charcoal font-semibold">{Math.round((selectedElement.opacity || 1) * 100)}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={(selectedElement.opacity || 1) * 100}
                    onChange={(e) => handleUpdateElement(selectedElement.id, { opacity: Number(e.target.value) / 100 })}
                    className="w-full"
                  />
                </div>

                {/* Rotation */}
                <div>
                  <label className="block text-xs font-medium text-brand-umber mb-1 flex items-center justify-between">
                    <span>Rotation</span>
                    <span className="text-xs text-brand-charcoal font-semibold">{selectedElement.rotation || 0}°</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={selectedElement.rotation || 0}
                    onChange={(e) => handleUpdateElement(selectedElement.id, { rotation: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => {
                    setSlide({
                      ...slide,
                      elements: slide.elements.filter((el: any) => el.id !== selectedElement.id),
                    });
                    setSelectedElementId(null);
                  }}
                  className="w-full px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors font-medium"
                >
                  Delete Element
                </button>
              </div>
            ) : (
              <div className="text-sm text-brand-umber text-center py-8">
                Click an element on the canvas to edit it
              </div>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="px-4 py-2 border-t border-brand-warmGray bg-brand-offWhite text-xs text-brand-umber">
          <div className="flex items-center justify-between">
            <p>💡 <strong>Click</strong> to select • <strong>Drag</strong> to move • <strong>Delete</strong> to remove • <strong>Esc</strong> to deselect</p>
            <div className="flex items-center gap-4">
              <span><kbd className="px-1 py-0.5 bg-white rounded text-xs">Ctrl+Z</kbd> Undo</span>
              <span><kbd className="px-1 py-0.5 bg-white rounded text-xs">Ctrl+C/V</kbd> Copy/Paste</span>
              <span><kbd className="px-1 py-0.5 bg-white rounded text-xs">Ctrl+D</kbd> Duplicate</span>
              <span><kbd className="px-1 py-0.5 bg-white rounded text-xs">Ctrl+[/]</kbd> Layer</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Asset Picker Modal */}
      <AssetPickerModal
        isOpen={showAssetPicker}
        onClose={() => setShowAssetPicker(false)}
        onSelectAsset={handleSelectBrandAsset}
      />
      
      {/* Template Picker Modal */}
      <TemplatePickerModal
        isOpen={showTemplatePicker}
        category={item?.type as any || 'generic'}
        onClose={() => setShowTemplatePicker(false)}
        onSelectTemplate={handleChangeTemplate}
      />
      
      {/* Scripture Lookup Modal */}
      <AddScriptureModal
        isOpen={showScriptureLookup}
        onClose={() => setShowScriptureLookup(false)}
        onAddScripture={handleInsertScripture}
      />
    </div>
  );
}

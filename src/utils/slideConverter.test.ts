/**
 * Tests for slide conversion - Critical for Visual Editor functionality
 */

import { describe, it, expect } from 'vitest';
import { 
  simpleToVisualSlide, 
  visualToSimpleSlide,
  createEmptyVisualSlide,
  createDefaultTextElement,
  needsMigration 
} from './slideConverter';
import type { Slide } from '../types';

describe('slideConverter', () => {
  
  describe('simpleToVisualSlide', () => {
    it('should convert a basic slide to visual format', () => {
      const simpleSlide: Slide = {
        id: 'slide-1',
        type: 'verse',
        content: 'Amazing grace',
        order: 0,
        backgroundId: 'mountain-1',
        layout: 'full-bleed',
      };

      const visualSlide = simpleToVisualSlide(simpleSlide);

      expect(visualSlide.id).toBe('slide-1');
      expect(visualSlide.content).toBe('Amazing grace');
      expect(visualSlide.order).toBe(0);
      expect(visualSlide.isVisualMode).toBe(true);
      expect(visualSlide.elements).toHaveLength(1);
      expect(visualSlide.elements[0].type).toBe('text');
      expect(visualSlide.elements[0].content).toBe('Amazing grace');
      expect(visualSlide.background.type).toBe('image');
      expect(visualSlide.background.imageUrl).toBe('mountain-1');
    });

    it('should use stored visualData if present', () => {
      const visualData = {
        id: 'slide-1',
        content: 'Modified content',
        order: 0,
        elements: [
          {
            id: 'elem-1',
            type: 'text' as const,
            content: 'Modified in visual editor',
            position: { x: 500, y: 500 },
            size: { width: 800, height: 200 },
            rotation: 0,
            opacity: 1,
            zIndex: 1,
            locked: false,
            visible: true,
            style: {
              fontFamily: 'Inter',
              fontSize: 72,
              fontWeight: 700 as const,
              fontStyle: 'normal' as const,
              textAlign: 'center' as const,
              textTransform: 'uppercase' as const,
              textDecoration: 'none' as const,
              lineHeight: 1.2,
              letterSpacing: 0,
              color: '#ff0000',
            },
          },
        ],
        background: {
          type: 'solid' as const,
          color: '#000000',
        },
        aspectRatio: '16:9' as const,
        padding: { top: 100, right: 160, bottom: 100, left: 160 },
        isVisualMode: true,
      };

      const simpleSlide: Slide = {
        id: 'slide-1',
        type: 'verse',
        content: 'Original content',
        order: 0,
        visualData,
      };

      const result = simpleToVisualSlide(simpleSlide);

      // Should use stored visualData, not create new
      expect(result.elements[0].content).toBe('Modified in visual editor');
      expect(result.elements[0].position.x).toBe(500);
      expect(result.elements[0].position.y).toBe(500);
      expect(result.elements[0].style?.color).toBe('#ff0000');
    });
  });

  describe('visualToSimpleSlide', () => {
    it('should convert visual slide back to simple format with visualData', () => {
      const visualSlide = {
        id: 'slide-1',
        content: 'Amazing grace',
        order: 0,
        elements: [
          {
            id: 'elem-1',
            type: 'text' as const,
            content: 'Amazing grace',
            position: { x: 200, y: 300 },
            size: { width: 600, height: 150 },
            rotation: 0,
            opacity: 1,
            zIndex: 1,
            locked: false,
            visible: true,
            style: {
              fontFamily: 'Inter',
              fontSize: 56,
              fontWeight: 600 as const,
              fontStyle: 'normal' as const,
              textAlign: 'center' as const,
              textTransform: 'none' as const,
              textDecoration: 'none' as const,
              lineHeight: 1.3,
              letterSpacing: 0,
              color: '#ffffff',
            },
          },
        ],
        background: {
          type: 'image' as const,
          imageUrl: 'mountain-1',
        },
        aspectRatio: '16:9' as const,
        padding: { top: 100, right: 160, bottom: 100, left: 160 },
        isVisualMode: true,
      };

      const simpleSlide = visualToSimpleSlide(visualSlide);

      // Should have basic slide properties
      expect(simpleSlide.id).toBe('slide-1');
      expect(simpleSlide.content).toBe('Amazing grace');
      expect(simpleSlide.order).toBe(0);
      expect(simpleSlide.backgroundId).toBe('mountain-1');

      // CRITICAL: Should preserve complete visualData
      expect(simpleSlide.visualData).toBeDefined();
      expect(simpleSlide.visualData.elements).toHaveLength(1);
      expect(simpleSlide.visualData.elements[0].position.x).toBe(200);
      expect(simpleSlide.visualData.elements[0].position.y).toBe(300);
      expect(simpleSlide.visualData.elements[0].style.fontSize).toBe(56);
      expect(simpleSlide.visualData.elements[0].style.color).toBe('#ffffff');
    });

    it('should extract text from multiple elements', () => {
      const visualSlide = {
        id: 'slide-1',
        content: '',
        order: 0,
        elements: [
          {
            id: 'elem-1',
            type: 'text' as const,
            content: 'Line 1',
            position: { x: 0, y: 0 },
            size: { width: 100, height: 50 },
            rotation: 0,
            opacity: 1,
            zIndex: 1,
            locked: false,
            visible: true,
            style: {
              fontFamily: 'Inter',
              fontSize: 48,
              fontWeight: 400 as const,
              fontStyle: 'normal' as const,
              textAlign: 'left' as const,
              textTransform: 'none' as const,
              textDecoration: 'none' as const,
              lineHeight: 1.2,
              letterSpacing: 0,
              color: '#000000',
            },
          },
          {
            id: 'elem-2',
            type: 'text' as const,
            content: 'Line 2',
            position: { x: 0, y: 100 },
            size: { width: 100, height: 50 },
            rotation: 0,
            opacity: 1,
            zIndex: 2,
            locked: false,
            visible: true,
            style: {
              fontFamily: 'Inter',
              fontSize: 48,
              fontWeight: 400 as const,
              fontStyle: 'normal' as const,
              textAlign: 'left' as const,
              textTransform: 'none' as const,
              textDecoration: 'none' as const,
              lineHeight: 1.2,
              letterSpacing: 0,
              color: '#000000',
            },
          },
        ],
        background: {
          type: 'solid' as const,
          color: '#ffffff',
        },
        aspectRatio: '16:9' as const,
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
        isVisualMode: true,
      };

      const simpleSlide = visualToSimpleSlide(visualSlide);

      // Should combine text from all elements
      expect(simpleSlide.content).toContain('Line 1');
      expect(simpleSlide.content).toContain('Line 2');
    });
  });

  describe('round-trip conversion', () => {
    it('should preserve data through complete cycle', () => {
      // Start with simple slide
      const original: Slide = {
        id: 'slide-1',
        type: 'verse',
        content: 'Amazing grace',
        order: 0,
        backgroundId: 'mountain-1',
        layout: 'full-bleed',
      };

      // Convert to visual
      const visual1 = simpleToVisualSlide(original);
      
      // Modify visual data (simulate user edit)
      visual1.elements[0].position.x = 500;
      visual1.elements[0].position.y = 500;
      if ('fontSize' in visual1.elements[0].style) {
        (visual1.elements[0].style as any).fontSize = 100;
      }
      visual1.elements[0].style.color = '#ff0000';

      // Convert back to simple (with visualData)
      const simple1 = visualToSimpleSlide(visual1);

      // Verify visualData is stored
      expect(simple1.visualData).toBeDefined();
      expect(simple1.visualData.elements[0].position.x).toBe(500);
      expect((simple1.visualData.elements[0].style as any).fontSize).toBe(100);

      // Convert back to visual (should use visualData)
      const visual2 = simpleToVisualSlide(simple1);

      // CRITICAL: All modifications should be preserved
      expect(visual2.elements[0].position.x).toBe(500);
      expect(visual2.elements[0].position.y).toBe(500);
      expect((visual2.elements[0].style as any).fontSize).toBe(100);
      expect(visual2.elements[0].style.color).toBe('#ff0000');
    });
  });

  describe('createEmptyVisualSlide', () => {
    it('should create a blank visual slide', () => {
      const slide = createEmptyVisualSlide(5);

      expect(slide.id).toBeDefined();
      expect(slide.order).toBe(5);
      expect(slide.elements).toHaveLength(0);
      expect(slide.isVisualMode).toBe(true);
      expect(slide.background.type).toBe('solid');
    });
  });

  describe('createDefaultTextElement', () => {
    it('should create a default text element', () => {
      const element = createDefaultTextElement('Test text');

      expect(element.type).toBe('text');
      expect(element.content).toBe('Test text');
      expect(element.id).toBeDefined();
      expect(element.position).toBeDefined();
      expect(element.size).toBeDefined();
      expect(element.style).toBeDefined();
      expect(element.style.fontFamily).toBe('Inter');
      expect(element.style.fontSize).toBe(48);
    });
  });

  describe('needsMigration', () => {
    it('should detect simple slides that need migration', () => {
      const simpleSlide = {
        id: 'slide-1',
        content: 'Test',
        order: 0,
      };

      expect(needsMigration(simpleSlide)).toBe(true);
    });

    it('should detect visual slides that do not need migration', () => {
      const visualSlide = {
        id: 'slide-1',
        content: 'Test',
        order: 0,
        elements: [],
      };

      expect(needsMigration(visualSlide)).toBe(false);
    });
  });
});

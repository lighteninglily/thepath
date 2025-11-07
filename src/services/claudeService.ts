/**
 * Claude AI Service for Sermon Analysis
 * Uses Anthropic's Claude 3.5 Sonnet for document understanding
 */

import Anthropic from '@anthropic-ai/sdk';

export interface ScriptureReference {
  reference: string;      // "John 3:16-17"
  book: string;           // "John"
  chapter: number;        // 3
  startVerse: number;     // 16
  endVerse?: number;      // 17 (optional)
  context?: string;       // Text around the reference
}

export interface SermonPoint {
  number: number;         // 1, 2, 3
  title: string;          // "God's Love is Unconditional"
  description?: string;   // Short summary
  scripture?: string;     // Associated verse
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

export class ClaudeService {
  private client: Anthropic | null = null;
  private apiKey: string = '';

  constructor() {
    // API key will be loaded from credentials.json
    // No hardcoded keys for security
    this.loadApiKey();
    
    if (this.apiKey) {
      console.log('🔑 Initializing Anthropic client with API key:', this.apiKey.substring(0, 20) + '...');
      this.client = new Anthropic({
        apiKey: this.apiKey,
        dangerouslyAllowBrowser: true // For Electron development
      });
      console.log('✅ Anthropic client initialized');
    } else {
      console.error('❌ No Anthropic API key found');
    }
  }

  /**
   * Load API key from credentials file
   */
  private async loadApiKey() {
    try {
      const response = await fetch('/docs/credentials.json');
      const credentials = await response.json();
      this.apiKey = credentials.ANTHROPIC_API_KEY || '';
      
      if (this.apiKey) {
        console.log('🔑 Anthropic API key loaded from credentials');
        this.client = new Anthropic({
          apiKey: this.apiKey,
          dangerouslyAllowBrowser: true
        });
      }
    } catch (error) {
      console.error('❌ Failed to load Anthropic API key:', error);
    }
  }

  /**
   * Check if Claude service is configured
   */
  isConfigured(): boolean {
    return this.client !== null;
  }

  /**
   * Analyze sermon notes to extract scriptures and main points
   */
  async analyzeSermonNotes(sermonText: string): Promise<SermonAnalysis> {
    if (!this.client) {
      throw new Error('Claude AI not configured');
    }

    console.log(`🤖 Analyzing sermon notes with Claude (${sermonText.length} characters)...`);
    console.log('🔑 Client initialized:', !!this.client);

    const prompt = `You are analyzing sermon notes to create presentation slides for church services.

Your tasks:
1. Find ALL scripture references in the text (e.g., "John 3:16", "Romans 8:28-30", "1 Cor 13:4-7")
2. Identify the main sermon points (numbered or bulleted sections, typically 2-5 points)
3. Extract the sermon title if present
4. Identify the main scripture text (usually mentioned early)
5. Determine the overall theme

SCRIPTURE DETECTION RULES:
- Look for book names followed by chapter:verse format
- Common formats: "John 3:16", "Romans 8:28-30", "1 Cor. 13:4-7", "Psalm 23:1-6"
- Include both Old and New Testament books
- Include verse ranges (e.g., "16-18")
- Capture surrounding context (a few words before/after)

MAIN POINTS DETECTION:
- Look for numbered sections (Point 1, 1., I., etc.)
- Look for clear headings or subheadings
- Look for repeated formatting patterns
- Each point should have a clear title
- May include supporting scripture

Return JSON in this EXACT format:
{
  "title": "Sermon title or null",
  "mainScripture": "Primary text reference or null",
  "theme": "Main theme in 5-10 words or null",
  "scriptures": [
    {
      "reference": "John 3:16-17",
      "book": "John",
      "chapter": 3,
      "startVerse": 16,
      "endVerse": 17,
      "context": "surrounding text mentioning the verse"
    }
  ],
  "mainPoints": [
    {
      "number": 1,
      "title": "First Point Title",
      "description": "Brief summary if available",
      "scripture": "Related verse if mentioned"
    }
  ],
  "introduction": "Opening paragraph if identifiable",
  "conclusion": "Closing paragraph if identifiable"
}

IMPORTANT:
- If no title is found, set title to null
- If no clear main scripture, set mainScripture to null
- scriptures array can be empty if none found
- mainPoints array can be empty if none found
- Be generous in scripture detection - it's better to include questionable references
- Focus on precision for main points - only include clear, distinct points

Sermon notes to analyze:
${sermonText}`;

    try {
      const message = await this.client.messages.create({
        model: 'claude-3-sonnet-20240229', // Claude 3 Sonnet
        max_tokens: 4000,
        temperature: 0.3, // Low temperature for consistent, accurate extraction
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      // Extract JSON from response
      const content = message.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response format from Claude');
      }

      // Parse JSON response
      let jsonText = content.text;
      
      // Remove markdown code blocks if present
      jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      
      const analysis: SermonAnalysis = JSON.parse(jsonText);

      console.log(`✅ Claude analysis complete:`, {
        title: analysis.title,
        scripturesFound: analysis.scriptures.length,
        pointsFound: analysis.mainPoints.length,
        theme: analysis.theme
      });

      // Validate and clean up data
      return {
        title: analysis.title || undefined,
        mainScripture: analysis.mainScripture || undefined,
        theme: analysis.theme || undefined,
        scriptures: analysis.scriptures || [],
        mainPoints: analysis.mainPoints || [],
        introduction: analysis.introduction || undefined,
        conclusion: analysis.conclusion || undefined
      };

    } catch (error) {
      console.error('❌ Error analyzing sermon with Claude:', error);
      throw new Error(`Failed to analyze sermon: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Suggest a title if none was found in the notes
   */
  async suggestSermonTitle(
    mainScripture?: string,
    theme?: string,
    points?: SermonPoint[]
  ): Promise<string> {
    if (!this.client) {
      throw new Error('Claude AI not configured');
    }

    const prompt = `Generate a compelling sermon title based on:
${mainScripture ? `Main Scripture: ${mainScripture}` : ''}
${theme ? `Theme: ${theme}` : ''}
${points && points.length > 0 ? `Main Points:\n${points.map(p => `- ${p.title}`).join('\n')}` : ''}

Requirements:
- Catchy and memorable
- 3-7 words
- Theologically sound
- Relevant to the content
- NOT a question

Return ONLY the title text, no explanation.`;

    try {
      const message = await this.client.messages.create({
        model: 'claude-3-sonnet-20240229', // Claude 3 Sonnet
        max_tokens: 100,
        temperature: 0.7,
        messages: [{ role: 'user', content: prompt }]
      });

      const content = message.content[0];
      if (content.type !== 'text') {
        return 'Untitled Sermon';
      }

      return content.text.trim().replace(/["""]/g, '');

    } catch (error) {
      console.error('❌ Error suggesting title:', error);
      return 'Untitled Sermon';
    }
  }
}

export const claudeService = new ClaudeService();

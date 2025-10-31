import OpenAI from 'openai';

export interface SongAnalysis {
  mood: 'joyful' | 'reflective' | 'celebratory' | 'peaceful' | 'powerful' | 'reverent';
  energy: 'high' | 'medium' | 'low';
  theme: 'praise' | 'worship' | 'hope' | 'grace' | 'love' | 'faith' | 'victory';
  colorSuggestion: 'warm' | 'cool' | 'vibrant' | 'soft' | 'dark' | 'light';
  recommendedStyle: 'modern' | 'traditional' | 'minimalist' | 'bold' | 'elegant';
  season?: 'christmas' | 'easter' | 'general';
  suggestedThemePack?: 'mountains' | 'waves' | 'clouds' | 'nature' | 'abstract';
}

export interface SlideBreakdown {
  slides: Array<{
    content: string;
    type: 'verse' | 'chorus' | 'bridge' | 'intro' | 'outro';
    order: number;
  }>;
}

export class OpenAIService {
  private client: OpenAI | null = null;

  constructor() {
    // Get API key from environment or credentials
    const apiKey = (import.meta as any).env?.VITE_OPENAI_API_KEY;
    if (apiKey && apiKey !== 'your_openai_key') {
      this.client = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true // For development - use backend in production
      });
    }
  }

  /**
   * Analyze song mood, theme, and recommend design choices
   */
  async analyzeSong(
    title: string,
    artist: string,
    lyrics: string
  ): Promise<SongAnalysis> {
    if (!this.client) {
      throw new Error('OpenAI not configured');
    }

    const response = await this.client.chat.completions.create({
      model: 'gpt-5-nano', // Fastest, cheapest GPT-5 variant
      messages: [{
        role: 'user',
        content: `Analyze this worship song and return ONLY valid JSON (no markdown):

Title: ${title}
Artist: ${artist}
Lyrics: ${lyrics.substring(0, 2000)}

Consider the existing theme packs:
- mountains: Blue/purple mountain landscapes (powerful, majestic)
- waves: Teal/blue ocean waves (joyful, flowing)
- clouds: Soft blue/white sky clouds (peaceful, reflective)
- forest: Green forest/nature scenes (calm, grounded)

Return this exact JSON structure:
{
  "mood": "joyful|reflective|celebratory|peaceful|powerful|reverent",
  "energy": "high|medium|low",
  "theme": "praise|worship|hope|grace|love|faith|victory",
  "colorSuggestion": "warm|cool|vibrant|soft|dark|light",
  "recommendedStyle": "modern|traditional|minimalist|bold|elegant",
  "season": "christmas|easter|general",
  "suggestedThemePack": "mountains|waves|clouds|forest"
}`
      }],
      temperature: 1,
      verbosity: 'low',
      reasoning_effort: 'minimal',
      response_format: { type: 'json_object' }
    } as any); // Cast to any for GPT-5 specific parameters

    return JSON.parse(response.choices[0].message.content || '{}');
  }

  /**
   * Break lyrics into optimal slides
   */
  async breakIntoSlides(lyrics: string): Promise<SlideBreakdown> {
    if (!this.client) {
      throw new Error('OpenAI not configured');
    }

    const response = await this.client.chat.completions.create({
      model: 'gpt-5-nano',
      messages: [{
        role: 'user',
        content: `Break these worship lyrics into presentation slides. Return ONLY valid JSON:

CRITICAL RULES:
- Aim for 15-25 slides total for a typical song (NEVER more than 30!)
- Each slide should have 4-6 lines of text (use the FULL 6 lines!)
- Keep related phrases together - don't over-split
- Break at natural section boundaries (verse/chorus/bridge)
- Repeat choruses as separate slides
- Identify section types (verse, chorus, bridge, intro, outro)
- COMBINE short phrases into fuller slides

EXAMPLE GOOD SLIDE:
"Amazing grace how sweet the sound
That saved a wretch like me
I once was lost but now I'm found
Was blind but now I see"

EXAMPLE BAD SLIDE (TOO MUCH TEXT):
Do NOT put entire verses or multiple sections on one slide!

Lyrics:
${lyrics}

Return this exact JSON structure:
{
  "slides": [
    {
      "content": "4-6 lines of lyrics only",
      "type": "verse|chorus|bridge|intro|outro",
      "order": 1
    }
  ]
}`
      }],
      temperature: 1,
      verbosity: 'low',
      reasoning_effort: 'minimal',
      response_format: { type: 'json_object' }
    } as any); // Cast to any for GPT-5 specific parameters

    const result = JSON.parse(response.choices[0].message.content || '{"slides":[]}');
    
    // Validate: Check if any slide has too many lines
    result.slides.forEach((slide: any, idx: number) => {
      const lineCount = slide.content.split('\n').length;
      if (lineCount > 8) {
        console.warn(`⚠️ Slide ${idx} has ${lineCount} lines (max 8)! Content:`, slide.content.substring(0, 100));
      }
    });
    
    console.log(`📊 AI created ${result.slides.length} slides`);
    return result;
  }

  /**
   * Detect song structure and chorus for auto-duplication
   */
  async detectSongStructure(lyrics: string): Promise<{
    hasChorus: boolean;
    chorusLines?: string[];
    chorusStartIndex?: number;
    chorusEndIndex?: number;
    recommendedDuplications: number;
    structure: Array<{
      type: 'verse' | 'chorus' | 'bridge' | 'pre-chorus' | 'outro';
      startLine: number;
      endLine: number;
    }>;
  }> {
    if (!this.client) {
      throw new Error('OpenAI not configured');
    }

    const response = await this.client.chat.completions.create({
      model: 'gpt-5-nano',
      temperature: 1,
      verbosity: 'low',
      reasoning_effort: 'minimal',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `You are a worship song structure analyzer. Analyze lyrics to detect:
1. Song structure (verse, chorus, bridge, etc.)
2. Chorus location and content
3. Recommended chorus repetitions

Return JSON format:
{
  "hasChorus": true/false,
  "chorusLines": ["line1", "line2", ...],
  "structure": [
    { "type": "verse", "startLine": 0, "endLine": 7 },
    { "type": "chorus", "startLine": 8, "endLine": 15 },
    ...
  ],
  "recommendedDuplications": 2
}

Rules:
- Chorus typically repeats 2-4 times in worship songs
- Look for repeated lyric patterns
- Consider song length (longer songs = more repeats)
- Bridge usually appears once before final chorus
`,
        },
        {
          role: 'user',
          content: `Analyze this worship song structure:\n\n${lyrics}`,
        },
      ],
    });

    // Strip markdown code blocks if present
    let content = response.choices[0].message.content || '{}';
    content = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    
    const result = JSON.parse(content);
    
    return {
      hasChorus: result.hasChorus || false,
      chorusLines: result.chorusLines,
      structure: result.structure || [],
      recommendedDuplications: result.recommendedDuplications || 2,
      chorusStartIndex: result.structure?.find((s: any) => s.type === 'chorus')?.startLine,
      chorusEndIndex: result.structure?.find((s: any) => s.type === 'chorus')?.endLine,
    };
  }

  /**
   * Look up scripture text using AI with intelligent splitting for long passages
   */
  async lookupScripture(
    reference: string,
    version: string = 'NIV'
  ): Promise<{ fullText: string; parts: string[]; shouldSplit: boolean }> {
    if (!this.client) {
      throw new Error('OpenAI not configured');
    }

    const response = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant that provides accurate Bible verses optimized for presentation slides.

INSTRUCTIONS:
1. Provide the verse text from the ${version} translation
2. If the text is longer than 150 words, split it into logical parts for separate slides
3. Split at natural boundaries: sentence breaks, verse boundaries, or thought transitions
4. Each part should be 100-200 words for optimal readability on screen
5. Return as JSON with this exact format:

{
  "fullText": "complete scripture text",
  "parts": ["part 1 text", "part 2 text", ...],
  "shouldSplit": true/false
}

For short passages (under 150 words), set shouldSplit to false and parts array should contain just the full text.
For invalid references, return an error in the fullText field.`
        },
        {
          role: 'user',
          content: `Please provide the text for ${reference} from the ${version} translation, and determine if it should be split for presentation slides.`
        }
      ],
      temperature: 0.3,
      max_tokens: 1500,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content?.trim() || '';
    
    if (!content) {
      throw new Error('No response from AI');
    }

    try {
      const result = JSON.parse(content);
      
      // Validate structure
      if (!result.fullText || !Array.isArray(result.parts)) {
        throw new Error('Invalid response format from AI');
      }

      // Ensure shouldSplit is boolean
      result.shouldSplit = result.shouldSplit === true;

      console.log('📖 Scripture lookup result:', {
        reference,
        wordCount: result.fullText.split(' ').length,
        shouldSplit: result.shouldSplit,
        partsCount: result.parts.length
      });

      return result;
    } catch (parseError) {
      console.error('❌ Failed to parse AI response:', content);
      // Fallback: treat as single unsplit text
      return {
        fullText: content,
        parts: [content],
        shouldSplit: false
      };
    }
  }

  /**
   * Generate sermon slides with AI
   */
  async generateSermonSlides(params: {
    title: string;
    scripture?: string;
    points?: string[];
  }): Promise<{
    titleSlide: any;
    pointsSlide?: any;
    closingSlide: any;
  }> {
    if (!this.client) {
      throw new Error('OpenAI not configured');
    }

    const response = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant that creates professional sermon slide content for church presentations.

Generate sermon slides with:
1. Title slide: Engaging sermon title, scripture reference
2. Points slide (if points provided): 3-4 key takeaways
3. Closing slide: Call to action or benediction

Return as JSON:
{
  "titleSlide": {
    "title": "sermon title",
    "subtitle": "scripture reference",
    "theme": "brief description"
  },
  "pointsSlide": {
    "title": "Key Points",
    "points": ["point 1", "point 2", "point 3"]
  },
  "closingSlide": {
    "title": "closing message",
    "callToAction": "what should people do"
  }
}`
        },
        {
          role: 'user',
          content: `Create sermon slides for:
Title: ${params.title}
Scripture: ${params.scripture || 'None specified'}
Points: ${params.points?.join(', ') || 'None - generate suggested points'}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content?.trim() || '{}';
    return JSON.parse(content);
  }

  /**
   * Generate offering slide with AI
   */
  async generateOfferingSlide(params: {
    theme?: 'gratitude' | 'purpose' | 'joy' | 'stewardship';
    includeScripture?: boolean;
  }): Promise<{
    title: string;
    message: string;
    scripture?: string;
  }> {
    if (!this.client) {
      throw new Error('OpenAI not configured');
    }

    const response = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant that creates graceful, non-awkward offering slide content.

Focus on: ${params.theme || 'gratitude'}
Include scripture: ${params.includeScripture ? 'yes' : 'no'}

Return as JSON:
{
  "title": "main heading",
  "message": "encouraging message about giving",
  "scripture": "relevant verse reference (if requested)"
}

Keep tone positive, grateful, and purpose-driven. Avoid guilt or obligation.`
        },
        {
          role: 'user',
          content: 'Generate an offering slide message'
        }
      ],
      temperature: 0.7,
      max_tokens: 300,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content?.trim() || '{}';
    return JSON.parse(content);
  }

  /**
   * Generate welcome slide with AI
   */
  async generateWelcomeSlide(params: {
    churchName: string;
    serviceType?: string;
    specialMessage?: string;
  }): Promise<{
    mainMessage: string;
    subtitle: string;
    greeting: string;
  }> {
    if (!this.client) {
      throw new Error('OpenAI not configured');
    }

    const response = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant that creates warm, welcoming slide content for church services.

Return as JSON:
{
  "mainMessage": "Welcome to [Church Name]",
  "subtitle": "brief welcoming statement",
  "greeting": "friendly greeting message"
}

Keep it warm, inclusive, and inviting.`
        },
        {
          role: 'user',
          content: `Generate welcome slide for:
Church: ${params.churchName}
Service Type: ${params.serviceType || 'Sunday Service'}
Special: ${params.specialMessage || 'None'}`
        }
      ],
      temperature: 0.7,
      max_tokens: 200,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content?.trim() || '{}';
    return JSON.parse(content);
  }

  /**
   * Generate closing slide with AI
   */
  async generateClosingSlide(params: {
    includeBenediction?: boolean;
    nextWeekPreview?: string;
  }): Promise<{
    title: string;
    message: string;
    benediction?: string;
    nextWeek?: string;
  }> {
    if (!this.client) {
      throw new Error('OpenAI not configured');
    }

    const response = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant that creates meaningful closing slide content for church services.

Include benediction: ${params.includeBenediction ? 'yes' : 'no'}
Next week preview: ${params.nextWeekPreview || 'no'}

Return as JSON:
{
  "title": "main closing message",
  "message": "thank you and send-off message",
  "benediction": "scripture benediction (if requested)",
  "nextWeek": "preview of next week (if provided)"
}

Keep it warm, grateful, and forward-looking.`
        },
        {
          role: 'user',
          content: `Generate closing slide${params.nextWeekPreview ? ` with next week: ${params.nextWeekPreview}` : ''}`
        }
      ],
      temperature: 0.7,
      max_tokens: 300,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content?.trim() || '{}';
    return JSON.parse(content);
  }

  /**
   * Check if OpenAI is configured
   */
  isConfigured(): boolean {
    return this.client !== null;
  }
}

export const openaiService = new OpenAIService();

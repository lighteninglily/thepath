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
- waves: Teal/blue ocean waves (peaceful, flowing)
- clouds: Soft blue/white sky clouds (hopeful, light)
- nature: Green forest/nature scenes (calm, grounded)
- abstract: Modern abstract patterns (contemporary, vibrant)

Return this exact JSON structure:
{
  "mood": "joyful|reflective|celebratory|peaceful|powerful|reverent",
  "energy": "high|medium|low",
  "theme": "praise|worship|hope|grace|love|faith|victory",
  "colorSuggestion": "warm|cool|vibrant|soft|dark|light",
  "recommendedStyle": "modern|traditional|minimalist|bold|elegant",
  "season": "christmas|easter|general",
  "suggestedThemePack": "mountains|waves|clouds|nature|abstract"
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
- MAXIMUM 6 lines of text per slide (NEVER more than 6 lines!)
- Each slide must be readable at a distance
- Break at natural phrase boundaries
- Repeat choruses as separate slides
- Identify section types (verse, chorus, bridge, intro, outro)

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
   * Look up scripture text using AI
   */
  async lookupScripture(
    reference: string,
    version: string = 'NIV'
  ): Promise<string> {
    if (!this.client) {
      throw new Error('OpenAI not configured');
    }

    const response = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant that provides accurate Bible verses. When given a scripture reference, provide ONLY the verse text from the ${version} translation, without any commentary, explanation, or the reference itself. If the reference is invalid or unclear, explain the issue briefly.`
        },
        {
          role: 'user',
          content: `Please provide the text for ${reference} from the ${version} translation.`
        }
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    const text = response.choices[0]?.message?.content?.trim() || '';
    
    if (!text) {
      throw new Error('No response from AI');
    }

    return text;
  }

  /**
   * Check if OpenAI is configured
   */
  isConfigured(): boolean {
    return this.client !== null;
  }
}

export const openaiService = new OpenAIService();

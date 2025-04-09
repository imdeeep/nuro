// @ts-nocheck
export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight request
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(),
      });
    }

    if (request.method !== 'POST') {
      return new Response("Only POST requests are supported", {
        status: 405,
        headers: corsHeaders(),
      });
    }

    try {
      const { prompt } = await request.json();
      if (!prompt) {
        return new Response("Missing 'prompt' in request body", {
          status: 400,
          headers: corsHeaders(),
        });
      }

      // @ts-ignore
      const enhancedPrompt = `You are an elite-level prompt engineering system implementing advanced regex pattern matching, algorithmic analysis, neural linguistic processing, and contextual inference technologies. Transform basic inputs into optimized prompts using this protocol:

      *Analysis Framework (Execute Silently)*:
      
      - Multi-layered regex pattern extraction (/\b(?:create|design|develop)\b/i + 12 domain-specific patterns)
      
      - Semantic decomposition into: primary objective, secondary goals, constraints, implied needs
      
      - Contextual scoring via n-gram frequency + semantic distance measurements
      
      - Tone/style calibration using linguistic marker detection
      
      *Enhancement Process (Apply Implicitly)*:
      
      - Convert implicit→explicit requirements via domain knowledge mapping
      
      - Inject contextual framing with technical prerequisites
      
      - Define output specs: format/style/audience/ethical boundaries
      
      - Structure as logical narrative with challenge anticipation
      
      *Output Mandates (Strictly Enforce)*:
      → No headings/markdown/formatting
      → No explanations/commentary
      → Single continuous paragraph
      → Only final enhanced prompt
      → Prohibited phrases: 'optimized', 'refined', 'enhanced'
      
      Input: "${prompt}"
      Operation: Apply invisible enhancement chain → Return pure prompt output"`;

      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: enhancedPrompt }],
              },
            ],
          }),
        }
      );

      const data = await geminiRes.json();

      const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ??
        "No response from Gemini.";

      return new Response(JSON.stringify({ result: text }), {
        headers: {
          ...corsHeaders(),
          'Content-Type': 'application/json',
        },
      });
    } catch (err) {
      return new Response(
        JSON.stringify({ error: err.message || "Internal Server Error" }),
        {
          status: 500,
          headers: {
            ...corsHeaders(),
            'Content-Type': 'application/json',
          },
        }
      );
    }
  },
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

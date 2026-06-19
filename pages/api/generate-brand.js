export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const formData = req.body || {};

  const visualStyleMap = {
    'clean-minimal': 'Clean and minimal (Apple, Notion)',
    'warm-organic': 'Warm and organic (earthy tones, natural textures)',
    'bold-modern': 'Bold and modern (high contrast, geometric)',
    'elegant-refined': 'Elegant and refined (serif fonts, muted luxury)',
    'vibrant-energetic': 'Vibrant and energetic (bright colors, dynamic)',
    'editorial-sophisticated': 'Editorial and sophisticated (magazine-style)'
  };

  const prompt = `You are a senior brand designer. Based on the intake below, design a tight, visual brand identity. Give concrete, ready-to-use recommendations, not explanations.

INTAKE
Ideal client and transformation: ${formData.q1 || 'n/a'}
Brand personality traits: ${formData.traits || 'n/a'}
Feeling to evoke: ${formData.q3 || 'n/a'}
Visual style: ${visualStyleMap[formData.q4] || formData.q4 || 'n/a'}
Admired brands: ${formData.q5 || 'none given'}
What to avoid: ${formData.q6 || 'n/a'}
Existing colors: ${formData.q7_colors || 'none'}
Existing logo: ${formData.q7_logo || 'none'}
Existing fonts: ${formData.q7_fonts || 'none'}
Other notes: ${formData.q7_other || 'none'}

Respond with ONLY valid JSON. No markdown, no code fences, no text before or after. Use this exact shape:

{
  "personality": ["three to four single adjective words"],
  "colors": [
    { "name": "short evocative name", "hex": "#RRGGBB", "role": "Primary | Secondary | Accent | Neutral | Background" }
  ],
  "fonts": {
    "heading": { "name": "exact Google Fonts family name", "use": "max 6 words" },
    "body": { "name": "exact Google Fonts family name", "use": "max 6 words" }
  },
  "aesthetic": "one sentence of visual direction, max 25 words",
  "imagery": ["four to five short photo or texture keywords"]
}

Rules:
- Exactly 5 colors with valid hex codes that form a cohesive palette.
- Both font names MUST be real families on Google Fonts, spelled exactly as Google Fonts lists them.
- Keep every string short. No paragraphs. No explanation.`;

  try {
    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!anthropicResponse.ok) {
      const errorText = await anthropicResponse.text();
      console.error('Anthropic API error:', errorText);
      throw new Error(`Anthropic API error: ${anthropicResponse.status}`);
    }

    const anthropicData = await anthropicResponse.json();
    let raw = (anthropicData.content?.[0]?.text || '').trim();

    // Strip markdown fences if the model added them
    raw = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();

    let brandIdentity;
    try {
      brandIdentity = JSON.parse(raw);
    } catch (parseErr) {
      console.error('JSON parse failed. Raw output:', raw);
      return res.status(500).json({ success: false, error: 'Could not parse brand identity. Please try again.' });
    }

    return res.status(200).json({ success: true, brandIdentity });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const formData = req.body;

    // Build the prompt for Claude
    const prompt = `You are a professional brand strategist and visual identity expert. Based on the following information, create a comprehensive brand identity guide with specific recommendations.

Client Information:
- Ideal Client & Transformation: ${formData.q1}
- Brand Personality Traits: ${formData.traits.join(', ')}
- Desired Audience Feeling: ${formData.q3}
- Visual Style Preference: ${formData.q4}
- Admired Brands: ${formData.q5 || 'None specified'}
- What to Avoid: ${formData.q6}
- Existing Visual Elements:
  * Colors: ${formData.q7_colors || 'Starting fresh'}
  * Logo: ${formData.q7_logo || 'None'}
  * Fonts: ${formData.q7_fonts || 'None'}
  * Other Notes: ${formData.q7_other || 'None'}

Create a brand identity guide in the following format. Be SPECIFIC with actual font names, hex codes, and concrete recommendations:

COLOR PALETTE:
[Provide 4-6 specific colors with hex codes and purpose]
- Primary: [Color name] (#HEXCODE) - [Why this color/what it conveys]
- Accent: [Color name] (#HEXCODE) - [Why this color/what it conveys]
- Neutrals: [2-3 neutral colors with hex codes]

TYPOGRAPHY:
[Provide specific font recommendations]
- Primary Font: [Actual font name] - [When to use it and why]
- Secondary Font: [Actual font name] - [When to use it and why]
- Font Pairings Note: [How these fonts work together]

AESTHETIC KEYWORDS:
[Provide 5-7 specific aesthetic keywords that capture the visual direction, separated by bullets]

IMAGERY DIRECTION:
[Provide 5-7 specific types of imagery/photos/graphics they should use, with concrete examples]

Be creative, specific, and strategic. Make sure all recommendations work cohesively together and align with their brand personality, target audience, and visual style preference.`;

    // Call Anthropic API
    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    if (!anthropicResponse.ok) {
      const errorText = await anthropicResponse.text();
      console.error('Anthropic API error:', errorText);
      throw new Error(`Anthropic API error: ${anthropicResponse.status}`);
    }

    const anthropicData = await anthropicResponse.json();
    const brandIdentity = anthropicData.content[0].text;

    // Send to GHL webhook if email is provided (you can add webhook URL here)
    // const GHL_WEBHOOK_URL = 'YOUR_GHL_WEBHOOK_URL';
    // if (GHL_WEBHOOK_URL) {
    //   await fetch(GHL_WEBHOOK_URL, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       ...formData,
    //       brandIdentity: brandIdentity
    //     })
    //   }).catch(err => console.error('GHL webhook error:', err));
    // }

    // Return the brand identity
    return res.status(200).json({
      success: true,
      brandIdentity: brandIdentity
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const formData = req.body || {};

    const traits = Array.isArray(formData.traits) ? formData.traits : [];

    const prompt = `You are a professional brand strategist and visual identity expert. Based on the following information, create a comprehensive brand identity guide with specific recommendations.

Client Information:
- Ideal Client & Transformation: ${formData.q1 || ""}
- Brand Personality Traits: ${traits.join(", ")}
- Desired Audience Feeling: ${formData.q3 || ""}
- Visual Style Preference: ${formData.q4 || ""}
- Admired Brands: ${formData.q5 || "None specified"}
- What to Avoid: ${formData.q6 || ""}
- Existing Visual Elements:
  * Colors: ${formData.q7_colors || "Starting fresh"}
  * Logo: ${formData.q7_logo || "None"}
  * Fonts: ${formData.q7_fonts || "None"}
  * Other Notes: ${formData.q7_other || "None"}

Create a brand identity guide in the following format:

COLOR PALETTE:
...

TYPOGRAPHY:
...

AESTHETIC KEYWORDS:
...

IMAGERY DIRECTION:
...`;

    const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!anthropicResponse.ok) {
      const errorText = await anthropicResponse.text();
      return res.status(500).json({ success: false, error: errorText });
    }

    const anthropicData = await anthropicResponse.json();
    const brandIdentity = anthropicData?.content?.[0]?.text || "";

    // --- GHL webhook ---
    const GHL_WEBHOOK_URL =
      "https://services.leadconnectorhq.com/hooks/DvWTrdD23UD09zv6GgZj/webhook-trigger/86860bc6-ef18-4486-97f3-d2fccfa3ff68";

    let ghlDebug = { attempted: false };

    try {
      ghlDebug.attempted = true;

      const ghlRes = await fetch(GHL_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, brandIdentity }),
      });

      const ghlText = await ghlRes.text();

      ghlDebug = {
        attempted: true,
        ok: ghlRes.ok,
        status: ghlRes.status,
        responseText: (ghlText || "").slice(0, 500),
      };
    } catch (e) {
      ghlDebug = { attempted: true, error: String(e) };
    }

    return res.status(200).json({
      success: true,
      brandIdentity,
      ghlDebug,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: String(error) });
  }
}

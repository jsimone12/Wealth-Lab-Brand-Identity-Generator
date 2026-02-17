import { useState } from 'react';
import Head from 'next/head';

export default function BrandIdentityGenerator() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    q1: '',
    traits: [],
    q3: '',
    q4: '',
    q5: '',
    q6: '',
    q7_colors: '',
    q7_logo: '',
    q7_fonts: '',
    q7_other: ''
  });

  const [showMain, setShowMain] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  // Get URL parameters on mount
  useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setFormData(prev => ({
        ...prev,
        firstName: params.get('fname') || params.get('firstName') || '',
        lastName: params.get('lname') || params.get('lastName') || '',
        email: params.get('email') || ''
      }));
    }
  }, []);

  const handleTraitChange = (trait) => {
    setFormData(prev => {
      const traits = prev.traits.includes(trait)
        ? prev.traits.filter(t => t !== trait)
        : prev.traits.length < 4
          ? [...prev.traits, trait]
          : prev.traits;
      return { ...prev, traits };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.traits.length < 3 || formData.traits.length > 4) {
      setError('Please select 3-4 personality traits for your brand.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const data = await response.json();

if (!data.success) {
  throw new Error(data.error || 'Failed to generate brand identity');
}

setResult(data.brandIdentity);

// Send to GHL webhook from browser
try {
  await fetch('https://services.leadconnectorhq.com/hooks/DvWTrdD23UD09zv6GgZj/webhook-trigger/4ef24c2c-621c-4837-b8de-df74d2ee7987', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      q1: formData.q1,
      traits: formData.traits.join(', '),
      q3: formData.q3,
      q4: formData.q4,
      q5: formData.q5,
      q6: formData.q6,
      q7_colors: formData.q7_colors,
      q7_logo: formData.q7_logo,
      q7_fonts: formData.q7_fonts,
      q7_other: formData.q7_other,
      brandIdentity: data.brandIdentity
    })
  });
  console.log('Data sent to GHL successfully');
} catch (webhookError) {
  console.error('GHL webhook error:', webhookError);
}
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const traits = [
    'Approachable', 'Luxurious', 'Bold', 'Calm', 'Energetic', 'Professional',
    'Playful', 'Edgy', 'Trustworthy', 'Innovative', 'Grounded', 'Aspirational',
    'Warm', 'Authoritative', 'Creative', 'Minimal'
  ];

  return (
    <>
      <Head>
        <title>Wealth Lab Brand Identity Generator</title>
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :root {
          --primary: #0a1f33;
          --accent: #F6C445;
          --text: #1A1A1A;
          --text-light: #666666;
          --bg: #fdf9ed;
          --white: #FFFFFF;
          --border: #E0E0E0;
          --sage: #b7c7b3;
        }

        body {
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          background: var(--primary);
          color: var(--text);
          line-height: 1.6;
        }

        .welcome-screen {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 40px 20px;
          background: var(--bg);
        }

        .welcome-card {
          background: var(--primary);
          border-radius: 24px;
          padding: 60px 48px;
          max-width: 700px;
          text-align: center;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(183, 199, 179, 0.2);
        }

        .welcome-icon {
          font-size: 4rem;
          margin-bottom: 24px;
          filter: drop-shadow(0 4px 12px rgba(246, 196, 69, 0.5));
          color: var(--accent);
        }

        .welcome-card h1 {
          font-family: 'Syne', sans-serif;
          font-size: 2.5rem;
          margin-bottom: 24px;
          color: var(--bg);
        }

        .welcome-card p {
          font-size: 1.125rem;
          line-height: 1.7;
          color: rgba(253, 249, 237, 0.85);
          margin-bottom: 16px;
        }

        .info-box {
          background: rgba(183, 199, 179, 0.15);
          border-left: 4px solid var(--sage);
          padding: 20px 24px;
          border-radius: 8px;
          margin: 32px 0;
          text-align: left;
        }

        .info-box p {
          font-size: 0.9375rem;
          color: rgba(253, 249, 237, 0.9);
          margin: 0;
        }

        .start-btn {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 18px 48px;
          font-family: 'Syne', sans-serif;
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--primary);
          background: var(--accent);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .start-btn:hover {
          background: #f4c034;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(246, 196, 69, 0.4);
        }

        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 60px 24px;
        }

        header {
          text-align: center;
          margin-bottom: 60px;
        }

        h1 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 700;
          color: var(--bg);
          margin-bottom: 16px;
        }

        .subtitle {
          font-size: 1.125rem;
          color: rgba(253, 249, 237, 0.8);
          max-width: 600px;
          margin: 0 auto;
        }

        .form-container {
          background: var(--bg);
          border-radius: 16px;
          padding: 48px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }

        .question-group {
          margin-bottom: 40px;
        }

        label {
          display: block;
          font-family: 'Syne', sans-serif;
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--primary);
          margin-bottom: 12px;
        }

        .question-number {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          background: var(--sage);
          color: var(--white);
          border-radius: 50%;
          font-size: 0.875rem;
          font-weight: 700;
          margin-right: 8px;
        }

        .helper-text {
          font-size: 0.9375rem;
          color: var(--text-light);
          margin-bottom: 12px;
          font-style: italic;
        }

        input[type="text"],
        textarea,
        select {
          width: 100%;
          padding: 14px 16px;
          font-size: 1rem;
          font-family: 'DM Sans', sans-serif;
          border: 2px solid var(--border);
          border-radius: 8px;
          background: var(--white);
          color: var(--text);
          transition: all 0.3s ease;
        }

        input:focus, textarea:focus, select:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(246, 196, 69, 0.1);
        }

        textarea {
          min-height: 120px;
          resize: vertical;
        }

        .checkbox-group {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 12px;
          margin-top: 12px;
        }

        .checkbox-label {
          display: block;
          padding: 12px 16px;
          background: #f5f0e0;
          border: 2px solid var(--border);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9375rem;
          font-weight: 500;
          text-align: center;
        }

        .checkbox-label:hover {
          border-color: var(--sage);
          transform: translateY(-2px);
        }

        .checkbox-label.selected {
          background: var(--sage);
          border-color: var(--sage);
          color: var(--white);
          font-weight: 600;
        }

        .checkbox-label.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .sub-fields {
          margin-top: 16px;
          padding: 20px;
          background: #f5f0e0;
          border-radius: 8px;
          border-left: 4px solid var(--sage);
        }

        .sub-field {
          margin-bottom: 16px;
        }

        .sub-field:last-child {
          margin-bottom: 0;
        }

        .sub-field label {
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--text);
          margin-bottom: 8px;
        }

        .submit-btn {
          width: 100%;
          padding: 18px 32px;
          font-family: 'Syne', sans-serif;
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--white);
          background: var(--sage);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 32px;
        }

        .submit-btn:hover:not(:disabled) {
          background: #a3b5a0;
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(183, 199, 179, 0.3);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error-message {
          background: #FEE2E2;
          color: #EF4444;
          padding: 16px;
          border-radius: 8px;
          margin-top: 16px;
          font-weight: 500;
        }

        .loading-spinner {
          border: 3px solid var(--white);
          border-top-color: transparent;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          animation: spin 0.8s linear infinite;
          margin: 0 auto;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .container {
            padding: 40px 20px;
          }
          .form-container {
            padding: 32px 24px;
          }
          .checkbox-group {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {!showMain ? (
        <div className="welcome-screen">
          <div className="welcome-card">
            <div className="welcome-icon">✨</div>
            <h1>{formData.firstName ? `Welcome, ${formData.firstName}!` : 'Welcome!'}</h1>
            <p>You're about to discover your personalized brand identity guide designed specifically for you — a visual foundation that will help you build a brand that truly reflects your vision and connects with your audience.</p>
            
            <div className="info-box">
              <p>This will take about 5-7 minutes. Answer honestly — the more specific you are, the better your personalized brand identity will be.</p>
            </div>
            
            <button className="start-btn" onClick={() => setShowMain(true)}>
              Let's Get Started
              <span>→</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="container">
          <header>
            <h1>{formData.firstName ? `Welcome, ${formData.firstName}!` : 'Brand Identity Generator'}</h1>
            <p className="subtitle">Answer 7 strategic questions to receive your personalized brand visual identity guide—complete with colors, typography, aesthetic direction, and imagery recommendations.</p>
          </header>

          <div className="form-container">
            <form onSubmit={handleSubmit}>
              {/* Question 1 */}
              <div className="question-group">
                <label>
                  <span className="question-number">1</span>
                  Who is your ideal client, and what transformation are you helping them achieve?
                </label>
                <p className="helper-text">Example: "Busy moms who want to go from overwhelmed to organized"</p>
                <textarea
                  required
                  value={formData.q1}
                  onChange={(e) => setFormData({...formData, q1: e.target.value})}
                  placeholder="Describe your ideal client and their transformation..."
                />
              </div>

              {/* Question 2 */}
              <div className="question-group">
                <label>
                  <span className="question-number">2</span>
                  If your brand were a person at a party, how would they show up?
                </label>
                <p className="helper-text">Choose 3-4 words that feel right</p>
                <div className="checkbox-group">
                  {traits.map(trait => (
                    <div
                      key={trait}
                      className={`checkbox-label ${
                        formData.traits.includes(trait) ? 'selected' : ''
                      } ${
                        formData.traits.length >= 4 && !formData.traits.includes(trait) ? 'disabled' : ''
                      }`}
                      onClick={() => {
                        if (formData.traits.length < 4 || formData.traits.includes(trait)) {
                          handleTraitChange(trait);
                        }
                      }}
                    >
                      {trait}
                    </div>
                  ))}
                </div>
              </div>

              {/* Question 3 */}
              <div className="question-group">
                <label>
                  <span className="question-number">3</span>
                  What feeling do you want your audience to experience when they encounter your brand?
                </label>
                <p className="helper-text">Example: "Safe and supported," "Excited and inspired"</p>
                <input
                  type="text"
                  required
                  value={formData.q3}
                  onChange={(e) => setFormData({...formData, q3: e.target.value})}
                  placeholder="Describe the feeling you want to evoke..."
                />
              </div>

              {/* Question 4 */}
              <div className="question-group">
                <label>
                  <span className="question-number">4</span>
                  Which of these visual styles resonates most with you?
                </label>
                <select
                  required
                  value={formData.q4}
                  onChange={(e) => setFormData({...formData, q4: e.target.value})}
                >
                  <option value="">Select a visual style...</option>
                  <option value="clean-minimal">Clean and minimal (think Apple, Notion)</option>
                  <option value="warm-organic">Warm and organic (earthy tones, natural textures)</option>
                  <option value="bold-modern">Bold and modern (high contrast, geometric shapes)</option>
                  <option value="elegant-refined">Elegant and refined (serif fonts, muted luxury)</option>
                  <option value="vibrant-energetic">Vibrant and energetic (bright colors, dynamic layouts)</option>
                  <option value="editorial-sophisticated">Editorial and sophisticated (magazine-style)</option>
                </select>
              </div>

              {/* Question 5 */}
              <div className="question-group">
                <label>
                  <span className="question-number">5</span>
                  Are there any brands whose look and feel you admire?
                </label>
                <p className="helper-text">Share 1-3 brand names and what you like about their visual style</p>
                <textarea
                  value={formData.q5}
                  onChange={(e) => setFormData({...formData, q5: e.target.value})}
                  placeholder="Example: 'I love Glossier's clean, minimal aesthetic' (optional)"
                />
              </div>

              {/* Question 6 */}
              <div className="question-group">
                <label>
                  <span className="question-number">6</span>
                  What do you want your brand to NOT look like or feel like?
                </label>
                <p className="helper-text">Example: "Not corporate or stuffy," "Not overly feminine or cutesy"</p>
                <input
                  type="text"
                  required
                  value={formData.q6}
                  onChange={(e) => setFormData({...formData, q6: e.target.value})}
                  placeholder="What should your brand avoid?"
                />
              </div>

              {/* Question 7 */}
              <div className="question-group">
                <label>
                  <span className="question-number">7</span>
                  Do you have any existing visual elements we should know about?
                </label>
                <p className="helper-text">Not required—most people start fresh!</p>
                <div className="sub-fields">
                  <div className="sub-field">
                    <label>Colors</label>
                    <input
                      type="text"
                      value={formData.q7_colors}
                      onChange={(e) => setFormData({...formData, q7_colors: e.target.value})}
                      placeholder='e.g., "teal and coral"'
                    />
                  </div>
                  <div className="sub-field">
                    <label>Logo</label>
                    <input
                      type="text"
                      value={formData.q7_logo}
                      onChange={(e) => setFormData({...formData, q7_logo: e.target.value})}
                      placeholder='e.g., "simple script logo in black"'
                    />
                  </div>
                  <div className="sub-field">
                    <label>Fonts</label>
                    <input
                      type="text"
                      value={formData.q7_fonts}
                      onChange={(e) => setFormData({...formData, q7_fonts: e.target.value})}
                      placeholder='e.g., "Lora and Open Sans"'
                    />
                  </div>
                  <div className="sub-field">
                    <label>Other notes</label>
                    <textarea
                      value={formData.q7_other}
                      onChange={(e) => setFormData({...formData, q7_other: e.target.value})}
                      placeholder="Anything else we should know?"
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? <div className="loading-spinner" /> : 'Generate My Brand Identity'}
              </button>

              {error && <div className="error-message">{error}</div>}
            </form>
          </div>

          {result && (
            <div className="form-container" style={{marginTop: '40px'}}>
              <h2 style={{fontFamily: 'Syne', fontSize: '2rem', marginBottom: '24px', textAlign: 'center'}}>
                {formData.firstName ? `${formData.firstName}'s Brand Identity Guide` : 'Your Brand Identity Guide'}
              </h2>
              <div style={{whiteSpace: 'pre-wrap'}}>{result}</div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

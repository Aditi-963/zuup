import React from 'react';

interface WhyWeWinProps {
  onNavigate: (view: string) => void;
}

export const WhyWeWin: React.FC<WhyWeWinProps> = ({ onNavigate }) => {
  return (
    <div className="view active" id="view-why">
      <div className="section">
        <div className="section-label">Competitive Analysis</div>
        <div className="section-title">Why RailSaarthi Wins Round 1</div>
        <p className="section-subtitle">Most hackathon teams build ChatGPT wrappers. We built a genuine agentic system that detects, reasons, and acts autonomously.</p>

        {/* ── IMPACT STATS GRID ── */}
        <div className="impact-grid">
          <div className="impact-card">
            <div className="impact-num">2 <span className="impact-unit">themes</span></div>
            <div className="impact-label">Railways + Agentic AI</div>
          </div>
          <div className="impact-card">
            <div className="impact-num">90 <span className="impact-unit">sec</span></div>
            <div className="impact-label">Detection to alert sent</div>
          </div>
          <div className="impact-card">
            <div className="impact-num">11 <span className="impact-unit">langs</span></div>
            <div className="impact-label">Regional languages</div>
          </div>
          <div className="impact-card">
            <div className="impact-num">₹18K <span className="impact-unit">Cr</span></div>
            <div className="impact-label">Annual delay cost TAM</div>
          </div>
        </div>

        {/* ── WHY WE WIN 01-06 CARD GRID ── */}
        <div className="win-grid">
          <div className="win-card">
            <div className="win-num">01</div>
            <div className="win-title">Hyper-Specific Problem</div>
            <div className="win-text">Not "travel AI" or "railway app." Exactly one pain: cascade management for station masters. Judges remember specificity.</div>
          </div>
          <div className="win-card">
            <div className="win-num">02</div>
            <div className="win-title">Genuine Agentic Behavior</div>
            <div className="win-text">The agent doesn't wait to be asked. It detects a delay, builds a recovery plan, and presents it — unprompted. That's autonomy.</div>
          </div>
          <div className="win-card">
            <div className="win-num">03</div>
            <div className="win-title">Demo Writes Itself</div>
            <div className="win-text">Click one button, watch the AI cascade detection activate in real time. Platform boxes swap. Hindi announcements appear. Judges lean forward.</div>
          </div>
          <div className="win-card">
            <div className="win-num">04</div>
            <div className="win-title">Hits Two Themes</div>
            <div className="win-text">Railways + Agentic Systems simultaneously. Cross-theme submissions are rare and memorable to judging committees.</div>
          </div>
          <div className="win-card">
            <div className="win-num">05</div>
            <div className="win-title">India-First, Irreplaceable</div>
            <div className="win-text">No Western team can build this. The knowledge of Indian railway constraints, 23 million daily passengers, regional languages — it's deeply local.</div>
          </div>
          <div className="win-card">
            <div className="win-num">06</div>
            <div className="win-title">Clear Roadmap</div>
            <div className="win-text">MVP → IRCTC API integration → Indian Railways Ministry → Global expansion to BRICS rail networks. Shows this lives beyond the hackathon.</div>
          </div>
        </div>

        {/* ── COMPETITOR MATRIX LANDSCAPE ── */}
        <div style={{ marginTop: '48px' }}>
          <div className="section-label" style={{ marginBottom: '16px' }}>Competitor Landscape</div>
          <div style={{ overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
            <table className="comp-table" style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th>Solution</th>
                  <th>Delay Detection</th>
                  <th>Auto Reallocation</th>
                  <th>Agentic AI</th>
                  <th>Multilingual</th>
                  <th>Station Master Tools</th>
                </tr>
              </thead>
              <tbody>
                <tr className="highlight">
                  <td>🚂 <strong>RailSaarthi</strong></td>
                  <td className="check">✓ Cascade</td>
                  <td className="check">✓ Autonomous</td>
                  <td className="check">✓ Full</td>
                  <td className="check">✓ 11 langs</td>
                  <td className="check">✓ Purpose-built</td>
                </tr>
                <tr>
                  <td>IRCTC App</td>
                  <td className="check">✓ Basic</td>
                  <td className="cross">✗</td>
                  <td className="cross">✗</td>
                  <td className="cross">✗</td>
                  <td className="cross">✗</td>
                </tr>
                <tr>
                  <td>Google Maps</td>
                  <td className="cross">✗</td>
                  <td className="cross">✗</td>
                  <td className="cross">✗</td>
                  <td className="check">✓</td>
                  <td className="cross">✗</td>
                </tr>
                <tr>
                  <td>Generic Rail Apps</td>
                  <td className="check">✓ Basic</td>
                  <td className="cross">✗</td>
                  <td className="cross">✗</td>
                  <td className="cross">✗</td>
                  <td className="cross">✗</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ── PRODUCT ROADMAP ── */}
        <div style={{ marginTop: '48px' }}>
          <div className="section-label" style={{ marginBottom: '16px' }}>Product Roadmap</div>
          <div className="roadmap">
            <div className="roadmap-phase">
              <div className="roadmap-phase-tag">Phase 1 · Now</div>
              <div className="roadmap-phase-title">Hackathon MVP</div>
              <div className="roadmap-phase-items">Simulated delay data<br />AI cascade detection<br />Platform reallocation<br />Hindi announcements</div>
            </div>
            <div className="roadmap-phase">
              <div className="roadmap-phase-tag">Phase 2 · 3 months</div>
              <div className="roadmap-phase-title">Live Integration</div>
              <div className="roadmap-phase-items">IRCTC API live data<br />WhatsApp alerts<br />All 11 languages<br />5 pilot stations</div>
            </div>
            <div className="roadmap-phase">
              <div className="roadmap-phase-tag">Phase 3 · 12 months</div>
              <div className="roadmap-phase-title">National Rollout</div>
              <div className="roadmap-phase-items">100 major junctions<br />Ministry partnership<br />Predictive AI models<br />Crowd flow sensors</div>
            </div>
            <div className="roadmap-phase">
              <div className="roadmap-phase-tag">Phase 4 · 2 years</div>
              <div className="roadmap-phase-title">BRICS Expansion</div>
              <div className="roadmap-phase-items">BRICS network pilot<br />Multi-modal transit<br />IRCTC marketplace<br />₹500 Cr TAM</div>
            </div>
          </div>
        </div>

        {/* ── TECH STACKS LIST ── */}
        <div style={{ marginTop: '48px' }}>
          <div className="section-label" style={{ marginBottom: '16px' }}>Tech Stack & Integrations</div>
          <div className="tech-pills">
            <span className="tech-pill tp-orange">FastAPI (Python)</span>
            <span className="tech-pill tp-blue">Claude API (Anthropic)</span>
            <span className="tech-pill tp-green">React + TS Frontend</span>
            <span className="tech-pill tp-purple">SQLite Audit Log</span>
            <span className="tech-pill tp-orange">Twilio WhatsApp</span>
            <span className="tech-pill tp-blue">Google Translate API</span>
            <span className="tech-pill tp-green">IRCTC Mock API</span>
            <span className="tech-pill tp-purple">Railway Timetable JSON</span>
          </div>
        </div>

        {/* ── BOTTOM BANNER ── */}
        <div className="pitch-banner" style={{ marginTop: '48px' }}>
          <h2>The Pitch in One Line</h2>
          <p>Indian Railways moves 23 million people daily across 8,702 stations. When one train is late, ten suffer. When ten suffer, a million passengers suffer. RailSaarthi is the first AI agent that catches the cascade before it spreads.</p>
        </div>

        <div style={{ textAlign: 'center', marginTop: '36px' }}>
          <button 
            className="btn-primary" 
            onClick={() => onNavigate('dashboard')} 
            style={{ fontSize: '1.05rem', padding: '16px 36px' }}
          >
            🎯 Experience the Live Co-Pilot Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

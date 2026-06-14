import React from 'react';

interface OverviewProps {
  onNavigate: (view: string, action?: string) => void;
}

export const Overview: React.FC<OverviewProps> = ({ onNavigate }) => {
  return (
    <div className="view active" id="view-home">
      {/* ── HERO SECTION ── */}
      <div className="hero">
        <div className="hero-tag">
          <span className="mono">🏆 FAR AWAY Hackathon 2025 · Railways + Agentic AI</span>
        </div>
        
        <div style={{ maxWidth: '800px', margin: '0 auto 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
          <h1 style={{ textAlign: 'center' }}>The Agentic <span>Brain</span> Indian<br/>Station Masters Never Had</h1>
          <p style={{ textAlign: 'center', fontSize: '1.12rem', color: 'rgba(255, 255, 255, 0.8)', maxWidth: '680px', marginBottom: '32px', lineHeight: '1.7' }}>
            Real-time delay cascade detection, autonomous platform reallocation, and multilingual staff alerts — all powered by a single AI agent that thinks before humans react.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => onNavigate('dashboard')}>
              🎯 Launch Live Demo
            </button>
            <button className="btn-secondary" onClick={() => onNavigate('emergency')}>
              🚨 Try Emergency AI
            </button>
          </div>
        </div>

        {/* 01, 02, 03, 04 stats layout */}
        <div className="hero-stats">
          <div className="hero-stat-card">
            <div className="hero-stat-num">14,000+</div>
            <div className="hero-stat-label">Trains Daily</div>
          </div>
          <div className="hero-stat-card">
            <div className="hero-stat-num">8,702</div>
            <div className="hero-stat-label">Stations</div>
          </div>
          <div className="hero-stat-card">
            <div className="hero-stat-num">23M</div>
            <div className="hero-stat-label">Daily Passengers</div>
          </div>
          <div className="hero-stat-card">
            <div className="hero-stat-num">₹18,000 Cr</div>
            <div className="hero-stat-label">Annual Delay Cost</div>
          </div>
        </div>
      </div>

      {/* ── THE PROBLEM SECTION ── */}
      <div className="section" style={{ borderTop: '1px solid var(--border-color)' }}>
        <div className="section-label">The Problem</div>
        <div className="section-title">One Delayed Train. Ten Cascading Disasters.</div>
        <p className="section-subtitle">Indian station masters manage platform allocation, delay cascades, and crowd flow manually — with no AI assistance. One wrong decision ripples across 10 trains and 50,000 passengers.</p>
        
        <div className="overview-grid">
          <div>
            <div className="camera-box" style={{ borderColor: 'rgba(16, 185, 129, 0.4)' }}>
              <div className="camera-box-corners" style={{ borderColor: 'var(--green)' }}></div>
              <span className="camera-tag" style={{ background: 'var(--green)', color: '#000' }}>cascade_propagation</span>
              <div className="overview-graphic">
                <img src="/railsaarthi_problem.png" alt="Cascading Delays Problem" />
              </div>
            </div>
          </div>
          <div>
            <div className="card-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <div className="card">
                <div className="card-icon" style={{ background: 'rgba(239, 68, 68, 0.08)', color: 'var(--red)' }}>⏱️</div>
                <div className="card-title">Manual Detection</div>
                <div className="card-text">Cascading delays take 18–30 minutes to detect manually. By then, crowds have already formed.</div>
              </div>
              <div className="card">
                <div className="card-icon" style={{ background: 'rgba(245, 166, 35, 0.08)', color: 'var(--gold)' }}>🔀</div>
                <div className="card-title">No Smart Reallocation</div>
                <div className="card-text">Platform swaps are done by intuition. Long trains get sent to short platforms, blocking active routes.</div>
              </div>
              <div className="card">
                <div className="card-icon" style={{ background: 'rgba(59, 130, 246, 0.08)', color: 'var(--blue)' }}>🗣️</div>
                <div className="card-title">Language Barriers</div>
                <div className="card-text">Announcements fail passengers who don't speak the local language. Critical safety info is lost.</div>
              </div>
              <div className="card" style={{ borderColor: 'var(--saffron)', background: 'rgba(255, 107, 26, 0.03)' }}>
                <div className="card-icon" style={{ background: 'rgba(255, 107, 26, 0.1)', color: 'var(--saffron)' }}>🤖</div>
                <div className="card-title">RailSaarthi Fixes This</div>
                <div className="card-text">Detects delays, plans reallocations, and alerts staff in 90 seconds.</div>
                <button 
                  className="btn-primary" 
                  style={{ marginTop: '16px', width: '100%', fontSize: '0.78rem', padding: '8px', borderRadius: '4px', justifyContent: 'center' }} 
                  onClick={() => onNavigate('dashboard')}
                >
                  🎯 Go to Live Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── THE SOLUTION SECTION ── */}
      <div className="section" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '90px' }}>
        <div className="section-label">The Solution</div>
        <div className="section-title">Three Capabilities. One Agentic Brain.</div>
        <p className="section-subtitle">RailSaarthi isn't a chatbot. It's an autonomous agent that observes, reasons, decides, and acts.</p>
        
        <div className="overview-grid">
          <div>
            <div className="card-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1 }}>
                  <div className="card-icon" style={{ background: 'rgba(255, 107, 26, 0.08)', color: 'var(--saffron)' }}>🔍</div>
                  <div className="card-title">Delay Cascade Detector</div>
                  <div className="card-text">Calculates second and third-order delays. Knows train statuses before control rooms do.</div>
                  <div className="tech-pills">
                    <span className="tech-pill tp-orange">IRCTC API</span>
                    <span className="tech-pill tp-blue">GPT-4o</span>
                  </div>
                </div>
                <button 
                  className="btn-secondary" 
                  style={{ marginTop: '16px', width: '100%', fontSize: '0.75rem', padding: '8px', borderRadius: '4px' }} 
                  onClick={() => onNavigate('dashboard', 'delay')}
                >
                  ⚡ Run Delay Simulation
                </button>
              </div>
              <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1 }}>
                  <div className="card-icon" style={{ background: 'rgba(16, 185, 129, 0.08)', color: 'var(--green)' }}>🏛️</div>
                  <div className="card-title">Platform Reallocator</div>
                  <div className="card-text">Autonomously suggests optimal platform swaps. Station master accepts with one click.</div>
                  <div className="tech-pills">
                    <span className="tech-pill tp-green">Constraint Solver</span>
                    <span className="tech-pill tp-blue">Claude API</span>
                  </div>
                </div>
                <button 
                  className="btn-secondary" 
                  style={{ marginTop: '16px', width: '100%', fontSize: '0.75rem', padding: '8px', borderRadius: '4px' }} 
                  onClick={() => onNavigate('dashboard', 'platform')}
                >
                  🏛️ View Platform Grid
                </button>
              </div>
              <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1 }}>
                  <div className="card-icon" style={{ background: 'rgba(245, 166, 35, 0.08)', color: 'var(--gold)' }}>📢</div>
                  <div className="card-title">Multilingual Alert System</div>
                  <div className="card-text">Generates platform change announcements in Hindi, Marathi, Telugu, and 8 other languages.</div>
                  <div className="tech-pills">
                    <span className="tech-pill tp-purple">Google Translate</span>
                    <span className="tech-pill tp-orange">WhatsApp API</span>
                  </div>
                </div>
                <button 
                  className="btn-secondary" 
                  style={{ marginTop: '16px', width: '100%', fontSize: '0.75rem', padding: '8px', borderRadius: '4px' }} 
                  onClick={() => onNavigate('emergency')}
                >
                  📢 Open Emergency Chat
                </button>
              </div>
              <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1 }}>
                  <div className="card-icon" style={{ background: 'rgba(59, 130, 246, 0.08)', color: 'var(--blue)' }}>🗃️</div>
                  <div className="card-title">SQLite Audit Logging</div>
                  <div className="card-text">Logs all master accept/override actions into an immutable local SQLite database for compliance auditing.</div>
                  <div className="tech-pills">
                    <span className="tech-pill tp-blue">SQLite DB</span>
                    <span className="tech-pill tp-purple">Audit Logs</span>
                  </div>
                </div>
                <button 
                  className="btn-secondary" 
                  style={{ marginTop: '16px', width: '100%', fontSize: '0.75rem', padding: '8px', borderRadius: '4px' }} 
                  onClick={() => onNavigate('dashboard')}
                >
                  📋 View Audit Logs
                </button>
              </div>
            </div>
          </div>
          <div>
            <div className="camera-box" style={{ borderColor: 'rgba(255, 107, 26, 0.35)' }}>
              <div className="camera-box-corners" style={{ borderColor: 'var(--saffron)' }}></div>
              <span className="camera-tag" style={{ background: 'var(--saffron)', color: '#fff' }}>platform_reallocator</span>
              <div className="overview-graphic">
                <img src="/railsaarthi_solution.png" alt="Platform Allocation Solution" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── FOOTER BANNER ── */}
      <div className="section" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '90px' }}>
        <div className="pitch-banner">
          <h2>The Problem No Technology Has Solved</h2>
          <p>Google Maps, IRCTC, and all existing railway apps handle information retrieval. None of them handle autonomous decision-making during disruptions. That's the gap RailSaarthi fills.</p>
          <div className="pitch-quote">
            "Indian trains are unpredictable by nature. The only way to manage unpredictability is with an intelligence that reacts faster than humans can. That's what we built."
          </div>
        </div>
      </div>
    </div>
  );
};

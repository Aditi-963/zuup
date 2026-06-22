import React from 'react';

interface NavbarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onViewChange }) => {
  return (
    <nav style={{
      background: 'rgba(5, 5, 5, 0.85)',
      padding: '0 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '70px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderBottom: '1px solid var(--border-color)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)'
    }}>
      <a 
        className="nav-logo" 
        href="#" 
        onClick={(e) => { e.preventDefault(); onViewChange('home'); }} 
        style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}
      >
        <div 
          className="nav-logo-icon" 
          style={{
            width: '36px', height: '36px',
            background: 'var(--saffron)',
            borderRadius: '6px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px',
            color: '#000'
          }}
        >
          🚂
        </div>
        <div>
          <div 
            style={{ 
              fontSize: '1.25rem', 
              fontWeight: 700, 
              color: 'var(--text-primary)', 
              letterSpacing: '-0.3px', 
              lineHeight: 1.2,
              fontFamily: "'Space Grotesk', sans-serif"
            }}
          >
            <span className="bracket">RailSaarthi</span>
          </div>
          <div 
            style={{ 
              fontSize: '0.62rem', 
              color: 'var(--text-secondary)', 
              fontWeight: 500, 
              letterSpacing: '1px',
              fontFamily: "'Fira Code', monospace",
              textTransform: 'uppercase',
              marginTop: '1px'
            }}
          >
            Agentic Railway Co-Pilot
          </div>
        </div>
      </a>
      <div className="nav-links" style={{ display: 'flex', gap: '8px' }}>
        <button 
          className={`nav-link ${currentView === 'home' ? 'active' : ''}`} 
          onClick={() => onViewChange('home')}
        >
          Overview
        </button>
        <button 
          className={`nav-link ${currentView === 'dashboard' ? 'active' : ''}`} 
          onClick={() => onViewChange('dashboard')}
        >
          Live Dashboard <span className="nav-badge">DEMO</span>
        </button>
        <button 
          className={`nav-link ${currentView === 'emergency' ? 'active' : ''}`} 
          onClick={() => onViewChange('emergency')}
        >
          Emergency AI
        </button>
        <button 
          className={`nav-link ${currentView === 'why' ? 'active' : ''}`} 
          onClick={() => onViewChange('why')}
        >
          Why We Win
        </button>
      </div>
    </nav>
  );
};

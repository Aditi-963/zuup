import React, { useState, useEffect } from 'react';
import type { Train, SwapPlan, AuditLogItem } from '../models/types';
import * as api from '../services/api';

interface DashboardProps {
  triggerAction?: string;
  onClearAction?: () => void;
}

const INITIAL_TRAINS: Train[] = [
  { id: '12123', name: 'Deccan Queen', route: 'Pune → Mumbai CST', platform: 1, status: 'ok', dept: '09:15', delay: 0 },
  { id: '11007', name: 'Deccan Express', route: 'Pune → Mumbai CST', platform: 2, status: 'ok', dept: '09:30', delay: 0 },
  { id: '12107', name: 'Pragati Express', route: 'Pune → Mumbai', platform: 3, status: 'ok', dept: '10:00', delay: 0 },
  { id: '12163', name: 'Chennai Express', route: 'Pune → Chennai', platform: 4, status: 'ok', dept: '10:30', delay: 0 },
  { id: '17031', name: 'Hyderabad Express', route: 'Pune → Hyderabad', platform: 5, status: 'ok', dept: '11:00', delay: 0 },
  { id: '12025', name: 'Shatabdi Express', route: 'Pune → Kolhapur', platform: 3, status: 'ok', dept: '11:30', delay: 0 },
  { id: '22105', name: 'Indrayani Exp', route: 'Pune → Mumbai', platform: 1, status: 'ok', dept: '12:00', delay: 0 },
  { id: '11301', name: 'Udyan Express', route: 'Bengaluru → Mumbai', platform: 2, status: 'ok', dept: '13:00', delay: 0 },
];

export const Dashboard: React.FC<DashboardProps> = ({ triggerAction, onClearAction }) => {
  const [trains, setTrains] = useState<Train[]>(INITIAL_TRAINS);
  const [selectedTrainId, setSelectedTrainId] = useState<string>('');
  const [suggestionPlan, setSuggestionPlan] = useState<SwapPlan | null>(null);
  const [customCrowdPlan, setCustomCrowdPlan] = useState<string | null>(null);
  const [customMultiPlan, setCustomMultiPlan] = useState<{ recovery_steps: string[]; crowd_level: string; hindi_announcement: string } | null>(null);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [suggestionAccepted, setSuggestionAccepted] = useState<boolean>(false);
  const [suggestionOverridden, setSuggestionOverridden] = useState<boolean>(false);
  const [platformStatus, setPlatformStatus] = useState<string>('ALL CLEAR');
  const [platformStatusClass, setPlatformStatusClass] = useState<string>('status-ok');
  const [toast, setToast] = useState<{ message: string; type: string; icon: string } | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);

  useEffect(() => {
    fetchAuditLog();
    if (triggerAction === 'delay') {
      fireDelay();
      if (onClearAction) onClearAction();
    } else if (triggerAction === 'platform') {
      setSelectedTrainId('12123');
      if (onClearAction) onClearAction();
    }
  }, [triggerAction]);

  const showToast = (message: string, type: string = 'success', icon: string = '✓') => {
    setToast({ message, type, icon });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAuditLog = async () => {
    try {
      const data = await api.fetchAuditLogs();
      setAuditLogs(data.decisions);
    } catch (err) {
      console.error('Failed to fetch audit log:', err);
    }
  };

  const fireDelay = async () => {
    setSuggestionAccepted(false);
    setSuggestionOverridden(false);
    setCustomCrowdPlan(null);
    setCustomMultiPlan(null);

    // Update Deccan Express and Shatabdi status locally
    setTrains(prev => prev.map(t => {
      if (t.id === '11007') {
        return { ...t, status: 'delayed', delay: 47 };
      }
      if (t.id === '12025') {
        return { ...t, status: 'warning' };
      }
      return t;
    }));

    setPlatformStatus('⚠️ DELAY DETECTED');
    setPlatformStatusClass('status-delayed');
    showToast('⚠️ Delay detected! AI agent activating...', 'warning', '⚠️');
    setIsThinking(true);

    try {
      const data = await api.simulateDelay('11007', 47, 'Lonavala block');
      setSuggestionPlan(data.recovery_plan);
      setIsThinking(false);
      fetchAuditLog();
    } catch (err) {
      console.error(err);
      setIsThinking(false);
    }
  };

  const acceptSwap = async (targetPlatform: number) => {
    if (suggestionAccepted) return;
    setSuggestionAccepted(true);

    // Update platform locally
    setTrains(prev => prev.map(t => {
      if (t.id === '11007') {
        return { ...t, platform: targetPlatform };
      }
      return t;
    }));

    setPlatformStatus('✓ RECOVERY IN PROGRESS');
    setPlatformStatusClass('status-warning');
    showToast('✓ Platform swap executed! Staff alerted in Hindi.', 'success', '✓');

    try {
      await api.logDecisionAction('11007', true);
      fetchAuditLog();
    } catch (err) {
      console.error(err);
    }
  };

  const overrideSwap = async () => {
    setSuggestionOverridden(true);
    showToast('Override noted. Manual mode active.', 'warning', '✏️');

    try {
      await api.logDecisionAction('11007', false, 'Manual override by Station Master');
      fetchAuditLog();
    } catch (err) {
      console.error(err);
    }
  };

  const fireCrowdAlert = async () => {
    setSuggestionPlan(null);
    setCustomMultiPlan(null);
    setSuggestionAccepted(false);
    setSuggestionOverridden(false);
    showToast('🚨 Crowd alert on Platform 3!', 'error', '🚨');
    setIsThinking(true);

    try {
      const data = await api.simulateCrowdAlert(3, 340);
      setCustomCrowdPlan(data.plan);
      setIsThinking(false);
      fetchAuditLog();
    } catch (err) {
      console.error(err);
      setIsThinking(false);
    }
  };

  const fireMultiDelay = async () => {
    setSuggestionPlan(null);
    setCustomCrowdPlan(null);
    setSuggestionAccepted(false);
    setSuggestionOverridden(false);

    setTrains(prev => prev.map(t => {
      if (t.id === '12123') return { ...t, status: 'delayed', delay: 22 };
      if (t.id === '12107') return { ...t, status: 'delayed', delay: 35 };
      if (t.id === '12163') return { ...t, status: 'warning' };
      return t;
    }));

    setPlatformStatus('🔴 CASCADE EVENT');
    setPlatformStatusClass('status-delayed');
    showToast('🔴 Multi-train cascade! Emergency recovery mode.', 'error', '🔴');
    setIsThinking(true);

    try {
      const data = await api.simulateMultiDelay([
        { train_id: '12123', delay_mins: 22 },
        { train_id: '12107', delay_mins: 35 }
      ]);
      setCustomMultiPlan(data.recovery_plan);
      setIsThinking(false);
      fetchAuditLog();
    } catch (err) {
      console.error(err);
      setIsThinking(false);
    }
  };

  const resetDashboard = () => {
    setTrains(INITIAL_TRAINS);
    setSuggestionPlan(null);
    setCustomCrowdPlan(null);
    setCustomMultiPlan(null);
    setSuggestionAccepted(false);
    setSuggestionOverridden(false);
    setIsThinking(false);
    setPlatformStatus('ALL CLEAR');
    setPlatformStatusClass('status-ok');
    showToast('Dashboard reset to normal state', 'success', '↺');
  };

  const getPlatformTrains = (pNum: number): Train[] => {
    return trains.filter(t => t.platform === pNum);
  };

  return (
    <div className="view active" id="view-dashboard">
      {toast && (
        <div className={`toast show ${toast.type}`} id="toast">
          <span id="toast-icon">{toast.icon}</span>
          <span id="toast-msg">{toast.message}</span>
        </div>
      )}

      <div className="section">
        <div className="section-label">Live Demo — Command Center</div>
        <div className="section-title">Pune Junction · Station Master Console</div>
        <p className="section-subtitle">Real-time simulation of cascading delays, dynamic platform constraints, and agent action logs.</p>

        <div className="demo-bar">
          <span className="demo-bar-title">Simulation Controls</span>
          <button className="demo-btn fire" onClick={fireDelay}>🔴 Fire Delay: Deccan Express +47 min</button>
          <button className="demo-btn" onClick={fireCrowdAlert}>⚠️ Crowd Alert: Platform 3</button>
          <button className="demo-btn" onClick={fireMultiDelay}>⚡ Multi-Train Cascade</button>
          <button className="demo-btn" onClick={resetDashboard}>↺ Reset</button>
        </div>

        <div className="dashboard-grid">
          {/* LEFT: Train list */}
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">🚆 Active Trains</span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }} className="mono">[ LIVE · 08:42 ]</span>
            </div>
            <div className="panel-body" id="train-list" style={{ overflowY: 'auto', maxHeight: '550px' }}>
              {trains.map(t => (
                <div
                  key={t.id}
                  className={`train-item ${t.status === 'delayed' ? 'delayed' : ''} ${selectedTrainId === t.id ? 'selected' : ''}`}
                  onClick={() => setSelectedTrainId(t.id)}
                >
                  <div className="train-number">{t.id}</div>
                  <div className="train-info">
                    <div className="train-name">{t.name}</div>
                    <div className="train-route">{t.route}</div>
                  </div>
                  <div className={`train-status ${
                    t.status === 'ok' ? 'status-ok' : t.status === 'delayed' ? 'status-delayed' : t.status === 'warning' ? 'status-warning' : 'status-diverted'
                  }`}>
                    {t.status === 'ok' ? 'ON TIME' : t.status === 'delayed' ? `+${t.delay}m` : t.status === 'warning' ? 'AT RISK' : 'DIVERTED'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CENTER: Platform Grid */}
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">🏛️ Platform Status</span>
              <span id="platform-status-tag" className={`train-status ${platformStatusClass}`}>{platformStatus}</span>
            </div>
            
            <div id="platform-grid" className="platform-grid">
              {[1, 2, 3, 4, 5].map(pNum => {
                const pTrains = getPlatformTrains(pNum);
                const hasDelay = pTrains.some(t => t.status === 'delayed');
                const slotClass = pTrains.length === 0 ? 'platform-free' : hasDelay ? 'platform-delayed-slot' : 'platform-busy';
                return (
                  <div key={pNum} className={`platform-slot ${slotClass} ${isThinking && pNum === 2 ? 'platform-swapping' : ''}`} id={`platform-${pNum}`}>
                    <div className="platform-num">Plat. {pNum}</div>
                    {pTrains.map(t => (
                      <React.Fragment key={t.id}>
                        <div className="platform-train">{t.id}</div>
                        <div className="platform-time">{t.dept}{t.delay ? ` +${t.delay}m` : ''}</div>
                      </React.Fragment>
                    ))}
                    {pTrains.length === 0 && <div className="platform-time" style={{ opacity: 0.4 }}>Free</div>}
                  </div>
                );
              })}
            </div>
            
            <div className="platform-tracks">
              <div className="track-line"></div>
              <div className="track-line"></div>
              <div className="track-line"></div>
              <div className="track-line"></div>
              <div className="track-line"></div>
            </div>

            <div style={{ padding: '0 20px 20px', borderTop: '1px solid var(--border-color)', marginTop: 'auto' }}>
              <div className="section-label" style={{ marginTop: '16px', marginBottom: '4px' }}>Audit Log (SQLite DB Audit Trail)</div>
              <div className="audit-log" id="audit-log">
                {auditLogs.length === 0 ? (
                  <div className="log-line">
                    <span className="log-time">08:30 </span>
                    <span className="log-level-info">[INFO] </span>
                    <span className="log-msg">SQLite database connected. Audit logger active.</span>
                  </div>
                ) : (
                  auditLogs.map((log) => {
                    const time = new Date(log.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
                    let msg = '';
                    let level = 'info';
                    if (log.type === 'delay_cascade') {
                      msg = `Delay cascade plan computed for Train #${log.train}.`;
                      level = 'warn';
                    } else if (log.type === 'crowd_alert') {
                      msg = `Crowd emergency alert plan logged for ${log.train}.`;
                      level = 'alert';
                    } else if (log.type === 'multi_cascade') {
                      msg = `Multi-train cascade recovery plan resolved.`;
                      level = 'alert';
                    }
                    if (log.outcome) {
                      msg += ` Action: ${log.outcome}.`;
                      level = log.outcome === 'ACCEPTED' ? 'success' : 'warn';
                    }
                    return (
                      <div key={log.id} className="log-line">
                        <span className="log-time">{time} </span>
                        <span className={`log-level-${level}`}>[{level.toUpperCase()}] </span>
                        <span className="log-msg">{msg}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: AI Suggestion */}
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">🤖 AI Agent Suggestions</span>
              <span className="mono" style={{ fontSize: '0.65rem', color: 'var(--saffron)' }}>[ ACTIVE ]</span>
            </div>
            
            <div id="ai-panel-body" className="panel-body" style={{ overflowY: 'auto', maxHeight: '550px' }}>
              {isThinking && (
                <div>
                  <div className="ai-thinking">
                    <div className="dot-pulse"><span></span><span></span><span></span></div>
                    <div className="mono" style={{ fontSize: '0.75rem' }}>Solving constraints...</div>
                  </div>
                  <div className="mono" style={{ padding: '0 8px 16px', fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                    <div>• Querying Live Timetables...</div>
                    <div>• Calculating downstream delays...</div>
                    <div>• Matching platform lengths...</div>
                  </div>
                </div>
              )}

              {!isThinking && !suggestionPlan && !customCrowdPlan && !customMultiPlan && (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
                  <div style={{ fontSize: '2.2rem', marginBottom: '14px', filter: 'grayscale(1) brightness(1.5)' }}>🤖</div>
                  <div className="mono" style={{ fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Systems Nominal</div>
                  <div style={{ fontSize: '0.75rem', marginTop: '8px', color: 'var(--text-muted)' }}>Click a control button above to run simulations.</div>
                </div>
              )}

              {!isThinking && suggestionPlan && (
                <div>
                  <div className="suggestion-card urgent">
                    <div className="suggestion-label urgent">⚡ Recovery Plan Action</div>
                    <div className="suggestion-text">
                      Reallocate <strong>{suggestionPlan.primary_swap.train}</strong> from Platform {suggestionPlan.primary_swap.from_platform} to <strong>Platform {suggestionPlan.primary_swap.to_platform}</strong>.
                    </div>
                    <div className="suggestion-text" style={{ marginTop: '8px', fontSize: '0.76rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                      Reason: {suggestionPlan.primary_swap.reason}
                    </div>
                    
                    <div id="action-btns" className="action-btns">
                      {suggestionAccepted ? (
                        <div className="accepted-banner">
                          ✓ Plan accepted. Database logged, staff alerted, PA broadcast queued.
                        </div>
                      ) : suggestionOverridden ? (
                        <div className="accepted-banner" style={{ background: 'rgba(245, 166, 35, 0.05)', borderColor: 'rgba(245, 166, 35, 0.25)', color: 'var(--gold)' }}>
                          ✏️ Manual override active. Database audit logged.
                        </div>
                      ) : (
                        <>
                          <button className="btn-accept" onClick={() => acceptSwap(suggestionPlan.primary_swap.to_platform)}>Accept Swap</button>
                          <button className="btn-override" onClick={overrideSwap}>Override</button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="suggestion-card info">
                    <div className="suggestion-label info">📋 Downstream Cascades</div>
                    {suggestionPlan.affected_trains.map((t, idx) => (
                      <div key={idx} className="suggestion-text" style={{ marginBottom: '4px', fontSize: '0.76rem' }}>• {t}</div>
                    ))}
                  </div>
                  
                  <div className="suggestion-card">
                    <div className="suggestion-label" style={{ color: 'var(--gold)' }}>📢 PA Multilingual Alert</div>
                    <div className="suggestion-hindi">{suggestionPlan.hindi_announcement}</div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px', flexWrap: 'wrap', gap: '8px' }}>
                    <div className={`crowd-badge crowd-${suggestionPlan.crowd_alert.toLowerCase()}`}>
                      <div className="crowd-dot"></div>
                      Crowd: {suggestionPlan.crowd_alert}
                    </div>
                    <div className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                      EST: ~{suggestionPlan.estimated_recovery_mins}m
                    </div>
                  </div>
                </div>
              )}

              {!isThinking && customCrowdPlan && (
                <div>
                  <div className="suggestion-card urgent">
                    <div className="suggestion-label urgent">🚨 Crowd Control Plan</div>
                    <div className="suggestion-text" style={{ whiteSpace: 'pre-line', lineHeight: '1.6', fontSize: '0.78rem' }}>{customCrowdPlan}</div>
                  </div>
                  <div className="crowd-badge crowd-high">
                    <div className="crowd-dot"></div>
                    CRITICAL ACTION
                  </div>
                </div>
              )}

              {!isThinking && customMultiPlan && (
                <div>
                  <div className="suggestion-card urgent">
                    <div className="suggestion-label urgent">🔴 Multi-Train Plan</div>
                    {customMultiPlan.recovery_steps.map((step, idx) => (
                      <div key={idx} className="suggestion-text" style={{ marginTop: '8px', fontSize: '0.78rem' }}>
                        <strong>Step {idx+1}:</strong> {step}
                      </div>
                    ))}
                    <div className="suggestion-hindi" style={{ marginTop: '12px' }}>{customMultiPlan.hindi_announcement}</div>
                  </div>
                  <div className="crowd-badge crowd-high">
                    <div className="crowd-dot"></div>
                    Cascade Level: {customMultiPlan.crowd_level}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

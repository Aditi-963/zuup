'use client';

import { useOperationsStore } from '../store/useOperationsStore';
import { auditLogService } from '../services/api';
import { 
  Bot, 
  Check, 
  X, 
  RefreshCw, 
  TrendingUp, 
  ShieldAlert, 
  BrainCircuit,
  Lock
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useState } from 'react';

interface DecisionEngineProps {
  onActionComplete?: () => void;
}

export default function DecisionEngine({ onActionComplete }: DecisionEngineProps) {
  const { 
    activeRecommendation, 
    activeRecommendationId, 
    isProcessing, 
    setActiveRecommendation,
    setActiveAlert,
    currentUser
  } = useOperationsStore();

  const [localLoading, setLocalLoading] = useState(false);

  // Role permissions check
  const isStationMasterOrAdmin = currentUser?.role === 'STATION_MASTER' || currentUser?.role === 'ADMIN';

  const handleAction = async (approved: boolean) => {
    if (activeRecommendationId === null) return;
    if (!isStationMasterOrAdmin) return; // double check permission guard

    setLocalLoading(true);
    try {
      await auditLogService.respondToRecommendation(activeRecommendationId, approved);
      
      if (approved && activeRecommendation) {
        setActiveAlert(`Platform swap executed successfully. Train ${activeRecommendation.recommended_action.move_train} moved to Platform ${activeRecommendation.recommended_action.new_platform}.`);
      } else {
        setActiveAlert('Recommendation rejected. Operations maintained on current tracks.');
      }

      // Clear recommendation
      setActiveRecommendation(null, null);
      
      if (onActionComplete) {
        onActionComplete();
      }
    } catch (e) {
      console.error('Error submitting recommendation action', e);
    } finally {
      setLocalLoading(false);
    }
  };

  const isAnyLoading = isProcessing || localLoading;

  return (
    <div className="bg-card rounded-2xl border border-border/80 p-6 shadow-sm flex flex-col gap-5 relative overflow-hidden min-h-[320px] justify-center premium-card-shadow transition-all duration-300">
      
      {/* Background glow when alert is active */}
      {activeRecommendation && (
        <div className="absolute -right-20 -top-20 w-48 h-48 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      )}

      {/* AI Processing Loading Overlay */}
      {isAnyLoading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-card/90 backdrop-blur-sm transition-all duration-300">
          <BrainCircuit className="h-10 w-10 text-primary animate-pulse mb-3" />
          <div className="flex items-center gap-2 text-2xs font-mono tracking-widest text-text-primary uppercase font-bold">
            <RefreshCw className="h-4 w-4 animate-spin text-primary" />
            <span>Autonomous Agent Pipeline...</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      {activeRecommendation ? (
        <div className="flex flex-col gap-4.5 z-10 font-sans">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/55 pb-3">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary animate-pulse" />
              <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-text-primary">
                AI Decision Engine
              </h3>
            </div>
            <span className="font-mono text-3xs text-danger border border-danger/30 bg-danger/10 px-2.5 py-1 rounded-full font-black animate-pulse uppercase tracking-wider">
              Resolve Conflict
            </span>
          </div>

          {/* Conflict Details Banner */}
          <div className="flex gap-3 bg-secondary-bg/50 p-4 rounded-xl border border-border/80 items-start">
            <ShieldAlert className="h-5 w-5 text-warning shrink-0 mt-0.5" />
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="font-mono text-[9px] text-text-secondary uppercase tracking-widest font-bold">Detected Event</span>
              <span className="text-[11.5px] font-bold text-text-primary leading-snug">
                Platform conflict on PF {activeRecommendation.recommended_action.old_platform} due to delay on Train {activeRecommendation.recommended_action.move_train}
              </span>
            </div>
          </div>

          {/* Affected Trains List */}
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-[9px] text-text-secondary uppercase tracking-widest font-bold">Affected Downstream Routes</span>
            <div className="flex flex-wrap gap-2">
              {activeRecommendation.affected_trains.map((t, idx) => (
                <span key={idx} className="text-[10px] font-mono font-bold bg-danger/10 text-danger border border-danger/25 px-3 py-1 rounded-lg">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Recommendation Swap Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-border/60 bg-secondary-bg/25 rounded-xl p-4 items-center">
            
            {/* Visual Swap Arrow */}
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[9px] text-text-secondary uppercase tracking-widest font-bold">Proposed Tracks Shift</span>
              <div className="flex items-center gap-3 mt-1">
                <span className="font-mono text-xs font-bold bg-card border border-border/80 px-2.5 py-1.5 rounded-lg text-text-secondary shadow-sm">
                  PF {activeRecommendation.recommended_action.old_platform}
                </span>
                <span className="text-xs font-mono font-bold text-primary animate-pulse">→</span>
                <span className="font-mono text-xs font-bold bg-primary border border-primary/20 px-2.5 py-1.5 rounded-lg text-white shadow-[0_0_15px_rgba(255,107,0,0.25)]">
                  PF {activeRecommendation.recommended_action.new_platform}
                </span>
              </div>
            </div>

            {/* Metrics */}
            <div className="flex justify-between border-t sm:border-t-0 sm:border-l border-border/60 pt-3 sm:pt-0 pl-0 sm:pl-4">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 text-success">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-mono font-black text-xs">{activeRecommendation.estimated_recovery}</span>
                </div>
                <span className="text-[9px] text-text-secondary font-mono uppercase tracking-widest font-bold mt-1">Time saved</span>
              </div>

              <div className="flex flex-col items-center">
                <span className="font-mono font-black text-xs text-primary">{activeRecommendation.confidence}</span>
                <span className="text-[9px] text-text-secondary font-mono uppercase tracking-widest font-bold mt-1">AI Confidence</span>
              </div>
            </div>
          </div>

          {/* Operator Action Buttons (Role Adapted) */}
          <div className="flex flex-col gap-2 mt-1">
            {isStationMasterOrAdmin ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleAction(true)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-success to-success/90 hover:opacity-95 py-3 text-xs font-bold text-white shadow-[0_0_12px_rgba(22,163,74,0.15)] transition-all duration-200 cursor-pointer active:scale-95"
                >
                  <Check className="h-4 w-4" />
                  <span>Approve Switch</span>
                </button>
                <button
                  onClick={() => handleAction(false)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-danger/30 hover:bg-danger/[0.03] py-3 text-xs font-bold text-danger transition-all duration-200 cursor-pointer active:scale-95"
                >
                  <X className="h-4 w-4" />
                  <span>Override / Keep Track</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 p-3 bg-secondary-bg/60 rounded-xl border border-border/80 items-center justify-center text-center">
                <div className="flex items-center gap-1.5 text-text-secondary text-[11px] font-semibold">
                  <Lock className="h-3.5 w-3.5 text-warning" />
                  <span>APPROVAL LOCK: Station Master permissions required.</span>
                </div>
                <span className="text-[9px] text-text-secondary font-mono uppercase tracking-wider font-bold">
                  ROLE: {currentUser?.role.replace('_', ' ') || 'CONTROL OPERATOR'} (VIEW ONLY)
                </span>
              </div>
            )}
          </div>

        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center text-center p-6 gap-5 z-10 select-none font-sans">
          <div className="relative flex items-center justify-center h-14 w-14 rounded-full border border-border/70 bg-secondary-bg/40">
            <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping" />
            <Bot className="h-6 w-6 text-text-secondary" />
          </div>
          
          <div className="flex flex-col gap-1 max-w-sm">
            <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-text-primary">
              AI Copilot Monitoring Network
            </h4>
            <p className="text-[10px] text-text-secondary font-mono uppercase tracking-widest leading-relaxed font-semibold">
              Timetable and platform routing checked. All signaling channels active. No track conflicts detected in active sector.
            </p>
          </div>

          {/* Scanning radar indicator (glowing primary orange) */}
          <div className="h-1.5 w-40 bg-secondary-bg rounded-full overflow-hidden relative border border-border/80">
            <div 
              className="absolute top-0 bottom-0 w-12 bg-primary/45 rounded-full animate-pulse shadow-[0_0_8px_var(--primary)]" 
              style={{
                animation: 'scan 2.5s linear infinite'
              }} 
            />
          </div>
        </div>
      )}
    </div>
  );
}

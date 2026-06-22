'use client';

import { Platform } from '../types';
import { ShieldAlert, Users, Milestone, ArrowRightLeft } from 'lucide-react';
import { cn } from '../lib/utils';

interface PlatformVisualizerProps {
  platforms: Platform[];
  onPlatformClick?: (platformNumber: number) => void;
}

export default function PlatformVisualizer({ platforms, onPlatformClick }: PlatformVisualizerProps) {
  // Ensure we display all 8 platforms even if data is partial
  const displayPlatforms = Array.from({ length: 8 }, (_, i) => {
    const platNum = i + 1;
    return platforms.find(p => p.platform_number === platNum) || {
      platform_number: platNum,
      occupancy_status: 'VACANT',
      assigned_train_number: null,
      crowd_status: 'LOW',
    } as Platform;
  });

  return (
    <div className="bg-card rounded-2xl border border-border/80 p-6 shadow-sm flex flex-col gap-6 premium-card-shadow transition-all duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-border/50 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(255,107,0,0.1)]">
            <Milestone className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-text-primary">
              Station Platform Tracks Visualizer
            </h3>
            <p className="text-[10px] text-text-secondary font-mono uppercase tracking-widest mt-0.5">
              Live Sector Telemetry & Dispatch Nodes
            </p>
          </div>
        </div>
        
        {/* Status Legend */}
        <div className="flex items-center gap-4 text-[9px] font-mono uppercase tracking-wider font-bold text-text-secondary">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-success pulse-indicator" />
            <span>Green (Clear/Active)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-warning" />
            <span>Orange (Warning)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-danger" />
            <span>Red (Delayed/Blocked)</span>
          </div>
        </div>
      </div>

      {/* Grid of 8 Platforms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayPlatforms.map((plat) => {
          const isOccupied = plat.occupancy_status === 'OCCUPIED';
          const isBlocked = plat.occupancy_status === 'BLOCKED';
          const isVacant = plat.occupancy_status === 'VACANT';

          // Visual states: Green (clear/vacant), Orange (warning/medium crowd), Red (delayed/blocked/heavy crowd)
          let statusTheme = 'success';
          let statusColorClass = 'border-success/20 bg-success/5 hover:border-success/40';
          let trackLineClass = 'bg-success/80';
          let glowClass = 'shadow-[inset_0_0_15px_rgba(22,163,74,0.02)]';

          if (isBlocked) {
            statusTheme = 'danger';
            statusColorClass = 'border-danger/35 bg-danger/[0.03] hover:border-danger/55';
            trackLineClass = 'bg-danger animate-pulse';
            glowClass = 'shadow-[inset_0_0_20px_rgba(220,38,38,0.06)]';
          } else if (isOccupied) {
            if (plat.crowd_status === 'HIGH') {
              statusTheme = 'danger';
              statusColorClass = 'border-danger/35 bg-danger/[0.03] hover:border-danger/55';
              trackLineClass = 'bg-danger';
              glowClass = 'shadow-[inset_0_0_20px_rgba(220,38,38,0.05)]';
            } else if (plat.crowd_status === 'MEDIUM') {
              statusTheme = 'warning';
              statusColorClass = 'border-warning/35 bg-warning/[0.03] hover:border-warning/55';
              trackLineClass = 'bg-warning';
              glowClass = 'shadow-[inset_0_0_20px_rgba(245,158,11,0.04)]';
            } else {
              // low crowd occupied is active green operation
              statusTheme = 'success';
              statusColorClass = 'border-success/25 bg-success/[0.02] hover:border-success/45';
              trackLineClass = 'bg-success/80';
              glowClass = 'shadow-[inset_0_0_15px_rgba(22,163,74,0.02)]';
            }
          } else {
            // Vacant/clear is green active node
            statusTheme = 'success';
            statusColorClass = 'border-border/80 bg-card hover:bg-hover-surface/50 hover:border-primary/45';
            trackLineClass = 'bg-border/60 border-dashed border-t';
            glowClass = '';
          }

          return (
            <div
              key={plat.platform_number}
              onClick={() => onPlatformClick?.(plat.platform_number)}
              className={cn(
                "group relative flex flex-col justify-between border rounded-2xl p-5 transition-all duration-300 overflow-hidden cursor-pointer",
                statusColorClass,
                glowClass
              )}
            >
              {/* Header Info: Platform Badge & Status */}
              <div className="flex justify-between items-start z-10">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-2xs font-extrabold px-2 py-1 bg-secondary-bg border border-border rounded-lg text-text-primary">
                    PF {plat.platform_number}
                  </span>
                  <span className={cn(
                    "text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
                    statusTheme === 'danger' ? "bg-danger/10 text-danger" :
                    statusTheme === 'warning' ? "bg-warning/10 text-warning" : "bg-success/10 text-success"
                  )}>
                    {isBlocked ? 'SUSPENDED' : isOccupied ? 'OCCUPIED' : 'CLEAR'}
                  </span>
                </div>

                {/* Crowd Level */}
                <div className="flex items-center gap-1.5">
                  <Users className={cn(
                    "h-3.5 w-3.5",
                    plat.crowd_status === 'HIGH' ? "text-danger animate-pulse" :
                    plat.crowd_status === 'MEDIUM' ? "text-warning" : "text-text-secondary"
                  )} />
                  <span className={cn(
                    "font-mono text-[9px] font-bold uppercase tracking-wider",
                    plat.crowd_status === 'HIGH' ? "text-danger" :
                    plat.crowd_status === 'MEDIUM' ? "text-warning" : "text-text-secondary"
                  )}>
                    {plat.crowd_status} FLOW
                  </span>
                </div>
              </div>

              {/* High-Fidelity Train Tracks and Train Graphic */}
              <div className="relative my-6 h-10 w-full flex items-center justify-center">
                {/* Wood/concrete ties (sleepers) across track */}
                <div className="absolute inset-x-0 h-4 bg-[repeating-linear-gradient(90deg,var(--border),var(--border)_4px,transparent_4px,transparent_16px)] opacity-35" />
                
                {/* Top/bottom rails */}
                <div className={cn("absolute inset-x-0 h-[2.5px] top-1.5 transition-all duration-300", trackLineClass)} />
                <div className={cn("absolute inset-x-0 h-[2.5px] bottom-1.5 transition-all duration-300", trackLineClass)} />

                {/* Occupied State Train Graphic */}
                {isOccupied && plat.assigned_train_number && (
                  <div className="absolute left-6 right-6 bg-card border border-border/80 rounded-xl flex items-center justify-between pl-3 pr-4 py-1.5 shadow-md z-10 transition-all duration-300 group-hover:scale-[1.01] hover:border-primary/50">
                    <div className="flex items-center gap-2 min-w-0">
                      {/* Mini train SVG */}
                      <svg className="h-4.5 w-8 text-primary shrink-0" viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M 10 13 L 70 13 C 76 13 82 15 86 19 L 94 24 C 97 26 97 28 93 28 L 88 28 L 10 28 Z" fill="currentColor" fillOpacity="0.1" />
                        <path d="M 76 19 L 85 19 C 88 19 91 21 92 23" strokeWidth="1.8" />
                        <rect x="18" y="16" width="6" height="4" rx="1" strokeWidth="1.5" />
                        <rect x="28" y="16" width="6" height="4" rx="1" strokeWidth="1.5" />
                        <rect x="38" y="16" width="6" height="4" rx="1" strokeWidth="1.5" />
                        <path d="M 76 16 L 80 16 C 81.5 16 82.5 17 82.5 18 L 81.5 20 Z" fill="currentColor" strokeWidth="1.5" />
                        <circle cx="26" cy="30" r="2" fill="currentColor" stroke="none" />
                        <circle cx="36" cy="30" r="2" fill="currentColor" stroke="none" />
                        <circle cx="56" cy="30" r="2" fill="currentColor" stroke="none" />
                        <circle cx="66" cy="30" r="2" fill="currentColor" stroke="none" />
                      </svg>
                      <span className="font-mono text-xs font-bold text-text-primary shrink-0 leading-none">
                        T-{plat.assigned_train_number}
                      </span>
                    </div>
                    <span className="font-mono text-[9px] font-bold text-text-secondary tracking-wider uppercase truncate pl-2">
                      IN TRACK
                    </span>
                  </div>
                )}

                {/* Blocked State Warning */}
                {isBlocked && (
                  <div className="absolute left-6 right-6 bg-danger/10 border border-danger/25 rounded-xl flex items-center justify-center gap-2 py-1.5 z-10">
                    <ShieldAlert className="h-4 w-4 text-danger animate-pulse shrink-0" />
                    <span className="font-mono text-[9px] font-black text-danger uppercase tracking-widest leading-none">
                      TRACK SUSPENDED
                    </span>
                  </div>
                )}

                {/* Vacant Hover Action */}
                {isVacant && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-primary tracking-widest uppercase bg-card border border-primary/20 px-3 py-1.5 rounded-xl shadow-lg transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                      <ArrowRightLeft className="h-3 w-3" />
                      <span>REROUTE NODE</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Footer details */}
              <div className="flex justify-between items-center z-10 text-[9px] text-text-secondary font-mono border-t border-border/30 pt-2">
                <span>SIGNAL: {isBlocked ? 'RED (SUSP)' : isOccupied ? 'RED (AUTO)' : 'GREEN (G)'}</span>
                <span>telemetry ok</span>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}

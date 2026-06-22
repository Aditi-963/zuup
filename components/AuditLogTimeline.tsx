'use client';

import { AuditLog } from '../types';
import { History, CheckCircle, XCircle, Clock, User, Timer } from 'lucide-react';
import { cn } from '../lib/utils';

interface AuditLogTimelineProps {
  logs: AuditLog[];
}

export default function AuditLogTimeline({ logs }: AuditLogTimelineProps) {
  return (
    <div className="bg-card rounded-2xl border border-border/80 p-6 shadow-sm flex flex-col gap-5 max-h-[460px] premium-card-shadow transition-all duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/55 pb-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(255,107,0,0.1)]">
            <History className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-text-primary">
              AI Decision Audit Log
            </h3>
            <p className="text-[10px] text-text-secondary font-mono uppercase tracking-widest mt-0.5">
              Live System Ledger & Action Vault
            </p>
          </div>
        </div>
        <span className="font-mono text-[9px] text-text-secondary uppercase tracking-wider font-bold">NDLS LEDGER</span>
      </div>

      {/* Timeline List */}
      <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4">
        {logs.length > 0 ? (
          logs.map((log) => {
            const isApproved = log.status === 'APPROVED';
            const isRejected = log.status === 'REJECTED';
            const isPending = log.status === 'PENDING';

            return (
              <div
                key={log.id}
                className={cn(
                  "relative pl-6 border-l transition-all duration-300",
                  isApproved ? "border-success/45" :
                  isRejected ? "border-danger/45" : "border-warning/45 border-dashed"
                )}
              >
                {/* Node Dot Indicator */}
                <span className={cn(
                  "absolute -left-[7px] top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border bg-card shadow-sm",
                  isApproved ? "border-success text-success" :
                  isRejected ? "border-danger text-danger" : "border-warning text-warning animate-pulse"
                )}>
                  {isApproved && <CheckCircle className="h-2 w-2 fill-success/10" />}
                  {isRejected && <XCircle className="h-2 w-2 fill-danger/10" />}
                  {isPending && <Clock className="h-2 w-2" />}
                </span>

                {/* Log Details Box */}
                <div className="flex flex-col gap-2 bg-secondary-bg/30 border border-border/75 rounded-xl p-3.5 hover:bg-secondary-bg/50 transition-all duration-200">
                  <div className="flex justify-between items-start gap-3">
                    <span className="text-xs font-bold text-text-primary leading-tight font-sans">
                      {log.event_type}
                    </span>
                    <span className="font-mono text-[9px] text-text-secondary shrink-0 mt-0.5">
                      {log.timestamp}
                    </span>
                  </div>

                  <p className="text-[11px] text-text-secondary leading-relaxed font-sans">
                    {log.description}
                  </p>

                  {/* Recommendations path if present */}
                  {log.recommended_action && (
                    <div className="text-[9.5px] font-mono font-bold bg-card border border-border/80 px-2.5 py-1 rounded-lg w-fit text-text-secondary shadow-2xs">
                      RECOMMENDATION: Train {log.recommended_action.move_train} (PF {log.recommended_action.old_platform} → PF {log.recommended_action.new_platform})
                    </div>
                  )}

                  {/* Metadata Row */}
                  <div className="flex items-center justify-between border-t border-border/30 pt-2 text-[9px] font-mono text-text-secondary">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3 text-text-secondary" />
                      <span className="font-bold">BY: {log.operator_name}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Timer className="h-3 w-3 text-success shrink-0" />
                        <span className="text-success font-black">RECOVERY: {log.recovery_time_saved}</span>
                      </div>
                      
                      <span className={cn(
                        "font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full text-[8px] leading-none shrink-0",
                        isApproved ? "bg-success/10 text-success border border-success/25" :
                        isRejected ? "bg-danger/10 text-danger border border-danger/25" :
                        "bg-warning/10 text-warning border border-warning/25 animate-pulse"
                      )}>
                        {log.status}
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-xs text-text-secondary font-mono italic">
            NO AUDIT LEDGERS LOGGED
          </div>
        )}
      </div>
    </div>
  );
}

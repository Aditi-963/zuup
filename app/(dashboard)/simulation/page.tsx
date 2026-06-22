'use client';

import { useState } from 'react';
import { useOperationsStore } from '../../../store/useOperationsStore';
import { simulationService } from '../../../services/api';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, 
  Activity, 
  Users, 
  Heart, 
  Play, 
  Bot, 
  CheckCircle2, 
  TrendingUp, 
  Clock 
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useRouter } from 'next/navigation';

export default function SimulationPage() {
  const router = useRouter();
  const { 
    setIsProcessing, 
    setActiveRecommendation, 
    setActiveAlert 
  } = useOperationsStore();

  const [activeSimulation, setActiveSimulation] = useState<string | null>(null);
  const [simulationResult, setSimulationResult] = useState<any | null>(null);

  const runSimulation = async (
    simName: string,
    simFn: () => Promise<{ recommendation: any; log_id: number }>,
    alertMessage: string
  ) => {
    setActiveSimulation(simName);
    setIsProcessing(true);
    setSimulationResult(null);

    // Artificial minor delay to show Framer Motion pipeline scanning spinner
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      const { recommendation, log_id } = await simFn();
      
      setSimulationResult({
        ...recommendation,
        log_id,
      });

      // Update global Zustand operations state
      setActiveRecommendation(recommendation, log_id);
      setActiveAlert(alertMessage);

    } catch (e) {
      console.error('Simulation execution error', e);
    } finally {
      setIsProcessing(false);
      setActiveSimulation(null);
    }
  };

  const triggerSingleDelay = () => {
    runSimulation(
      'single_delay',
      () => simulationService.simulateDelay('12123', 47),
      'Deccan Express (12123) delayed 47 minutes. Platform swap recommendation pending.'
    );
  };

  const triggerCascadeDelays = () => {
    runSimulation(
      'cascade_delay',
      () => simulationService.simulateCascade(),
      'Multi-train cascade delays detected. Rerouting Deccan Express from platform 2.'
    );
  };

  const triggerCrowdSurge = () => {
    runSimulation(
      'crowd_surge',
      () => simulationService.simulateCrowd(),
      'Platform 3 passenger congestion exceed 140% capacity. Safe re-routing advised.'
    );
  };

  const triggerMedicalEmergency = () => {
    runSimulation(
      'medical_emergency',
      () => simulationService.simulateEmergency(),
      'Medical emergency on Platform 3. Track suspended. Diverting traffic.'
    );
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold font-sans tracking-wide uppercase">
          Interactive Disruption Simulator
        </h2>
        <p className="text-xs text-text-secondary font-mono tracking-wider mt-0.5">
          TESTBED CONSOLE FOR MULTI-AGENT PIPELINE AND TELEMETRY TRIGGERING
        </p>
      </div>

      {/* Grid of Simulation Trigger Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Sim 1: Train Delay */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-warning">
              <Clock className="h-4.5 w-4.5" />
              <h3 className="font-bold text-sm font-sans uppercase tracking-wider">
                Simulate Train Delay
              </h3>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Triggers a 47-minute delay event on **Deccan Express (12123)**. 
              The AI model detects platform occupancy conflicts and proposes a swap to PF 5.
            </p>
          </div>
          <button
            onClick={triggerSingleDelay}
            disabled={activeSimulation !== null}
            className="flex items-center justify-center gap-2 rounded bg-surface hover:bg-surface/80 border border-border hover:border-warning py-2 text-xs font-bold text-text-primary hover:text-warning transition-all cursor-pointer disabled:opacity-40"
          >
            <Play className="h-3 w-3 fill-current" />
            <span>Trigger Delay Event</span>
          </button>
        </div>

        {/* Sim 2: Multi-Train Cascade */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-danger">
              <Activity className="h-4.5 w-4.5" />
              <h3 className="font-bold text-sm font-sans uppercase tracking-wider">
                Cascading Route Congestion
              </h3>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Simulates a severe delay on Deccan Express (60 mins) which blocks incoming slots for 
              **Rajdhani Express (12952)** and **Shatabdi Express (12043)**.
            </p>
          </div>
          <button
            onClick={triggerCascadeDelays}
            disabled={activeSimulation !== null}
            className="flex items-center justify-center gap-2 rounded bg-surface hover:bg-surface/80 border border-border hover:border-danger py-2 text-xs font-bold text-text-primary hover:text-danger transition-all cursor-pointer disabled:opacity-40"
          >
            <Play className="h-3 w-3 fill-current" />
            <span>Multi-Train Cascade</span>
          </button>
        </div>

        {/* Sim 3: Platform Crowd Surge */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-warning">
              <Users className="h-4.5 w-4.5" />
              <h3 className="font-bold text-sm font-sans uppercase tracking-wider">
                Platform Crowd Emergency
              </h3>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Triggers critical overcrowding status on **Platform 3** due to holiday volumes. 
              The system re-evaluates and swaps subsequent arrivals to safer tracks.
            </p>
          </div>
          <button
            onClick={triggerCrowdSurge}
            disabled={activeSimulation !== null}
            className="flex items-center justify-center gap-2 rounded bg-surface hover:bg-surface/80 border border-border hover:border-warning py-2 text-xs font-bold text-text-primary hover:text-warning transition-all cursor-pointer disabled:opacity-40"
          >
            <Play className="h-3 w-3 fill-current" />
            <span>Crowd Emergency</span>
          </button>
        </div>

        {/* Sim 4: Medical / Track Emergency */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-danger">
              <Heart className="h-4.5 w-4.5" />
              <h3 className="font-bold text-sm font-sans uppercase tracking-wider">
                Medical / Track Blockage
              </h3>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Simulates a medical cardiac emergency on Platform 3. The track is marked **Suspended** 
              and all inbound trains are re-routed dynamically.
            </p>
          </div>
          <button
            onClick={triggerMedicalEmergency}
            disabled={activeSimulation !== null}
            className="flex items-center justify-center gap-2 rounded bg-surface hover:bg-surface/80 border border-border hover:border-danger py-2 text-xs font-bold text-text-primary hover:text-danger transition-all cursor-pointer disabled:opacity-40"
          >
            <Play className="h-3 w-3 fill-current" />
            <span>Emergency Block Track</span>
          </button>
        </div>

      </div>

      {/* Simulation Result Preview */}
      {simulationResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl p-6 shadow-lg flex flex-col gap-4 mt-4 font-mono text-xs"
        >
          <div className="flex items-center gap-2 border-b border-border pb-3 text-success">
            <CheckCircle2 className="h-4.5 w-4.5" />
            <span className="font-bold uppercase tracking-wider">AI Operations Recommendation Prepared</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <div>
                <span className="text-text-secondary">EVENT REGISTERED: </span>
                <span className="text-text-primary uppercase font-bold">{simulationResult.event_type.replace('_', ' ')}</span>
              </div>
              <div>
                <span className="text-text-secondary">PROPOSAL: </span>
                <span className="text-primary font-bold">
                  Move Train {simulationResult.recommended_action.move_train} (PF {simulationResult.recommended_action.old_platform} → PF {simulationResult.recommended_action.new_platform})
                </span>
              </div>
              <div>
                <span className="text-text-secondary">CROWD CONGESTION RISK: </span>
                <span className="text-warning font-bold">{simulationResult.crowd_risk}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 border-t md:border-t-0 md:border-l border-border pt-2 md:pt-0 pl-0 md:pl-4">
              <div>
                <span className="text-text-secondary">RECOVERY EFFICIENCY: </span>
                <span className="text-success font-bold flex items-center gap-1 mt-0.5">
                  <TrendingUp className="h-3.5 w-3.5" /> {simulationResult.estimated_recovery} saved
                </span>
              </div>
              <div>
                <span className="text-text-secondary">AGENT CONFIDENCE: </span>
                <span className="text-primary font-bold">{simulationResult.confidence}</span>
              </div>
              <div>
                <span className="text-text-secondary">AUDIT LOG ID: </span>
                <span className="text-text-primary font-bold">#{simulationResult.log_id}</span>
              </div>
            </div>
          </div>

          <div className="border border-border/80 bg-surface/50 rounded p-3 text-[11px] text-text-primary leading-relaxed font-sans mt-2">
            <div className="font-mono text-[9px] text-text-secondary uppercase tracking-widest mb-1 font-bold">Announcement Script Preview</div>
            {simulationResult.announcement}
          </div>

          <div className="flex gap-3 justify-end mt-2">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-black hover:bg-primary-hover shadow-[0_0_12px_rgba(232,255,63,0.3)] transition-colors cursor-pointer"
            >
              <span>Go to Control Room Dashboard</span>
              <Bot className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.div>
      )}

    </div>
  );
}

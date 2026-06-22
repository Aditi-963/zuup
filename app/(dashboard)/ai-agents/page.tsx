'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, 
  Search, 
  GitMerge, 
  Shuffle, 
  Users, 
  Volume2, 
  CheckCircle, 
  Play, 
  RefreshCw 
} from 'lucide-react';
import { cn } from '../../../lib/utils';

interface AgentNode {
  id: number;
  name: string;
  role: string;
  icon: any;
  description: string;
  telemetry: string;
}

const agentsList: AgentNode[] = [
  {
    id: 1,
    name: 'Delay Detection Agent',
    role: 'Monitors inbound timetables and signals',
    icon: Search,
    description: 'Tracks train coordinates and signaling states in real-time. Identifies deviation triggers that exceed the 5-minute threshold.',
    telemetry: 'MONITORING: 18 SECTORS',
  },
  {
    id: 2,
    name: 'Cascade Analysis Agent',
    role: 'Calculates downstream traffic blockages',
    icon: GitMerge,
    description: 'Models route occupancy schedules and track overlaps to project secondary delays on subsequent arrivals.',
    telemetry: 'COMPUTING: CAS DELAYS',
  },
  {
    id: 3,
    name: 'Platform Optimization Agent',
    role: 'Formulates route/platform swaps',
    icon: Shuffle,
    description: 'Runs combinatorial optimization models comparing physical constraints (train length, rake limits) against platform availability.',
    telemetry: 'SOLVING: COMBINATORICS',
  },
  {
    id: 4,
    name: 'Crowd Risk Agent',
    role: 'Predicts platform density spikes',
    icon: Users,
    description: 'Estimates crowd build-up trends based on train bookings, connection schedules, and platform bottlenecks to avoid surges.',
    telemetry: 'DENSITY: 8 PLATFORMS',
  },
  {
    id: 5,
    name: 'Communication Agent',
    role: 'Generates multilingual broadside alerts',
    icon: Volume2,
    description: 'Composes public announcement text scripts in English, Hindi, and Marathi. Dispatches staff instructions to station handheld terminals.',
    telemetry: 'COMMS: AUDIO / PUSH',
  },
];

export default function AiAgentsPage() {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [pipelineRunning, setPipelineRunning] = useState(false);

  // Sequentially animate the agents workflow pipeline
  const runPipelineDemo = async () => {
    if (pipelineRunning) return;
    setPipelineRunning(true);

    for (let i = 1; i <= 6; i++) {
      setActiveStep(i);
      await new Promise((resolve) => setTimeout(resolve, 1200));
    }

    setPipelineRunning(false);
    setActiveStep(null);
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold font-sans tracking-wide uppercase">
            Autonomous AI Agent Pipeline
          </h2>
          <p className="text-xs text-text-secondary font-mono tracking-wider mt-0.5">
            MULTI-AGENT ORCHESTRATION PIPELINE FOR PROACTIVE RAILWAY INTELLIGENCE
          </p>
        </div>

        <button
          onClick={runPipelineDemo}
          disabled={pipelineRunning}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-bold text-black hover:bg-primary-hover shadow-[0_0_15px_rgba(232,255,63,0.3)] transition-all cursor-pointer disabled:opacity-40"
        >
          {pipelineRunning ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Simulating Pipeline...</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4 fill-current" />
              <span>Test Pipeline Dataflow</span>
            </>
          )}
        </button>
      </div>

      {/* Main Orchestration Node flow Diagram */}
      <div className="bg-card rounded-xl border border-border p-8 shadow-sm flex flex-col gap-8 items-center justify-center min-h-[400px] overflow-x-auto">
        
        <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-4 relative">
          
          {/* Animated Connecting path SVG (shows when pipeline is active) */}
          <div className="absolute top-[38px] left-[5%] right-[5%] h-0.5 border-t border-dashed border-border z-0 hidden lg:block" />

          {agentsList.map((agent, index) => {
            const Icon = agent.icon;
            const isCurrent = activeStep === agent.id;
            const isPast = activeStep !== null && activeStep > agent.id;

            return (
              <div key={agent.id} className="flex flex-col items-center relative z-10 w-full lg:w-44">
                
                {/* Visual Node */}
                <motion.div
                  animate={{
                    borderColor: isCurrent ? 'var(--primary)' : 'var(--border)',
                    boxShadow: isCurrent ? '0 0 20px rgba(232,255,63,0.25)' : 'none',
                    scale: isCurrent ? 1.05 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "flex h-16 w-16 items-center justify-center rounded-2xl border bg-card text-text-primary transition-all duration-300 relative",
                    isPast && "border-success bg-success/5 text-success"
                  )}
                >
                  <Icon className={cn("h-6 w-6 text-text-secondary", isCurrent && "text-primary animate-pulse", isPast && "text-success")} />
                  
                  {/* Step ID badge */}
                  <span className={cn(
                    "absolute -top-2.5 -right-2.5 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-surface font-mono text-[10px] font-bold",
                    isCurrent && "border-primary bg-primary text-black",
                    isPast && "border-success bg-success text-white"
                  )}>
                    {agent.id}
                  </span>
                </motion.div>

                {/* Node Label */}
                <div className="mt-3 text-center">
                  <h4 className={cn("text-xs font-bold font-sans", isCurrent && "text-primary glow-primary", isPast && "text-success")}>
                    {agent.name}
                  </h4>
                  <span className="text-[9px] text-text-secondary font-mono tracking-widest block uppercase mt-0.5">
                    {agent.telemetry}
                  </span>
                </div>

                {/* Inter-node connector arrow for mobile column layouts */}
                {index < agentsList.length - 1 && (
                  <div className="h-6 w-[1px] border-l border-dashed border-border my-3 block lg:hidden" />
                )}
              </div>
            );
          })}

          {/* Final Human Approval Node */}
          <div className="flex flex-col items-center relative z-10 w-full lg:w-44">
            <motion.div
              animate={{
                borderColor: activeStep === 6 ? 'var(--primary)' : 'var(--border)',
                boxShadow: activeStep === 6 ? '0 0 20px rgba(232,255,63,0.25)' : 'none',
                scale: activeStep === 6 ? 1.05 : 1,
              }}
              className={cn(
                "flex h-16 w-16 items-center justify-center rounded-2xl border border-dashed bg-card text-text-primary transition-all duration-300",
                activeStep === 6 && "border-success text-success bg-success/5"
              )}
            >
              <CheckCircle className={cn("h-6 w-6 text-text-secondary", activeStep === 6 && "text-success animate-bounce")} />
              <span className={cn(
                "absolute -top-2.5 -right-2.5 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-surface font-mono text-[10px] font-bold",
                activeStep === 6 && "border-success bg-success text-white"
              )}>
                6
              </span>
            </motion.div>
            <div className="mt-3 text-center">
              <h4 className={cn("text-xs font-bold font-sans", activeStep === 6 && "text-success glow-success")}>
                Station Master Approval
              </h4>
              <span className="text-[9px] text-text-secondary font-mono tracking-widest block uppercase mt-0.5">
                ROLE: DECISION GATE
              </span>
            </div>
          </div>

        </div>

        {/* Informational Pipeline Description Box */}
        {activeStep && activeStep <= 5 && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl bg-surface border border-border rounded-lg p-5 font-sans"
          >
            <div className="flex items-center gap-2 border-b border-border pb-2 mb-2">
              <Bot className="h-4.5 w-4.5 text-primary" />
              <span className="font-bold text-xs uppercase text-text-primary">
                Active Agent: {agentsList[activeStep - 1].name}
              </span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              {agentsList[activeStep - 1].description}
            </p>
          </motion.div>
        )}

        {activeStep === 6 && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl bg-success/5 border border-success/30 rounded-lg p-5 font-sans"
          >
            <div className="flex items-center gap-2 border-b border-success/20 pb-2 mb-2">
              <CheckCircle className="h-4.5 w-4.5 text-success" />
              <span className="font-bold text-xs uppercase text-success">
                Active Step: Human-in-the-Loop Approval
              </span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              The AI Co-pilot presents the optimized routing recommendation to the Station Master. 
              The system waits for manual confirmation before applying switches on active physical rail tracks.
            </p>
          </motion.div>
        )}

      </div>

      {/* Agents Directory */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {agentsList.map((agent) => {
          const Icon = agent.icon;
          return (
            <div key={agent.id} className="bg-card rounded-xl border border-border p-6 shadow-sm flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 bg-surface border border-border rounded-lg flex items-center justify-center text-text-secondary">
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold font-sans text-text-primary">{agent.name}</span>
                  <span className="text-[8px] text-text-secondary font-mono uppercase tracking-widest">{agent.telemetry}</span>
                </div>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed font-sans">
                {agent.description}
              </p>
            </div>
          );
        })}
      </div>

    </div>
  );
}

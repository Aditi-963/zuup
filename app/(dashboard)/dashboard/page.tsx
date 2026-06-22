'use client';

import { useQuery } from '@tanstack/react-query';
import { trainService, platformService, auditLogService } from '../../../services/api';
import PlatformVisualizer from '../../../components/PlatformVisualizer';
import TrainTable from '../../../components/TrainTable';
import DecisionEngine from '../../../components/DecisionEngine';
import AnnouncementGenerator from '../../../components/AnnouncementGenerator';
import AuditLogTimeline from '../../../components/AuditLogTimeline';
import { 
  Heart, 
  Activity, 
  AlertTriangle, 
  ShieldAlert, 
  Users, 
  Clock 
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [liveTime, setLiveTime] = useState('');

  // 1. Fetch live train status
  const { data: trains = [], refetch: refetchTrains } = useQuery({
    queryKey: ['trains'],
    queryFn: trainService.getTrains,
    refetchInterval: 3000, // Poll every 3 seconds for mock/live updates
  });

  // 2. Fetch platform occupancy status
  const { data: platforms = [], refetch: refetchPlatforms } = useQuery({
    queryKey: ['platforms'],
    queryFn: platformService.getPlatforms,
    refetchInterval: 3000,
  });

  // 3. Fetch audit log history
  const { data: logs = [], refetch: refetchLogs } = useQuery({
    queryKey: ['auditLogs'],
    queryFn: auditLogService.getLogs,
    refetchInterval: 3000,
  });

  // Reload all datasets when an operator approves/rejects an recommendation
  const refreshAllData = () => {
    refetchTrains();
    refetchPlatforms();
    refetchLogs();
  };

  useEffect(() => {
    const updateLiveTime = () => {
      const d = new Date();
      d.setFullYear(2026);
      setLiveTime(d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateLiveTime();
    const interval = setInterval(updateLiveTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Compute metrics from fetched data
  const totalActiveTrains = trains.length;
  const delayedTrains = trains.filter(t => t.delay_minutes > 0).length;
  const activeAlerts = logs.filter(l => l.status === 'PENDING').length;
  const crowdWarnings = platforms.filter(p => p.crowd_status === 'HIGH').length;

  return (
    <div className="flex flex-col gap-6">
      
      {/* Top Welcome Title & Status */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold font-sans tracking-wide uppercase text-text-primary">
            New Delhi (NDLS) Operations Command
          </h2>
          <p className="text-2xs text-text-secondary font-mono tracking-widest uppercase mt-1">
            SECTOR-4 HIGH DENSITY JUNCTION TELEMETRY CONSOLE
          </p>
        </div>

        <div className="flex items-center gap-2 border border-border/80 bg-card px-4 py-2.5 rounded-xl font-mono text-xs shadow-sm">
          <Clock className="h-4 w-4 text-primary animate-pulse" />
          <span className="text-text-secondary font-bold">CLOCK SYNC:</span>
          <span className="font-extrabold text-text-primary">{liveTime}</span>
        </div>
      </div>

      {/* Operations Overview Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* System Health */}
        <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-sm flex items-center gap-4 premium-card-shadow premium-card-hover">
          <div className="h-10 w-10 rounded-xl bg-success/10 border border-success/20 flex items-center justify-center text-success shrink-0">
            <Heart className="h-5 w-5 animate-pulse" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[10px] text-text-secondary font-mono uppercase tracking-widest font-bold">System Health</span>
            <span className="text-sm font-extrabold font-sans text-success glow-success mt-2">99.8% OK</span>
          </div>
        </div>

        {/* Total Active Trains */}
        <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-sm flex items-center gap-4 premium-card-shadow premium-card-hover">
          <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <Activity className="h-5 w-5" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[10px] text-text-secondary font-mono uppercase tracking-widest font-bold">Active Trains</span>
            <span className="text-sm font-extrabold font-sans text-text-primary mt-2">{totalActiveTrains} / Unit</span>
          </div>
        </div>

        {/* Delayed Trains */}
        <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-sm flex items-center gap-4 premium-card-shadow premium-card-hover">
          <div className="h-10 w-10 rounded-xl bg-warning/10 border border-warning/20 flex items-center justify-center text-warning shrink-0">
            <AlertTriangle className="h-5 w-5 animate-bounce" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[10px] text-text-secondary font-mono uppercase tracking-widest font-bold">Delayed Trains</span>
            <span className="text-sm font-extrabold font-sans text-warning glow-warning mt-2">{delayedTrains} Trains</span>
          </div>
        </div>

        {/* Active Alerts */}
        <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-sm flex items-center gap-4 premium-card-shadow premium-card-hover">
          <div className="h-10 w-10 rounded-xl bg-danger/10 border border-danger/20 flex items-center justify-center text-danger shrink-0">
            <ShieldAlert className="h-5 w-5 animate-pulse" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[10px] text-text-secondary font-mono uppercase tracking-widest font-bold">Active Alerts</span>
            <span className="text-sm font-extrabold font-sans text-danger glow-danger mt-2">{activeAlerts} Alerts</span>
          </div>
        </div>

        {/* Crowd Warnings */}
        <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-sm flex items-center gap-4 col-span-2 lg:col-span-1 premium-card-shadow premium-card-hover">
          <div className="h-10 w-10 rounded-xl bg-warning/10 border border-warning/20 flex items-center justify-center text-warning shrink-0">
            <Users className="h-5 w-5" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[10px] text-text-secondary font-mono uppercase tracking-widest font-bold">Crowd Risks</span>
            <span className="text-sm font-extrabold font-sans text-warning mt-2">{crowdWarnings} Warns</span>
          </div>
        </div>

      </div>

      {/* Main Grid Layout split (Left: Telemetry, Right: AI Engine) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Telemetry Platforms & Train Grid */}
        <div className="xl:col-span-7 flex flex-col gap-6">
          <PlatformVisualizer platforms={platforms} />
          <TrainTable trains={trains} />
        </div>

        {/* Right Side: Decision Engine, Announcement, and Logs */}
        <div className="xl:col-span-5 flex flex-col gap-6">
          <DecisionEngine onActionComplete={refreshAllData} />
          <AnnouncementGenerator />
          <AuditLogTimeline logs={logs} />
        </div>

      </div>

    </div>
  );
}

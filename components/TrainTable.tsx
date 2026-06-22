'use client';

import { useState } from 'react';
import { Train } from '../types';
import { Search, Train as TrainIcon, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { cn } from '../lib/utils';

interface TrainTableProps {
  trains: Train[];
}

export default function TrainTable({ trains }: TrainTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ON_TIME' | 'WARNING' | 'DELAYED'>('ALL');

  const filteredTrains = trains.filter((train) => {
    const matchesSearch =
      train.train_number.includes(searchTerm) ||
      train.train_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || train.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-card rounded-2xl border border-border/80 p-6 shadow-sm flex flex-col gap-6 premium-card-shadow transition-all duration-300">
      
      {/* Header and Controls */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 border-b border-border/55 pb-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(255,107,0,0.1)]">
            <TrainIcon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-text-primary">
              Live Train Monitoring Network
            </h3>
            <p className="text-[10px] text-text-secondary font-mono uppercase tracking-widest mt-0.5">
              Sector Telemetry & Signal Registers
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
          {/* Search bar */}
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              placeholder="Search train or route ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-border/80 bg-background/50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-text-primary font-sans transition-all duration-200"
            />
          </div>

          {/* Filter Pill Tabs */}
          <div className="flex w-full sm:w-auto rounded-xl border border-border/80 bg-background/50 p-1 text-2xs">
            {(['ALL', 'ON_TIME', 'WARNING', 'DELAYED'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={cn(
                  "flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg font-bold tracking-wide uppercase transition-all duration-200 cursor-pointer",
                  statusFilter === filter
                    ? "bg-card text-primary shadow-sm"
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                {filter === 'ALL' ? 'ALL UNITS' : filter.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* High Density Table */}
      <div className="overflow-x-auto w-full">
        <table className="w-full border-collapse text-left text-xs font-sans">
          <thead>
            <tr className="border-b border-border/60 text-text-secondary uppercase tracking-wider font-mono text-[9px] font-bold">
              <th className="pb-3 px-4 font-black">Train No.</th>
              <th className="pb-3 px-4 font-black">Train Name</th>
              <th className="pb-3 px-4 text-center font-black">Assigned Platform</th>
              <th className="pb-3 px-4 font-black">Scheduled Arrival</th>
              <th className="pb-3 px-4 font-black">Delay minutes</th>
              <th className="pb-3 px-4 font-black">Status Register</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {filteredTrains.length > 0 ? (
              filteredTrains.map((train) => {
                const isOnTime = train.status === 'ON_TIME';
                const isWarning = train.status === 'WARNING';
                const isDelayed = train.status === 'DELAYED';

                return (
                  <tr
                    key={train.train_number}
                    className="hover:bg-hover-surface/30 transition-all duration-200 group"
                  >
                    <td className="py-4.5 px-4 font-mono font-bold tracking-wider text-text-primary text-[11px]">
                      {train.train_number}
                    </td>
                    <td className="py-4.5 px-4 font-semibold text-text-primary group-hover:text-primary transition-colors text-[11.5px]">
                      {train.train_name}
                    </td>
                    <td className="py-4.5 px-4 text-center">
                      {train.platform ? (
                        <span className="font-mono text-2xs font-extrabold bg-secondary-bg border border-border/85 px-3 py-1 rounded-lg text-text-primary">
                          PF {train.platform}
                        </span>
                      ) : (
                        <span className="text-text-secondary font-mono text-3xs font-black italic tracking-widest uppercase bg-danger/10 text-danger border border-danger/20 px-2 py-0.5 rounded-md">UNASSIGNED</span>
                      )}
                    </td>
                    <td className="py-4.5 px-4 font-mono text-text-secondary text-[11px]">
                      {train.scheduled_time}
                    </td>
                    <td className={cn(
                      "py-4.5 px-4 font-mono font-extrabold text-[11px]",
                      train.delay_minutes > 0 ? (isDelayed ? "text-danger" : "text-warning") : "text-success"
                    )}>
                      {train.delay_minutes > 0 ? `+${train.delay_minutes} min` : '0 min'}
                    </td>
                    <td className="py-4.5 px-4">
                      <div className="flex items-center gap-1.5">
                        {isOnTime && (
                          <span className="flex items-center gap-1 text-[9px] uppercase font-extrabold tracking-wider text-success bg-success/10 border border-success/25 px-2.5 py-0.5 rounded-full">
                            <CheckCircle className="h-3 w-3 shrink-0" /> ON TIME
                          </span>
                        )}
                        {isWarning && (
                          <span className="flex items-center gap-1 text-[9px] uppercase font-extrabold tracking-wider text-warning bg-warning/10 border border-warning/25 px-2.5 py-0.5 rounded-full animate-pulse">
                            <AlertTriangle className="h-3 w-3 shrink-0" /> WARNING
                          </span>
                        )}
                        {isDelayed && (
                          <span className="flex items-center gap-1 text-[9px] uppercase font-extrabold tracking-wider text-danger bg-danger/10 border border-danger/25 px-2.5 py-0.5 rounded-full animate-pulse">
                            <AlertTriangle className="h-3 w-3 shrink-0 animate-bounce" /> DELAYED
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-10 text-center text-text-secondary font-mono">
                  <Info className="h-6 w-6 mx-auto text-text-secondary/30 mb-2" />
                  <span className="text-2xs font-extrabold uppercase tracking-widest">No matching trains logged in sector</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

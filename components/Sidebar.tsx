'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../lib/utils';
import { 
  LayoutDashboard, 
  Activity, 
  Bot, 
  MessageSquareWarning, 
  Settings,
  LogOut
} from 'lucide-react';
import Logo from './Logo';
import { useOperationsStore } from '../store/useOperationsStore';

const navItems = [
  { name: 'Control Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Interactive Simulator', href: '/simulation', icon: Activity },
  { name: 'AI Agents Panel', href: '/ai-agents', icon: Bot },
  { name: 'Emergency Copilot', href: '/emergency-chat', icon: MessageSquareWarning },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout, currentUser } = useOperationsStore();

  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r border-border bg-card text-text-primary transition-all duration-300">
      {/* Brand Header */}
      <div className="flex h-20 items-center px-6 border-b border-border/60">
        <Logo size="md" showText={true} />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 px-4 py-8 font-sans">
        <div className="text-[10px] font-mono text-text-secondary uppercase tracking-widest px-3 mb-3 font-semibold">
          Terminal Console
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3.5 rounded-xl px-4 py-3.5 text-xs font-semibold tracking-wide transition-all duration-300 relative overflow-hidden",
                isActive
                  ? "bg-secondary-bg text-primary"
                  : "text-text-secondary hover:bg-hover-surface hover:text-text-primary"
              )}
            >
              {/* Active left bar */}
              {isActive && (
                <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-primary shadow-[0_0_8px_var(--primary)]" />
              )}
              
              <Icon className={cn(
                "h-4.5 w-4.5 transition-transform duration-300 group-hover:scale-110",
                isActive ? "text-primary" : "text-text-secondary group-hover:text-text-primary"
              )} />
              <span>{item.name}</span>
              
              {isActive && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary pulse-indicator" />
              )}
            </Link>
          );
        })}

        <div className="h-px bg-border/50 my-6" />

        <div className="text-[10px] font-mono text-text-secondary uppercase tracking-widest px-3 mb-3 font-semibold">
          System Control
        </div>
        
        <Link
          href="/dashboard"
          className="group flex items-center gap-3.5 rounded-xl px-4 py-3.5 text-xs font-semibold tracking-wide text-text-secondary hover:bg-hover-surface hover:text-text-primary transition-all duration-300"
        >
          <Settings className="h-4.5 w-4.5 text-text-secondary group-hover:text-text-primary transition-transform duration-300 group-hover:rotate-45" />
          <span>Console Panel Config</span>
        </Link>
      </nav>

      {/* Profile / Footer card */}
      <div className="border-t border-border/60 p-4 bg-secondary-bg/30">
        <div className="flex items-center gap-3 px-2 py-2 mb-3">
          <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-xs uppercase shadow-[0_0_15px_rgba(255,107,0,0.1)]">
            {currentUser?.full_name?.substring(0, 2) || 'OP'}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-text-primary truncate font-sans">
              {currentUser?.full_name || 'Control Operator'}
            </span>
            <span className="text-[9px] font-mono text-text-secondary truncate mt-0.5 uppercase tracking-wider font-semibold">
              {currentUser?.role?.replace('_', ' ') || 'CONTROL OPERATOR'}
            </span>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-border bg-card hover:bg-hover-surface py-2.5 text-xs font-bold text-text-primary transition-all duration-200 cursor-pointer shadow-sm hover:border-primary/30"
        >
          <LogOut className="h-3.5 w-3.5 text-text-secondary" />
          <span>Exit Session</span>
        </button>
      </div>
    </aside>
  );
}

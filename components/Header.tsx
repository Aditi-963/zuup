'use client';

import { useEffect, useState } from 'react';
import { useOperationsStore } from '../store/useOperationsStore';
import { useRouter } from 'next/navigation';
import { 
  Sun, 
  Moon, 
  ShieldAlert, 
  Wifi, 
  User, 
  Bell, 
  LogOut, 
  UserCheck, 
  Building,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function Header() {
  const router = useRouter();
  const { 
    theme, 
    toggleTheme, 
    activeAlert, 
    setActiveAlert,
    currentUser,
    logout,
    notifications,
    markNotificationsAsRead,
    clearNotifications
  } = useOperationsStore();

  const [timeString, setTimeString] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Live Digital Ticking Clock
  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      date.setFullYear(2026);
      
      const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      setTimeString(date.toLocaleString('en-IN', options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full flex-col justify-center border-b border-border/60 bg-card/65 backdrop-blur-xl px-8 text-text-primary transition-all duration-300">
      <div className="flex items-center justify-between">
        
        {/* Left: System Status and Live Clock */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 border border-border/50 bg-secondary-bg/50 px-3 py-1.5 rounded-full">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
            </span>
            <span className="text-[10px] font-bold tracking-wider text-success font-sans uppercase">
              Telemetry Link: Active
            </span>
          </div>

          <div className="h-4 w-[1px] bg-border/80" />

          {/* Clock */}
          <div className="font-mono text-xs tracking-wider text-text-secondary">
            {timeString}
          </div>
        </div>

        {/* Right: Controls, Theme Toggle, Notifications, Profile */}
        <div className="flex items-center gap-3 relative">
          
          {/* Connection Quality */}
          <div className="hidden md:flex items-center gap-1.5 text-[10px] font-mono font-semibold text-text-secondary bg-secondary-bg/50 px-3 py-2 rounded-xl border border-border/50">
            <Wifi className="h-3.5 w-3.5 text-success" />
            <span>LATENCY: 14ms</span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/80 hover:bg-hover-surface transition-all duration-200 cursor-pointer text-text-secondary hover:text-text-primary"
          >
            {theme === 'dark' ? (
              <Sun className="h-4.5 w-4.5 text-primary" />
            ) : (
              <Moon className="h-4.5 w-4.5" />
            )}
          </button>

          {/* Notification Tray Toggle */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/80 hover:bg-hover-surface transition-all duration-200 cursor-pointer relative text-text-secondary hover:text-text-primary"
            >
              <Bell className="h-4.5 w-4.5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary glow-primary animate-pulse" />
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-card border border-border/80 rounded-2xl shadow-xl z-50 p-4 flex flex-col gap-3 premium-card-shadow">
                <div className="flex justify-between items-center border-b border-border/60 pb-2">
                  <span className="font-sans font-bold text-xs uppercase tracking-wider">Alert Center</span>
                  <div className="flex gap-2.5">
                    <button
                      onClick={() => markNotificationsAsRead()}
                      className="text-[9px] font-mono text-primary uppercase font-bold hover:underline cursor-pointer"
                    >
                      Read All
                    </button>
                    <button
                      onClick={() => clearNotifications()}
                      className="text-[9px] font-mono text-text-secondary uppercase font-bold hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="max-h-64 overflow-y-auto flex flex-col gap-2.5 pr-0.5">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={cn(
                          "p-3 border rounded-xl flex flex-col gap-1 text-[11px] leading-relaxed transition-all duration-200",
                          n.read 
                            ? "bg-secondary-bg/30 border-border/50" 
                            : "bg-primary/5 border-primary/20 hover:border-primary/30"
                        )}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <span className={cn(
                            "font-bold font-sans",
                            n.type === 'danger' ? "text-danger" : n.type === 'warning' ? "text-warning" : "text-text-primary"
                          )}>
                            {n.title}
                          </span>
                          <span className="text-[9px] text-text-secondary font-mono shrink-0">{n.timestamp}</span>
                        </div>
                        <p className="text-text-secondary font-sans text-[10.5px] mt-0.5">{n.message}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-xs font-mono text-text-secondary italic">
                      No notifications logged
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-3 pl-3 border-l border-border/60 cursor-pointer hover:opacity-85 select-none"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary font-bold text-xs uppercase shadow-[0_0_10px_rgba(255,107,0,0.1)]">
                {currentUser?.full_name?.substring(0, 2) || 'OP'}
              </div>
              <div className="hidden lg:flex flex-col items-start leading-none">
                <span className="text-xs font-bold font-sans">
                  {currentUser?.full_name || 'SM R. K. Sharma'}
                </span>
                <span className="text-[9px] text-text-secondary font-mono uppercase tracking-wider font-semibold mt-0.5">
                  {currentUser?.role.replace('_', ' ') || 'NDLS OPERATOR'}
                </span>
              </div>
            </button>

            {/* Profile Dropdown panel */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-3 w-60 bg-card border border-border/80 rounded-2xl shadow-xl z-50 p-4 flex flex-col gap-4 font-sans text-xs premium-card-shadow">
                
                {/* Details */}
                <div className="flex flex-col gap-1.5 border-b border-border/60 pb-3">
                  <div className="flex items-center gap-1.5 text-text-secondary">
                    <UserCheck className="h-3.5 w-3.5" />
                    <span className="font-mono text-[9px] uppercase tracking-wider font-bold">OPERATOR TYPE</span>
                  </div>
                  <span className="font-bold text-text-primary font-sans text-xs">
                    {currentUser?.role.replace('_', ' ') || 'CONTROL OPERATOR'}
                  </span>
                </div>

                <div className="flex flex-col gap-1.5 border-b border-border/60 pb-3">
                  <div className="flex items-center gap-1.5 text-text-secondary">
                    <Building className="h-3.5 w-3.5" />
                    <span className="font-mono text-[9px] uppercase tracking-wider font-bold">ORGANIZATION</span>
                  </div>
                  <span className="text-text-secondary truncate font-sans text-xs">
                    {currentUser?.organization || 'Northern Railway HQ'}
                  </span>
                </div>

                {/* Actions */}
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 rounded-xl bg-danger/10 hover:bg-danger/15 border border-danger/20 py-2.5 text-xs font-bold text-danger transition-colors cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Logout Session</span>
                </button>

              </div>
            )}
          </div>

        </div>
      </div>

      {/* Dynamic Banner Alert for active disruptions */}
      {activeAlert && (
        <div className="absolute top-20 left-0 right-0 flex items-center justify-between bg-danger text-white px-8 py-3 font-sans text-xs border-b border-danger/20 z-20 animate-fade-in shadow-lg">
          <div className="flex items-center gap-3">
            <ShieldAlert className="h-4.5 w-4.5 animate-bounce shrink-0" />
            <span className="font-mono uppercase font-bold tracking-wider">Disruption Telemetry Triggered:</span>
            <span>{activeAlert}</span>
          </div>
          <button 
            onClick={() => setActiveAlert(null)}
            className="flex items-center justify-center h-6 w-6 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </header>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { useOperationsStore } from '../store/useOperationsStore';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Clock, 
  ShieldAlert, 
  RefreshCw, 
  Bot, 
  Volume2, 
  FileLock2, 
  Sparkles,
  Milestone,
  Tv,
  Cpu,
  Radio,
  Workflow,
  Search,
  GitMerge,
  Shuffle,
  Users,
  ChevronRight,
  TrendingUp,
  Sliders
} from 'lucide-react';
import Link from 'next/link';
import Logo from '../components/Logo';

export default function LandingPage() {
  const router = useRouter();
  const { token, theme, toggleTheme } = useOperationsStore();

  const handleLaunch = () => {
    if (token) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  // Stagger Container animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary overflow-x-hidden selection:bg-primary selection:text-white relative">
      
      {/* Background Graphic Grid */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(255,107,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,107,0,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] animated-grid-bg opacity-75 pointer-events-none" />

      {/* Radial Gradient overlay */}
      <div className="absolute top-0 left-0 right-0 h-[700px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(255,107,0,0.06),transparent_100%)] z-0 pointer-events-none" />

      {/* Top Navbar */}
      <header className="relative z-10 flex h-20 items-center justify-between px-6 md:px-16 border-b border-border/60 bg-card/60 backdrop-blur-xl">
        <Logo size="md" showText={true} />

        <div className="flex items-center gap-4">
          <button
            onClick={handleLaunch}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-hover px-5 py-2.5 text-xs font-bold text-white shadow-[0_0_20px_rgba(255,107,0,0.2)] hover:shadow-[0_0_30px_rgba(255,107,0,0.4)] transition-all duration-300 cursor-pointer hover:scale-[1.02] active:scale-98"
          >
            <span>{token ? 'Launch Console' : 'Staff Login'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center px-6 md:px-16 pt-16 pb-24 max-w-7xl mx-auto">
        
        {/* Left Side: CTAs & Text */}
        <div className="lg:col-span-6 flex flex-col items-start text-left gap-6">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary-bg border border-border/80 text-[10px] font-mono text-text-secondary tracking-wider font-semibold"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
            <span>INDIAN RAILWAYS INTEL-GRID CONSOLE</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl xl:text-6xl font-black tracking-tight leading-[1.1] font-sans"
          >
            Autonomous Railway <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary-accent to-primary-hover">
              Intelligence System
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-sm md:text-base text-text-secondary font-sans max-w-xl leading-relaxed"
          >
            Indian Railways operational co-pilot for high-density corridors. 
            RailSaarthi autonomously detects signal delays, forecasts cascade disruptions, 
            reallocates platform tracks, and generates public announcements in under 90 seconds.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-auto"
          >
            <button
              onClick={handleLaunch}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-hover px-7 py-4 text-xs font-bold text-white shadow-[0_0_20px_rgba(255,107,0,0.25)] hover:shadow-[0_0_30px_rgba(255,107,0,0.45)] transition-all duration-300 cursor-pointer hover:scale-[1.02] active:scale-98"
            >
              <span>Launch Platform Control</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('stats');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-7 py-4 text-xs font-bold text-text-primary hover:bg-hover-surface transition-all duration-200 cursor-pointer hover:border-primary/30"
            >
              Explore Telemetry
            </button>
          </motion.div>
        </div>

        {/* Right Side: Luxury Simulated Dashboard Visual */}
        <div className="lg:col-span-6 w-full flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-xl bg-card border border-border/80 rounded-2xl p-5 shadow-2xl relative overflow-hidden premium-card-shadow"
          >
            {/* Header controls mockup */}
            <div className="flex justify-between items-center border-b border-border/60 pb-3 mb-4">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-danger/50" />
                <span className="w-2.5 h-2.5 rounded-full bg-warning/50" />
                <span className="w-2.5 h-2.5 rounded-full bg-success/50" />
              </div>
              <span className="font-mono text-[9px] text-primary glow-primary font-bold animate-pulse uppercase tracking-wider">
                NDLS TERMINAL ACTIVE
              </span>
            </div>

            {/* Simulated Live Visual Tracks */}
            <div className="flex flex-col gap-3 font-sans text-xs">
              <div className="bg-secondary-bg/35 border border-border/70 rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden">
                <div className="flex justify-between font-mono text-[9px] text-text-secondary uppercase">
                  <span>Track Signal: PF 3</span>
                  <span className="text-success font-bold">Clear</span>
                </div>
                {/* Rails Track */}
                <div className="w-full h-10 bg-card rounded-lg border border-border relative overflow-hidden flex items-center px-4">
                  <div className="absolute inset-x-0 h-0.5 bg-border/80" />
                  <div className="absolute inset-x-0 h-2 bg-[repeating-linear-gradient(90deg,var(--border),var(--border)_4px,transparent_4px,transparent_16px)] opacity-35" />
                  
                  {/* Shinkansen representation */}
                  <div className="absolute h-6 px-3.5 rounded bg-primary/10 border border-primary/20 flex items-center justify-between gap-4 train-move-line shadow-sm">
                    <span className="font-mono text-[9px] font-bold text-primary">T-12952 RAJDHANI EXP</span>
                    <span className="text-[9px] font-mono text-success font-bold shrink-0">ETA 14:45</span>
                  </div>
                </div>
              </div>

              {/* Simulated Stats Widget Row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-secondary-bg/35 border border-border/70 rounded-xl p-3.5 flex flex-col justify-between">
                  <span className="font-mono text-[9px] text-text-secondary uppercase">Grid Occupancy</span>
                  <span className="text-base font-bold text-text-primary mt-1">7 / 8 Platforms</span>
                </div>
                <div className="bg-secondary-bg/35 border border-border/70 rounded-xl p-3.5 flex flex-col justify-between">
                  <span className="font-mono text-[9px] text-text-secondary uppercase">AI Decision Core</span>
                  <div className="flex items-center gap-1.5 text-success mt-1">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-xs font-bold font-mono">94% CONF</span>
                  </div>
                </div>
              </div>

              {/* Simulated Notification Alert */}
              <div className="bg-danger/5 border border-danger/20 rounded-xl p-3.5 flex gap-2.5 items-start">
                <ShieldAlert className="h-4.5 w-4.5 text-danger shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="font-mono text-[9px] text-danger uppercase font-bold tracking-wider">Disruption Auto-Routing Proposal</span>
                  <p className="text-[10px] text-text-secondary leading-normal">
                    Train 12123 (Deccan Express) delayed by 60 mins. Proposed routing shift: PF 2 → PF 5 to prevent downstream clash.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 1: Problem Statistics */}
      <section id="stats" className="relative z-10 border-t border-b border-border/60 bg-secondary-bg/30 py-24 px-6">
        <div className="max-w-6xl mx-auto flex flex-col gap-14">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold font-sans tracking-tight">Scale of Grid Operations</h2>
            <p className="text-text-secondary text-xs font-sans mt-2 uppercase tracking-wider font-semibold">
              Leveraging decentralized agents for ultra-fast railway scheduling
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {/* Stat 1 */}
            <motion.div variants={itemVariants} className="flex flex-col items-center text-center p-8 bg-card rounded-2xl border border-border/80 shadow-sm premium-card-shadow hover:scale-[1.01] transition-transform duration-300">
              <div className="text-3xl md:text-4xl font-extrabold font-mono text-primary mb-1">23M+</div>
              <h3 className="font-sans font-bold text-xs text-text-primary mb-1">Daily Commuters</h3>
              <p className="text-[10px] text-text-secondary leading-relaxed max-w-[170px] mt-1">
                Optimizing platforms to prevent choke-points and route safely.
              </p>
            </motion.div>

            {/* Stat 2 */}
            <motion.div variants={itemVariants} className="flex flex-col items-center text-center p-8 bg-card rounded-2xl border border-border/80 shadow-sm premium-card-shadow hover:scale-[1.01] transition-transform duration-300">
              <div className="text-3xl md:text-4xl font-extrabold font-mono text-primary mb-1">8,700+</div>
              <h3 className="font-sans font-bold text-xs text-text-primary mb-1">Stations Linked</h3>
              <p className="text-[10px] text-text-secondary leading-relaxed max-w-[170px] mt-1">
                Scalable cloud agent structures serving multiple divisions.
              </p>
            </motion.div>

            {/* Stat 3 */}
            <motion.div variants={itemVariants} className="flex flex-col items-center text-center p-8 bg-card rounded-2xl border border-border/80 shadow-sm premium-card-shadow hover:scale-[1.01] transition-transform duration-300">
              <div className="text-3xl md:text-4xl font-extrabold font-mono text-warning mb-1">30 Min</div>
              <h3 className="font-sans font-bold text-xs text-text-primary mb-1">Legacy Resolves</h3>
              <p className="text-[10px] text-text-secondary leading-relaxed max-w-[170px] mt-1">
                Manual phone coordination currently required for signal deviations.
              </p>
            </motion.div>

            {/* Stat 4 */}
            <motion.div variants={itemVariants} className="flex flex-col items-center text-center p-8 bg-card rounded-2xl border border-border/80 shadow-sm premium-card-shadow hover:scale-[1.01] transition-transform duration-300">
              <div className="text-3xl md:text-4xl font-extrabold font-mono text-primary glow-primary mb-1">90 Secs</div>
              <h3 className="font-sans font-bold text-xs text-primary mb-1">AI Resolve Cycle</h3>
              <p className="text-[10px] text-text-secondary leading-relaxed max-w-[170px] mt-1 font-bold">
                Dynamic automated reallocations and announcement generation.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Section 2: AI Agent Architecture Flowchart */}
      <section className="relative z-10 py-24 px-6 max-w-6xl mx-auto">
        <div className="flex flex-col gap-14 items-center">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold font-sans tracking-tight">AI Agent Pipeline Architecture</h2>
            <p className="text-text-secondary text-xs font-sans mt-2 uppercase tracking-wider font-semibold">
              Modular specialized networks coordinating via uvicorn telemetry endpoints
            </p>
          </div>

          {/* Workflow connections */}
          <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-5 relative bg-card border border-border/80 rounded-2xl p-8 shadow-sm premium-card-shadow">
            
            {/* Agent 1 */}
            <div className="flex flex-col items-center z-10 w-full lg:w-40 text-center">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-3 shadow-[0_0_15px_rgba(255,107,0,0.1)]">
                <Search className="h-6 w-6" />
              </div>
              <span className="text-xs font-bold text-text-primary">1. Telemetry Sentinel</span>
              <span className="text-[8px] text-text-secondary font-mono uppercase tracking-widest mt-1.5 font-bold">Timetable Agent</span>
            </div>

            <ChevronRight className="h-5 w-5 text-border hidden lg:block shrink-0" />

            {/* Agent 2 */}
            <div className="flex flex-col items-center z-10 w-full lg:w-40 text-center">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-3">
                <GitMerge className="h-6 w-6" />
              </div>
              <span className="text-xs font-bold text-text-primary">2. Cascade Analyser</span>
              <span className="text-[8px] text-text-secondary font-mono uppercase tracking-widest mt-1.5 font-bold">Prediction Agent</span>
            </div>

            <ChevronRight className="h-5 w-5 text-border hidden lg:block shrink-0" />

            {/* Agent 3 */}
            <div className="flex flex-col items-center z-10 w-full lg:w-40 text-center">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-3">
                <Shuffle className="h-6 w-6" />
              </div>
              <span className="text-xs font-bold text-text-primary">3. Routing Optimizer</span>
              <span className="text-[8px] text-text-secondary font-mono uppercase tracking-widest mt-1.5 font-bold">Reallocation Agent</span>
            </div>

            <ChevronRight className="h-5 w-5 text-border hidden lg:block shrink-0" />

            {/* Agent 4 */}
            <div className="flex flex-col items-center z-10 w-full lg:w-40 text-center">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-3">
                <Users className="h-6 w-6" />
              </div>
              <span className="text-xs font-bold text-text-primary">4. Flow Sentinel</span>
              <span className="text-[8px] text-text-secondary font-mono uppercase tracking-widest mt-1.5 font-bold">Crowd Safety Agent</span>
            </div>

            <ChevronRight className="h-5 w-5 text-border hidden lg:block shrink-0" />

            {/* Agent 5 */}
            <div className="flex flex-col items-center z-10 w-full lg:w-40 text-center">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-3">
                <Volume2 className="h-6 w-6" />
              </div>
              <span className="text-xs font-bold text-text-primary">5. Broadcast Engine</span>
              <span className="text-[8px] text-text-secondary font-mono uppercase tracking-widest mt-1.5 font-bold">Announcer Agent</span>
            </div>

          </div>
        </div>
      </section>

      {/* Section 3: Product Capabilities */}
      <section className="relative z-10 py-24 bg-secondary-bg/30 border-t border-border/60 px-6">
        <div className="max-w-6xl mx-auto flex flex-col gap-14">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold font-sans tracking-tight">System Capabilities</h2>
            <p className="text-text-secondary text-xs font-sans mt-2 uppercase tracking-wider font-semibold">
              Precision tools built for high-density railway junctions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Cap 1 */}
            <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm flex flex-col gap-4 group hover:border-primary/45 transition-all duration-300 premium-card-shadow">
              <div className="h-10 w-10 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center text-primary transition-transform duration-300 group-hover:scale-105">
                <Clock className="h-5 w-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-xs font-sans uppercase tracking-wider text-text-primary">Conflict Detection</h3>
                <p className="text-[11px] text-text-secondary font-sans leading-relaxed">
                  Real-time monitoring of arrival logs and active platform vacancies, flagging overlapping timetables.
                </p>
              </div>
            </div>

            {/* Cap 2 */}
            <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm flex flex-col gap-4 group hover:border-primary/45 transition-all duration-300 premium-card-shadow">
              <div className="h-10 w-10 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center text-primary transition-transform duration-300 group-hover:scale-105">
                <Shuffle className="h-5 w-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-xs font-sans uppercase tracking-wider text-text-primary">Track Optimization</h3>
                <p className="text-[11px] text-text-secondary font-sans leading-relaxed">
                  Reallocates platform lines dynamically based on train rake dimensions, track speed limits, and signal states.
                </p>
              </div>
            </div>

            {/* Cap 3 */}
            <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm flex flex-col gap-4 group hover:border-primary/45 transition-all duration-300 premium-card-shadow">
              <div className="h-10 w-10 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center text-primary transition-transform duration-300 group-hover:scale-105">
                <Users className="h-5 w-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-xs font-sans uppercase tracking-wider text-text-primary">Crowd Prediction</h3>
                <p className="text-[11px] text-text-secondary font-sans leading-relaxed">
                  Monitors platform densities and warns of overcrowding risks at overbridges, stairs, and exit gates.
                </p>
              </div>
            </div>

            {/* Cap 4 */}
            <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm flex flex-col gap-4 group hover:border-primary/45 transition-all duration-300 premium-card-shadow">
              <div className="h-10 w-10 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center text-primary transition-transform duration-300 group-hover:scale-105">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-xs font-sans uppercase tracking-wider text-text-primary">Emergency Copilot</h3>
                <p className="text-[11px] text-text-secondary font-sans leading-relaxed">
                  Interactive chat console with responsive action lists for medical emergencies, fires, and signal delays.
                </p>
              </div>
            </div>

            {/* Cap 5 */}
            <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm flex flex-col gap-4 group hover:border-primary/45 transition-all duration-300 premium-card-shadow">
              <div className="h-10 w-10 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center text-primary transition-transform duration-300 group-hover:scale-105">
                <Volume2 className="h-5 w-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-xs font-sans uppercase tracking-wider text-text-primary">Multilingual Speech Scripts</h3>
                <p className="text-[11px] text-text-secondary font-sans leading-relaxed">
                  Synthesizes delay and platform-change messages into English, Hindi, and Marathi scripts for immediate audio announcements.
                </p>
              </div>
            </div>

            {/* Cap 6 */}
            <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm flex flex-col gap-4 group hover:border-primary/45 transition-all duration-300 premium-card-shadow">
              <div className="h-10 w-10 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center text-primary transition-transform duration-300 group-hover:scale-105">
                <FileLock2 className="h-5 w-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-xs font-sans uppercase tracking-wider text-text-primary">SHA-256 Ledger Logs</h3>
                <p className="text-[11px] text-text-secondary font-sans leading-relaxed">
                  Every decision, override, and simulated delay is sealed in an unalterable operational ledger for post-incident audits.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Section 4: Hardware Roadmap Integration */}
      <section className="relative z-10 py-24 px-6 max-w-6xl mx-auto">
        <div className="flex flex-col gap-14">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold font-sans tracking-tight">Future Hardware Roadmap</h2>
            <p className="text-text-secondary text-xs font-sans mt-2 uppercase tracking-wider font-semibold">
              Integrating digital intelligence with physical edge sensors and SolidWorks CAD designs
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-sans">
            
            {/* Card 1 */}
            <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm flex flex-col gap-4 premium-card-shadow">
              <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                <Radio className="h-5 w-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="font-bold text-xs text-text-primary">IoT Distance Sensors</h4>
                <p className="text-[10px] text-text-secondary leading-relaxed font-semibold">
                  Ultrasonic trackside distance sensors transmitting real-time velocity coordinates directly to uvicorn endpoints.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm flex flex-col gap-4 premium-card-shadow">
              <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                <Cpu className="h-5 w-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="font-bold text-xs text-text-primary">ESP32 Edge Microcontrollers</h4>
                <p className="text-[10px] text-text-secondary leading-relaxed font-semibold">
                  Low-power WiFi microcontrollers counting commuter entries and gate passes on every platform stairs.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm flex flex-col gap-4 premium-card-shadow">
              <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                <Tv className="h-5 w-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="font-bold text-xs text-text-primary">CNN Platform Analytics</h4>
                <p className="text-[10px] text-text-secondary leading-relaxed font-semibold">
                  Platform CCTV analytics utilizing custom CNN neural networks to flag track blockages and platform overfills.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm flex flex-col gap-4 premium-card-shadow">
              <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                <Workflow className="h-5 w-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="font-bold text-xs text-text-primary">SolidWorks CAD Mountings</h4>
                <p className="text-[10px] text-text-secondary leading-relaxed font-semibold">
                  CAD-modeled, weather-proof enclosures for hardware mounts to enable immediate physical deployment.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-16 px-6 bg-card border-t border-border/60 text-center text-xs">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-4">
          <Logo size="md" showText={true} />
          <p className="text-[11px] text-text-secondary font-sans mt-2">
            Operations control software built for Indian Railways command rooms. Built for FAR AWAY 2026.
          </p>
        </div>
      </footer>
    </div>
  );
}

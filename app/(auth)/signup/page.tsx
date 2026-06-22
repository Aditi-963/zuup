'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOperationsStore } from '../../../store/useOperationsStore';
import api from '../../../services/api';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import Logo from '../../../components/Logo';

export default function SignupPage() {
  const router = useRouter();
  const { setToken, setCurrentUser, addNotification } = useOperationsStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState('CONTROL_OPERATOR');
  const [agree, setAgree] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (!agree) {
      setErrorMsg('Please agree to security terms and procedures.');
      return;
    }

    loading || setLoading(true);

    try {
      // 1. Submit signup request
      await api.post('/signup', {
        full_name: fullName,
        email,
        password,
        organization,
        role,
      });

      // 2. Automatically log in after successful signup
      const loginRes = await api.post('/login', {
        email,
        password,
      });

      const { access_token, user } = loginRes.data;
      
      setToken(access_token);
      setCurrentUser(user);
      addNotification('Account Created', `Welcome to the console, ${user.full_name}.`, 'success');
      router.push('/dashboard');

    } catch (err: any) {
      console.warn('API signup failed, falling back to mock profile session...', err);
      
      // Offline fallback: simulate profile session creation
      if (email && password.length >= 6) {
        const mockUser = {
          id: Date.now(),
          full_name: fullName,
          email,
          organization: organization || 'Northern Railway HQ',
          role,
        };
        setToken('mock-jwt-token-custom-signup');
        setCurrentUser(mockUser);
        addNotification('Offline Mode Active', `Command profile registered for ${fullName} under offline mode.`, 'success');
        router.push('/dashboard');
      } else {
        setErrorMsg(
          err.response?.data?.detail || 
          'Error creating profile. Please verify your details.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative select-none">
      
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(255,107,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,107,0,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] animated-grid-bg opacity-65 pointer-events-none" />

      {/* Radial Gradient overlay */}
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(255,107,0,0.04),transparent_100%)] z-0 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="z-10 w-full max-w-lg bg-card border border-border/80 rounded-2xl p-8 premium-card-shadow flex flex-col gap-6"
      >
        {/* Brand header */}
        <div className="flex flex-col items-center text-center gap-3 border-b border-border/40 pb-5">
          <Logo size="lg" showText={true} />
        </div>

        {errorMsg && (
          <div className="flex gap-2.5 bg-danger/5 border border-danger/25 text-danger p-3.5 rounded-xl text-xs leading-relaxed font-sans">
            <ShieldCheck className="h-4.5 w-4.5 shrink-0 mt-0.5 text-danger" />
            <span className="font-semibold">{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs">
          
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[9px] uppercase tracking-widest text-text-secondary font-bold">
              Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. Aditi Sharma"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full bg-background/50 border border-border/85 rounded-xl px-4 py-3 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-mono text-[9px] uppercase tracking-widest text-text-secondary font-bold">
              Railway Email Address
            </label>
            <input
              type="email"
              placeholder="e.g. aditi.sharma@rail.gov.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-background/50 border border-border/85 rounded-xl px-4 py-3 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-mono text-[9px] uppercase tracking-widest text-text-secondary font-bold">
              Organization Unit
            </label>
            <input
              type="text"
              placeholder="e.g. Northern Railway Division"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              required
              className="w-full bg-background/50 border border-border/85 rounded-xl px-4 py-3 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-mono text-[9px] uppercase tracking-widest text-text-secondary font-bold">
              Operational Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-background/50 border border-border/85 rounded-xl px-4 py-3 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200 cursor-pointer"
            >
              <option value="CONTROL_OPERATOR">Control Room Operator</option>
              <option value="STATION_MASTER">Station Master</option>
              <option value="ADMIN">Railway Administrator</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-mono text-[9px] uppercase tracking-widest text-text-secondary font-bold">
              Password (Min 6 chars)
            </label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-background/50 border border-border/85 rounded-xl px-4 py-3 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-mono text-[9px] uppercase tracking-widest text-text-secondary font-bold">
              Confirm Security Password
            </label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-background/50 border border-border/85 rounded-xl px-4 py-3 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200"
            />
          </div>

          <div className="col-span-1 md:col-span-2 flex items-start gap-3 mt-2">
            <input
              type="checkbox"
              id="agree"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="rounded border-border bg-background text-primary accent-primary h-4 w-4 cursor-pointer mt-0.5 shrink-0"
            />
            <label htmlFor="agree" className="text-[10px] text-text-secondary leading-normal cursor-pointer select-none font-medium">
              I certify that I am an authorized employee of Indian Railways, and agree to audit logging procedures for all track switching and routing approvals.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="col-span-1 md:col-span-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-hover hover:opacity-95 py-3.5 text-xs font-bold text-white shadow-[0_0_15px_rgba(255,107,0,0.2)] hover:shadow-[0_0_25px_rgba(255,107,0,0.35)] transition-all duration-300 cursor-pointer disabled:opacity-40 mt-2 active:scale-98"
          >
            {loading ? 'Registering command profile...' : 'Create Operational Account'}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        <div className="text-center font-sans text-[11px] text-text-secondary border-t border-border/40 pt-4 font-semibold">
          Already have an operational account?{' '}
          <Link href="/login" className="text-primary hover:underline font-bold">
            Sign In
          </Link>
        </div>

      </motion.div>
    </div>
  );
}

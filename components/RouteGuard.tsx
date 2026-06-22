'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useOperationsStore } from '../store/useOperationsStore';
import { BrainCircuit, RefreshCw } from 'lucide-react';

const publicPaths = ['/', '/login', '/signup'];

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { token, currentUser } = useOperationsStore();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const isPublicPath = publicPaths.includes(pathname);

      if (!token || !currentUser) {
        // Not logged in
        if (!isPublicPath) {
          setAuthorized(false);
          router.push('/login');
        } else {
          setAuthorized(true);
        }
      } else {
        // Logged in
        if (pathname === '/login' || pathname === '/signup') {
          setAuthorized(false);
          router.push('/dashboard');
        } else {
          setAuthorized(true);
        }
      }
    };

    checkAuth();
  }, [pathname, token, currentUser, router]);

  if (!authorized) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 text-text-primary">
        <BrainCircuit className="h-10 w-10 text-primary animate-pulse" />
        <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-text-secondary">
          <RefreshCw className="h-3.5 w-3.5 animate-spin text-primary" />
          <span>Verifying Command Session Access...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldAlert,
  ArrowLeft,
  Lock,
  RefreshCw,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface AuthGuardProps {
  children: React.ReactNode;
}

const ADMIN_ONLY_ROUTES = ['/users', '/accounts', '/balance'];

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, isAuthenticated, isLoading, switchRole } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, isAuthenticated, router, pathname]);

  // Loading indicator
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#C02586]/20 border-t-[#C02586]" />
          <p className="text-xs font-semibold text-slate-500 tracking-wide">
            Authenticating session...
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated redirecting state
  if (!isAuthenticated || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <p className="text-xs text-slate-400">Redirecting to secure login...</p>
      </div>
    );
  }

  // Check RBAC permissions for Admin-only routes
  const isAdminRoute = ADMIN_ONLY_ROUTES.some((route) => pathname.startsWith(route));

  if (isAdminRoute && user.role !== 'admin') {
    return (
      <div className="flex min-h-[70vh] items-center justify-center p-4">
        <div className="relative w-full max-w-lg rounded-3xl bg-white p-8 shadow-xl border border-slate-200/80 text-center animate-in zoom-in-95 duration-200">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 ring-8 ring-rose-50/50">
            <ShieldAlert className="h-8 w-8" />
          </div>

          <span className="mt-5 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Lock className="h-3 w-3" /> Error 403: Restricted Route
          </span>

          <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
            Administrator Access Required
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
            You are currently authenticated as{' '}
            <span className="font-bold text-slate-800">{user.name}</span> with the role of{' '}
            <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
              Team User ({user.title})
            </span>
            . Agency financial ledger, connected accounts, and member management require Administrator privileges.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-all"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Allowed View</span>
            </Link>

            <button
              type="button"
              onClick={() => switchRole('admin')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#C02586] hover:bg-[#A01E6F] text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Switch to Admin (Demo Toggle)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  KeyRound,
} from 'lucide-react';
import { AuthProvider, useAuth } from '@/lib/auth-context';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || 'admin@digestmedia.co';
  const { updatePassword } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const calculateStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score += 33;
    if (/[A-Z]/.test(pass) || /[0-9]/.test(pass)) score += 33;
    if (/[^A-Za-z0-9]/.test(pass)) score += 34;
    return score;
  };

  const strength = calculateStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      await updatePassword(password);
      setSuccess(true);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to update password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F8F9FA] p-4 sm:p-6 lg:p-8 font-sans">
      <div className="relative w-full max-w-md">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-64 h-64 bg-berry/10 blur-3xl rounded-full pointer-events-none" />

        <div className="relative rounded-3xl bg-white p-7 sm:p-9 shadow-xl border border-slate-200/80">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 px-3 items-center justify-center rounded-2xl bg-berry text-white font-black text-xl shadow-md ring-4 ring-berry/15">
              DM
            </div>
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
              Update password
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Enter your new password
            </p>
          </div>

          {success ? (
            <div className="mt-6 space-y-4 text-center animate-in fade-in zoom-in-95 duration-200">
              <h3 className="text-xl font-bold text-slate-900">
                Congratulations 🎉
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Your account password has successfully been set up.
              </p>

              <div className="pt-2">
                <Link
                  href="/login"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-berry text-white text-xs sm:text-sm font-semibold shadow-md hover:bg-[#A01E6F] transition-all"
                >
                  <span>Login now</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {errorMessage && (
                <div className="rounded-xl bg-rose-50 border border-rose-200/80 p-3 text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-berry transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Password strength bar */}
                {password.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          strength < 40
                            ? 'bg-rose-500'
                            : strength < 80
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${strength}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Strength</span>
                      <span className="font-semibold">
                        {strength < 40 ? 'Weak' : strength < 80 ? 'Good' : 'Strong'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-berry transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-berry hover:bg-[#A01E6F] text-white font-semibold text-xs sm:text-sm shadow-md transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Saving password...</span>
                  </>
                ) : (
                  <span>Save</span>
                )}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-[11px] text-slate-400 border-t border-slate-100 pt-4">
            Digest Media 2024. All rights reserved
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthProvider>
      <React.Suspense
        fallback={
          <div className="flex h-screen w-full items-center justify-center bg-slate-50">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-berry/20 border-t-berry" />
          </div>
        }
      >
        <ResetPasswordForm />
      </React.Suspense>
    </AuthProvider>
  );
}

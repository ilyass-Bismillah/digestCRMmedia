'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  KeyRound,
} from 'lucide-react';
import { useAuth, AuthProvider } from '@/lib/auth-context';

function ForgotPasswordForm() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your account email.');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      setSubmitted(true);
    } catch (err: any) {
      setErrorMessage('Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F8F9FA] p-4 sm:p-6 lg:p-8 font-sans">
      <div className="relative w-full max-w-md">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#C02586]/10 blur-3xl rounded-full pointer-events-none" />

        <div className="relative rounded-3xl bg-white p-7 sm:p-9 shadow-xl border border-slate-200/80">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 px-3 items-center justify-center rounded-2xl bg-[#C02586] text-white font-black text-xl shadow-md ring-4 ring-[#C02586]/15">
              DM
            </div>
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
              Forgot Password
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Enter your email address to reset password
            </p>
          </div>

          {submitted ? (
            <div className="mt-6 space-y-4 text-center animate-in fade-in zoom-in-95 duration-200">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C02586]/10 text-[#C02586] ring-8 ring-[#C02586]/5">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Email Sent!
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Check your email <span className="font-semibold text-slate-800">{email}</span> for instructions to reset your password.
              </p>

              <div className="pt-2 space-y-2">
                <Link
                  href={`/reset-password?email=${encodeURIComponent(email)}`}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#C02586] text-white text-xs font-semibold shadow-sm hover:bg-[#A01E6F] transition-all"
                >
                  <span>Set New Password</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                <Link
                  href="/login"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-all"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to login</span>
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
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="samantha@digestmedia.co"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#C02586] transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#C02586] hover:bg-[#A01E6F] text-white font-semibold text-xs sm:text-sm shadow-md transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Submit</span>
                )}
              </button>

              <div className="pt-4 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#C02586] transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to login</span>
                </Link>
              </div>
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

export default function ForgotPasswordPage() {
  return (
    <AuthProvider>
      <ForgotPasswordForm />
    </AuthProvider>
  );
}

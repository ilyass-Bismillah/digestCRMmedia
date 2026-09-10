'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';
import { useAuth, AuthProvider, UserRole } from '@/lib/auth-context';

function SignupForm() {
  const router = useRouter();
  const { signup } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!firstName.trim() || !lastName.trim()) {
      setErrorMessage('Please enter both your first and last name.');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (password.length < 4) {
      setErrorMessage('Password must be at least 4 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    if (!termsAccepted) {
      setErrorMessage('Please accept terms & conditions to proceed.');
      return;
    }

    setSubmitting(true);
    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`;
      await signup(fullName, email, password, role);
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to create account.');
    } finally {
      setSubmitting(false);
    }
  };

  // Congratulations Modal / Screen (Figma Board 1 "Connect")
  if (isSuccess) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#F8F9FA] p-4 font-sans">
        <div className="relative w-full max-w-md rounded-3xl bg-white p-8 sm:p-10 shadow-xl border border-slate-200/80 text-center animate-in zoom-in-95 duration-200">
          <div className="flex h-14 px-3 mx-auto items-center justify-center w-fit rounded-2xl bg-[#C02586] text-white font-black text-2xl shadow-md ring-4 ring-[#C02586]/15">
            DM
          </div>
          <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">
            Congratulations 🎉
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Your account has been successfully set up.
          </p>
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="mt-6 w-full py-3 px-4 rounded-xl bg-[#C02586] hover:bg-[#A01E6F] text-white font-semibold text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer"
          >
            Login now
          </button>
          <p className="mt-8 text-[11px] text-slate-400">
            Digest Media 2024. All rights reserved.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F8F9FA] p-4 sm:p-6 lg:p-8 font-sans">
      <div className="relative w-full max-w-md">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#C02586]/10 blur-3xl rounded-full pointer-events-none" />

        <div className="relative rounded-3xl bg-white p-7 sm:p-9 shadow-xl border border-slate-200/80">
          {/* Logo & Header Matching Figma */}
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 px-3 items-center justify-center rounded-2xl bg-[#C02586] text-white font-black text-xl shadow-md ring-4 ring-[#C02586]/15">
              DM
            </div>
            <h1 className="mt-4 text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Welcome to Digest Web application
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-[#C02586] mt-1">
              Take Charge of Your Business Service with Digest App Manager
            </p>
            <p className="text-xs text-slate-400 mt-2">
              Please fill in your information to Sign up
            </p>
          </div>

          {errorMessage && (
            <div className="mt-4 rounded-xl bg-rose-50 border border-rose-200/80 p-3 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
            {/* First & Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Samantha"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#C02586] transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. William"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#C02586] transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
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

            {/* Role selector dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Account Role
              </label>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full appearance-none px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#C02586] transition-all text-slate-700 pr-8 cursor-pointer"
                >
                  <option value="user">Client / Team User</option>
                  <option value="admin">Administrator (Full Access)</option>
                </select>
                <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Password & Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-2.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#C02586] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-2.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#C02586] transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 accent-[#C02586]"
                />
                <span>I accept terms & conditions</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-3 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#C02586] hover:bg-[#A01E6F] text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Setting up account...</span>
                </>
              ) : (
                <>
                  <span>Sign up</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-bold text-[#C02586] hover:underline"
            >
              Sign in
            </Link>
          </div>

          <p className="mt-3 text-center text-[11px] text-slate-400">
            Digest Media 2024. All rights reserved
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <AuthProvider>
      <SignupForm />
    </AuthProvider>
  );
}

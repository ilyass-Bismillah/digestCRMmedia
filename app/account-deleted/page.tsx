'use client';

import React from 'react';
import Link from 'next/link';
import { Trash2, ArrowLeft } from 'lucide-react';

export default function AccountDeletedPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F8F9FA] p-4 font-sans">
      <div className="relative w-full max-w-md rounded-3xl bg-white p-8 sm:p-10 shadow-xl border border-slate-200/80 text-center animate-in zoom-in-95 duration-200">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-50 text-rose-500 ring-8 ring-rose-50/50">
          <Trash2 className="h-10 w-10" />
        </div>

        <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">
          Oops... Sorry!
        </h2>

        <p className="mt-2 text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
          Your account seems to be deleted. If you think this is an error, please reach out to your admin.
        </p>

        <div className="mt-8">
          <Link
            href="/login"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#C02586] hover:bg-[#A01E6F] text-white font-semibold text-sm shadow-md transition-all active:scale-[0.98]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to login</span>
          </Link>
        </div>

        <p className="mt-8 text-[11px] text-slate-400">
          Digest Media 2024. All rights reserved
        </p>
      </div>
    </div>
  );
}

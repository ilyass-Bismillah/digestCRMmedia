'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  X,
  LayoutDashboard,
  Users,
  Share2,
  UserCheck,
  CheckSquare,
  Bell,
  LifeBuoy,
  WalletCards,
  Settings,
  HardDrive,
} from 'lucide-react';
import { useDashboard } from '@/lib/dashboard-context';
import { useAuth } from '@/lib/auth-context';

export function MobileSidebar() {
  const pathname = usePathname();
  const { mobileSidebarOpen, setMobileSidebarOpen, tasks, tickets, notifications } = useDashboard();
  const { user } = useAuth();

  if (!mobileSidebarOpen) return null;

  const pendingTasksCount = tasks.filter((t) => !t.completed).length;
  const openTicketsCount = tickets.filter((t) => t.status !== 'resolved').length;
  const unreadNotifsCount = notifications.filter((n) => n.unread).length;

  const rawNavigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, badge: null, adminOnly: false },
    { name: 'Clients', href: '/clients', icon: Users, badge: null, adminOnly: false },
    { name: 'Accounts', href: '/accounts', icon: Share2, badge: null, adminOnly: true },
    { name: 'Team & Users', href: '/users', icon: UserCheck, badge: null, adminOnly: true },
    { name: 'Tasks Queue', href: '/tasks', icon: CheckSquare, badge: pendingTasksCount || null, badgeColor: 'bg-emerald-100 text-emerald-800', adminOnly: false },
    { name: 'Notifications', href: '/notifications', icon: Bell, badge: unreadNotifsCount || null, badgeColor: 'bg-rose-100 text-rose-700', adminOnly: false },
    { name: 'Support Tickets', href: '/tickets', icon: LifeBuoy, badge: openTicketsCount || null, badgeColor: 'bg-amber-100 text-amber-800', adminOnly: false },
    { name: 'Balance & Billing', href: '/balance', icon: WalletCards, badge: null, adminOnly: true },
    { name: 'Settings', href: '/settings', icon: Settings, badge: null, adminOnly: false },
  ];

  const navigationItems = rawNavigationItems.filter(
    (item) => !item.adminOnly || user?.role === 'admin'
  );

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => setMobileSidebarOpen(false)}
      />

      {/* Drawer */}
      <div className="relative flex w-72 flex-col justify-between bg-white p-5 shadow-2xl z-10 transition-transform">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 px-2 items-center justify-center rounded-lg bg-[#C02586] text-white font-black text-sm">
                DM
              </div>
              <span className="font-bold text-slate-900 text-sm tracking-tight">
                Digest <span className="text-[#C02586]">Media</span>
              </span>
            </div>
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(false)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Links */}
          <div className="mt-4 space-y-1.5">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#C02586] text-white font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${isActive ? 'bg-white/25 text-white' : item.badgeColor || 'bg-slate-100 text-slate-700'}`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom Storage */}
        <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100 mt-6">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <HardDrive className="h-3.5 w-3.5 text-[#C02586]" /> Storage
            </span>
            <span className="font-bold text-slate-800">78%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#C02586] to-rose-400 rounded-full w-[78%]" />
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5">780 GB of 1 TB used</p>
        </div>
      </div>
    </div>
  );
}

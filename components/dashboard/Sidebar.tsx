'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
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
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { useDashboard } from '@/lib/dashboard-context';
import { useAuth } from '@/lib/auth-context';

export function Sidebar() {
  const pathname = usePathname();
  const { tasks, tickets, notifications } = useDashboard();
  const { user } = useAuth();

  const pendingTasksCount = tasks.filter((t) => !t.completed).length;
  const openTicketsCount = tickets.filter((t) => t.status !== 'resolved').length;
  const unreadNotifsCount = notifications.filter((n) => n.unread).length;

  const rawNavigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      badge: null,
      adminOnly: false,
    },
    {
      name: 'Clients',
      href: '/clients',
      icon: Users,
      badge: null,
      adminOnly: false,
    },
    {
      name: 'Accounts',
      href: '/accounts',
      icon: Share2,
      badge: null,
      adminOnly: true,
    },
    {
      name: 'Team & Users',
      href: '/users',
      icon: UserCheck,
      badge: null,
      adminOnly: true,
    },
    {
      name: 'Tasks Queue',
      href: '/tasks',
      icon: CheckSquare,
      badge: pendingTasksCount > 0 ? pendingTasksCount : null,
      badgeColor: 'bg-emerald-100 text-emerald-800',
      adminOnly: false,
    },
    {
      name: 'Notifications',
      href: '/notifications',
      icon: Bell,
      badge: unreadNotifsCount > 0 ? unreadNotifsCount : null,
      badgeColor: 'bg-rose-100 text-rose-700',
      adminOnly: false,
    },
    {
      name: 'Support Tickets',
      href: '/tickets',
      icon: LifeBuoy,
      badge: openTicketsCount > 0 ? openTicketsCount : null,
      badgeColor: 'bg-amber-100 text-amber-800',
      adminOnly: false,
    },
    {
      name: 'Balance & Billing',
      href: '/balance',
      icon: WalletCards,
      badge: null,
      adminOnly: true,
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      badge: null,
      adminOnly: false,
    },
  ];

  // RBAC filter: Hide admin-only links for regular users
  const navigationItems = rawNavigationItems.filter(
    (item) => !item.adminOnly || user?.role === 'admin'
  );

  return (
    <aside className="hidden md:flex w-64 flex-col justify-between bg-white border-r border-slate-200/80 min-h-[calc(100vh-4rem)] p-4 select-none shrink-0">
      <div className="space-y-6">
        {/* Navigation List */}
        <div className="space-y-1.5">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Main Menu
          </p>
          {navigationItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-[#C02586] text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4.5 w-4.5 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span
                    className={`px-2 py-0.5 text-[11px] font-bold rounded-full transition-all ${
                      isActive
                        ? 'bg-white/25 text-white'
                        : item.badgeColor || 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom Storage & Collapse toggle matching Figma */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        {/* Storage Widget */}
        <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100">
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

        {/* Agency Pro Badge */}
        <div className="flex items-center justify-between px-2 py-1 text-xs text-slate-500">
          <span className="flex items-center gap-1 text-[11px]">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Agency Enterprise
          </span>
          <Link
            href="/tickets"
            className="hover:text-[#C02586] text-[11px] flex items-center gap-1 transition-colors"
          >
            <HelpCircle className="h-3 w-3" /> Help
          </Link>
        </div>
      </div>
    </aside>
  );
}

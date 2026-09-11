'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  Plus,
  Bell,
  Check,
  ChevronDown,
  UserPlus,
  CheckSquare,
  LifeBuoy,
  CreditCard,
  Menu,
  Sparkles,
  ExternalLink,
  Settings,
  LogOut,
  User,
  ShieldCheck,
  RefreshCw,
  Share2,
} from 'lucide-react';
import { useDashboard } from '@/lib/dashboard-context';
import { useAuth } from '@/lib/auth-context';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, switchRole } = useAuth();
  const {
    notifications,
    markAllNotificationsAsRead,
    markNotificationAsRead,
    setActiveModal,
    setMobileSidebarOpen,
  } = useDashboard();

  const [notifOpen, setNotifOpen] = useState(false);
  const [notifTab, setNotifTab] = useState<'all' | 'unread'>('all');
  const [quickActionOpen, setQuickActionOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const quickRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
      if (quickRef.current && !quickRef.current.contains(event.target as Node)) {
        setQuickActionOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-berry text-white shadow-sm transition-all">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Mobile Hamburger & Brand Logo */}
        <div className="flex items-center gap-3 md:gap-4">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 md:hidden focus:outline-none focus:ring-2 focus:ring-white/40"
            aria-label="Open mobile menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="flex h-9 px-2.5 items-center justify-center rounded-lg bg-white text-berry font-black tracking-tight text-base shadow-xs group-hover:scale-105 transition-all">
              DM
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                Digest <span className="font-light opacity-95">Media</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Global Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <button
            type="button"
            onClick={() => setActiveModal('search')}
            className="w-full flex items-center justify-between px-3.5 py-2 text-sm rounded-xl bg-white/15 hover:bg-white/20 text-white/90 border border-white/20 shadow-inner backdrop-blur transition-all focus:outline-none focus:ring-2 focus:ring-white/40 group"
          >
            <div className="flex items-center gap-2.5">
              <Search className="h-4 w-4 text-white/70 group-hover:text-white transition-colors" />
              <span className="text-white/80 group-hover:text-white">Search clients, tasks, invoices...</span>
            </div>
            <kbd className="hidden lg:inline-flex items-center gap-0.5 rounded-md bg-black/20 px-2 py-0.5 text-[11px] font-mono text-white/70">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>
        </div>

        {/* Right: Quick Action, Notifications, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile search button */}
          <button
            type="button"
            onClick={() => setActiveModal('search')}
            className="flex md:hidden h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* Quick Action Dropdown */}
          <div className="relative" ref={quickRef}>
            <button
              type="button"
              onClick={() => setQuickActionOpen(!quickActionOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white text-berry font-semibold text-xs sm:text-sm hover:bg-white/95 shadow-sm transition-all active:scale-95"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span className="hidden sm:inline">New Action</span>
              <ChevronDown className={`h-3.5 w-3.5 opacity-70 transition-transform duration-200 ${quickActionOpen ? 'rotate-180' : ''}`} />
            </button>

            {quickActionOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white text-slate-800 shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Quick Create
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setQuickActionOpen(false);
                    setActiveModal('add_client');
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm hover:bg-berry/10 hover:text-berry text-slate-700 text-left transition-colors font-medium"
                >
                  <UserPlus className="h-4 w-4 text-berry" />
                  Add New Client
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setQuickActionOpen(false);
                    setActiveModal('add_task');
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm hover:bg-berry/10 hover:text-berry text-slate-700 text-left transition-colors font-medium"
                >
                  <CheckSquare className="h-4 w-4 text-emerald-600" />
                  Create Task
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setQuickActionOpen(false);
                    setActiveModal('add_ticket');
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm hover:bg-berry/10 hover:text-berry text-slate-700 text-left transition-colors font-medium"
                >
                  <LifeBuoy className="h-4 w-4 text-amber-600" />
                  Open Support Ticket
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setQuickActionOpen(false);
                    setActiveModal('add_account');
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm hover:bg-berry/10 hover:text-berry text-slate-700 text-left transition-colors font-medium"
                >
                  <Share2 className="h-4 w-4 text-purple-600" />
                  Connect Ad Account
                </button>
                <div className="my-1 border-t border-slate-100" />
                <button
                  type="button"
                  onClick={() => {
                    setQuickActionOpen(false);
                    setActiveModal('request_payout');
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm hover:bg-berry/10 hover:text-berry text-slate-700 text-left transition-colors font-medium"
                >
                  <CreditCard className="h-4 w-4 text-berry" />
                  Request Balance Payout
                </button>
              </div>
            )}
          </div>

          {/* Notifications Popover */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 hover:bg-white/25 text-white transition-all focus:outline-none focus:ring-2 focus:ring-white/40"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-berry">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white text-slate-800 shadow-2xl border border-slate-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between px-4 pb-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="rounded-full bg-berry/10 text-berry px-2 py-0.5 text-xs font-semibold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={() => markAllNotificationsAsRead()}
                      className="text-xs font-medium text-berry hover:underline flex items-center gap-1"
                    >
                      <Check className="h-3 w-3" /> Mark all read
                    </button>
                  )}
                </div>

                {/* Tabs: All vs Unread (Figma board 3) */}
                <div className="flex px-4 pt-2 border-b border-slate-100 gap-4 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setNotifTab('all')}
                    className={`pb-2 transition-colors border-b-2 ${
                      notifTab === 'all'
                        ? 'border-berry text-berry'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    All ({notifications.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setNotifTab('unread')}
                    className={`pb-2 transition-colors border-b-2 ${
                      notifTab === 'unread'
                        ? 'border-berry text-berry'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Unread ({unreadCount})
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {(notifTab === 'unread' ? notifications.filter(n => n.unread) : notifications).length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      No notifications to show
                    </div>
                  ) : (
                    (notifTab === 'unread' ? notifications.filter(n => n.unread) : notifications).map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markNotificationAsRead(notif.id);
                          if (notif.link) {
                            setNotifOpen(false);
                            router.push(notif.link);
                          }
                        }}
                        className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 ${
                          notif.unread ? 'bg-berry/5' : ''
                        }`}
                      >
                        <div
                          className={`mt-1 h-2.5 w-2.5 rounded-full shrink-0 ${
                            notif.title.toLowerCase().includes('task')
                              ? 'bg-emerald-500'
                              : notif.title.toLowerCase().includes('payment') || notif.title.toLowerCase().includes('balance')
                              ? 'bg-blue-500'
                              : notif.title.toLowerCase().includes('ticket')
                              ? 'bg-amber-500'
                              : 'bg-berry'
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-900 leading-tight">
                            {notif.title}
                          </p>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                            {notif.description}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-1">{notif.time}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="px-4 pt-2.5 border-t border-slate-100 text-center">
                  <Link
                    href="/notifications"
                    onClick={() => setNotifOpen(false)}
                    className="text-xs font-semibold text-berry hover:underline flex items-center justify-center gap-1"
                  >
                    View notification center <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar & Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-white/40"
            >
              <div className="relative h-8 w-8 rounded-full overflow-hidden ring-2 ring-white/30">
                <img
                  src={user?.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80"}
                  alt={user?.name || "User"}
                  className="h-full w-full object-cover"
                />
                <span className={`absolute bottom-0 right-0 h-2 w-2 rounded-full ring-1 ring-white ${user?.role === 'admin' ? 'bg-emerald-400' : 'bg-blue-400'}`} />
              </div>
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-xs font-semibold text-white leading-tight">{user?.name || "Sarah Jenkins"}</span>
                <span className="text-[10px] text-white/75">{user?.title || "Creative Director"}</span>
              </div>
              <ChevronDown className={`hidden xl:block h-3.5 w-3.5 text-white/70 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white text-slate-800 shadow-2xl border border-slate-100 py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={user?.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80"}
                      alt={user?.name || "User"}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{user?.name || "Sarah Jenkins"}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user?.email || "admin@digestmedia.co"}</p>
                      <div className="mt-1">
                        {user?.role === 'admin' ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[10px] font-bold border border-emerald-200/60">
                            <ShieldCheck className="h-3 w-3" /> Agency Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-700 px-2 py-0.5 text-[10px] font-bold border border-blue-200/60">
                            <User className="h-3 w-3" /> Team User
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick RBAC Role Switcher */}
                <div className="px-3 py-2 bg-slate-50/70 border-b border-slate-100">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 px-1">
                    Demo RBAC Switcher
                  </p>
                  {user?.role === 'admin' ? (
                    <button
                      type="button"
                      onClick={() => {
                        switchRole('user');
                        setProfileOpen(false);
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold shadow-xs transition-colors"
                    >
                      <div className="flex items-center gap-1.5">
                        <RefreshCw className="h-3.5 w-3.5 text-blue-600" />
                        <span>Switch to Team User</span>
                      </div>
                      <span className="text-[10px] font-medium text-slate-400">Test RBAC</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        switchRole('admin');
                        setProfileOpen(false);
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl bg-berry/10 hover:bg-berry/20 text-berry border border-berry/20 text-xs font-semibold shadow-xs transition-colors"
                    >
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5 text-berry" />
                        <span>Switch to Admin</span>
                      </div>
                      <span className="text-[10px] font-bold text-berry">Full Access</span>
                    </button>
                  )}
                </div>

                <div className="py-1">
                  <Link
                    href="/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-berry transition-colors"
                  >
                    <User className="h-4 w-4" /> My Profile
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-berry transition-colors"
                  >
                    <Settings className="h-4 w-4" /> Agency Settings
                  </Link>
                </div>

                <div className="border-t border-slate-100 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

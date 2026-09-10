'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  CheckCircle2,
  Check,
  Clock,
  ExternalLink,
  MessageSquare,
  DollarSign,
  CheckSquare,
  Shield,
  Trash2,
} from 'lucide-react';
import { useDashboard } from '@/lib/dashboard-context';

export default function NotificationsPage() {
  const {
    notifications,
    markAllNotificationsAsRead,
    markNotificationAsRead,
  } = useDashboard();

  const [filterType, setFilterType] = useState<'all' | 'task' | 'billing' | 'ticket'>('all');
  const [showEmptyPreview, setShowEmptyPreview] = useState(false);

  const filteredNotifs = notifications.filter(
    (n) => filterType === 'all' || n.type === filterType
  );

  const getTypeCircle = (type: string) => {
    switch (type) {
      case 'task':
        return <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />;
      case 'billing':
        return <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />;
      case 'ticket':
        return <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />;
      default:
        return <div className="h-2.5 w-2.5 rounded-full bg-berry" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header matching Figma Board 3 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Notifications ({notifications.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time feed of task updates, client ticket responses, and payment settlements.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowEmptyPreview(!showEmptyPreview)}
            className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            {showEmptyPreview ? 'Show Notifications' : 'Preview Empty State'}
          </button>
          <button
            type="button"
            onClick={() => markAllNotificationsAsRead()}
            className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-berry hover:bg-[#A01E6F] text-white font-semibold text-xs transition-all active:scale-95 cursor-pointer shadow-xs"
          >
            <Check className="h-3.5 w-3.5" />
            <span>Mark all as read</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs matching Figma Board 3 */}
      <div className="flex items-center gap-2 overflow-x-auto p-1 bg-slate-100 rounded-xl w-fit">
        {[
          { id: 'all', label: 'All' },
          { id: 'task', label: 'Tasks' },
          { id: 'billing', label: 'Payments' },
          { id: 'ticket', label: 'Tickets' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilterType(tab.id as any)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
              filterType === tab.id
                ? 'bg-white text-berry shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List or Empty State */}
      {showEmptyPreview || filteredNotifs.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center border border-slate-200/80 shadow-xs">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-berry/10 text-berry ring-8 ring-berry/5">
            <Bell className="h-10 w-10" />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-900">
            No notifications
          </h3>
          <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
            You&apos;re all caught up! New client actions, tickets, and tasks will show up here in real time.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden divide-y divide-slate-100">
          {filteredNotifs.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markNotificationAsRead(notif.id)}
              className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors cursor-pointer ${
                notif.unread ? 'bg-berry/5' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-slate-100 shrink-0 mt-0.5 flex items-center justify-center">
                  {getTypeCircle(notif.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{notif.title}</h3>
                    {notif.unread && (
                      <span className="h-2 w-2 rounded-full bg-berry" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {notif.description}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {notif.time}
                  </p>
                </div>
              </div>

              {notif.link && (
                <Link
                  href={notif.link}
                  className="shrink-0 p-2 text-slate-400 hover:text-berry hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

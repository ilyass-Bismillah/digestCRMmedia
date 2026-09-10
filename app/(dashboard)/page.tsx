'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  CheckSquare,
  LifeBuoy,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  Plus,
  ChevronRight,
  Filter,
  BarChart3,
  ExternalLink,
  Share2,
  AlertTriangle,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useDashboard } from '@/lib/dashboard-context';
import { analyticsDataSets } from '@/lib/mock-data';

export default function DashboardPage() {
  const {
    clients,
    tasks,
    tickets,
    transactions,
    toggleTaskCompletion,
    setActiveModal,
  } = useDashboard();

  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '90D' | '1Y'>('30D');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalClientsCount = clients.length;
  const activeTasksCount = tasks.filter((t) => !t.completed).length;
  const pendingTicketsCount = tickets.filter((t) => t.status !== 'resolved').length;
  const totalBalance = transactions
    .filter((t) => t.status === 'paid')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const kpis = [
    {
      title: 'Total Active Clients',
      value: totalClientsCount.toString(),
      trend: '+12.5%',
      isPositive: true,
      subtext: 'vs last month',
      icon: Users,
      color: 'text-[#931B58]',
      bgColor: 'bg-[#931B58]/10',
      link: '/clients',
    },
    {
      title: 'Active Editorial Tasks',
      value: activeTasksCount.toString(),
      trend: '18 due today',
      isPositive: true,
      subtext: '6 in client review',
      icon: CheckSquare,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      link: '/tasks',
    },
    {
      title: 'Pending Support Tickets',
      value: pendingTicketsCount.toString(),
      trend: '3 high priority',
      isPositive: false,
      subtext: 'Avg response 18m',
      icon: LifeBuoy,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      link: '/tickets',
    },
    {
      title: 'Agency Balance / Retainers',
      value: `$${(totalBalance || 48250).toLocaleString()}`,
      trend: '+8.4%',
      isPositive: true,
      subtext: 'Monthly revenue growth',
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      link: '/balance',
    },
  ];

  const chartData = analyticsDataSets[timeRange];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Welcome Banner / Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Welcome back, Sarah
            </h1>
            <span className="text-2xl">👋</span>
          </div>
          <p className="text-sm text-slate-500">
            Here&apos;s your agency&apos;s real-time media performance, active queues, and balance updates.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setActiveModal('add_client')}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all active:scale-95"
          >
            <Users className="h-3.5 w-3.5" />
            <span>Add Client</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveModal('add_task')}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-[#931B58] hover:bg-[#7f174d] text-white shadow-sm transition-all active:scale-95"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <Link
              key={idx}
              href={kpi.link}
              className="relative overflow-hidden bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">{kpi.title}</span>
                <div className={`p-2 rounded-xl ${kpi.bgColor} ${kpi.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-3 flex items-baseline justify-between">
                <div className="text-2xl font-bold text-slate-900 tracking-tight">
                  {kpi.value}
                </div>
                <div
                  className={`flex items-center text-xs font-bold ${
                    kpi.isPositive ? 'text-emerald-600' : 'text-amber-600'
                  }`}
                >
                  {kpi.isPositive ? (
                    <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />
                  ) : (
                    <ArrowDownRight className="h-3.5 w-3.5 mr-0.5" />
                  )}
                  {kpi.trend}
                </div>
              </div>

              <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                <span>{kpi.subtext}</span>
                <span className="text-[#931B58] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 font-medium">
                  View <ChevronRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Main Grid: Analytics Chart + Quick Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Analytics Chart (2 Columns) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="h-4.5 w-4.5 text-[#931B58]" />
                Media Impressions & Engagement
              </h2>
              <p className="text-xs text-slate-500">
                Aggregated audience reach across Instagram, TikTok, YouTube, and LinkedIn
              </p>
            </div>

            {/* Time range switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              {(['7D', '30D', '90D', '1Y'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setTimeRange(r)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                    timeRange === r
                      ? 'bg-white text-[#931B58] shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Recharts Area Chart */}
          <div className="h-72 w-full pt-2">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="berryGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#931B58" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#931B58" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="roseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                      border: '1px solid #f1f5f9',
                      fontSize: '12px',
                    }}
                    formatter={(value: any, name: any) => [
                      Number(value).toLocaleString(),
                      name === 'impressions' ? 'Impressions' : 'Engagement',
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="impressions"
                    stroke="#931B58"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#berryGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="engagement"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#roseGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center text-xs text-slate-400">
                Loading analytics...
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-6 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#931B58]" />
              <span className="text-slate-600 font-medium">Total Impressions</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
              <span className="text-slate-600 font-medium">Audience Engagement</span>
            </div>
          </div>
        </div>

        {/* Quick Tasks List (1 Column) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-[#931B58]" />
                <h2 className="text-base font-bold text-slate-900">Quick Tasks</h2>
              </div>
              <Link
                href="/tasks"
                className="text-xs font-semibold text-[#931B58] hover:underline"
              >
                View all
              </Link>
            </div>

            <p className="text-xs text-slate-500">
              Interactive checklist. Click checkbox to toggle completion.
            </p>

            <div className="space-y-2.5 mt-2">
              {tasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTaskCompletion(task.id)}
                  className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                    task.completed
                      ? 'bg-slate-50 border-slate-200/60 opacity-60'
                      : 'bg-white border-slate-200 hover:border-[#931B58]/40 hover:shadow-sm'
                  }`}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTaskCompletion(task.id);
                    }}
                    className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                      task.completed
                        ? 'bg-[#931B58] border-[#931B58] text-white'
                        : 'border-slate-300 hover:border-[#931B58]'
                    }`}
                  >
                    {task.completed && <CheckCircle2 className="h-3.5 w-3.5" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-xs font-semibold text-slate-800 leading-snug ${
                        task.completed ? 'line-through text-slate-400' : ''
                      }`}
                    >
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                        {task.clientName}
                      </span>
                      <span
                        className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${
                          task.priority === 'high'
                            ? 'bg-rose-100 text-rose-700'
                            : task.priority === 'medium'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveModal('add_task')}
            className="w-full mt-4 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold rounded-xl border border-dashed border-[#931B58]/40 text-[#931B58] hover:bg-[#931B58]/5 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add New Editorial Task</span>
          </button>
        </div>
      </div>

      {/* Secondary Grid: Recent Activity Feed & Channels Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity Feed */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="h-4.5 w-4.5 text-[#931B58]" />
              Recent Studio Activity
            </h2>
            <span className="text-xs text-slate-400">Live feed</span>
          </div>

          <div className="mt-4 space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-800">
                  Maya Lin uploaded final cut for &ldquo;Autumn Campaign Video Reel&rdquo;
                </p>
                <p className="text-[11px] text-slate-500">Client: Aura Cosmetics Global • 15m ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <DollarSign className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-800">
                  Payment settled: $12,000.00 via ACH Wire
                </p>
                <p className="text-[11px] text-slate-500">From: Nexus Robotics AI • 2h ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-800">
                  Urgent ticket #TCK-2026-081 opened regarding color grading
                </p>
                <p className="text-[11px] text-slate-500">From: Eleanor Vance • 3h ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-[#931B58]/10 text-[#931B58] flex items-center justify-center shrink-0">
                <Users className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-800">
                  New client contract signed: Veloce Cinema Productions
                </p>
                <p className="text-[11px] text-slate-500">Trial Tier • Milan, Italy • Yesterday</p>
              </div>
            </div>
          </div>
        </div>

        {/* Channels Overview */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Share2 className="h-4.5 w-4.5 text-[#931B58]" />
              Managed Channels Reach
            </h2>
            <Link href="/accounts" className="text-xs font-semibold text-[#931B58] hover:underline">
              View accounts
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3.5">
            <div className="p-4 rounded-xl bg-gradient-to-br from-pink-50 to-rose-50/50 border border-pink-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-pink-700">Instagram</span>
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
              </div>
              <p className="text-xl font-bold text-slate-900 mt-2">1.1M</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Total Followers Across 4 Brands</p>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900/5 to-slate-900/10 border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">TikTok</span>
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
              </div>
              <p className="text-xl font-bold text-slate-900 mt-2">1.4M</p>
              <p className="text-[11px] text-slate-500 mt-0.5">High Engagement Viral Hooks</p>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-red-50 to-rose-50/50 border border-red-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-600">YouTube</span>
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
              </div>
              <p className="text-xl font-bold text-slate-900 mt-2">380K</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Subscribers & Long-form Reach</p>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-700">LinkedIn & Web</span>
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
              </div>
              <p className="text-xl font-bold text-slate-900 mt-2">124K</p>
              <p className="text-[11px] text-slate-500 mt-0.5">B2B Executives & Investors</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

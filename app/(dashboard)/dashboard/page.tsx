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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useDashboard } from '@/lib/dashboard-context';
import { analyticsDataSets } from '@/lib/mock-data';

const monthlyAdSpendData = [
  { month: 'Jan', spend: 3200 },
  { month: 'Feb', spend: 4500 },
  { month: 'Mar', spend: 4100 },
  { month: 'Apr', spend: 5800 },
  { month: 'May', spend: 6200 },
  { month: 'Jun', spend: 7500 },
  { month: 'Jul', spend: 6900 },
  { month: 'Aug', spend: 8100 },
  { month: 'Sep', spend: 9400 },
  { month: 'Oct', spend: 8800 },
  { month: 'Nov', spend: 10500 },
  { month: 'Dec', spend: 12000 },
];

export default function DashboardPage() {
  const {
    clients,
    tasks,
    tickets,
    accounts,
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
    .filter((t) => t.status === 'paid' || t.status === 'approved')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const kpis = [
    {
      title: 'Total Clients',
      value: totalClientsCount.toString(),
      trend: '+12.5%',
      isPositive: true,
      subtext: 'vs last month',
      icon: Users,
      color: 'text-[#C02586]',
      bgColor: 'bg-[#C02586]/10',
      link: '/clients',
    },
    {
      title: 'Active Accounts',
      value: accounts.length.toString(),
      trend: '+4 connected',
      isPositive: true,
      subtext: 'Meta, Google & TikTok',
      icon: Share2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      link: '/accounts',
    },
    {
      title: 'Active Tasks',
      value: activeTasksCount.toString(),
      trend: '6 due today',
      isPositive: true,
      subtext: 'In editorial queue',
      icon: CheckSquare,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      link: '/tasks',
    },
    {
      title: 'Total Balance',
      value: `$${(totalBalance || 48250).toLocaleString()}`,
      trend: '+8.4%',
      isPositive: true,
      subtext: 'Monthly ad ledger',
      icon: DollarSign,
      color: 'text-[#C02586]',
      bgColor: 'bg-[#C02586]/10',
      link: '/balance',
    },
  ];

  const chartData = analyticsDataSets[timeRange];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time business performance, ad spend analytics, tasks, and client accounts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setActiveModal('add_client')}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all active:scale-95"
          >
            <Users className="h-3.5 w-3.5" />
            <span>+ Add Client</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveModal('add_task')}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-xl bg-berry hover:bg-[#A01E6F] text-white shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>+ Add Task</span>
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
              className="relative overflow-hidden bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">{kpi.title}</span>
                <div className={`p-2.5 rounded-xl ${kpi.bgColor} ${kpi.color}`}>
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
                <span className="text-berry opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 font-medium">
                  View <ChevronRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Charts Grid: Spend Budget Area Chart & Spend on Ads Bar Chart (Figma Board 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Spend Budget (Area Chart) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="h-4.5 w-4.5 text-berry" />
                Spend Budget
              </h2>
              <p className="text-xs text-slate-500">
                Media budget analytics and client spend over time
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
                      ? 'bg-white text-berry shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="berryGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C02586" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#C02586" stopOpacity={0.0} />
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
                    formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Budget Spend']}
                  />
                  <Area
                    type="monotone"
                    dataKey="impressions"
                    stroke="#C02586"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#berryGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center text-xs text-slate-400">
                Loading chart...
              </div>
            )}
          </div>
        </div>

        {/* Chart 2: Spend on Ads (Monthly Bar Chart matching Figma Board 2) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <DollarSign className="h-4.5 w-4.5 text-berry" />
                Spend on Ads
              </h2>
              <p className="text-xs text-slate-500">
                Monthly distribution of advertising spend
              </p>
            </div>
            <span className="text-xs font-bold text-berry bg-berry/10 px-2.5 py-1 rounded-full">
              2024 / 2025
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyAdSpendData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="month"
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
                    tickFormatter={(val) => `$${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                      border: '1px solid #f1f5f9',
                      fontSize: '12px',
                    }}
                    formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Ad Spend']}
                  />
                  <Bar
                    dataKey="spend"
                    fill="#C02586"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center text-xs text-slate-400">
                Loading chart...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Bottom Grid: Quick Tasks List + Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Tasks List */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-berry" />
                <h2 className="text-base font-bold text-slate-900">Quick Tasks</h2>
              </div>
              <Link
                href="/tasks"
                className="text-xs font-semibold text-berry hover:underline"
              >
                View all
              </Link>
            </div>

            <p className="text-xs text-slate-500">
              Click checkbox to toggle editorial task completion.
            </p>

            <div className="space-y-2.5 mt-2">
              {tasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTaskCompletion(task.id)}
                  className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                    task.completed
                      ? 'bg-slate-50 border-slate-200/60 opacity-60'
                      : 'bg-white border-slate-200 hover:border-berry/40 hover:shadow-xs'
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
                        ? 'bg-berry border-berry text-white'
                        : 'border-slate-300 hover:border-berry'
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
                      <span className="text-[10px] text-slate-400 truncate max-w-30">
                        {task.clientName}
                      </span>
                      <span
                        className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
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
            className="w-full mt-4 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold rounded-xl border border-dashed border-berry/40 text-berry hover:bg-berry/5 transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>+ Add Task</span>
          </button>
        </div>

        {/* Recent Studio Activity */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="h-4.5 w-4.5 text-berry" />
              Recent Activity
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
                  Maya Lin finalized cut for &ldquo;Autumn Campaign Video Reel&rdquo;
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
                  Urgent ticket #TCK-2026-081 opened regarding ad creatives
                </p>
                <p className="text-[11px] text-slate-500">From: Eleanor Vance • 3h ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-berry/10 text-berry flex items-center justify-center shrink-0">
                <Users className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-800">
                  New client onboarded: Veloce Cinema Productions
                </p>
                <p className="text-[11px] text-slate-500">Enterprise Tier • Milan, Italy • Yesterday</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

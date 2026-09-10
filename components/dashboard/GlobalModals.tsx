'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  UserPlus,
  CheckSquare,
  LifeBuoy,
  CreditCard,
  Search,
  Building,
  Mail,
  Phone,
  DollarSign,
  Calendar,
  AlertCircle,
  Check,
  ChevronRight,
  User,
} from 'lucide-react';
import { useDashboard } from '@/lib/dashboard-context';

export function GlobalModals() {
  const router = useRouter();
  const {
    activeModal,
    setActiveModal,
    addClient,
    addTask,
    addTicket,
    addTransaction,
    clients,
    tasks,
    tickets,
    teamMembers,
  } = useDashboard();

  // Search Modal state
  const [searchQuery, setSearchQuery] = useState('');

  // Add Client Form state
  const [clientForm, setClientForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    category: 'Fashion & Retail' as const,
    status: 'active' as const,
    retainer: 5000,
    accountsCount: 2,
    location: 'New York, USA',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
  });

  // Add Task Form state
  const [taskForm, setTaskForm] = useState({
    title: '',
    clientName: clients[0]?.company || 'Aura Cosmetics Global',
    category: 'Video Production',
    priority: 'high' as const,
    status: 'pending' as const,
    dueDate: 'Tomorrow, 5:00 PM',
    assigneeName: teamMembers[0]?.name || 'Sarah Jenkins',
  });

  // Add Ticket Form state
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    clientName: clients[0]?.company || 'Aura Cosmetics Global',
    requesterName: 'Sarah Jenkins',
    email: 'client@company.com',
    priority: 'medium' as const,
    status: 'open' as const,
    lastMessage: '',
  });

  // Payout Form state
  const [payoutForm, setPayoutForm] = useState({
    amount: 5000,
    method: 'ACH Wire Transfer',
    note: 'Weekly media creator milestone payment',
  });

  if (!activeModal) return null;

  const handleClose = () => setActiveModal(null);

  // Search Filter
  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredTasks = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredTickets = tickets.filter(
    (tk) =>
      tk.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tk.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tk.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 z-10 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        {/* ======================= SEARCH MODAL ======================= */}
        {activeModal === 'search' && (
          <div>
            <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
              <Search className="h-5 w-5 text-[#931B58]" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search clients, tasks, tickets, reports..."
                className="w-full text-base font-medium text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
              />
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto divide-y divide-slate-100">
              {/* Clients Results */}
              {filteredClients.length > 0 && (
                <div className="pt-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Clients ({filteredClients.length})
                  </p>
                  <div className="space-y-1">
                    {filteredClients.slice(0, 3).map((client) => (
                      <div
                        key={client.id}
                        onClick={() => {
                          handleClose();
                          router.push('/clients');
                        }}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-[#931B58]/10 cursor-pointer group transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={client.avatar}
                            alt={client.name}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                          <div>
                            <p className="text-xs font-semibold text-slate-900 group-hover:text-[#931B58]">
                              {client.company}
                            </p>
                            <p className="text-[10px] text-slate-500">{client.name} • {client.category}</p>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-[#931B58]" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tasks Results */}
              {filteredTasks.length > 0 && (
                <div className="pt-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Tasks ({filteredTasks.length})
                  </p>
                  <div className="space-y-1">
                    {filteredTasks.slice(0, 3).map((task) => (
                      <div
                        key={task.id}
                        onClick={() => {
                          handleClose();
                          router.push('/tasks');
                        }}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-[#931B58]/10 cursor-pointer group transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <CheckSquare className="h-4 w-4 text-emerald-600" />
                          <div>
                            <p className="text-xs font-semibold text-slate-900 group-hover:text-[#931B58]">
                              {task.title}
                            </p>
                            <p className="text-[10px] text-slate-500">{task.clientName} • Due: {task.dueDate}</p>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-[#931B58]" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tickets Results */}
              {filteredTickets.length > 0 && (
                <div className="pt-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Tickets ({filteredTickets.length})
                  </p>
                  <div className="space-y-1">
                    {filteredTickets.slice(0, 3).map((tk) => (
                      <div
                        key={tk.id}
                        onClick={() => {
                          handleClose();
                          router.push('/tickets');
                        }}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-[#931B58]/10 cursor-pointer group transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <LifeBuoy className="h-4 w-4 text-blue-600" />
                          <div>
                            <p className="text-xs font-semibold text-slate-900 group-hover:text-[#931B58]">
                              {tk.ticketNumber}: {tk.subject}
                            </p>
                            <p className="text-[10px] text-slate-500">{tk.clientName} • {tk.status}</p>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-[#931B58]" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredClients.length === 0 &&
                filteredTasks.length === 0 &&
                filteredTickets.length === 0 && (
                  <div className="py-8 text-center text-xs text-slate-400">
                    No results found for &ldquo;{searchQuery}&rdquo;
                  </div>
                )}
            </div>
          </div>
        )}

        {/* ======================= ADD CLIENT MODAL ======================= */}
        {activeModal === 'add_client' && (
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#931B58]/10 text-[#931B58]">
                  <UserPlus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Add New Client</h3>
                  <p className="text-xs text-slate-500">Enter client agency details & monthly budget</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addClient({
                  name: clientForm.name || 'Jane Doe',
                  company: clientForm.company || 'New Studio Corp',
                  email: clientForm.email || 'contact@client.com',
                  phone: clientForm.phone || '+1 (555) 000-0000',
                  category: clientForm.category,
                  status: clientForm.status,
                  retainer: Number(clientForm.retainer) || 5000,
                  accountsCount: Number(clientForm.accountsCount) || 1,
                  location: clientForm.location,
                  avatar: clientForm.avatar,
                });
                handleClose();
              }}
              className="mt-4 space-y-3.5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Person Name
                  </label>
                  <input
                    type="text"
                    required
                    value={clientForm.name}
                    onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                    placeholder="e.g. Eleanor Vance"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#931B58]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Company / Brand Name
                  </label>
                  <input
                    type="text"
                    required
                    value={clientForm.company}
                    onChange={(e) => setClientForm({ ...clientForm, company: e.target.value })}
                    placeholder="e.g. Aura Cosmetics Global"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#931B58]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={clientForm.email}
                    onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                    placeholder="eleanor@auracosmetics.com"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#931B58]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={clientForm.phone}
                    onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                    placeholder="+1 (555) 234-5678"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#931B58]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Industry Category
                  </label>
                  <select
                    value={clientForm.category}
                    onChange={(e) =>
                      setClientForm({ ...clientForm, category: e.target.value as any })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#931B58] bg-white"
                  >
                    <option value="Fashion & Retail">Fashion & Retail</option>
                    <option value="Tech & SaaS">Tech & SaaS</option>
                    <option value="Lifestyle & Travel">Lifestyle & Travel</option>
                    <option value="Finance & Web3">Finance & Web3</option>
                    <option value="Entertainment">Entertainment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Client Status
                  </label>
                  <select
                    value={clientForm.status}
                    onChange={(e) =>
                      setClientForm({ ...clientForm, status: e.target.value as any })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#931B58] bg-white"
                  >
                    <option value="active">Active (Standard Retainer)</option>
                    <option value="vip">VIP Tier</option>
                    <option value="trial">Trial / Proof of Concept</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Monthly Retainer ($ USD)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={clientForm.retainer}
                    onChange={(e) =>
                      setClientForm({ ...clientForm, retainer: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#931B58]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    HQ Location
                  </label>
                  <input
                    type="text"
                    value={clientForm.location}
                    onChange={(e) => setClientForm({ ...clientForm, location: e.target.value })}
                    placeholder="e.g. New York, USA"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#931B58]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-[#931B58] text-white hover:bg-[#7f174d] rounded-xl shadow-sm transition-all active:scale-95"
                >
                  Save & Onboard Client
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ======================= ADD TASK MODAL ======================= */}
        {activeModal === 'add_task' && (
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <CheckSquare className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Create Editorial Task</h3>
                  <p className="text-xs text-slate-500">Assign production or media deliverable</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const matchedUser = teamMembers.find((m) => m.name === taskForm.assigneeName) || teamMembers[0];
                addTask({
                  title: taskForm.title || 'Brand Social Cut',
                  clientName: taskForm.clientName,
                  category: taskForm.category,
                  priority: taskForm.priority,
                  status: taskForm.status,
                  dueDate: taskForm.dueDate,
                  assignee: {
                    name: matchedUser.name,
                    avatar: matchedUser.avatar,
                    role: matchedUser.role,
                  },
                });
                handleClose();
              }}
              className="mt-4 space-y-3.5"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Task Title / Deliverable Name
                </label>
                <input
                  type="text"
                  required
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  placeholder="e.g. Summer Campaign Teaser Reel 4K"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#931B58]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Client
                  </label>
                  <select
                    value={taskForm.clientName}
                    onChange={(e) => setTaskForm({ ...taskForm, clientName: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#931B58] bg-white"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.company}>
                        {c.company}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={taskForm.category}
                    onChange={(e) => setTaskForm({ ...taskForm, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#931B58] bg-white"
                  >
                    <option value="Video Production">Video Production</option>
                    <option value="Motion Design">Motion Design</option>
                    <option value="Graphic Design">Graphic Design</option>
                    <option value="Audio Engineering">Audio Engineering</option>
                    <option value="Editorial & Copy">Editorial & Copy</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) =>
                      setTaskForm({ ...taskForm, priority: e.target.value as any })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#931B58] bg-white"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Assignee
                  </label>
                  <select
                    value={taskForm.assigneeName}
                    onChange={(e) => setTaskForm({ ...taskForm, assigneeName: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#931B58] bg-white"
                  >
                    {teamMembers.map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.name} ({m.role})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="text"
                    value={taskForm.dueDate}
                    onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                    placeholder="e.g. Sep 18, 5:00 PM"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#931B58]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl shadow-sm transition-all active:scale-95"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ======================= ADD TICKET MODAL ======================= */}
        {activeModal === 'add_ticket' && (
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                  <LifeBuoy className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Open Support Ticket</h3>
                  <p className="text-xs text-slate-500">Log an issue, request, or client revision</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addTicket({
                  subject: ticketForm.subject || 'Client Question / Revision',
                  clientName: ticketForm.clientName,
                  requester: {
                    name: ticketForm.requesterName || 'Eleanor Vance',
                    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
                    email: ticketForm.email || 'client@company.com',
                  },
                  priority: ticketForm.priority,
                  status: ticketForm.status,
                  lastMessage: ticketForm.lastMessage || 'Revision details attached.',
                });
                handleClose();
              }}
              className="mt-4 space-y-3.5"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ticket Subject
                </label>
                <input
                  type="text"
                  required
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                  placeholder="e.g. Audio syncing discrepancy on YouTube export"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#931B58]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Related Client
                  </label>
                  <select
                    value={ticketForm.clientName}
                    onChange={(e) => setTicketForm({ ...ticketForm, clientName: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#931B58] bg-white"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.company}>
                        {c.company}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Priority Level
                  </label>
                  <select
                    value={ticketForm.priority}
                    onChange={(e) =>
                      setTicketForm({ ...ticketForm, priority: e.target.value as any })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#931B58] bg-white"
                  >
                    <option value="high">High (Urgent Campaign Release)</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low (General Query)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description / Message Details
                </label>
                <textarea
                  rows={3}
                  required
                  value={ticketForm.lastMessage}
                  onChange={(e) => setTicketForm({ ...ticketForm, lastMessage: e.target.value })}
                  placeholder="Describe the revision, bug, or question in detail..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#931B58]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-xl shadow-sm transition-all active:scale-95"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ======================= REQUEST PAYOUT MODAL ======================= */}
        {activeModal === 'request_payout' && (
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Request Balance Payout</h3>
                  <p className="text-xs text-slate-500">Available to withdraw: $24,850.00 USD</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addTransaction({
                  invoiceNumber: `PAY-${Date.now().toString().slice(-4)}`,
                  clientName: 'Digest Media Treasury Payout',
                  amount: Number(payoutForm.amount) || 5000,
                  status: 'paid',
                  paymentMethod: payoutForm.method,
                  service: payoutForm.note,
                });
                handleClose();
              }}
              className="mt-4 space-y-3.5"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Payout Amount ($ USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 text-xs font-bold">$</span>
                  <input
                    type="number"
                    min="100"
                    max="24850"
                    step="100"
                    required
                    value={payoutForm.amount}
                    onChange={(e) =>
                      setPayoutForm({ ...payoutForm, amount: Number(e.target.value) })
                    }
                    className="w-full pl-7 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#931B58] font-bold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Disbursement Method
                </label>
                <select
                  value={payoutForm.method}
                  onChange={(e) => setPayoutForm({ ...payoutForm, method: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#931B58] bg-white"
                >
                  <option value="ACH Wire Transfer">ACH Wire Transfer (JPMorgan Chase ****4190)</option>
                  <option value="Stripe Instant Payout">Stripe Instant Payout (1.5% fee)</option>
                  <option value="PayPal Business">PayPal Business (finance@digestmedia.co)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Accounting Reference Note
                </label>
                <input
                  type="text"
                  value={payoutForm.note}
                  onChange={(e) => setPayoutForm({ ...payoutForm, note: e.target.value })}
                  placeholder="e.g. Creator payout batch 2026-Q3"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#931B58]"
                />
              </div>

              <div className="rounded-xl bg-amber-50 p-3 border border-amber-200/60 text-[11px] text-amber-800 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <span>Standard ACH transfers settle in 1-2 business days into your primary registered treasury account.</span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-amber-600 text-white hover:bg-amber-700 rounded-xl shadow-sm transition-all active:scale-95"
                >
                  Process Withdrawal
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

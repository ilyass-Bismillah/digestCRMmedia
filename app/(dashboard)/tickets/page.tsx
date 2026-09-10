'use client';

import React, { useState } from 'react';
import {
  LifeBuoy,
  Search,
  Plus,
  Filter,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Send,
  X,
  User,
  Sparkles,
  Upload,
  FileText,
  Trash2,
  Paperclip,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { useDashboard } from '@/lib/dashboard-context';
import { Ticket } from '@/lib/mock-data';

export default function TicketsPage() {
  const { tickets, addTicket, addTicketReply, updateTicketStatus } = useDashboard();

  // Perspective Toggle: Client UI vs Admin UI (Figma Board 4)
  const [uiMode, setUiMode] = useState<'client' | 'admin'>('client');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'in_progress' | 'resolved'>('all');
  const [showEmptyPreview, setShowEmptyPreview] = useState(false);

  // Add Ticket Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState('Campaign Creative');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newMessage, setNewMessage] = useState('');

  // File Upload states (Figma Board 4 showcases: Default, Uploading Progress, Uploaded, Error)
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'uploaded' | 'error'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; url?: string } | null>(null);

  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [replyInput, setReplyInput] = useState('');

  const filteredTickets = tickets.filter((tk) => {
    const matchesSearch =
      tk.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tk.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tk.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tk.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSimulateUpload = (shouldError = false) => {
    setUploadState('uploading');
    setUploadProgress(10);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          if (shouldError) {
            setUploadState('error');
          } else {
            setUploadState('uploaded');
            setUploadedFile({ name: 'creative_asset_revision.mp4', size: '14.2 MB' });
          }
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  const handleRemoveFile = () => {
    setUploadState('idle');
    setUploadedFile(null);
    setUploadProgress(0);
  };

  const handleRealFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      setUploadState('error');
      return;
    }

    setUploadState('uploading');
    setUploadProgress(25);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'tickets');

      setUploadProgress(65);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setUploadProgress(100);
      setUploadState('uploaded');
      setUploadedFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        url: data.publicUrl,
      });
    } catch (err) {
      setUploadState('error');
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim()) return;

    await addTicket({
      subject: newSubject,
      clientName: 'Aura Cosmetics Global',
      category: newCategory,
      priority: newPriority,
      status: 'open',
      requester: {
        name: 'Samantha William',
        email: 'samantha@digestmedia.co',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
      },
      lastMessage: newMessage || newSubject,
    });

    setNewSubject('');
    setNewMessage('');
    setUploadState('idle');
    setUploadedFile(null);
    setIsAddModalOpen(false);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket || !replyInput.trim()) return;

    addTicketReply(activeTicket.id, replyInput);
    setReplyInput('');

    const updated = tickets.find((t) => t.id === activeTicket.id);
    if (updated) {
      setActiveTicket({
        ...updated,
        repliesCount: updated.repliesCount + 1,
        messages: [
          ...updated.messages,
          {
            id: `msg-${Date.now()}`,
            sender: 'Samantha William (Digest Media)',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
            time: 'Just now',
            isStaff: true,
            text: replyInput,
          },
        ],
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Tickets
            </h1>
            {/* Perspective Switcher matching Figma Board 4 */}
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-berry/10 text-berry">
              {uiMode === 'client' ? 'Client UI' : 'Admin UI'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track inquiries, script revisions, technical issues, and billing questions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Dual UI Mode Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setUiMode('client')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                uiMode === 'client'
                  ? 'bg-white text-berry shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Client UI
            </button>
            <button
              type="button"
              onClick={() => setUiMode('admin')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                uiMode === 'admin'
                  ? 'bg-white text-berry shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Admin UI
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowEmptyPreview(!showEmptyPreview)}
            className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            {showEmptyPreview ? 'Show List' : 'Empty State'}
          </button>

          {uiMode === 'client' && (
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-berry hover:bg-[#A01E6F] text-white shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>+ Add Ticket</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tickets by subject, ID, or client..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-berry transition-all"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {(['all', 'open', 'in_progress', 'resolved'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-berry text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'all' ? 'All Tickets' : st === 'in_progress' ? 'In Progress' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State or Table View */}
      {showEmptyPreview || filteredTickets.length === 0 ? (
        /* Empty State matching Figma Board 4 */
        <div className="rounded-2xl bg-white p-12 text-center border border-slate-200/80 shadow-xs">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-berry/10 text-berry ring-8 ring-berry/5">
            <LifeBuoy className="h-10 w-10" />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-900">
            No tickets found
          </h3>
          <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
            You don&apos;t have any open support requests or creative inquiries. Click below to submit a ticket.
          </p>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="mt-6 inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-xl bg-berry hover:bg-[#A01E6F] text-white shadow-sm transition-all cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>+ Add Ticket</span>
          </button>
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Ticket ID</th>
                  <th className="py-3.5 px-4">Subject</th>
                  {uiMode === 'admin' && <th className="py-3.5 px-4">Client</th>}
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Status</th>
                  {uiMode === 'admin' && <th className="py-3.5 px-4">Agent</th>}
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {ticket.ticketNumber}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-xs truncate">
                      {ticket.subject}
                    </td>
                    {uiMode === 'admin' && (
                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {ticket.clientName}
                      </td>
                    )}
                    <td className="py-3.5 px-4 text-slate-500 font-medium">
                      {ticket.category || 'Campaign Creative'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          ticket.priority === 'high'
                            ? 'bg-rose-100 text-rose-700'
                            : ticket.priority === 'medium'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {uiMode === 'admin' ? (
                        <select
                          value={ticket.status}
                          onChange={(e) => updateTicketStatus(ticket.id, e.target.value as any)}
                          className="px-2 py-1 rounded-lg border border-slate-200 bg-white font-semibold text-[11px] text-slate-700"
                        >
                          <option value="open">Open</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      ) : (
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            ticket.status === 'resolved'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : ticket.status === 'in_progress'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {ticket.status === 'in_progress' ? 'In Progress' : ticket.status}
                        </span>
                      )}
                    </td>
                    {uiMode === 'admin' && (
                      <td className="py-3.5 px-4 text-slate-600">
                        {ticket.assignedStaff || 'Samantha W.'}
                      </td>
                    )}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setActiveTicket(ticket)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 font-semibold text-[11px] text-slate-700 transition-colors"
                      >
                        View Thread ({ticket.repliesCount})
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Ticket Modal with 4 File Upload States matching Figma Board 4 */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add Ticket</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              onSubmit={handleCreateTicket}
              className="mt-4 space-y-3.5"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="e.g. Video resolution adjustment for Meta reel"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-berry"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-berry"
                  >
                    <option value="Campaign Creative">Campaign Creative</option>
                    <option value="Ad Spend & Billing">Ad Spend & Billing</option>
                    <option value="Account Integration">Account Integration</option>
                    <option value="General Inquiry">General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-berry"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Message / Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Describe your issue or requested creative adjustment in detail..."
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-berry"
                />
              </div>

              {/* Interactive File Upload Area matching Figma Board 4 */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    File Attachments
                  </label>
                  {/* Buttons to test Figma states */}
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <span className="text-slate-400">Test states:</span>
                    <button
                      type="button"
                      onClick={() => handleSimulateUpload(false)}
                      className="text-berry hover:underline"
                    >
                      Upload
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => handleSimulateUpload(true)}
                      className="text-rose-600 hover:underline"
                    >
                      Error
                    </button>
                  </div>
                </div>

                {uploadState === 'idle' && (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 hover:border-berry/60 rounded-2xl p-5 text-center cursor-pointer bg-slate-50/50 transition-colors"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleRealFileUpload}
                      className="hidden"
                    />
                    <Upload className="h-6 w-6 text-berry mx-auto" />
                    <p className="text-xs font-semibold text-slate-800 mt-1.5">
                      Drag & Drop files or <span className="text-berry">Browse</span>
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">MP4, MOV, PNG, PDF up to 25MB (Cloudflare R2)</p>
                  </div>
                )}

                {uploadState === 'uploading' && (
                  <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-berry" />
                        Uploading creative_asset_revision.mp4
                      </span>
                      <span className="font-bold text-berry">{uploadProgress}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full bg-berry transition-all duration-200 rounded-full"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {uploadState === 'uploaded' && uploadedFile && (
                  <div className="border border-emerald-200 bg-emerald-50/40 rounded-2xl p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <Check className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{uploadedFile.name}</p>
                        <p className="text-[10px] text-slate-500">{uploadedFile.size} • Ready</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                      title="Remove file"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {uploadState === 'error' && (
                  <div className="border border-rose-200 bg-rose-50 rounded-2xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-rose-700">
                        <AlertTriangle className="h-4 w-4" />
                        <span>File upload failed: File size exceeds 25MB limit</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="text-slate-400 hover:text-rose-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-[10px] text-rose-600">
                      Please compress the file or provide an external drive link.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-berry hover:bg-[#A01E6F] rounded-xl shadow-xs cursor-pointer"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ticket Chat / Thread Drawer */}
      {activeTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono font-bold text-berry">
                  {activeTicket.ticketNumber}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">{activeTicket.subject}</h3>
                <p className="text-xs text-slate-500">{activeTicket.clientName} • {activeTicket.category || 'General'}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTicket(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pr-1">
              {activeTicket.messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-3 text-xs ${
                    m.isStaff ? 'flex-row-reverse text-right' : ''
                  }`}
                >
                  <img
                    src={m.avatar}
                    alt={m.sender}
                    className="h-8 w-8 rounded-full object-cover shrink-0 ring-2 ring-slate-100"
                  />
                  <div className={`max-w-[80%] ${m.isStaff ? 'items-end' : ''}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-800 text-[11px]">{m.sender}</span>
                      <span className="text-[10px] text-slate-400">{m.time}</span>
                    </div>
                    <div
                      className={`p-3 rounded-2xl ${
                        m.isStaff
                          ? 'bg-berry text-white rounded-tr-xs text-left'
                          : 'bg-slate-100 text-slate-800 rounded-tl-xs'
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply Form */}
            <form onSubmit={handleSendReply} className="pt-3 border-t border-slate-100 flex items-center gap-2">
              <input
                type="text"
                required
                value={replyInput}
                onChange={(e) => setReplyInput(e.target.value)}
                placeholder="Type response to ticket..."
                className="flex-1 px-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-berry"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-berry hover:bg-[#A01E6F] text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Reply</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

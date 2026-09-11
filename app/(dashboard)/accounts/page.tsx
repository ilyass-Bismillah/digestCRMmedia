'use client';

import React, { useState } from 'react';
import {
  Share2,
  Search,
  Plus,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Globe,
  MoreVertical,
  ExternalLink,
  Users,
  DollarSign,
  FileText,
  CreditCard,
  Upload,
  X,
  MessageSquare,
} from 'lucide-react';
import { FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa';
import { useDashboard } from '@/lib/dashboard-context';

import { SocialAccount } from '@/lib/mock-data';

export default function AccountsPage() {
  const {
    clients,
    accounts,
    addAccount,
    updateAccount,
    deleteAccount,
    addTransaction,
  } = useDashboard();

  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [showEmptyStatePreview, setShowEmptyStatePreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modals state
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [topupAccount, setTopupAccount] = useState<SocialAccount | null>(null);
  const [notesAccount, setNotesAccount] = useState<SocialAccount | null>(null);

  // Topup form state
  const [topupAmount, setTopupAmount] = useState('2500.00');
  const [topupMethod, setTopupMethod] = useState('Bank Transfer');
  const [isUploadingReceipt, setIsUploadingReceipt] = useState(false);
  const [uploadedReceiptUrl, setUploadedReceiptUrl] = useState<string | null>(null);
  const [uploadedReceiptName, setUploadedReceiptName] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Add Note state
  const [newNoteText, setNewNoteText] = useState('');

  // Add account form state
  const [newAccName, setNewAccName] = useState('');
  const [newAccPlatform, setNewAccPlatform] = useState<'Google Ads' | 'Meta Ads' | 'TikTok Ads' | 'LinkedIn Ads'>('Meta Ads');
  const [newAccClient, setNewAccClient] = useState(clients[0]?.company || clients[0]?.name || 'Aura Cosmetics Global');
  const [newAccId, setNewAccId] = useState('');
  const [newAccBalance, setNewAccBalance] = useState(5000);

  const filteredAccounts = accounts.filter((acc) => {
    const accName = acc.name || acc.clientName;
    const accId = acc.accountId || acc.id;
    const matchesSearch =
      accName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      accId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform =
      platformFilter === 'all' || acc.platform.toLowerCase().includes(platformFilter.toLowerCase());
    return matchesSearch && matchesPlatform;
  });

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccName || !newAccId) return;

    setIsSubmitting(true);
    try {
      await addAccount({
        name: newAccName,
        clientName: newAccClient,
        platform: newAccPlatform,
        accountId: newAccId,
        balance: Number(newAccBalance) || 0,
        status: 'active',
        handle: `@${newAccName.toLowerCase().replace(/\s+/g, '')}`,
        followers: '10K',
        engagement: '4.0%',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        notes: [],
      });

      setIsAddAccountModalOpen(false);
      setNewAccName('');
      setNewAccId('');
      setNewAccBalance(5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReceiptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingReceipt(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'receipts');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.publicUrl) {
        setUploadedReceiptUrl(data.publicUrl);
        setUploadedReceiptName(file.name);
      }
    } catch (err) {
      console.warn('Receipt upload failed:', err);
      setUploadedReceiptName(file.name);
    } finally {
      setIsUploadingReceipt(false);
    }
  };

  const handleAddTopup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topupAccount) return;

    setIsSubmitting(true);
    try {
      const addedAmount = parseFloat(topupAmount) || 0;
      await updateAccount(topupAccount.id, {
        balance: (topupAccount.balance || 0) + addedAmount,
      });

      await addTransaction({
        invoiceNumber: `TXN-${Math.floor(10000 + Math.random() * 90000)}-2026`,
        clientName: topupAccount.clientName,
        amount: addedAmount,
        fee: addedAmount * 0.005,
        paymentMethod: topupMethod,
        status: 'approved',
        service: `Ad Spend Topup (${topupAccount.name || topupAccount.platform})`,
        slipUrl: uploadedReceiptUrl || undefined,
      });

      setTopupAccount(null);
      setUploadedReceiptUrl(null);
      setUploadedReceiptName(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notesAccount || !newNoteText.trim()) return;

    setIsSubmitting(true);
    try {
      const newNote = {
        id: `note-${Date.now()}`,
        author: 'Samantha William',
        time: 'Just now',
        text: newNoteText.trim(),
      };

      const updatedNotes = [newNote, ...(notesAccount.notes || [])];
      await updateAccount(notesAccount.id, { notes: updatedNotes });

      setNotesAccount({
        ...notesAccount,
        notes: updatedNotes,
      });
      setNewNoteText('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Accounts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Monitor client advertising profiles, credit balances, top-ups, and notes.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowEmptyStatePreview(!showEmptyStatePreview)}
            className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            {showEmptyStatePreview ? 'Show Accounts Table' : 'Preview Empty State'}
          </button>
          <button
            type="button"
            onClick={() => setIsAddAccountModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-berry hover:bg-[#A01E6F] text-white shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>+ Add Account</span>
          </button>
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
            placeholder="Search account name or ID..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-berry transition-all"
          />
        </div>

        {/* Platform Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {(['all', 'Meta Ads', 'Google Ads', 'TikTok Ads'] as const).map((plt) => (
            <button
              key={plt}
              type="button"
              onClick={() => setPlatformFilter(plt)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                platformFilter === plt
                  ? 'bg-berry text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {plt === 'all' ? 'All Platforms' : plt}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State or Table View */}
      {showEmptyStatePreview || filteredAccounts.length === 0 ? (
        /* Empty State matching Figma Board 2 */
        <div className="rounded-2xl bg-white p-12 text-center border border-slate-200/80 shadow-xs">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-berry/10 text-berry ring-8 ring-berry/5">
            <Share2 className="h-10 w-10" />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-900">
            No accounts connected yet
          </h3>
          <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
            Connect ad managers and social channels to manage daily budgets, top-ups, and notes.
          </p>
          <button
            type="button"
            onClick={() => setIsAddAccountModalOpen(true)}
            className="mt-6 inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-xl bg-berry hover:bg-[#A01E6F] text-white shadow-sm transition-all cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>+ Add Account</span>
          </button>
        </div>
      ) : (
        /* Accounts Table matching Figma Board 2 */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Account Name</th>
                  <th className="py-3.5 px-4">Client</th>
                  <th className="py-3.5 px-4">Platform</th>
                  <th className="py-3.5 px-4">Account ID</th>
                  <th className="py-3.5 px-4">Available Balance</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAccounts.map((acc) => (
                  <tr key={acc.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {acc.name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {acc.clientName}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-800">
                        {acc.platform}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">
                      {acc.accountId}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      ${(acc.balance ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4">
                      {acc.status === 'active' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">
                          Paused
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setTopupAccount(acc)}
                          className="px-2.5 py-1.5 rounded-lg bg-berry/10 hover:bg-berry/20 text-berry font-semibold text-[11px] transition-colors"
                        >
                          + Topup
                        </button>
                        <button
                          type="button"
                          onClick={() => setNotesAccount(acc)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium text-[11px] transition-colors flex items-center gap-1"
                        >
                          <MessageSquare className="h-3 w-3" />
                          <span>Notes ({acc.notes?.length ?? 0})</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Account Modal matching Figma Board 2 */}
      {isAddAccountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Connect New Ad Account</h3>
              <button
                type="button"
                onClick={() => setIsAddAccountModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAccount} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Account Name
                </label>
                <input
                  type="text"
                  required
                  value={newAccName}
                  onChange={(e) => setNewAccName(e.target.value)}
                  placeholder="e.g. Brand X - Winter Conversions"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-berry"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Advertising Platform
                </label>
                <select
                  value={newAccPlatform}
                  onChange={(e) => setNewAccPlatform(e.target.value as any)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-berry"
                >
                  <option value="Meta Ads">Meta Ads (Facebook & Instagram)</option>
                  <option value="Google Ads">Google Ads (Search & YouTube)</option>
                  <option value="TikTok Ads">TikTok Ads</option>
                  <option value="LinkedIn Ads">LinkedIn Ads</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assign to Client
                </label>
                <select
                  value={newAccClient}
                  onChange={(e) => setNewAccClient(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-berry"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Account ID / Token
                </label>
                <input
                  type="text"
                  required
                  value={newAccId}
                  onChange={(e) => setNewAccId(e.target.value)}
                  placeholder="e.g. ACT-84920-META"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-berry"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Initial Ad Credit ($)
                </label>
                <input
                  type="number"
                  value={newAccBalance}
                  onChange={(e) => setNewAccBalance(Number(e.target.value))}
                  placeholder="5000"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-berry"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddAccountModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-berry hover:bg-[#A01E6F] rounded-xl shadow-xs"
                >
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Topup Modal matching Figma Board 2 */}
      {topupAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Add Topup</h3>
                <p className="text-xs text-slate-500">{topupAccount.name} ({topupAccount.accountId})</p>
              </div>
              <button
                type="button"
                onClick={() => setTopupAccount(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddTopup} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Topup Amount ($)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={topupAmount}
                    onChange={(e) => setTopupAmount(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 text-sm font-bold text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-berry"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Payment Method
                </label>
                <select
                  value={topupMethod}
                  onChange={(e) => setTopupMethod(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-berry"
                >
                  <option value="Bank Transfer">Bank Transfer (ACH / Wire)</option>
                  <option value="Credit Card">Corporate Credit Card (Stripe)</option>
                  <option value="Client Balance">Deduct from Retainer Balance</option>
                </select>
              </div>

              {/* Receipt / Proof dropzone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Payment Receipt / Slip (Optional)
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleReceiptUpload}
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-4 text-center transition-colors cursor-pointer ${
                    uploadedReceiptName
                      ? 'border-emerald-300 bg-emerald-50/50'
                      : 'border-slate-200 hover:border-berry/50 bg-slate-50/50'
                  }`}
                >
                  {isUploadingReceipt ? (
                    <div className="flex flex-col items-center justify-center py-1">
                      <RefreshCw className="h-6 w-6 text-berry animate-spin" />
                      <p className="text-xs font-medium text-slate-600 mt-1">Uploading to Cloudflare R2...</p>
                    </div>
                  ) : uploadedReceiptName ? (
                    <div className="flex items-center justify-center gap-2 py-1">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      <span className="text-xs font-semibold text-emerald-800 truncate max-w-xs">{uploadedReceiptName}</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-6 w-6 text-slate-400 mx-auto" />
                      <p className="text-xs font-semibold text-slate-700 mt-1">Upload wire receipt to Cloudflare R2</p>
                      <p className="text-[10px] text-slate-400">PDF, PNG or JPG up to 10MB</p>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setTopupAccount(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-semibold text-white bg-berry hover:bg-[#A01E6F] rounded-xl shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Submit Topup'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / View Notes Modal matching Figma Board 2 */}
      {notesAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Account Notes</h3>
                <p className="text-xs text-slate-500">{notesAccount.name} ({notesAccount.platform})</p>
              </div>
              <button
                type="button"
                onClick={() => setNotesAccount(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Notes List */}
            <div className="mt-4 max-h-60 overflow-y-auto space-y-3">
              {(notesAccount.notes || []).length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">No notes added to this account yet.</p>
              ) : (
                (notesAccount.notes || []).map((n) => (
                  <div key={n.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="flex items-center justify-between font-semibold text-slate-800 mb-1">
                      <span>{n.author}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{n.time}</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{n.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Add Note Form */}
            <form onSubmit={handleAddNote} className="mt-4 pt-4 border-t border-slate-100 space-y-3">
              <label className="block text-xs font-semibold text-slate-700">Add New Note</label>
              <textarea
                required
                rows={3}
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Type note regarding spend limit, creative feedback, or strategy..."
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-berry"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNotesAccount(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-berry hover:bg-[#A01E6F] rounded-xl shadow-xs"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

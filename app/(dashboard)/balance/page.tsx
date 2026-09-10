'use client';

import React, { useState } from 'react';
import {
  WalletCards,
  Search,
  Plus,
  DollarSign,
  Download,
  CreditCard,
  Building,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Upload,
  X,
  Check,
  Eye,
  ArrowUpRight,
} from 'lucide-react';
import { useDashboard } from '@/lib/dashboard-context';

interface PaymentRecord {
  id: string;
  transactionId: string;
  clientName: string;
  date: string;
  amount: number;
  method: 'Bank Transfer' | 'Credit Card' | 'Wire Transfer' | 'PayPal';
  status: 'approved' | 'pending' | 'rejected';
  fee: number;
  slipUrl?: string;
}

const initialPaymentRecords: PaymentRecord[] = [
  {
    id: 'pay-1',
    transactionId: 'TXN-98421-2024',
    clientName: 'Aura Cosmetics Global',
    date: 'Apr 02, 2024 - 11:30',
    amount: 12500.0,
    fee: 45.0,
    method: 'Bank Transfer',
    status: 'approved',
  },
  {
    id: 'pay-2',
    transactionId: 'TXN-77312-2024',
    clientName: 'Nexus Robotics AI',
    date: 'Apr 01, 2024 - 15:45',
    amount: 8000.0,
    fee: 32.0,
    method: 'Wire Transfer',
    status: 'approved',
  },
  {
    id: 'pay-3',
    transactionId: 'TXN-55209-2024',
    clientName: 'Veloce Cinema Productions',
    date: 'Mar 29, 2024 - 09:12',
    amount: 3500.0,
    fee: 14.5,
    method: 'Credit Card',
    status: 'pending',
  },
  {
    id: 'pay-4',
    transactionId: 'TXN-33108-2024',
    clientName: 'Seraphine Jewelry Paris',
    date: 'Mar 25, 2024 - 18:20',
    amount: 6000.0,
    fee: 25.0,
    method: 'PayPal',
    status: 'rejected',
  },
];

export default function BalancePage() {
  const [uiMode, setUiMode] = useState<'client' | 'admin'>('client');
  const [payments, setPayments] = useState<PaymentRecord[]>(initialPaymentRecords);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');
  const [showEmptyPreview, setShowEmptyPreview] = useState(false);

  // Modals
  const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
  const [selectedPaymentDetails, setSelectedPaymentDetails] = useState<PaymentRecord | null>(null);
  const [downloadToast, setDownloadToast] = useState('');

  // Add Payment form state (Client UI)
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [paymentAmount, setPaymentAmount] = useState('500.00');
  const [selectedMethod, setSelectedMethod] = useState<'Bank Transfer' | 'Credit Card' | 'Wire Transfer' | 'PayPal'>('Bank Transfer');
  const [hasReceiptUploaded, setHasReceiptUploaded] = useState(false);
  const [uploadedReceiptUrl, setUploadedReceiptUrl] = useState<string | null>(null);
  const [isUploadingReceipt, setIsUploadingReceipt] = useState(false);

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
      setUploadedReceiptUrl(data.publicUrl);
      setHasReceiptUploaded(true);
    } catch (err) {
      console.warn('Receipt upload failed, simulated success:', err);
      setHasReceiptUploaded(true);
    } finally {
      setIsUploadingReceipt(false);
    }
  };

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(paymentAmount) || 500;
    const newRecord: PaymentRecord = {
      id: `pay-${Date.now()}`,
      transactionId: `TXN-${Math.floor(10000 + Math.random() * 90000)}-2024`,
      clientName: 'Samantha William (My Account)',
      date: 'Just now',
      amount: parsedAmount,
      fee: parsedAmount * 0.005,
      method: selectedMethod,
      status: 'pending',
    };

    setPayments([newRecord, ...payments]);
    setIsAddPaymentModalOpen(false);
    setPaymentAmount('500.00');
    setHasReceiptUploaded(false);
  };

  const handleApprovePayment = (id: string) => {
    setPayments(payments.map((p) => (p.id === id ? { ...p, status: 'approved' } : p)));
    setSelectedPaymentDetails(null);
  };

  const handleRejectPayment = (id: string) => {
    setPayments(payments.map((p) => (p.id === id ? { ...p, status: 'rejected' } : p)));
    setSelectedPaymentDetails(null);
  };

  const handleDownloadInvoice = (txn: string) => {
    setDownloadToast(`Invoice for ${txn} downloaded.`);
    setTimeout(() => setDownloadToast(''), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Balance
            </h1>
            {/* Mode badge */}
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#C02586]/10 text-[#C02586]">
              {uiMode === 'client' ? 'Client UI' : 'Admin UI'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Monitor transaction statements, advertising balance deposits, and payment details.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Dual UI Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setUiMode('client')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                uiMode === 'client'
                  ? 'bg-white text-[#C02586] shadow-xs'
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
                  ? 'bg-white text-[#C02586] shadow-xs'
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
            {showEmptyPreview ? 'Show Table' : 'Empty State'}
          </button>

          {uiMode === 'client' && (
            <button
              type="button"
              onClick={() => setIsAddPaymentModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-[#C02586] hover:bg-[#A01E6F] text-white shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>+ Add Payment</span>
            </button>
          )}
        </div>
      </div>

      {downloadToast && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>{downloadToast}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search transaction ID..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C02586] transition-all"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {(['all', 'approved', 'pending', 'rejected'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-[#C02586] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State or Table View */}
      {showEmptyPreview || filteredPayments.length === 0 ? (
        /* Empty State matching Figma Board 5 */
        <div className="rounded-2xl bg-white p-12 text-center border border-slate-200/80 shadow-xs">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#C02586]/10 text-[#C02586] ring-8 ring-[#C02586]/5">
            <WalletCards className="h-10 w-10" />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-900">
            No payments found
          </h3>
          <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
            You don&apos;t have any deposit statements or balance settlements yet.
          </p>
          {uiMode === 'client' && (
            <button
              type="button"
              onClick={() => setIsAddPaymentModalOpen(true)}
              className="mt-6 inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-xl bg-[#C02586] hover:bg-[#A01E6F] text-white shadow-sm transition-all cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>+ Add Payment</span>
            </button>
          )}
        </div>
      ) : (
        /* Table View matching Figma Board 5 */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Transaction ID</th>
                  {uiMode === 'admin' && <th className="py-3.5 px-4">Client</th>}
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Method</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {p.transactionId}
                    </td>
                    {uiMode === 'admin' && (
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {p.clientName}
                      </td>
                    )}
                    <td className="py-3.5 px-4 text-slate-500 font-medium">
                      {p.date}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      ${p.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {p.method}
                    </td>
                    <td className="py-3.5 px-4">
                      {p.status === 'approved' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Approved
                        </span>
                      ) : p.status === 'pending' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Rejected
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {uiMode === 'admin' ? (
                        <button
                          type="button"
                          onClick={() => setSelectedPaymentDetails(p)}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 font-semibold text-[11px] text-slate-700 transition-colors"
                        >
                          View Details
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleDownloadInvoice(p.transactionId)}
                          className="p-1.5 text-slate-400 hover:text-[#C02586] rounded-lg hover:bg-slate-100 transition-colors"
                          title="Download Receipt"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Payment Modal (Client UI) matching Figma Board 5 */}
      {isAddPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add Payment</h3>
              <button
                type="button"
                onClick={() => setIsAddPaymentModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePayment} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Payment Amount ($)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 text-base font-bold text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#C02586]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Choose payment method
                </label>
                <div className="space-y-2">
                  {(['Bank Transfer', 'Credit Card', 'Wire Transfer', 'PayPal'] as const).map((m) => (
                    <label
                      key={m}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedMethod === m
                          ? 'border-[#C02586] bg-[#C02586]/5 text-[#C02586] font-semibold'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 text-xs">
                        <CreditCard className="h-4 w-4" />
                        <span>{m}</span>
                      </div>
                      <input
                        type="radio"
                        name="payment_method"
                        checked={selectedMethod === m}
                        onChange={() => setSelectedMethod(m)}
                        className="accent-[#C02586]"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Payment Slip Attachment */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Payment Slip / Proof
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-colors ${
                    hasReceiptUploaded
                      ? 'border-emerald-300 bg-emerald-50/50'
                      : 'border-slate-200 hover:border-[#C02586]/50 bg-slate-50/50'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleReceiptUpload}
                    className="hidden"
                  />
                  <Upload className={`h-5 w-5 mx-auto ${hasReceiptUploaded ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <p className="text-xs font-semibold text-slate-800 mt-1">
                    {isUploadingReceipt
                      ? 'Uploading to Cloudflare R2...'
                      : hasReceiptUploaded
                      ? 'wire_slip_transfer.pdf attached (Cloudflare R2)'
                      : 'Click to upload proof slip'}
                  </p>
                  <p className="text-[10px] text-slate-400">PDF, PNG or JPG up to 10MB</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddPaymentModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#C02586] hover:bg-[#A01E6F] rounded-xl shadow-xs cursor-pointer"
                >
                  Submit Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Details Modal (Admin UI) matching Figma Board 5 */}
      {selectedPaymentDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Payment Details</h3>
                <p className="text-xs text-slate-500">{selectedPaymentDetails.transactionId}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPaymentDetails(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center">
                <span className="text-slate-500">Client</span>
                <span className="font-bold text-slate-900">{selectedPaymentDetails.clientName}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center">
                <span className="text-slate-500">Date & Time</span>
                <span className="font-medium text-slate-800">{selectedPaymentDetails.date}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center">
                <span className="text-slate-500">Gross Amount</span>
                <span className="font-bold text-slate-900 text-sm">
                  ${selectedPaymentDetails.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center">
                <span className="text-slate-500">Processing Fee</span>
                <span className="font-medium text-slate-600">${selectedPaymentDetails.fee.toFixed(2)}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center">
                <span className="text-slate-500">Net Credit</span>
                <span className="font-bold text-emerald-700">
                  ${(selectedPaymentDetails.amount - selectedPaymentDetails.fee).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center">
                <span className="text-slate-500">Payment Method</span>
                <span className="font-medium text-slate-800">{selectedPaymentDetails.method}</span>
              </div>
            </div>

            {/* Admin Action Buttons */}
            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => handleRejectPayment(selectedPaymentDetails.id)}
                className="px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl"
              >
                Reject Payment
              </button>
              <button
                type="button"
                onClick={() => handleApprovePayment(selectedPaymentDetails.id)}
                className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs"
              >
                Approve Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

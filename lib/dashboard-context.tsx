'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Client,
  Task,
  Ticket,
  SocialAccount,
  Transaction,
  TeamMember,
  NotificationItem,
  initialClients,
  initialTasks,
  initialTickets,
  initialAccounts,
  initialTransactions,
  initialTeamMembers,
  initialNotifications,
} from './mock-data';
import {
  fetchClients,
  createClientRecord,
  updateClientRecord,
  deleteClientRecord,
  fetchTasks,
  createTaskRecord,
  updateTaskStatusRecord,
  toggleTaskCompletionRecord,
  deleteTaskRecord,
  fetchTickets,
  createTicketRecord,
  addTicketMessageRecord,
  updateTicketStatusRecord,
  deleteTicketRecord,
  fetchAccounts,
  createAccountRecord,
  updateAccountRecord,
  deleteAccountRecord,
  fetchTransactions,
  createTransactionRecord,
  updateTransactionStatusRecord,
  deleteTransactionRecord,
  fetchNotifications,
  markNotificationAsReadRecord,
  markAllNotificationsAsReadRecord,
} from './services/database';
import { useAuth } from './auth-context';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface DashboardContextType {
  clients: Client[];
  tasks: Task[];
  tickets: Ticket[];
  accounts: SocialAccount[];
  transactions: Transaction[];
  teamMembers: TeamMember[];
  notifications: NotificationItem[];
  isLoading: boolean;
  
  // Client Actions
  addClient: (client: Omit<Client, 'id' | 'joinedDate'>) => Promise<void>;
  updateClient: (id: string, client: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  
  // Task Actions
  addTask: (task: Omit<Task, 'id' | 'completed'>) => Promise<void>;
  toggleTaskCompletion: (id: string) => Promise<void>;
  updateTaskStatus: (id: string, status: Task['status']) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  
  // Ticket Actions
  addTicket: (ticket: Omit<Ticket, 'id' | 'ticketNumber' | 'createdAt' | 'repliesCount' | 'messages'>) => Promise<void>;
  addTicketReply: (ticketId: string, replyText: string, attachmentUrl?: string) => Promise<void>;
  updateTicketStatus: (ticketId: string, status: Ticket['status']) => Promise<void>;
  deleteTicket: (ticketId: string) => Promise<void>;
  
  // Account Actions
  addAccount: (account: Omit<SocialAccount, 'id' | 'lastSync'>) => Promise<void>;
  updateAccount: (id: string, updates: Partial<SocialAccount>) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
  
  // Transaction Actions
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => Promise<void>;
  updateTransactionStatus: (id: string, status: 'approved' | 'pending' | 'rejected' | 'paid' | 'overdue') => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  
  // Notification Actions
  markAllNotificationsAsRead: () => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
  
  // Toast System
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  
  // UI Global Modals
  activeModal: 'add_client' | 'add_task' | 'add_ticket' | 'add_account' | 'request_payout' | 'search' | null;
  setActiveModal: (modal: 'add_client' | 'add_task' | 'add_ticket' | 'add_account' | 'request_payout' | 'search' | null) => void;
  
  // Mobile navigation
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const [clients, setClients] = useState<Client[]>(initialClients);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [accounts, setAccounts] = useState<SocialAccount[]>(initialAccounts);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [teamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [isLoading, setIsLoading] = useState(true);

  // Toast notifications state
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const [activeModal, setActiveModal] = useState<'add_client' | 'add_task' | 'add_ticket' | 'add_account' | 'request_payout' | 'search' | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Data Hydration from Supabase (with RBAC role & user filtering)
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      try {
        const [c, t, tk, a, tx, n] = await Promise.all([
          fetchClients(user?.role, user?.id),
          fetchTasks(user?.role, user?.id),
          fetchTickets(user?.role, user?.id),
          fetchAccounts(user?.role, user?.id),
          fetchTransactions(user?.role, user?.id),
          fetchNotifications(user?.id),
        ]);

        if (isMounted) {
          if (c) setClients(c);
          if (t) setTasks(t);
          if (tk) setTickets(tk);
          if (a) setAccounts(a);
          if (tx) setTransactions(tx);
          if (n) setNotifications(n);
        }
      } catch (err) {
        console.warn('Dashboard data loading error, relying on mock dataset:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [user?.role, user?.id]);

  // Keyboard shortcut Ctrl+K / Cmd+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setActiveModal((prev) => (prev === 'search' ? null : 'search'));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --------------------------------------------------------------------------
  // CLIENT ACTIONS
  // --------------------------------------------------------------------------
  const addClient = async (clientData: Omit<Client, 'id' | 'joinedDate'>) => {
    const tempId = `cli-${Date.now()}`;
    const optimisticClient: Client = {
      ...clientData,
      id: tempId,
      joinedDate: 'Today',
    };
    setClients((prev) => [optimisticClient, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'New Client Onboarded',
        description: `${optimisticClient.company} (${optimisticClient.name}) was successfully added.`,
        time: 'Just now',
        unread: true,
        type: 'system',
        link: '/clients',
      },
      ...prev,
    ]);

    showToast(`Client "${optimisticClient.name}" created successfully!`, 'success');

    const created = await createClientRecord(clientData, user?.id);
    if (created) {
      setClients((prev) => prev.map((c) => (c.id === tempId ? created : c)));
    }
  };

  const updateClient = async (id: string, updatedFields: Partial<Client>) => {
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedFields } : c))
    );
    showToast('Client details updated!', 'success');
    await updateClientRecord(id, updatedFields);
  };

  const deleteClient = async (id: string) => {
    const target = clients.find((c) => c.id === id);
    setClients((prev) => prev.filter((c) => c.id !== id));
    showToast(`Client "${target?.name || 'record'}" removed.`, 'info');
    await deleteClientRecord(id);
  };

  // --------------------------------------------------------------------------
  // TASK ACTIONS
  // --------------------------------------------------------------------------
  const addTask = async (taskData: Omit<Task, 'id' | 'completed'>) => {
    const tempId = `tsk-${Date.now()}`;
    const newTask: Task = {
      ...taskData,
      id: tempId,
      completed: false,
    };
    setTasks((prev) => [newTask, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'New Task Created',
        description: `"${newTask.title}" assigned to ${newTask.assignee.name}.`,
        time: 'Just now',
        unread: true,
        type: 'task',
        link: '/tasks',
      },
      ...prev,
    ]);

    showToast(`Task "${newTask.title}" scheduled!`, 'success');

    const created = await createTaskRecord(taskData, user?.id);
    if (created) {
      setTasks((prev) => prev.map((t) => (t.id === tempId ? created : t)));
    }
  };

  const toggleTaskCompletion = async (id: string) => {
    let nextVal = false;
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          nextVal = !t.completed;
          return {
            ...t,
            completed: nextVal,
            status: nextVal ? 'completed' : 'in_progress',
          };
        }
        return t;
      })
    );
    showToast(nextVal ? 'Task completed! 🎉' : 'Task reopened in progress.', 'info');
    await toggleTaskCompletionRecord(id, nextVal);
  };

  const updateTaskStatus = async (id: string, status: Task['status']) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status,
              completed: status === 'completed',
            }
          : t
      )
    );
    showToast(`Task status updated to ${status.replace('_', ' ')}.`, 'success');
    await updateTaskStatusRecord(id, status);
  };

  const deleteTask = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    showToast('Task removed from queue.', 'info');
    await deleteTaskRecord(id);
  };

  // --------------------------------------------------------------------------
  // TICKET ACTIONS
  // --------------------------------------------------------------------------
  const addTicket = async (
    ticketData: Omit<Ticket, 'id' | 'ticketNumber' | 'createdAt' | 'repliesCount' | 'messages'>
  ) => {
    const tempId = `tck-${Date.now()}`;
    const ticketNum = `TCK-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newTicket: Ticket = {
      ...ticketData,
      id: tempId,
      ticketNumber: ticketNum,
      createdAt: 'Just now',
      repliesCount: 1,
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: ticketData.requester.name,
          avatar: ticketData.requester.avatar,
          time: 'Just now',
          isStaff: false,
          text: ticketData.lastMessage,
        },
      ],
    };
    setTickets((prev) => [newTicket, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'New Support Ticket',
        description: `Ticket ${ticketNum} opened by ${newTicket.requester.name}.`,
        time: 'Just now',
        unread: true,
        type: 'ticket',
        link: '/tickets',
      },
      ...prev,
    ]);

    showToast(`Ticket ${ticketNum} submitted!`, 'success');

    const created = await createTicketRecord(ticketData, user?.id);
    if (created) {
      setTickets((prev) => prev.map((t) => (t.id === tempId ? created : t)));
    }
  };

  const addTicketReply = async (ticketId: string, replyText: string, attachmentUrl?: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const newMsg = {
            id: `msg-${Date.now()}`,
            sender: user?.name ? `${user.name} (${user.role === 'admin' ? 'Digest Media' : 'Client'})` : 'Samantha William (Digest Media)',
            avatar: user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
            time: 'Just now',
            isStaff: user?.role === 'admin',
            text: replyText,
          };
          return {
            ...t,
            lastMessage: replyText,
            repliesCount: t.repliesCount + 1,
            status: t.status === 'open' ? 'in_progress' : t.status,
            messages: [...t.messages, newMsg],
          };
        }
        return t;
      })
    );
    showToast('Reply posted to ticket.', 'success');
    await addTicketMessageRecord(
      ticketId,
      replyText,
      user?.name || 'Digest Media Staff',
      user?.role === 'admin',
      attachmentUrl
    );
  };

  const updateTicketStatus = async (ticketId: string, status: Ticket['status']) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status } : t))
    );
    showToast(`Ticket marked as ${status}.`, 'info');
    await updateTicketStatusRecord(ticketId, status);
  };

  const deleteTicket = async (ticketId: string) => {
    setTickets((prev) => prev.filter((t) => t.id !== ticketId));
    showToast('Ticket closed and removed.', 'info');
    await deleteTicketRecord(ticketId);
  };

  // --------------------------------------------------------------------------
  // ACCOUNT ACTIONS
  // --------------------------------------------------------------------------
  const addAccount = async (accountData: Omit<SocialAccount, 'id' | 'lastSync'>) => {
    const tempId = `acc-${Date.now()}`;
    const newAccount: SocialAccount = {
      ...accountData,
      id: tempId,
      lastSync: 'Just now',
    };
    setAccounts((prev) => [newAccount, ...prev]);
    showToast(`Platform account @${newAccount.handle} connected!`, 'success');

    const created = await createAccountRecord(accountData, user?.id);
    if (created) {
      setAccounts((prev) => prev.map((a) => (a.id === tempId ? created : a)));
    }
  };

  const updateAccount = async (id: string, updates: Partial<SocialAccount>) => {
    setAccounts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
    showToast('Account details updated.', 'success');
    await updateAccountRecord(id, updates);
  };

  const deleteAccount = async (id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
    showToast('Account disconnected.', 'info');
    await deleteAccountRecord(id);
  };

  // --------------------------------------------------------------------------
  // TRANSACTION ACTIONS
  // --------------------------------------------------------------------------
  const addTransaction = async (txData: Omit<Transaction, 'id' | 'date'>) => {
    const tempId = `tx-${Date.now()}`;
    const newTx: Transaction = {
      ...txData,
      id: tempId,
      date: 'Today',
    };
    setTransactions((prev) => [newTx, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Billing Transaction Recorded',
        description: `Invoice ${newTx.invoiceNumber} for $${newTx.amount.toLocaleString()} has been recorded.`,
        time: 'Just now',
        unread: true,
        type: 'billing',
        link: '/balance',
      },
      ...prev,
    ]);

    showToast(`Deposit of $${newTx.amount.toLocaleString()} recorded!`, 'success');

    const created = await createTransactionRecord(txData, user?.id);
    if (created) {
      setTransactions((prev) => prev.map((t) => (t.id === tempId ? created : t)));
    }
  };

  const updateTransactionStatus = async (
    id: string,
    status: 'approved' | 'pending' | 'rejected' | 'paid' | 'overdue'
  ) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
    showToast(`Transaction updated to ${status}.`, 'info');
    await updateTransactionStatusRecord(id, status);
  };

  const deleteTransaction = async (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    showToast('Transaction record deleted.', 'info');
    await deleteTransactionRecord(id);
  };

  // --------------------------------------------------------------------------
  // NOTIFICATION ACTIONS
  // --------------------------------------------------------------------------
  const markAllNotificationsAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    await markAllNotificationsAsReadRecord(user?.id);
  };

  const markNotificationAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
    await markNotificationAsReadRecord(id);
  };

  return (
    <DashboardContext.Provider
      value={{
        clients,
        tasks,
        tickets,
        accounts,
        transactions,
        teamMembers,
        notifications,
        isLoading,
        addClient,
        updateClient,
        deleteClient,
        addTask,
        toggleTaskCompletion,
        updateTaskStatus,
        deleteTask,
        addTicket,
        addTicketReply,
        updateTicketStatus,
        deleteTicket,
        addAccount,
        updateAccount,
        deleteAccount,
        addTransaction,
        updateTransactionStatus,
        deleteTransaction,
        markAllNotificationsAsRead,
        markNotificationAsRead,
        showToast,
        activeModal,
        setActiveModal,
        mobileSidebarOpen,
        setMobileSidebarOpen,
      }}
    >
      {children}

      {/* Floating Animated Toast Notifications Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-2xl shadow-xl border backdrop-blur-md animate-in slide-in-from-bottom-3 duration-200 ${
              toast.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-100 border-emerald-800'
                : toast.type === 'error'
                ? 'bg-rose-950/90 text-rose-100 border-rose-800'
                : 'bg-slate-900/90 text-slate-100 border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2.5 text-xs font-semibold">
              {toast.type === 'success' && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />}
              {toast.type === 'info' && <Info className="h-4 w-4 text-blue-400 shrink-0" />}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}

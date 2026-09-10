'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
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
  fetchAccounts,
  createAccountRecord,
  fetchTransactions,
  createTransactionRecord,
  fetchNotifications,
  markNotificationAsReadRecord,
  markAllNotificationsAsReadRecord,
} from './services/database';

interface DashboardContextType {
  clients: Client[];
  tasks: Task[];
  tickets: Ticket[];
  accounts: SocialAccount[];
  transactions: Transaction[];
  teamMembers: TeamMember[];
  notifications: NotificationItem[];
  isLoading: boolean;
  
  // Actions
  addClient: (client: Omit<Client, 'id' | 'joinedDate'>) => Promise<void>;
  updateClient: (id: string, client: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  
  addTask: (task: Omit<Task, 'id' | 'completed'>) => Promise<void>;
  toggleTaskCompletion: (id: string) => Promise<void>;
  updateTaskStatus: (id: string, status: Task['status']) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  
  addTicket: (ticket: Omit<Ticket, 'id' | 'ticketNumber' | 'createdAt' | 'repliesCount' | 'messages'>) => Promise<void>;
  addTicketReply: (ticketId: string, replyText: string) => Promise<void>;
  updateTicketStatus: (ticketId: string, status: Ticket['status']) => Promise<void>;
  
  addAccount: (account: Omit<SocialAccount, 'id' | 'lastSync'>) => Promise<void>;
  
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => Promise<void>;
  
  markAllNotificationsAsRead: () => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
  
  // UI Global Modals
  activeModal: 'add_client' | 'add_task' | 'add_ticket' | 'request_payout' | 'search' | null;
  setActiveModal: (modal: 'add_client' | 'add_task' | 'add_ticket' | 'request_payout' | 'search' | null) => void;
  
  // Mobile navigation
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [accounts, setAccounts] = useState<SocialAccount[]>(initialAccounts);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [teamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [isLoading, setIsLoading] = useState(true);

  const [activeModal, setActiveModal] = useState<'add_client' | 'add_task' | 'add_ticket' | 'request_payout' | 'search' | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Initial Data Hydration from Supabase (with fallback)
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [c, t, tk, a, tx, n] = await Promise.all([
          fetchClients(),
          fetchTasks(),
          fetchTickets(),
          fetchAccounts(),
          fetchTransactions(),
          fetchNotifications(),
        ]);

        if (isMounted) {
          if (c?.length) setClients(c);
          if (t?.length) setTasks(t);
          if (tk?.length) setTickets(tk);
          if (a?.length) setAccounts(a);
          if (tx?.length) setTransactions(tx);
          if (n?.length) setNotifications(n);
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
  }, []);

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

    const created = await createClientRecord(clientData);
    if (created) {
      setClients((prev) => prev.map((c) => (c.id === tempId ? created : c)));
    }
  };

  const updateClient = async (id: string, updatedFields: Partial<Client>) => {
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedFields } : c))
    );
    await updateClientRecord(id, updatedFields);
  };

  const deleteClient = async (id: string) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
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

    const created = await createTaskRecord(taskData);
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
    await updateTaskStatusRecord(id, status);
  };

  const deleteTask = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
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

    const created = await createTicketRecord(ticketData);
    if (created) {
      setTickets((prev) => prev.map((t) => (t.id === tempId ? created : t)));
    }
  };

  const addTicketReply = async (ticketId: string, replyText: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const newMsg = {
            id: `msg-${Date.now()}`,
            sender: 'Samantha William (Digest Media)',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
            time: 'Just now',
            isStaff: true,
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
    await addTicketMessageRecord(ticketId, replyText, 'Samantha William (Digest Media)', true);
  };

  const updateTicketStatus = async (ticketId: string, status: Ticket['status']) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status } : t))
    );
    await updateTicketStatusRecord(ticketId, status);
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

    const created = await createAccountRecord(accountData);
    if (created) {
      setAccounts((prev) => prev.map((a) => (a.id === tempId ? created : a)));
    }
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
        description: `Invoice ${newTx.invoiceNumber} for $${newTx.amount.toLocaleString()} has been generated.`,
        time: 'Just now',
        unread: true,
        type: 'billing',
        link: '/balance',
      },
      ...prev,
    ]);

    const created = await createTransactionRecord(txData);
    if (created) {
      setTransactions((prev) => prev.map((t) => (t.id === tempId ? created : t)));
    }
  };

  // --------------------------------------------------------------------------
  // NOTIFICATION ACTIONS
  // --------------------------------------------------------------------------
  const markAllNotificationsAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    await markAllNotificationsAsReadRecord();
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
        addAccount,
        addTransaction,
        markAllNotificationsAsRead,
        markNotificationAsRead,
        activeModal,
        setActiveModal,
        mobileSidebarOpen,
        setMobileSidebarOpen,
      }}
    >
      {children}
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

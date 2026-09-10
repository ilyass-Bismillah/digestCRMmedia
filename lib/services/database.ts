import { createClient } from '@/lib/supabase/client';
import {
  Client,
  Task,
  Ticket,
  SocialAccount,
  Transaction,
  NotificationItem,
  initialClients,
  initialTasks,
  initialTickets,
  initialAccounts,
  initialTransactions,
  initialNotifications,
} from '@/lib/mock-data';

// ============================================================================
// CLIENTS SERVICE
// ============================================================================

export async function fetchClients(): Promise<Client[]> {
  const supabase = createClient();
  if (!supabase) return initialClients;

  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return initialClients;
    }

    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      company: item.company,
      avatar: item.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      email: item.email,
      phone: item.phone || '+1 (555) 000-0000',
      category: item.category || 'Tech & SaaS',
      status: item.status || 'active',
      retainer: Number(item.retainer) || 5000,
      accountsCount: item.accounts_count || 1,
      joinedDate: new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      location: item.location || 'New York, USA',
      channels: item.channels || ['Instagram', 'TikTok'],
      manager: item.assigned_manager || 'Samantha William',
    }));
  } catch (err) {
    console.warn('Using mock clients fallback:', err);
    return initialClients;
  }
}

export async function createClientRecord(client: Omit<Client, 'id' | 'joinedDate'>): Promise<Client | null> {
  const supabase = createClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('clients')
      .insert([
        {
          name: client.name,
          company: client.company,
          email: client.email,
          phone: client.phone,
          avatar_url: client.avatar,
          category: client.category,
          status: client.status,
          retainer: client.retainer,
          accounts_count: client.accountsCount || 1,
          location: client.location,
          assigned_manager: client.manager,
          channels: client.channels,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return {
      id: data.id,
      name: data.name,
      company: data.company,
      avatar: data.avatar_url,
      email: data.email,
      phone: data.phone,
      category: data.category,
      status: data.status,
      retainer: Number(data.retainer),
      accountsCount: data.accounts_count,
      joinedDate: 'Just now',
      location: data.location,
      channels: data.channels,
      manager: data.assigned_manager,
    };
  } catch (err) {
    console.error('Failed to create client in Supabase:', err);
    return null;
  }
}

export async function updateClientRecord(id: string, updates: Partial<Client>): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) return true;

  try {
    const payload: any = {};
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.company !== undefined) payload.company = updates.company;
    if (updates.email !== undefined) payload.email = updates.email;
    if (updates.phone !== undefined) payload.phone = updates.phone;
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.retainer !== undefined) payload.retainer = updates.retainer;
    if (updates.category !== undefined) payload.category = updates.category;

    const { error } = await supabase.from('clients').update(payload).eq('id', id);
    return !error;
  } catch (err) {
    console.error('Failed to update client:', err);
    return false;
  }
}

export async function deleteClientRecord(id: string): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) return true;

  try {
    const { error } = await supabase.from('clients').delete().eq('id', id);
    return !error;
  } catch (err) {
    console.error('Failed to delete client:', err);
    return false;
  }
}

// ============================================================================
// TASKS SERVICE
// ============================================================================

export async function fetchTasks(): Promise<Task[]> {
  const supabase = createClient();
  if (!supabase) return initialTasks;

  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return initialTasks;
    }

    return data.map((item: any) => ({
      id: item.id,
      title: item.title,
      clientName: item.client_name,
      category: item.category || 'Video Production',
      priority: item.priority || 'medium',
      status: item.status || 'pending',
      dueDate: item.due_date,
      completed: item.completed || false,
      assignee: {
        name: item.assignee_name || 'Samantha William',
        avatar: item.assignee_avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
        role: item.assignee_role || 'Creative Lead',
      },
    }));
  } catch (err) {
    console.warn('Using mock tasks fallback:', err);
    return initialTasks;
  }
}

export async function createTaskRecord(task: Omit<Task, 'id' | 'completed'>): Promise<Task | null> {
  const supabase = createClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('tasks')
      .insert([
        {
          title: task.title,
          client_name: task.clientName,
          category: task.category,
          priority: task.priority,
          status: task.status,
          due_date: task.dueDate,
          assignee_name: task.assignee.name,
          assignee_avatar: task.assignee.avatar,
          assignee_role: task.assignee.role,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return {
      id: data.id,
      title: data.title,
      clientName: data.client_name,
      category: data.category,
      priority: data.priority,
      status: data.status,
      dueDate: data.due_date,
      completed: data.completed,
      assignee: {
        name: data.assignee_name,
        avatar: data.assignee_avatar,
        role: data.assignee_role,
      },
    };
  } catch (err) {
    console.error('Failed to create task in Supabase:', err);
    return null;
  }
}

export async function updateTaskStatusRecord(id: string, status: Task['status']): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) return true;

  try {
    const { error } = await supabase
      .from('tasks')
      .update({ status, completed: status === 'completed', updated_at: new Date().toISOString() })
      .eq('id', id);
    return !error;
  } catch (err) {
    console.error('Failed to update task status:', err);
    return false;
  }
}

export async function toggleTaskCompletionRecord(id: string, completed: boolean): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) return true;

  try {
    const { error } = await supabase
      .from('tasks')
      .update({
        completed,
        status: completed ? 'completed' : 'in_progress',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);
    return !error;
  } catch (err) {
    console.error('Failed to toggle task:', err);
    return false;
  }
}

export async function deleteTaskRecord(id: string): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) return true;

  try {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    return !error;
  } catch (err) {
    console.error('Failed to delete task:', err);
    return false;
  }
}

// ============================================================================
// TICKETS SERVICE
// ============================================================================

export async function fetchTickets(): Promise<Ticket[]> {
  const supabase = createClient();
  if (!supabase) return initialTickets;

  try {
    const { data: ticketsData, error: ticketsError } = await supabase
      .from('tickets')
      .select('*, ticket_messages(*)')
      .order('created_at', { ascending: false });

    if (ticketsError || !ticketsData || ticketsData.length === 0) {
      return initialTickets;
    }

    return ticketsData.map((item: any) => ({
      id: item.id,
      ticketNumber: item.ticket_number,
      subject: item.subject,
      clientName: item.client_name,
      category: item.category || 'Campaign Creative',
      assignedStaff: item.assigned_staff || 'Samantha W.',
      requester: {
        name: item.requester_name || 'Client',
        avatar: item.requester_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        email: item.requester_email || 'client@digestmedia.co',
      },
      priority: item.priority || 'medium',
      status: item.status || 'open',
      createdAt: new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      lastMessage: item.last_message || item.description,
      repliesCount: item.replies_count || (item.ticket_messages ? item.ticket_messages.length : 0),
      messages: (item.ticket_messages || []).map((msg: any) => ({
        id: msg.id,
        sender: msg.sender_name,
        avatar: msg.avatar_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
        time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isStaff: msg.is_staff || false,
        text: msg.message,
      })),
    }));
  } catch (err) {
    console.warn('Using mock tickets fallback:', err);
    return initialTickets;
  }
}

export async function createTicketRecord(
  ticket: Omit<Ticket, 'id' | 'ticketNumber' | 'createdAt' | 'repliesCount' | 'messages'>
): Promise<Ticket | null> {
  const supabase = createClient();
  if (!supabase) return null;

  try {
    const ticketNumber = `TCK-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const { data, error } = await supabase
      .from('tickets')
      .insert([
        {
          ticket_number: ticketNumber,
          subject: ticket.subject,
          description: ticket.lastMessage || ticket.subject,
          client_name: ticket.clientName,
          category: ticket.category || 'Campaign Creative',
          priority: ticket.priority,
          status: ticket.status || 'open',
          requester_name: ticket.requester.name,
          requester_email: ticket.requester.email,
          requester_avatar: ticket.requester.avatar,
          assigned_staff: ticket.assignedStaff || 'Samantha W.',
          last_message: ticket.lastMessage,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return {
      id: data.id,
      ticketNumber: data.ticket_number,
      subject: data.subject,
      clientName: data.client_name,
      category: data.category,
      assignedStaff: data.assigned_staff,
      requester: {
        name: data.requester_name,
        email: data.requester_email,
        avatar: data.requester_avatar,
      },
      priority: data.priority,
      status: data.status,
      createdAt: 'Just now',
      lastMessage: data.last_message,
      repliesCount: 0,
      messages: [],
    };
  } catch (err) {
    console.error('Failed to create ticket in Supabase:', err);
    return null;
  }
}

export async function addTicketMessageRecord(
  ticketId: string,
  message: string,
  senderName: string,
  isStaff: boolean
): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) return true;

  try {
    const { error } = await supabase.from('ticket_messages').insert([
      {
        ticket_id: ticketId,
        sender_name: senderName,
        is_staff: isStaff,
        message,
      },
    ]);

    if (!error) {
      await supabase
        .from('tickets')
        .update({
          last_message: message,
          updated_at: new Date().toISOString(),
        })
        .eq('id', ticketId);
    }

    return !error;
  } catch (err) {
    console.error('Failed to add message to ticket:', err);
    return false;
  }
}

export async function updateTicketStatusRecord(ticketId: string, status: Ticket['status']): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) return true;

  try {
    const { error } = await supabase
      .from('tickets')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', ticketId);
    return !error;
  } catch (err) {
    console.error('Failed to update ticket status:', err);
    return false;
  }
}

// ============================================================================
// ACCOUNTS SERVICE
// ============================================================================

export async function fetchAccounts(): Promise<SocialAccount[]> {
  const supabase = createClient();
  if (!supabase) return initialAccounts;

  try {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return initialAccounts;
    }

    return data.map((item: any) => ({
      id: item.id,
      platform: item.platform,
      handle: item.handle,
      clientName: item.client_name || 'Client',
      followers: item.followers || '0',
      engagement: item.engagement || '0%',
      status: item.status || 'connected',
      lastSync: new Date(item.last_sync || item.created_at).toLocaleDateString(),
      avatar: item.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    }));
  } catch (err) {
    console.warn('Using mock accounts fallback:', err);
    return initialAccounts;
  }
}

export async function createAccountRecord(account: Omit<SocialAccount, 'id' | 'lastSync'>): Promise<SocialAccount | null> {
  const supabase = createClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('accounts')
      .insert([
        {
          platform: account.platform,
          handle: account.handle,
          client_name: account.clientName,
          followers: account.followers,
          engagement: account.engagement,
          status: account.status,
          avatar_url: account.avatar,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return {
      id: data.id,
      platform: data.platform,
      handle: data.handle,
      clientName: data.client_name,
      followers: data.followers,
      engagement: data.engagement,
      status: data.status,
      lastSync: 'Just now',
      avatar: data.avatar_url,
    };
  } catch (err) {
    console.error('Failed to create account in Supabase:', err);
    return null;
  }
}

// ============================================================================
// TRANSACTIONS / FINANCES SERVICE
// ============================================================================

export async function fetchTransactions(): Promise<Transaction[]> {
  const supabase = createClient();
  if (!supabase) return initialTransactions;

  try {
    const { data, error } = await supabase
      .from('balance_transactions')
      .select('*')
      .order('date', { ascending: false });

    if (error || !data || data.length === 0) {
      return initialTransactions;
    }

    return data.map((item: any) => ({
      id: item.id,
      invoiceNumber: item.transaction_id,
      clientName: item.client_name,
      amount: Number(item.amount),
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: item.status === 'approved' ? 'paid' : item.status === 'rejected' ? 'overdue' : 'pending',
      paymentMethod: item.payment_method,
      service: item.service || 'Ad Spend Retainer',
    }));
  } catch (err) {
    console.warn('Using mock transactions fallback:', err);
    return initialTransactions;
  }
}

export async function createTransactionRecord(
  tx: Omit<Transaction, 'id' | 'date'>
): Promise<Transaction | null> {
  const supabase = createClient();
  if (!supabase) return null;

  try {
    const txnId = `TXN-${Math.floor(10000 + Math.random() * 90000)}-${new Date().getFullYear()}`;
    const { data, error } = await supabase
      .from('balance_transactions')
      .insert([
        {
          transaction_id: txnId,
          client_name: tx.clientName,
          amount: tx.amount,
          fee: tx.amount * 0.005,
          status: tx.status === 'paid' ? 'approved' : 'pending',
          payment_method: tx.paymentMethod,
          service: tx.service,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return {
      id: data.id,
      invoiceNumber: data.transaction_id,
      clientName: data.client_name,
      amount: Number(data.amount),
      date: 'Today',
      status: data.status === 'approved' ? 'paid' : 'pending',
      paymentMethod: data.payment_method,
      service: data.service,
    };
  } catch (err) {
    console.error('Failed to create transaction in Supabase:', err);
    return null;
  }
}

// ============================================================================
// NOTIFICATIONS SERVICE
// ============================================================================

export async function fetchNotifications(): Promise<NotificationItem[]> {
  const supabase = createClient();
  if (!supabase) return initialNotifications;

  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return initialNotifications;
    }

    return data.map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      time: new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      unread: item.unread,
      type: item.type,
      link: item.link,
    }));
  } catch (err) {
    console.warn('Using mock notifications fallback:', err);
    return initialNotifications;
  }
}

export async function markNotificationAsReadRecord(id: string): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) return true;

  try {
    const { error } = await supabase.from('notifications').update({ unread: false }).eq('id', id);
    return !error;
  } catch (err) {
    console.error('Failed to mark notification read:', err);
    return false;
  }
}

export async function markAllNotificationsAsReadRecord(): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) return true;

  try {
    const { error } = await supabase.from('notifications').update({ unread: false }).eq('unread', true);
    return !error;
  } catch (err) {
    console.error('Failed to mark all notifications read:', err);
    return false;
  }
}

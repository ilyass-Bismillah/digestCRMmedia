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

export async function fetchClients(role?: 'admin' | 'user', userId?: string): Promise<Client[]> {
  const supabase = createClient();

  if (!supabase) {
    if (role === 'user') {
      return initialClients.slice(0, 3);
    }
    return initialClients;
  }

  try {
    let query = supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    // If standard user, filter to assigned or created clients
    if (role === 'user' && userId && !userId.startsWith('usr-')) {
      query = query.or(`assigned_to.eq.${userId},created_by.eq.${userId}`);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      if (role === 'user') {
        return initialClients.slice(0, 3);
      }
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
    return role === 'user' ? initialClients.slice(0, 3) : initialClients;
  }
}

export async function createClientRecord(client: Omit<Client, 'id' | 'joinedDate'>, userId?: string): Promise<Client | null> {
  const supabase = createClient();
  if (!supabase) return null;

  try {
    const payload: any = {
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
    };

    if (userId && !userId.startsWith('usr-')) {
      payload.created_by = userId;
      payload.assigned_to = userId;
    }

    const { data, error } = await supabase
      .from('clients')
      .insert([payload])
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
    if (updates.location !== undefined) payload.location = updates.location;
    if (updates.manager !== undefined) payload.assigned_manager = updates.manager;
    payload.updated_at = new Date().toISOString();

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

export async function fetchTasks(role?: 'admin' | 'user', userId?: string): Promise<Task[]> {
  const supabase = createClient();
  if (!supabase) {
    return role === 'user' ? initialTasks.slice(0, 3) : initialTasks;
  }

  try {
    let query = supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (role === 'user' && userId && !userId.startsWith('usr-')) {
      query = query.or(`assigned_to.eq.${userId},created_by.eq.${userId}`);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      return role === 'user' ? initialTasks.slice(0, 3) : initialTasks;
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
    return role === 'user' ? initialTasks.slice(0, 3) : initialTasks;
  }
}

export async function createTaskRecord(task: Omit<Task, 'id' | 'completed'>, userId?: string): Promise<Task | null> {
  const supabase = createClient();
  if (!supabase) return null;

  try {
    const payload: any = {
      title: task.title,
      client_name: task.clientName,
      category: task.category,
      priority: task.priority,
      status: task.status,
      due_date: task.dueDate,
      assignee_name: task.assignee.name,
      assignee_avatar: task.assignee.avatar,
      assignee_role: task.assignee.role,
    };

    if (userId && !userId.startsWith('usr-')) {
      payload.created_by = userId;
      payload.assigned_to = userId;
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert([payload])
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

export async function fetchTickets(role?: 'admin' | 'user', userId?: string): Promise<Ticket[]> {
  const supabase = createClient();
  if (!supabase) {
    return role === 'user' ? initialTickets.slice(0, 2) : initialTickets;
  }

  try {
    let query = supabase
      .from('tickets')
      .select('*, ticket_messages(*)')
      .order('created_at', { ascending: false });

    if (role === 'user' && userId && !userId.startsWith('usr-')) {
      query = query.eq('user_id', userId);
    }

    const { data: ticketsData, error: ticketsError } = await query;

    if (ticketsError || !ticketsData || ticketsData.length === 0) {
      return role === 'user' ? initialTickets.slice(0, 2) : initialTickets;
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
    return role === 'user' ? initialTickets.slice(0, 2) : initialTickets;
  }
}

export async function createTicketRecord(
  ticket: Omit<Ticket, 'id' | 'ticketNumber' | 'createdAt' | 'repliesCount' | 'messages'>,
  userId?: string
): Promise<Ticket | null> {
  const supabase = createClient();
  if (!supabase) return null;

  try {
    const ticketNumber = `TCK-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const payload: any = {
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
    };

    if (userId && !userId.startsWith('usr-')) {
      payload.user_id = userId;
    }

    const { data, error } = await supabase
      .from('tickets')
      .insert([payload])
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
  isStaff: boolean,
  attachmentUrl?: string
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
        attachment_url: attachmentUrl,
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

export async function deleteTicketRecord(ticketId: string): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) return true;

  try {
    const { error } = await supabase.from('tickets').delete().eq('id', ticketId);
    return !error;
  } catch (err) {
    console.error('Failed to delete ticket:', err);
    return false;
  }
}

// ============================================================================
// ACCOUNTS SERVICE
// ============================================================================

export async function fetchAccounts(role?: 'admin' | 'user', userId?: string): Promise<SocialAccount[]> {
  const supabase = createClient();
  if (!supabase) {
    return role === 'user' ? initialAccounts.slice(0, 2) : initialAccounts;
  }

  try {
    let query = supabase
      .from('accounts')
      .select('*')
      .order('created_at', { ascending: false });

    if (role === 'user' && userId && !userId.startsWith('usr-')) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      return role === 'user' ? initialAccounts.slice(0, 2) : initialAccounts;
    }

    return data.map((item: any) => ({
      id: item.id,
      name: item.name || item.client_name,
      platform: item.platform,
      handle: item.handle || `@${item.client_name?.toLowerCase().replace(/\s+/g, '')}`,
      accountId: item.account_id || `ACT-${item.id.slice(0, 5)}`,
      clientName: item.client_name || 'Client',
      balance: Number(item.balance) || 0,
      followers: item.followers || '0',
      engagement: item.engagement || '0%',
      status: item.status || 'active',
      lastSync: new Date(item.last_sync || item.created_at).toLocaleDateString(),
      avatar: item.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      notes: item.notes || [],
    }));
  } catch (err) {
    console.warn('Using mock accounts fallback:', err);
    return role === 'user' ? initialAccounts.slice(0, 2) : initialAccounts;
  }
}

export async function createAccountRecord(account: Omit<SocialAccount, 'id' | 'lastSync'>, userId?: string): Promise<SocialAccount | null> {
  const supabase = createClient();
  if (!supabase) return null;

  try {
    const payload: any = {
      name: account.name || account.clientName,
      platform: account.platform,
      handle: account.handle || `@${account.clientName?.toLowerCase().replace(/\s+/g, '')}`,
      account_id: account.accountId || `ACT-${Math.floor(10000 + Math.random() * 90000)}`,
      client_name: account.clientName,
      balance: account.balance || 0,
      followers: account.followers || '0',
      engagement: account.engagement || '0%',
      status: account.status || 'active',
      avatar_url: account.avatar,
    };

    if (userId && !userId.startsWith('usr-')) {
      payload.user_id = userId;
    }

    const { data, error } = await supabase
      .from('accounts')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    return {
      id: data.id,
      name: data.name || account.name,
      platform: data.platform,
      handle: data.handle,
      accountId: data.account_id || account.accountId,
      clientName: data.client_name,
      balance: Number(data.balance) || 0,
      followers: data.followers,
      engagement: data.engagement,
      status: data.status,
      lastSync: 'Just now',
      avatar: data.avatar_url,
      notes: [],
    };
  } catch (err) {
    console.error('Failed to create account in Supabase:', err);
    return null;
  }
}

export async function updateAccountRecord(id: string, updates: Partial<SocialAccount>): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) return true;

  try {
    const payload: any = {};
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.handle !== undefined) payload.handle = updates.handle;
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.balance !== undefined) payload.balance = updates.balance;
    if (updates.followers !== undefined) payload.followers = updates.followers;
    if (updates.engagement !== undefined) payload.engagement = updates.engagement;
    if (updates.notes !== undefined) payload.notes = updates.notes;
    payload.last_sync = new Date().toISOString();

    const { error } = await supabase.from('accounts').update(payload).eq('id', id);
    return !error;
  } catch (err) {
    console.error('Failed to update account:', err);
    return false;
  }
}

export async function deleteAccountRecord(id: string): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) return true;

  try {
    const { error } = await supabase.from('accounts').delete().eq('id', id);
    return !error;
  } catch (err) {
    console.error('Failed to delete account:', err);
    return false;
  }
}

// ============================================================================
// TRANSACTIONS / FINANCES SERVICE
// ============================================================================

export async function fetchTransactions(role?: 'admin' | 'user', userId?: string): Promise<Transaction[]> {
  const supabase = createClient();
  if (!supabase) {
    return role === 'user' ? initialTransactions.slice(0, 2) : initialTransactions;
  }

  try {
    let query = supabase
      .from('balance_transactions')
      .select('*')
      .order('date', { ascending: false });

    if (role === 'user' && userId && !userId.startsWith('usr-')) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      return role === 'user' ? initialTransactions.slice(0, 2) : initialTransactions;
    }

    return data.map((item: any) => ({
      id: item.id,
      invoiceNumber: item.transaction_id,
      clientName: item.client_name,
      amount: Number(item.amount),
      fee: Number(item.fee) || Number(item.amount) * 0.005,
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: item.status || 'pending',
      paymentMethod: item.payment_method,
      service: item.service || 'Ad Spend Retainer',
      slipUrl: item.slip_url,
    }));
  } catch (err) {
    console.warn('Using mock transactions fallback:', err);
    return role === 'user' ? initialTransactions.slice(0, 2) : initialTransactions;
  }
}

export async function createTransactionRecord(
  tx: Omit<Transaction, 'id' | 'date'>,
  userId?: string
): Promise<Transaction | null> {
  const supabase = createClient();
  if (!supabase) return null;

  try {
    const txnId = tx.invoiceNumber || `TXN-${Math.floor(10000 + Math.random() * 90000)}-${new Date().getFullYear()}`;
    const payload: any = {
      transaction_id: txnId,
      client_name: tx.clientName,
      amount: tx.amount,
      fee: tx.fee !== undefined ? tx.fee : tx.amount * 0.005,
      status: tx.status || 'pending',
      payment_method: tx.paymentMethod,
      service: tx.service,
      slip_url: tx.slipUrl,
    };

    if (userId && !userId.startsWith('usr-')) {
      payload.user_id = userId;
    }

    const { data, error } = await supabase
      .from('balance_transactions')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    return {
      id: data.id,
      invoiceNumber: data.transaction_id,
      clientName: data.client_name,
      amount: Number(data.amount),
      fee: Number(data.fee) || 0,
      date: 'Today',
      status: data.status,
      paymentMethod: data.payment_method,
      service: data.service,
      slipUrl: data.slip_url,
    };
  } catch (err) {
    console.error('Failed to create transaction in Supabase:', err);
    return null;
  }
}

export async function updateTransactionStatusRecord(
  id: string,
  status: 'approved' | 'pending' | 'rejected' | 'paid' | 'overdue'
): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) return true;

  try {
    const mappedStatus = status === 'paid' ? 'approved' : status;
    const { error } = await supabase
      .from('balance_transactions')
      .update({ status: mappedStatus })
      .eq('id', id);
    return !error;
  } catch (err) {
    console.error('Failed to update transaction status:', err);
    return false;
  }
}

export async function deleteTransactionRecord(id: string): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) return true;

  try {
    const { error } = await supabase.from('balance_transactions').delete().eq('id', id);
    return !error;
  } catch (err) {
    console.error('Failed to delete transaction:', err);
    return false;
  }
}

// ============================================================================
// NOTIFICATIONS SERVICE
// ============================================================================

export async function fetchNotifications(userId?: string): Promise<NotificationItem[]> {
  const supabase = createClient();
  if (!supabase) return initialNotifications;

  try {
    let query = supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (userId && !userId.startsWith('usr-')) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

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

export async function markAllNotificationsAsReadRecord(userId?: string): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) return true;

  try {
    let query = supabase.from('notifications').update({ unread: false }).eq('unread', true);
    if (userId && !userId.startsWith('usr-')) {
      query = query.eq('user_id', userId);
    }
    const { error } = await query;
    return !error;
  } catch (err) {
    console.error('Failed to mark all notifications read:', err);
    return false;
  }
}

// ============================================================================
// PROFILES SERVICE
// ============================================================================

export async function fetchProfileRecord(userId: string) {
  const supabase = createClient();
  if (!supabase || userId.startsWith('usr-')) return null;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

export async function updateProfileRecord(
  userId: string,
  updates: { full_name?: string; avatar_url?: string; phone?: string; job_title?: string }
): Promise<boolean> {
  const supabase = createClient();
  if (!supabase || userId.startsWith('usr-')) return true;

  try {
    const { error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId);
    return !error;
  } catch {
    return false;
  }
}

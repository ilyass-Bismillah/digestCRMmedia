export interface Client {
  id: string;
  name: string;
  company: string;
  avatar: string;
  email: string;
  phone: string;
  category: 'Fashion & Retail' | 'Tech & SaaS' | 'Lifestyle & Travel' | 'Finance & Web3' | 'Entertainment' | 'Digital Agency' | string;
  status: 'active' | 'vip' | 'trial' | 'inactive';
  retainer: number;
  accountsCount: number;
  joinedDate: string;
  location: string;
  channels?: string[];
  manager?: string;
}

export interface Task {
  id: string;
  title: string;
  clientName: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'review' | 'completed';
  dueDate: string;
  completed: boolean;
  assignee: {
    name: string;
    avatar: string;
    role: string;
  };
}

export interface TicketMessage {
  id: string;
  sender: string;
  avatar: string;
  time: string;
  isStaff: boolean;
  text: string;
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  subject: string;
  clientName: string;
  category?: string;
  assignedStaff?: string;
  requester: {
    name: string;
    avatar: string;
    email: string;
  };
  priority: 'high' | 'medium' | 'low';
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  lastMessage: string;
  repliesCount: number;
  messages: TicketMessage[];
}

export interface SocialAccount {
  id: string;
  name?: string;
  platform: 'instagram' | 'tiktok' | 'youtube' | 'linkedin' | 'facebook' | 'web' | 'Google Ads' | 'Meta Ads' | 'TikTok Ads' | 'LinkedIn Ads';
  handle: string;
  accountId?: string;
  clientName: string;
  followers?: string;
  engagement?: string;
  balance?: number;
  status: 'connected' | 'action_required' | 'syncing' | 'active' | 'paused';
  lastSync: string;
  avatar: string;
  notes?: { id: string; author: string; time: string; text: string }[];
}

export interface Transaction {
  id: string;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'overdue' | 'approved' | 'rejected';
  paymentMethod: string;
  service: string;
  fee?: number;
  slipUrl?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Creative Director' | 'Senior Editor' | 'Media Strategist' | 'Account Manager';
  avatar: string;
  status: 'active' | 'away' | 'offline';
  assignedClients: number;
  completedTasks: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  type: 'task' | 'billing' | 'ticket' | 'system';
  link?: string;
}

// Initial Mock Datasets
export const initialClients: Client[] = [
  {
    id: 'cli-1',
    name: 'Eleanor Vance',
    company: 'Aura Cosmetics Global',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    email: 'eleanor@auracosmetics.com',
    phone: '+1 (555) 234-5678',
    category: 'Fashion & Retail',
    status: 'vip',
    retainer: 8500,
    accountsCount: 4,
    joinedDate: 'Jan 12, 2025',
    location: 'New York, USA',
  },
  {
    id: 'cli-2',
    name: 'Marcus Chen',
    company: 'Nexus Robotics AI',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    email: 'marcus@nexusrobotics.io',
    phone: '+1 (555) 345-6789',
    category: 'Tech & SaaS',
    status: 'active',
    retainer: 12000,
    accountsCount: 5,
    joinedDate: 'Mar 04, 2025',
    location: 'San Francisco, USA',
  },
  {
    id: 'cli-3',
    name: 'Sophia Dubois',
    company: 'Lumière Hospitality Group',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    email: 's.dubois@lumierehotels.fr',
    phone: '+33 1 42 68 55 00',
    category: 'Lifestyle & Travel',
    status: 'vip',
    retainer: 9400,
    accountsCount: 3,
    joinedDate: 'Oct 19, 2024',
    location: 'Paris, France',
  },
  {
    id: 'cli-4',
    name: 'David Sterling',
    company: 'Apex Prime Capital',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    email: 'david@apexcapital.co',
    phone: '+44 20 7946 0912',
    category: 'Finance & Web3',
    status: 'active',
    retainer: 6500,
    accountsCount: 2,
    joinedDate: 'Jan 30, 2026',
    location: 'London, UK',
  },
  {
    id: 'cli-5',
    name: 'Elena Rostova',
    company: 'Veloce Cinema Productions',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    email: 'elena@velocefilm.it',
    phone: '+39 06 698 7412',
    category: 'Entertainment',
    status: 'trial',
    retainer: 3200,
    accountsCount: 3,
    joinedDate: 'Aug 14, 2026',
    location: 'Milan, Italy',
  },
  {
    id: 'cli-6',
    name: 'Jordan Hayes',
    company: 'Kinetic Sound Systems',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
    email: 'jordan@kineticsound.com',
    phone: '+1 (555) 890-1234',
    category: 'Entertainment',
    status: 'inactive',
    retainer: 0,
    accountsCount: 1,
    joinedDate: 'Nov 02, 2024',
    location: 'Austin, USA',
  },
];

export const initialTasks: Task[] = [
  {
    id: 'tsk-101',
    title: 'Autumn Campaign Video Reel & Story Cut',
    clientName: 'Aura Cosmetics Global',
    category: 'Video Production',
    priority: 'high',
    status: 'in_progress',
    dueDate: 'Today, 5:00 PM',
    completed: false,
    assignee: {
      name: 'Maya Lin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      role: 'Senior Video Editor',
    },
  },
  {
    id: 'tsk-102',
    title: 'Q3 Product Teaser Motion Graphics',
    clientName: 'Nexus Robotics AI',
    category: 'Motion Design',
    priority: 'high',
    status: 'review',
    dueDate: 'Tomorrow, 12:00 PM',
    completed: false,
    assignee: {
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      role: 'Motion Lead',
    },
  },
  {
    id: 'tsk-103',
    title: 'TikTok Viral Hook Audio & Sound Design',
    clientName: 'Veloce Cinema Productions',
    category: 'Audio Engineering',
    priority: 'medium',
    status: 'pending',
    dueDate: 'Sep 12, 2026',
    completed: false,
    assignee: {
      name: 'Julian Vance',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      role: 'Audio Specialist',
    },
  },
  {
    id: 'tsk-104',
    title: 'Luxury Hotel Social Carousel (10 slides)',
    clientName: 'Lumière Hospitality Group',
    category: 'Graphic Design',
    priority: 'medium',
    status: 'in_progress',
    dueDate: 'Sep 14, 2026',
    completed: false,
    assignee: {
      name: 'Sara K.',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
      role: 'Brand Designer',
    },
  },
  {
    id: 'tsk-105',
    title: 'Quarterly Performance Digest PDF Report',
    clientName: 'Apex Prime Capital',
    category: 'Editorial & Copy',
    priority: 'low',
    status: 'completed',
    dueDate: 'Sep 08, 2026',
    completed: true,
    assignee: {
      name: 'Liam Foster',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
      role: 'Copywriter',
    },
  },
  {
    id: 'tsk-106',
    title: 'Weekly YouTube Thumbnail A/B Test Variants',
    clientName: 'Nexus Robotics AI',
    category: 'Thumbnail Design',
    priority: 'low',
    status: 'completed',
    dueDate: 'Sep 07, 2026',
    completed: true,
    assignee: {
      name: 'Sara K.',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
      role: 'Brand Designer',
    },
  },
];

export const initialTickets: Ticket[] = [
  {
    id: 'tck-1',
    ticketNumber: 'TCK-2026-081',
    subject: 'Urgent: Request color grading adjustment on Reel #4',
    clientName: 'Aura Cosmetics Global',
    requester: {
      name: 'Eleanor Vance',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      email: 'eleanor@auracosmetics.com',
    },
    priority: 'high',
    status: 'open',
    createdAt: '25 mins ago',
    lastMessage: 'The skin tones in scene 3 look slightly oversaturated on mobile screens.',
    repliesCount: 3,
    messages: [
      {
        id: 'msg-1',
        sender: 'Eleanor Vance',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        time: 'Today, 2:15 PM',
        isStaff: false,
        text: 'Hi team! We just reviewed the first cut of Reel #4. The pacing is fantastic, but the skin tones in scene 3 look slightly oversaturated on iPhone OLED displays. Could we dial back the magenta tint by 15%?',
      },
      {
        id: 'msg-2',
        sender: 'Sarah Jenkins (Digest Media)',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
        time: 'Today, 2:28 PM',
        isStaff: true,
        text: 'Hello Eleanor! Absolutely, Maya is currently adjusting the LUT and re-exporting. We will have the updated render uploaded within 45 minutes.',
      },
    ],
  },
  {
    id: 'tck-2',
    ticketNumber: 'TCK-2026-079',
    subject: 'TikTok Channel Re-Authorization sync failure',
    clientName: 'Nexus Robotics AI',
    requester: {
      name: 'Marcus Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      email: 'marcus@nexusrobotics.io',
    },
    priority: 'medium',
    status: 'in_progress',
    createdAt: '2 hours ago',
    lastMessage: 'OAuth token expired during automatic scheduled post.',
    repliesCount: 2,
    messages: [
      {
        id: 'msg-3',
        sender: 'Marcus Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        time: 'Today, 12:40 PM',
        isStaff: false,
        text: 'Our TikTok Business connection indicates an expired OAuth token. Please re-send the verification link to our social team.',
      },
    ],
  },
  {
    id: 'tck-3',
    ticketNumber: 'TCK-2026-074',
    subject: 'Request invoice copy for August Retainer',
    clientName: 'Lumière Hospitality Group',
    requester: {
      name: 'Sophia Dubois',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
      email: 's.dubois@lumierehotels.fr',
    },
    priority: 'low',
    status: 'resolved',
    createdAt: '1 day ago',
    lastMessage: 'Invoice #INV-2026-08 sent to accounting.',
    repliesCount: 4,
    messages: [
      {
        id: 'msg-4',
        sender: 'Sophia Dubois',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
        time: 'Yesterday, 10:15 AM',
        isStaff: false,
        text: 'Hello, our finance department needs the VAT breakdown for the August invoice.',
      },
      {
        id: 'msg-5',
        sender: 'Billing Team',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
        time: 'Yesterday, 11:00 AM',
        isStaff: true,
        text: 'Provided PDF with full European VAT ID and breakdown.',
      },
    ],
  },
];

export const initialAccounts: SocialAccount[] = [
  {
    id: 'acc-1',
    name: 'Aura - Summer Campaign',
    platform: 'Meta Ads',
    handle: '@auracosmetics_official',
    accountId: 'ACT-98234-META',
    clientName: 'Aura Cosmetics Global',
    balance: 14500.0,
    followers: '482.4K',
    engagement: '4.8%',
    status: 'active',
    lastSync: '10 mins ago',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    notes: [
      { id: 'n-1', author: 'Samantha William', time: 'Yesterday 14:20', text: 'Increased daily cap by $500 for European influencer creative tests.' },
      { id: 'n-2', author: 'Alex Rivera', time: 'Sep 08, 10:15', text: 'Connected new TikTok Spark ad token.' },
    ],
  },
  {
    id: 'acc-2',
    name: 'Nexus - B2B Conversions',
    platform: 'Google Ads',
    handle: 'Nexus Robotics AI Lab',
    accountId: 'ACT-44129-GGL',
    clientName: 'Nexus Robotics AI',
    balance: 8200.0,
    followers: '194.0K',
    engagement: '5.1%',
    status: 'active',
    lastSync: '1 hour ago',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    notes: [
      { id: 'n-3', author: 'Samantha William', time: '2 days ago', text: 'Search intent campaign keywords audited.' },
    ],
  },
  {
    id: 'acc-3',
    name: 'Veloce - Cinema Reels',
    platform: 'TikTok Ads',
    handle: '@veloce_cinema',
    accountId: 'ACT-66311-TT',
    clientName: 'Veloce Cinema Productions',
    balance: 3800.0,
    followers: '310.5K',
    engagement: '3.9%',
    status: 'active',
    lastSync: '25 mins ago',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    notes: [],
  },
  {
    id: 'acc-4',
    name: 'Seraphine - Fall Launch',
    platform: 'Meta Ads',
    handle: '@seraphine_paris',
    accountId: 'ACT-11928-META',
    clientName: 'Seraphine Jewelry Paris',
    balance: 12000.0,
    followers: '625.8K',
    engagement: '6.4%',
    status: 'paused',
    lastSync: '3 days ago',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    notes: [],
  },
  {
    id: 'acc-5',
    name: 'Apex - Prime Growth',
    platform: 'LinkedIn Ads',
    handle: 'Apex Prime Capital Management',
    accountId: 'ACT-55012-LNK',
    clientName: 'Apex Prime Capital',
    balance: 9500.0,
    followers: '88.2K',
    engagement: '2.8%',
    status: 'active',
    lastSync: '4 hours ago',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    notes: [],
  },
];

export const initialTransactions: Transaction[] = [
  {
    id: 'tx-1001',
    invoiceNumber: 'TXN-98421-2024',
    clientName: 'Aura Cosmetics Global',
    amount: 12500,
    fee: 45.0,
    date: 'Apr 02, 2024 - 11:30',
    status: 'approved',
    paymentMethod: 'Bank Transfer',
    service: 'Monthly Ad Spend Retainer & Video Production',
  },
  {
    id: 'tx-1002',
    invoiceNumber: 'TXN-77312-2024',
    clientName: 'Nexus Robotics AI',
    amount: 8000,
    fee: 32.0,
    date: 'Apr 01, 2024 - 15:45',
    status: 'approved',
    paymentMethod: 'Wire Transfer',
    service: 'B2B Search Marketing Campaign',
  },
  {
    id: 'tx-1003',
    invoiceNumber: 'TXN-55209-2024',
    clientName: 'Veloce Cinema Productions',
    amount: 3500,
    fee: 14.5,
    date: 'Mar 29, 2024 - 09:12',
    status: 'pending',
    paymentMethod: 'Credit Card',
    service: 'Short-Form Video Production & TikTok Boost',
  },
  {
    id: 'tx-1004',
    invoiceNumber: 'TXN-33108-2024',
    clientName: 'Seraphine Jewelry Paris',
    amount: 6000,
    fee: 25.0,
    date: 'Mar 25, 2024 - 18:20',
    status: 'rejected',
    paymentMethod: 'PayPal',
    service: 'Fall Launch Influencer Creative Budget',
  },
  {
    id: 'tx-1005',
    invoiceNumber: 'INV-2026-0901',
    clientName: 'Apex Prime Capital',
    amount: 6500,
    fee: 28.0,
    date: 'Aug 28, 2026',
    status: 'paid',
    paymentMethod: 'Wire Transfer',
    service: 'Financial Digest & Motion Graphics',
  },
];

export const initialTeamMembers: TeamMember[] = [
  {
    id: 'usr-1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@digestmedia.co',
    role: 'Creative Director',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    status: 'active',
    assignedClients: 12,
    completedTasks: 184,
  },
  {
    id: 'usr-2',
    name: 'Maya Lin',
    email: 'maya.l@digestmedia.co',
    role: 'Senior Editor',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    status: 'active',
    assignedClients: 8,
    completedTasks: 142,
  },
  {
    id: 'usr-3',
    name: 'Alex Rivera',
    email: 'alex.r@digestmedia.co',
    role: 'Media Strategist',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    status: 'active',
    assignedClients: 10,
    completedTasks: 98,
  },
  {
    id: 'usr-4',
    name: 'Julian Vance',
    email: 'julian.v@digestmedia.co',
    role: 'Account Manager',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    status: 'away',
    assignedClients: 6,
    completedTasks: 76,
  },
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'New High Priority Ticket',
    description: 'Aura Cosmetics opened ticket #TCK-2026-081 regarding color grading.',
    time: '25m ago',
    unread: true,
    type: 'ticket',
    link: '/tickets',
  },
  {
    id: 'notif-2',
    title: 'Payment Received',
    description: 'Nexus Robotics AI settled invoice #INV-2026-0901 ($12,000.00).',
    time: '2h ago',
    unread: true,
    type: 'billing',
    link: '/balance',
  },
  {
    id: 'notif-3',
    title: 'Task Review Ready',
    description: 'Alex Rivera submitted Q3 Product Teaser Motion Graphics for review.',
    time: '3h ago',
    unread: true,
    type: 'task',
    link: '/tasks',
  },
  {
    id: 'notif-4',
    title: 'Account Sync Alert',
    description: 'TikTok token for Nexus Robotics requires re-authorization.',
    time: '1d ago',
    unread: false,
    type: 'system',
    link: '/accounts',
  },
];

export const analyticsDataSets = {
  '7D': [
    { name: 'Mon', impressions: 42000, engagement: 12400, reach: 38000 },
    { name: 'Tue', impressions: 58000, engagement: 18200, reach: 51000 },
    { name: 'Wed', impressions: 65000, engagement: 22100, reach: 59000 },
    { name: 'Thu', impressions: 78000, engagement: 28400, reach: 72000 },
    { name: 'Fri', impressions: 92000, engagement: 34500, reach: 86000 },
    { name: 'Sat', impressions: 110000, engagement: 41200, reach: 98000 },
    { name: 'Sun', impressions: 128000, engagement: 48900, reach: 112000 },
  ],
  '30D': [
    { name: 'Week 1', impressions: 280000, engagement: 95000, reach: 240000 },
    { name: 'Week 2', impressions: 340000, engagement: 118000, reach: 295000 },
    { name: 'Week 3', impressions: 410000, engagement: 146000, reach: 360000 },
    { name: 'Week 4', impressions: 495000, engagement: 178000, reach: 430000 },
  ],
  '90D': [
    { name: 'Month 1', impressions: 1150000, engagement: 410000, reach: 980000 },
    { name: 'Month 2', impressions: 1480000, engagement: 530000, reach: 1250000 },
    { name: 'Month 3', impressions: 1890000, engagement: 690000, reach: 1620000 },
  ],
  '1Y': [
    { name: 'Q1', impressions: 3200000, engagement: 1120000, reach: 2800000 },
    { name: 'Q2', impressions: 4100000, engagement: 1480000, reach: 3600000 },
    { name: 'Q3', impressions: 5300000, engagement: 1950000, reach: 4700000 },
    { name: 'Q4', impressions: 6800000, engagement: 2540000, reach: 6100000 },
  ],
};

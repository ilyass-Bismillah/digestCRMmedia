'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Mail,
  Shield,
  Briefcase,
  CheckCircle2,
  Clock,
  MoreVertical,
  X,
  Send,
  Eye,
  Edit2,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { useDashboard } from '@/lib/dashboard-context';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Client' | 'Manager' | 'Team Member';
  dateAdded: string;
  status: 'active' | 'suspended';
  avatar: string;
}

const initialUsersList: UserRecord[] = [
  {
    id: 'u-1',
    name: 'Samantha William',
    email: 'samantha@digestmedia.co',
    role: 'Admin',
    dateAdded: 'Jan 12, 2024',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'u-2',
    name: 'Alex Rivera',
    email: 'alex@digestmedia.co',
    role: 'Team Member',
    dateAdded: 'Feb 04, 2024',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'u-3',
    name: 'Eleanor Vance',
    email: 'eleanor@auracosmetics.com',
    role: 'Client',
    dateAdded: 'Mar 18, 2024',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'u-4',
    name: 'Marcus Brody',
    email: 'marcus@nexusrobotics.ai',
    role: 'Client',
    dateAdded: 'Apr 22, 2024',
    status: 'suspended',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'u-5',
    name: 'Maya Lin',
    email: 'maya@digestmedia.co',
    role: 'Manager',
    dateAdded: 'May 09, 2024',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState<UserRecord[]>(initialUsersList);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showEmptyStatePreview, setShowEmptyStatePreview] = useState(false);

  // Modals
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [invitePreviewUser, setInvitePreviewUser] = useState<UserRecord | null>(null);

  // Form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'Admin' | 'Client' | 'Manager' | 'Team Member'>('Client');
  const [sendInvite, setSendInvite] = useState(true);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      roleFilter === 'all' || u.role.toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    const newUser: UserRecord = {
      id: `u-${Date.now()}`,
      name: newName,
      email: newEmail,
      role: newRole,
      dateAdded: 'Today',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    };

    setUsers([newUser, ...users]);
    setIsAddUserModalOpen(false);
    if (sendInvite) {
      setInvitePreviewUser(newUser);
    }
    setNewName('');
    setNewEmail('');
  };

  const handleToggleStatus = (id: string) => {
    setUsers(
      users.map((u) =>
        u.id === id
          ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' }
          : u
      )
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header matching Figma Board 2 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Users
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage agency administrators, account managers, and client access permissions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowEmptyStatePreview(!showEmptyStatePreview)}
            className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            {showEmptyStatePreview ? 'Show Users Table' : 'Preview Empty State'}
          </button>
          <button
            type="button"
            onClick={() => setIsAddUserModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-[#C02586] hover:bg-[#A01E6F] text-white shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>+ Add User</span>
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
            placeholder="Search user name or email..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C02586] transition-all"
          />
        </div>

        {/* Role Filter Pills matching Figma */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {['all', 'Admin', 'Client', 'Manager', 'Team Member'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRoleFilter(r)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                roleFilter.toLowerCase() === r.toLowerCase()
                  ? 'bg-[#C02586] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {r === 'all' ? 'All Roles' : r}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State or Table View */}
      {showEmptyStatePreview || filteredUsers.length === 0 ? (
        /* Empty State matching Figma Board 2 */
        <div className="rounded-2xl bg-white p-12 text-center border border-slate-200/80 shadow-xs">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#C02586]/10 text-[#C02586] ring-8 ring-[#C02586]/5">
            <Users className="h-10 w-10" />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-900">
            No users found
          </h3>
          <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
            No team members or clients have been invited yet. Add a user to grant dashboard access.
          </p>
          <button
            type="button"
            onClick={() => setIsAddUserModalOpen(true)}
            className="mt-6 inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-xl bg-[#C02586] hover:bg-[#A01E6F] text-white shadow-sm transition-all cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>+ Add User</span>
          </button>
        </div>
      ) : (
        /* Users Table matching Figma Board 2 */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Date Added</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="h-9 w-9 rounded-full object-cover ring-2 ring-slate-100"
                        />
                        <div>
                          <p className="font-bold text-slate-900 text-xs">{u.name}</p>
                          <p className="text-[11px] text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          u.role === 'Admin'
                            ? 'bg-[#C02586]/10 text-[#C02586]'
                            : u.role === 'Client'
                            ? 'bg-blue-50 text-blue-700'
                            : u.role === 'Manager'
                            ? 'bg-purple-50 text-purple-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-medium">
                      {u.dateAdded}
                    </td>
                    <td className="py-3.5 px-4">
                      {u.status === 'active' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Suspended
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setInvitePreviewUser(u)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 font-medium text-[11px] transition-colors flex items-center gap-1"
                          title="Preview invitation email"
                        >
                          <Mail className="h-3 w-3 text-[#C02586]" />
                          <span>Invite Email</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(u.id)}
                          className="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 text-[11px] font-medium"
                        >
                          {u.status === 'active' ? 'Suspend' : 'Activate'}
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

      {/* Add User Modal matching Figma Board 2 */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add New User</h3>
              <button
                type="button"
                onClick={() => setIsAddUserModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Marcus Brody"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#C02586]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="marcus@nexusrobotics.ai"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#C02586]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Role
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#C02586]"
                >
                  <option value="Client">Client (Dashboard & Balance View)</option>
                  <option value="Team Member">Team Member (Tasks & Queue)</option>
                  <option value="Manager">Account Manager (Clients & Campaigns)</option>
                  <option value="Admin">Administrator (Full Access)</option>
                </select>
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 select-none">
                  <input
                    type="checkbox"
                    checked={sendInvite}
                    onChange={(e) => setSendInvite(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 accent-[#C02586]"
                  />
                  <span>Send invitation email with temporary password</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#C02586] hover:bg-[#A01E6F] rounded-xl shadow-xs"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite Email Preview Modal matching Figma Board 2 */}
      {invitePreviewUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#C02586]" />
                <h3 className="text-base font-bold text-slate-900">Email Invitation</h3>
              </div>
              <button
                type="button"
                onClick={() => setInvitePreviewUser(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Rendered Email Template Preview matching Figma Board 2 */}
            <div className="mt-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 px-2 items-center justify-center rounded-lg bg-[#C02586] text-white font-black text-xs">
                  DM
                </div>
                <span className="font-bold text-slate-800">Digest Media App</span>
              </div>
              <p className="text-slate-800 font-semibold">Hello {invitePreviewUser.name},</p>
              <p className="text-slate-600 leading-relaxed">
                You have been invited to join the <span className="font-bold text-slate-900">Digest Media App Manager</span> workspace as a <span className="font-bold text-[#C02586]">{invitePreviewUser.role}</span>.
              </p>
              <p className="text-slate-600">
                To activate your account and set your secure password, click the link below:
              </p>
              <div className="py-1">
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="inline-block px-4 py-2 bg-[#C02586] text-white font-semibold rounded-xl text-xs"
                >
                  Accept & Activate Account
                </a>
              </div>
              <p className="text-[10px] text-slate-400 pt-2 border-t border-slate-200">
                Digest Media 2024. All rights reserved.
              </p>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setInvitePreviewUser(null)}
                className="px-5 py-2 text-xs font-semibold text-white bg-[#C02586] hover:bg-[#A01E6F] rounded-xl shadow-xs"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

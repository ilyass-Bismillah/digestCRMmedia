'use client';

import React, { useState } from 'react';
import {
  User,
  Key,
  CheckCircle2,
  Edit2,
  Camera,
  Check,
  X,
  Lock,
  Mail,
  Phone,
  Briefcase,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'personal' | 'password'>('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [saveToast, setSaveToast] = useState('');

  // Personal details state
  const [firstName, setFirstName] = useState(user?.name?.split(' ')[0] || 'Samantha');
  const [lastName, setLastName] = useState(user?.name?.split(' ')[1] || 'William');
  const [email, setEmail] = useState(user?.email || 'samantha@digestmedia.co');
  const [phone, setPhone] = useState('+1 (555) 234-5678');
  const [position, setPosition] = useState(user?.title || 'Account Director');

  // Avatar state
  const avatarInputRef = React.useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'avatars');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.publicUrl) {
        setAvatarUrl(data.publicUrl);
        setSaveToast('Profile avatar uploaded to Cloudflare R2!');
        setTimeout(() => setSaveToast(''), 3000);
      }
    } catch (err) {
      console.warn('Avatar upload failed:', err);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSavePersonal = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    setSaveToast('Personal details updated successfully!');
    setTimeout(() => setSaveToast(''), 3000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    if (!currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setSaveToast('Password updated successfully!');
    setTimeout(() => setSaveToast(''), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Account Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your personal profile, contact information, and security credentials.
          </p>
        </div>

        {saveToast && (
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{saveToast}</span>
          </div>
        )}
      </div>

      {/* Tabs matching Figma Board 1 */}
      <div className="flex border-b border-slate-200 gap-8">
        <button
          type="button"
          onClick={() => setActiveTab('personal')}
          className={`pb-3 text-sm font-semibold transition-all border-b-2 ${
            activeTab === 'personal'
              ? 'border-berry text-berry'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Personal details
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('password')}
          className={`pb-3 text-sm font-semibold transition-all border-b-2 ${
            activeTab === 'password'
              ? 'border-berry text-berry'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Change Password
        </button>
      </div>

      {/* Tab 1: Personal Details (View & Edit matching Figma) */}
      {activeTab === 'personal' && (
        <div className="rounded-2xl bg-white p-6 sm:p-8 border border-slate-200/80 shadow-xs relative">
          <div className="flex items-center justify-between pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="relative">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="h-20 w-20 rounded-full object-cover ring-4 ring-berry/15"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-berry text-white font-black text-2xl shadow-md ring-4 ring-berry/15">
                    {firstName[0]}{lastName[0]}
                  </div>
                )}
                <input
                  type="file"
                  ref={avatarInputRef}
                  onChange={handleAvatarUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-1.5 rounded-full bg-white text-slate-700 border border-slate-200 shadow-sm hover:text-berry transition-colors"
                  title="Change avatar (Cloudflare R2)"
                >
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {firstName} {lastName}
                </h3>
                <p className="text-xs text-slate-500">{position}</p>
                <span className="mt-1 inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-berry/10 text-berry">
                  {user?.role === 'admin' ? 'Administrator' : 'Client User'}
                </span>
              </div>
            </div>

            {!isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-all"
              >
                <Edit2 className="h-3.5 w-3.5 text-berry" />
                <span>Edit Details</span>
              </button>
            )}
          </div>

          <form onSubmit={handleSavePersonal} className="mt-6 space-y-4 max-w-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 disabled:bg-slate-50 disabled:text-slate-700 focus:outline-none focus:ring-2 focus:ring-berry transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 disabled:bg-slate-50 disabled:text-slate-700 focus:outline-none focus:ring-2 focus:ring-berry transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  disabled={!isEditing}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 disabled:bg-slate-50 disabled:text-slate-700 focus:outline-none focus:ring-2 focus:ring-berry transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="tel"
                  disabled={!isEditing}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 disabled:bg-slate-50 disabled:text-slate-700 focus:outline-none focus:ring-2 focus:ring-berry transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Role / Position
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  disabled={!isEditing}
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 disabled:bg-slate-50 disabled:text-slate-700 focus:outline-none focus:ring-2 focus:ring-berry transition-all"
                />
              </div>
            </div>

            {isEditing && (
              <div className="flex items-center gap-3 pt-4">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-berry hover:bg-[#A01E6F] text-white text-xs font-semibold shadow-sm transition-all"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-all"
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>
      )}

      {/* Tab 2: Change Password matching Figma Board 1 */}
      {activeTab === 'password' && (
        <div className="rounded-2xl bg-white p-6 sm:p-8 border border-slate-200/80 shadow-xs max-w-xl">
          <h3 className="text-base font-bold text-slate-900 mb-1">
            Update Your Password
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Ensure your account is using a long, random password to stay secure.
          </p>

          {passwordError && (
            <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200/80 p-3 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Current Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-berry transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-berry transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-berry transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 px-5 py-2.5 rounded-xl bg-berry hover:bg-[#A01E6F] text-white text-xs font-semibold shadow-sm transition-all"
            >
              Change Password
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

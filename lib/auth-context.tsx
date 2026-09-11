'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { updateProfileRecord } from '@/lib/services/database';

export type UserRole = 'admin' | 'user';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  title: string;
  department?: string;
  phone?: string;
}

export const DEMO_USERS: Record<UserRole, AuthUser> = {
  admin: {
    id: 'usr-admin-1',
    name: 'Sarah Jenkins',
    email: 'admin@digestmedia.co',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    title: 'Creative Director & Agency Admin',
    department: 'Executive Operations',
    phone: '+1 (555) 234-5678',
  },
  user: {
    id: 'usr-creator-2',
    name: 'Alex Rivera',
    email: 'user@digestmedia.co',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    title: 'Content Creator & Senior Editor',
    department: 'Video Production',
    phone: '+1 (555) 876-5432',
  },
};

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string, role?: UserRole) => Promise<boolean>;
  signup: (name: string, email: string, password?: string, role?: UserRole) => Promise<boolean>;
  logout: () => Promise<void>;
  switchRole: (newRole: UserRole) => void;
  resetPassword: (email: string) => Promise<boolean>;
  updatePassword: (password: string) => Promise<boolean>;
  updateProfile: (updates: { name?: string; avatar?: string; title?: string; phone?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'digest_media_auth_session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load session from Supabase or LocalStorage on mount
  useEffect(() => {
    let isMounted = true;
    const supabase = createClient();

    async function initAuth() {
      if (supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && isMounted) {
            // Fetch profile for role and details
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            const authed: AuthUser = {
              id: session.user.id,
              name: profile?.full_name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
              email: session.user.email || '',
              role: (profile?.role as UserRole) || (session.user.user_metadata?.role as UserRole) || 'user',
              avatar: profile?.avatar_url || session.user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
              title: profile?.job_title || 'Digest Media Member',
              department: 'Media Operations',
              phone: profile?.phone || '',
            };
            setUser(authed);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(authed));
            setIsLoading(false);
            return;
          }
        } catch (err) {
          console.warn('Supabase auth session check failed:', err);
        }
      }

      // Fallback to local storage or demo admin
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored && isMounted) {
          setUser(JSON.parse(stored));
        } else if (isMounted) {
          setUser(DEMO_USERS.admin);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_USERS.admin));
        }
      } catch (e) {
        if (isMounted) setUser(DEMO_USERS.admin);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    initAuth();

    // Listen to Supabase auth state changes if client is available
    let subscription: any = null;
    if (supabase) {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const authed: AuthUser = {
            id: session.user.id,
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            role: (session.user.user_metadata?.role as UserRole) || 'user',
            avatar: session.user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
            title: 'Digest Media Member',
            department: 'Media Operations',
          };
          setUser(authed);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(authed));
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem(STORAGE_KEY);
        }
      });
      subscription = data.subscription;
    }

    return () => {
      isMounted = false;
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password?: string, role?: UserRole): Promise<boolean> => {
    setIsLoading(true);
    const supabase = createClient();

    if (supabase && password && !role) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setIsLoading(false);
        throw new Error(error.message);
      }

      if (data.user) {
        const authed: AuthUser = {
          id: data.user.id,
          name: data.user.user_metadata?.full_name || email.split('@')[0],
          email: data.user.email || email,
          role: (data.user.user_metadata?.role as UserRole) || 'user',
          avatar: data.user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
          title: 'Digest Media Member',
        };
        setUser(authed);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(authed));
        setIsLoading(false);
        return true;
      }
    }

    // Demo Login fallback
    await new Promise((res) => setTimeout(res, 400));
    let authenticatedUser: AuthUser;
    if (role) {
      authenticatedUser = DEMO_USERS[role];
    } else if (email.toLowerCase().includes('user') || email.toLowerCase().includes('creator')) {
      authenticatedUser = { ...DEMO_USERS.user, email };
    } else {
      authenticatedUser = { ...DEMO_USERS.admin, email };
    }

    setUser(authenticatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authenticatedUser));
    setIsLoading(false);
    return true;
  };

  const signup = async (
    name: string,
    email: string,
    password?: string,
    role: UserRole = 'user'
  ): Promise<boolean> => {
    setIsLoading(true);
    const supabase = createClient();

    if (supabase && password) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role,
          },
        },
      });

      if (error) {
        setIsLoading(false);
        throw new Error(error.message);
      }

      if (data.user) {
        const newUser: AuthUser = {
          id: data.user.id,
          name,
          email,
          role,
          avatar: role === 'admin'
            ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
          title: role === 'admin' ? 'Agency Manager' : 'Creative Contributor',
          department: 'Digital Media Studio',
        };
        setUser(newUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
        setIsLoading(false);
        return true;
      }
    }

    await new Promise((res) => setTimeout(res, 400));
    const newUser: AuthUser = {
      id: `usr-${Date.now()}`,
      name,
      email,
      role,
      avatar:
        role === 'admin'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      title: role === 'admin' ? 'Agency Manager' : 'Creative Contributor',
      department: 'Digital Media Studio',
    };

    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  };

  const logout = async () => {
    const supabase = createClient();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Supabase signOut error:', e);
      }
    }
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    router.push('/login');
  };

  const switchRole = (newRole: UserRole) => {
    const updated = DEMO_USERS[newRole];
    setUser(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    const supabase = createClient();
    if (supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        throw new Error(error.message);
      }
    }
    await new Promise((res) => setTimeout(res, 400));
    return true;
  };

  const updatePassword = async (password: string): Promise<boolean> => {
    const supabase = createClient();
    if (supabase) {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        throw new Error(error.message);
      }
      return true;
    }
    await new Promise((res) => setTimeout(res, 400));
    return true;
  };

  const updateProfile = async (updates: { name?: string; avatar?: string; title?: string; phone?: string }) => {
    if (!user) return;
    const updatedUser: AuthUser = {
      ...user,
      ...(updates.name ? { name: updates.name } : {}),
      ...(updates.avatar ? { avatar: updates.avatar } : {}),
      ...(updates.title ? { title: updates.title } : {}),
      ...(updates.phone ? { phone: updates.phone } : {}),
    };
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));

    if (user.id && !user.id.startsWith('usr-')) {
      await updateProfileRecord(user.id, {
        full_name: updates.name,
        avatar_url: updates.avatar,
        job_title: updates.title,
        phone: updates.phone,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        switchRole,
        resetPassword,
        updatePassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

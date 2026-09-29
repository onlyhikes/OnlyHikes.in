import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext({
  user: null,
  profile: null,
  isAdmin: false,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  resetPassword: async () => {},
  updateProfile: async () => {},
  loginAsDemoStudent: () => {},
  loginAsDemoAdmin: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for persistent demo/cached sessions
    const initAuth = async () => {
      try {
        if (supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser(session.user);
            localStorage.setItem('onlyhikes_token', session.access_token);
            await fetchSupabaseProfile(session.user.id);
          }
          supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
              setUser(session.user);
              localStorage.setItem('onlyhikes_token', session.access_token);
              await fetchSupabaseProfile(session.user.id);
            } else {
              // check if demo user is stored
              checkDemoStorage();
            }
          });
        } else {
          checkDemoStorage();
        }
      } catch (err) {
        console.warn('Auth init check:', err);
        checkDemoStorage();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const checkDemoStorage = () => {
    if (typeof window === 'undefined') return;
    const storedUser = localStorage.getItem('onlyhikes_demo_user');
    const storedRole = localStorage.getItem('onlyhikes_demo_role');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        setProfile(parsed);
        setIsAdmin(storedRole === 'admin');
        localStorage.setItem('onlyhikes_token', parsed.id);
        if (storedRole === 'admin') {
          localStorage.setItem('onlyhikes_admin_key', process.env.NEXT_PUBLIC_ADMIN_DEV_KEY || 'onlyhikes_jaipur_admin_2026');
        }
      } catch (e) {}
    }
  };

  const fetchSupabaseProfile = async (userId) => {
    if (!supabase) return;
    try {
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (prof) setProfile(prof);

      const { data: adminRecord } = await supabase.from('admin_roles').select('*').eq('user_id', userId).single();
      setIsAdmin(Boolean(adminRecord));
    } catch (e) {
      console.warn('Profile fetch error:', e);
    }
  };

  // Sign up
  const signup = async ({ email, password, fullName, phone, college, city = 'Jaipur' }) => {
    if (supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone,
            college,
            city,
          }
        }
      });
      if (error) throw error;
      return data;
    }

    // Demo signup
    const demoUser = {
      id: `demo_user_${Date.now()}`,
      email,
      full_name: fullName,
      phone,
      college,
      city,
      referral_code: `${fullName.split(' ')[0].toUpperCase()}50`,
      referral_count: 0,
      rewards_earned: 0
    };
    localStorage.setItem('onlyhikes_demo_user', JSON.stringify(demoUser));
    localStorage.setItem('onlyhikes_token', demoUser.id);
    setUser(demoUser);
    setProfile(demoUser);
    setIsAdmin(false);
    return { user: demoUser };
  };

  // Log in
  const login = async ({ email, password }) => {
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    }

    // Demo login fallback
    const demoUser = {
      id: 'demo_user_jaipur_01',
      email,
      full_name: 'Jaipur Explorer',
      phone: '+91 98290 12345',
      college: 'MNIT Jaipur',
      city: 'Jaipur',
      referral_code: 'EXPLORE50',
      referral_count: 2,
      rewards_earned: 100
    };
    localStorage.setItem('onlyhikes_demo_user', JSON.stringify(demoUser));
    localStorage.setItem('onlyhikes_token', demoUser.id);
    setUser(demoUser);
    setProfile(demoUser);
    setIsAdmin(false);
    return { user: demoUser };
  };

  // Log out
  const logout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('onlyhikes_demo_user');
    localStorage.removeItem('onlyhikes_demo_role');
    localStorage.removeItem('onlyhikes_token');
    localStorage.removeItem('onlyhikes_admin_key');
    setUser(null);
    setProfile(null);
    setIsAdmin(false);
  };

  // Password Reset
  const resetPassword = async (email) => {
    if (supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/account/reset-password`
      });
      if (error) throw error;
      return true;
    }
    return true;
  };

  // Update Profile
  const updateProfile = async (updates) => {
    if (supabase && user) {
      const { data, error } = await supabase.from('profiles').update(updates).eq('id', user.id).select().single();
      if (error) throw error;
      setProfile(data);
      return data;
    }

    const updated = { ...profile, ...updates };
    setProfile(updated);
    localStorage.setItem('onlyhikes_demo_user', JSON.stringify(updated));
    return updated;
  };

  // One-click quick demo buttons for judges / users
  const loginAsDemoStudent = () => {
    const student = {
      id: 'demo_student_aarav',
      email: 'aarav.sharma@mnit.ac.in',
      full_name: 'Aarav Sharma',
      phone: '+91 98290 12345',
      college: 'MNIT Jaipur · CSE \'25',
      city: 'Jaipur',
      referral_code: 'AARAV50',
      referral_count: 3,
      rewards_earned: 150
    };
    localStorage.setItem('onlyhikes_demo_user', JSON.stringify(student));
    localStorage.setItem('onlyhikes_demo_role', 'student');
    localStorage.setItem('onlyhikes_token', student.id);
    localStorage.removeItem('onlyhikes_admin_key');
    setUser(student);
    setProfile(student);
    setIsAdmin(false);
  };

  const loginAsDemoAdmin = () => {
    const adminUser = {
      id: 'demo_admin_marshal',
      email: 'chief.marshal@onlyhikes.in',
      full_name: 'OnlyHikes Lead Trek Coordinator',
      phone: '+91 94140 00000',
      college: 'Trek Operations Jaipur',
      city: 'Jaipur',
      is_admin: true
    };
    localStorage.setItem('onlyhikes_demo_user', JSON.stringify(adminUser));
    localStorage.setItem('onlyhikes_demo_role', 'admin');
    localStorage.setItem('onlyhikes_token', 'admin_token_demo');
    localStorage.setItem('onlyhikes_admin_key', process.env.NEXT_PUBLIC_ADMIN_DEV_KEY || 'onlyhikes_jaipur_admin_2026');
    setUser(adminUser);
    setProfile(adminUser);
    setIsAdmin(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAdmin,
        loading,
        login,
        signup,
        logout,
        resetPassword,
        updateProfile,
        loginAsDemoStudent,
        loginAsDemoAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

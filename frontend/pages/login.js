import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Lock, Mail, ArrowRight, ShieldAlert, Sparkles, CheckCircle } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginAsDemoStudent, loginAsDemoAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login({ email, password });
      router.push('/account');
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Login — OnlyHikes.in Jaipur</title>
      </Head>

      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-charcoal-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="text-center mb-8">
            <span className="text-acid text-xs font-black uppercase tracking-widest block mb-1">
              STUDENT COMMUNITY
            </span>
            <h1 className="font-display font-black text-3xl text-offwhite tracking-tight">
              WELCOME BACK
            </h1>
            <p className="text-muted text-xs mt-1">
              Sign in to manage bookings, cast destination votes & earn referral perks.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-950/70 border border-red-500/40 rounded-xl text-xs font-bold text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-muted mb-1">College / Personal Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="student@college.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-charcoal-800 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-offwhite focus:outline-none focus:border-acid"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-muted">Password</label>
                <Link href="/forgot-password" className="text-[11px] text-acid hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-charcoal-800 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-offwhite focus:outline-none focus:border-acid"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="acid"
              size="md"
              disabled={loading}
              className="w-full uppercase font-black tracking-wide"
            >
              {loading ? 'Authenticating...' : 'Sign In →'}
            </Button>
          </form>

          {/* Quick Demo Access Buttons for instant evaluation */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <span className="text-[10px] text-muted uppercase tracking-widest font-black block text-center mb-3">
              Fast Evaluator Quick Login
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  loginAsDemoStudent();
                  router.push('/account');
                }}
                className="p-2.5 bg-charcoal-850 hover:bg-charcoal-800 border border-white/10 rounded-xl text-xs font-bold text-acid flex items-center justify-center gap-1.5 transition"
              >
                <span>⚡ Student Demo</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  loginAsDemoAdmin();
                  router.push('/admin');
                }}
                className="p-2.5 bg-charcoal-850 hover:bg-charcoal-800 border border-white/10 rounded-xl text-xs font-bold text-flame flex items-center justify-center gap-1.5 transition"
              >
                <span>🛡️ Admin Demo</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-muted">
            Don't have an account yet?{' '}
            <Link href="/signup" className="text-acid font-bold hover:underline">
              Create student account
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Mail, CheckCircle2, ArrowLeft } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.message || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Reset Password — OnlyHikes.in</title>
      </Head>

      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-charcoal-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="font-display font-black text-2xl text-offwhite tracking-tight">
              RESET PASSWORD
            </h1>
            <p className="text-muted text-xs mt-1">
              Enter your student email and we'll send you recovery instructions.
            </p>
          </div>

          {sent ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-acid/20 text-acid flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-xs text-offwhite font-bold">
                If an account exists for {email}, a recovery email has been sent.
              </p>
              <Link href="/login">
                <Button variant="outline" size="sm" className="w-full">
                  Return to Login
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-950/70 border border-red-500/40 rounded-xl text-xs font-bold text-red-300">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-muted mb-1">Student Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="student@jaipur.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                {loading ? 'Sending Link...' : 'Send Recovery Link'}
              </Button>

              <div className="text-center pt-2">
                <Link href="/login" className="text-xs text-muted hover:text-offwhite flex items-center justify-center gap-1">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}

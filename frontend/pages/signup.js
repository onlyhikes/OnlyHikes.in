import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { User, Mail, Lock, Phone, GraduationCap, MapPin, ArrowRight } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    college: '',
    city: 'Jaipur',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signup(form);
      router.push('/account');
    } catch (err) {
      setError(err.message || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Sign Up — OnlyHikes.in Jaipur Student Community</title>
      </Head>

      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-charcoal-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="text-center mb-8">
            <span className="text-acid text-xs font-black uppercase tracking-widest block mb-1">
              JOIN JAIPUR'S SQUAD
            </span>
            <h1 className="font-display font-black text-3xl text-offwhite tracking-tight">
              CREATE ACCOUNT
            </h1>
            <p className="text-muted text-xs mt-1">
              Get ₹50 off your first trek pass and vote for upcoming weekend trails.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-950/70 border border-red-500/40 rounded-xl text-xs font-bold text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-muted mb-1">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Tanvi Mathur"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="w-full bg-charcoal-800 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-offwhite focus:outline-none focus:border-acid"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-muted mb-1">Student / Personal Email *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="student@jaipur.edu"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-charcoal-800 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-offwhite focus:outline-none focus:border-acid"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-muted mb-1">Phone / WhatsApp *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="tel"
                    required
                    placeholder="+91..."
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-charcoal-800 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-offwhite focus:outline-none focus:border-acid"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted mb-1">City</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full bg-charcoal-800 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-offwhite focus:outline-none focus:border-acid"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-muted mb-1">College / University Name</label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="e.g. MNIT / Manipal / Amity / JECRC"
                  value={form.college}
                  onChange={(e) => setForm({ ...form, college: e.target.value })}
                  className="w-full bg-charcoal-800 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-offwhite focus:outline-none focus:border-acid"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-muted mb-1">Create Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  required
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
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
              {loading ? 'Creating Student Profile...' : 'Complete Signup →'}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-muted">
            Already have an account?{' '}
            <Link href="/login" className="text-acid font-bold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

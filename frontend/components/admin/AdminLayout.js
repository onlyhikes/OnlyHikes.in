import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  LayoutDashboard,
  Mountain,
  Ticket,
  Bus,
  Vote,
  Tag,
  Users,
  ArrowLeft,
  ShieldAlert,
  Lock,
  KeyRound,
  LogOut,
  AlertCircle
} from 'lucide-react';
import Button from '../ui/Button';

export default function AdminLayout({ children, title, subtitle, action }) {
  const router = useRouter();
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [verifying, setVerifying] = useState(true);

  const MASTER_KEY = process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY || 'onlyhikes_jaipur_admin_2026';

  useEffect(() => {
    // Check if previously unlocked
    const stored = localStorage.getItem('onlyhikes_admin_key');
    if (stored === MASTER_KEY) {
      setIsUnlocked(true);
    }
    setVerifying(false);
  }, [MASTER_KEY]);

  const handleUnlock = (e) => {
    e.preventDefault();
    setError('');
    if (passcode.trim() === MASTER_KEY) {
      localStorage.setItem('onlyhikes_admin_key', MASTER_KEY);
      setIsUnlocked(true);
    } else {
      setError('Invalid admin passcode. Access denied.');
    }
  };

  const handleLock = () => {
    localStorage.removeItem('onlyhikes_admin_key');
    setIsUnlocked(false);
    setPasscode('');
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-charcoal-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-acid border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Security Gate if not unlocked
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-charcoal-950 text-offwhite flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-charcoal-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-flame/10 rounded-full blur-2xl pointer-events-none" />

          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-flame/10 border border-flame/30 text-flame flex items-center justify-center mx-auto mb-4">
              <Lock className="w-7 h-7" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-flame bg-flame/10 px-3 py-1 rounded-full border border-flame/20">
              Restricted Area
            </span>
            <h1 className="font-display font-black text-2xl text-offwhite mt-3">
              COORDINATOR OPS
            </h1>
            <p className="text-muted text-xs mt-1">
              This portal is restricted to OnlyHikes organizers. Enter your secret passcode to access bookings, revenue, and hike controls.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
                Admin Passcode
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter admin passcode"
                  required
                  autoFocus
                  className="w-full bg-charcoal-950 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-offwhite placeholder:text-muted/40 focus:outline-none focus:border-acid transition"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-950/60 border border-red-500/30 rounded-xl text-xs font-bold text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" variant="acid" size="md" className="w-full uppercase font-black">
              Unlock Admin Portal →
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-offwhite transition">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to OnlyHikes Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Hikes & Posters', href: '/admin/hikes', icon: Mountain },
    { label: 'Bookings & Manifest', href: '/admin/bookings', icon: Ticket },
    { label: 'Pickup Points', href: '/admin/pickups', icon: Bus },
    { label: 'Community Voting', href: '/admin/voting', icon: Vote },
    { label: 'Coupons', href: '/admin/coupons', icon: Tag },
    { label: 'Registered Students', href: '/admin/users', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-charcoal-950 text-offwhite flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-charcoal-900 border-b md:border-b-0 md:border-r border-white/10 flex flex-col shrink-0">
        {/* Brand */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-acid flex items-center justify-center font-black text-charcoal-950 text-xs">
              ▲
            </div>
            <div>
              <span className="font-display font-black text-lg text-offwhite">
                ONLYHIKES
              </span>
              <span className="block text-[10px] text-flame font-bold tracking-widest uppercase">
                Coordinator Ops
              </span>
            </div>
          </Link>
          <Link href="/" title="Back to Student Website" className="text-muted hover:text-offwhite transition">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1.5 flex-grow">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = router.pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                  active
                    ? 'bg-acid text-charcoal-950 shadow-acid-sm'
                    : 'text-muted hover:text-offwhite hover:bg-charcoal-800'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Admin status and lock button */}
        <div className="p-4 border-t border-white/10 bg-charcoal-950/60">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-offwhite">
                Admin Authenticated
              </span>
            </div>
          </div>
          <button
            onClick={handleLock}
            className="w-full text-center py-2 px-3 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            Lock & Logout Admin
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-6 md:p-10 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
          <div>
            <h1 className="font-display font-black text-2xl md:text-3xl text-offwhite">
              {title}
            </h1>
            {subtitle && (
              <p className="text-muted text-xs md:text-sm mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>

        {/* Body */}
        {children}
      </main>
    </div>
  );
}

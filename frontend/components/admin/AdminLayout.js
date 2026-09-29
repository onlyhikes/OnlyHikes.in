import React from 'react';
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
  Settings,
  ArrowLeft,
  ShieldAlert,
  FileSpreadsheet
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout({ children, title, subtitle, action }) {
  const router = useRouter();
  const { user, isAdmin, loginAsDemoAdmin } = useAuth();

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

        {/* Admin status pill */}
        <div className="p-4 border-t border-white/10 bg-charcoal-950/60">
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-offwhite">
              {isAdmin ? 'Admin Mode Active' : 'Public Preview'}
            </span>
          </div>
          {!isAdmin && (
            <button
              onClick={loginAsDemoAdmin}
              className="w-full text-center py-2 px-3 bg-flame/20 hover:bg-flame/30 text-flame border border-flame/30 rounded-lg text-xs font-extrabold uppercase"
            >
              Activate Admin Session
            </button>
          )}
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

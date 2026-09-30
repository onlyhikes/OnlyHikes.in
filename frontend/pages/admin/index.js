import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Mountain,
  Ticket,
  Users,
  IndianRupee,
  Tag,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  FileText,
  Image,
  MapPin,
  Settings
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { getAdminOverview } from '../../lib/api';

export default function AdminOverviewPage() {
  const [metrics, setMetrics] = useState({
    upcoming_hikes: 0,
    total_bookings: 0,
    paid_bookings_count: 0,
    pending_bookings_count: 0,
    total_revenue: 0,
    total_users: 0,
    active_coupons: 0,
    recent_bookings: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const res = await getAdminOverview();
        if (res.data) setMetrics(res.data);
      } catch (err) {
        console.error('Failed to load admin metrics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMetrics();
  }, []);

  const statCards = [
    {
      label: 'Verified Revenue',
      value: `₹${(metrics.total_revenue || 0).toLocaleString('en-IN')}`,
      subtext: `${metrics.paid_bookings_count || 0} paid bookings`,
      icon: IndianRupee,
      color: 'text-acid',
      bgColor: 'bg-acid/10'
    },
    {
      label: 'Total Bookings',
      value: metrics.total_bookings || 0,
      subtext: `${metrics.pending_bookings_count || 0} pending confirmation`,
      icon: Ticket,
      color: 'text-flame',
      bgColor: 'bg-flame/10'
    },
    {
      label: 'Upcoming Hikes',
      value: metrics.upcoming_hikes || 0,
      subtext: 'Published live trails',
      icon: Mountain,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10'
    },
    {
      label: 'Registered Students',
      value: metrics.total_users || 0,
      subtext: 'Student profiles in database',
      icon: Users,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10'
    },
    {
      label: 'Active Coupons',
      value: metrics.active_coupons || 0,
      subtext: 'Discount codes redeemable',
      icon: Tag,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-400/10'
    }
  ];

  const quickActions = [
    { title: 'Hikes & Media', desc: 'Create, edit pricing & publish hikes', href: '/admin/hikes', icon: Mountain },
    { title: 'Site Content CMS', desc: 'Edit Hero, Why Us, How It Works text', href: '/admin/content', icon: FileText },
    { title: 'Media Library', desc: 'Upload posters, reels & photos', href: '/admin/media', icon: Image },
    { title: 'Route Waypoints', desc: 'Set step-by-step route journey markers', href: '/admin/routes', icon: MapPin },
    { title: 'Brand & Socials', desc: 'Update WhatsApp channel & Instagram links', href: '/admin/brand', icon: Settings },
    { title: 'Passenger Manifest', desc: 'Check attendee lists & pickup spots', href: '/admin/bookings', icon: Ticket }
  ];

  return (
    <AdminLayout
      title="COORDINATOR CONTROL ROOM"
      subtitle="Real-time expedition KPIs, seat occupancies, and student manifests"
      action={
        <div className="flex items-center gap-3">
          <Link href="/admin/hikes">
            <Button variant="acid" size="sm" icon={Plus}>
              Create Hike
            </Button>
          </Link>
        </div>
      }
    >
      <Head>
        <title>Admin Overview — OnlyHikes.in Coordinator Portal</title>
      </Head>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 mb-10">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-charcoal-900 border border-white/10 rounded-2xl p-5 relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
                  {stat.label}
                </span>
                <div className={`w-8 h-8 rounded-xl ${stat.bgColor} ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="flex flex-col">
                <span className="font-display font-black text-2xl text-offwhite">
                  {loading ? '...' : stat.value}
                </span>
                <span className="text-[11px] font-medium text-muted mt-1">
                  {stat.subtext}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Launch Cards */}
      <div className="mb-10">
        <h2 className="text-xs font-black uppercase tracking-widest text-muted mb-4">
          Quick Management Modules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((qa, idx) => {
            const Icon = qa.icon;
            return (
              <Link
                key={idx}
                href={qa.href}
                className="bg-charcoal-900 border border-white/10 hover:border-acid/40 rounded-2xl p-5 flex items-center justify-between transition group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-charcoal-800 text-acid group-hover:bg-acid group-hover:text-charcoal-950 flex items-center justify-center transition">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-sm text-offwhite group-hover:text-acid transition">
                      {qa.title}
                    </h3>
                    <p className="text-muted text-[11px] mt-0.5">
                      {qa.desc}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted group-hover:text-acid group-hover:translate-x-1 transition" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Live Bookings Table */}
      <div className="bg-charcoal-900 border border-white/10 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display font-black text-lg text-offwhite">
              Recent Student Bookings
            </h2>
            <p className="text-muted text-xs mt-0.5">
              Real bookings recorded in Supabase / PostgreSQL database
            </p>
          </div>
          <Link href="/admin/bookings">
            <Button variant="ghost" size="sm">
              View All Manifests →
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="py-8 text-center text-muted text-xs">Loading live bookings...</div>
        ) : metrics.recent_bookings && metrics.recent_bookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-charcoal-950/60 text-muted uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-4 py-3 rounded-l-xl">Ref</th>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Seats</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 rounded-r-xl">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {metrics.recent_bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-charcoal-800/40">
                    <td className="px-4 py-3.5 font-mono text-acid font-bold">
                      {b.booking_ref}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-offwhite">
                      {b.student_name}
                      <span className="block text-[11px] text-muted font-normal">{b.student_email}</span>
                    </td>
                    <td className="px-4 py-3.5 text-offwhite font-bold">
                      {b.seats_count || 1}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-offwhite">
                      ₹{b.total_amount}
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge variant={b.payment_status === 'paid' ? 'acid' : 'flame'} size="xs">
                        {b.payment_status || 'pending'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 text-muted">
                      {b.created_at ? new Date(b.created_at).toLocaleDateString('en-IN') : 'Recent'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center bg-charcoal-950/40 rounded-2xl border border-dashed border-white/10">
            <Ticket className="w-10 h-10 text-muted/40 mx-auto mb-3" />
            <h3 className="font-display font-bold text-sm text-offwhite">No Bookings Yet</h3>
            <p className="text-muted text-xs max-w-sm mx-auto mt-1">
              Real bookings will appear here as soon as students reserve seats on the website.
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

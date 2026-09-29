import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Mountain,
  Ticket,
  Users,
  IndianRupee,
  Tag,
  Vote,
  ArrowUpRight,
  TrendingUp,
  Download,
  Plus
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { getAdminOverview } from '../../lib/api';

export default function AdminOverviewPage() {
  const [metrics, setMetrics] = useState({
    upcoming_hikes: 4,
    total_bookings: 18,
    total_users: 120,
    total_revenue: 5382,
    active_coupons: 3,
    voting_participation: 430
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
      label: 'Total Revenue',
      value: `₹${metrics.total_revenue?.toLocaleString('en-IN') || '0'}`,
      icon: IndianRupee,
      color: 'text-acid',
      bgColor: 'bg-acid/10',
      change: '+24% this week'
    },
    {
      label: 'Total Bookings',
      value: metrics.total_bookings || 0,
      icon: Ticket,
      color: 'text-flame',
      bgColor: 'bg-flame/10',
      change: '18 confirmed'
    },
    {
      label: 'Scheduled Hikes',
      value: metrics.upcoming_hikes || 0,
      icon: Mountain,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      change: 'Aravali circuits'
    },
    {
      label: 'Registered Students',
      value: metrics.total_users || 0,
      icon: Users,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
      change: 'Across 6 colleges'
    },
    {
      label: 'Active Coupons',
      value: metrics.active_coupons || 0,
      icon: Tag,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-400/10',
      change: 'ONLYHIKES50 active'
    },
    {
      label: 'Voting Ballots',
      value: metrics.voting_participation || 0,
      icon: Vote,
      color: 'text-amber-400',
      bgColor: 'bg-amber-400/10',
      change: 'Round #42'
    },
  ];

  return (
    <AdminLayout
      title="COORDINATOR CONTROL ROOM"
      subtitle="Real-time expedition KPIs, seat occupancies, and student manifests"
      action={
        <div className="flex items-center gap-3">
          <Link href="/admin/hikes">
            <Button variant="acid" size="sm" icon={Plus}>
              New Hike
            </Button>
          </Link>
          <a
            href="http://localhost:5000/api/admin/export-csv"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-charcoal-800 hover:bg-charcoal-700 text-offwhite border border-white/10 px-3.5 py-2 rounded-xl text-xs font-bold transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Manifest CSV</span>
          </a>
        </div>
      }
    >
      <Head>
        <title>Admin Overview — OnlyHikes.in Coordinator Portal</title>
      </Head>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-charcoal-900 border border-white/10 rounded-2xl p-6 relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-muted">
                  {stat.label}
                </span>
                <div className={`w-9 h-9 rounded-xl ${stat.bgColor} ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="font-display font-black text-3xl text-offwhite">
                  {stat.value}
                </span>
                <span className="text-[11px] font-semibold text-muted">
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Ops Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Next Hike Manifest card */}
        <div className="bg-charcoal-900 border border-white/10 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-acid text-[10px] font-black uppercase tracking-wider block">
                Upcoming This Sunday
              </span>
              <h3 className="font-display font-black text-lg text-offwhite">
                NAHARGARH SUNRISE HIKE
              </h3>
            </div>
            <Badge variant="acid" size="xs">18 / 25 Booked</Badge>
          </div>

          <p className="text-muted text-xs mb-6">
            Departure at 4:30 AM from Mansarovar Metro → Vaishali → Raja Park → WTP. 7 spots left.
          </p>

          <div className="flex items-center gap-3">
            <Link href="/admin/bookings">
              <Button variant="dark" size="sm">
                View Passenger Manifest
              </Button>
            </Link>
            <Link href="/admin/hikes">
              <Button variant="ghost" size="sm">
                Edit Hike & Poster
              </Button>
            </Link>
          </div>
        </div>

        {/* Voting Status card */}
        <div className="bg-charcoal-900 border border-white/10 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-flame text-[10px] font-black uppercase tracking-wider block">
                Community Poll Live
              </span>
              <h3 className="font-display font-black text-lg text-offwhite">
                WEEKEND #42 DESTINATION
              </h3>
            </div>
            <Badge variant="flame" size="xs">430 Votes</Badge>
          </div>

          <p className="text-muted text-xs mb-6">
            Leader: <strong>Sambhar Salt Lake Camp & Stargazing</strong> (142 votes, 33%). Ends Friday.
          </p>

          <div className="flex items-center gap-3">
            <Link href="/admin/voting">
              <Button variant="dark" size="sm">
                Manage Voting Rounds
              </Button>
            </Link>
            <Link href="/vote" target="_blank">
              <Button variant="ghost" size="sm">
                Public Ballot View <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

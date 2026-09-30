import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Search, Filter, Ticket, User, MapPin, Mail, Phone, Calendar } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { getAllBookings, getHikes } from '../../lib/api';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [hikes, setHikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [hikeFilter, setHikeFilter] = useState('All');

  useEffect(() => {
    async function initData() {
      setLoading(true);
      try {
        const [bRes, hRes] = await Promise.all([
          getAllBookings(),
          getHikes()
        ]);
        if (bRes.data) setBookings(bRes.data);
        if (hRes.data) setHikes(hRes.data);
      } catch (err) {
        console.error('Failed to load bookings:', err);
      } finally {
        setLoading(false);
      }
    }
    initData();
  }, []);

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'All' || b.payment_status === statusFilter;
    const matchesHike = hikeFilter === 'All' || b.hike_id === hikeFilter;
    const matchesSearch =
      !search ||
      b.student_name?.toLowerCase().includes(search.toLowerCase()) ||
      b.student_email?.toLowerCase().includes(search.toLowerCase()) ||
      b.booking_ref?.toLowerCase().includes(search.toLowerCase()) ||
      b.student_college?.toLowerCase().includes(search.toLowerCase());

    return matchesStatus && matchesHike && matchesSearch;
  });

  return (
    <AdminLayout
      title="PASSENGER MANIFEST & BOOKINGS"
      subtitle="View student attendee records, verified bus pickups, and emergency contact details"
    >
      <Head>
        <title>Bookings Manifest — OnlyHikes Coordinator Admin</title>
      </Head>

      {/* Filters Bar */}
      <div className="bg-charcoal-900 border border-white/10 p-4 rounded-2xl mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search student, college, email, ref..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-charcoal-800 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-offwhite focus:outline-none focus:border-acid"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-charcoal-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-offwhite font-semibold focus:outline-none focus:border-acid"
          >
            <option value="All">All Statuses</option>
            <option value="paid">Paid & Confirmed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>

          {/* Hike Filter */}
          <select
            value={hikeFilter}
            onChange={(e) => setHikeFilter(e.target.value)}
            className="bg-charcoal-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-offwhite font-semibold focus:outline-none focus:border-acid"
          >
            <option value="All">All Hikes</option>
            {hikes.map((h) => (
              <option key={h.id} value={h.id}>
                {h.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-charcoal-900 border border-white/10 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-charcoal-850 border-b border-white/10 text-muted uppercase tracking-wider font-bold">
              <tr>
                <th className="py-4 px-6">Booking Ref</th>
                <th className="py-4 px-4">Student & College</th>
                <th className="py-4 px-4">Contact</th>
                <th className="py-4 px-4">Trek</th>
                <th className="py-4 px-4">Pickup Point</th>
                <th className="py-4 px-4">Seats</th>
                <th className="py-4 px-4">Paid</th>
                <th className="py-4 px-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredBookings.map((b) => (
                <tr key={b.id || b.booking_ref} className="hover:bg-charcoal-850/50 transition">
                  <td className="py-4 px-6 font-mono font-black text-acid">
                    {b.booking_ref}
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-bold text-offwhite block">{b.student_name}</span>
                    <span className="text-[11px] text-muted">{b.student_college || 'Student'}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="space-y-0.5">
                      <span className="text-[11px] text-offwhite/90 block">{b.student_phone}</span>
                      <span className="text-[10px] text-muted block">{b.student_email}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-bold text-offwhite block line-clamp-1">
                      {b.hikes?.title || b.hike_title || 'Sunrise Trek'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-[11px] text-offwhite font-medium flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-acid shrink-0" />
                      {b.pickup_title || 'WTP Malviya Nagar'}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-bold text-offwhite">
                    {b.seats_count}
                  </td>
                  <td className="py-4 px-4 font-black text-offwhite">
                    ₹{b.total_amount}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Badge variant={b.payment_status === 'paid' ? 'success' : 'warning'} size="xs">
                      {b.payment_status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

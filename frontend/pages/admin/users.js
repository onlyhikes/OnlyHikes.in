import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Users, Search, GraduationCap, Phone, Mail, Ticket, Calendar } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import Badge from '../../components/ui/Badge';
import { getAdminUsers } from '../../lib/api';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadUsers = async (query = '') => {
    setLoading(true);
    try {
      const res = await getAdminUsers(query);
      if (res.data) setUsers(res.data);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      loadUsers(search);
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  return (
    <AdminLayout
      title="REGISTERED STUDENTS DIRECTORY"
      subtitle="View student profiles, college affiliations, and booking participation recorded in database"
    >
      <Head>
        <title>Student Directory — OnlyHikes Coordinator Admin</title>
      </Head>

      <div className="bg-charcoal-900 border border-white/10 p-4 rounded-2xl mb-8 flex items-center justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by student name, college, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-charcoal-950 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-offwhite focus:outline-none focus:border-acid transition"
          />
        </div>
        <div className="text-muted text-xs font-bold">
          {users.length} {users.length === 1 ? 'Student' : 'Students'} Found
        </div>
      </div>

      <div className="bg-charcoal-900 border border-white/10 rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-16 text-center text-muted text-xs">Loading registered students...</div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center">
            <Users className="w-12 h-12 text-muted/30 mx-auto mb-3" />
            <h3 className="font-display font-black text-sm text-offwhite">No Students Found</h3>
            <p className="text-muted text-xs mt-1 max-w-sm mx-auto">
              {search ? 'No student matches your search query.' : 'Registered student accounts will appear here once students sign up or reserve treks.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-charcoal-950/60 border-b border-white/10 text-muted uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-4 px-6">Student</th>
                  <th className="py-4 px-4">College</th>
                  <th className="py-4 px-4">Contact</th>
                  <th className="py-4 px-4">Bookings</th>
                  <th className="py-4 px-6 text-right">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((u) => {
                  const bookingCount = u.bookings ? (Array.isArray(u.bookings) ? u.bookings.length : 1) : 0;
                  return (
                    <tr key={u.id} className="hover:bg-charcoal-850/50 transition">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-charcoal-800 border border-white/10 text-acid font-black flex items-center justify-center font-display text-xs">
                            {(u.full_name || 'S')[0]?.toUpperCase()}
                          </div>
                          <div>
                            <span className="font-display font-black text-sm text-offwhite block">
                              {u.full_name || 'Student'}
                            </span>
                            <span className="text-muted text-[11px] font-mono">{u.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 text-offwhite">
                          <GraduationCap className="w-3.5 h-3.5 text-muted shrink-0" />
                          <span>{u.college || 'Jaipur College'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-offwhite font-mono text-[11px]">
                            <Phone className="w-3 h-3 text-muted shrink-0" />
                            <span>{u.phone || '—'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5">
                          <Ticket className="w-3.5 h-3.5 text-acid" />
                          <span className="font-bold text-offwhite">{bookingCount}</span>
                          <span className="text-muted text-[11px]">expeditions</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right text-muted text-[11px]">
                        {u.created_at ? new Date(u.created_at).toLocaleDateString('en-IN') : 'Recent'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

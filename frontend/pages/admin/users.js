import React, { useState } from 'react';
import Head from 'next/head';
import { Users, Search, GraduationCap, Phone, Mail, Award, CheckCircle } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import Badge from '../../components/ui/Badge';

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');

  const sampleUsers = [
    {
      id: 'usr-1',
      name: 'Aarav Sharma',
      email: 'aarav.sharma@mnit.ac.in',
      phone: '+91 98290 12345',
      college: 'MNIT Jaipur · CSE \'25',
      hikesBooked: 3,
      referrals: 3,
      rewards: 150,
      status: 'Active Student'
    },
    {
      id: 'usr-2',
      name: 'Tanvi Mathur',
      email: 'tanvi.m@jaipur.manipal.edu',
      phone: '+91 94140 54321',
      college: 'Manipal University Jaipur · Design',
      hikesBooked: 2,
      referrals: 1,
      rewards: 50,
      status: 'Active Student'
    },
    {
      id: 'usr-3',
      name: 'Rohan Khandelwal',
      email: 'rohan.k@uniraj.ac.in',
      phone: '+91 96020 98765',
      college: 'Rajasthan University · Commerce',
      hikesBooked: 1,
      referrals: 0,
      rewards: 0,
      status: 'Active Student'
    },
    {
      id: 'usr-4',
      name: 'Simran Shekhawat',
      email: 'simran.s@jecrc.ac.in',
      phone: '+91 98291 11223',
      college: 'JECRC University',
      hikesBooked: 4,
      referrals: 5,
      rewards: 250,
      status: 'Campus Lead'
    }
  ];

  const filtered = sampleUsers.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.college.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout
      title="REGISTERED STUDENTS DIRECTORY"
      subtitle="Manage student profiles, college affiliations, and campus ambassador credentials"
    >
      <Head>
        <title>Student Directory — OnlyHikes Coordinator Admin</title>
      </Head>

      <div className="bg-charcoal-900 border border-white/10 p-4 rounded-2xl mb-8">
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by student name, college, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-charcoal-800 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-offwhite focus:outline-none focus:border-acid"
          />
        </div>
      </div>

      <div className="bg-charcoal-900 border border-white/10 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-charcoal-850 border-b border-white/10 text-muted uppercase tracking-wider font-bold">
              <tr>
                <th className="py-4 px-6">Student</th>
                <th className="py-4 px-4">College</th>
                <th className="py-4 px-4">Contact</th>
                <th className="py-4 px-4">Hikes Completed</th>
                <th className="py-4 px-4">Referrals & Rewards</th>
                <th className="py-4 px-6 text-right">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-charcoal-850/50 transition">
                  <td className="py-4 px-6">
                    <span className="font-bold text-offwhite text-sm block">{u.name}</span>
                    <span className="text-[10px] text-muted">{u.email}</span>
                  </td>
                  <td className="py-4 px-4 text-offwhite font-medium">
                    {u.college}
                  </td>
                  <td className="py-4 px-4 text-muted">
                    {u.phone}
                  </td>
                  <td className="py-4 px-4 font-black text-acid">
                    {u.hikesBooked}
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-bold text-offwhite">{u.referrals} friends</span>
                    <span className="text-acid text-[10px] block font-bold">₹{u.rewards} earned</span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Badge variant={u.status === 'Campus Lead' ? 'acid' : 'charcoal'} size="xs">
                      {u.status}
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

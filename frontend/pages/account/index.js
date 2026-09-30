import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  User,
  Ticket,
  Bookmark,
  MapPin,
  Clock,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { getUserProfile, updateUserProfile } from '../../lib/api';

export default function StudentAccountPage() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [activeTab, setActiveTab] = useState('bookings');
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: '',
    phone: '',
    college: '',
    city: 'Jaipur'
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res = await getUserProfile();
        if (res.data) {
          setProfileData(res.data);
          const p = res.data.profile || {};
          setEditForm({
            full_name: p.full_name || '',
            phone: p.phone || '',
            college: p.college || '',
            city: p.city || 'Jaipur'
          });
        }
      } catch (err) {
        console.error('Account data error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await updateUserProfile(editForm);
      setEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert('Failed to update profile: ' + err.message);
    }
  };

  const tabs = [
    { id: 'bookings', label: 'My Bookings', icon: Ticket },
    { id: 'saved', label: 'Saved Hikes', icon: Bookmark },
    { id: 'profile', label: 'Profile Settings', icon: User },
  ];

  const profile = profileData?.profile || (user ? {
    full_name: user.full_name || 'Hiker Student',
    email: user.email || '',
    phone: user.phone || '',
    college: user.college || 'Jaipur College',
    city: 'Jaipur'
  } : null);

  const bookings = profileData?.bookings || [];
  const savedHikes = profileData?.saved_hikes || [];

  return (
    <Layout>
      <Head>
        <title>Student Portal & Bookings — OnlyHikes.in</title>
        <meta name="description" content="View your verified expedition passes, pickup times, and profile settings." />
      </Head>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* Profile Card Header */}
        <div className="bg-charcoal-900 border border-white/10 rounded-3xl p-6 md:p-8 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-acid/20 border-2 border-acid text-acid font-display font-black text-2xl flex items-center justify-center shrink-0">
              {(profile?.full_name || 'S')[0]?.toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-black text-2xl text-offwhite">
                  {profile?.full_name || 'Jaipur Student'}
                </h1>
                <Badge variant="acid" size="xs">
                  Verified Hiker
                </Badge>
              </div>
              <p className="text-muted text-xs mt-1">
                {profile?.college || 'Student'} • {profile?.email || 'Logged In'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/hikes">
              <Button variant="acid" size="sm">
                Book Next Expedition →
              </Button>
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mb-8 border-b border-white/10 pb-4 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  active
                    ? 'bg-acid text-charcoal-950 shadow-acid-sm'
                    : 'bg-charcoal-900 text-muted hover:text-offwhite hover:bg-charcoal-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Bookings */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <div className="bg-charcoal-900 border border-dashed border-white/10 rounded-3xl p-16 text-center">
                <Ticket className="w-12 h-12 text-muted/30 mx-auto mb-3" />
                <h3 className="font-display font-black text-lg text-offwhite">No Bookings Yet</h3>
                <p className="text-muted text-xs max-w-sm mx-auto mt-1 mb-6">
                  You haven't reserved any hikes yet. Explore this Sunday's expeditions on the Aravalis!
                </p>
                <Link href="/hikes">
                  <Button variant="acid" size="sm">
                    Browse Upcoming Hikes →
                  </Button>
                </Link>
              </div>
            ) : (
              bookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-charcoal-900 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-white/20 transition"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-xs font-bold text-acid bg-acid/10 px-2 py-0.5 rounded border border-acid/20">
                        {b.booking_ref}
                      </span>
                      <Badge variant={b.payment_status === 'paid' ? 'acid' : 'flame'} size="xs">
                        {b.payment_status === 'paid' ? 'Confirmed' : 'Pending Payment'}
                      </Badge>
                    </div>

                    <h3 className="font-display font-black text-xl text-offwhite">
                      {b.hikes?.title || b.hike_title || 'Aravali Expedition'}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted mt-2">
                      <span className="flex items-center gap-1 text-offwhite">
                        <Clock className="w-3.5 h-3.5 text-acid" /> {b.hikes?.time || '5:30 AM'}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-muted" /> {b.pickup_locations?.title || 'Mansarovar Metro'}
                      </span>
                      <span>• {b.seats_count || 1} Seat(s)</span>
                      <span className="font-bold text-offwhite">• ₹{b.total_amount}</span>
                    </div>
                  </div>

                  <Link href={`/booking/confirmation/${b.booking_ref || b.id}`}>
                    <Button variant="outline" size="sm">
                      View Digital Pass →
                    </Button>
                  </Link>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Saved Hikes */}
        {activeTab === 'saved' && (
          <div>
            {savedHikes.length === 0 ? (
              <div className="bg-charcoal-900 border border-dashed border-white/10 rounded-3xl p-16 text-center">
                <Bookmark className="w-12 h-12 text-muted/30 mx-auto mb-3" />
                <h3 className="font-display font-black text-lg text-offwhite">No Saved Hikes</h3>
                <p className="text-muted text-xs max-w-sm mx-auto mt-1 mb-6">
                  Bookmark expeditions you're interested in by tapping the bookmark icon on any hike details page.
                </p>
                <Link href="/hikes">
                  <Button variant="acid" size="sm">
                    Browse Hikes Calendar →
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savedHikes.map((item) => (
                  <div key={item.id} className="bg-charcoal-900 border border-white/10 rounded-2xl p-5 flex items-center justify-between">
                    <div>
                      <h4 className="font-display font-black text-base text-offwhite">{item.hikes?.title}</h4>
                      <p className="text-muted text-xs mt-0.5">{item.hikes?.date} • ₹{item.hikes?.selling_price || 299}</p>
                    </div>
                    <Link href={`/hikes/${item.hikes?.slug || item.hike_id}`}>
                      <Button variant="acid" size="xs">View Trek →</Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Profile Settings */}
        {activeTab === 'profile' && (
          <div className="bg-charcoal-900 border border-white/10 rounded-3xl p-6 md:p-8 max-w-2xl">
            <h3 className="font-display font-black text-xl text-offwhite mb-4">
              Student Profile Details
            </h3>

            {saveSuccess && (
              <div className="p-3 bg-acid/10 border border-acid/30 rounded-xl text-xs font-bold text-acid flex items-center gap-2 mb-6">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>Profile updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editForm.full_name}
                  onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                  className="w-full bg-charcoal-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-offwhite focus:border-acid outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
                  WhatsApp Contact Number
                </label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  placeholder="+91 98290 12345"
                  className="w-full bg-charcoal-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-offwhite focus:border-acid outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
                  College / University
                </label>
                <input
                  type="text"
                  value={editForm.college}
                  onChange={(e) => setEditForm({ ...editForm, college: e.target.value })}
                  placeholder="e.g. MNIT Jaipur, Manipal University Jaipur"
                  className="w-full bg-charcoal-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-offwhite focus:border-acid outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={editForm.city}
                  onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                  className="w-full bg-charcoal-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-offwhite focus:border-acid outline-none transition"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <Button type="submit" variant="acid" size="md">
                  Save Profile Changes
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
}

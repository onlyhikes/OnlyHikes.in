import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  User,
  Ticket,
  Calendar,
  Gift,
  Bookmark,
  Star,
  Copy,
  Check,
  MapPin,
  Clock,
  Sparkles,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { getUserProfile, updateUserProfile } from '../../lib/api';

export default function StudentAccountPage() {
  const { user, profile: authProfile, loginAsDemoStudent } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [activeTab, setActiveTab] = useState('bookings');
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: '',
    phone: '',
    college: '',
    city: 'Jaipur'
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
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
      }
    }
    loadData();
  }, [user]);

  const handleCopyCode = () => {
    const code = profileData?.referral_stats?.code || 'EXPLORE50';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
    { id: 'referrals', label: 'Refer & Earn', icon: Gift },
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'saved', label: 'Saved Hikes', icon: Bookmark },
  ];

  const profile = profileData?.profile || authProfile || {
    full_name: 'Aarav Sharma',
    email: 'aarav.sharma@mnit.ac.in',
    phone: '+91 98290 12345',
    college: 'MNIT Jaipur · CSE \'25',
    city: 'Jaipur'
  };

  const bookings = profileData?.bookings || [
    {
      id: 'bk-demo-101',
      booking_ref: 'OH-2026-8921',
      hike_title: 'NAHARGARH SUNRISE HIKE',
      hike_date: 'Sunday, 4 October',
      seats_count: 2,
      total_amount: 598.00,
      payment_status: 'paid',
      pickup_title: 'WTP / Gaurav Tower (04:45 AM)',
      whatsapp_group_url: 'https://chat.whatsapp.com/demo-invite-jaipur-wild'
    }
  ];

  const referral = profileData?.referral_stats || {
    code: 'AARAV50',
    offer: 'Give ₹50. Get ₹50.',
    successful_referrals: 3,
    rewards_earned: 150
  };

  return (
    <Layout>
      <Head>
        <title>Student Account — OnlyHikes.in</title>
      </Head>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">
        {/* Profile Header Card */}
        <div className="bg-charcoal-900 border border-white/10 rounded-3xl p-6 sm:p-8 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-acid text-charcoal-950 flex items-center justify-center font-display font-black text-2xl shadow-acid-sm shrink-0">
              {profile.full_name ? profile.full_name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-black text-2xl sm:text-3xl text-offwhite">
                  {profile.full_name || 'Jaipur Adventurer'}
                </h1>
                <Badge variant="acid" size="xs">Student Verified</Badge>
              </div>
              <p className="text-muted text-xs sm:text-sm mt-0.5">
                {profile.college || 'MNIT Jaipur'} • {profile.city || 'Jaipur'}
              </p>
              <p className="text-[11px] text-muted/70">{profile.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-charcoal-850 border border-white/10 px-4 py-2.5 rounded-2xl text-center">
              <span className="text-[10px] text-muted font-bold uppercase tracking-wider block">Wallet Rewards</span>
              <span className="font-display font-black text-lg text-acid">₹{referral.rewards_earned}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-4 mb-8 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shrink-0 transition ${
                  active
                    ? 'bg-acid text-charcoal-950 font-black shadow-acid-sm'
                    : 'bg-charcoal-900 text-muted hover:text-offwhite hover:bg-charcoal-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <h2 className="font-display font-black text-xl text-offwhite">
              YOUR UPCOMING & PAST EXPEDITIONS
            </h2>

            {bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.map((b) => (
                  <div
                    key={b.id || b.booking_ref}
                    className="bg-charcoal-900 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-acid/30 transition"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-acid uppercase tracking-wider">
                          REF: {b.booking_ref}
                        </span>
                        <Badge variant={b.payment_status === 'paid' ? 'success' : 'warning'} size="xs">
                          {b.payment_status === 'paid' ? '✓ Confirmed' : 'Pending Payment'}
                        </Badge>
                      </div>

                      <h3 className="font-display font-black text-lg text-offwhite">
                        {b.hike_title || 'NAHARGARH SUNRISE HIKE'}
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
                        <span className="flex items-center gap-1 text-offwhite">
                          <Calendar className="w-3.5 h-3.5 text-acid" /> {b.hike_date || 'Sunday, 4 October'}
                        </span>
                        <span>•</span>
                        <span>{b.seats_count} {b.seats_count === 1 ? 'seat' : 'seats'}</span>
                        <span>•</span>
                        <span className="font-bold text-offwhite">₹{b.total_amount}</span>
                      </div>

                      <div className="text-xs text-muted flex items-center gap-1 pt-1">
                        <MapPin className="w-3.5 h-3.5 text-acid shrink-0" />
                        <span>Pickup: <strong className="text-offwhite">{b.pickup_title}</strong></span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <a
                        href={b.whatsapp_group_url || 'https://chat.whatsapp.com/demo-invite-jaipur-wild'}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 px-4 py-2.5 rounded-xl text-xs font-bold transition"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>WhatsApp Group</span>
                      </a>
                      <Link href={`/booking/confirmation/${b.booking_ref || b.id}`}>
                        <Button variant="outline" size="sm">
                          View Pass Ticket
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-charcoal-900 border border-white/10 rounded-3xl p-12 text-center max-w-md mx-auto">
                <Ticket className="w-12 h-12 text-muted mx-auto mb-3" />
                <h3 className="font-display font-black text-lg text-offwhite mb-2">No Bookings Yet</h3>
                <p className="text-muted text-xs mb-6">Don't spend your weekend indoors. Pick a trail!</p>
                <Link href="/hikes"><Button variant="acid" size="sm">Explore Trails</Button></Link>
              </div>
            )}
          </div>
        )}

        {/* Tab: Referrals */}
        {activeTab === 'referrals' && (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="bg-gradient-to-br from-charcoal-900 to-charcoal-850 border border-white/15 rounded-3xl p-8 text-center shadow-xl">
              <span className="text-acid text-xs font-black uppercase tracking-widest block mb-2">
                INVITE YOUR FRIENDS
              </span>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-offwhite tracking-tight mb-2">
                "GIVE ₹50. GET ₹50."
              </h2>
              <p className="text-muted text-xs sm:text-sm max-w-md mx-auto mb-8">
                Share your personal code with college friends. They get ₹50 off their first hike pass, and you get ₹50 credited straight to your OnlyHikes wallet!
              </p>

              {/* Code Box */}
              <div className="bg-charcoal-950 border border-acid/40 rounded-2xl p-4 max-w-sm mx-auto flex items-center justify-between mb-8 shadow-acid-sm">
                <div>
                  <span className="text-[10px] text-muted uppercase tracking-wider block font-bold">Your Referral Code</span>
                  <span className="font-display font-black text-2xl text-acid">{referral.code}</span>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-4 py-2 bg-acid hover:bg-acid-400 text-charcoal-950 font-black text-xs uppercase rounded-xl transition shadow-md"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                <div className="bg-charcoal-800 p-4 rounded-2xl border border-white/5">
                  <span className="text-[10px] text-muted uppercase tracking-wider font-bold block">Friends Joined</span>
                  <span className="font-display font-black text-2xl text-offwhite">{referral.successful_referrals}</span>
                </div>
                <div className="bg-charcoal-800 p-4 rounded-2xl border border-white/5">
                  <span className="text-[10px] text-muted uppercase tracking-wider font-bold block">Rewards Earned</span>
                  <span className="font-display font-black text-2xl text-acid">₹{referral.rewards_earned}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Profile Settings */}
        {activeTab === 'profile' && (
          <div className="max-w-xl mx-auto">
            <div className="bg-charcoal-900 border border-white/10 rounded-3xl p-6 sm:p-8">
              <h2 className="font-display font-black text-xl text-offwhite mb-6">
                STUDENT PROFILE DETAILS
              </h2>

              {saveSuccess && (
                <div className="mb-4 p-3 bg-emerald-950/70 border border-emerald-500/40 rounded-xl text-xs font-bold text-emerald-300">
                  Profile updated successfully!
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-muted mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editForm.full_name}
                    onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                    className="w-full bg-charcoal-800 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-offwhite focus:outline-none focus:border-acid"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted mb-1">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full bg-charcoal-800 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-offwhite focus:outline-none focus:border-acid"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted mb-1">College / University</label>
                  <input
                    type="text"
                    value={editForm.college}
                    onChange={(e) => setEditForm({ ...editForm, college: e.target.value })}
                    className="w-full bg-charcoal-800 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-offwhite focus:outline-none focus:border-acid"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted mb-1">City</label>
                  <input
                    type="text"
                    value={editForm.city}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                    className="w-full bg-charcoal-800 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-offwhite focus:outline-none focus:border-acid"
                  />
                </div>

                <Button type="submit" variant="acid" size="md" className="w-full font-black uppercase">
                  Save Changes
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* Tab: Saved Hikes */}
        {activeTab === 'saved' && (
          <div className="bg-charcoal-900 border border-white/10 rounded-3xl p-10 text-center max-w-md mx-auto">
            <Bookmark className="w-10 h-10 text-acid mx-auto mb-3" />
            <h3 className="font-display font-black text-lg text-offwhite mb-2">Saved Trails</h3>
            <p className="text-muted text-xs mb-6">You have saved Nahargarh Sunrise Hike to your bucket list.</p>
            <Link href="/hikes/nahargarh-sunrise-hike">
              <Button variant="outline" size="sm">View Saved Hike</Button>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}

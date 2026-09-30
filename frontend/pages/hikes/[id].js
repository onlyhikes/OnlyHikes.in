import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  Bus,
  Coffee,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Users,
  Backpack,
  ArrowRight,
  Share2,
  Bookmark,
  Sparkles,
  Mountain,
  Flag,
  Film
} from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';
import SeatProgressBar from '../../components/ui/SeatProgressBar';
import { getHikeDetails, getHikeWaypoints, toggleSaveHike } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export default function TrekDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();

  const [hike, setHike] = useState(null);
  const [waypoints, setWaypoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedPickup, setSelectedPickup] = useState('');
  const [saved, setSaved] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);

  useEffect(() => {
    if (!id) return;
    async function fetchHike() {
      setLoading(true);
      try {
        const res = await getHikeDetails(id);
        if (res.data) {
          setHike(res.data);
          setSelectedImage(res.data.poster_url);
          if (res.data.pickup_locations && res.data.pickup_locations.length > 0) {
            setSelectedPickup(res.data.pickup_locations[0].id);
          }

          // Fetch graphical route waypoints for this hike
          const wpRes = await getHikeWaypoints(res.data.id);
          if (wpRes.data) setWaypoints(wpRes.data);
        }
      } catch (err) {
        console.error('Failed to load hike details:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchHike();
  }, [id]);

  const handleToggleSave = async () => {
    if (!user) {
      alert('Please log in with your student account to save hikes.');
      return;
    }
    try {
      const res = await toggleSaveHike(hike.id);
      if (res.saved !== undefined) {
        setSaved(res.saved);
        setSaveMessage(res.message);
        setTimeout(() => setSaveMessage(null), 3000);
      }
    } catch (err) {
      console.error('Failed to toggle save:', err);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex flex-col items-center justify-center">
          <div className="w-8 h-8 border-2 border-acid border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm font-bold text-muted">Loading trek details...</p>
        </div>
      </Layout>
    );
  }

  if (!hike) {
    return (
      <Layout>
        <div className="max-w-md mx-auto py-24 text-center px-4">
          <h2 className="font-display font-black text-2xl text-offwhite mb-2">Hike Not Found</h2>
          <p className="text-muted text-xs mb-6">The requested trek trail could not be located.</p>
          <Link href="/hikes">
            <Button variant="acid" size="sm">Browse All Hikes</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const sellingPrice = hike.selling_price || hike.price || 299;
  const originalPrice = hike.original_price || (sellingPrice + 200);
  const themeAccent = hike.theme_accent || '#CCFF00';
  const bookedSeats = hike.booked_seats || 0;
  const totalSlots = hike.slots_total || hike.total_seats || 25;
  const remainingSeats = Math.max(0, totalSlots - bookedSeats);
  const isSoldOut = remainingSeats === 0;

  const galleryImages = [hike.poster_url, ...(hike.gallery_urls || [])].filter(Boolean);

  const inclusions = Array.isArray(hike.inclusions) && hike.inclusions.length > 0
    ? hike.inclusions
    : [
        'Coordinated AC transit pickup & drop',
        'Lead wilderness marshals & first-aid',
        'Hydration pack & summit refreshments',
        'Curated group photo package'
      ];

  const exclusions = Array.isArray(hike.exclusions) && hike.exclusions.length > 0
    ? hike.exclusions
    : ['Personal trekking daypack', 'Individual transport outside designated stops'];

  return (
    <Layout>
      <Head>
        <title>{hike.title} — OnlyHikes.in Jaipur</title>
        <meta name="description" content={hike.subtitle || hike.description} />
        <meta property="og:image" content={hike.poster_url} />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32">
        {/* Breadcrumb & Top Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 text-xs font-bold text-muted">
            <Link href="/" className="hover:text-offwhite transition">Home</Link>
            <span>/</span>
            <Link href="/hikes" className="hover:text-offwhite transition">Hikes</Link>
            <span>/</span>
            <span style={{ color: themeAccent }}>{hike.title}</span>
          </div>

          <div className="flex items-center gap-2">
            {saveMessage && (
              <span className="text-[11px] font-bold text-acid mr-2">{saveMessage}</span>
            )}
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: hike.title, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Trek link copied to clipboard!');
                }
              }}
              className="p-2.5 bg-charcoal-850 hover:bg-charcoal-800 border border-white/10 rounded-xl text-offwhite transition"
              title="Share Trail"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleToggleSave}
              className={`p-2.5 border rounded-xl transition ${
                saved
                  ? 'bg-acid text-charcoal-950 border-acid'
                  : 'bg-charcoal-850 hover:bg-charcoal-800 border-white/10 text-offwhite'
              }`}
              title="Save Trail"
            >
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Top Split: Poster Gallery + Key Booking Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
          {/* Left Column: Big Poster & Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden border border-white/10 bg-charcoal-900 shadow-2xl">
              <img
                src={selectedImage || hike.poster_url}
                alt={hike.title}
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute top-4 left-4">
                <span
                  className="px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider backdrop-blur-md border flex items-center gap-1.5"
                  style={{
                    backgroundColor: 'rgba(7, 7, 9, 0.85)',
                    borderColor: themeAccent,
                    color: themeAccent
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{hike.tag || 'Sunrise Expedition'}</span>
                </span>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {galleryImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                      selectedImage === imgUrl ? 'border-acid scale-105' : 'border-white/10 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt="gallery thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Key Trek Specs & Booking Trigger */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-charcoal-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            {/* Dynamic Ambient Glow */}
            <div
              className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-15"
              style={{ backgroundColor: themeAccent }}
            />

            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-black uppercase tracking-widest font-mono" style={{ color: themeAccent }}>
                  JAIPUR ARAVALI TRAIL
                </span>
                <span className="text-xs font-bold text-muted bg-charcoal-800 px-3 py-1 rounded-full">
                  Sunday Group Trek
                </span>
              </div>

              <h1 className="font-display font-black text-3xl sm:text-4xl text-offwhite tracking-tight leading-tight mb-3">
                {hike.title}
              </h1>

              <p className="text-muted text-xs sm:text-sm leading-relaxed mb-6">
                {hike.subtitle || hike.description}
              </p>

              {/* Timing & Logistics Badges */}
              <div className="grid grid-cols-2 gap-3 mb-6 bg-charcoal-850 p-4 rounded-2xl border border-white/5">
                <div>
                  <span className="text-[10px] text-muted font-bold uppercase tracking-wider block">Time & Date</span>
                  <div className="flex items-center gap-1.5 text-xs font-black text-offwhite mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-acid" />
                    <span>{hike.time}</span>
                  </div>
                  <div className="text-[11px] text-muted font-medium mt-0.5">
                    {hike.date}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-muted font-bold uppercase tracking-wider block">Duration & Return</span>
                  <div className="flex items-center gap-1.5 text-xs font-black text-offwhite mt-0.5">
                    <Mountain className="w-3.5 h-3.5 text-acid" />
                    <span>{hike.duration || '4-5 Hours'}</span>
                  </div>
                  <div className="text-[11px] text-muted font-medium mt-0.5">
                    Return by ~{hike.return_time || '11:00 AM'}
                  </div>
                </div>
              </div>

              {/* Dual Price & Real Seat Bar */}
              <div className="mb-6">
                <div className="flex items-baseline justify-between mb-3">
                  <div>
                    <span className="text-3xl font-display font-black text-offwhite">₹{sellingPrice}</span>
                    {originalPrice > sellingPrice && (
                      <span className="text-base text-muted line-through font-semibold ml-2">
                        ₹{originalPrice}
                      </span>
                    )}
                    <span className="text-xs text-muted font-semibold ml-1.5">/ student pass</span>
                  </div>
                  <span className="text-xs font-bold text-acid uppercase tracking-wider">
                    All-Inclusive
                  </span>
                </div>

                <SeatProgressBar
                  booked={bookedSeats}
                  total={totalSlots}
                />
              </div>

              {/* Pickup Location Selector */}
              {hike.pickup_locations && hike.pickup_locations.length > 0 && (
                <div className="mb-6">
                  <label className="block text-xs font-black uppercase tracking-wider text-offwhite mb-2">
                    Select Your Jaipur Pickup Spot:
                  </label>
                  <select
                    value={selectedPickup}
                    onChange={(e) => setSelectedPickup(e.target.value)}
                    className="w-full bg-charcoal-800 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-offwhite font-semibold focus:outline-none focus:border-acid"
                  >
                    {hike.pickup_locations.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} — {p.pickup_time} ({p.landmark})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Desktop Book Action */}
            <div className="pt-4 border-t border-white/10">
              <Link href={`/book/${hike.slug || hike.id}?pickup=${selectedPickup}`}>
                <Button
                  variant="acid"
                  size="lg"
                  disabled={isSoldOut}
                  className="w-full uppercase font-black tracking-wide"
                >
                  {isSoldOut ? 'Sold Out' : 'Reserve Your Spot Now →'}
                </Button>
              </Link>
              <p className="text-center text-[11px] text-muted mt-2">
                🔒 Instant confirmation • 100% Student crowd • Verified coordinators
              </p>
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* GRAPHICAL ROUTE WAYPOINTS SECTION */}
        {/* ==================================================================== */}
        {waypoints && waypoints.length > 0 && (
          <section className="bg-charcoal-900 border border-white/10 rounded-3xl p-6 sm:p-10 mb-16 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <span className="text-acid text-xs font-black uppercase tracking-widest block mb-1">
                  EXPEDITION JOURNEY PATH
                </span>
                <h2 className="font-display font-black text-2xl sm:text-3xl text-offwhite">
                  GRAPHICAL TRAIL WAYPOINTS
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-acid animate-ping" />
                <span className="text-xs font-bold text-muted">Sequential Trail Milestones</span>
              </div>
            </div>

            <div className="relative">
              {/* Timeline connecting line */}
              <div className="hidden md:block absolute top-1/2 left-8 right-8 h-1 bg-gradient-to-r from-acid via-flame to-acid -translate-y-1/2 z-0 opacity-20" />

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 relative z-10">
                {waypoints.map((wp, idx) => (
                  <div
                    key={wp.id}
                    className="bg-charcoal-850 border border-white/10 hover:border-acid/40 rounded-2xl p-4 flex flex-col justify-between transition group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="w-7 h-7 rounded-lg bg-acid/15 border border-acid/30 text-acid font-black font-display text-xs flex items-center justify-center">
                          #{wp.step_number || (idx + 1)}
                        </span>
                        {wp.distance_marker && (
                          <span className="text-[10px] font-mono text-muted bg-charcoal-800 px-2 py-0.5 rounded">
                            {wp.distance_marker}
                          </span>
                        )}
                      </div>

                      <h4 className="font-display font-black text-sm text-offwhite mb-1 group-hover:text-acid transition">
                        {wp.title}
                      </h4>
                      {wp.subtitle && (
                        <p className="text-muted text-[11px] leading-relaxed">
                          {wp.subtitle}
                        </p>
                      )}
                    </div>

                    {wp.elevation_gain && (
                      <div className="mt-4 pt-2 border-t border-white/5 text-[10px] font-mono text-flame font-bold">
                        {wp.elevation_gain}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Video / Reel Embed Section (If Available) */}
        {hike.video_url && (
          <section className="bg-charcoal-900 border border-white/10 rounded-3xl p-6 sm:p-8 mb-16">
            <div className="flex items-center gap-2 mb-4">
              <Film className="w-5 h-5 text-flame" />
              <h2 className="font-display font-black text-xl text-offwhite">
                EXPEDITION TEASER & REEL
              </h2>
            </div>
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-charcoal-950 border border-white/10">
              <iframe
                src={hike.video_url.replace('watch?v=', 'embed/')}
                title="Trek Video Teaser"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </section>
        )}

        {/* Detailed Logistics Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
            {/* Description */}
            <section className="bg-charcoal-900 border border-white/10 rounded-3xl p-6 sm:p-8">
              <h2 className="font-display font-black text-xl text-offwhite mb-4">
                TRAIL EXPERIENCE & VIBE
              </h2>
              <p className="text-muted text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {hike.description}
              </p>
            </section>

            {/* Inclusions & Exclusions */}
            <section className="bg-charcoal-900 border border-white/10 rounded-3xl p-6 sm:p-8">
              <h2 className="font-display font-black text-xl text-offwhite mb-6">
                WHAT'S INCLUDED & WHAT'S NOT
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xs font-bold text-acid uppercase tracking-wider mb-3">Included in Your Pass</h3>
                  <div className="space-y-2.5">
                    {inclusions.map((inc, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-offwhite">
                        <CheckCircle2 className="w-4 h-4 text-acid shrink-0 mt-0.5" />
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-3">Not Included</h3>
                  <div className="space-y-2.5">
                    {exclusions.map((exc, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-muted">
                        <XCircle className="w-4 h-4 text-muted/60 shrink-0 mt-0.5" />
                        <span>{exc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Food & Hydration Briefing */}
            {hike.food_water_info && (
              <section className="bg-charcoal-900 border border-white/10 rounded-3xl p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-3">
                  <Coffee className="w-5 h-5 text-amber-400" />
                  <h2 className="font-display font-black text-xl text-offwhite">
                    FOOD & HYDRATION BRIEFING
                  </h2>
                </div>
                <p className="text-muted text-sm leading-relaxed whitespace-pre-line">
                  {hike.food_water_info}
                </p>
              </section>
            )}

            {/* Jaipur Pickups List */}
            <section className="bg-charcoal-900 border border-white/10 rounded-3xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-black text-xl text-offwhite">
                  CONFIGURED PICKUP LOCATIONS
                </h2>
                <span className="text-xs text-acid font-bold">AC Coach Stops</span>
              </div>
              <p className="text-muted text-xs mb-6">
                Our OnlyHikes private coach makes scheduled stops across major Jaipur student hubs:
              </p>

              <div className="space-y-3">
                {(hike.pickup_locations || []).map((loc) => (
                  <div
                    key={loc.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between bg-charcoal-850 border border-white/5 p-4 rounded-2xl gap-2"
                  >
                    <div className="flex items-start gap-3">
                      <Bus className="w-4 h-4 text-acid shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-offwhite">{loc.title}</h4>
                        <p className="text-xs text-muted">{loc.landmark}</p>
                      </div>
                    </div>
                    <div className="sm:text-right shrink-0">
                      <span className="inline-block px-3 py-1 rounded-lg bg-charcoal-800 text-xs font-black text-acid">
                        {loc.pickup_time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Safety Rules */}
            <section className="bg-charcoal-900 border border-white/10 rounded-3xl p-6 sm:p-8">
              <h2 className="font-display font-black text-xl text-offwhite mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                COMMUNITY SAFETY RULES
              </h2>
              <ul className="space-y-2.5 text-xs sm:text-sm text-muted">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Always stay within audible distance of assigned hike marshals.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Strictly no leaning or sitting over precarious parapets or cliff drops.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>First-aid supplies, antiseptic, and glucose packs are carried by marshals.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Zero alcohol or substance tolerance — this is a safe, inclusive college space.</span>
                </li>
              </ul>
            </section>
          </div>

          {/* Right Sticky Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-charcoal-900 border border-white/10 rounded-3xl p-6 sticky top-28">
              <span className="text-[10px] font-black uppercase tracking-widest text-acid block mb-1">
                SEATS STATUS
              </span>
              <h3 className="font-display font-black text-lg text-offwhite mb-3">
                {bookedSeats} / {totalSlots} BOOKED
              </h3>
              <p className="text-muted text-xs mb-4">
                {remainingSeats > 0 ? `${remainingSeats} seats available for this Sunday.` : 'This expedition is fully booked!'}
              </p>

              {/* Coupon reminder banner */}
              <div className="bg-acid/10 border border-acid/30 rounded-2xl p-4 mb-6">
                <span className="text-[10px] font-black text-acid uppercase tracking-wider block mb-1">
                  STUDENT PROMO CODE
                </span>
                <p className="text-xs text-offwhite font-bold">
                  Use promo code <span className="bg-acid text-charcoal-950 px-1.5 py-0.5 rounded font-black">ONLYHIKES50</span> at checkout for ₹50 off.
                </p>
              </div>

              <Link href={`/book/${hike.slug || hike.id}?pickup=${selectedPickup}`}>
                <Button
                  variant="acid"
                  size="lg"
                  disabled={isSoldOut}
                  className="w-full uppercase font-black"
                >
                  {isSoldOut ? 'Sold Out' : 'Grab Your Spot →'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* STICKY MOBILE BOOK NOW BAR */}
      <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-charcoal-950/95 backdrop-blur-xl border-t border-white/10 p-4 shadow-2xl flex items-center justify-between gap-4">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display font-black text-2xl text-offwhite">₹{sellingPrice}</span>
            {originalPrice > sellingPrice && (
              <span className="text-xs text-muted line-through">₹{originalPrice}</span>
            )}
          </div>
          <span className="text-[10px] text-acid font-bold uppercase tracking-wider block">
            {remainingSeats} seats left
          </span>
        </div>

        <Link href={`/book/${hike.slug || hike.id}?pickup=${selectedPickup}`} className="shrink-0">
          <Button
            variant="acid"
            size="md"
            disabled={isSoldOut}
            className="uppercase font-black px-6"
          >
            {isSoldOut ? 'Sold Out' : 'Book Now →'}
          </Button>
        </Link>
      </div>
    </Layout>
  );
}

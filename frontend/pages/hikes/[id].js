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
  AlertTriangle,
  Users,
  Backpack,
  ArrowRight,
  Share2,
  Bookmark
} from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import SeatProgressBar from '../../components/ui/SeatProgressBar';
import { getHikeDetails } from '../../lib/api';

export default function TrekDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [hike, setHike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedPickup, setSelectedPickup] = useState('');
  const [saved, setSaved] = useState(false);

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
        }
      } catch (err) {
        console.error('Failed to load hike details:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchHike();
  }, [id]);

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

  const remainingSeats = Math.max(0, (hike.total_seats || 25) - (hike.booked_seats || 0));
  const isSoldOut = remainingSeats === 0;

  const difficultyVariant = {
    Easy: 'success',
    Moderate: 'acid',
    Challenging: 'flame',
    Strenuous: 'flameSolid',
  }[hike.difficulty] || 'acid';

  const galleryImages = [hike.poster_url, ...(hike.gallery_urls || [])].filter(Boolean);

  return (
    <Layout>
      <Head>
        <title>{hike.title} — OnlyHikes.in Jaipur</title>
        <meta name="description" content={hike.subtitle || hike.description} />
        <meta property="og:image" content={hike.poster_url} />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-32">
        {/* Breadcrumb & Tags */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 text-xs font-bold text-muted">
            <Link href="/" className="hover:text-offwhite transition">Home</Link>
            <span>/</span>
            <Link href="/hikes" className="hover:text-offwhite transition">Hikes</Link>
            <span>/</span>
            <span className="text-acid">{hike.title}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: hike.title, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Trek link copied to clipboard!');
                }
              }}
              className="p-2 bg-charcoal-850 hover:bg-charcoal-800 border border-white/10 rounded-xl text-offwhite transition"
              title="Share Trail"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSaved(!saved)}
              className={`p-2 border rounded-xl transition ${
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
            {/* Primary Large Poster View */}
            <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden border border-white/10 bg-charcoal-900 shadow-2xl">
              <img
                src={selectedImage || hike.poster_url}
                alt={hike.title}
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute top-4 left-4">
                <Badge variant={difficultyVariant} size="sm">
                  {hike.difficulty}
                </Badge>
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
          <div className="lg:col-span-5 flex flex-col justify-between bg-charcoal-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-acid text-xs font-black uppercase tracking-widest">
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
                  <span className="text-[10px] text-muted font-bold uppercase tracking-wider block">Pickup & Transport</span>
                  <div className="flex items-center gap-1.5 text-xs font-black text-offwhite mt-0.5">
                    <Bus className="w-3.5 h-3.5 text-acid" />
                    <span>AC Coach Included</span>
                  </div>
                  <div className="text-[11px] text-muted font-medium mt-0.5">
                    4 City Pickups
                  </div>
                </div>
              </div>

              {/* Price & Seat Bar */}
              <div className="mb-6">
                <div className="flex items-baseline justify-between mb-3">
                  <div>
                    <span className="text-3xl font-display font-black text-offwhite">₹{hike.price}</span>
                    <span className="text-xs text-muted font-semibold ml-1.5">/ student pass</span>
                  </div>
                  <span className="text-xs font-bold text-acid uppercase tracking-wider">
                    All-Inclusive
                  </span>
                </div>

                <SeatProgressBar
                  booked={hike.booked_seats || 0}
                  total={hike.total_seats || 25}
                />
              </div>

              {/* Configurable Pickup Selector */}
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
                  {isSoldOut ? 'Sold Out' : 'Book Your Seat Now →'}
                </Button>
              </Link>
              <p className="text-center text-[11px] text-muted mt-2">
                🔒 Instant confirmation • 100% Student crowd • Verified coordinators
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Sections Tabs / Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-12">
            {/* 1. Description */}
            <section className="bg-charcoal-900 border border-white/10 rounded-3xl p-6 sm:p-8">
              <h2 className="font-display font-black text-xl text-offwhite mb-4">
                TRAIL EXPERIENCE & VIBE
              </h2>
              <p className="text-muted text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {hike.description}
              </p>
            </section>

            {/* 2. Included Services (Database Backed) */}
            <section className="bg-charcoal-900 border border-white/10 rounded-3xl p-6 sm:p-8">
              <h2 className="font-display font-black text-xl text-offwhite mb-6">
                WHAT'S INCLUDED IN YOUR PASS
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(hike.included_services || [
                  'Pickup & Drop',
                  'Guided Hike',
                  'Food',
                  'Water',
                  'Trek Coordinators'
                ]).map((srv, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 bg-charcoal-850 border border-white/5 p-3.5 rounded-2xl"
                  >
                    <CheckCircle2 className="w-5 h-5 text-acid shrink-0" />
                    <span className="text-xs sm:text-sm font-bold text-offwhite">
                      {srv}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* 3. Jaipur Bus Pickup Points (NOT generic meeting point) */}
            <section className="bg-charcoal-900 border border-white/10 rounded-3xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-black text-xl text-offwhite">
                  CONFIGURED PICKUP LOCATIONS
                </h2>
                <span className="text-xs text-acid font-bold">AC Bus Route</span>
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

            {/* 4. Things to Carry */}
            <section className="bg-charcoal-900 border border-white/10 rounded-3xl p-6 sm:p-8">
              <h2 className="font-display font-black text-xl text-offwhite mb-4 flex items-center gap-2">
                <Backpack className="w-5 h-5 text-acid" />
                THINGS TO CARRY CHECKLIST
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-offwhite/90">
                {(hike.things_to_carry || [
                  'Sturdy sports/hiking shoes with good grip',
                  'Valid College ID Card',
                  '1 Litre reusable water bottle',
                  'Small lightweight daypack',
                  'Light windcheater or hoodie for early morning winds'
                ]).map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 bg-charcoal-850 p-3 rounded-xl border border-white/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-acid shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 5. Safety Guidelines */}
            <section className="bg-charcoal-900 border border-white/10 rounded-3xl p-6 sm:p-8">
              <h2 className="font-display font-black text-xl text-offwhite mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                COMMUNITY SAFETY RULES
              </h2>
              <ul className="space-y-2 text-xs sm:text-sm text-muted">
                {(hike.safety_rules || [
                  'Always stay within audible distance of the assigned trek coordinators.',
                  'Strictly no leaning or sitting over precarious parapets or cliff edges.',
                  'First-aid supplies, antiseptic, and glucose packs are carried by our marshals.',
                  'Zero alcohol or substance tolerance — this is a safe, inclusive college space.'
                ]).map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Right Sticky Sidebar for Desktop */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-charcoal-900 border border-white/10 rounded-3xl p-6 sticky top-28">
              <h3 className="font-display font-black text-lg text-offwhite mb-3">
                STUDENTS CONFIRMED ({hike.booked_seats || 18})
              </h3>
              <p className="text-muted text-xs mb-4">
                Join students already booked from MNIT, Manipal University Jaipur, Amity, and JECRC.
              </p>

              {/* Avatar stack */}
              <div className="flex items-center -space-x-2 mb-6">
                {['#CCFF00', '#FF5500', '#3B82F6', '#10B981', '#8B5CF6'].map((color, i) => (
                  <div
                    key={i}
                    style={{ backgroundColor: color }}
                    className="w-9 h-9 rounded-full border-2 border-charcoal-950 flex items-center justify-center font-black text-charcoal-950 text-xs shadow-md"
                  >
                    {['A', 'R', 'T', 'K', 'V'][i]}
                  </div>
                ))}
                <div className="w-9 h-9 rounded-full bg-charcoal-800 border-2 border-charcoal-950 flex items-center justify-center text-xs font-bold text-offwhite">
                  +13
                </div>
              </div>

              {/* Coupon reminder banner */}
              <div className="bg-acid/10 border border-acid/30 rounded-2xl p-4 mb-6">
                <span className="text-[10px] font-black text-acid uppercase tracking-wider block mb-1">
                  STUDENT DISCOUNT ACTIVE
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

      {/* ==================================================================== */}
      {/* STICKY MOBILE BOOK NOW BAR */}
      {/* ==================================================================== */}
      <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-charcoal-950/95 backdrop-blur-xl border-t border-white/10 p-4 shadow-2xl flex items-center justify-between gap-4">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="font-display font-black text-2xl text-offwhite">₹{hike.price}</span>
            <span className="text-[10px] text-muted">/ person</span>
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

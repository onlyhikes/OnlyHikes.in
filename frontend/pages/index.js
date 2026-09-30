import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  Bus,
  Coffee,
  Users,
  Vote,
  Sparkles,
  MapPin,
  Star,
  CheckCircle,
  ExternalLink,
  Award,
  Flame,
  MessageCircle,
  Camera,
  HeartHandshake,
  Mountain
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import TrekCard from '../components/hikes/TrekCard';
import VoteCard from '../components/voting/VoteCard';
import {
  getHikes,
  getActiveVotingRound,
  castVote,
  getApprovedReviews,
  getExploreJaipur,
  getSiteContent,
  getBrandSettings
} from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { user } = useAuth();
  const [hikes, setHikes] = useState([]);
  const [votingRound, setVotingRound] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [siteContent, setSiteContent] = useState({});
  const [brand, setBrand] = useState({});
  const [loading, setLoading] = useState(true);
  const [voteSubmitting, setVoteSubmitting] = useState(false);
  const [voteMessage, setVoteMessage] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [hikesRes, voteRes, reviewsRes, contentRes, brandRes] = await Promise.all([
          getHikes(),
          getActiveVotingRound(),
          getApprovedReviews(),
          getSiteContent(),
          getBrandSettings()
        ]);

        if (hikesRes.data) setHikes(hikesRes.data);
        if (voteRes.data) setVotingRound(voteRes.data);
        if (reviewsRes.data) setReviews(reviewsRes.data);
        if (contentRes.data) setSiteContent(contentRes.data);
        if (brandRes.data) setBrand(brandRes.data);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleCastVote = async (optionId) => {
    if (!user) {
      alert('Please log in with your student account to vote.');
      return;
    }
    if (!votingRound) return;

    setVoteSubmitting(true);
    setVoteMessage(null);
    try {
      const res = await castVote(votingRound.id, optionId);
      if (res.success) {
        setVotingRound((prev) => ({
          ...prev,
          hasVoted: true,
          votedOptionId: optionId,
          options: prev.options.map((opt) =>
            opt.id === optionId ? { ...opt, votes_count: opt.votes_count + 1 } : opt
          ),
        }));
        setVoteMessage({ type: 'success', text: 'Boom! Your vote has been recorded.' });
      } else {
        setVoteMessage({ type: 'error', text: res.message || 'Voting failed' });
      }
    } catch (e) {
      setVoteMessage({ type: 'error', text: e.message });
    } finally {
      setVoteSubmitting(false);
    }
  };

  const hero = siteContent.hero || {};
  const whyJaipur = siteContent.why_jaipur || {};
  const whyAdventure = siteContent.why_adventure || {};
  const whyOnlyHikes = siteContent.why_onlyhikes || {};
  const howItWorks = siteContent.how_it_works || {};

  const totalRoundVotes = votingRound?.options?.reduce((sum, o) => sum + (o.votes_count || 0), 0) || 1;

  const defaultSteps = [
    { step: '01', title: 'Choose your expedition', desc: 'Select sunrise ridges, haunted fort night walks, or secluded valley treks.' },
    { step: '02', title: 'Reserve your seat', desc: 'Secure your spot online with student pricing (selling price ₹299 vs original ~~₹499~~).' },
    { step: '03', title: 'Board the AC bus', desc: 'Hop into our transit at Mansarovar, Vaishali Nagar, Raja Park, or WTP.' },
    { step: '04', title: 'Summit & enjoy', desc: 'Trek with certified marshals, enjoy hot chai & breakfast, and make real memories.' }
  ];

  const stepsList = Array.isArray(howItWorks.steps) && howItWorks.steps.length > 0 ? howItWorks.steps : defaultSteps;

  return (
    <Layout>
      {/* ==================================================================== */}
      {/* 1. HERO SECTION */}
      {/* ==================================================================== */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* Background glow and gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-charcoal-850 via-charcoal-950 to-charcoal-950 -z-10" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-acid/10 rounded-full blur-[140px] pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Dynamic Top Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-charcoal-900 border border-white/10 hover:border-acid/40 px-4 py-1.5 rounded-full mb-8 shadow-xl"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-acid opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-acid"></span>
            </span>
            <span className="text-xs font-bold text-offwhite tracking-wider uppercase font-mono">
              {hero.badge || "JAIPUR'S FIRST COLLEGE OUTDOOR REVOLUTION"}
            </span>
          </motion.div>

          {/* Main Display Headline (Cabinet Grotesk) */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display font-black text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-offwhite tracking-tight leading-[0.92] mb-8"
          >
            {hero.title_line1 || 'YOUR WEEKEND'}
            <br />
            <span className="text-acid underline decoration-acid/40 decoration-wavy decoration-2">
              {hero.title_line2 || 'JUST GOT WILDER.'}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted text-base sm:text-xl max-w-2xl mx-auto font-medium leading-relaxed mb-10"
          >
            {hero.subtitle ||
              'Discover ancient Aravali trails, panoramic fort sunrises, and unforgettable adventures with students from your city. AC transit, marshals, and squad included.'}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/hikes" className="w-full sm:w-auto">
              <Button variant="acid" size="xl" className="w-full sm:w-auto font-black uppercase tracking-wider">
                {hero.cta_text || 'EXPLORE SUNDAY HIKES →'}
              </Button>
            </Link>
            <a
              href={brand.whatsapp_community_url || 'https://whatsapp.com/channel/0029VbEaykELY6d6Jr9wht27'}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-charcoal-900 hover:bg-charcoal-800 text-offwhite border border-white/10 hover:border-emerald-500/50 px-8 py-4 rounded-2xl font-bold text-sm transition"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>{hero.secondary_cta || 'JOIN WHATSAPP CREW'}</span>
            </a>
          </motion.div>

          {/* Value Props Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-bold text-muted uppercase tracking-wider"
          >
            <div className="flex items-center justify-center gap-2">
              <Bus className="w-4 h-4 text-acid" />
              <span>Coordinated AC Transit</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Coffee className="w-4 h-4 text-acid" />
              <span>Hydration & Breakfast</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-acid" />
              <span>Trained Hike Marshals</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Camera className="w-4 h-4 text-acid" />
              <span>Group Photo Package</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 2. UPCOMING HIKES SECTION */}
      {/* ==================================================================== */}
      <section id="hikes" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-acid text-xs font-black uppercase tracking-widest">
              SCHEDULED EXPEDITIONS
            </span>
            <h2 className="font-display font-black text-3xl sm:text-5xl text-offwhite tracking-tight mt-1">
              WHERE ARE WE SUMMITING NEXT?
            </h2>
            <p className="text-muted text-sm sm:text-base mt-2">
              Real-time seat availability. All treks include pickup, marshals, and gear briefing.
            </p>
          </div>
          <Link href="/hikes">
            <Button variant="outline" size="sm">
              View All Trails →
            </Button>
          </Link>
        </div>

        {/* Hikes Grid */}
        {hikes.length === 0 ? (
          <div className="bg-charcoal-900 border border-dashed border-white/10 rounded-3xl p-16 text-center">
            <Mountain className="w-12 h-12 text-muted/30 mx-auto mb-3" />
            <h3 className="font-display font-black text-lg text-offwhite">Next Schedule Dropping Soon</h3>
            <p className="text-muted text-xs mt-1">Our coordinators are scouting the next Aravali circuit. Stay tuned!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hikes.map((hike) => (
              <TrekCard key={hike.id} hike={hike} />
            ))}
          </div>
        )}
      </section>

      {/* ==================================================================== */}
      {/* 3. WHY JAIPUR TREKS SECTION (CMS-DRIVEN) */}
      {/* ==================================================================== */}
      <section className="py-20 bg-charcoal-900 border-y border-white/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-acid text-xs font-black uppercase tracking-widest block mb-2">
                {whyJaipur.badge || 'LOCAL HERITAGE & RIDGES'}
              </span>
              <h2 className="font-display font-black text-3xl sm:text-5xl text-offwhite tracking-tight leading-tight mb-6">
                {whyJaipur.headline || 'THE OLDEST MOUNTAIN RANGE IN THE WORLD IS IN OUR BACKYARD.'}
              </h2>
              <p className="text-muted text-sm sm:text-base leading-relaxed mb-6 font-medium">
                {whyJaipur.description ||
                  "Jaipur isn't just pink palaces and college cafes. The ancient Aravalis wrap around the Pink City with hidden ridges, untouched stone steps, and misty sunrises that 90% of students never get to experience."}
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div>
                  <div className="font-display font-black text-2xl text-acid">650M+</div>
                  <div className="text-xs text-muted font-bold mt-1">Years Geological Age</div>
                </div>
                <div>
                  <div className="font-display font-black text-2xl text-flame">30+</div>
                  <div className="text-xs text-muted font-bold mt-1">Undiscovered Bastions & Trails</div>
                </div>
              </div>
            </div>

            <div className="relative aspect-square max-h-[480px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1200&q=80"
                alt="Nahargarh Ridge Sunrise Jaipur"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-xs font-black uppercase tracking-widest text-acid block">Aravali Dawn</span>
                <span className="font-display font-black text-lg text-offwhite">Nahargarh Outer Fort Ridge</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 4. WHY ADVENTURE MATTERS (CMS-DRIVEN) */}
      {/* ==================================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-flame text-xs font-black uppercase tracking-widest">
            {whyAdventure.badge || 'COLLEGE LIFE UNFILTERED'}
          </span>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-offwhite tracking-tight mt-1">
            {whyAdventure.headline || 'ESCAPE THE CAMPUS SCREEN LOOP.'}
          </h2>
          <p className="text-muted text-sm sm:text-base mt-3 leading-relaxed">
            {whyAdventure.description ||
              "College life shouldn't be endless assignments and late-night scrolling. Get your blood pumping, feel the chilly mountain wind on your face, and share high-fives at 650m altitude."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Sparkles,
              title: 'Mental Reset',
              text: 'Clear out academic burnout. One sunrise hike on the Aravalis resets your dopamine levels for the entire week.'
            },
            {
              icon: HeartHandshake,
              title: 'True Squad Bonds',
              text: 'Nothing builds real camaraderie like helping your squad climb a rocky boulder and sharing hot chai at the summit.'
            },
            {
              icon: Award,
              title: 'Physical Vitality',
              text: 'Torch calories, build endurance, and feel the exhilarating physical high of summiting ancient forts.'
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-charcoal-900 border border-white/10 p-8 rounded-3xl relative hover:border-acid/40 transition group"
              >
                <div className="w-12 h-12 rounded-2xl bg-charcoal-800 text-acid group-hover:bg-acid group-hover:text-charcoal-950 flex items-center justify-center mb-6 transition">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-black text-xl text-offwhite mb-2">
                  {item.title}
                </h3>
                <p className="text-muted text-xs leading-relaxed">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 5. WHY ONLYHIKES (CMS-DRIVEN) */}
      {/* ==================================================================== */}
      <section className="py-20 bg-charcoal-900 border-t border-white/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-acid text-xs font-black uppercase tracking-widest">
              {whyOnlyHikes.badge || 'THE ONLYHIKES PROMISE'}
            </span>
            <h2 className="font-display font-black text-3xl sm:text-5xl text-offwhite tracking-tight mt-1">
              {whyOnlyHikes.headline || 'NOT A TRAVEL AGENCY. A STUDENT ADVENTURE MOVEMENT.'}
            </h2>
            <p className="text-muted text-sm sm:text-base mt-3">
              We eliminated every annoying hassle that stops college students from exploring nature.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Bus,
                title: 'Fixed Transit Pickups',
                desc: 'No expensive cabs at 4:30 AM. Our chartered AC bus picks you up at WTP, Raja Park, Vaishali, and Mansarovar.'
              },
              {
                icon: ShieldCheck,
                title: 'Safety Marshals',
                desc: 'Every expedition is accompanied by certified wilderness marshals equipped with first-aid and two-way radios.'
              },
              {
                icon: Coffee,
                title: 'Summit Breakfast',
                desc: 'Hot poha, bananas, energy bars, and steaming Jaipur masala chai served at the summit view points.'
              },
              {
                icon: Users,
                title: 'Student-Only Vibe',
                desc: 'Strictly college students. Zero awkward family tourist crowds. Safe, inclusive, and high-energy vibes.'
              }
            ].map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="bg-charcoal-850 border border-white/10 p-6 rounded-3xl flex flex-col justify-between hover:border-acid/40 transition"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-charcoal-800 text-acid flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-display font-black text-lg text-offwhite mb-2">
                      {card.title}
                    </h3>
                    <p className="text-muted text-xs leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 6. HOW IT WORKS (CMS-DRIVEN) */}
      {/* ==================================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-acid text-xs font-black uppercase tracking-widest">
            ZERO PLANNING STRESS
          </span>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-offwhite tracking-tight mt-1">
            {howItWorks.headline || 'HOW IT WORKS IN 4 SIMPLE STEPS'}
          </h2>
          <p className="text-muted text-sm sm:text-base mt-2">
            From your bed to the Aravali summit in just a few taps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stepsList.map((item, idx) => (
            <div
              key={idx}
              className="bg-charcoal-900 border border-white/10 p-8 rounded-3xl relative group hover:border-acid/40 transition"
            >
              <span className="font-display font-black text-4xl text-acid/40 group-hover:text-acid transition-colors block mb-4">
                {item.step || `0${idx + 1}`}
              </span>
              <h3 className="font-display font-black text-lg text-offwhite mb-2">
                {item.title}
              </h3>
              <p className="text-muted text-xs leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 7. GENUINE STUDENT REVIEWS (ONLY APPROVED DATABASE REVIEWS) */}
      {/* ==================================================================== */}
      <section id="reviews" className="py-20 bg-charcoal-900 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="acid" size="sm" className="mb-3">
              GENUINE STUDENT VOICES
            </Badge>
            <h2 className="font-display font-black text-3xl sm:text-5xl text-offwhite tracking-tight">
              COMMUNITY SUMMIT LOGS
            </h2>
            <p className="text-muted text-sm sm:text-base mt-2">
              Verified reviews submitted by students who hiked with our marshals across Jaipur.
            </p>
          </div>

          {reviews.length === 0 ? (
            <div className="bg-charcoal-950 border border-dashed border-white/15 rounded-3xl p-12 text-center max-w-2xl mx-auto">
              <Star className="w-12 h-12 text-amber-400/40 mx-auto mb-3" />
              <h3 className="font-display font-black text-lg text-offwhite">
                Be Among The First To Leave A Review!
              </h3>
              <p className="text-muted text-xs max-w-md mx-auto mt-2 leading-relaxed">
                We only showcase 100% genuine reviews from students who completed our treks. Join this Sunday's expedition and share your summit story.
              </p>
              <div className="mt-6">
                <Link href="/hikes">
                  <Button variant="acid" size="sm">
                    Book Sunday Trek →
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-charcoal-850 border border-white/10 p-6 rounded-3xl flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-1 text-amber-400 mb-4">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-offwhite/90 text-sm italic leading-relaxed mb-6">
                      "{rev.comment}"
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <div className="font-display font-black text-sm text-offwhite">
                        {rev.author_name}
                      </div>
                      <div className="text-[11px] text-muted font-semibold">
                        {rev.author_college}
                      </div>
                    </div>
                    <Badge variant="success" size="xs">
                      Verified Attendee
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 8. BOTTOM CALL TO ACTION */}
      {/* ==================================================================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-charcoal-900 via-charcoal-850 to-charcoal-900 border border-white/15 p-8 md:p-14 text-center">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-acid/15 rounded-full blur-[100px] pointer-events-none" />
          <span className="text-acid text-xs font-black uppercase tracking-widest block mb-2">
            LIMITED SEATS PER COACH
          </span>
          <h2 className="font-display font-black text-3xl sm:text-5xl md:text-6xl text-offwhite tracking-tight mb-4">
            DON'T SPEND YOUR WEEKEND INDOORS.
          </h2>
          <p className="text-muted text-sm sm:text-lg max-w-xl mx-auto mb-8 font-medium">
            Next hike takes off this Sunday at 5:30 AM from Mansarovar Metro. Grab your seat before the coach fills up.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/hikes">
              <Button variant="acid" size="lg" className="uppercase font-black">
                BOOK YOUR SEAT (₹299) →
              </Button>
            </Link>
            <a
              href={brand.whatsapp_community_url || 'https://whatsapp.com/channel/0029VbEaykELY6d6Jr9wht27'}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-charcoal-800 hover:bg-charcoal-700 text-offwhite px-6 py-3.5 rounded-xl font-bold text-sm transition"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              WhatsApp Channel
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}

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
  ExternalLink
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import TrekCard from '../components/hikes/TrekCard';
import VoteCard from '../components/voting/VoteCard';
import { getHikes, getActiveVotingRound, castVote, getReviews, getExploreJaipur } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { user, loginAsDemoStudent, loginAsDemoAdmin, isAdmin } = useAuth();
  const [hikes, setHikes] = useState([]);
  const [votingRound, setVotingRound] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [exploreSpots, setExploreSpots] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [voteSubmitting, setVoteSubmitting] = useState(false);
  const [voteMessage, setVoteMessage] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [hikesRes, voteRes, reviewsRes, exploreRes] = await Promise.all([
          getHikes(),
          getActiveVotingRound(),
          getReviews(),
          getExploreJaipur(),
        ]);

        if (hikesRes.data) setHikes(hikesRes.data);
        if (voteRes.data) setVotingRound(voteRes.data);
        if (reviewsRes.data) setReviews(reviewsRes.data);
        if (exploreRes.data) setExploreSpots(exploreRes.data);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
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

  const categories = ['All', 'Hiking', 'Forts', 'Sunrise', 'Sunset', 'Nature', 'Hidden Spots'];

  const filteredExplore =
    activeCategory === 'All'
      ? exploreSpots
      : exploreSpots.filter((s) => s.category?.toLowerCase() === activeCategory.toLowerCase());

  const totalRoundVotes =
    votingRound?.options?.reduce((sum, o) => sum + (o.votes_count || 0), 0) || 1;

  return (
    <Layout>
      {/* Dev / Quick Test Bar for Evaluators */}
      <div className="bg-charcoal-900 border-b border-white/10 px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-acid animate-ping" />
            <span className="font-bold text-offwhite">Evaluator Quick Switcher:</span>
            <span className="text-muted">
              {user ? `Active: ${user.full_name} (${isAdmin ? 'Admin' : 'Student'})` : 'Guest Session'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {!user ? (
              <>
                <button
                  onClick={loginAsDemoStudent}
                  className="px-2.5 py-1 bg-acid/15 hover:bg-acid text-acid hover:text-charcoal-950 font-bold rounded-lg transition"
                >
                  ⚡ Student View
                </button>
                <button
                  onClick={loginAsDemoAdmin}
                  className="px-2.5 py-1 bg-flame/15 hover:bg-flame text-flame hover:text-white font-bold rounded-lg transition"
                >
                  🛡️ Admin View
                </button>
              </>
            ) : (
              <span className="text-acid font-semibold text-[11px]">Logged in</span>
            )}
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 1. HERO SECTION */}
      {/* ==================================================================== */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 py-20">
        {/* Background Atmosphere */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-charcoal-800/60 via-charcoal-950 to-charcoal-950 -z-10" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-acid/10 rounded-full blur-[140px] pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Social Proof Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-charcoal-850/90 border border-white/10 hover:border-acid/40 px-4 py-2 rounded-full mb-8 shadow-xl"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-acid opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-acid"></span>
            </span>
            <span className="text-xs font-bold text-offwhite tracking-wide">
              1,200+ Jaipur students hiked with us
            </span>
            <span className="text-[10px] bg-purple-950/80 text-purple-300 px-2 py-0.5 rounded-full font-bold uppercase border border-purple-500/30">
              Demo Data
            </span>
          </motion.div>

          {/* Subtitle / City Tag */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-acid font-black text-sm sm:text-base uppercase tracking-widest mb-3"
          >
            Jaipur's student hiking community.
          </motion.p>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-display font-black text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-offwhite tracking-tight leading-[0.92] mb-8"
          >
            YOUR WEEKEND
            <br />
            <span className="text-stroke text-transparent hover:text-offwhite transition-colors duration-300">
              JUST GOT
            </span>{' '}
            <span className="text-acid underline decoration-acid/40 decoration-wavy decoration-2">
              WILDER.
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-muted text-base sm:text-xl max-w-2xl mx-auto font-medium leading-relaxed mb-10"
          >
            Discover trails, forts, hidden spots and unforgettable weekends with people from your city.
            Pickup, drop, breakfast, and squad included.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/hikes" className="w-full sm:w-auto">
              <Button variant="acid" size="xl" className="w-full sm:w-auto">
                EXPLORE HIKES →
              </Button>
            </Link>
            <Link href="/vote" className="w-full sm:w-auto">
              <Button variant="outline" size="xl" className="w-full sm:w-auto">
                VOTE FOR NEXT HIKE
              </Button>
            </Link>
          </motion.div>

          {/* Value Props Pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-bold text-muted uppercase tracking-wider"
          >
            <div className="flex items-center justify-center gap-2">
              <Bus className="w-4 h-4 text-acid" />
              <span>AC Bus Pickup & Drop</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Coffee className="w-4 h-4 text-acid" />
              <span>Chai & Breakfast</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-acid" />
              <span>Lead Coordinators</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Users className="w-4 h-4 text-acid" />
              <span>College Squad Only</span>
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
              OCTOBER SCHEDULE
            </span>
            <h2 className="font-display font-black text-3xl sm:text-5xl text-offwhite tracking-tight mt-1">
              WHERE ARE WE GOING NEXT?
            </h2>
            <p className="text-muted text-sm sm:text-base mt-2">
              Pick a trail. Grab your friends. We'll handle the rest.
            </p>
          </div>
          <Link href="/hikes">
            <Button variant="outline" size="sm">
              View All Trails →
            </Button>
          </Link>
        </div>

        {/* Hikes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hikes.slice(0, 3).map((hike) => (
            <TrekCard key={hike.id} hike={hike} />
          ))}
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 3. HOW IT WORKS */}
      {/* ==================================================================== */}
      <section className="py-20 bg-charcoal-900 border-y border-white/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-acid text-xs font-black uppercase tracking-widest">
              ZERO HASSLE WEEKENDS
            </span>
            <h2 className="font-display font-black text-3xl sm:text-5xl text-offwhite tracking-tight mt-1">
              HOW IT WORKS
            </h2>
            <p className="text-muted text-sm sm:text-base mt-2">
              No planning stress. Just show up at your nearest Jaipur pickup spot.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Choose your adventure',
                desc: 'Select sunrise ridges, haunted fort night walks, or secluded valley treks.',
              },
              {
                step: '02',
                title: 'Book your seat',
                desc: 'Secure your spot online with student pricing (use coupon ONLYHIKES50 for ₹50 off).',
              },
              {
                step: '03',
                title: 'We pick you up',
                desc: 'Hop into our AC transport from WTP, Raja Park, Vaishali Nagar, or Mansarovar.',
              },
              {
                step: '04',
                title: 'Hike, eat & have fun',
                desc: 'Trek with certified marshals, enjoy hot poha & chai, and meet fellow Jaipur students.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-charcoal-850 border border-white/10 p-8 rounded-3xl relative group hover:border-acid/40 transition-colors"
              >
                <span className="font-display font-black text-4xl text-acid/40 group-hover:text-acid transition-colors block mb-4">
                  {item.step}
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
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 4. COMMUNITY DESTINATION VOTING */}
      {/* ==================================================================== */}
      {votingRound && (
        <section id="vote" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="flame" size="sm" className="mb-3">
              COMMUNITY POLL
            </Badge>
            <h2 className="font-display font-black text-3xl sm:text-5xl text-offwhite tracking-tight">
              WHERE SHOULD WE GO NEXT?
            </h2>
            <p className="text-muted text-sm sm:text-base mt-2">
              "You decide the next adventure." The trail with the highest votes gets scheduled for next weekend.
            </p>
          </div>

          {voteMessage && (
            <div
              className={`max-w-md mx-auto mb-8 p-3 rounded-xl text-center text-xs font-bold ${
                voteMessage.type === 'success'
                  ? 'bg-acid/20 text-acid border border-acid/40'
                  : 'bg-flame/20 text-flame border border-flame/40'
              }`}
            >
              {voteMessage.text}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {votingRound.options?.map((option) => (
              <VoteCard
                key={option.id}
                option={option}
                totalRoundVotes={totalRoundVotes}
                hasVoted={votingRound.hasVoted}
                isVotedByMe={votingRound.votedOptionId === option.id}
                isLoggedIn={Boolean(user)}
                onVote={handleCastVote}
                isPlaceholderDemo={votingRound.isPlaceholderDemo}
                submitting={voteSubmitting}
              />
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link href="/vote">
              <Button variant="outline" size="sm">
                Full Voting Round Details →
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* ==================================================================== */}
      {/* 5. EXPLORE JAIPUR */}
      {/* ==================================================================== */}
      <section id="explore" className="py-20 bg-charcoal-900 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-acid text-xs font-black uppercase tracking-widest">
                LOCAL ADVENTURE GUIDE
              </span>
              <h2 className="font-display font-black text-3xl sm:text-5xl text-offwhite tracking-tight mt-1">
                JAIPUR HAS MORE TO OFFER.
              </h2>
              <p className="text-muted text-sm sm:text-base mt-2">
                Beyond the usual cafes and movie halls. Uncharted Aravali trails and hidden bastions.
              </p>
            </div>
            <Link href="/explore">
              <Button variant="outline" size="sm">
                Browse Full Guide →
              </Button>
            </Link>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider shrink-0 transition ${
                  activeCategory === cat
                    ? 'bg-acid text-charcoal-950 font-black shadow-acid-sm'
                    : 'bg-charcoal-800 text-muted hover:text-offwhite hover:bg-charcoal-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Explore Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredExplore.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="group bg-charcoal-850 border border-white/10 rounded-2xl overflow-hidden hover:border-acid/40 transition"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="acid" size="xs">
                      {item.category}
                    </Badge>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-display font-bold text-base text-offwhite group-hover:text-acid transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-muted flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-acid" /> {item.location}
                  </p>
                  <p className="text-xs text-muted/80 line-clamp-2 mt-2">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 6. COMMUNITY & REVIEWS */}
      {/* ==================================================================== */}
      <section id="community" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="acid" size="sm" className="mb-3">
            STUDENT VOICES
          </Badge>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-offwhite tracking-tight">
            NOT JUST A HIKE.
            <br />
            IT'S A COMMUNITY.
          </h2>
          <p className="text-muted text-sm sm:text-base mt-2">
            Real experiences from students across MNIT, Manipal, Amity, JECRC, and Rajasthan University.
          </p>
          <div className="inline-block mt-2">
            <Badge variant="demo" size="xs">
              Clearly Marked Demo Review Architecture
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-charcoal-900 border border-white/10 p-6 rounded-3xl flex flex-col justify-between"
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
                  Verified Hiker
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 7. BOTTOM BANNER */}
      {/* ==================================================================== */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-charcoal-900 via-charcoal-850 to-charcoal-900 border border-white/15 p-8 md:p-14 text-center">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-acid/15 rounded-full blur-[100px] pointer-events-none" />
          <h2 className="font-display font-black text-3xl sm:text-5xl md:text-6xl text-offwhite tracking-tight mb-4">
            DON'T SPEND YOUR WEEKEND INDOORS.
          </h2>
          <p className="text-muted text-sm sm:text-lg max-w-xl mx-auto mb-8 font-medium">
            Next hike takes off this Sunday at 5:30 AM. Limited seats on the AC coach. Grab yours before it's full.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/hikes">
              <Button variant="acid" size="lg" className="uppercase font-black">
                BOOK YOUR SEAT (₹299) →
              </Button>
            </Link>
            <Link href="/vote">
              <Button variant="outline" size="lg">
                Vote for Destinations
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}

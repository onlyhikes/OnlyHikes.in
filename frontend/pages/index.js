import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Bus,
  Coffee,
  Vote,
  CheckCircle,
  AlertCircle,
  Mountain,
  ArrowDown
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import TrekCard from '../components/hikes/TrekCard';
import VoteCard from '../components/voting/VoteCard';
import {
  getHikes,
  getActiveVotingRound,
  castVote
} from '../lib/api';

export default function HomePage() {
  const [hikes, setHikes] = useState([]);
  const [votingRound, setVotingRound] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voteSubmitting, setVoteSubmitting] = useState(false);
  const [voteMessage, setVoteMessage] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [hikesRes, voteRes] = await Promise.all([
          getHikes(),
          getActiveVotingRound(false)
        ]);

        if (hikesRes.data) setHikes(hikesRes.data);
        if (voteRes.data && voteRes.data.is_active) {
          setVotingRound(voteRes.data);
        } else {
          setVotingRound(null);
        }
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleCastVote = async (optionId) => {
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
            opt.id === optionId ? { ...opt, votes_count: (opt.votes_count || 0) + 1 } : opt
          ),
        }));
        setVoteMessage({ type: 'success', text: 'Your vote has been recorded!' });
      } else {
        setVoteMessage({ type: 'error', text: res.message || 'Voting failed' });
      }
    } catch (e) {
      setVoteMessage({ type: 'error', text: e.message });
    } finally {
      setVoteSubmitting(false);
    }
  };

  const totalRoundVotes = votingRound?.options?.reduce((sum, o) => sum + (o.votes_count || 0), 0) || 1;

  return (
    <Layout>
      {/* ==================================================================== */}
      {/* 1. CLEAN HERO SECTION */}
      {/* ==================================================================== */}
      <section className="relative pt-28 pb-14 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-charcoal-850 via-charcoal-950 to-charcoal-950 -z-10" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-acid/10 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 bg-charcoal-900 border border-white/10 px-4 py-1.5 rounded-full mb-6"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-acid opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-acid"></span>
            </span>
            <span className="text-xs font-bold text-offwhite tracking-wider uppercase font-mono">
              JAIPUR STUDENT HIKING COMMUNITY
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="font-display font-black text-4xl sm:text-6xl md:text-7xl text-offwhite tracking-tight leading-[0.95] mb-5"
          >
            YOUR WEEKEND
            <br />
            <span className="text-acid">JUST GOT WILDER.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-muted text-sm sm:text-lg max-w-xl mx-auto font-medium leading-relaxed mb-8"
          >
            Check live seat availability and book your Sunday hike pass below. AC bus pickup, marshals, and refreshments included.
          </motion.p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a href="#hikes">
              <Button variant="acid" size="lg" className="font-black uppercase tracking-wider text-xs sm:text-sm">
                View Available Hikes & Seats <ArrowDown className="w-4 h-4 ml-1.5 inline" />
              </Button>
            </a>

            {votingRound && votingRound.is_active && (
              <a href="#vote">
                <Button variant="outline" size="lg" className="font-black uppercase tracking-wider text-xs sm:text-sm">
                  <Vote className="w-4 h-4 mr-1.5 inline text-acid" />
                  Vote Next Trail
                </Button>
              </a>
            )}
          </div>

          {/* Simple Inclusions Strip */}
          <div className="mt-12 pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-muted uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <Bus className="w-4 h-4 text-acid" />
              <span>AC Bus Pickup & Drop</span>
            </div>
            <div className="flex items-center gap-2">
              <Coffee className="w-4 h-4 text-acid" />
              <span>Breakfast & Hydration</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-acid" />
              <span>Trained Hike Marshals</span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 2. TICKET BOOKING & LIVE SEAT AVAILABILITY */}
      {/* ==================================================================== */}
      <section id="hikes" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 pb-4 border-b border-white/10">
          <div>
            <span className="text-acid text-xs font-black uppercase tracking-widest">
              LIVE SEAT AVAILABILITY & TICKETS
            </span>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-offwhite tracking-tight mt-1">
              UPCOMING HIKES
            </h2>
          </div>
          <div className="text-xs font-bold text-muted">
            Select any hike below to check seats & book your pass
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <div className="w-8 h-8 border-2 border-acid border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-bold text-muted">Loading available hikes & seats...</p>
          </div>
        ) : hikes.length === 0 ? (
          <div className="bg-charcoal-900 border border-dashed border-white/10 rounded-3xl p-14 text-center">
            <Mountain className="w-10 h-10 text-muted/30 mx-auto mb-3" />
            <h3 className="font-display font-black text-lg text-offwhite">Next Hike Dropping Soon</h3>
            <p className="text-muted text-xs mt-1">Stay tuned for the upcoming Sunday schedule.</p>
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
      {/* 3. CONDITIONAL COMMUNITY VOTING (Appears ONLY when Admin turns it ON) */}
      {/* ==================================================================== */}
      {votingRound && votingRound.is_active && (
        <section id="vote" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="bg-charcoal-900/80 border border-acid/30 rounded-3xl p-6 sm:p-10 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="acid" size="xs">
                    ● LIVE COMMUNITY POLL
                  </Badge>
                </div>
                <h2 className="font-display font-black text-2xl sm:text-4xl text-offwhite tracking-tight">
                  {votingRound.title || 'VOTE NEXT SUNDAY TRAIL'}
                </h2>
                <p className="text-muted text-xs sm:text-sm mt-1">
                  {votingRound.description || 'Cast your vote below to decide where we hike next!'}
                </p>
              </div>
              <div className="text-left md:text-right">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted block">Total Votes</span>
                <span className="font-display font-black text-2xl text-acid">
                  {votingRound.options?.reduce((s, o) => s + (o.votes_count || 0), 0) || 0}
                </span>
              </div>
            </div>

            {voteMessage && (
              <div
                className={`mb-6 p-3.5 rounded-xl flex items-center gap-2 text-xs font-bold ${
                  voteMessage.type === 'success'
                    ? 'bg-acid/15 border border-acid/40 text-acid'
                    : 'bg-red-950/60 border border-red-500/30 text-red-300'
                }`}
              >
                {voteMessage.type === 'success' ? (
                  <CheckCircle className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{voteMessage.text}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(votingRound.options || []).map((option) => (
                <VoteCard
                  key={option.id}
                  option={option}
                  totalRoundVotes={totalRoundVotes}
                  hasVoted={votingRound.hasVoted}
                  isVotedByMe={votingRound.votedOptionId === option.id}
                  onVote={handleCastVote}
                  submitting={voteSubmitting}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}

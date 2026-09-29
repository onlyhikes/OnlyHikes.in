import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Vote as VoteIcon, Sparkles, CheckCircle2, Clock, Lock, Flame } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import VoteCard from '../components/voting/VoteCard';
import { getActiveVotingRound, castVote } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function VotingPage() {
  const { user } = useAuth();
  const [round, setRound] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function fetchRound() {
      setLoading(true);
      try {
        const res = await getActiveVotingRound();
        if (res.data) setRound(res.data);
      } catch (err) {
        console.error('Failed to load voting round:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchRound();
  }, []);

  const handleVote = async (optionId) => {
    if (!user) {
      alert('Please log in with your student account to vote.');
      return;
    }
    if (!round) return;

    setSubmitting(true);
    setMessage(null);

    try {
      const res = await castVote(round.id, optionId);
      if (res.success) {
        setRound((prev) => ({
          ...prev,
          hasVoted: true,
          votedOptionId: optionId,
          options: prev.options.map((opt) =>
            opt.id === optionId ? { ...opt, votes_count: opt.votes_count + 1 } : opt
          ),
        }));
        setMessage({ type: 'success', text: 'Boom! Your vote has been recorded for this round.' });
      } else {
        setMessage({ type: 'error', text: res.message || 'Voting failed.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'An error occurred while voting.' });
    } finally {
      setSubmitting(false);
    }
  };

  const totalVotes = round?.options?.reduce((sum, o) => sum + (o.votes_count || 0), 0) || 1;

  return (
    <Layout>
      <Head>
        <title>Community Trail Voting — OnlyHikes.in Jaipur</title>
        <meta name="description" content="Vote for the next weekend hiking trail in Jaipur. You decide where OnlyHikes goes." />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <Badge variant="flame" size="sm" className="mb-3">
            STUDENT BALLOT
          </Badge>
          <h1 className="font-display font-black text-4xl sm:text-6xl text-offwhite tracking-tight">
            WHERE SHOULD WE GO NEXT?
          </h1>
          <p className="text-muted text-sm sm:text-base mt-3 leading-relaxed">
            "You decide the next adventure." The winning destination gets scheduled for next weekend with exclusive student pricing and AC coach pickups.
          </p>

          {/* Voting Rules Pill */}
          <div className="mt-4 inline-flex items-center gap-2 text-[11px] text-muted bg-charcoal-900 border border-white/10 px-4 py-1.5 rounded-full">
            <span>Strict Rule: <strong>1 vote per student account per round</strong></span>
            <span>•</span>
            <span className="text-acid">Enforced in database</span>
          </div>
        </div>

        {/* Feedback Alert */}
        {message && (
          <div
            className={`max-w-lg mx-auto mb-8 p-4 rounded-2xl text-center text-xs font-bold ${
              message.type === 'success'
                ? 'bg-acid/20 text-acid border border-acid/40'
                : 'bg-flame/20 text-flame border border-flame/40'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Not Logged In Warning Banner */}
        {!user && (
          <div className="max-w-xl mx-auto mb-10 bg-charcoal-900 border border-white/10 p-5 rounded-3xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-acid shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-offwhite block">Login required to cast your vote</span>
                <span className="text-muted">Sign in with your student email to participate.</span>
              </div>
            </div>
            <Link href="/login" className="shrink-0">
              <Button variant="acid" size="sm">
                Login Now
              </Button>
            </Link>
          </div>
        )}

        {/* Voting Grid */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-8 h-8 border-2 border-acid border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-bold text-muted">Loading active destinations...</p>
          </div>
        ) : round ? (
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <div>
                <h3 className="font-display font-black text-lg text-offwhite">{round.title}</h3>
                <span className="text-xs text-muted">{round.description}</span>
              </div>
              <div className="text-right">
                <span className="font-display font-black text-xl text-acid">{totalVotes}</span>
                <span className="text-[10px] text-muted block uppercase tracking-wider">Total Ballots</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {round.options?.map((option) => (
                <VoteCard
                  key={option.id}
                  option={option}
                  totalRoundVotes={totalVotes}
                  hasVoted={round.hasVoted}
                  isVotedByMe={round.votedOptionId === option.id}
                  isLoggedIn={Boolean(user)}
                  onVote={handleVote}
                  isPlaceholderDemo={round.isPlaceholderDemo}
                  submitting={submitting}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="py-20 text-center bg-charcoal-900 border border-white/10 rounded-3xl max-w-md mx-auto">
            <VoteIcon className="w-12 h-12 text-muted mx-auto mb-3" />
            <h3 className="font-display font-black text-lg text-offwhite mb-2">No Active Round</h3>
            <p className="text-muted text-xs">New destinations are announced every Monday.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}

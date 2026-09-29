import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Flame, Vote as VoteIcon, Lock } from 'lucide-react';
import Badge from '../ui/Badge';

export default function VoteCard({
  option,
  totalRoundVotes = 1,
  hasVoted = false,
  isVotedByMe = false,
  isLoggedIn = false,
  onVote,
  isPlaceholderDemo = false,
  submitting = false
}) {
  const percentage = totalRoundVotes > 0
    ? Math.round((option.votes_count / totalRoundVotes) * 100)
    : 0;

  return (
    <div
      className={`relative flex flex-col bg-charcoal-900 border rounded-3xl overflow-hidden transition-all ${
        isVotedByMe
          ? 'border-acid shadow-acid-glow/30 ring-1 ring-acid'
          : 'border-white/10 hover:border-white/20'
      }`}
    >
      {/* Destination Image */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-charcoal-800">
        <img
          src={option.image_url || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'}
          alt={option.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/40 to-transparent" />

        {/* Difficulty badge */}
        <div className="absolute top-4 left-4">
          <Badge variant="charcoal" size="xs">
            {option.difficulty || 'Moderate'}
          </Badge>
        </div>

        {isVotedByMe && (
          <div className="absolute bottom-3 right-4 bg-acid text-charcoal-950 font-black text-xs px-3 py-1 rounded-full flex items-center gap-1.5 shadow-acid-sm">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Your Choice
          </div>
        )}
      </div>

      {/* Details & Progress */}
      <div className="p-6 flex flex-col flex-grow">
        <h4 className="font-display font-black text-lg text-offwhite tracking-tight mb-1">
          {option.title}
        </h4>
        <p className="text-muted text-xs leading-relaxed mb-4">
          {option.subtitle}
        </p>

        {/* Animated Percentage Bar */}
        <div className="space-y-1.5 mb-5 mt-auto">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-offwhite">{option.votes_count} votes</span>
            <span className="text-acid font-black text-sm">{percentage}%</span>
          </div>
          <div className="w-full h-2.5 bg-charcoal-800 rounded-full overflow-hidden p-0.5 border border-white/5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className={`h-full rounded-full ${isVotedByMe ? 'bg-acid shadow-acid-sm' : 'bg-charcoal-600'}`}
            />
          </div>
        </div>

        {/* Voting Action */}
        {!hasVoted ? (
          isLoggedIn ? (
            <button
              onClick={() => onVote(option.id)}
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-charcoal-800 hover:bg-acid text-offwhite hover:text-charcoal-950 font-black text-xs uppercase tracking-wider transition-all disabled:opacity-50"
            >
              <VoteIcon className="w-4 h-4" />
              <span>{submitting ? 'Casting Vote...' : 'Vote for this trail'}</span>
            </button>
          ) : (
            <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-charcoal-850/60 border border-white/5 text-muted text-xs font-bold">
              <Lock className="w-3.5 h-3.5" />
              <span>Login to vote</span>
            </div>
          )
        ) : (
          <div className="text-center py-2.5 rounded-xl bg-charcoal-850/60 border border-white/5 text-xs font-semibold text-muted">
            {isVotedByMe ? 'You voted for this destination' : 'Round voted'}
          </div>
        )}
      </div>
    </div>
  );
}

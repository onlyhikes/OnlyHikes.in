import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Vote, Plus, Eye, EyeOff, CheckCircle2, Trash2, X } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { getActiveVotingRound, toggleVotingRound, createVotingRound } from '../../lib/api';

export default function AdminVotingPage() {
  const [round, setRound] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [newTitle, setNewTitle] = useState('VOTE NEXT SUNDAY TRAIL');
  const [newDescription, setNewDescription] = useState('Which Aravali trail should we hike next Sunday? Cast your vote below!');
  const [options, setOptions] = useState([
    { title: 'Sambhar Salt Lake Sunrise', subtitle: 'White salt flats & morning breeze' },
    { title: 'Amer Sagar Stepwell & Ridge', subtitle: 'Hidden stepwell & fort wall climb' },
    { title: 'Garh Ganesh Ridge Trail', subtitle: 'Panoramic Jaipur ridge walk' },
  ]);

  const loadRound = async () => {
    setLoading(true);
    try {
      const res = await getActiveVotingRound(true);
      if (res.data) setRound(res.data);
    } catch (err) {
      console.error('Voting round load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRound();
  }, []);

  const handleToggleVoting = async () => {
    if (!round) return;
    setToggling(true);
    setFeedback(null);
    try {
      const nextState = !round.is_active;
      const res = await toggleVotingRound(nextState);
      if (res.data) {
        setRound(res.data);
        setFeedback(
          nextState
            ? 'Voting is now LIVE on the public website! Students can see and vote now.'
            : 'Voting is now HIDDEN from the public website.'
        );
      }
    } catch (err) {
      console.error('Failed to toggle voting:', err);
    } finally {
      setToggling(false);
    }
  };

  const handleCreateRound = async (e) => {
    e.preventDefault();
    const validOptions = options.filter(o => o.title.trim() !== '');
    if (validOptions.length < 2) {
      alert('Please enter at least 2 trail options.');
      return;
    }

    const res = await createVotingRound({
      title: newTitle || 'VOTE NEXT SUNDAY TRAIL',
      description: newDescription,
      is_active: true,
      options: validOptions
    });

    if (res.data) {
      setRound(res.data);
      setShowCreateModal(false);
      setFeedback('New voting poll published and turned ON on the website!');
    }
  };

  const handleOptionChange = (idx, field, value) => {
    setOptions(prev => prev.map((opt, i) => (i === idx ? { ...opt, [field]: value } : opt)));
  };

  const addOptionSlot = () => {
    setOptions(prev => [...prev, { title: '', subtitle: '' }]);
  };

  const removeOptionSlot = (idx) => {
    if (options.length <= 2) return;
    setOptions(prev => prev.filter((_, i) => i !== idx));
  };

  const totalVotes = round?.options?.reduce((sum, o) => sum + (o.votes_count || 0), 0) || 0;

  return (
    <AdminLayout
      title="COMMUNITY VOTING CONTROL"
      subtitle="Turn voting ON or OFF on the public website anytime, or create a new poll"
      action={
        <Button variant="acid" size="sm" icon={Plus} onClick={() => setShowCreateModal(true)}>
          Create New Poll
        </Button>
      }
    >
      <Head>
        <title>Manage Voting — OnlyHikes Coordinator Admin</title>
      </Head>

      {/* Master Website Visibility Switch Banner */}
      <div
        className={`rounded-3xl p-6 sm:p-8 mb-8 border transition-all ${
          round?.is_active
            ? 'bg-acid/10 border-acid/40'
            : 'bg-charcoal-900 border-white/10'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`w-3 h-3 rounded-full ${
                  round?.is_active ? 'bg-acid animate-ping' : 'bg-muted/40'
                }`}
              />
              <span className="text-xs font-black uppercase tracking-widest text-offwhite">
                {round?.is_active
                  ? 'VOTING IS CURRENTLY LIVE ON WEBSITE'
                  : 'VOTING IS CURRENTLY HIDDEN FROM WEBSITE'}
              </span>
            </div>
            <h2 className="font-display font-black text-xl sm:text-2xl text-offwhite">
              {round?.is_active
                ? 'Students can see the Voting section on the Homepage right now'
                : 'Voting section is hidden — website shows only Ticket Booking & Seats'}
            </h2>
            <p className="text-xs text-muted mt-1">
              Click the button on the right whenever you want to ask students to vote for the next trail.
            </p>
          </div>

          <button
            onClick={handleToggleVoting}
            disabled={toggling || loading}
            className={`px-6 py-4 rounded-2xl font-display font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shrink-0 transition shadow-xl ${
              round?.is_active
                ? 'bg-red-600 hover:bg-red-500 text-white'
                : 'bg-acid hover:bg-acid/90 text-charcoal-950'
            }`}
          >
            {round?.is_active ? (
              <>
                <EyeOff className="w-4 h-4" />
                <span>Turn Voting OFF (Hide from Site)</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                <span>Turn Voting ON (Show on Site)</span>
              </>
            )}
          </button>
        </div>

        {feedback && (
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2 text-xs font-bold text-acid">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}
      </div>

      {/* Active Round Summary Card */}
      {round && (
        <div className="bg-charcoal-900 border border-white/10 rounded-3xl p-6 sm:p-8 mb-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant={round.is_active ? 'acid' : 'charcoal'} size="xs">
                  {round.is_active ? '● Visible on Website' : 'Hidden from Website'}
                </Badge>
              </div>
              <h2 className="font-display font-black text-2xl text-offwhite mt-1">
                {round.title}
              </h2>
              <p className="text-xs text-muted mt-1">{round.description}</p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-muted font-bold block uppercase tracking-wider">Total Votes</span>
              <span className="font-display font-black text-3xl text-acid">{totalVotes}</span>
            </div>
          </div>

          {/* Results table */}
          <div className="mt-6 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-offwhite">
              Trail Options & Live Votes
            </h3>

            {round.options?.map((opt) => {
              const percentage = totalVotes > 0 ? Math.round(((opt.votes_count || 0) / totalVotes) * 100) : 0;
              return (
                <div key={opt.id} className="bg-charcoal-850 p-4 rounded-2xl border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm text-offwhite">{opt.title}</span>
                      {opt.subtitle && (
                        <span className="text-xs text-muted ml-2">— {opt.subtitle}</span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="font-black text-acid text-sm">{opt.votes_count || 0} votes</span>
                      <span className="text-xs text-muted font-bold ml-2">({percentage}%)</span>
                    </div>
                  </div>

                  <div className="w-full h-2 bg-charcoal-800 rounded-full overflow-hidden">
                    <div style={{ width: `${percentage}%` }} className="h-full bg-acid rounded-full" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal: Create New Voting Poll */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-charcoal-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-charcoal-900 border border-white/15 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-8">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-6 right-6 text-muted hover:text-offwhite p-1 rounded-lg bg-charcoal-800"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-display font-black text-xl text-offwhite mb-1">
              CREATE NEW VOTING POLL
            </h3>
            <p className="text-xs text-muted mb-6">
              Set the poll question and trail options. Publishing will automatically show this poll on the website.
            </p>

            <form onSubmit={handleCreateRound} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">
                  Poll Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VOTE NEXT SUNDAY TRAIL"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-charcoal-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-offwhite focus:outline-none focus:border-acid"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">
                  Subtitle / Instructions
                </label>
                <input
                  type="text"
                  placeholder="Which trail should we hike next Sunday?"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-charcoal-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-offwhite focus:outline-none focus:border-acid"
                />
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-acid uppercase tracking-wider">
                    Trail Options ({options.length})
                  </label>
                  <button
                    type="button"
                    onClick={addOptionSlot}
                    className="text-xs font-bold text-acid hover:underline"
                  >
                    + Add Option
                  </button>
                </div>

                {options.map((opt, idx) => (
                  <div key={idx} className="bg-charcoal-950 p-3 rounded-xl border border-white/10 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-muted uppercase">Option #{idx + 1}</span>
                      {options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOptionSlot(idx)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="Trail Name (e.g. Nahargarh Sunrise)"
                      value={opt.title}
                      onChange={(e) => handleOptionChange(idx, 'title', e.target.value)}
                      className="w-full bg-charcoal-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-offwhite focus:outline-none focus:border-acid"
                    />
                    <input
                      type="text"
                      placeholder="Short description (e.g. Ridge walk & hot chai)"
                      value={opt.subtitle}
                      onChange={(e) => handleOptionChange(idx, 'subtitle', e.target.value)}
                      className="w-full bg-charcoal-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-offwhite focus:outline-none focus:border-acid"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="acid" size="sm">
                  Publish Poll & Turn ON
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

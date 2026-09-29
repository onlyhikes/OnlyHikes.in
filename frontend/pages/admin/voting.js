import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Vote, Plus, Play, Square, Trash2, CheckCircle2, TrendingUp, X } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { getActiveVotingRound } from '../../lib/api';

export default function AdminVotingPage() {
  const [round, setRound] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [options, setOptions] = useState([
    { title: 'Sambhar Salt Lake Camp', subtitle: 'Stargazing in salt flats', difficulty: 'Moderate' },
    { title: 'Amer Sagar Stepwell Trail', subtitle: 'Ancient hidden reservoir', difficulty: 'Easy' },
    { title: 'Garh Ganesh 365 Steps', subtitle: 'Cliff rock staircase', difficulty: 'Challenging' },
  ]);

  const loadRound = async () => {
    setLoading(true);
    try {
      const res = await getActiveVotingRound();
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

  const totalVotes = round?.options?.reduce((sum, o) => sum + (o.votes_count || 0), 0) || 1;

  return (
    <AdminLayout
      title="COMMUNITY DESTINATION VOTING"
      subtitle="Manage weekend voting rounds, review student ballots, and schedule winning trails"
      action={
        <Button variant="acid" size="sm" icon={Plus} onClick={() => setShowCreateModal(true)}>
          Launch New Round
        </Button>
      }
    >
      <Head>
        <title>Manage Voting — OnlyHikes Coordinator Admin</title>
      </Head>

      {/* Active Round Summary Card */}
      {round && (
        <div className="bg-charcoal-900 border border-white/10 rounded-3xl p-6 sm:p-8 mb-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant={round.is_active ? 'success' : 'charcoal'} size="xs">
                  {round.is_active ? '● Round Active' : 'Round Concluded'}
                </Badge>
                <span className="text-xs text-muted">ID: {round.id}</span>
              </div>
              <h2 className="font-display font-black text-2xl text-offwhite">
                {round.title}
              </h2>
              <p className="text-xs text-muted mt-1">{round.description}</p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-muted font-bold block uppercase tracking-wider">Ballots Cast</span>
              <span className="font-display font-black text-3xl text-acid">{totalVotes}</span>
            </div>
          </div>

          {/* Results table */}
          <div className="mt-6 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-offwhite">
              Live Destination Standings
            </h3>

            {round.options?.map((opt, i) => {
              const percentage = Math.round((opt.votes_count / totalVotes) * 100);
              return (
                <div key={opt.id} className="bg-charcoal-850 p-4 rounded-2xl border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm text-offwhite">{opt.title}</span>
                      <span className="text-xs text-muted ml-2">({opt.difficulty})</span>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-acid text-sm">{opt.votes_count} votes</span>
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

      {/* Modal create round */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-charcoal-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-charcoal-900 border border-white/15 rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="font-display font-black text-xl text-offwhite mb-4">
              LAUNCH NEW VOTING ROUND
            </h3>
            <p className="text-xs text-muted mb-4">
              Create a weekend poll for Jaipur students to decide the next trek trail.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-muted mb-1">Round Title</label>
                <input
                  type="text"
                  placeholder="WEEKEND #43: WHERE TO NEXT?"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-charcoal-800 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-offwhite focus:outline-none focus:border-acid"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="ghost" size="sm" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button
                  variant="acid"
                  size="sm"
                  onClick={() => {
                    alert('New round configured in memory.');
                    setShowCreateModal(false);
                  }}
                >
                  Publish Round
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

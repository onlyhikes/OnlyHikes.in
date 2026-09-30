import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import {
  MessageSquare,
  Star,
  CheckCircle,
  XCircle,
  Trash2,
  AlertCircle,
  Clock,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { getAllReviewsAdmin, moderateReview, deleteReview } from '../../lib/api';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [actionFeedback, setActionFeedback] = useState(null);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const res = await getAllReviewsAdmin();
      if (res.data) setReviews(res.data);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleModerate = async (id, isApproved) => {
    try {
      const res = await moderateReview(id, isApproved);
      if (res.ok !== false) {
        setReviews(prev => prev.map(r => r.id === id ? { ...r, is_approved: isApproved } : r));
        setActionFeedback(`Review marked as ${isApproved ? 'Approved' : 'Rejected'}.`);
        setTimeout(() => setActionFeedback(null), 3000);
      }
    } catch (err) {
      console.error('Error moderating review:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review permanently?')) return;
    try {
      const res = await deleteReview(id);
      if (res.ok !== false) {
        setReviews(prev => prev.filter(r => r.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete review:', err);
    }
  };

  const filteredReviews = reviews.filter(r => {
    if (filter === 'pending') return r.is_approved === false;
    if (filter === 'approved') return r.is_approved === true;
    return true;
  });

  return (
    <AdminLayout
      title="STUDENT REVIEWS MODERATION"
      subtitle="Verify, approve, or reject genuine reviews submitted by trek participants"
    >
      <Head>
        <title>Reviews Moderation — OnlyHikes Coordinator Ops</title>
      </Head>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
        {[
          { id: 'all', label: `All (${reviews.length})` },
          { id: 'approved', label: `Approved (${reviews.filter(r => r.is_approved).length})` },
          { id: 'pending', label: `Pending (${reviews.filter(r => !r.is_approved).length})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              filter === tab.id
                ? 'bg-acid text-charcoal-950 shadow-acid-sm'
                : 'bg-charcoal-900 text-muted hover:text-offwhite hover:bg-charcoal-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {actionFeedback && (
        <div className="p-3 bg-acid/10 border border-acid/30 rounded-xl text-xs font-bold text-acid flex items-center gap-2 mb-6">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-muted text-xs">Loading student reviews...</div>
      ) : filteredReviews.length === 0 ? (
        <div className="bg-charcoal-900 border border-dashed border-white/10 rounded-3xl p-12 text-center">
          <MessageSquare className="w-12 h-12 text-muted/40 mx-auto mb-3" />
          <h3 className="font-display font-black text-base text-offwhite">No Reviews in Queue</h3>
          <p className="text-muted text-xs max-w-sm mx-auto mt-1">
            Genuine student feedback submitted on the public website will appear here for coordinator moderation.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((r) => (
            <div
              key={r.id}
              className="bg-charcoal-900 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row md:items-start justify-between gap-6 hover:border-white/20 transition"
            >
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-display font-black text-base text-offwhite">
                    {r.author_name}
                  </span>
                  <span className="text-xs text-muted">
                    • {r.author_college}
                  </span>
                  <Badge variant={r.is_approved ? 'acid' : 'flame'} size="xs">
                    {r.is_approved ? 'Approved Live' : 'Pending Approval'}
                  </Badge>
                </div>

                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < (r.rating || 5) ? 'text-amber-400 fill-amber-400' : 'text-charcoal-700'
                      }`}
                    />
                  ))}
                  <span className="text-xs font-bold text-offwhite ml-1.5">{r.rating}/5</span>
                </div>

                <p className="text-offwhite/90 text-sm italic leading-relaxed mb-3">
                  "{r.comment}"
                </p>

                <div className="flex items-center gap-3 text-[11px] text-muted font-mono">
                  <span>Hike: {r.hikes?.title || 'General Expedition'}</span>
                  <span>•</span>
                  <span>{r.created_at ? new Date(r.created_at).toLocaleDateString('en-IN') : 'Recent'}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {!r.is_approved ? (
                  <Button
                    variant="acid"
                    size="sm"
                    icon={CheckCircle}
                    onClick={() => handleModerate(r.id, true)}
                  >
                    Approve
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={XCircle}
                    onClick={() => handleModerate(r.id, false)}
                  >
                    Unapprove
                  </Button>
                )}
                <button
                  onClick={() => handleDelete(r.id)}
                  className="p-2 text-muted hover:text-red-400 hover:bg-charcoal-800 rounded-lg transition"
                  title="Delete Review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

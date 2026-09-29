import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import {
  Mountain,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  X,
  ExternalLink
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import PosterUploader from '../../components/admin/PosterUploader';
import { getHikes, createHike, updateHike, deleteHike } from '../../lib/api';

export default function AdminHikesPage() {
  const [hikes, setHikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingHike, setEditingHike] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formFeedback, setFormFeedback] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    subtitle: '',
    poster_url: '',
    date: '',
    time: 'Sunday · 5:30 AM',
    price: 299,
    total_seats: 25,
    difficulty: 'Moderate',
    description: '',
    is_published: true
  });

  const loadHikes = async () => {
    setLoading(true);
    try {
      const res = await getHikes();
      if (res.data) setHikes(res.data);
    } catch (err) {
      console.error('Failed to load hikes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHikes();
  }, []);

  const handleOpenCreate = () => {
    setEditingHike(null);
    setFormData({
      title: '',
      slug: '',
      subtitle: '',
      poster_url: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1200&q=80',
      date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      time: 'Sunday · 5:30 AM',
      price: 299,
      total_seats: 25,
      difficulty: 'Moderate',
      description: 'Start your Sunday with adrenaline and panoramic Aravali views with Jaipur students.',
      is_published: true
    });
    setIsCreating(true);
    setFormFeedback(null);
  };

  const handleOpenEdit = (hike) => {
    setIsCreating(false);
    setEditingHike(hike);
    setFormData({
      title: hike.title,
      slug: hike.slug,
      subtitle: hike.subtitle || '',
      poster_url: hike.poster_url,
      date: hike.date,
      time: hike.time,
      price: hike.price,
      total_seats: hike.total_seats,
      difficulty: hike.difficulty,
      description: hike.description,
      is_published: hike.is_published
    });
    setFormFeedback(null);
  };

  const handleTogglePublish = async (hike) => {
    try {
      const updated = await updateHike(hike.id, { is_published: !hike.is_published });
      if (updated.success) {
        setHikes(hikes.map(h => h.id === hike.id ? { ...h, is_published: !h.is_published } : h));
      }
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this trek? This cannot be undone.')) return;
    try {
      const res = await deleteHike(id);
      if (res.success) {
        setHikes(hikes.filter(h => h.id !== id));
      }
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setFormFeedback(null);

    try {
      if (isCreating) {
        const res = await createHike(formData);
        if (res.success) {
          setFormFeedback({ type: 'success', text: 'New hike created successfully!' });
          setIsCreating(false);
          loadHikes();
        } else {
          setFormFeedback({ type: 'error', text: res.message || 'Creation failed' });
        }
      } else if (editingHike) {
        const res = await updateHike(editingHike.id, formData);
        if (res.success) {
          setFormFeedback({ type: 'success', text: 'Hike and poster updated successfully!' });
          setEditingHike(null);
          loadHikes();
        } else {
          setFormFeedback({ type: 'error', text: res.message || 'Update failed' });
        }
      }
    } catch (err) {
      setFormFeedback({ type: 'error', text: err.message });
    }
  };

  return (
    <AdminLayout
      title="HIKES & POSTER MANAGEMENT"
      subtitle="Publish new trails, update capacities, and manage posters stored in Supabase Storage"
      action={
        <Button variant="acid" size="sm" icon={Plus} onClick={handleOpenCreate}>
          Add New Hike
        </Button>
      }
    >
      <Head>
        <title>Manage Hikes — OnlyHikes Coordinator Admin</title>
      </Head>

      {/* Editor Modal / Drawer */}
      {(isCreating || editingHike) && (
        <div className="fixed inset-0 z-50 bg-charcoal-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-charcoal-900 border border-white/15 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
              <h3 className="font-display font-black text-xl text-offwhite">
                {isCreating ? 'CREATE NEW EXPEDITION' : `EDIT: ${editingHike.title}`}
              </h3>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditingHike(null);
                }}
                className="p-1 rounded-lg text-muted hover:text-offwhite hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formFeedback && (
              <div
                className={`p-3 rounded-xl mb-4 text-xs font-bold ${
                  formFeedback.type === 'success'
                    ? 'bg-acid/20 text-acid border border-acid/40'
                    : 'bg-flame/20 text-flame border border-flame/40'
                }`}
              >
                {formFeedback.text}
              </div>
            )}

            <form onSubmit={handleSubmitForm} className="space-y-4">
              {/* Dynamic Poster Uploader Section */}
              <PosterUploader
                currentPosterUrl={formData.poster_url}
                onPosterUploaded={(url) => setFormData({ ...formData, poster_url: url })}
              />

              <div>
                <label className="block text-xs font-bold text-muted mb-1">Trek Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NAHARGARH SUNRISE HIKE"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-charcoal-800 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-offwhite focus:outline-none focus:border-acid"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted mb-1">Subtitle / Quick Hook</label>
                <input
                  type="text"
                  placeholder="e.g. Catch Jaipur waking up from the Aravali ridges..."
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full bg-charcoal-800 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-offwhite focus:outline-none focus:border-acid"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-muted mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-charcoal-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-offwhite focus:outline-none focus:border-acid"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted mb-1">Total Seats *</label>
                  <input
                    type="number"
                    required
                    value={formData.total_seats}
                    onChange={(e) => setFormData({ ...formData, total_seats: Number(e.target.value) })}
                    className="w-full bg-charcoal-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-offwhite focus:outline-none focus:border-acid"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted mb-1">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full bg-charcoal-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-offwhite focus:outline-none focus:border-acid"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Challenging">Challenging</option>
                    <option value="Strenuous">Strenuous</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-charcoal-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-offwhite focus:outline-none focus:border-acid"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted mb-1">Timing String</label>
                <input
                  type="text"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  placeholder="Sunday · 5:30 AM"
                  className="w-full bg-charcoal-800 border border-white/10 rounded-xl px-4 py-2 text-xs text-offwhite focus:outline-none focus:border-acid"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted mb-1">Description</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-charcoal-800 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-offwhite focus:outline-none focus:border-acid"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="pubCheck"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  className="accent-acid"
                />
                <label htmlFor="pubCheck" className="text-xs font-bold text-offwhite cursor-pointer">
                  Publish on Website Homepage & Directory
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingHike(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="acid" size="md" className="uppercase font-black">
                  {isCreating ? 'Publish Hike' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hikes Table */}
      <div className="bg-charcoal-900 border border-white/10 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-charcoal-850 border-b border-white/10 text-muted uppercase tracking-wider font-bold">
              <tr>
                <th className="py-4 px-6">Poster & Trail</th>
                <th className="py-4 px-4">Date & Time</th>
                <th className="py-4 px-4">Price</th>
                <th className="py-4 px-4">Occupancy</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {hikes.map((hike) => (
                <tr key={hike.id} className="hover:bg-charcoal-850/50 transition">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={hike.poster_url}
                        alt={hike.title}
                        className="w-14 h-10 rounded-lg object-cover border border-white/10 shrink-0"
                      />
                      <div>
                        <span className="font-display font-black text-sm text-offwhite block">
                          {hike.title}
                        </span>
                        <span className="text-[11px] text-muted">{hike.difficulty}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-offwhite font-bold block">{hike.time}</span>
                    <span className="text-[11px] text-muted">{hike.date}</span>
                  </td>
                  <td className="py-4 px-4 font-black text-acid text-sm">
                    ₹{hike.price}
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-bold text-offwhite">{hike.booked_seats || 0} / {hike.total_seats}</span>
                    <span className="text-[10px] text-muted block">
                      {hike.total_seats - (hike.booked_seats || 0)} spots left
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant={hike.is_published ? 'success' : 'charcoal'} size="xs">
                      {hike.is_published ? 'Published' : 'Draft'}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => handleTogglePublish(hike)}
                      title={hike.is_published ? 'Unpublish' : 'Publish'}
                      className="p-2 rounded-lg bg-charcoal-800 hover:bg-charcoal-700 text-muted hover:text-offwhite transition"
                    >
                      {hike.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleOpenEdit(hike)}
                      title="Edit Hike & Poster"
                      className="p-2 rounded-lg bg-charcoal-800 hover:bg-acid hover:text-charcoal-950 text-muted transition"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(hike.id)}
                      title="Delete Hike"
                      className="p-2 rounded-lg bg-charcoal-800 hover:bg-flame hover:text-white text-muted transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

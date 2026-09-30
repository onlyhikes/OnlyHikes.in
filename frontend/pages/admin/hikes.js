import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import {
  Mountain,
  Plus,
  Edit2,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  X,
  ExternalLink,
  Palette,
  Film
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import PosterUploader from '../../components/admin/PosterUploader';
import { getHikes, createHike, updateHike, deleteHike, duplicateHike } from '../../lib/api';

const PRESET_COLORS = [
  { name: 'Acid Green', hex: '#CCFF00' },
  { name: 'Flame Orange', hex: '#FF5500' },
  { name: 'Cyber Cyan', hex: '#00F0FF' },
  { name: 'Neon Purple', hex: '#A855F7' },
  { name: 'Emerald', hex: '#10B981' },
];

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
    tag: 'Sunrise Expedition',
    poster_url: '',
    date: '',
    time: 'Sunday · 5:30 AM',
    duration: '4-5 Hours',
    meeting_point: 'Mansarovar Metro Station',
    return_time: '11:00 AM',
    selling_price: 299,
    original_price: 499,
    slots_total: 25,
    theme_accent: '#CCFF00',
    video_url: '',
    inclusions: 'Coordinated AC transit pickup\nSafety marshals & first-aid\nEnergy bars & hydration\nCurated group photo package',
    exclusions: 'Personal trekking gear\nIndividual transport outside routes',
    food_water_info: 'Energy refreshments provided at midpoint. Carry 1L personal water.',
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
      tag: 'Sunrise Expedition',
      poster_url: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1200&q=80',
      date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      time: 'Sunday · 5:30 AM',
      duration: '4-5 Hours',
      meeting_point: 'Mansarovar Metro Station',
      return_time: '11:00 AM',
      selling_price: 299,
      original_price: 499,
      slots_total: 25,
      theme_accent: '#CCFF00',
      video_url: '',
      inclusions: 'Coordinated AC transit pickup\nSafety marshals & first-aid\nEnergy bars & hydration\nCurated group photo package',
      exclusions: 'Personal trekking gear\nIndividual transport outside routes',
      food_water_info: 'Energy refreshments provided at midpoint. Carry 1L personal water.',
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
      title: hike.title || '',
      slug: hike.slug || '',
      tag: hike.tag || 'Weekend Hike',
      poster_url: hike.poster_url || '',
      date: hike.date || '',
      time: hike.time || 'Sunday · 5:30 AM',
      duration: hike.duration || '4-5 Hours',
      meeting_point: hike.meeting_point || '',
      return_time: hike.return_time || '',
      selling_price: hike.selling_price || hike.price || 299,
      original_price: hike.original_price || (hike.price ? hike.price + 200 : 499),
      slots_total: hike.slots_total || hike.total_seats || 25,
      theme_accent: hike.theme_accent || '#CCFF00',
      video_url: hike.video_url || '',
      inclusions: Array.isArray(hike.inclusions) ? hike.inclusions.join('\n') : (hike.inclusions || ''),
      exclusions: Array.isArray(hike.exclusions) ? hike.exclusions.join('\n') : (hike.exclusions || ''),
      food_water_info: hike.food_water_info || '',
      description: hike.description || '',
      is_published: hike.is_published !== false
    });
    setFormFeedback(null);
  };

  const handleDuplicate = async (id) => {
    try {
      const res = await duplicateHike(id);
      if (res.success) {
        await loadHikes();
      } else {
        alert(res.message || 'Failed to duplicate hike.');
      }
    } catch (err) {
      alert('Error duplicating hike: ' + err.message);
    }
  };

  const handleTogglePublish = async (hike) => {
    try {
      const nextStatus = !hike.is_published;
      const res = await updateHike(hike.id, { is_published: nextStatus });
      if (res.ok !== false) {
        setHikes(prev => prev.map(h => h.id === hike.id ? { ...h, is_published: nextStatus } : h));
      }
    } catch (err) {
      console.error('Error toggling publish status:', err);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }
    try {
      const res = await deleteHike(id);
      if (res.ok !== false) {
        setHikes(prev => prev.filter(h => h.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete hike:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormFeedback(null);

    const payload = {
      ...formData,
      slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      selling_price: Number(formData.selling_price),
      original_price: Number(formData.original_price),
      price: Number(formData.selling_price), // backward compat
      slots_total: Number(formData.slots_total),
      total_seats: Number(formData.slots_total), // backward compat
      inclusions: formData.inclusions.split('\n').map(s => s.trim()).filter(Boolean),
      exclusions: formData.exclusions.split('\n').map(s => s.trim()).filter(Boolean)
    };

    try {
      if (isCreating) {
        const res = await createHike(payload);
        if (res.data) {
          setFormFeedback({ type: 'success', message: 'Hike created successfully!' });
          setIsCreating(false);
          loadHikes();
        } else {
          setFormFeedback({ type: 'error', message: res.message || 'Failed to create hike.' });
        }
      } else if (editingHike) {
        const res = await updateHike(editingHike.id, payload);
        if (res.data || res.ok) {
          setFormFeedback({ type: 'success', message: 'Hike updated successfully!' });
          setEditingHike(null);
          loadHikes();
        } else {
          setFormFeedback({ type: 'error', message: res.message || 'Failed to update hike.' });
        }
      }
    } catch (err) {
      setFormFeedback({ type: 'error', message: err.message || 'Operation failed.' });
    }
  };

  return (
    <AdminLayout
      title="EXPEDITIONS & POSTERS CMS"
      subtitle="Create hikes, configure pricing, upload media, and manage live availability"
      action={
        <Button variant="acid" size="sm" icon={Plus} onClick={handleOpenCreate}>
          Create New Hike
        </Button>
      }
    >
      <Head>
        <title>Hikes CMS — OnlyHikes Coordinator Ops</title>
      </Head>

      {/* List Table / Cards */}
      <div className="bg-charcoal-900 border border-white/10 rounded-3xl p-6 mb-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display font-black text-lg text-offwhite">
              Scheduled Expeditions ({hikes.length})
            </h2>
            <p className="text-muted text-xs mt-0.5">
              Dual pricing (Original ~~₹499~~ & Selling ₹299), custom theme accents, and real bookings
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-muted text-xs">Loading hikes...</div>
        ) : hikes.length === 0 ? (
          <div className="py-12 text-center text-muted text-xs">No hikes found. Create your first expedition above.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-charcoal-950/60 text-muted uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-4 py-3 rounded-l-xl">Hike</th>
                  <th className="px-4 py-3">Schedule</th>
                  <th className="px-4 py-3">Pricing</th>
                  <th className="px-4 py-3">Seats</th>
                  <th className="px-4 py-3">Theme</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 rounded-r-xl text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {hikes.map((hike) => {
                  const selling = hike.selling_price || hike.price || 0;
                  const original = hike.original_price || (selling + 200);
                  const booked = hike.booked_seats || 0;
                  const total = hike.slots_total || hike.total_seats || 25;
                  const accent = hike.theme_accent || '#CCFF00';

                  return (
                    <tr key={hike.id} className="hover:bg-charcoal-800/40">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={hike.poster_url || 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a'}
                            alt={hike.title}
                            className="w-12 h-14 object-cover rounded-lg border border-white/10 shrink-0"
                          />
                          <div>
                            <span className="font-display font-black text-sm text-offwhite block">
                              {hike.title}
                            </span>
                            <span className="text-[10px] text-muted font-mono">{hike.slug}</span>
                            {hike.tag && (
                              <span className="inline-block mt-0.5 text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-white/5 text-muted">
                                {hike.tag}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-offwhite">
                        <span className="font-bold block">{hike.date}</span>
                        <span className="text-muted text-[11px]">{hike.time}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-display font-black text-sm text-acid">
                            ₹{selling}
                          </span>
                          {original > selling && (
                            <span className="text-muted line-through text-[11px]">
                              ₹{original}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-bold text-offwhite">{booked}</span>
                        <span className="text-muted"> / {total}</span>
                        <div className="w-16 bg-charcoal-800 h-1.5 rounded-full mt-1 overflow-hidden">
                          <div
                            className="bg-acid h-full"
                            style={{ width: `${Math.min(100, Math.round((booked / total) * 100))}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-white/20"
                            style={{ backgroundColor: accent }}
                          />
                          <span className="text-muted font-mono text-[10px]">{accent}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => handleTogglePublish(hike)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase transition ${
                            hike.is_published
                              ? 'bg-acid/15 text-acid border border-acid/30 hover:bg-acid/25'
                              : 'bg-white/5 text-muted border border-white/10 hover:bg-white/10'
                          }`}
                        >
                          {hike.is_published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          {hike.is_published ? 'Live' : 'Draft'}
                        </button>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleDuplicate(hike.id)}
                            title="Duplicate Hike"
                            className="p-1.5 text-muted hover:text-offwhite hover:bg-charcoal-800 rounded-lg transition"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(hike)}
                            title="Edit Hike"
                            className="p-1.5 text-muted hover:text-acid hover:bg-charcoal-800 rounded-lg transition"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(hike.id, hike.title)}
                            title="Delete Hike"
                            className="p-1.5 text-muted hover:text-red-400 hover:bg-charcoal-800 rounded-lg transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Hike Form Modal (Create or Edit) */}
      {(isCreating || editingHike) && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-charcoal-900 border border-white/10 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 md:p-8 relative">
            <button
              onClick={() => { setIsCreating(false); setEditingHike(null); }}
              className="absolute top-6 right-6 text-muted hover:text-offwhite p-1 rounded-lg bg-charcoal-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-acid text-[10px] font-black uppercase tracking-widest block">
                {isCreating ? 'New Expedition Builder' : 'Modify Expedition'}
              </span>
              <h2 className="font-display font-black text-2xl text-offwhite mt-1">
                {isCreating ? 'Schedule New Trek' : `Edit: ${editingHike?.title}`}
              </h2>
            </div>

            {formFeedback && (
              <div className={`p-4 rounded-xl mb-6 flex items-center gap-2 text-xs font-bold ${
                formFeedback.type === 'success' ? 'bg-acid/10 border border-acid/30 text-acid' : 'bg-red-950/60 border border-red-500/30 text-red-300'
              }`}>
                {formFeedback.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>{formFeedback.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Row 1: Title, Slug, Tag */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
                    Trek Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="e.g. NAHARGARH SUNRISE EXPEDITION"
                    className="w-full bg-charcoal-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-offwhite focus:border-acid outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
                    Tag / Badge
                  </label>
                  <input
                    type="text"
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    placeholder="e.g. Sunrise Expedition"
                    className="w-full bg-charcoal-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-offwhite focus:border-acid outline-none transition"
                  />
                </div>
              </div>

              {/* Row 2: Date, Time, Duration */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
                    Trek Date *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    className="w-full bg-charcoal-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-offwhite focus:border-acid outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
                    Start Time *
                  </label>
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    required
                    placeholder="e.g. Sunday · 5:30 AM"
                    className="w-full bg-charcoal-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-offwhite focus:border-acid outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g. 4-5 Hours"
                    className="w-full bg-charcoal-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-offwhite focus:border-acid outline-none transition"
                  />
                </div>
              </div>

              {/* Row 3: Dual Pricing & Slots */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-charcoal-950/60 p-4 rounded-2xl border border-white/5">
                <div>
                  <label className="block text-xs font-bold text-acid uppercase tracking-wider mb-2">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    value={formData.selling_price}
                    onChange={(e) => setFormData({ ...formData, selling_price: e.target.value })}
                    required
                    min="0"
                    placeholder="299"
                    className="w-full bg-charcoal-900 border border-acid/40 rounded-xl px-4 py-3 text-sm font-bold text-acid focus:border-acid outline-none transition"
                  />
                  <span className="text-[10px] text-muted mt-1 block">What the student actually pays</span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.original_price}
                    onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                    min="0"
                    placeholder="499"
                    className="w-full bg-charcoal-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-offwhite focus:border-acid outline-none transition"
                  />
                  <span className="text-[10px] text-muted mt-1 block">Shown crossed out (e.g. ~~₹499~~)</span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
                    Total Seats *
                  </label>
                  <input
                    type="number"
                    value={formData.slots_total}
                    onChange={(e) => setFormData({ ...formData, slots_total: e.target.value })}
                    required
                    min="1"
                    placeholder="25"
                    className="w-full bg-charcoal-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-offwhite focus:border-acid outline-none transition"
                  />
                  <span className="text-[10px] text-muted mt-1 block">Max capacity for this expedition</span>
                </div>
              </div>

              {/* Row 4: Theme Accent Color */}
              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-acid" />
                  Theme Accent Color
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  {PRESET_COLORS.map(c => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setFormData({ ...formData, theme_accent: c.hex })}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition ${
                        formData.theme_accent.toLowerCase() === c.hex.toLowerCase()
                          ? 'border-white bg-white/10 text-offwhite shadow-sm'
                          : 'border-white/10 text-muted hover:border-white/30'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: c.hex }} />
                      <span>{c.name}</span>
                    </button>
                  ))}
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.theme_accent}
                      onChange={(e) => setFormData({ ...formData, theme_accent: e.target.value })}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={formData.theme_accent}
                      onChange={(e) => setFormData({ ...formData, theme_accent: e.target.value })}
                      className="w-24 bg-charcoal-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-mono text-offwhite uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Row 5: Poster Upload & Preview */}
              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
                  Poster Image *
                </label>
                <PosterUploader
                  currentPosterUrl={formData.poster_url}
                  onPosterUploaded={(url) => setFormData({ ...formData, poster_url: url })}
                />
                <input
                  type="text"
                  value={formData.poster_url}
                  onChange={(e) => setFormData({ ...formData, poster_url: e.target.value })}
                  placeholder="Or paste direct image URL (https://...)"
                  className="w-full mt-2 bg-charcoal-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-offwhite focus:border-acid outline-none transition"
                />
              </div>

              {/* Row 6: Video / Reel URL */}
              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-flame" />
                  Video / Reel Teaser URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  placeholder="https://... MP4, YouTube, or Instagram Reel"
                  className="w-full bg-charcoal-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-offwhite focus:border-acid outline-none transition"
                />
              </div>

              {/* Row 7: Meeting Point & Return Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
                    Primary Meeting Point
                  </label>
                  <input
                    type="text"
                    value={formData.meeting_point}
                    onChange={(e) => setFormData({ ...formData, meeting_point: e.target.value })}
                    placeholder="e.g. Mansarovar Metro Station Pillar 12"
                    className="w-full bg-charcoal-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-offwhite focus:border-acid outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
                    Estimated Return Time
                  </label>
                  <input
                    type="text"
                    value={formData.return_time}
                    onChange={(e) => setFormData({ ...formData, return_time: e.target.value })}
                    placeholder="e.g. 11:00 AM"
                    className="w-full bg-charcoal-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-offwhite focus:border-acid outline-none transition"
                  />
                </div>
              </div>

              {/* Row 8: Inclusions & Food/Water Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
                    Inclusions (one per line)
                  </label>
                  <textarea
                    rows={4}
                    value={formData.inclusions}
                    onChange={(e) => setFormData({ ...formData, inclusions: e.target.value })}
                    placeholder="AC Bus Transfer&#10;Lead Trekker Guide&#10;Hydration pack"
                    className="w-full bg-charcoal-950 border border-white/10 rounded-xl p-3 text-xs text-offwhite focus:border-acid outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
                    Food & Hydration Instructions
                  </label>
                  <textarea
                    rows={4}
                    value={formData.food_water_info}
                    onChange={(e) => setFormData({ ...formData, food_water_info: e.target.value })}
                    placeholder="Energy refreshments provided. Carry 1L refillable bottle."
                    className="w-full bg-charcoal-950 border border-white/10 rounded-xl p-3 text-xs text-offwhite focus:border-acid outline-none transition"
                  />
                </div>
              </div>

              {/* Row 9: Description */}
              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
                  Expedition Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed breakdown of the trail, vibe, and summit experience..."
                  className="w-full bg-charcoal-950 border border-white/10 rounded-xl p-3 text-sm text-offwhite focus:border-acid outline-none transition"
                />
              </div>

              {/* Published Toggle */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="hike_published"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  className="w-4 h-4 rounded text-acid focus:ring-0 bg-charcoal-950 border-white/20"
                />
                <label htmlFor="hike_published" className="text-xs font-bold text-offwhite cursor-pointer">
                  Publish expedition immediately to public website
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  onClick={() => { setIsCreating(false); setEditingHike(null); }}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="acid" size="md">
                  {isCreating ? 'Publish Hike' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

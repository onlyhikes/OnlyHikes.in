import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Mountain,
  Bus,
  Flag,
  Coffee,
  Star,
  CheckCircle,
  AlertCircle,
  X,
  ArrowRight
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { getHikes, getAllHikeWaypoints, createWaypoint, updateWaypoint, deleteWaypoint } from '../../lib/api';

const ICONS = [
  { id: 'bus', label: 'Bus / Pickup', icon: Bus },
  { id: 'mountain', label: 'Mountain / Trail', icon: Mountain },
  { id: 'flag', label: 'Summit / Flag', icon: Flag },
  { id: 'coffee', label: 'Food / Chai', icon: Coffee },
  { id: 'pin', label: 'Checkpoint', icon: MapPin },
  { id: 'star', label: 'Viewpoint', icon: Star },
];

export default function AdminRoutesPage() {
  const [hikes, setHikes] = useState([]);
  const [selectedHikeId, setSelectedHikeId] = useState('');
  const [waypoints, setWaypoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWaypoint, setEditingWaypoint] = useState(null);
  const [formFeedback, setFormFeedback] = useState(null);

  const [formData, setFormData] = useState({
    step_number: 1,
    title: '',
    subtitle: '',
    icon: 'mountain',
    distance_marker: '',
    elevation_gain: '',
    sort_order: 1,
    is_published: true
  });

  useEffect(() => {
    async function loadInitialHikes() {
      setLoading(true);
      try {
        const res = await getHikes();
        if (res.data && res.data.length > 0) {
          setHikes(res.data);
          setSelectedHikeId(res.data[0].id);
        }
      } catch (err) {
        console.error('Failed to load hikes:', err);
      } finally {
        setLoading(false);
      }
    }
    loadInitialHikes();
  }, []);

  const loadWaypoints = async (hikeId) => {
    if (!hikeId) return;
    try {
      const res = await getAllHikeWaypoints(hikeId);
      if (res.data) setWaypoints(res.data);
    } catch (err) {
      console.error('Failed to load waypoints:', err);
    }
  };

  useEffect(() => {
    if (selectedHikeId) {
      loadWaypoints(selectedHikeId);
    }
  }, [selectedHikeId]);

  const handleOpenCreate = () => {
    setEditingWaypoint(null);
    const nextStep = waypoints.length + 1;
    setFormData({
      step_number: nextStep,
      title: '',
      subtitle: '',
      icon: 'mountain',
      distance_marker: '',
      elevation_gain: '',
      sort_order: nextStep,
      is_published: true
    });
    setFormFeedback(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (wp) => {
    setEditingWaypoint(wp);
    setFormData({
      step_number: wp.step_number || 1,
      title: wp.title || '',
      subtitle: wp.subtitle || '',
      icon: wp.icon || 'mountain',
      distance_marker: wp.distance_marker || '',
      elevation_gain: wp.elevation_gain || '',
      sort_order: wp.sort_order || 1,
      is_published: wp.is_published !== false
    });
    setFormFeedback(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this waypoint from the hike route?')) return;
    try {
      const res = await deleteWaypoint(id);
      if (res.ok !== false) {
        setWaypoints(prev => prev.filter(w => w.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete waypoint:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormFeedback(null);

    const payload = {
      ...formData,
      step_number: Number(formData.step_number),
      sort_order: Number(formData.sort_order)
    };

    try {
      if (editingWaypoint) {
        const res = await updateWaypoint(editingWaypoint.id, payload);
        if (res.data || res.ok) {
          setIsModalOpen(false);
          loadWaypoints(selectedHikeId);
        } else {
          setFormFeedback({ type: 'error', message: res.message || 'Failed to update waypoint.' });
        }
      } else {
        const res = await createWaypoint(selectedHikeId, payload);
        if (res.data || res.ok) {
          setIsModalOpen(false);
          loadWaypoints(selectedHikeId);
        } else {
          setFormFeedback({ type: 'error', message: res.message || 'Failed to create waypoint.' });
        }
      }
    } catch (err) {
      setFormFeedback({ type: 'error', message: err.message || 'Operation failed.' });
    }
  };

  const selectedHike = hikes.find(h => h.id === selectedHikeId);

  return (
    <AdminLayout
      title="GRAPHICAL ROUTE CMS"
      subtitle="Define animated step-by-step trail waypoints, elevation markers, and summit stops"
      action={
        <Button variant="acid" size="sm" icon={Plus} onClick={handleOpenCreate} disabled={!selectedHikeId}>
          Add Waypoint
        </Button>
      }
    >
      <Head>
        <title>Route Waypoints CMS — OnlyHikes Coordinator Ops</title>
      </Head>

      {/* Select Hike Dropdown */}
      <div className="bg-charcoal-900 border border-white/10 rounded-2xl p-5 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <label className="block text-[11px] font-black uppercase tracking-wider text-muted mb-1.5">
            Select Expedition To Map
          </label>
          <select
            value={selectedHikeId}
            onChange={(e) => setSelectedHikeId(e.target.value)}
            className="bg-charcoal-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-bold text-offwhite focus:border-acid outline-none min-w-[280px]"
          >
            {hikes.map(h => (
              <option key={h.id} value={h.id}>
                {h.title} ({h.date})
              </option>
            ))}
          </select>
        </div>

        {selectedHike && (
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted">
              Theme Accent:
            </span>
            <span
              className="w-4 h-4 rounded-full border border-white/20"
              style={{ backgroundColor: selectedHike.theme_accent || '#CCFF00' }}
            />
            <Badge variant="acid" size="xs">
              {waypoints.length} Route Steps
            </Badge>
          </div>
        )}
      </div>

      {/* Waypoint Sequence Cards */}
      <div className="space-y-4 mb-10">
        {waypoints.length === 0 ? (
          <div className="bg-charcoal-900 border border-dashed border-white/10 rounded-3xl p-12 text-center">
            <MapPin className="w-12 h-12 text-muted/40 mx-auto mb-3" />
            <h3 className="font-display font-black text-base text-offwhite">No Waypoints Defined Yet</h3>
            <p className="text-muted text-xs mt-1">
              Add your first journey milestone (e.g. AC Metro Pickup, Trailhead Base, Ridge Viewpoint, Summit Fort, Breakfast Stop).
            </p>
          </div>
        ) : (
          waypoints.map((wp, idx) => {
            const IconObj = ICONS.find(i => i.id === wp.icon) || ICONS[1];
            const IconComponent = IconObj.icon;

            return (
              <div
                key={wp.id}
                className="bg-charcoal-900 border border-white/10 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-white/20 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-acid/10 border border-acid/30 text-acid font-black font-display flex items-center justify-center shrink-0">
                    #{wp.step_number || (idx + 1)}
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-charcoal-800 text-offwhite flex items-center justify-center shrink-0">
                    <IconComponent className="w-5 h-5 text-acid" />
                  </div>

                  <div>
                    <h4 className="font-display font-black text-base text-offwhite">
                      {wp.title}
                    </h4>
                    {wp.subtitle && (
                      <p className="text-muted text-xs mt-0.5">
                        {wp.subtitle}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-1.5">
                      {wp.distance_marker && (
                        <span className="text-[10px] font-mono text-acid bg-acid/10 px-2 py-0.5 rounded border border-acid/20">
                          {wp.distance_marker}
                        </span>
                      )}
                      {wp.elevation_gain && (
                        <span className="text-[10px] font-mono text-flame bg-flame/10 px-2 py-0.5 rounded border border-flame/20">
                          {wp.elevation_gain}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    onClick={() => handleOpenEdit(wp)}
                    className="p-2 text-muted hover:text-acid hover:bg-charcoal-800 rounded-lg transition"
                    title="Edit Step"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(wp.id)}
                    className="p-2 text-muted hover:text-red-400 hover:bg-charcoal-800 rounded-lg transition"
                    title="Delete Step"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Add or Edit Waypoint */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-charcoal-900 border border-white/10 rounded-3xl w-full max-w-lg p-6 md:p-8 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-muted hover:text-offwhite p-1 rounded-lg bg-charcoal-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-acid text-[10px] font-black uppercase tracking-widest block">Route Architect</span>
            <h2 className="font-display font-black text-2xl text-offwhite mt-1 mb-6">
              {editingWaypoint ? 'Edit Waypoint' : 'Add Route Waypoint'}
            </h2>

            {formFeedback && (
              <div className="p-3 bg-red-950/60 border border-red-500/30 rounded-xl text-xs font-bold text-red-300 flex items-center gap-2 mb-4">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formFeedback.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
                    Step Number *
                  </label>
                  <input
                    type="number"
                    value={formData.step_number}
                    onChange={(e) => setFormData({ ...formData, step_number: e.target.value })}
                    required
                    min="1"
                    className="w-full bg-charcoal-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-offwhite focus:border-acid outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
                    Icon Marker
                  </label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full bg-charcoal-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-offwhite focus:border-acid outline-none transition"
                  >
                    {ICONS.map(i => (
                      <option key={i.id} value={i.id}>{i.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
                  Waypoint Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="e.g. Charan Mandir Ridge"
                  className="w-full bg-charcoal-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-offwhite focus:border-acid outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
                  Description / Subtitle
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g. Steep switchbacks with 360° city view"
                  className="w-full bg-charcoal-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-offwhite focus:border-acid outline-none transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
                    Distance (e.g. 1.8 km)
                  </label>
                  <input
                    type="text"
                    value={formData.distance_marker}
                    onChange={(e) => setFormData({ ...formData, distance_marker: e.target.value })}
                    placeholder="1.8 km"
                    className="w-full bg-charcoal-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-offwhite focus:border-acid outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
                    Elevation (e.g. +220m)
                  </label>
                  <input
                    type="text"
                    value={formData.elevation_gain}
                    onChange={(e) => setFormData({ ...formData, elevation_gain: e.target.value })}
                    placeholder="+220m"
                    className="w-full bg-charcoal-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-offwhite focus:border-acid outline-none transition"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <Button type="button" variant="ghost" size="md" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="acid" size="md">
                  {editingWaypoint ? 'Update Step' : 'Add Step'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Bus, Plus, Users, MapPin, Clock, Edit2, CheckCircle, AlertTriangle } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { getPickupManifest, createPickup } from '../../lib/api';

export default function AdminPickupsPage() {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState({
    title: '',
    landmark: '',
    pickup_time: '04:45 AM',
    capacity: 25,
    map_url: ''
  });

  const loadManifest = async () => {
    setLoading(true);
    try {
      const res = await getPickupManifest();
      if (res.data) setPickups(res.data);
    } catch (err) {
      console.error('Pickup manifest error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadManifest();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await createPickup(form);
      if (res.success) {
        setShowCreateModal(false);
        setForm({ title: '', landmark: '', pickup_time: '04:45 AM', capacity: 25, map_url: '' });
        loadManifest();
      }
    } catch (err) {
      alert('Error creating pickup: ' + err.message);
    }
  };

  return (
    <AdminLayout
      title="BUS PICKUP MANAGEMENT"
      subtitle="Configure designated Jaipur pickup spots, passenger capacities, and live boarding headcounts"
      action={
        <Button variant="acid" size="sm" icon={Plus} onClick={() => setShowCreateModal(true)}>
          Add Pickup Spot
        </Button>
      }
    >
      <Head>
        <title>Pickup Management — OnlyHikes Coordinator Admin</title>
      </Head>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-charcoal-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-charcoal-900 border border-white/15 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="font-display font-black text-xl text-offwhite mb-4">
              ADD NEW PICKUP SPOT
            </h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-muted mb-1">Spot Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. WTP / Gaurav Tower"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-charcoal-800 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-offwhite focus:outline-none focus:border-acid"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted mb-1">Landmark Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Opposite World Trade Park Main Gate, JLN Marg"
                  value={form.landmark}
                  onChange={(e) => setForm({ ...form, landmark: e.target.value })}
                  className="w-full bg-charcoal-800 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-offwhite focus:outline-none focus:border-acid"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-muted mb-1">Pickup Time *</label>
                  <input
                    type="text"
                    required
                    placeholder="04:45 AM"
                    value={form.pickup_time}
                    onChange={(e) => setForm({ ...form, pickup_time: e.target.value })}
                    className="w-full bg-charcoal-800 border border-white/10 rounded-xl px-4 py-2 text-xs text-offwhite focus:outline-none focus:border-acid"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted mb-1">Bus Seat Cap</label>
                  <input
                    type="number"
                    value={form.capacity}
                    onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
                    className="w-full bg-charcoal-800 border border-white/10 rounded-xl px-4 py-2 text-xs text-offwhite focus:outline-none focus:border-acid"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="acid" size="sm">
                  Save Pickup
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pickup Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pickups.map((p) => {
          const studentCount = p.assignedStudentsCount || 0;
          const capacity = p.capacity || 25;
          const percent = Math.min(100, Math.round((studentCount / capacity) * 100));

          return (
            <div
              key={p.id}
              className="bg-charcoal-900 border border-white/10 rounded-3xl p-6 flex flex-col justify-between hover:border-acid/40 transition shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="acid" size="xs">
                    {p.pickup_time}
                  </Badge>
                  <Bus className="w-4 h-4 text-muted" />
                </div>

                <h3 className="font-display font-black text-lg text-offwhite mb-1">
                  {p.title}
                </h3>
                <p className="text-xs text-muted leading-relaxed mb-6">
                  {p.landmark}
                </p>
              </div>

              {/* Manifest Count */}
              <div className="pt-4 border-t border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-muted flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-acid" /> Boarding Count:
                  </span>
                  <span className="text-offwhite font-black">
                    {studentCount} / {capacity}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-charcoal-800 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${percent}%` }}
                    className={`h-full rounded-full ${percent >= 100 ? 'bg-flame' : 'bg-acid'}`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}

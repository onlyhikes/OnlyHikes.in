import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Tag, Plus, CheckCircle, Percent, IndianRupee, Users } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { getAllCoupons, createCoupon } from '../../lib/api';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    code: '',
    discount_type: 'fixed',
    discount_value: 50,
    min_order_amount: 299,
    max_discount_amount: 100,
    max_uses: 500
  });

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const res = await getAllCoupons();
      if (res.data) setCoupons(res.data);
    } catch (err) {
      console.error('Failed to load coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      const res = await createCoupon(form);
      if (res.success) {
        setShowModal(false);
        setForm({ code: '', discount_type: 'fixed', discount_value: 50, min_order_amount: 299, max_discount_amount: 100, max_uses: 500 });
        loadCoupons();
      }
    } catch (err) {
      alert('Error creating coupon: ' + err.message);
    }
  };

  return (
    <AdminLayout
      title="COUPONS & PROMO CODES"
      subtitle="Configure student promotional codes, minimum order values, and track redemptions"
      action={
        <Button variant="acid" size="sm" icon={Plus} onClick={() => setShowModal(true)}>
          Create Promo Code
        </Button>
      }
    >
      <Head>
        <title>Manage Coupons — OnlyHikes Coordinator Admin</title>
      </Head>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-charcoal-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-charcoal-900 border border-white/15 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="font-display font-black text-xl text-offwhite mb-4">
              CREATE PROMOTIONAL CODE
            </h3>
            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-muted mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SQUAD50"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  className="w-full bg-charcoal-800 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold text-offwhite uppercase focus:outline-none focus:border-acid"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-muted mb-1">Type</label>
                  <select
                    value={form.discount_type}
                    onChange={(e) => setForm({ ...form, discount_type: e.target.value })}
                    className="w-full bg-charcoal-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-offwhite focus:outline-none focus:border-acid"
                  >
                    <option value="fixed">Fixed (₹)</option>
                    <option value="percentage">Percentage (%)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted mb-1">Value *</label>
                  <input
                    type="number"
                    required
                    value={form.discount_value}
                    onChange={(e) => setForm({ ...form, discount_value: Number(e.target.value) })}
                    className="w-full bg-charcoal-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-offwhite focus:outline-none focus:border-acid"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-muted mb-1">Min Order (₹)</label>
                  <input
                    type="number"
                    value={form.min_order_amount}
                    onChange={(e) => setForm({ ...form, min_order_amount: Number(e.target.value) })}
                    className="w-full bg-charcoal-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-offwhite focus:outline-none focus:border-acid"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted mb-1">Max Uses</label>
                  <input
                    type="number"
                    value={form.max_uses}
                    onChange={(e) => setForm({ ...form, max_uses: Number(e.target.value) })}
                    className="w-full bg-charcoal-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-offwhite focus:outline-none focus:border-acid"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="acid" size="sm">
                  Save Coupon
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Coupons Table */}
      <div className="bg-charcoal-900 border border-white/10 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-charcoal-850 border-b border-white/10 text-muted uppercase tracking-wider font-bold">
              <tr>
                <th className="py-4 px-6">Promo Code</th>
                <th className="py-4 px-4">Discount</th>
                <th className="py-4 px-4">Min Cart</th>
                <th className="py-4 px-4">Redemptions</th>
                <th className="py-4 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {coupons.map((c) => (
                <tr key={c.id || c.code} className="hover:bg-charcoal-850/50 transition">
                  <td className="py-4 px-6 font-mono font-black text-acid text-sm">
                    {c.code}
                  </td>
                  <td className="py-4 px-4 font-bold text-offwhite">
                    {c.discount_type === 'percentage' ? `${c.discount_value}%` : `₹${c.discount_value}`}
                  </td>
                  <td className="py-4 px-4 text-muted">
                    ₹{c.min_order_amount || 0}
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-bold text-offwhite">{c.uses_count || 0}</span>
                    <span className="text-muted"> / {c.max_uses || '∞'}</span>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant={c.is_active ? 'success' : 'charcoal'} size="xs">
                      {c.is_active ? 'Active' : 'Disabled'}
                    </Badge>
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

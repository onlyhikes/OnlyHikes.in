import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import {
  Settings,
  Save,
  CheckCircle,
  AlertCircle,
  Upload,
  Globe,
  Instagram,
  MessageCircle,
  Mail,
  Phone,
  Palette,
  Image as ImageIcon
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import Button from '../../components/ui/Button';
import { getBrandSettings, updateBrandSettings } from '../../lib/api';
import { supabase } from '../../lib/supabaseClient';

export default function AdminBrandPage() {
  const [brandData, setBrandData] = useState({
    brand_name: 'OnlyHikes.in',
    tagline: 'YOUR WEEKEND JUST GOT WILDER.',
    city: 'Jaipur, Rajasthan',
    logo_url: '',
    favicon_url: '',
    primary_color: '#CCFF00',
    secondary_color: '#FF5500',
    whatsapp_community_url: 'https://whatsapp.com/channel/0029VbEaykELY6d6Jr9wht27',
    instagram_url: 'https://www.instagram.com/onlyhikes.in/',
    support_email: 'team@onlyhikes.in',
    support_phone: '+91 98765 43210'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    async function loadBrand() {
      setLoading(true);
      try {
        const res = await getBrandSettings();
        if (res.data) setBrandData(res.data);
      } catch (err) {
        console.error('Failed to load brand settings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadBrand();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const res = await updateBrandSettings(brandData);
      if (res.ok !== false) {
        setFeedback({ type: 'success', message: 'Brand & social settings saved successfully!' });
      } else {
        setFeedback({ type: 'error', message: res.message || 'Failed to update brand settings.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Error updating brand settings.' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      if (supabase) {
        const fileExt = file.name.split('.').pop();
        const fileName = `logo-${Date.now()}.${fileExt}`;
        const filePath = `brand/${fileName}`;

        const { error: uploadError } = await supabase.storage.from('brand').upload(filePath, file, { upsert: true });
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from('brand').getPublicUrl(filePath);
        setBrandData(prev => ({ ...prev, logo_url: publicUrl }));
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          setBrandData(prev => ({ ...prev, logo_url: event.target.result }));
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      alert(`Logo upload failed: ${err.message}`);
    } finally {
      setUploadingLogo(false);
    }
  };

  return (
    <AdminLayout
      title="BRAND & SOCIAL CONFIGURATION"
      subtitle="Manage official logos, WhatsApp community links, Instagram handle, and contact channels"
      action={
        <Button
          variant="acid"
          size="sm"
          icon={Save}
          disabled={saving || loading}
          onClick={handleSave}
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      }
    >
      <Head>
        <title>Brand Settings — OnlyHikes Coordinator Ops</title>
      </Head>

      {feedback && (
        <div className={`p-4 rounded-xl mb-6 flex items-center gap-2 text-xs font-bold ${
          feedback.type === 'success' ? 'bg-acid/10 border border-acid/30 text-acid' : 'bg-red-950/60 border border-red-500/30 text-red-300'
        }`}>
          {feedback.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-muted text-xs">Loading settings...</div>
      ) : (
        <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
          {/* Section 1: Official Brand Identity */}
          <div className="bg-charcoal-900 border border-white/10 rounded-3xl p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <Globe className="w-5 h-5 text-acid" />
              <h2 className="font-display font-black text-lg text-offwhite">
                Brand Identity
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={brandData.brand_name || ''}
                  onChange={(e) => setBrandData({ ...brandData, brand_name: e.target.value })}
                  required
                  className="w-full bg-charcoal-950 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-offwhite focus:border-acid outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
                  City & Operations Base
                </label>
                <input
                  type="text"
                  value={brandData.city || ''}
                  onChange={(e) => setBrandData({ ...brandData, city: e.target.value })}
                  required
                  className="w-full bg-charcoal-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-offwhite focus:border-acid outline-none transition"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
                  Official Slogan / Tagline
                </label>
                <input
                  type="text"
                  value={brandData.tagline || ''}
                  onChange={(e) => setBrandData({ ...brandData, tagline: e.target.value })}
                  required
                  className="w-full bg-charcoal-950 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-acid focus:border-acid outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Logo & Visual Assets */}
          <div className="bg-charcoal-900 border border-white/10 rounded-3xl p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <ImageIcon className="w-5 h-5 text-flame" />
              <h2 className="font-display font-black text-lg text-offwhite">
                Brand Logo & Favicon
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
                  Dynamic Logo URL
                </label>
                <input
                  type="url"
                  value={brandData.logo_url || ''}
                  onChange={(e) => setBrandData({ ...brandData, logo_url: e.target.value })}
                  placeholder="https://... logo image"
                  className="w-full bg-charcoal-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-offwhite focus:border-acid outline-none transition mb-3"
                />

                <label className="border border-dashed border-white/15 hover:border-acid/40 rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer bg-charcoal-950 transition text-xs font-bold text-muted hover:text-offwhite">
                  <Upload className="w-4 h-4 text-acid" />
                  <span>{uploadingLogo ? 'Uploading...' : 'Upload Logo to Storage'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    disabled={uploadingLogo}
                  />
                </label>
              </div>

              {/* Logo Preview */}
              <div className="bg-charcoal-950 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center h-full min-h-[140px]">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted mb-2">Navbar Preview</span>
                {brandData.logo_url ? (
                  <img
                    src={brandData.logo_url}
                    alt="Brand Logo"
                    className="max-h-12 object-contain"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-acid flex items-center justify-center font-black text-charcoal-950 text-xs">
                      ▲
                    </div>
                    <span className="font-display font-black text-lg text-offwhite">
                      {brandData.brand_name || 'ONLYHIKES'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Official Social Channels */}
          <div className="bg-charcoal-900 border border-white/10 rounded-3xl p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <MessageCircle className="w-5 h-5 text-emerald-400" />
              <h2 className="font-display font-black text-lg text-offwhite">
                Official Community Links
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5" />
                  WhatsApp Channel URL
                </label>
                <input
                  type="url"
                  value={brandData.whatsapp_community_url || ''}
                  onChange={(e) => setBrandData({ ...brandData, whatsapp_community_url: e.target.value })}
                  placeholder="https://whatsapp.com/channel/..."
                  className="w-full bg-charcoal-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-offwhite focus:border-acid outline-none transition"
                />
                <span className="text-[10px] text-muted mt-1 block">Students are directed here for hike groups & alerts</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-pink-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Instagram className="w-3.5 h-3.5" />
                  Instagram Handle URL
                </label>
                <input
                  type="url"
                  value={brandData.instagram_url || ''}
                  onChange={(e) => setBrandData({ ...brandData, instagram_url: e.target.value })}
                  placeholder="https://www.instagram.com/onlyhikes.in/"
                  className="w-full bg-charcoal-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-offwhite focus:border-acid outline-none transition"
                />
                <span className="text-[10px] text-muted mt-1 block">Used in header, footer, and announcement tags</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  Coordinator Support Email
                </label>
                <input
                  type="email"
                  value={brandData.support_email || ''}
                  onChange={(e) => setBrandData({ ...brandData, support_email: e.target.value })}
                  placeholder="team@onlyhikes.in"
                  className="w-full bg-charcoal-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-offwhite focus:border-acid outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  Coordinator Emergency Phone
                </label>
                <input
                  type="text"
                  value={brandData.support_phone || ''}
                  onChange={(e) => setBrandData({ ...brandData, support_phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full bg-charcoal-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-offwhite focus:border-acid outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Brand Accent Colors */}
          <div className="bg-charcoal-900 border border-white/10 rounded-3xl p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <Palette className="w-5 h-5 text-acid" />
              <h2 className="font-display font-black text-lg text-offwhite">
                Global Palette Accents
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
                  Primary Accent (Default: Acid Green)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={brandData.primary_color || '#CCFF00'}
                    onChange={(e) => setBrandData({ ...brandData, primary_color: e.target.value })}
                    className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={brandData.primary_color || '#CCFF00'}
                    onChange={(e) => setBrandData({ ...brandData, primary_color: e.target.value })}
                    className="w-32 bg-charcoal-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono uppercase text-offwhite"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
                  Secondary Accent (Default: Flame Orange)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={brandData.secondary_color || '#FF5500'}
                    onChange={(e) => setBrandData({ ...brandData, secondary_color: e.target.value })}
                    className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={brandData.secondary_color || '#FF5500'}
                    onChange={(e) => setBrandData({ ...brandData, secondary_color: e.target.value })}
                    className="w-32 bg-charcoal-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono uppercase text-offwhite"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" variant="acid" size="lg" disabled={saving}>
              {saving ? 'Saving...' : 'Apply Brand Settings'}
            </Button>
          </div>
        </form>
      )}
    </AdminLayout>
  );
}

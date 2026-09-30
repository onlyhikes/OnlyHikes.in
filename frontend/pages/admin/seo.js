import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import {
  Globe,
  Save,
  CheckCircle,
  AlertCircle,
  Search,
  Share2
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import Button from '../../components/ui/Button';
import { getSiteContent, updateSiteContent } from '../../lib/api';

export default function AdminSeoPage() {
  const [seoData, setSeoData] = useState({
    meta_title: 'OnlyHikes.in — Jaipur Student Hiking Club | Weekend Treks',
    meta_description: 'Jaipur\'s dedicated student hiking movement. Curated weekend sunrise treks, Aravali fort expeditions, AC campus transit, and zero planning stress.',
    keywords: 'Jaipur hikes, student trekking, Nahargarh sunrise trek, Bhadraj, Aravali adventure, Jaipur college trips',
    og_image: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a',
    twitter_card: 'summary_large_image'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    async function loadSeo() {
      setLoading(true);
      try {
        const res = await getSiteContent('seo');
        if (res.data) setSeoData(res.data);
      } catch (err) {
        console.error('Failed to load SEO settings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSeo();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const res = await updateSiteContent('seo', seoData);
      if (res.ok !== false) {
        setFeedback({ type: 'success', message: 'SEO metadata updated successfully!' });
      } else {
        setFeedback({ type: 'error', message: res.message || 'Failed to update SEO settings.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Error updating SEO settings.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout
      title="SEARCH & SOCIAL SEO CONFIG"
      subtitle="Optimize search engine ranking, Google snippets, and social media link previews"
      action={
        <Button
          variant="acid"
          size="sm"
          icon={Save}
          disabled={saving || loading}
          onClick={handleSave}
        >
          {saving ? 'Saving...' : 'Save SEO'}
        </Button>
      }
    >
      <Head>
        <title>SEO Metadata — OnlyHikes Coordinator Ops</title>
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
        <div className="py-12 text-center text-muted text-xs">Loading SEO config...</div>
      ) : (
        <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
          <div className="bg-charcoal-900 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-acid" />
              <h2 className="font-display font-black text-lg text-offwhite">
                Google Search Appearance
              </h2>
            </div>

            <div>
              <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
                Page Title Tag (&lt;title&gt;)
              </label>
              <input
                type="text"
                value={seoData.meta_title || ''}
                onChange={(e) => setSeoData({ ...seoData, meta_title: e.target.value })}
                required
                className="w-full bg-charcoal-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-offwhite focus:border-acid outline-none transition"
              />
              <span className="text-[10px] text-muted mt-1 block">Recommended: 50-60 characters</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
                Meta Description
              </label>
              <textarea
                rows={3}
                value={seoData.meta_description || ''}
                onChange={(e) => setSeoData({ ...seoData, meta_description: e.target.value })}
                required
                className="w-full bg-charcoal-950 border border-white/10 rounded-xl p-3 text-sm text-offwhite focus:border-acid outline-none transition"
              />
              <span className="text-[10px] text-muted mt-1 block">Recommended: 120-160 characters</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
                Target Keywords (comma-separated)
              </label>
              <input
                type="text"
                value={seoData.keywords || ''}
                onChange={(e) => setSeoData({ ...seoData, keywords: e.target.value })}
                className="w-full bg-charcoal-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-offwhite focus:border-acid outline-none transition"
              />
            </div>
          </div>

          <div className="bg-charcoal-900 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-flame" />
              <h2 className="font-display font-black text-lg text-offwhite">
                Social Link Previews (OpenGraph / WhatsApp / Twitter)
              </h2>
            </div>

            <div>
              <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
                Social Share Image URL (og:image)
              </label>
              <input
                type="url"
                value={seoData.og_image || ''}
                onChange={(e) => setSeoData({ ...seoData, og_image: e.target.value })}
                className="w-full bg-charcoal-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-offwhite focus:border-acid outline-none transition"
              />
            </div>

            {/* Snippet Preview */}
            <div className="p-4 bg-charcoal-950 rounded-2xl border border-white/5">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-2">
                Search Result Preview
              </span>
              <div className="text-blue-400 text-base font-semibold hover:underline cursor-pointer truncate">
                {seoData.meta_title || 'OnlyHikes.in'}
              </div>
              <div className="text-emerald-500 text-xs mt-0.5">
                https://onlyhikes.in
              </div>
              <div className="text-muted text-xs mt-1 line-clamp-2">
                {seoData.meta_description || 'Jaipur student hiking club.'}
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" variant="acid" size="lg" disabled={saving}>
              {saving ? 'Saving...' : 'Apply SEO Settings'}
            </Button>
          </div>
        </form>
      )}
    </AdminLayout>
  );
}

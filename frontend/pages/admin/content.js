import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import {
  FileText,
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  MapPin,
  Compass,
  Award,
  ListOrdered,
  Megaphone,
  Layout
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import Button from '../../components/ui/Button';
import { getSiteContent, updateSiteContent } from '../../lib/api';

const SECTIONS = [
  { key: 'hero', label: 'Hero Banner', icon: Sparkles },
  { key: 'why_jaipur', label: 'Why Jaipur', icon: MapPin },
  { key: 'why_adventure', label: 'Why Adventure', icon: Compass },
  { key: 'why_onlyhikes', label: 'Why OnlyHikes', icon: Award },
  { key: 'how_it_works', label: 'How It Works', icon: ListOrdered },
  { key: 'announcement', label: 'Announcement Bar', icon: Megaphone },
  { key: 'footer', label: 'Footer & Legal', icon: Layout }
];

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState('hero');
  const [contentData, setContentData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    async function loadContent() {
      setLoading(true);
      try {
        const res = await getSiteContent();
        if (res.data) {
          setContentData(res.data);
        }
      } catch (err) {
        console.error('Failed to load site content:', err);
      } finally {
        setLoading(false);
      }
    }
    loadContent();
  }, []);

  const handleSaveSection = async (sectionKey) => {
    setSaving(true);
    setFeedback(null);
    try {
      const payload = contentData[sectionKey] || {};
      const res = await updateSiteContent(sectionKey, payload);
      if (res.ok !== false) {
        setFeedback({ type: 'success', message: `Section "${sectionKey}" saved successfully!` });
      } else {
        setFeedback({ type: 'error', message: res.message || 'Failed to save section.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Error saving content.' });
    } finally {
      setSaving(false);
    }
  };

  const updateSectionField = (sectionKey, field, value) => {
    setContentData(prev => ({
      ...prev,
      [sectionKey]: {
        ...(prev[sectionKey] || {}),
        [field]: value
      }
    }));
  };

  const activeContent = contentData[activeTab] || {};

  return (
    <AdminLayout
      title="SITE CONTENT CMS"
      subtitle="Modify homepage copy, marketing sections, slogans, and announcement banners in real-time"
      action={
        <Button
          variant="acid"
          size="sm"
          icon={Save}
          disabled={saving || loading}
          onClick={() => handleSaveSection(activeTab)}
        >
          {saving ? 'Saving...' : 'Save Current Section'}
        </Button>
      }
    >
      <Head>
        <title>Site Content CMS — OnlyHikes Coordinator Ops</title>
      </Head>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-white/10">
        {SECTIONS.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeTab === sec.key;
          return (
            <button
              key={sec.key}
              onClick={() => { setActiveTab(sec.key); setFeedback(null); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                isActive
                  ? 'bg-acid text-charcoal-950 shadow-acid-sm'
                  : 'bg-charcoal-900 text-muted hover:text-offwhite hover:bg-charcoal-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>

      {feedback && (
        <div className={`p-4 rounded-xl mb-6 flex items-center gap-2 text-xs font-bold ${
          feedback.type === 'success' ? 'bg-acid/10 border border-acid/30 text-acid' : 'bg-red-950/60 border border-red-500/30 text-red-300'
        }`}>
          {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-muted text-xs">Loading content sections...</div>
      ) : (
        <div className="bg-charcoal-900 border border-white/10 rounded-3xl p-6 md:p-8">
          {/* Hero Section Tab */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <div>
                <span className="text-acid text-[10px] font-black uppercase tracking-widest block">Main Screen</span>
                <h3 className="font-display font-black text-xl text-offwhite mt-1">Hero Section Editor</h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
                  Top Pill Badge
                </label>
                <input
                  type="text"
                  value={activeContent.badge || ''}
                  onChange={(e) => updateSectionField('hero', 'badge', e.target.value)}
                  placeholder="JAIPUR'S FIRST COLLEGE OUTDOOR REVOLUTION"
                  className="w-full bg-charcoal-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-offwhite focus:border-acid outline-none transition"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
                    Hero Headline (First Line)
                  </label>
                  <input
                    type="text"
                    value={activeContent.title_line1 || ''}
                    onChange={(e) => updateSectionField('hero', 'title_line1', e.target.value)}
                    placeholder="YOUR WEEKEND"
                    className="w-full bg-charcoal-950 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-offwhite focus:border-acid outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-acid uppercase tracking-wider mb-2">
                    Hero Accent Slogan (Second Line)
                  </label>
                  <input
                    type="text"
                    value={activeContent.title_line2 || ''}
                    onChange={(e) => updateSectionField('hero', 'title_line2', e.target.value)}
                    placeholder="JUST GOT WILDER."
                    className="w-full bg-charcoal-950 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-acid focus:border-acid outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
                  Hero Subtitle
                </label>
                <textarea
                  rows={3}
                  value={activeContent.subtitle || ''}
                  onChange={(e) => updateSectionField('hero', 'subtitle', e.target.value)}
                  placeholder="Curated sunrise treks, ancient Aravali forts, student transit & zero planning stress."
                  className="w-full bg-charcoal-950 border border-white/10 rounded-xl p-3 text-sm text-offwhite focus:border-acid outline-none transition"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
                    Primary CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={activeContent.cta_text || ''}
                    onChange={(e) => updateSectionField('hero', 'cta_text', e.target.value)}
                    placeholder="EXPLORE SUNDAY HIKES →"
                    className="w-full bg-charcoal-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-offwhite focus:border-acid outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
                    Secondary CTA Text
                  </label>
                  <input
                    type="text"
                    value={activeContent.secondary_cta || ''}
                    onChange={(e) => updateSectionField('hero', 'secondary_cta', e.target.value)}
                    placeholder="JOIN WHATSAPP CREW"
                    className="w-full bg-charcoal-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-offwhite focus:border-acid outline-none transition"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Why Jaipur Tab */}
          {activeTab === 'why_jaipur' && (
            <div className="space-y-6">
              <div>
                <span className="text-acid text-[10px] font-black uppercase tracking-widest block">Local Heritage</span>
                <h3 className="font-display font-black text-xl text-offwhite mt-1">Why Jaipur Treks</h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Headline</label>
                <input
                  type="text"
                  value={activeContent.headline || ''}
                  onChange={(e) => updateSectionField('why_jaipur', 'headline', e.target.value)}
                  placeholder="THE OLDEST MOUNTAIN RANGE IN THE WORLD IS IN OUR BACKYARD."
                  className="w-full bg-charcoal-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-offwhite focus:border-acid outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Description</label>
                <textarea
                  rows={4}
                  value={activeContent.description || ''}
                  onChange={(e) => updateSectionField('why_jaipur', 'description', e.target.value)}
                  placeholder="Jaipur isn't just pink palaces and college cafes. The rugged Aravalis wrap around the Pink City..."
                  className="w-full bg-charcoal-950 border border-white/10 rounded-xl p-3 text-sm text-offwhite focus:border-acid outline-none transition"
                />
              </div>
            </div>
          )}

          {/* Why Adventure Tab */}
          {activeTab === 'why_adventure' && (
            <div className="space-y-6">
              <div>
                <span className="text-acid text-[10px] font-black uppercase tracking-widest block">Student Life</span>
                <h3 className="font-display font-black text-xl text-offwhite mt-1">Why Adventure Matters</h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Headline</label>
                <input
                  type="text"
                  value={activeContent.headline || ''}
                  onChange={(e) => updateSectionField('why_adventure', 'headline', e.target.value)}
                  placeholder="ESCAPE THE CAMPUS SCREEN LOOP."
                  className="w-full bg-charcoal-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-offwhite focus:border-acid outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Description</label>
                <textarea
                  rows={4}
                  value={activeContent.description || ''}
                  onChange={(e) => updateSectionField('why_adventure', 'description', e.target.value)}
                  placeholder="College life shouldn't be endless assignments and late-night scrolling..."
                  className="w-full bg-charcoal-950 border border-white/10 rounded-xl p-3 text-sm text-offwhite focus:border-acid outline-none transition"
                />
              </div>
            </div>
          )}

          {/* Why OnlyHikes Tab */}
          {activeTab === 'why_onlyhikes' && (
            <div className="space-y-6">
              <div>
                <span className="text-acid text-[10px] font-black uppercase tracking-widest block">Value Proposition</span>
                <h3 className="font-display font-black text-xl text-offwhite mt-1">Why Choose OnlyHikes</h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Headline</label>
                <input
                  type="text"
                  value={activeContent.headline || ''}
                  onChange={(e) => updateSectionField('why_onlyhikes', 'headline', e.target.value)}
                  placeholder="NOT A TRAVEL AGENCY. A STUDENT ADVENTURE MOVEMENT."
                  className="w-full bg-charcoal-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-offwhite focus:border-acid outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Value Points (JSON or Text)</label>
                <textarea
                  rows={6}
                  value={typeof activeContent.points === 'string' ? activeContent.points : JSON.stringify(activeContent.points || [], null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      updateSectionField('why_onlyhikes', 'points', parsed);
                    } catch {
                      updateSectionField('why_onlyhikes', 'points', e.target.value);
                    }
                  }}
                  className="w-full font-mono bg-charcoal-950 border border-white/10 rounded-xl p-3 text-xs text-offwhite focus:border-acid outline-none transition"
                />
              </div>
            </div>
          )}

          {/* How It Works Tab */}
          {activeTab === 'how_it_works' && (
            <div className="space-y-6">
              <div>
                <span className="text-acid text-[10px] font-black uppercase tracking-widest block">Workflow</span>
                <h3 className="font-display font-black text-xl text-offwhite mt-1">How It Works Steps</h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Headline</label>
                <input
                  type="text"
                  value={activeContent.headline || ''}
                  onChange={(e) => updateSectionField('how_it_works', 'headline', e.target.value)}
                  placeholder="ZERO STRESS. 4 STEPS TO THE SUMMIT."
                  className="w-full bg-charcoal-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-offwhite focus:border-acid outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Steps (JSON Array of {`{step, title, desc}`})</label>
                <textarea
                  rows={8}
                  value={typeof activeContent.steps === 'string' ? activeContent.steps : JSON.stringify(activeContent.steps || [], null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      updateSectionField('how_it_works', 'steps', parsed);
                    } catch {
                      updateSectionField('how_it_works', 'steps', e.target.value);
                    }
                  }}
                  className="w-full font-mono bg-charcoal-950 border border-white/10 rounded-xl p-3 text-xs text-offwhite focus:border-acid outline-none transition"
                />
              </div>
            </div>
          )}

          {/* Announcement Bar Tab */}
          {activeTab === 'announcement' && (
            <div className="space-y-6">
              <div>
                <span className="text-acid text-[10px] font-black uppercase tracking-widest block">Site-Wide Alert</span>
                <h3 className="font-display font-black text-xl text-offwhite mt-1">Announcement Top Bar</h3>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="announcement_active"
                  checked={Boolean(activeContent.is_active)}
                  onChange={(e) => updateSectionField('announcement', 'is_active', e.target.checked)}
                  className="w-4 h-4 rounded text-acid focus:ring-0 bg-charcoal-950 border-white/20"
                />
                <label htmlFor="announcement_active" className="text-xs font-bold text-offwhite cursor-pointer">
                  Show Announcement Bar on Public Website
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
                  Announcement Text
                </label>
                <input
                  type="text"
                  value={activeContent.text || ''}
                  onChange={(e) => updateSectionField('announcement', 'text', e.target.value)}
                  placeholder="⚡ NEXT SUNDAY EXPEDITION IS LIVE · LIMITED SEATS ONLY"
                  className="w-full bg-charcoal-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-offwhite focus:border-acid outline-none transition"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
                    Action Link Text
                  </label>
                  <input
                    type="text"
                    value={activeContent.link_text || ''}
                    onChange={(e) => updateSectionField('announcement', 'link_text', e.target.value)}
                    placeholder="Book Seat →"
                    className="w-full bg-charcoal-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-offwhite focus:border-acid outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
                    Action Link URL
                  </label>
                  <input
                    type="text"
                    value={activeContent.link || ''}
                    onChange={(e) => updateSectionField('announcement', 'link', e.target.value)}
                    placeholder="/#hikes"
                    className="w-full bg-charcoal-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-offwhite focus:border-acid outline-none transition"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer Tab */}
          {activeTab === 'footer' && (
            <div className="space-y-6">
              <div>
                <span className="text-acid text-[10px] font-black uppercase tracking-widest block">Site Footer</span>
                <h3 className="font-display font-black text-xl text-offwhite mt-1">Footer & Legal Copy</h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
                  Footer Tagline
                </label>
                <input
                  type="text"
                  value={activeContent.tagline || ''}
                  onChange={(e) => updateSectionField('footer', 'tagline', e.target.value)}
                  placeholder="YOUR WEEKEND JUST GOT WILDER."
                  className="w-full bg-charcoal-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-offwhite focus:border-acid outline-none transition"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
                    City & Region
                  </label>
                  <input
                    type="text"
                    value={activeContent.city || ''}
                    onChange={(e) => updateSectionField('footer', 'city', e.target.value)}
                    placeholder="Jaipur, Rajasthan, India"
                    className="w-full bg-charcoal-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-offwhite focus:border-acid outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
                    Copyright Notice
                  </label>
                  <input
                    type="text"
                    value={activeContent.copyright || ''}
                    onChange={(e) => updateSectionField('footer', 'copyright', e.target.value)}
                    placeholder="© 2026 OnlyHikes.in. All rights reserved."
                    className="w-full bg-charcoal-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-offwhite focus:border-acid outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
                  Safety Disclaimer
                </label>
                <textarea
                  rows={3}
                  value={activeContent.disclaimer || ''}
                  onChange={(e) => updateSectionField('footer', 'disclaimer', e.target.value)}
                  placeholder="OnlyHikes organizes student outdoor community experiences. All participants must follow coordinator safety instructions."
                  className="w-full bg-charcoal-950 border border-white/10 rounded-xl p-3 text-sm text-offwhite focus:border-acid outline-none transition"
                />
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
            <span className="text-muted text-xs">
              Changes take effect immediately on the public website.
            </span>
            <Button
              variant="acid"
              size="md"
              icon={Save}
              disabled={saving}
              onClick={() => handleSaveSection(activeTab)}
            >
              {saving ? 'Saving...' : 'Save Current Section'}
            </Button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

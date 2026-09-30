import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Copy,
  Check,
  Film,
  Sparkles,
  ExternalLink,
  Upload,
  AlertCircle,
  X
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { getMedia, saveMedia, deleteMedia } from '../../lib/api';
import { supabase } from '../../lib/supabaseClient';

const PLACEMENTS = [
  { id: '', label: 'All Media' },
  { id: 'hike_poster', label: 'Hike Posters' },
  { id: 'gallery', label: 'Trail Gallery' },
  { id: 'reel', label: 'Reels / Video' },
  { id: 'hero_banner', label: 'Hero Banners' },
];

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePlacement, setActivePlacement] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Form State
  const [newMedia, setNewMedia] = useState({
    title: '',
    file_url: '',
    placement: 'hike_poster',
    file_type: 'image'
  });
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState('');

  const loadMedia = async () => {
    setLoading(true);
    try {
      const res = await getMedia(activePlacement);
      if (res.data) setMediaList(res.data);
    } catch (err) {
      console.error('Failed to load media:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, [activePlacement]);

  const handleCopy = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this media asset?')) return;
    try {
      const res = await deleteMedia(id);
      if (res.ok !== false) {
        setMediaList(prev => prev.filter(m => m.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete media:', err);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setFormError('');

    try {
      if (supabase) {
        const fileExt = file.name.split('.').pop();
        const fileName = `media-${Date.now()}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        const bucket = file.type.startsWith('video') ? 'videos' : 'gallery';
        const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file, { upsert: true });
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filePath);
        setNewMedia(prev => ({
          ...prev,
          file_url: publicUrl,
          title: prev.title || file.name.replace(/\.[^/.]+$/, ""),
          file_type: file.type.startsWith('video') ? 'video' : 'image'
        }));
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          setNewMedia(prev => ({
            ...prev,
            file_url: event.target.result,
            title: prev.title || file.name.replace(/\.[^/.]+$/, "")
          }));
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      setFormError(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!newMedia.file_url) {
      setFormError('Please upload an image or provide a valid media URL.');
      return;
    }

    try {
      const res = await saveMedia(newMedia);
      if (res.data || res.ok) {
        setIsAdding(false);
        setNewMedia({ title: '', file_url: '', placement: 'hike_poster', file_type: 'image' });
        loadMedia();
      } else {
        setFormError(res.message || 'Failed to save media record.');
      }
    } catch (err) {
      setFormError(err.message || 'Error saving media.');
    }
  };

  return (
    <AdminLayout
      title="MEDIA & ASSET LIBRARY"
      subtitle="Upload posters, trek photo reels, banners, and get direct asset links for your CMS"
      action={
        <Button variant="acid" size="sm" icon={Plus} onClick={() => { setIsAdding(true); setFormError(''); }}>
          Add Media Asset
        </Button>
      }
    >
      <Head>
        <title>Media Library — OnlyHikes Coordinator Ops</title>
      </Head>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-white/10">
        {PLACEMENTS.map((p) => (
          <button
            key={p.id}
            onClick={() => setActivePlacement(p.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              activePlacement === p.id
                ? 'bg-acid text-charcoal-950 shadow-acid-sm'
                : 'bg-charcoal-900 text-muted hover:text-offwhite hover:bg-charcoal-800'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="py-12 text-center text-muted text-xs">Loading media assets...</div>
      ) : mediaList.length === 0 ? (
        <div className="bg-charcoal-900 border border-dashed border-white/10 rounded-3xl p-12 text-center">
          <ImageIcon className="w-12 h-12 text-muted/40 mx-auto mb-3" />
          <h3 className="font-display font-black text-base text-offwhite">No Media Found</h3>
          <p className="text-muted text-xs mt-1">Upload posters or hike memories using the button above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mediaList.map((media) => (
            <div
              key={media.id}
              className="bg-charcoal-900 border border-white/10 rounded-2xl overflow-hidden flex flex-col group hover:border-white/20 transition"
            >
              {/* Media Preview */}
              <div className="h-44 bg-charcoal-950 relative overflow-hidden flex items-center justify-center">
                {media.file_type === 'video' ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-charcoal-950 text-flame">
                    <Film className="w-8 h-8 mb-2" />
                    <span className="text-[11px] font-bold">Video / Reel Asset</span>
                  </div>
                ) : (
                  <img
                    src={media.file_url}
                    alt={media.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a';
                    }}
                  />
                )}
                <div className="absolute top-2 left-2">
                  <Badge variant="dark" size="xs">
                    {media.placement || 'general'}
                  </Badge>
                </div>
              </div>

              {/* Media Details */}
              <div className="p-4 flex flex-col flex-grow justify-between">
                <div>
                  <h4 className="font-display font-black text-sm text-offwhite truncate mb-1">
                    {media.title}
                  </h4>
                  <p className="text-muted text-[10px] truncate font-mono">
                    {media.file_url}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 mt-3 border-t border-white/5">
                  <button
                    onClick={() => handleCopy(media.file_url, media.id)}
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold text-acid hover:underline"
                  >
                    {copiedId === media.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === media.id ? 'Copied Link' : 'Copy URL'}</span>
                  </button>

                  <button
                    onClick={() => handleDelete(media.id)}
                    className="p-1.5 text-muted hover:text-red-400 hover:bg-charcoal-800 rounded-lg transition"
                    title="Delete Asset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Media Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-charcoal-900 border border-white/10 rounded-3xl w-full max-w-lg p-6 md:p-8 relative">
            <button
              onClick={() => setIsAdding(false)}
              className="absolute top-6 right-6 text-muted hover:text-offwhite p-1 rounded-lg bg-charcoal-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-acid text-[10px] font-black uppercase tracking-widest block">Media Ingestion</span>
            <h2 className="font-display font-black text-2xl text-offwhite mt-1 mb-6">Add Media Asset</h2>

            {formError && (
              <div className="p-3 bg-red-950/60 border border-red-500/30 rounded-xl text-xs font-bold text-red-300 flex items-center gap-2 mb-4">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
                  Asset Title *
                </label>
                <input
                  type="text"
                  value={newMedia.title}
                  onChange={(e) => setNewMedia({ ...newMedia, title: e.target.value })}
                  required
                  placeholder="e.g. Nahargarh Sunrise Summit Golden Hour"
                  className="w-full bg-charcoal-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-offwhite focus:border-acid outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
                  Placement Category
                </label>
                <select
                  value={newMedia.placement}
                  onChange={(e) => setNewMedia({ ...newMedia, placement: e.target.value })}
                  className="w-full bg-charcoal-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-offwhite focus:border-acid outline-none transition"
                >
                  <option value="hike_poster">Hike Poster</option>
                  <option value="gallery">Trail Gallery</option>
                  <option value="reel">Instagram Reel / Video</option>
                  <option value="hero_banner">Hero Banner</option>
                  <option value="general">General Asset</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
                  Upload File
                </label>
                <label className="border-2 border-dashed border-white/10 hover:border-acid/40 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-charcoal-950 transition">
                  <Upload className="w-6 h-6 text-muted mb-2" />
                  <span className="text-xs font-bold text-offwhite">
                    {uploading ? 'Uploading to storage...' : 'Click to select image or video'}
                  </span>
                  <span className="text-[10px] text-muted mt-0.5">JPG, PNG, WebP, MP4</span>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
                  Or Direct Media URL
                </label>
                <input
                  type="url"
                  value={newMedia.file_url}
                  onChange={(e) => setNewMedia({ ...newMedia, file_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-charcoal-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-offwhite focus:border-acid outline-none transition"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <Button type="button" variant="ghost" size="md" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="acid" size="md" disabled={uploading}>
                  Save Asset
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

/**
 * Compress image client-side using HTML5 Canvas so poster uploads are fast and lightweight
 */
function compressImageToDataUrl(file, maxWidth = 1200, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = (err) => reject(err);
      img.src = event.target.result;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

export default function PosterUploader({ currentPosterUrl, onPosterUploaded }) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentPosterUrl || '');
  const [customUrl, setCustomUrl] = useState('');
  const [statusMessage, setStatusMessage] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setStatusMessage({ type: 'error', text: 'Please select an image file (JPG, PNG, WebP).' });
      return;
    }

    setUploading(true);
    setStatusMessage(null);

    try {
      // First try Supabase Storage if configured
      if (supabase) {
        try {
          const fileExt = file.name.split('.').pop();
          const fileName = `poster-${Date.now()}.${fileExt}`;
          const filePath = `hikes/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('posters')
            .upload(filePath, file, { upsert: true });

          if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage
              .from('posters')
              .getPublicUrl(filePath);

            setPreviewUrl(publicUrl);
            onPosterUploaded(publicUrl);
            setStatusMessage({ type: 'success', text: 'Poster uploaded successfully!' });
            return;
          }
        } catch (supaErr) {
          console.warn('Supabase storage fallback to optimized image:', supaErr);
        }
      }

      // Compress image so it saves fast and reliably
      const compressedUrl = await compressImageToDataUrl(file, 1200, 0.82);
      setPreviewUrl(compressedUrl);
      onPosterUploaded(compressedUrl);
      setStatusMessage({ type: 'success', text: 'Poster ready! Click Publish / Save Changes below.' });
    } catch (err) {
      console.error('Poster upload failed:', err);
      setStatusMessage({ type: 'error', text: `Upload failed: ${err.message}` });
    } finally {
      setUploading(false);
    }
  };

  const handleCustomUrlApply = () => {
    if (!customUrl || !customUrl.startsWith('http')) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid HTTP/HTTPS image URL.' });
      return;
    }
    setPreviewUrl(customUrl);
    onPosterUploaded(customUrl);
    setStatusMessage({ type: 'success', text: 'Poster URL applied!' });
  };

  return (
    <div className="space-y-4 bg-charcoal-850 p-5 rounded-2xl border border-white/10">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-black uppercase tracking-wider text-offwhite">
          Trek Poster Image
        </label>
        <span className="text-[10px] text-acid font-semibold uppercase">
          Live Preview
        </span>
      </div>

      {/* Preview Card */}
      {previewUrl && (
        <div className="relative aspect-[16/10] w-full max-w-sm mx-auto overflow-hidden rounded-xl border border-white/20 bg-charcoal-900 group">
          <img
            src={previewUrl}
            alt="Trek Poster Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-charcoal-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-bold text-offwhite">
            Current Poster Preview
          </div>
        </div>
      )}

      {/* Upload Box */}
      <div className="border-2 border-dashed border-white/15 hover:border-acid/60 rounded-xl p-5 text-center transition cursor-pointer relative bg-charcoal-900/50">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={uploading}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
        <div className="flex flex-col items-center gap-2">
          <Upload className={`w-6 h-6 ${uploading ? 'text-acid animate-bounce' : 'text-muted'}`} />
          <span className="text-xs font-bold text-offwhite">
            {uploading ? 'Processing poster...' : 'Click to select poster image from phone / computer'}
          </span>
          <span className="text-[10px] text-muted">
            Supports JPG, PNG, WebP (Auto-optimized for fast loading)
          </span>
        </div>
      </div>

      {/* Or Paste Direct Image URL */}
      <div className="pt-1">
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="Or paste direct image URL (https://...)..."
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            className="flex-grow bg-charcoal-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-offwhite focus:outline-none focus:border-acid"
          />
          <button
            type="button"
            onClick={handleCustomUrlApply}
            className="bg-charcoal-750 hover:bg-acid hover:text-charcoal-950 text-offwhite px-4 py-2 rounded-xl text-xs font-bold transition shrink-0"
          >
            Apply URL
          </button>
        </div>
      </div>

      {/* Status feedback */}
      {statusMessage && (
        <div
          className={`flex items-center gap-2 text-xs font-semibold p-2.5 rounded-lg ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
              : 'bg-red-950/60 text-red-300 border border-red-500/30'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}
    </div>
  );
}

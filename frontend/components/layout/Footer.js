import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Instagram, MessageCircle } from 'lucide-react';
import { getBrandSettings } from '../../lib/api';

export default function Footer() {
  const [brand, setBrand] = useState({
    brand_name: 'OnlyHikes.in',
    tagline: 'YOUR WEEKEND JUST GOT WILDER.',
    city: 'Jaipur, Rajasthan',
    whatsapp_community_url: 'https://whatsapp.com/channel/0029VbEaykELY6d6Jr9wht27',
    instagram_url: 'https://www.instagram.com/onlyhikes.in/'
  });

  useEffect(() => {
    async function loadMeta() {
      try {
        const brandRes = await getBrandSettings();
        if (brandRes.data) setBrand(prev => ({ ...prev, ...brandRes.data }));
      } catch (err) {
        console.error('Footer metadata fetch error:', err);
      }
    }
    loadMeta();
  }, []);

  const whatsappUrl = brand.whatsapp_community_url || 'https://whatsapp.com/channel/0029VbEaykELY6d6Jr9wht27';
  const instagramUrl = brand.instagram_url || 'https://www.instagram.com/onlyhikes.in/';

  return (
    <footer className="bg-charcoal-950 border-t border-white/10 py-10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/10">
          {/* Brand Info */}
          <div className="text-center md:text-left">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-acid flex items-center justify-center font-black text-charcoal-950 text-sm">
                ▲
              </div>
              <span className="font-display font-black text-xl text-offwhite tracking-tight">
                ONLYHIKES<span className="text-acid">.IN</span>
              </span>
            </Link>
            <p className="font-bold text-acid text-xs tracking-wide mt-1.5">
              "{brand.tagline || 'YOUR WEEKEND JUST GOT WILDER.'}"
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-xl bg-charcoal-900 border border-white/10 hover:border-pink-500 hover:text-pink-400 text-muted flex items-center justify-center transition"
              aria-label="Instagram"
              title="OnlyHikes Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-xl bg-charcoal-900 border border-white/10 hover:border-emerald-500 hover:text-emerald-400 text-muted flex items-center justify-center transition"
              aria-label="WhatsApp"
              title="OnlyHikes WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted gap-3">
          <div>
            © {new Date().getFullYear()} OnlyHikes.in. All rights reserved.
          </div>
          <div className="text-acid font-bold">
            {brand.city || 'Jaipur, Rajasthan'}
          </div>
        </div>
      </div>
    </footer>
  );
}

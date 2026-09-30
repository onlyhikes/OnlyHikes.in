import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Compass, Instagram, MessageCircle, Mountain, ShieldCheck, MapPin } from 'lucide-react';
import { getBrandSettings, getSiteContent } from '../../lib/api';

export default function Footer() {
  const [brand, setBrand] = useState({
    brand_name: 'OnlyHikes.in',
    tagline: 'YOUR WEEKEND JUST GOT WILDER.',
    city: 'Jaipur, Rajasthan',
    whatsapp_community_url: 'https://whatsapp.com/channel/0029VbEaykELY6d6Jr9wht27',
    instagram_url: 'https://www.instagram.com/onlyhikes.in/'
  });
  const [footerContent, setFooterContent] = useState(null);

  useEffect(() => {
    async function loadMeta() {
      try {
        const [brandRes, footerRes] = await Promise.all([
          getBrandSettings(),
          getSiteContent('footer')
        ]);
        if (brandRes.data) setBrand(prev => ({ ...prev, ...brandRes.data }));
        if (footerRes.data) setFooterContent(footerRes.data);
      } catch (err) {
        console.error('Footer metadata fetch error:', err);
      }
    }
    loadMeta();
  }, []);

  const whatsappUrl = brand.whatsapp_community_url || 'https://whatsapp.com/channel/0029VbEaykELY6d6Jr9wht27';
  const instagramUrl = brand.instagram_url || 'https://www.instagram.com/onlyhikes.in/';

  return (
    <footer className="bg-charcoal-950 border-t border-white/10 pt-16 pb-12 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-acid/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Community Social Banner */}
        <div className="bg-charcoal-900 border border-white/10 rounded-3xl p-8 mb-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <span className="text-emerald-400 text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5" />
              Official Student WhatsApp Channel
            </span>
            <h3 className="font-display font-black text-2xl md:text-3xl text-offwhite mt-1">
              GET TREK ALERTS FIRST ON WHATSAPP
            </h3>
            <p className="text-muted text-sm mt-1 max-w-xl">
              Trail updates, pickup coordination, sunrise time tables, and group photo album drops for all Jaipur hikers.
            </p>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-charcoal-950 px-6 py-3.5 rounded-xl font-black text-sm uppercase tracking-wide transition shadow-lg shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            Join WhatsApp Channel
          </a>
        </div>

        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-acid flex items-center justify-center font-black text-charcoal-950 text-base">
                ▲
              </div>
              <span className="font-display font-black text-2xl text-offwhite tracking-tight">
                {brand.brand_name || 'ONLYHIKES'}<span className="text-acid">.IN</span>
              </span>
            </Link>
            <p className="font-black text-acid text-sm tracking-wide">
              "{footerContent?.tagline || brand.tagline || 'YOUR WEEKEND JUST GOT WILDER.'}"
            </p>
            <p className="text-muted text-xs leading-relaxed max-w-sm">
              Jaipur's dedicated student hiking movement. Curated Aravali treks, AC transit pickups, safety marshals, hydration packs, and authentic college squad memories.
            </p>
            <div className="flex items-center gap-3 pt-2">
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
                aria-label="WhatsApp Community"
                title="OnlyHikes WhatsApp Tribe"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Expeditions Links */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-acid mb-4">Expeditions</h4>
            <ul className="space-y-2.5 text-xs font-semibold text-muted">
              <li>
                <Link href="/hikes" className="hover:text-offwhite transition">Upcoming Weekend Hikes</Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-offwhite transition">Aravali Fort Circuits</Link>
              </li>
              <li>
                <Link href="/vote" className="hover:text-offwhite transition">Vote for Next Destination</Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-offwhite transition">Trek FAQs</Link>
              </li>
            </ul>
          </div>

          {/* Pickup Points */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-acid mb-4">Jaipur Pickups</h4>
            <ul className="space-y-2.5 text-xs font-semibold text-muted">
              <li className="flex items-center gap-1.5 text-offwhite">
                <MapPin className="w-3.5 h-3.5 text-acid" /> Mansarovar Metro Pillar 12
              </li>
              <li className="flex items-center gap-1.5 text-offwhite">
                <MapPin className="w-3.5 h-3.5 text-acid" /> Vaishali Nagar Amrapali Circle
              </li>
              <li className="flex items-center gap-1.5 text-offwhite">
                <MapPin className="w-3.5 h-3.5 text-acid" /> Raja Park Golcha Garden
              </li>
              <li className="flex items-center gap-1.5 text-offwhite">
                <MapPin className="w-3.5 h-3.5 text-acid" /> WTP Main Gate Malviya Nagar
              </li>
            </ul>
          </div>

          {/* Inclusions */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-acid mb-4">Every Trek Includes</h4>
            <ul className="space-y-2.5 text-xs font-semibold text-muted">
              <li className="flex items-center gap-1.5 text-offwhite">
                <ShieldCheck className="w-3.5 h-3.5 text-acid" /> Certified Lead Marshals
              </li>
              <li className="flex items-center gap-1.5 text-offwhite">
                <Mountain className="w-3.5 h-3.5 text-acid" /> Dedicated AC Bus Transit
              </li>
              <li className="flex items-center gap-1.5 text-offwhite">
                <Compass className="w-3.5 h-3.5 text-acid" /> First-Aid & Hydration Pack
              </li>
              <li className="pt-2 text-[11px] text-muted">
                Student verified. Safe for solo & squad bookings.
              </li>
            </ul>
          </div>
        </div>

        {/* Big Brand Typography */}
        <div className="py-10 text-center select-none opacity-15 pointer-events-none">
          <span className="font-display font-black text-6xl sm:text-8xl md:text-9xl text-stroke tracking-tighter">
            ONLYHIKES
          </span>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-muted gap-4">
          <div>
            {footerContent?.copyright || `© ${new Date().getFullYear()} OnlyHikes.in. All rights reserved.`}
          </div>
          <div className="flex items-center gap-6">
            <span className="text-offwhite/70">{footerContent?.disclaimer || "Jaipur's Student Adventure Community"}</span>
            <span className="text-acid font-bold">{footerContent?.city || brand.city || 'Jaipur, Rajasthan'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

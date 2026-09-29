import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Compass, Heart, Instagram, MessageSquare, Mountain, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-charcoal-950 border-t border-white/10 pt-16 pb-12 relative overflow-hidden">
      {/* Background flare */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-acid/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top CTA Banner */}
        <div className="bg-gradient-to-r from-charcoal-850 to-charcoal-900 border border-white/10 rounded-3xl p-8 mb-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="text-acid text-xs font-black uppercase tracking-widest">
              CAMPUS REPRESENTATIVE PROGRAM
            </span>
            <h3 className="font-display font-black text-2xl md:text-3xl text-offwhite mt-1">
              REPRESENT ONLYHIKES AT YOUR JAIPUR CAMPUS
            </h3>
            <p className="text-muted text-sm mt-1 max-w-xl">
              Free trek passes, coordinator training, leadership creds, and cash bonuses for bringing your college squad out on the Aravalis.
            </p>
          </div>
          <Link
            href="/community"
            className="inline-flex items-center gap-2 bg-acid text-charcoal-950 px-6 py-3.5 rounded-xl font-black text-sm uppercase tracking-wide hover:bg-acid-400 transition"
          >
            Join Campus Reps <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-acid flex items-center justify-center font-black text-charcoal-950 text-base">
                ▲
              </div>
              <span className="font-display font-black text-2xl text-offwhite tracking-tight">
                ONLYHIKES<span className="text-acid">.IN</span>
              </span>
            </Link>
            <p className="font-bold text-offwhite text-sm">
              "YOUR WEEKEND JUST GOT WILDER."
            </p>
            <p className="text-muted text-xs leading-relaxed max-w-sm">
              Jaipur's premier student adventure community. We organize Aravali treks, sunrise runs, AC bus pickup & drops, fresh food, and community memories for college students across Jaipur.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://www.instagram.com/onlyhikes.in/'}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-charcoal-850 hover:bg-pink-600 hover:text-white text-muted flex items-center justify-center transition"
                aria-label="Instagram"
                title="OnlyHikes Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL || 'https://whatsapp.com/channel/0029VbEaykELY6d6Jr9wht27'}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-charcoal-850 hover:bg-emerald-500 hover:text-white text-muted flex items-center justify-center transition"
                aria-label="WhatsApp Community"
                title="OnlyHikes WhatsApp Tribe"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 1: Adventures */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-acid mb-4">Adventures</h4>
            <ul className="space-y-2.5 text-xs font-semibold text-muted">
              <li>
                <Link href="/hikes" className="hover:text-offwhite transition">Upcoming Weekend Hikes</Link>
              </li>
              <li>
                <Link href="/hikes/nahargarh-sunrise-hike" className="hover:text-offwhite transition">Nahargarh Sunrise Trek</Link>
              </li>
              <li>
                <Link href="/hikes/bhangarh-midnight-expedition" className="hover:text-offwhite transition">Bhangarh Midnight Trail</Link>
              </li>
              <li>
                <Link href="/hikes/hathni-kund-waterfall-trail" className="hover:text-offwhite transition">Hathni Kund Canyon</Link>
              </li>
              <li>
                <Link href="/vote" className="hover:text-offwhite transition">Vote for Next Trail</Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Explore Jaipur */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-acid mb-4">Explore Jaipur</h4>
            <ul className="space-y-2.5 text-xs font-semibold text-muted">
              <li>
                <Link href="/explore" className="hover:text-offwhite transition">Forts & Ridges</Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-offwhite transition">Top Sunrise Vantage Points</Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-offwhite transition">Sunset Perches</Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-offwhite transition">Hidden Canyons & Stepwells</Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-offwhite transition">Student Referral (₹50 Off)</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Inclusions & Safety */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-acid mb-4">Inclusions</h4>
            <ul className="space-y-2.5 text-xs font-semibold text-muted">
              <li className="flex items-center gap-1.5 text-offwhite">
                <ShieldCheck className="w-3.5 h-3.5 text-acid" /> Certified Hike Marshals
              </li>
              <li className="flex items-center gap-1.5 text-offwhite">
                <Mountain className="w-3.5 h-3.5 text-acid" /> AC Bus Pickup & Drop
              </li>
              <li className="flex items-center gap-1.5 text-offwhite">
                <Compass className="w-3.5 h-3.5 text-acid" /> First-Aid & Hydration
              </li>
              <li className="pt-2 text-[11px] text-muted">
                Pickups: WTP Malviya Nagar, Raja Park, Vaishali Nagar, Mansarovar Metro.
              </li>
            </ul>
          </div>
        </div>

        {/* Big Impact Logo Mark */}
        <div className="py-10 text-center select-none opacity-20 pointer-events-none">
          <span className="font-display font-black text-6xl sm:text-8xl md:text-9xl text-stroke tracking-tighter">
            ONLYHIKES
          </span>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-muted gap-4">
          <div>
            © {new Date().getFullYear()} OnlyHikes.in — Student Adventure Community Jaipur.
          </div>
          <div className="flex items-center gap-6">
            <span>Don't spend your weekend indoors. Go explore.</span>
            <span className="text-acid font-semibold">Jaipur, Rajasthan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

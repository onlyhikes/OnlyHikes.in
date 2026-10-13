import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, Bus, Utensils, ArrowUpRight, ShieldCheck, Sparkles } from 'lucide-react';
import SeatProgressBar from '../ui/SeatProgressBar';

export default function TrekCard({ hike }) {
  if (!hike) return null;

  const sellingPrice = hike.selling_price || hike.price || 299;
  const originalPrice = hike.original_price || (sellingPrice + 200);
  const themeAccent = hike.theme_accent || '#CCFF00';
  const bookedSeats = hike.booked_seats || 0;
  const totalSlots = hike.slots_total || hike.total_seats || 25;
  const tagText = hike.tag || 'Sunday Expedition';

  const href = `/hikes/${hike.slug || hike.id}`;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group relative flex flex-col bg-charcoal-900 border border-white/10 hover:border-white/30 rounded-3xl overflow-hidden shadow-xl transition-all duration-300"
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-charcoal-800">
        <img
          src={hike.poster_url || 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=800&q=80'}
          alt={hike.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/30 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <div
            className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md border flex items-center gap-1.5"
            style={{
              backgroundColor: 'rgba(7, 7, 9, 0.8)',
              borderColor: themeAccent,
              color: themeAccent
            }}
          >
            <Sparkles className="w-3 h-3" />
            <span>{tagText}</span>
          </div>

          <div className="bg-charcoal-950/90 backdrop-blur-md px-3 py-1 rounded-xl border border-white/10 text-offwhite flex items-baseline gap-1.5">
            <span className="font-display font-black text-sm text-acid">
              ₹{sellingPrice}
            </span>
            {originalPrice > sellingPrice && (
              <span className="text-muted line-through text-[11px] font-normal">
                ₹{originalPrice}
              </span>
            )}
          </div>
        </div>

        {/* Quick Inclusions Badges on Poster */}
        <div className="absolute bottom-3 left-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 bg-charcoal-950/90 backdrop-blur-sm text-[10px] font-bold text-acid px-2.5 py-1 rounded-lg border border-acid/20">
            <Bus className="w-3 h-3" /> AC Transit
          </span>
          <span className="inline-flex items-center gap-1 bg-charcoal-950/90 backdrop-blur-sm text-[10px] font-bold text-offwhite px-2.5 py-1 rounded-lg border border-white/10">
            <ShieldCheck className="w-3 h-3 text-emerald-400" /> Marshals
          </span>
        </div>
      </div>

      {/* Content Container */}
      <div className="flex flex-col flex-grow p-6">
        {/* Schedule */}
        <div className="flex items-center gap-3 text-xs font-semibold text-muted mb-2">
          <span className="flex items-center gap-1 text-offwhite/90">
            <Clock className="w-3.5 h-3.5 text-acid" /> {hike.time}
          </span>
          {hike.date && (
            <span className="flex items-center gap-1">
              • <Calendar className="w-3.5 h-3.5 text-muted" /> {hike.date}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-display font-black text-xl text-offwhite group-hover:text-acid transition-colors tracking-tight line-clamp-1 mb-2">
          {hike.title}
        </h3>

        {/* Subtitle / Description */}
        <p className="text-muted text-xs line-clamp-2 leading-relaxed mb-5">
          {hike.subtitle || hike.description}
        </p>

        {/* Seat Inventory Progress Bar */}
        <div className="mt-auto mb-5">
          <SeatProgressBar
            booked={bookedSeats}
            total={totalSlots}
          />
        </div>

        {/* Action Button */}
        <Link href={href} className="w-full">
          <button
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-acid hover:bg-acid/90 text-charcoal-950 font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-acid-sm"
          >
            <span>BOOK TICKET / CHECK SEATS</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </Link>
      </div>
    </motion.div>
  );
}

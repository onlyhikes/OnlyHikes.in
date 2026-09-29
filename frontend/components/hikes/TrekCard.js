import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, Clock, Bus, Utensils, ArrowUpRight, ShieldCheck } from 'lucide-react';
import Badge from '../ui/Badge';
import SeatProgressBar from '../ui/SeatProgressBar';

export default function TrekCard({ hike }) {
  if (!hike) return null;

  const difficultyVariant = {
    Easy: 'success',
    Moderate: 'acid',
    Challenging: 'flame',
    Strenuous: 'flameSolid',
  }[hike.difficulty] || 'acid';

  const href = `/hikes/${hike.slug || hike.id}`;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group relative flex flex-col bg-charcoal-900 border border-white/10 hover:border-acid/50 rounded-3xl overflow-hidden shadow-xl hover:shadow-acid-glow/20 transition-colors"
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
          <Badge variant={difficultyVariant} size="sm">
            {hike.difficulty}
          </Badge>
          <div className="bg-charcoal-950/80 backdrop-blur-md px-3 py-1 rounded-xl border border-white/10 text-offwhite font-black text-sm">
            ₹{hike.price} <span className="text-[10px] text-muted font-normal">/ person</span>
          </div>
        </div>

        {/* Quick Inclusions Badges on Poster */}
        <div className="absolute bottom-3 left-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 bg-charcoal-950/90 backdrop-blur-sm text-[11px] font-bold text-acid px-2.5 py-1 rounded-lg border border-acid/20">
            <Bus className="w-3 h-3" /> Pickup + Drop
          </span>
          <span className="inline-flex items-center gap-1 bg-charcoal-950/90 backdrop-blur-sm text-[11px] font-bold text-amber-300 px-2.5 py-1 rounded-lg border border-amber-400/20">
            <Utensils className="w-3 h-3" /> Food Included
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

        {/* Subtitle */}
        <p className="text-muted text-xs line-clamp-2 leading-relaxed mb-5">
          {hike.subtitle || hike.description}
        </p>

        {/* Seat Inventory Progress Bar */}
        <div className="mt-auto mb-5">
          <SeatProgressBar
            booked={hike.booked_seats || 0}
            total={hike.total_seats || 25}
          />
        </div>

        {/* Action Button */}
        <Link href={href} className="w-full">
          <button className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-charcoal-800 group-hover:bg-acid text-offwhite group-hover:text-charcoal-950 font-black text-xs uppercase tracking-wider transition-all duration-200">
            <span>VIEW TREK</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </Link>
      </div>
    </motion.div>
  );
}

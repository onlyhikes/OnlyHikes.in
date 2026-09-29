import React from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

export default function SeatProgressBar({ booked = 0, total = 25, className = '', showLabel = true }) {
  const percentage = Math.min(100, Math.round((booked / total) * 100));
  const remaining = Math.max(0, total - booked);

  let barColor = 'bg-acid';
  let badgeColor = 'text-acid';
  let statusText = `${remaining} spots left`;

  if (remaining === 0) {
    barColor = 'bg-red-500';
    badgeColor = 'text-red-400';
    statusText = 'Sold out';
  } else if (remaining <= 5) {
    barColor = 'bg-flame';
    badgeColor = 'text-flame';
    statusText = `Only ${remaining} left! Filling fast`;
  }

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
          <div className="flex items-center gap-1.5 text-offwhite/90">
            <Users className="w-3.5 h-3.5 text-muted" />
            <span>
              <strong className="text-white font-extrabold">{booked}</strong> / {total} going
            </span>
          </div>
          <span className={`font-bold tracking-wide uppercase text-[11px] ${badgeColor}`}>
            {statusText}
          </span>
        </div>
      )}

      {/* Progress track */}
      <div className="w-full h-2 bg-charcoal-700/80 rounded-full overflow-hidden p-0.5 border border-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${barColor}`}
        />
      </div>
    </div>
  );
}

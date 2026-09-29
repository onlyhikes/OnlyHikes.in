import React from 'react';

export default function Badge({
  children,
  variant = 'acid',
  size = 'sm',
  className = '',
  icon: Icon
}) {
  const base = 'inline-flex items-center font-bold uppercase tracking-wider rounded-md select-none shrink-0';

  const sizes = {
    xs: 'text-[10px] px-2 py-0.5 gap-1',
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-xs px-3 py-1.5 gap-1.5',
  };

  const variants = {
    acid: 'bg-acid/15 text-acid border border-acid/30',
    acidSolid: 'bg-acid text-charcoal-950 font-black',
    flame: 'bg-flame/15 text-flame border border-flame/30',
    flameSolid: 'bg-flame text-white font-black',
    charcoal: 'bg-charcoal-800 text-offwhite border border-white/10',
    demo: 'bg-purple-950/60 text-purple-300 border border-purple-500/40 text-[10px]',
    success: 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40',
    warning: 'bg-amber-950/60 text-amber-400 border border-amber-500/40',
  };

  return (
    <span className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      {Icon && <Icon className="w-3 h-3" />}
      {children}
    </span>
  );
}

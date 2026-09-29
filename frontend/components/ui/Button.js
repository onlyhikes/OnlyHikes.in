import React from 'react';
import { motion } from 'framer-motion';

export default function Button({
  children,
  variant = 'acid',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  icon: Icon,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-bold tracking-tight rounded-xl transition-all duration-200 select-none disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-2 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-7 py-3.5 gap-2.5 font-extrabold',
    xl: 'text-lg px-8 py-4 gap-3 font-extrabold uppercase tracking-wide',
  };

  const variants = {
    acid: 'bg-acid text-charcoal-950 hover:bg-acid-400 hover:shadow-acid-glow active:scale-[0.98]',
    flame: 'bg-flame text-white hover:bg-flame-400 hover:shadow-flame-glow active:scale-[0.98]',
    dark: 'bg-charcoal-800 text-offwhite border border-white/10 hover:bg-charcoal-700 hover:border-white/20 active:scale-[0.98]',
    outline: 'bg-transparent text-offwhite border-2 border-white/20 hover:border-acid hover:text-acid active:scale-[0.98]',
    ghost: 'bg-transparent text-muted hover:text-offwhite hover:bg-white/5 active:scale-[0.98]',
  };

  return (
    <motion.button
      type={type}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      {children}
    </motion.button>
  );
}

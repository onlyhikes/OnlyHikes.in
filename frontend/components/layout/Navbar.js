import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Compass, Mountain, Vote, User, Users, ShieldAlert, ArrowRight, LogOut, Instagram, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

export default function Navbar() {
  const router = useRouter();
  const { user, isAdmin, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Hikes', href: '/hikes', icon: Mountain },
    { label: 'Explore', href: '/explore', icon: Compass },
    { label: 'Vote', href: '/vote', icon: Vote },
    { label: 'Community', href: '/community', icon: Users },
  ];

  const isActive = (href) => {
    if (href === '/') return router.pathname === '/';
    return router.pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'py-3 bg-charcoal-950/90 backdrop-blur-md border-b border-white/10 shadow-2xl'
            : 'py-5 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-acid flex items-center justify-center font-black text-charcoal-950 text-base shadow-acid-sm group-hover:scale-105 transition-transform">
              ▲
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-xl tracking-tight text-offwhite group-hover:text-acid transition-colors">
                ONLYHIKES<span className="text-acid">.IN</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-muted -mt-1 font-semibold">
                Jaipur Chapter
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-charcoal-900/80 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all relative ${
                    active
                      ? 'text-charcoal-950 font-bold'
                      : 'text-offwhite/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="navPill"
                      className="absolute inset-0 bg-acid rounded-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAdmin && (
              <Link href="/admin">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold uppercase rounded-lg bg-flame/15 text-flame border border-flame/30 hover:bg-flame/25 transition">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Admin
                </span>
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-2">
                <Link href="/account">
                  <div className="flex items-center gap-2 bg-charcoal-850 hover:bg-charcoal-800 border border-white/10 hover:border-acid/40 px-3 py-1.5 rounded-xl transition">
                    <div className="w-6 h-6 rounded-full bg-acid/20 text-acid flex items-center justify-center text-xs font-bold">
                      {user.full_name ? user.full_name[0].toUpperCase() : 'U'}
                    </div>
                    <span className="text-xs font-semibold text-offwhite max-w-[100px] truncate">
                      {user.full_name?.split(' ')[0] || 'Student'}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 text-muted hover:text-offwhite hover:bg-white/5 rounded-xl transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link href="/login">
                <span className="text-sm font-bold text-offwhite/80 hover:text-acid px-3 py-2 transition">
                  Login
                </span>
              </Link>
            )}

            <a
              href={process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://www.instagram.com/onlyhikes.in/'}
              target="_blank"
              rel="noreferrer"
              className="p-2 text-muted hover:text-pink-400 hover:bg-white/5 rounded-xl transition"
              aria-label="Instagram"
              title="OnlyHikes Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>

            <Link href="/hikes">
              <Button variant="acid" size="sm" className="font-extrabold uppercase tracking-wide">
                Book a Hike →
              </Button>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-charcoal-850 border border-white/10 text-offwhite focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-acid" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[68px] z-40 md:hidden bg-charcoal-950/95 backdrop-blur-xl border-b border-white/10 p-5 shadow-2xl"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-charcoal-800 text-base font-bold text-offwhite"
                  >
                    {IconComponent && <IconComponent className="w-5 h-5 text-acid" />}
                    {link.label}
                  </Link>
                );
              })}

              <hr className="border-white/10 my-1" />

              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl bg-flame/10 text-flame font-bold"
                >
                  <span className="flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5" />
                    Coordinator Admin Portal
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}

              {user ? (
                <div className="flex flex-col gap-2 pt-2">
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-charcoal-850 font-bold text-offwhite"
                  >
                    <User className="w-5 h-5 text-acid" />
                    My Account ({user.full_name || 'Student'})
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-sm font-semibold text-muted text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 text-center rounded-xl bg-charcoal-850 font-bold text-offwhite hover:bg-charcoal-800"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 text-center rounded-xl bg-charcoal-850 font-bold text-offwhite hover:bg-charcoal-800"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <a
                  href={process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://www.instagram.com/onlyhikes.in/'}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-charcoal-850 border border-white/10 text-xs font-bold text-pink-400 hover:bg-charcoal-800 transition"
                >
                  <Instagram className="w-4 h-4" />
                  Instagram
                </a>
                <a
                  href={process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL || 'https://whatsapp.com/channel/0029VbEaykELY6d6Jr9wht27'}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-charcoal-850 border border-white/10 text-xs font-bold text-emerald-400 hover:bg-charcoal-800 transition"
                >
                  <MessageSquare className="w-4 h-4" />
                  WhatsApp
                </a>
              </div>

              <Link
                href="/hikes"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2"
              >
                <Button variant="acid" size="lg" className="w-full uppercase font-black">
                  Book a Hike →
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

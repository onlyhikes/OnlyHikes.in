import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Search, Mountain, Sparkles } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import TrekCard from '../../components/hikes/TrekCard';
import { getHikes } from '../../lib/api';

export default function HikesDirectoryPage() {
  const [hikes, setHikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchHikesList() {
      setLoading(true);
      try {
        const res = await getHikes();
        if (res.data) setHikes(res.data);
      } catch (err) {
        console.error('Failed to fetch hikes list:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchHikesList();
  }, []);

  const filteredHikes = hikes.filter((hike) => {
    const matchesSearch =
      !searchQuery ||
      hike.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hike.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hike.tag?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hike.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <Layout>
      <Head>
        <title>Upcoming Expeditions — OnlyHikes.in Jaipur</title>
        <meta name="description" content="Browse curated weekend Aravali hikes, sunrise trails, and fort treks in Jaipur for college students." />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <span className="text-acid text-xs font-black uppercase tracking-widest flex items-center gap-1.5 mb-2 font-mono">
            <Mountain className="w-4 h-4" />
            JAIPUR EXPEDITIONS CALENDAR
          </span>
          <h1 className="font-display font-black text-4xl sm:text-6xl text-offwhite tracking-tight">
            UPCOMING HIKES & TRAILS
          </h1>
          <p className="text-muted text-sm sm:text-base mt-3 leading-relaxed">
            Every Sunday, we take Jaipur students out into the ancient Aravalis. We provide AC coach transit, hot breakfast, certified marshals, and a verified student community.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-charcoal-900 border border-white/10 p-4 rounded-2xl mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs font-bold text-muted uppercase tracking-wider">
            {filteredHikes.length} {filteredHikes.length === 1 ? 'Expedition' : 'Expeditions'} Available
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search trails, forts, ridges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-charcoal-950 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-offwhite focus:outline-none focus:border-acid transition"
            />
          </div>
        </div>

        {/* Hikes Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-2 border-acid border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-bold text-muted">Loading expeditions calendar...</p>
          </div>
        ) : filteredHikes.length === 0 ? (
          <div className="bg-charcoal-900 border border-dashed border-white/10 rounded-3xl p-16 text-center max-w-lg mx-auto">
            <Mountain className="w-12 h-12 text-muted/30 mx-auto mb-3" />
            <h3 className="font-display font-black text-xl text-offwhite">No Expeditions Matching Search</h3>
            <p className="text-muted text-xs mt-2">
              Try searching for "Nahargarh", "Bhangarh", or clear your search input.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredHikes.map((hike) => (
              <TrekCard key={hike.id} hike={hike} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

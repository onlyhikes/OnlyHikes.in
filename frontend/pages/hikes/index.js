import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Search, Filter, Mountain, Compass, Sparkles } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import TrekCard from '../../components/hikes/TrekCard';
import Button from '../../components/ui/Button';
import { getHikes } from '../../lib/api';

export default function HikesDirectoryPage() {
  const [hikes, setHikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
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

  const difficulties = ['All', 'Easy', 'Moderate', 'Challenging'];

  const filteredHikes = hikes.filter((hike) => {
    const matchesDifficulty =
      selectedDifficulty === 'All' ||
      hike.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      hike.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hike.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hike.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDifficulty && matchesSearch;
  });

  return (
    <Layout>
      <Head>
        <title>Upcoming Hikes & Trails — OnlyHikes.in Jaipur</title>
        <meta name="description" content="Browse curated weekend Aravali hikes, sunrise trails, and stargazing night treks in Jaipur." />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <span className="text-acid text-xs font-black uppercase tracking-widest flex items-center gap-1.5 mb-2">
            <Mountain className="w-4 h-4" />
            Jaipur Weekend Calendar
          </span>
          <h1 className="font-display font-black text-4xl sm:text-6xl text-offwhite tracking-tight">
            UPCOMING HIKES & TRAILS
          </h1>
          <p className="text-muted text-sm sm:text-base mt-3 leading-relaxed">
            Every weekend, we take Jaipur students out into the Aravalis. We provide AC pickup & drop, breakfast, certified trek marshals, and a verified student community.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-charcoal-900 border border-white/10 p-4 rounded-2xl mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Difficulty pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-none">
            <span className="text-xs text-muted font-bold uppercase tracking-wider pl-2 pr-1 hidden sm:inline">
              Difficulty:
            </span>
            {difficulties.map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition shrink-0 ${
                  selectedDifficulty === diff
                    ? 'bg-acid text-charcoal-950 font-black shadow-acid-sm'
                    : 'bg-charcoal-800 text-muted hover:text-offwhite hover:bg-charcoal-700'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search trails, forts, lakes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-charcoal-800 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-offwhite focus:outline-none focus:border-acid"
            />
          </div>
        </div>

        {/* Hikes Grid */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-8 h-8 border-2 border-acid border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-bold text-muted">Loading Aravali trails...</p>
          </div>
        ) : filteredHikes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredHikes.map((hike) => (
              <TrekCard key={hike.id} hike={hike} />
            ))}
          </div>
        ) : (
          <div className="bg-charcoal-900 border border-white/10 rounded-3xl p-12 text-center max-w-lg mx-auto">
            <Compass className="w-12 h-12 text-acid mx-auto mb-4" />
            <h3 className="font-display font-black text-xl text-offwhite mb-2">
              No matching trails found
            </h3>
            <p className="text-muted text-xs mb-6">
              Try adjusting your difficulty filter or search term.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedDifficulty('All');
                setSearchQuery('');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}

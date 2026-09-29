import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Compass, MapPin, Clock, Camera, Sparkles, Mountain, Sun, Sunset, Trees, Eye } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Badge from '../components/ui/Badge';
import { getExploreJaipur } from '../lib/api';

export default function ExploreJaipurPage() {
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadExplore() {
      setLoading(true);
      try {
        const res = await getExploreJaipur();
        if (res.data) setItems(res.data);
      } catch (err) {
        console.error('Failed to load explore items:', err);
      } finally {
        setLoading(false);
      }
    }
    loadExplore();
  }, []);

  const categories = [
    { label: 'All', icon: Sparkles },
    { label: 'Hiking', icon: Mountain },
    { label: 'Forts', icon: Compass },
    { label: 'Sunrise', icon: Sun },
    { label: 'Sunset', icon: Sunset },
    { label: 'Nature', icon: Trees },
    { label: 'Hidden Spots', icon: Eye },
  ];

  const filteredItems = selectedCategory === 'All'
    ? items
    : items.filter((item) => item.category?.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <Layout>
      <Head>
        <title>Explore Jaipur — OnlyHikes.in Adventure Guide</title>
        <meta name="description" content="Discover secret Aravali ridges, hidden stepwells, and sunrise vantage points across Jaipur." />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <Badge variant="acid" size="sm" className="mb-3">
            LOCAL SECRET GUIDE
          </Badge>
          <h1 className="font-display font-black text-4xl sm:text-6xl text-offwhite tracking-tight">
            JAIPUR HAS MORE TO OFFER.
          </h1>
          <p className="text-muted text-sm sm:text-base mt-3 leading-relaxed">
            The Pink City is surrounded by ancient Aravali spurs, forgotten stepwells, and sunrise bastions. Curated by Jaipur college adventurers for weekend explorations.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const active = selectedCategory === cat.label;
            return (
              <button
                key={cat.label}
                onClick={() => setSelectedCategory(cat.label)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shrink-0 transition ${
                  active
                    ? 'bg-acid text-charcoal-950 font-black shadow-acid-sm'
                    : 'bg-charcoal-850 text-muted hover:text-offwhite hover:bg-charcoal-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Cards Grid */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-8 h-8 border-2 border-acid border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-bold text-muted">Loading Jaipur trail spots...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group bg-charcoal-900 border border-white/10 rounded-3xl overflow-hidden hover:border-acid/40 transition flex flex-col"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-charcoal-800">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant="acid" size="xs">
                      {item.category}
                    </Badge>
                  </div>
                  {item.difficulty && (
                    <div className="absolute top-4 right-4">
                      <Badge variant="charcoal" size="xs">
                        {item.difficulty}
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-1.5 text-xs text-acid font-bold mb-2">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>{item.location}</span>
                  </div>

                  <h3 className="font-display font-black text-xl text-offwhite group-hover:text-acid transition-colors mb-2">
                    {item.title}
                  </h3>

                  <p className="text-muted text-xs leading-relaxed mb-4">
                    {item.description}
                  </p>

                  <div className="mt-auto pt-4 border-t border-white/10 space-y-2 text-xs">
                    {item.best_time && (
                      <div className="flex items-center gap-2 text-muted">
                        <Clock className="w-3.5 h-3.5 text-muted" />
                        <span>Best time: <strong className="text-offwhite">{item.best_time}</strong></span>
                      </div>
                    )}
                    {item.tips && (
                      <div className="p-3 bg-charcoal-850 rounded-xl text-[11px] text-muted italic">
                        💡 <strong>Pro-tip:</strong> {item.tips}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

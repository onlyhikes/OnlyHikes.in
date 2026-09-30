import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Users,
  Instagram,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Award,
  ArrowUpRight,
  Heart,
  Camera,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

export default function CommunityPage() {
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://www.instagram.com/onlyhikes.in/';
  const instagramHandle = process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || '@onlyhikes.in';
  const whatsappUrl = process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL || 'https://whatsapp.com/channel/0029VbEaykELY6d6Jr9wht27';

  const colleges = [
    'MNIT Jaipur',
    'Manipal University Jaipur (MUJ)',
    'Amity University Jaipur',
    'JECRC Foundation',
    'Poornima University',
    'University of Rajasthan (RU)',
    'SKIT Jaipur',
    'LNMIIT'
  ];

  const guidelines = [
    {
      title: 'Zero Tolerance Policy',
      desc: 'Strictly zero alcohol, smoking, or illegal substances during treks. Safety of every student is paramount.',
      icon: ShieldCheck
    },
    {
      title: 'Leave No Trace',
      desc: 'We pack out everything we bring in. Keeping the Aravali ridges and water catchment zones plastic-free.',
      icon: Heart
    },
    {
      title: 'The Buddy Rule',
      desc: 'No hiker gets left behind. Whether you are sprinting or taking in the sunrise slowly, coordinators stay with you.',
      icon: Users
    },
    {
      title: 'Student Exclusive',
      desc: 'All batches consist exclusively of young adults and college students with valid IDs for a fun, energetic vibe.',
      icon: Award
    }
  ];

  const gallery = [
    {
      title: 'Nahargarh Ridge Sunrise',
      location: 'Charan Mandir Trail',
      img: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Bhangarh Night Trek',
      location: 'Alwar Aravali Pass',
      img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Hathni Kund Canyon',
      location: 'Garh Ganesh Valley',
      img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Chour Ghati Secret Pass',
      location: 'Galta Ji Ridges',
      img: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <Layout>
      <Head>
        <title>Community & Socials | OnlyHikes.in Jaipur</title>
        <meta
          name="description"
          content="Join the OnlyHikes Jaipur student adventure community on Instagram and WhatsApp. Aravalis hiking, campus ambassadors, and weekend resets."
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-28">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="acid" size="sm" className="mb-4">
            JAIPUR STUDENT TRIBE
          </Badge>
          <h1 className="font-display font-black text-4xl sm:text-6xl text-offwhite tracking-tight">
            CONNECT WITH THE ONLYHIKES TRIBE
          </h1>
          <p className="text-muted text-sm sm:text-base mt-4 leading-relaxed">
            We are more than just weekend treks. OnlyHikes brings together college adventurers from across Jaipur to disconnect from screens, conquer Aravali peaks, and create lifelong memories.
          </p>
        </div>

        {/* Primary Social Cards: Instagram & WhatsApp */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {/* Instagram Card */}
          <div className="bg-gradient-to-br from-charcoal-900 to-charcoal-850 border border-white/10 hover:border-acid/40 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between group transition-all duration-300">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-pink-500/10 via-purple-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                  <Instagram className="w-7 h-7" />
                </div>
                <Badge variant="charcoal" size="xs">
                  Official Instagram
                </Badge>
              </div>

              <span className="text-xs font-bold text-pink-400 uppercase tracking-widest">
                Daily Stories & Reels
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-offwhite mt-1">
                {instagramHandle}
              </h2>
              <p className="text-muted text-xs sm:text-sm mt-3 leading-relaxed">
                Follow our official page for trek highlights, student tags, upcoming weekend trail reveals, sunrise reels, and coordinator takeovers.
              </p>
            </div>

            <div className="pt-8 mt-6 border-t border-white/10">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white font-black text-xs uppercase tracking-wider hover:opacity-95 transition shadow-lg"
              >
                <span>Follow on Instagram</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* WhatsApp Community Card */}
          <div className="bg-gradient-to-br from-charcoal-900 to-charcoal-850 border border-white/10 hover:border-emerald-500/40 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between group transition-all duration-300">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center text-charcoal-950 shadow-lg">
                  <MessageSquare className="w-7 h-7" />
                </div>
                <Badge variant="success" size="xs">
                  Instant Updates
                </Badge>
              </div>

              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                Student Chat & Coordination
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-offwhite mt-1">
                WhatsApp Community
              </h2>
              <p className="text-muted text-xs sm:text-sm mt-3 leading-relaxed">
                Get direct access to trek coordinators, bus pickup schedules, weather updates, live photo drop links, and priority seat alerts.
              </p>
            </div>

            <div className="pt-8 mt-6 border-t border-white/10">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl bg-emerald-500 text-charcoal-950 font-black text-xs uppercase tracking-wider hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20"
              >
                <span>Join WhatsApp Tribe</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Participating Colleges Banner */}
        <div className="bg-charcoal-900 border border-white/10 rounded-3xl p-8 mb-20">
          <div className="text-center mb-6">
            <span className="text-acid text-xs font-black uppercase tracking-widest">
              CAMPUS FOOTPRINT
            </span>
            <h3 className="font-display font-black text-xl sm:text-2xl text-offwhite mt-1">
              HIKERS FROM COLLEGES ACROSS JAIPUR
            </h3>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {colleges.map((c) => (
              <span
                key={c}
                className="px-4 py-2 bg-charcoal-850 border border-white/10 hover:border-acid/40 rounded-xl text-xs font-bold text-offwhite transition"
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* Community Guidelines */}
        <div className="mb-20">
          <div className="text-center max-w-xl mx-auto mb-12">
            <Badge variant="flame" size="sm" className="mb-2">
              CODE OF CONDUCT
            </Badge>
            <h3 className="font-display font-black text-3xl text-offwhite">
              HOW WE ROLL ON THE TRAILS
            </h3>
            <p className="text-muted text-xs sm:text-sm mt-2">
              Every hiker respects our core principles to make sure everyone feels safe, welcomed, and energized.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {guidelines.map((g) => {
              const Icon = g.icon;
              return (
                <div
                  key={g.title}
                  className="bg-charcoal-900 border border-white/10 p-6 rounded-3xl hover:border-acid/30 transition"
                >
                  <div className="w-10 h-10 rounded-xl bg-acid/15 text-acid flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-display font-black text-base text-offwhite mb-2">
                    {g.title}
                  </h4>
                  <p className="text-muted text-xs leading-relaxed">
                    {g.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trail Gallery */}
        <div className="mb-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-acid text-xs font-black uppercase tracking-widest">
                REAL JAIPUR EXPEDITIONS
              </span>
              <h3 className="font-display font-black text-2xl sm:text-3xl text-offwhite mt-1">
                COMMUNITY MOMENTS
              </h3>
            </div>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-acid hover:underline"
            >
              See more on Instagram <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {gallery.map((item) => (
              <div
                key={item.title}
                className="group relative rounded-3xl overflow-hidden bg-charcoal-900 border border-white/10 aspect-[4/5]"
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/20 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <div className="flex items-center gap-1 text-acid text-[10px] font-bold uppercase tracking-wider mb-1">
                    <MapPin className="w-3 h-3" />
                    <span>{item.location}</span>
                  </div>
                  <h4 className="font-display font-black text-base text-offwhite">
                    {item.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Join the Community Crew CTA */}
        <div className="bg-gradient-to-r from-charcoal-900 via-charcoal-850 to-charcoal-900 border border-emerald-500/30 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <Badge variant="success" size="xs" className="mb-3">
            DIRECT COMMUNITY LINE
          </Badge>
          <h3 className="font-display font-black text-2xl sm:text-4xl text-offwhite">
            WANT TO HIKE WITH THE CREW THIS SUNDAY?
          </h3>
          <p className="text-muted text-xs sm:text-sm max-w-xl mx-auto mt-3 mb-6">
            Get instant trail updates, meetup coordination, sunrise photo drops, and priority seat alerts in our student WhatsApp group.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="acid" size="md" className="uppercase font-black">
                Join Student WhatsApp Channel →
              </Button>
            </a>
            <Link href="/hikes">
              <Button variant="dark" size="md" className="uppercase font-bold">
                View Upcoming Hikes
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

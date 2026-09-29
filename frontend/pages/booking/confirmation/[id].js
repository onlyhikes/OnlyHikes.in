import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Users,
  MessageSquare,
  ArrowRight,
  Download,
  AlertCircle
} from 'lucide-react';
import Layout from '../../../components/layout/Layout';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { getBookingDetails } from '../../../lib/api';

export default function BookingConfirmationPage() {
  const router = useRouter();
  const { id } = router.query;
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function fetchBooking() {
      setLoading(true);
      try {
        const res = await getBookingDetails(id);
        if (res.data) setBooking(res.data);
      } catch (err) {
        console.error('Failed to load booking:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchBooking();
  }, [id]);

  useEffect(() => {
    // Dynamic import confetti to avoid SSR issues
    if (typeof window !== 'undefined' && booking) {
      import('canvas-confetti').then((confetti) => {
        confetti.default({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#CCFF00', '#FF5500', '#FFFFFF']
        });
      });
    }
  }, [booking]);

  if (loading) {
    return (
      <Layout>
        <div className="py-24 text-center">
          <div className="w-8 h-8 border-2 border-acid border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-bold text-muted">Retrieving booking ticket...</p>
        </div>
      </Layout>
    );
  }

  // Fallback demo ticket if id is newly generated
  const bookingData = booking || {
    booking_ref: id || 'OH-2026-9281',
    hike_title: 'NAHARGARH SUNRISE HIKE',
    hike_date: 'Sunday, 4 October 2026 · 5:30 AM',
    seats_count: 2,
    pickup_title: 'WTP / Gaurav Tower (Opposite World Trade Park)',
    pickup_time: '04:45 AM',
    total_amount: 548.00,
    payment_status: 'paid',
    student_name: 'Aarav Sharma',
    whatsapp_group_url: process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL || 'https://chat.whatsapp.com/demo-invite-jaipur-wild'
  };

  const isPaid = bookingData.payment_status === 'paid';

  return (
    <Layout>
      <Head>
        <title>Booking {isPaid ? 'Confirmed' : 'Registered'} — {bookingData.booking_ref} | OnlyHikes.in</title>
      </Head>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 pb-24">
        {/* Status Card */}
        <div className="bg-charcoal-900 border border-white/10 rounded-3xl p-6 sm:p-10 text-center shadow-2xl relative overflow-hidden">
          {/* Top celebratory bar */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-acid via-flame to-acid" />

          {/* Success Icon */}
          <div className={`w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center shadow-xl ${
            isPaid ? 'bg-acid/20 text-acid border border-acid/40 shadow-acid-sm' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
          }`}>
            {isPaid ? <CheckCircle2 className="w-9 h-9" /> : <Clock className="w-9 h-9" />}
          </div>

          <span className="text-xs font-black uppercase tracking-widest text-acid">
            {isPaid ? 'PACK YOUR BAGS, IT’S OFFICIAL' : 'RESERVATION RECORDED (PAYMENT PENDING)'}
          </span>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-offwhite tracking-tight mt-1 mb-2">
            {isPaid ? 'BOOKING CONFIRMED' : 'RESERVATION PENDING'}
          </h1>
          <p className="text-muted text-xs sm:text-sm max-w-md mx-auto mb-8">
            {isPaid
              ? 'Your seat on the OnlyHikes bus is locked in. See your squad on Sunday morning!'
              : 'Your booking has been created in the database. Payment gateway credentials must be configured to process real transactions.'}
          </p>

          {/* Ticket Card */}
          <div className="bg-charcoal-850 rounded-2xl border border-white/10 p-6 text-left space-y-4 mb-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] text-muted font-bold uppercase tracking-wider block">Booking Reference ID</span>
                <span className="font-display font-black text-lg text-acid">{bookingData.booking_ref}</span>
              </div>
              <Badge variant={isPaid ? 'success' : 'warning'} size="sm">
                Status: {bookingData.payment_status}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] text-muted font-bold uppercase tracking-wider block">Trek</span>
                <span className="font-bold text-offwhite text-sm">{bookingData.hike_title || bookingData.hikes?.title}</span>
              </div>

              <div>
                <span className="text-[10px] text-muted font-bold uppercase tracking-wider block">Date & Time</span>
                <span className="font-bold text-offwhite">{bookingData.hike_date || bookingData.hikes?.time || 'Sunday · 5:30 AM'}</span>
              </div>

              <div>
                <span className="text-[10px] text-muted font-bold uppercase tracking-wider block">Seats Reserved</span>
                <span className="font-bold text-offwhite">{bookingData.seats_count} Student {bookingData.seats_count === 1 ? 'Pass' : 'Passes'}</span>
              </div>

              <div>
                <span className="text-[10px] text-muted font-bold uppercase tracking-wider block">Amount Paid</span>
                <span className="font-black text-acid text-sm">₹{bookingData.total_amount}</span>
              </div>

              <div className="sm:col-span-2">
                <span className="text-[10px] text-muted font-bold uppercase tracking-wider block">Pickup Point & Timing</span>
                <span className="font-bold text-offwhite flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-acid shrink-0" />
                  {bookingData.pickup_title || 'WTP Malviya Nagar Bus Bay'}
                </span>
              </div>
            </div>
          </div>

          {/* Configurable WhatsApp Group CTA */}
          <div className="space-y-4">
            <a
              href={bookingData.whatsapp_group_url || 'https://chat.whatsapp.com/demo-invite-jaipur-wild'}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-charcoal-950 font-black text-sm uppercase tracking-wide py-4 px-6 rounded-2xl shadow-xl transition-all"
            >
              <MessageSquare className="w-5 h-5" />
              <span>JOIN SQUAD WHATSAPP GROUP</span>
            </a>
            <p className="text-[11px] text-muted">
              Coordination instructions, bus live tracking link, and emergency marshals are shared in this group.
            </p>
          </div>

          {/* Secondary Actions */}
          <div className="pt-8 mt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/account" className="w-full sm:w-auto">
              <Button variant="dark" size="sm" className="w-full sm:w-auto">
                View in My Account
              </Button>
            </Link>
            <Link href="/hikes" className="w-full sm:w-auto">
              <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                Explore More Trails →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Users,
  Bus,
  Tag,
  CreditCard,
  ShieldAlert,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
  Lock
} from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import {
  getHikeDetails,
  createBooking,
  validateCoupon,
  getPaymentConfig,
  createPaymentOrder,
  verifyPayment
} from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export default function BookingFlowPage() {
  const router = useRouter();
  const { id, pickup } = router.query;
  const { user } = useAuth();

  const [hike, setHike] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [seats, setSeats] = useState(1);
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentCollege, setStudentCollege] = useState('');
  const [selectedPickup, setSelectedPickup] = useState(pickup || '');

  // Coupon State
  const [couponCode, setCouponCode] = useState('ONLYHIKES50');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  // Gateway Config State
  const [gatewayConfig, setGatewayConfig] = useState(null);
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [paymentNotice, setPaymentNotice] = useState(null);

  // Pre-fill student info if user is logged in
  useEffect(() => {
    if (user) {
      setStudentName(user.full_name || '');
      setStudentEmail(user.email || '');
      setStudentPhone(user.phone || '');
      setStudentCollege(user.college || '');
    }
  }, [user]);

  // Load Hike & Gateway config
  useEffect(() => {
    if (!id) return;
    async function init() {
      setLoading(true);
      try {
        const [hikeRes, gwRes] = await Promise.all([
          getHikeDetails(id),
          getPaymentConfig()
        ]);

        if (hikeRes.data) {
          setHike(hikeRes.data);
          if (pickup) {
            setSelectedPickup(pickup);
          } else if (hikeRes.data.pickup_locations?.length > 0) {
            setSelectedPickup(hikeRes.data.pickup_locations[0].id);
          }
        }

        if (gwRes.data) {
          setGatewayConfig(gwRes.data);
        }
      } catch (err) {
        console.error('Booking init error:', err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [id, pickup]);

  // Handle Apply Coupon (Strict Server-Side Validation)
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setValidatingCoupon(true);
    setCouponError(null);

    const originalAmount = (hike?.price || 299) * seats;
    try {
      const res = await validateCoupon(couponCode.trim(), originalAmount, hike?.id);
      if (res.success && res.data?.valid) {
        setAppliedCoupon(res.data);
        setCouponError(null);
      } else {
        setAppliedCoupon(null);
        setCouponError(res.message || 'Invalid coupon code');
      }
    } catch (e) {
      setAppliedCoupon(null);
      setCouponError(e.message || 'Coupon verification failed');
    } finally {
      setValidatingCoupon(false);
    }
  };

  // Recalculate price
  const basePrice = hike ? Number(hike.price) : 299;
  const originalTotal = basePrice * seats;
  const discountTotal = appliedCoupon ? Number(appliedCoupon.discountAmount) : 0;
  const finalTotal = Math.max(0, originalTotal - discountTotal);

  // Available seats calculation
  const remainingSeats = hike ? Math.max(0, (hike.total_seats || 25) - (hike.booked_seats || 0)) : 0;

  // Handle Submit Booking
  const handleProceedToPayment = async (e) => {
    e.preventDefault();
    if (!studentName || !studentEmail || !studentPhone) {
      setBookingError('Please fill in your name, email, and mobile number.');
      return;
    }

    if (seats > remainingSeats) {
      setBookingError(`Only ${remainingSeats} seats available for this hike.`);
      return;
    }

    setSubmittingBooking(true);
    setBookingError(null);
    setPaymentNotice(null);

    try {
      // 1. Create booking in database/store with status "pending"
      const bookingPayload = {
        hike_id: hike.id,
        student_name: studentName,
        student_email: studentEmail,
        student_phone: studentPhone,
        student_college: studentCollege || 'Jaipur College Student',
        seats_count: seats,
        pickup_location_id: selectedPickup || null,
        coupon_code: appliedCoupon ? appliedCoupon.code : null,
      };

      const bookingRes = await createBooking(bookingPayload);
      if (!bookingRes.success || !bookingRes.data) {
        throw new Error(bookingRes.message || 'Failed to create booking.');
      }

      const createdBooking = bookingRes.data;

      // 2. Request Payment Gateway Order
      const paymentRes = await createPaymentOrder(createdBooking.id || createdBooking.booking_ref);

      // Rule: Do NOT fake payment success!
      // If payment gateway is not configured yet, present the exact specified message
      if (!paymentRes.success) {
        setPaymentNotice({
          configured: false,
          bookingRef: createdBooking.booking_ref,
          bookingId: createdBooking.id,
          message: paymentRes.message || 'Payment gateway is not configured yet.',
          details: 'In accordance with system specifications, bookings are never marked as paid without real gateway verification.'
        });
        return;
      }

      // If sandbox simulation is explicitly enabled for tests
      if (paymentRes.data?.isSandboxSimulation) {
        const verifyRes = await verifyPayment({
          booking_id: createdBooking.id,
          order_id: paymentRes.data.orderId,
          payment_id: `pay_sandbox_${Date.now()}`,
          signature: 'sandbox_test_signature'
        });

        if (verifyRes.success) {
          router.push(`/booking/confirmation/${createdBooking.booking_ref || createdBooking.id}`);
        }
      } else {
        // Real Razorpay gateway checkout integration
        const loadScript = () => new Promise((resolve) => {
          if (window.Razorpay) return resolve(true);
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });

        const loaded = await loadScript();
        if (!loaded) {
          throw new Error('Failed to load Razorpay payment gateway SDK.');
        }

        const options = {
          key: paymentRes.data.keyId,
          amount: paymentRes.data.amount,
          currency: paymentRes.data.currency || 'INR',
          name: 'OnlyHikes.in',
          description: `${hike.title} - ${seats} Student Pass(es)`,
          image: hike.poster_url,
          order_id: paymentRes.data.orderId,
          handler: async function (response) {
            setSubmittingBooking(true);
            try {
              const verifyRes = await verifyPayment({
                booking_id: createdBooking.id,
                order_id: response.razorpay_order_id,
                payment_id: response.razorpay_payment_id,
                signature: response.razorpay_signature
              });

              if (verifyRes.success) {
                router.push(`/booking/confirmation/${createdBooking.booking_ref || createdBooking.id}`);
              } else {
                setBookingError('Payment received but verification signature failed. Contact support.');
              }
            } catch (err) {
              setBookingError('Payment verification error: ' + err.message);
            } finally {
              setSubmittingBooking(false);
            }
          },
          prefill: {
            name: studentName,
            email: studentEmail,
            contact: studentPhone
          },
          theme: {
            color: '#CCFF00'
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      setBookingError(err.message || 'An error occurred during booking creation.');
    } finally {
      setSubmittingBooking(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="py-24 text-center">
          <div className="w-8 h-8 border-2 border-acid border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-bold text-muted">Preparing booking engine...</p>
        </div>
      </Layout>
    );
  }

  if (!hike) {
    return (
      <Layout>
        <div className="py-24 text-center">
          <h2 className="font-display font-black text-2xl text-offwhite mb-2">Hike Not Found</h2>
          <Link href="/hikes"><Button variant="acid" size="sm">Back to Hikes</Button></Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Book Seats: {hike.title} — OnlyHikes.in</title>
      </Head>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">
        {/* Step Indicator */}
        <div className="mb-8">
          <span className="text-acid text-xs font-black uppercase tracking-widest block mb-1">
            CONFIRM YOUR ADVENTURE
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-offwhite tracking-tight">
            BOOKING CHECKOUT
          </h1>
        </div>

        {/* Payment Gateway Unconfigured Notice Box (Specification Requirement) */}
        {paymentNotice && !paymentNotice.configured && (
          <div className="mb-8 bg-charcoal-900 border-2 border-amber-500/40 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-display font-black text-lg text-amber-400">
                    {paymentNotice.message}
                  </h3>
                  <Badge variant="warning" size="xs">Status: Pending</Badge>
                </div>
                <p className="text-muted text-xs leading-relaxed mb-4">
                  {paymentNotice.details} Your booking reservation (<strong className="text-offwhite">{paymentNotice.bookingRef}</strong>) has been securely registered in the system under status <strong className="text-amber-400">pending</strong>.
                </p>
                <div className="bg-charcoal-950 p-4 rounded-xl border border-white/5 text-[11px] text-muted space-y-1 mb-4 font-mono">
                  <p className="text-offwhite font-bold">To activate live transactions:</p>
                  <p>1. Add <span className="text-acid">RAZORPAY_KEY_ID</span> and <span className="text-acid">RAZORPAY_KEY_SECRET</span> to <span className="text-offwhite">backend/.env</span></p>
                  <p>2. Or set <span className="text-acid">ENABLE_SANDBOX_PAYMENT_SIMULATION=true</span> to test simulated checkout.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Link href={`/booking/confirmation/${paymentNotice.bookingRef}`}>
                    <Button variant="acid" size="sm">
                      View Pending Ticket Details →
                    </Button>
                  </Link>
                  <Link href="/hikes">
                    <Button variant="outline" size="sm">
                      Back to Hikes
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Booking Form */}
          <form onSubmit={handleProceedToPayment} className="lg:col-span-7 space-y-6">
            {/* 1. Hike Summary Banner */}
            <div className="bg-charcoal-900 border border-white/10 p-5 rounded-2xl flex items-center gap-4">
              <img
                src={hike.poster_url}
                alt={hike.title}
                className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white/10"
              />
              <div className="min-w-0">
                <span className="text-[10px] text-acid font-black uppercase tracking-wider block">
                  SELECTED HIKE
                </span>
                <h3 className="font-display font-black text-base text-offwhite truncate">
                  {hike.title}
                </h3>
                <p className="text-xs text-muted flex items-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-acid" /> {hike.time}
                </p>
              </div>
            </div>

            {/* 2. Seat Selector */}
            <div className="bg-charcoal-900 border border-white/10 p-6 rounded-3xl">
              <label className="block text-xs font-black uppercase tracking-wider text-offwhite mb-3">
                1. Select Number of Seats
              </label>

              <div className="flex items-center gap-4">
                <div className="flex items-center border border-white/15 bg-charcoal-800 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setSeats(Math.max(1, seats - 1))}
                    disabled={seats <= 1}
                    className="w-11 h-11 text-base font-bold text-offwhite hover:bg-white/10 disabled:opacity-40 transition"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-display font-black text-lg text-acid">
                    {seats}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSeats(Math.min(10, Math.min(remainingSeats, seats + 1)))}
                    disabled={seats >= remainingSeats || seats >= 10}
                    className="w-11 h-11 text-base font-bold text-offwhite hover:bg-white/10 disabled:opacity-40 transition"
                  >
                    +
                  </button>
                </div>

                <div className="text-xs text-muted">
                  <span className="text-offwhite font-bold">₹{basePrice}</span> per seat
                  <span className="block text-[11px] text-acid">
                    {remainingSeats} seats currently remaining
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Pickup Location Selector */}
            <div className="bg-charcoal-900 border border-white/10 p-6 rounded-3xl">
              <label className="block text-xs font-black uppercase tracking-wider text-offwhite mb-3">
                2. Choose Your Jaipur Pickup Point
              </label>

              <div className="space-y-2.5">
                {(hike.pickup_locations || []).map((loc) => (
                  <label
                    key={loc.id}
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
                      selectedPickup === loc.id
                        ? 'bg-acid/10 border-acid'
                        : 'bg-charcoal-850 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <input
                      type="radio"
                      name="pickupPoint"
                      value={loc.id}
                      checked={selectedPickup === loc.id}
                      onChange={() => setSelectedPickup(loc.id)}
                      className="mt-1 accent-acid"
                    />
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-offwhite">{loc.title}</span>
                        <span className="text-[11px] font-black text-acid">{loc.pickup_time}</span>
                      </div>
                      <p className="text-[11px] text-muted mt-0.5">{loc.landmark}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* 4. Student Information */}
            <div className="bg-charcoal-900 border border-white/10 p-6 rounded-3xl space-y-4">
              <label className="block text-xs font-black uppercase tracking-wider text-offwhite">
                3. Student Passenger Details
              </label>

              <div>
                <label className="block text-[11px] text-muted font-bold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full bg-charcoal-800 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-offwhite focus:outline-none focus:border-acid"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-muted font-bold mb-1">Student Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="student@college.ac.in"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    className="w-full bg-charcoal-800 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-offwhite focus:outline-none focus:border-acid"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-muted font-bold mb-1">WhatsApp / Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98290 12345"
                    value={studentPhone}
                    onChange={(e) => setStudentPhone(e.target.value)}
                    className="w-full bg-charcoal-800 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-offwhite focus:outline-none focus:border-acid"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-muted font-bold mb-1">College / University Name</label>
                <input
                  type="text"
                  placeholder="e.g. MNIT Jaipur / Manipal / JECRC"
                  value={studentCollege}
                  onChange={(e) => setStudentCollege(e.target.value)}
                  className="w-full bg-charcoal-800 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-offwhite focus:outline-none focus:border-acid"
                />
              </div>
            </div>

            {bookingError && (
              <div className="p-3 bg-red-950/70 border border-red-500/40 rounded-xl text-xs font-bold text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{bookingError}</span>
              </div>
            )}

            {/* Submit Action */}
            <Button
              type="submit"
              variant="acid"
              size="lg"
              disabled={submittingBooking || remainingSeats === 0}
              className="w-full uppercase font-black tracking-wide"
            >
              {submittingBooking ? 'Initiating Booking...' : `Proceed to Payment (₹${finalTotal}) →`}
            </Button>
          </form>

          {/* Right Column: Order Summary & Coupon */}
          <div className="lg:col-span-5 space-y-6">
            {/* Coupon Box */}
            <div className="bg-charcoal-900 border border-white/10 p-6 rounded-3xl">
              <label className="block text-xs font-black uppercase tracking-wider text-offwhite mb-3 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-acid" />
                Have a Promo Code?
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. ONLYHIKES50"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="flex-grow bg-charcoal-800 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs font-bold text-offwhite uppercase focus:outline-none focus:border-acid"
                />
                <Button
                  type="button"
                  variant="dark"
                  size="sm"
                  onClick={handleApplyCoupon}
                  disabled={validatingCoupon}
                  className="shrink-0"
                >
                  {validatingCoupon ? 'Checking...' : 'Apply'}
                </Button>
              </div>

              {appliedCoupon && (
                <div className="mt-3 p-3 bg-acid/10 border border-acid/30 rounded-xl flex items-center gap-2 text-xs font-bold text-acid">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{appliedCoupon.message} (-₹{appliedCoupon.discountAmount})</span>
                </div>
              )}

              {couponError && (
                <div className="mt-3 p-2.5 bg-red-950/60 border border-red-500/30 rounded-xl text-[11px] font-bold text-red-300">
                  {couponError}
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-muted">
                Demo code: <strong className="text-acid">ONLYHIKES50</strong> gives flat ₹50 off.
              </div>
            </div>

            {/* Order Price Breakdown */}
            <div className="bg-charcoal-900 border border-white/10 p-6 rounded-3xl">
              <h3 className="font-display font-black text-lg text-offwhite mb-4">
                ORDER BREAKDOWN
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-muted">
                  <span>Student Pass (₹{basePrice} × {seats})</span>
                  <span className="font-bold text-offwhite">₹{originalTotal}</span>
                </div>

                <div className="flex justify-between text-muted">
                  <span>AC Bus Transport (Round Trip)</span>
                  <span className="text-acid font-bold">INCLUDED</span>
                </div>

                <div className="flex justify-between text-muted">
                  <span>Trek Marshal Guiding & Food</span>
                  <span className="text-acid font-bold">INCLUDED</span>
                </div>

                {discountTotal > 0 && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Coupon Discount ({appliedCoupon?.code})</span>
                    <span>-₹{discountTotal}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
                  <span className="font-black text-sm uppercase tracking-wider text-offwhite">
                    Total Payable
                  </span>
                  <span className="font-display font-black text-2xl text-acid">
                    ₹{finalTotal}
                  </span>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="p-4 bg-charcoal-850 rounded-2xl border border-white/5 text-[11px] text-muted space-y-2">
              <div className="flex items-center gap-2 text-offwhite font-bold">
                <Lock className="w-3.5 h-3.5 text-acid" />
                <span>Strict Seat Verification</span>
              </div>
              <p>
                Seats are reserved atomically on the server to prevent overbooking. If gateway keys are not yet configured in `.env`, your ticket will be created in pending mode without charging you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

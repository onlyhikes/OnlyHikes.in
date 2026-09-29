// ====================================================================
// ONLYHIKES.IN — PAYMENT GATEWAY ABSTRACTION SERVICE
// Complies strictly with zero fake payment success rule
// ====================================================================

require('dotenv').config();

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
const ENABLE_SANDBOX_SIMULATION = process.env.ENABLE_SANDBOX_PAYMENT_SIMULATION === 'true';

class PaymentGatewayService {
  constructor() {
    this.isConfigured = Boolean(RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET);
    if (!this.isConfigured) {
      console.warn('[PaymentGateway] Razorpay credentials missing. Payment orders cannot complete without live keys.');
    }
  }

  /**
   * Status of the gateway configuration
   */
  getConfig() {
    return {
      configured: this.isConfigured,
      provider: 'Razorpay',
      keyId: RAZORPAY_KEY_ID || null,
      sandboxSimulationAllowed: ENABLE_SANDBOX_SIMULATION,
      message: this.isConfigured 
        ? 'Payment gateway is active and ready.' 
        : 'Payment gateway is not configured yet.'
    };
  }

  /**
   * Initiates a payment order
   */
  async createOrder({ bookingId, amount, currency = 'INR', customerEmail, customerPhone }) {
    if (!this.isConfigured && !ENABLE_SANDBOX_SIMULATION) {
      return {
        success: false,
        configured: false,
        status: 'pending',
        message: 'Payment gateway is not configured yet.',
        error: 'GATEWAY_CREDENTIALS_MISSING',
        requiredEnv: ['RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET']
      };
    }

    if (this.isConfigured) {
      // In production with real keys, make the Razorpay API call
      try {
        const authHeader = 'Basic ' + Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');
        const response = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader
          },
          body: JSON.stringify({
            amount: Math.round(amount * 100), // convert to paise
            currency,
            receipt: `rcpt_${bookingId}`,
            notes: { bookingId }
          })
        });

        const orderData = await response.json();
        if (!response.ok) {
          throw new Error(orderData.error?.description || 'Gateway order creation failed');
        }

        return {
          success: true,
          configured: true,
          orderId: orderData.id,
          amount: orderData.amount,
          currency: orderData.currency,
          keyId: RAZORPAY_KEY_ID,
          status: 'initiated'
        };
      } catch (err) {
        return {
          success: false,
          configured: true,
          status: 'failed',
          message: `Gateway error: ${err.message}`
        };
      }
    }

    // Explicit test sandbox simulation mode (only when explicitly enabled via env)
    if (ENABLE_SANDBOX_SIMULATION) {
      return {
        success: true,
        configured: false,
        isSandboxSimulation: true,
        orderId: `order_sandbox_${Date.now()}`,
        amount: Math.round(amount * 100),
        currency,
        status: 'initiated',
        message: 'Test Sandbox Simulation order created.'
      };
    }
  }

  /**
   * Verifies payment authenticity (signature)
   */
  verifyPaymentSignature({ orderId, paymentId, signature }) {
    if (!this.isConfigured) {
      if (ENABLE_SANDBOX_SIMULATION && orderId && orderId.startsWith('order_sandbox_')) {
        return { verified: true, isSandbox: true, paymentId };
      }
      return { 
        verified: false, 
        message: 'Payment gateway is not configured yet.' 
      };
    }

    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    const isValid = expectedSignature === signature;
    return {
      verified: isValid,
      paymentId,
      status: isValid ? 'paid' : 'failed'
    };
  }
}

module.exports = new PaymentGatewayService();

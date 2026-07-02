/**
 * Payment Routes - Razorpay integration
 */

import express from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { supabaseAdmin } from '../supabase.js';

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * POST /api/payments/create-order - Create Razorpay order
 */
router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    if (!amount) {
      return res.status(400).json({ error: 'Missing amount' });
    }

    // Create Razorpay order directly
      console.log("Amount received:", amount);
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount),
      currency,
      receipt: receipt || 'order_' + Date.now(),
      notes: {
        timestamp: new Date().toISOString(),
      },
    });

    res.json({
      success: true,
      id: razorpayOrder.id,
      amount,
      currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ success: false, error: 'Failed to create payment order', details: error.message });
  }
});

/**
 * POST /api/payments/verify - Verify Razorpay payment
 * This is called from the client after successful payment
 */
router.post('/verify', async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ error: 'Missing payment details' });
    }

    // Verify signature
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    // Update payment status in database
    const { data: payment, error: paymentError } = await supabaseAdmin
      .from('payments')
      .update({
        razorpay_payment_id: razorpayPaymentId,
        razorpay_signature: razorpaySignature,
        status: 'completed',
      })
      .eq('razorpay_order_id', razorpayOrderId)
      .select()
      .single();

    if (paymentError) throw paymentError;

    // Update order status
    const { error: orderError } = await supabaseAdmin
      .from('orders')
      .update({ status: 'confirmed' })
      .eq('id', payment.order_id);

    if (orderError) throw orderError;

    res.json({ success: true, message: 'Payment verified successfully' });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

/**
 * POST /api/payments/webhook - Razorpay webhook
 * Called by Razorpay when payment status changes
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const body = req.body.toString();

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== signature) {
      return res.status(400).json({ error: 'Invalid webhook signature' });
    }

    const event = JSON.parse(body);

    // Handle different payment events
    switch (event.event) {
      case 'payment.authorized':
        await handlePaymentAuthorized(event.payload.payment.entity);
        break;
      case 'payment.failed':
        await handlePaymentFailed(event.payload.payment.entity);
        break;
      case 'payment.captured':
        await handlePaymentCaptured(event.payload.payment.entity);
        break;
      case 'refund.created':
        await handleRefundCreated(event.payload.refund.entity);
        break;
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

/**
 * Handle payment authorized event
 */
async function handlePaymentAuthorized(payment) {
  const { order_id, id } = payment;

  const { error } = await supabaseAdmin
    .from('payments')
    .update({
      razorpay_payment_id: id,
      status: 'completed',
    })
    .eq('razorpay_order_id', order_id);

  if (error) console.error('Error updating payment:', error);
}

/**
 * Handle payment failed event
 */
async function handlePaymentFailed(payment) {
  const { order_id, id, error_description } = payment;

  const { error } = await supabaseAdmin
    .from('payments')
    .update({
      razorpay_payment_id: id,
      status: 'failed',
      error_message: error_description,
    })
    .eq('razorpay_order_id', order_id);

  if (error) console.error('Error updating failed payment:', error);
}

/**
 * Handle payment captured event
 */
async function handlePaymentCaptured(payment) {
  const { order_id, id } = payment;

  const { error } = await supabaseAdmin
    .from('payments')
    .update({
      razorpay_payment_id: id,
      status: 'completed',
    })
    .eq('razorpay_order_id', order_id);

  if (error) console.error('Error capturing payment:', error);
}

/**
 * Handle refund created event
 */
async function handleRefundCreated(refund) {
  const { payment_id } = refund;

  const { error } = await supabaseAdmin
    .from('payments')
    .update({ status: 'refunded' })
    .eq('razorpay_payment_id', payment_id);

  if (error) console.error('Error updating refund:', error);
}

export default router;

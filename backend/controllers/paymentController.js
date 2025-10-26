import axios from 'axios';
import { supabase } from '../config/supabase.js';

export const createPaymentOrder = async (req, res) => {
  try {
    const { amount, campaignId, campaignTitle, customerName, customerEmail, customerPhone } = req.body;
    
    // Get user ID from authenticated request - FIXED
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ 
        error: 'User not authenticated' 
      });
    }
    
    // Validate required fields
    if (!amount || !campaignId || !customerEmail) {
      return res.status(400).json({ 
        error: 'Amount, campaign ID, and customer email are required' 
      });
    }

    // Generate unique order ID
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // ✅ STORE ORDER DETAILS IN DATABASE BEFORE CREATING CASHFREE ORDER
    const { data: orderTracking, error: trackingError } = await supabase
      .from('order_tracking')
      .insert([
        {
          order_id: orderId,
          campaign_id: campaignId,
          user_id: userId,
          amount: parseFloat(amount),
          status: 'pending',
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (trackingError) {
      console.error('Error storing order tracking:', trackingError);
      throw new Error('Failed to create payment order');
    }

    console.log('✅ Order tracking created:', orderTracking);
    
    // Prepare order data for Cashfree
    const orderData = {
      order_id: orderId,
      order_amount: parseFloat(amount).toFixed(2),
      order_currency: "INR",
      order_note: `Donation for ${campaignTitle || 'HopeForAll Campaign'}`,
      customer_details: {
        customer_id: `cust_${Date.now()}`,
        customer_name: customerName || 'Donor',
        customer_email: customerEmail,
        customer_phone: customerPhone || '9999999999',
      },
      order_meta: {
        return_url: process.env.PAYMENT_RETURN_URL || `http://localhost:5173/payment-success?order_id={order_id}`,
        notify_url: process.env.PAYMENT_NOTIFY_URL || "https://yummy-pens-clap.loca.lt/api/payment/webhook" // Webhook URL
      }
    };

    console.log('Creating Cashfree order:', orderData);

    const response = await axios.post(
      "https://sandbox.cashfree.com/pg/orders",
      orderData,
      {
        headers: {
          "x-client-id": process.env.CASHFREE_APP_ID,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY,
          "x-api-version": "2022-09-01",
          "Content-Type": "application/json",
        },
      }
    );

    console.log('Cashfree order created:', response.data);

    res.json({
      success: true,
      orderId: response.data.order_id,
      paymentSessionId: response.data.payment_session_id,
      orderAmount: response.data.order_amount
    });

  } catch (error) {
    console.error('Payment order creation error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to create payment order',
      details: error.response?.data?.message || error.message
    });
  }
};

// Enhanced webhook handler
export const paymentWebhook = async (req, res) => {
  try {
    console.log('=== WEBHOOK HIT ===');
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    
    // ✅ Parse the raw buffer body
    const rawBody = req.body.toString();
    let webhookData;
    
    try {
      webhookData = JSON.parse(rawBody);
      console.log('Webhook type:', webhookData.type);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return res.status(200).json({ received: true, status: 'JSON parse error' });
    }

    // ✅ Handle test webhooks (from Cashfree dashboard)
    if (webhookData.data && webhookData.data.test_object) {
      console.log('✅ Test webhook received - responding successfully');
      return res.status(200).json({ 
        received: true, 
        status: 'Test webhook processed successfully'
      });
    }


    // ✅ Handle actual payment webhooks - EXTRACT DATA FROM NEW STRUCTURE
// In your paymentWebhook function, update this part:
if ((webhookData.type === 'PAYMENT_CHARGES_WEBHOOK' || webhookData.type === 'PAYMENT_SUCCESS_WEBHOOK') && webhookData.data) {
  const orderId = webhookData.data.order?.order_id;
  const orderAmount = webhookData.data.order?.order_amount;
  const paymentStatus = webhookData.data.payment?.payment_status;
  const referenceId = webhookData.data.payment?.cf_payment_id;
  const paymentMode = webhookData.data.payment?.payment_group;
  const txTime = webhookData.data.payment?.payment_time;
  const txMsg = webhookData.data.payment?.payment_message;

  console.log('💰 PAYMENT WEBHOOK - Type:', webhookData.type, {
    orderId,
    orderAmount,
    paymentStatus,
    referenceId,
    paymentMode,
    txTime,
    txMsg
  });

  // ✅ Process successful payment
  if (paymentStatus === 'SUCCESS' && orderId) {
    console.log('✅ Processing successful payment for order:', orderId);
    
    try {
      const result = await handleSuccessfulPayment({
        orderId,
        orderAmount,
        referenceId: referenceId?.toString(),
        paymentMode,
        txTime,
        txMsg
      });
      
      if (result.alreadyProcessed) {
        console.log('🔄 Payment already processed, skipping duplicate');
      } else {
        console.log('🎉 Payment processed successfully!');
        console.log('💰 Campaign updated with amount:', result.updatedAmount);
      }
    } catch (error) {
      console.error('❌ Error processing payment:', error);
    }
  } else {
    console.log(`ℹ️ Payment status: ${paymentStatus} for order: ${orderId}`);
  }
} else {
  console.log('ℹ️ Other webhook type:', webhookData.type);
}

    res.status(200).json({ 
      received: true, 
      status: 'Webhook processed successfully',
      message: 'Payment recorded successfully'
    });
    
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(200).json({ 
      received: true, 
      status: 'Webhook received (processing error)',
      error: error.message 
    });
  }
};

// Verify payment with Cashfree
// Verify payment with Cashfree
const verifyPaymentWithCashfree = async (orderId) => {
  try {
    console.log('🔍 Verifying payment for order:', orderId);
    
    const response = await axios.get(
      `https://sandbox.cashfree.com/pg/orders/${orderId}/payments`,
      {
        headers: {
          "x-client-id": process.env.CASHFREE_APP_ID,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY,
          "x-api-version": "2022-09-01",
        },
      }
    );

    console.log('✅ Payment verification response:', response.data);

    // Get the latest payment attempt
    const payments = response.data;
    if (payments && payments.length > 0) {
      return payments[0]; // Return the latest payment
    }
    
    return { txStatus: 'PENDING' };
  } catch (error) {
    console.error('❌ Payment verification error:', error.response?.data || error.message);
    
    // Return a default status instead of throwing
    return { 
      txStatus: 'VERIFICATION_FAILED',
      error: error.response?.data?.message || error.message
    };
  }
};

// Handle successful payment with duplicate protection
const handleSuccessfulPayment = async (paymentData) => {
  try {
    const { orderId, orderAmount, referenceId, paymentMode, txTime, txMsg } = paymentData;

    console.log('✅ Processing successful payment for order:', orderId);

    // 1. First check if we already processed this payment using order_id
    const { data: existingDonation, error: checkError } = await supabase
      .from('donations')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (existingDonation) {
      console.log('🔄 Payment already processed for order:', orderId);
      return { alreadyProcessed: true };
    }

    // 2. Get campaign and user info from order_tracking
    const { data: orderTracking, error: trackingError } = await supabase
      .from('order_tracking')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (trackingError) {
      console.error('Error finding order tracking:', trackingError);
      throw trackingError;
    }

    // 3. Create donation record
    const donationData = {
      order_id: orderId,
      amount: parseFloat(orderAmount),
      status: 'completed',
      payment_method: paymentMode,
      transaction_id: referenceId?.toString(),
      transaction_message: txMsg,
      user_id: orderTracking.user_id,
      campaign_id: orderTracking.campaign_id,
      created_at: new Date().toISOString()
    };

    const { data: donation, error: donationError } = await supabase
      .from('donations')
      .insert([donationData])
      .select()
      .single();

    if (donationError) {
      console.error('Error creating donation record:', donationError);
      throw donationError;
    }

    console.log('✅ Donation created:', donation);

    // 4. Update campaign collected amount
    const updatedAmount = await updateCampaignCollectedAmount(orderTracking.campaign_id, parseFloat(orderAmount));

    // 5. Update order tracking status
    const { error: trackingUpdateError } = await supabase
      .from('order_tracking')
      .update({ 
        status: 'completed',
        payment_method: paymentMode,
        transaction_id: referenceId?.toString(),
        transaction_message: txMsg,
        updated_at: new Date().toISOString()
      })
      .eq('order_id', orderId);

    if (trackingUpdateError) {
      console.error('Error updating order tracking:', trackingUpdateError);
    }

    console.log('✅ Payment processed successfully for order:', orderId);
    console.log('💰 Campaign updated with new collected amount:', updatedAmount);
    
    return { success: true, donation, updatedAmount };

  } catch (error) {
    console.error('Error handling successful payment:', error);
    throw error;
  }
};

// Helper function to update campaign collected amount
// Helper function to update campaign collected amount
const updateCampaignCollectedAmount = async (campaignId, amount) => {
  try {
    console.log(`🔄 Updating campaign ${campaignId} collected amount by: ${amount}`);

    // First get current campaign details
    const { data: campaign, error } = await supabase
      .from('campaigns')
      .select('collected, goal, title')
      .eq('id', campaignId)
      .single();

    if (error) {
      console.error('Error finding campaign:', error);
      throw error;
    }

    const currentCollected = campaign.collected || 0;
    const newCollectedAmount = parseFloat(currentCollected) + parseFloat(amount);

    console.log(`📊 Campaign "${campaign.title}": ${currentCollected} + ${amount} = ${newCollectedAmount}`);

    // Update campaign collected amount
    const { error: updateError } = await supabase
      .from('campaigns')
      .update({ 
        collected: newCollectedAmount
      })
      .eq('id', campaignId);

    if (updateError) {
      console.error('Error updating campaign collected amount:', updateError);
      throw updateError;
    }

    console.log(`✅ Updated campaign ${campaignId} collected amount to: ${newCollectedAmount}`);
    
    return newCollectedAmount;
  } catch (error) {
    console.error('Error updating campaign collected amount:', error);
    throw error;
  }
};

// Helper function to get campaign ID from order (you need to store this when creating order)
const getCampaignIdFromOrder = async (orderId) => {
  try {
    const { data, error } = await supabase
      .from('order_tracking')
      .select('campaign_id')
      .eq('order_id', orderId)
      .single();

    if (error) throw error;
    return data.campaign_id;
  } catch (error) {
    console.error('Error getting campaign ID from order:', error);
    return null;
  }
};

// Helper function to get user ID from order (you need to store this when creating order)
const getUserIdFromOrder = async (orderId) => {
  try {
    const { data, error } = await supabase
      .from('order_tracking')
      .select('user_id')
      .eq('order_id', orderId)
      .single();

    if (error) throw error;
    return data.user_id;
  } catch (error) {
    console.error('Error getting user ID from order:', error);
    return null;
  }
};

// Optional: Send donation confirmation email
const sendDonationConfirmationEmail = async (paymentData) => {
  // Implement email sending logic here
  console.log('Sending donation confirmation email for:', paymentData.orderId);
};

export const getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const response = await axios.get(
      `https://sandbox.cashfree.com/pg/orders/${orderId}`,
      {
        headers: {
          "x-client-id": process.env.CASHFREE_APP_ID,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY,
          "x-api-version": "2022-09-01",
        },
      }
    );

    // Also get payment details
    const paymentResponse = await axios.get(
      `https://sandbox.cashfree.com/pg/orders/${orderId}/payments`,
      {
        headers: {
          "x-client-id": process.env.CASHFREE_APP_ID,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY,
          "x-api-version": "2022-09-01",
        },
      }
    );

    const orderData = response.data;
    const payments = paymentResponse.data;

    res.json({
      order: orderData,
      payments: payments,
      latestPayment: payments && payments.length > 0 ? payments[0] : null
    });

  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({ error: 'Failed to get payment status' });
  }
};
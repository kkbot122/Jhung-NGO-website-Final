import { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader, RefreshCw } from 'lucide-react';
import { paymentAPI, campaignAPI } from '../api/api.js';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState('loading');
  const [orderDetails, setOrderDetails] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const orderId = searchParams.get('order_id');

  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (!orderId) {
        setPaymentStatus('error');
        return;
      }

      try {
        const status = await paymentAPI.getPaymentStatus(orderId);
        setOrderDetails(status);
        
        if (status.latestPayment && status.latestPayment.txStatus === 'SUCCESS') {
          setPaymentStatus('success');
          // Refresh campaign data after successful payment
          await refreshCampaignData();
        } else {
          setPaymentStatus(status.order?.order_status === 'PAID' ? 'success' : 'error');
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        setPaymentStatus('error');
      }
    };

    checkPaymentStatus();
  }, [orderId]);

  const refreshCampaignData = async () => {
    try {
      setRefreshing(true);
      // This will trigger a refresh in parent components
      // You might want to use a context or state management solution
      console.log('Refreshing campaign data after payment...');
    } catch (error) {
      console.error('Error refreshing campaign data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md w-full text-center">
        {paymentStatus === 'loading' && (
          <>
            <Loader className="h-16 w-16 text-emerald-600 animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Processing Payment</h2>
            <p className="text-gray-600">Please wait while we confirm your payment...</p>
          </>
        )}

        {paymentStatus === 'success' && (
          <>
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for your generous donation! The campaign has been updated with your contribution.
            </p>
            {orderDetails && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm text-gray-600">
                  <strong>Order ID:</strong> {orderDetails.order?.order_id}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Amount:</strong> ₹{orderDetails.order?.order_amount}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Status:</strong> {orderDetails.order?.order_status}
                </p>
                {orderDetails.latestPayment && (
                  <p className="text-sm text-gray-600">
                    <strong>Payment Method:</strong> {orderDetails.latestPayment.paymentMethod}
                  </p>
                )}
              </div>
            )}
            <div className="flex gap-3">
              <Link
                to="/campaigns"
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Browse Campaigns
              </Link>
              <button
                onClick={handleRefresh}
                className="flex-1 px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition flex items-center justify-center gap-2"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>
          </>
        )}

        {paymentStatus === 'error' && (
          <>
            <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Failed</h2>
            <p className="text-gray-600 mb-6">
              We couldn't process your payment. Please try again or contact support if the issue persists.
            </p>
            <div className="flex gap-3">
              <Link
                to="/campaigns"
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Back to Campaigns
              </Link>
              <button
                onClick={() => window.history.back()}
                className="flex-1 px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition"
              >
                Try Again
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
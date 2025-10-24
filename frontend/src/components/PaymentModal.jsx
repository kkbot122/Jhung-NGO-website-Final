import { useState, useEffect } from 'react';
import { X, Loader, CreditCard, AlertCircle, RefreshCw } from 'lucide-react';
import { paymentAPI } from '../api/api.js';

const PaymentModal = ({ isOpen, onClose, campaign, donationAmount, user }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cashfreeLoaded, setCashfreeLoaded] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    let script = null;
    let timeoutId = null;

    const loadCashfreeSDK = () => {
      // Remove existing script if any
      const existingScript = document.querySelector('script[src*="cashfree"]');
      if (existingScript) {
        existingScript.remove();
      }

      script = document.createElement('script');
      script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
      script.async = true;
      
      script.onload = () => {
        console.log('✅ Cashfree SDK loaded successfully');
        if (window.Cashfree && typeof window.Cashfree === 'function') {
          setCashfreeLoaded(true);
          setError('');
        } else {
          console.error('Cashfree constructor not found');
          handleLoadError();
        }
      };
      
      script.onerror = () => {
        console.error('❌ Failed to load Cashfree SDK');
        handleLoadError();
      };

      document.head.appendChild(script);

      // Fallback timeout
      timeoutId = setTimeout(() => {
        if (!cashfreeLoaded) {
          console.log('Cashfree SDK loading timeout');
          handleLoadError();
        }
      }, 10000);
    };

    const handleLoadError = () => {
      setError(`Payment system failed to load. ${retryCount < 2 ? 'Retrying...' : 'Please refresh the page.'}`);
      if (retryCount < 2) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          loadCashfreeSDK();
        }, 2000);
      }
    };

    loadCashfreeSDK();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (script) script.remove();
    };
  }, [isOpen, retryCount]);

  const handlePayment = async () => {
    if (!donationAmount || donationAmount <= 0) {
      setError('Please enter a valid donation amount');
      return;
    }

    if (!cashfreeLoaded) {
      setError('Payment system is still loading. Please wait a moment.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create payment order
      const orderData = {
        amount: donationAmount,
        campaignId: campaign.id,
        campaignTitle: campaign.title,
        customerName: user?.name || 'Donor',
        customerEmail: user?.email,
        customerPhone: user?.mobile || '9999999999'
      };

      console.log('Creating payment order...');
      const result = await paymentAPI.createOrder(orderData);
      console.log('Order created:', result);

      // Check if Cashfree is available
      if (!window.Cashfree || typeof window.Cashfree !== 'function') {
        throw new Error('Payment system not available. Please refresh the page and try again.');
      }

      // Initialize Cashfree
      const cashfree = new window.Cashfree({ 
        mode: "sandbox" 
      });

      const paymentData = {
        paymentSessionId: result.paymentSessionId,
        redirectTarget: "_self",
      };

      console.log('Starting Cashfree checkout with:', paymentData);
      
      // Redirect to Cashfree payment page
      await cashfree.checkout(paymentData);

    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Failed to initiate payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const retryLoading = () => {
    setRetryCount(0);
    setError('');
    setCashfreeLoaded(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Complete Your Donation</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-6">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Campaign:</span>
              <span className="font-semibold text-gray-800">{campaign.title}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-600">Amount:</span>
              <span className="text-2xl font-bold text-emerald-700">₹{donationAmount}</span>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            You will be redirected to Cashfree's secure payment page to complete your donation.
          </p>

          {!cashfreeLoaded && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Loader className="h-4 w-4 text-yellow-600 animate-spin mr-2" />
                  <p className="text-yellow-800 text-sm">
                    {retryCount > 0 ? `Loading payment system... (Attempt ${retryCount + 1}/3)` : 'Loading payment system...'}
                  </p>
                </div>
                {retryCount > 0 && (
                  <button
                    onClick={retryLoading}
                    className="text-yellow-700 hover:text-yellow-800"
                  >
                    <RefreshCw size={16} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
              {error.includes('refresh') && (
                <button
                  onClick={() => window.location.reload()}
                  className="text-red-700 hover:text-red-800 text-sm font-medium"
                >
                  Refresh
                </button>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={loading || !cashfreeLoaded}
            className="flex-1 px-4 py-3 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard size={20} />
                Pay Now
              </>
            )}
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Secure payment powered by Cashfree
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
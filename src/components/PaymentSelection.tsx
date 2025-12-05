import { useState } from 'react';
import { ArrowLeft, CreditCard, Wallet, Building2, CheckCircle, DollarSign } from 'lucide-react';
import type { Order } from '../App';

interface PaymentSelectionProps {
  order: Order;
  onBack: () => void;
  onPaymentComplete: () => void;
  isDarkMode: boolean;
}

type PaymentMethod = 'wallet' | 'card' | 'bank' | null;

export function PaymentSelection({ order, onBack, onPaymentComplete, isDarkMode }: PaymentSelectionProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
      
      setTimeout(() => {
        onPaymentComplete();
      }, 2000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="text-white sticky top-0 z-10" style={{ background: 'linear-gradient(to right, #0A1E3E, #003D7A)' }}>
        <div className="flex items-center gap-4 p-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/20 rounded-xl transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1">
            <h1 className="mb-1">Collect Payment</h1>
            <p className="text-blue-100">{order.id}</p>
          </div>
        </div>

        {/* Amount Due */}
        <div className="px-4 pb-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
            <p className="text-blue-100 mb-2">Total Amount</p>
            <p className="text-4xl">₱{order.totalAmount.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {isComplete ? (
        <div className="p-4">
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
            <div className="bg-green-500 text-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle size={48} />
            </div>
            <h2 className="text-gray-800 mb-2">Payment Collected!</h2>
            <p className="text-gray-600 mb-6">Delivery completed successfully</p>
            
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Amount Received</span>
                <span className="text-gray-800">₱{order.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Payment Method</span>
                <span className="text-gray-800 capitalize">{selectedMethod}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Customer</span>
                <span className="text-gray-800">{order.customerName}</span>
              </div>
            </div>

            <div className="text-green-600">
              Redirecting to dashboard...
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4">
          {/* Payment Methods */}
          <div className="space-y-3 mb-6">
            <h2 className="text-gray-800 mb-4">Select Payment Method</h2>

            {/* Digital Wallets */}
            <button
              onClick={() => setSelectedMethod('wallet')}
              className={`w-full bg-white rounded-2xl p-4 shadow-sm text-left transition-all ${
                selectedMethod === 'wallet'
                  ? 'ring-2 ring-blue-600 shadow-md'
                  : 'hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-xl ${
                  selectedMethod === 'wallet'
                    ? 'bg-blue-600 text-white'
                    : 'bg-purple-100 text-purple-600'
                }`}>
                  <Wallet size={28} />
                </div>
                <div className="flex-1">
                  <p className="text-gray-800 mb-1">Digital Wallet</p>
                  <p className="text-gray-500">PayPal, Venmo, Apple Pay, Google Pay</p>
                </div>
                {selectedMethod === 'wallet' && (
                  <CheckCircle className="text-blue-600" size={24} />
                )}
              </div>
            </button>

            {/* Credit/Debit Card */}
            <button
              onClick={() => setSelectedMethod('card')}
              className={`w-full bg-white rounded-2xl p-4 shadow-sm text-left transition-all ${
                selectedMethod === 'card'
                  ? 'ring-2 ring-blue-600 shadow-md'
                  : 'hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-xl ${
                  selectedMethod === 'card'
                    ? 'bg-blue-600 text-white'
                    : 'bg-green-100 text-green-600'
                }`}>
                  <CreditCard size={28} />
                </div>
                <div className="flex-1">
                  <p className="text-gray-800 mb-1">Credit/Debit Card</p>
                  <p className="text-gray-500">Visa, Mastercard, Amex, Discover</p>
                </div>
                {selectedMethod === 'card' && (
                  <CheckCircle className="text-blue-600" size={24} />
                )}
              </div>
            </button>

            {/* Bank Transfer */}
            <button
              onClick={() => setSelectedMethod('bank')}
              className={`w-full bg-white rounded-2xl p-4 shadow-sm text-left transition-all ${
                selectedMethod === 'bank'
                  ? 'ring-2 ring-blue-600 shadow-md'
                  : 'hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-xl ${
                  selectedMethod === 'bank'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-100 text-blue-600'
                }`}>
                  <Building2 size={28} />
                </div>
                <div className="flex-1">
                  <p className="text-gray-800 mb-1">Bank Transfer</p>
                  <p className="text-gray-500">Direct bank account transfer</p>
                </div>
                {selectedMethod === 'bank' && (
                  <CheckCircle className="text-blue-600" size={24} />
                )}
              </div>
            </button>
          </div>

          {/* Payment Details based on method */}
          {selectedMethod && (
            <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
              <h3 className="text-gray-800 mb-4">Payment Details</h3>
              
              {selectedMethod === 'wallet' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <button className="border-2 border-gray-200 rounded-xl p-3 hover:border-blue-600 transition-colors">
                      <p className="text-gray-800">PayPal</p>
                    </button>
                    <button className="border-2 border-gray-200 rounded-xl p-3 hover:border-blue-600 transition-colors">
                      <p className="text-gray-800">Venmo</p>
                    </button>
                    <button className="border-2 border-gray-200 rounded-xl p-3 hover:border-blue-600 transition-colors">
                      <p className="text-gray-800">Apple Pay</p>
                    </button>
                    <button className="border-2 border-gray-200 rounded-xl p-3 hover:border-blue-600 transition-colors">
                      <p className="text-gray-800">Google Pay</p>
                    </button>
                  </div>
                </div>
              )}

              {selectedMethod === 'card' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-gray-600 mb-2">Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-600 mb-2">Expiry</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-2">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedMethod === 'bank' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-gray-600 mb-2">Account Number</label>
                    <input
                      type="text"
                      placeholder="Enter account number"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-2">Routing Number</label>
                    <input
                      type="text"
                      placeholder="Enter routing number"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Payment Summary */}
          {selectedMethod && (
            <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
              <h3 className="text-gray-800 mb-4">Payment Summary</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${order.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Service Fee</span>
                  <span>$0.00</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between">
                  <span className="text-gray-800">Total</span>
                  <span className="text-blue-600 text-xl">${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Confirm Button */}
          {selectedMethod && (
            <button
              onClick={handleConfirmPayment}
              disabled={isProcessing}
              className="w-full text-white py-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(to right, #E81E1E, #FF5A5F)', boxShadow: '0 10px 25px -5px rgba(232, 30, 30, 0.3)' }}
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Processing Payment...
                </>
              ) : (
                <>
                  <DollarSign size={24} />
                  Confirm Payment ₱{order.totalAmount.toFixed(2)}
                </>
              )}
            </button>
          )}

          {/* Instructions */}
          <div className="mt-6 bg-amber-50 border-2 border-amber-200 rounded-2xl p-4">
            <p className="text-amber-900 mb-2">Payment Collection Tips</p>
            <ul className="space-y-1 text-amber-800">
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">•</span>
                <span>Verify payment is received before completing delivery</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">•</span>
                <span>Always provide a receipt to the customer</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">•</span>
                <span>Report any payment issues to support immediately</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
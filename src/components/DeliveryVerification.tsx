import { useState } from 'react';
import { ArrowLeft, Hash, QrCode, CheckCircle, XCircle } from 'lucide-react';
import type { Order } from '../App';

interface DeliveryVerificationProps {
  order: Order;
  onBack: () => void;
  onVerified: () => void;
}

export function DeliveryVerification({ order, onBack, onVerified }: DeliveryVerificationProps) {
  const [method, setMethod] = useState<'otp' | 'qr'>('otp');
  const [otpInput, setOtpInput] = useState(['', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<'success' | 'error' | null>(null);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otpInput];
      newOtp[index] = value;
      setOtpInput(newOtp);

      // Auto-focus next input
      if (value && index < 3) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }

      // Auto-submit when all digits entered
      if (newOtp.every(digit => digit !== '') && index === 3) {
        handleVerifyOtp(newOtp.join(''));
      }
    }
  };

  const handleVerifyOtp = (otp: string) => {
    setIsVerifying(true);
    
    setTimeout(() => {
      setIsVerifying(false);
      if (otp === order.otp) {
        setVerificationResult('success');
        setTimeout(() => {
          onVerified();
        }, 1500);
      } else {
        setVerificationResult('error');
        setTimeout(() => {
          setVerificationResult(null);
          setOtpInput(['', '', '', '']);
        }, 2000);
      }
    }, 1000);
  };

  const handleQrScan = () => {
    setIsVerifying(true);
    
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationResult('success');
      setTimeout(() => {
        onVerified();
      }, 1500);
    }, 2000);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
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
            <h1 className="mb-1">Verify Delivery</h1>
            <p className="text-blue-100">Customer: {order.customerName}</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Method Selection */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <p className="text-gray-600 mb-3">Verification Method</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setMethod('otp')}
              className={`p-4 rounded-xl border-2 transition-all ${
                method === 'otp'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className={`p-3 rounded-xl ${method === 'otp' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                  <Hash size={24} />
                </div>
                <span className={method === 'otp' ? 'text-blue-600' : 'text-gray-600'}>OTP Code</span>
              </div>
            </button>
            
            <button
              onClick={() => setMethod('qr')}
              className={`p-4 rounded-xl border-2 transition-all ${
                method === 'qr'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className={`p-3 rounded-xl ${method === 'qr' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                  <QrCode size={24} />
                </div>
                <span className={method === 'qr' ? 'text-blue-600' : 'text-gray-600'}>QR Scan</span>
              </div>
            </button>
          </div>
        </div>

        {/* OTP Method */}
        {method === 'otp' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="text-center mb-6">
              <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Hash size={32} />
              </div>
              <h2 className="text-gray-800 mb-2">Enter OTP Code</h2>
              <p className="text-gray-600">Ask customer for their 4-digit OTP</p>
            </div>

            {verificationResult === 'success' ? (
              <div className="text-center space-y-4">
                <div className="bg-green-500 text-white w-24 h-24 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle size={48} />
                </div>
                <p className="text-green-600 text-xl">Verified Successfully!</p>
              </div>
            ) : verificationResult === 'error' ? (
              <div className="text-center space-y-4">
                <div className="bg-red-500 text-white w-24 h-24 rounded-full flex items-center justify-center mx-auto">
                  <XCircle size={48} />
                </div>
                <p className="text-red-600 text-xl">Invalid OTP Code</p>
                <p className="text-gray-600">Please try again</p>
              </div>
            ) : (
              <>
                <div className="flex gap-3 justify-center mb-6">
                  {otpInput.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      className="w-16 h-16 text-center text-2xl border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
                      disabled={isVerifying}
                    />
                  ))}
                </div>

                {isVerifying && (
                  <div className="text-center text-gray-600">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                    Verifying...
                  </div>
                )}

                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-gray-600 mb-2">Expected OTP (for testing)</p>
                  <p className="text-gray-800 text-2xl tracking-widest">{order.otp}</p>
                </div>
              </>
            )}
          </div>
        )}

        {/* QR Method */}
        {method === 'qr' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="text-center mb-6">
              <div className="bg-purple-100 text-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <QrCode size={32} />
              </div>
              <h2 className="text-gray-800 mb-2">Scan QR Code</h2>
              <p className="text-gray-600">Ask customer to show their QR code</p>
            </div>

            {verificationResult === 'success' ? (
              <div className="text-center space-y-4">
                <div className="bg-green-500 text-white w-24 h-24 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle size={48} />
                </div>
                <p className="text-green-600 text-xl">Verified Successfully!</p>
              </div>
            ) : isVerifying ? (
              <div className="text-center space-y-4">
                <div className="relative w-48 h-48 mx-auto">
                  <div className="absolute inset-0 border-4 border-purple-200 rounded-2xl"></div>
                  <div className="absolute inset-0 border-t-4 border-purple-600 rounded-2xl animate-spin"></div>
                  <QrCode className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-purple-600" size={64} />
                </div>
                <p className="text-gray-600">Scanning QR Code...</p>
              </div>
            ) : (
              <>
                <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl p-8 mb-6">
                  <div className="bg-white rounded-xl p-6 text-center">
                    <QrCode className="mx-auto text-purple-600 mb-4" size={96} />
                    <p className="text-gray-600">Camera viewfinder</p>
                  </div>
                </div>

                <button
                  onClick={handleQrScan}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Start QR Scanner
                </button>
              </>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
          <p className="text-blue-900 mb-3">Verification Tips</p>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Always verify with the customer before collecting payment</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Ensure the customer is present when verifying</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>If verification fails, contact support immediately</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
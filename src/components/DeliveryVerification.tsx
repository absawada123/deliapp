import { useState } from 'react';
import { ArrowLeft, Hash, QrCode, CheckCircle, XCircle, Key, Shield } from 'lucide-react';
import type { Order } from '../App';
import QRCode from 'react-qr-code';
import CryptoJS from 'crypto-js';

interface DeliveryVerificationProps {
  order: Order;
  onBack: () => void;
  onVerified: () => void;
  isDarkMode: boolean; // ✅ Added missing prop
}

const BARCODE_SECRET_KEY = import.meta.env.VITE_BARCODE_SECRET_KEY || 'delivery-rider-barcode-key-2025';

export function DeliveryVerification({ order, onBack, onVerified, isDarkMode }: DeliveryVerificationProps) {
  const [method, setMethod] = useState<'otp' | 'qr'>('otp');
  const [otpInput, setOtpInput] = useState(['', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<'success' | 'error' | null>(null);
  const [showPackageQR, setShowPackageQR] = useState(false);

  const decryptBarcode = (encryptedBarcode: string): string => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedBarcode, BARCODE_SECRET_KEY);
      return bytes.toString(CryptoJS.enc.Utf8) || encryptedBarcode;
    } catch (e) {
      console.warn('Decryption failed:', e);
      return encryptedBarcode;
    }
  };

  const isBarcodeEncrypted = (barcode: string): boolean => {
    return barcode.includes('U2FsdGVkX1') || (barcode.length > 20 && barcode.includes('='));
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otpInput];
      newOtp[index] = value;
      setOtpInput(newOtp);

      if (value && index < 3) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }

      if (newOtp.every(digit => digit !== '') && index === 3) {
        handleVerifyOtp(newOtp.join(''));
      }
    }
  };

  const handleVerifyOtp = (otp: string) => {
    setIsVerifying(true);
    setVerificationResult(null);

    setTimeout(() => {
      if (otp === order.otp) {
        setVerificationResult('success');
        setTimeout(() => onVerified(), 1500);
      } else {
        setVerificationResult('error');
        setTimeout(() => {
          setVerificationResult(null);
          setOtpInput(['', '', '', '']);
        }, 2000);
      }
      setIsVerifying(false);
    }, 1000);
  };

  const decryptedBarcode = isBarcodeEncrypted(order.barcode) 
    ? decryptBarcode(order.barcode) 
    : order.barcode;

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
            <p className="text-blue-100">Order: {order.id}</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Method Selection */}
        <div className={`rounded-2xl p-4 shadow-sm mb-6 ${
          isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
        }`}>
          <p className={`mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Verification Method</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setMethod('otp')}
              className={`p-4 rounded-xl border-2 transition-all ${
                method === 'otp'
                  ? 'border-blue-600 bg-blue-50'
                  : isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className={`p-3 rounded-xl ${
                  method === 'otp' ? 'bg-blue-600 text-white' : isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-600'
                }`}>
                  <Key size={24} />
                </div>
                <span className={method === 'otp' ? 'text-blue-600' : isDarkMode ? 'text-gray-300' : 'text-gray-600'}>OTP Code</span>
              </div>
            </button>
            
            <button
              onClick={() => setMethod('qr')}
              className={`p-4 rounded-xl border-2 transition-all ${
                method === 'qr'
                  ? 'border-blue-600 bg-blue-50'
                  : isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className={`p-3 rounded-xl ${
                  method === 'qr' ? 'bg-blue-600 text-white' : isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-600'
                }`}>
                  <QrCode size={24} />
                </div>
                <span className={method === 'qr' ? 'text-blue-600' : isDarkMode ? 'text-gray-300' : 'text-gray-600'}>QR Scan</span>
              </div>
            </button>
          </div>
        </div>

        {/* OTP Method */}
        {method === 'otp' && (
          <div className={`rounded-2xl p-6 shadow-sm ${
            isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
          }`}>
            <div className="text-center mb-6">
              <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Key size={32} />
              </div>
              <h2 className={`mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Enter OTP Code</h2>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Ask customer for their 4-digit OTP</p>
            </div>

            {verificationResult === 'success' ? (
              <div className="text-center space-y-4">
                <div className="bg-green-500 text-white w-24 h-24 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle size={48} />
                </div>
                <p className={`text-xl ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>Verified Successfully!</p>
              </div>
            ) : verificationResult === 'error' ? (
              <div className="text-center space-y-4">
                <div className="bg-red-500 text-white w-24 h-24 rounded-full flex items-center justify-center mx-auto">
                  <XCircle size={48} />
                </div>
                <p className={`text-xl ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>Invalid OTP Code</p>
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Please try again</p>
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
                      className={`w-16 h-16 text-center text-2xl border-2 rounded-xl focus:outline-none transition-colors ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500' 
                          : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'
                      }`}
                      disabled={isVerifying}
                    />
                  ))}
                </div>

                {isVerifying && (
                  <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Verifying...</p>
                  </div>
                )}

                <div className={`rounded-xl p-4 text-center ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Expected OTP (for testing)</p>
                  <p className={`text-2xl tracking-widest ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>{order.otp}</p>
                </div>
              </>
            )}
          </div>
        )}

        {/* QR Method */}
        {method === 'qr' && (
          <div className={`rounded-2xl p-6 shadow-sm ${
            isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
          }`}>
            <div className="text-center mb-6">
              <div className="bg-purple-100 text-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <QrCode size={32} />
              </div>
              <h2 className={`mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Package QR Code</h2>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Show this QR code to customer for scanning</p>
            </div>

            <div className={`rounded-xl p-6 mb-4 ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <div className="flex justify-center mb-4">
                <QRCode 
                  value={decryptedBarcode}
                  size={180}
                  bgColor={isDarkMode ? '#1F2937' : '#FFFFFF'}
                  fgColor={isDarkMode ? '#FFFFFF' : '#000000'}
                  level="H"
                />
              </div>
              <button
                onClick={() => setShowPackageQR(!showPackageQR)}
                className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors"
              >
                {showPackageQR ? 'Hide' : 'Show'} Package QR Details
              </button>
              
              {showPackageQR && (
                <div className="mt-4 p-3 rounded-lg bg-white/10">
                  <p className={`text-xs font-mono text-center ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {decryptedBarcode}
                  </p>
                </div>
              )}
            </div>

            <div className={`rounded-xl p-4 ${
              isDarkMode ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border-2 border-blue-200'
            }`}>
              <p className={`mb-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-900'}`}>Verification Process</p>
              <ul className={`space-y-1 text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>Customer scans this QR code with their app</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>System verifies encrypted barcode match</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>Delivery is automatically verified</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className={`mt-6 rounded-2xl p-4 ${
          isDarkMode ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border-2 border-blue-200'
        }`}>
          <p className={`mb-3 ${isDarkMode ? 'text-blue-300' : 'text-blue-900'}`}>Verification Tips</p>
          <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
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

import { useState } from 'react';
import { Phone, Lock, Moon, Sun, Fingerprint, ScanFace, ArrowLeft } from 'lucide-react';
import logoImage from 'figma:asset/0f2fa64a19949d00526906fea59d25e452183a5d.png';

interface LoginProps {
  onLogin: () => void;
  onToggleAuth: () => void;
}

export function Login({ onLogin, onToggleAuth }: LoginProps) {
  const [phone, setPhone] = useState('');
  const [mpin, setMpin] = useState('');
  const [showForgotMpin, setShowForgotMpin] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'selection' | 'mpin' | 'biometrics'>('selection');

  const handleMpinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mpin.length !== 4) return;
    setIsLoggingIn(true);
    setTimeout(() => onLogin(), 500);
  };

  const handleBiometricLogin = () => {
    setIsLoggingIn(true);
    setTimeout(() => onLogin(), 500);
  };

  const handleSelectMpin = () => {
    setLoginMethod('mpin');
  };

  const handleSelectBiometrics = () => {
    setLoginMethod('biometrics');
    handleBiometricLogin();
  };

  const handleBackToSelection = () => {
    setLoginMethod('selection');
    setMpin('');
  };

  if (showForgotMpin) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${
        isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-pink-200 via-peach-200 to-orange-200'
      }`} style={!isDarkMode ? { background: 'linear-gradient(135deg, #FFE5D4, #FFDAC1, #FFB88C)' } : undefined}>
        <button onClick={() => setIsDarkMode(!isDarkMode)} className="fixed top-4 right-4 p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors">
          {isDarkMode ? <Sun size={24} className="text-white" /> : <Moon size={24} className="text-white" />}
        </button>

        <div className={`rounded-3xl shadow-2xl w-full max-w-md p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="text-center mb-4">
            <img src={logoImage} alt="Rider" className="w-56 h-56 mx-auto mb-2 object-contain" />
            <h1 className={`mb-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Reset MPIN</h1>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Enter your registered mobile number</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); setShowForgotMpin(false); }} className="space-y-4">
            <div>
              <label className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Mobile Number</label>
              <div className="relative">
                <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} size={20} />
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+63 917 123 4567" className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500' : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'}`} required />
              </div>
            </div>

            <button type="submit" className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors">Send reset code</button>
            <button type="button" onClick={() => setShowForgotMpin(false)} className="w-full text-blue-600 py-2 hover:underline">Back to login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-pink-200 via-peach-200 to-orange-200'}`} style={!isDarkMode ? { background: 'linear-gradient(135deg, #FFE5D4, #FFDAC1, #FFB88C)' } : undefined}>
      <button onClick={() => setIsDarkMode(!isDarkMode)} className="fixed top-4 right-4 p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors z-50">
        {isDarkMode ? <Sun size={24} className="text-white" /> : <Moon size={24} className="text-white" />}
      </button>

      <div className={`rounded-3xl shadow-2xl w-full max-w-md p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="text-center mb-6">
          <img src={logoImage} alt="Delivery Rider Logo" className="w-64 h-64 mx-auto mb-2 object-contain" />
          <h1 className={`mb-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Rider Login</h1>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Choose how you want to log in</p>
        </div>

        {/* Show selection cards or MPIN form */}
        {loginMethod === 'selection' ? (
          <div className="space-y-4">
            {/* Biometrics Card */}
            <button
              type="button"
              onClick={handleSelectBiometrics}
              disabled={isLoggingIn}
              className={`w-full p-6 rounded-2xl border-2 transition-all ${
                isDarkMode
                  ? 'border-gray-700 hover:bg-gray-700'
                  : 'border-gray-200 hover:bg-gray-50'
              } flex flex-col items-center justify-center gap-3`}
            >
              <div className="flex gap-4">
                <Fingerprint className="text-blue-500" size={40} />
                <ScanFace className="text-blue-500" size={40} />
              </div>
              <div>
                <h2 className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Login with Biometrics</h2>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Use fingerprint or face ID</p>
              </div>
            </button>

            {/* MPIN Card */}
            <button
              type="button"
              onClick={handleSelectMpin}
              disabled={isLoggingIn}
              className={`w-full p-6 rounded-2xl border-2 transition-all ${
                isDarkMode
                  ? 'border-gray-700 hover:bg-gray-700'
                  : 'border-gray-200 hover:bg-gray-50'
              } flex flex-col items-center justify-center gap-3`}
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900">
                <Lock className="text-blue-600" size={24} />
              </div>
              <div>
                <h2 className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Login with MPIN</h2>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Enter your 4-digit PIN</p>
              </div>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleBackToSelection}
              className={`flex items-center gap-2 text-sm ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'}`}
            >
              <ArrowLeft size={16} />
              Back
            </button>

            <form onSubmit={handleMpinSubmit} className="space-y-4">
              <div>
                <label className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Mobile Number</label>
                <div className="relative">
                  <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} size={20} />
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+63 917 123 4567" className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500' : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'}`} required />
                </div>
              </div>

              <div>
                <label className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>4‑digit MPIN</label>
                <div className="relative">
                  <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} size={20} />
                  <input type="password" inputMode="numeric" pattern="\d*" maxLength={4} value={mpin} onChange={(e) => setMpin(e.target.value.replace(/\D/g, ''))} placeholder="••••" className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl tracking-[0.5em] text-center focus:outline-none transition-colors ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500' : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'}`} required />
                </div>
              </div>

              <div className="flex justify-end">
                <button type="button" onClick={() => setShowForgotMpin(true)} className="text-blue-600 hover:underline text-sm">Forgot MPIN?</button>
              </div>

              <button type="submit" disabled={isLoggingIn || phone.trim().length === 0 || mpin.length !== 4} className={`w-full py-3 rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 ${isLoggingIn || phone.trim().length === 0 || mpin.length !== 4 ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white`}>
                {isLoggingIn ? <><div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>Signing in...</> : 'Login with MPIN'}
              </button>
            </form>
          </div>
        )}

        {/* Sign up link - always at bottom */}
        <div className="pt-6 text-center">
          <button onClick={onToggleAuth} className="text-blue-600 hover:underline font-medium text-sm">
            Don't have an account? Sign up
          </button>
        </div>
      </div>
    </div>
  );
}

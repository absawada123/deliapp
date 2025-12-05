import { useState } from 'react';
import { Phone, Mail, Lock, Eye, EyeOff, Facebook, Chrome, Moon, Sun } from 'lucide-react';
import logoImage from 'figma:asset/0f2fa64a19949d00526906fea59d25e452183a5d.png';

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    
    // Show button loading state briefly before calling onLogin
    setTimeout(() => {
      onLogin();
    }, 500);
  };

  if (showForgotPassword) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
          : 'bg-gradient-to-br from-pink-200 via-peach-200 to-orange-200'
      }`} style={!isDarkMode ? { background: 'linear-gradient(135deg, #FFE5D4, #FFDAC1, #FFB88C)' } : undefined}>
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="fixed top-4 right-4 p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors"
        >
          {isDarkMode ? (
            <Sun size={24} className="text-white" />
          ) : (
            <Moon size={24} className="text-white" />
          )}
        </button>

        <div className={`rounded-3xl shadow-2xl w-full max-w-md p-6 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="text-center mb-4">
            <img 
              src={logoImage} 
              alt="Delivery Rider" 
              className="w-64 h-64 mx-auto mb-2 object-contain"
            />
            <h1 className={`mb-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Reset Password</h1>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Enter your phone number or email to reset your password</p>
          </div>
          
          <form onSubmit={(e) => { e.preventDefault(); setShowForgotPassword(false); }} className="space-y-4">
            <div>
              <label className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Phone Number or Email</label>
              <div className="relative">
                <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} size={20} />
                <input
                  type="text"
                  placeholder="Enter phone or email"
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500' 
                      : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'
                  }`}
                />
              </div>
            </div>
            
            <button
              type="submit"
              className={`w-full py-3 rounded-xl transition-colors ${
                isDarkMode 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Send Reset Link
            </button>
            
            <button
              type="button"
              onClick={() => setShowForgotPassword(false)}
              className="w-full text-blue-600 py-2 hover:underline"
            >
              Back to Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-pink-200 via-peach-200 to-orange-200'
    }`} style={!isDarkMode ? { background: 'linear-gradient(135deg, #FFE5D4, #FFDAC1, #FFB88C)' } : undefined}>
      {/* Dark Mode Toggle */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="fixed top-4 right-4 p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors z-50"
      >
        {isDarkMode ? (
          <Sun size={24} className="text-white" />
        ) : (
          <Moon size={24} className="text-white" />
        )}
      </button>

      <div className={`rounded-3xl shadow-2xl w-full max-w-md p-6 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="text-center mb-4">
          <img 
            src={logoImage} 
            alt="Delivery Rider Logo" 
            className="w-80 h-80 mx-auto mb-2 object-contain"
          />
          <h1 className={`mb-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Rider Login</h1>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Sign in to start your deliveries</p>
        </div>

        <div className={`flex gap-2 rounded-xl p-1 mb-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <button
            onClick={() => setLoginMethod('phone')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              loginMethod === 'phone' 
                ? isDarkMode 
                  ? 'bg-gray-600 shadow-sm text-blue-400' 
                  : 'bg-white shadow-sm text-blue-600'
                : isDarkMode 
                  ? 'text-gray-400' 
                  : 'text-gray-600'
            }`}
          >
            Phone
          </button>
          <button
            onClick={() => setLoginMethod('email')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              loginMethod === 'email' 
                ? isDarkMode 
                  ? 'bg-gray-600 shadow-sm text-blue-400' 
                  : 'bg-white shadow-sm text-blue-600'
                : isDarkMode 
                  ? 'text-gray-400' 
                  : 'text-gray-600'
            }`}
          >
            Email
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {loginMethod === 'phone' ? (
            <div>
              <label className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Phone Number</label>
              <div className="relative">
                <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} size={20} />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+63 917 123 4567"
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500' 
                      : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'
                  }`}
                  required
                />
              </div>
            </div>
          ) : (
            <div>
              <label className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email Address</label>
              <div className="relative">
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rider@example.com"
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500' 
                      : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'
                  }`}
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
            <div className="relative">
              <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500' 
                    : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-4 top-1/2 -translate-y-1/2 ${
                  isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-blue-600 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className={`w-full py-3 rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 ${
              isLoggingIn 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {isLoggingIn ? (
              <>
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className={`w-full border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}></div>
          </div>
          <div className="relative flex justify-center">
            <span className={`px-4 ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className={`flex items-center justify-center gap-2 border-2 py-3 rounded-xl hover:bg-opacity-50 transition-colors ${
            isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'
          }`}>
            <Chrome size={20} className="text-red-500" />
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Google</span>
          </button>
          <button className={`flex items-center justify-center gap-2 border-2 py-3 rounded-xl hover:bg-opacity-50 transition-colors ${
            isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'
          }`}>
            <Facebook size={20} className="text-blue-600" />
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Facebook</span>
          </button>
        </div>
      </div>
    </div>
  );
}
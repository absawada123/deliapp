import { useState } from 'react';
import { Phone, Mail, Lock, Eye, EyeOff, Fingerprint, ScanFace, Moon, Sun, Chrome, Facebook } from 'lucide-react';
import logoImage from 'figma:asset/0f2fa64a19949d00526906fea59d25e452183a5d.png';

interface SignupProps {
  onSignup: () => void;
  onToggleAuth: () => void;
}

export function Signup({ onSignup, onToggleAuth }: SignupProps) {
  const [signupMethod, setSignupMethod] = useState<'phone' | 'email'>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [mpin, setMpin] = useState('');
  const [confirmMpin, setConfirmMpin] = useState('');
  const [showMpin, setShowMpin] = useState(false);
  const [showConfirmMpin, setShowConfirmMpin] = useState(false);
  const [enableBiometrics, setEnableBiometrics] = useState(false);
  const [isSettingUp, setIsSettingUp] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    setIsSigningUp(true);
    setTimeout(() => {
      setIsSigningUp(false);
      setShowSetup(true); // Show MPIN/biometrics setup after account creation
    }, 500);
  };

  const handleSetup = (e: React.FormEvent) => {
    e.preventDefault();
    if (mpin.length !== 4) {
      alert('MPIN must be 4 digits');
      return;
    }
    if (mpin !== confirmMpin) {
      alert('MPINs do not match');
      return;
    }
    setIsSettingUp(true);
    setTimeout(() => onSignup(), 500);
  };

  if (showSetup) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${
        isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-pink-200 via-peach-200 to-orange-200'
      }`} style={!isDarkMode ? { background: 'linear-gradient(135deg, #FFE5D4, #FFDAC1, #FFB88C)' } : undefined}>
        <button onClick={() => setIsDarkMode(!isDarkMode)} className="fixed top-4 right-4 p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors z-50">
          {isDarkMode ? <Sun size={24} className="text-white" /> : <Moon size={24} className="text-white" />}
        </button>

        <div className={`rounded-3xl shadow-2xl w-full max-w-md p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="text-center mb-6">
            <img src={logoImage} alt="Delivery Rider Logo" className="w-64 h-64 mx-auto mb-2 object-contain" />
            <h1 className={`mb-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Set Up Security</h1>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Create your MPIN and enable biometrics</p>
          </div>

          <form onSubmit={handleSetup} className="space-y-4">
            <div>
              <label className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>4‑digit MPIN</label>
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} size={20} />
                <input type={showMpin ? 'text' : 'password'} inputMode="numeric" pattern="\d*" maxLength={4} value={mpin} onChange={(e) => setMpin(e.target.value.replace(/\D/g, ''))} placeholder="••••" className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl tracking-[0.5em] text-center focus:outline-none transition-colors ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500' : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'}`} required />
                <button type="button" onClick={() => setShowMpin(!showMpin)} className={`absolute right-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}>
                  {showMpin ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Confirm MPIN</label>
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} size={20} />
                <input type={showConfirmMpin ? 'text' : 'password'} inputMode="numeric" pattern="\d*" maxLength={4} value={confirmMpin} onChange={(e) => setConfirmMpin(e.target.value.replace(/\D/g, ''))} placeholder="••••" className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl tracking-[0.5em] text-center focus:outline-none transition-colors ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500' : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'}`} required />
                <button type="button" onClick={() => setShowConfirmMpin(!showConfirmMpin)} className={`absolute right-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}>
                  {showConfirmMpin ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className={`flex items-center justify-between p-4 rounded-xl border-2 ${isDarkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <Fingerprint className="text-blue-500" size={20} />
                  <ScanFace className="text-blue-500" size={20} />
                </div>
                <span className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Enable Biometrics</span>
              </div>
              <button
                type="button"
                onClick={() => setEnableBiometrics(!enableBiometrics)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enableBiometrics ? 'bg-blue-600' : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enableBiometrics ? 'translate-x-5' : 'translate-x-1'}`} />
              </button>
            </div>

            <button type="submit" disabled={isSettingUp} className={`w-full py-3 rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 ${isSettingUp ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white`}>
              {isSettingUp ? <><div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>Setting up...</> : 'Complete Setup'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-pink-200 via-peach-200 to-orange-200'
    }`} style={!isDarkMode ? { background: 'linear-gradient(135deg, #FFE5D4, #FFDAC1, #FFB88C)' } : undefined}>
      <button onClick={() => setIsDarkMode(!isDarkMode)} className="fixed top-4 right-4 p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors z-50">
        {isDarkMode ? <Sun size={24} className="text-white" /> : <Moon size={24} className="text-white" />}
      </button>

      <div className={`rounded-3xl shadow-2xl w-full max-w-md p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="text-center mb-4">
          <img src={logoImage} alt="Delivery Rider Logo" className="w-80 h-80 mx-auto mb-2 object-contain" />
          <h1 className={`mb-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Create Account</h1>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Sign up to become a rider</p>
        </div>

        <div className={`flex gap-2 rounded-xl p-1 mb-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <button onClick={() => setSignupMethod('phone')} className={`flex-1 py-2 rounded-lg transition-all ${
            signupMethod === 'phone' ? (isDarkMode ? 'bg-gray-600 shadow-sm text-blue-400' : 'bg-white shadow-sm text-blue-600') : (isDarkMode ? 'text-gray-400' : 'text-gray-600')
          }`}>Phone</button>
          <button onClick={() => setSignupMethod('email')} className={`flex-1 py-2 rounded-lg transition-all ${
            signupMethod === 'email' ? (isDarkMode ? 'bg-gray-600 shadow-sm text-blue-400' : 'bg-white shadow-sm text-blue-600') : (isDarkMode ? 'text-gray-400' : 'text-gray-600')
          }`}>Email</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {signupMethod === 'phone' ? (
            <div>
              <label className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Phone Number</label>
              <div className="relative">
                <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} size={20} />
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+63 917 123 4567" className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500' : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'}`} required />
              </div>
            </div>
          ) : (
            <div>
              <label className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email Address</label>
              <div className="relative">
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} size={20} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="rider@example.com" className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500' : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'}`} required />
              </div>
            </div>
          )}

          <div>
            <label className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
            <div className="relative">
              <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} size={20} />
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a strong password" className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none transition-colors ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500' : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'}`} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute right-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Confirm Password</label>
            <div className="relative">
              <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} size={20} />
              <input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm your password" className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none transition-colors ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500' : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'}`} required />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className={`absolute right-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}>
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={isSigningUp} className={`w-full py-3 rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 ${isSigningUp ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white`}>
            {isSigningUp ? <><div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>Creating account...</> : 'Create Account'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className={`w-full border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`} /></div>
          <div className="relative flex justify-center"><span className={`px-4 ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>Or sign up with</span></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className={`flex items-center justify-center gap-2 border-2 py-3 rounded-xl hover:bg-opacity-50 transition-colors ${isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'}`}>
            <Chrome size={20} className="text-red-500" />
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Google</span>
          </button>
          <button className={`flex items-center justify-center gap-2 border-2 py-3 rounded-xl hover:bg-opacity-50 transition-colors ${isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'}`}>
            <Facebook size={20} className="text-blue-600" />
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Facebook</span>
          </button>
        </div>

        <div className="pt-4 text-center">
          <button onClick={onToggleAuth} className="text-blue-600 hover:underline font-medium text-sm">
            Already have an account? Log in
          </button>
        </div>
      </div>
    </div>
  );
}

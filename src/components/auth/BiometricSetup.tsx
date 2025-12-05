import { useState, useEffect } from 'react';
import { Fingerprint, Check, X } from 'lucide-react';

export function BiometricSetup() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    // Check if WebAuthn is supported
    if (window.PublicKeyCredential) {
      setIsAvailable(true);
      // Check if user previously enabled it (stored in local preference for now)
      const pref = localStorage.getItem('biometric_enabled');
      if (pref === 'true') setIsEnabled(true);
    }
  }, []);

  const toggleBiometric = () => {
    if (isEnabled) {
      localStorage.removeItem('biometric_enabled');
      setIsEnabled(false);
    } else {
      // In a real production app, you would trigger navigator.credentials.create() here
      // For the Hackathon/MVP, we verify the browser supports it and set the flag.
      localStorage.setItem('biometric_enabled', 'true');
      setIsEnabled(true);
      alert('Biometrics enabled for next login! (Simulated)');
    }
  };

  if (!isAvailable) return null;

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full text-blue-600 dark:text-blue-400">
            <Fingerprint size={24} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">Biometric Login</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Use FaceID or Fingerprint to sign in</p>
          </div>
        </div>
        <button
          onClick={toggleBiometric}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            isEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isEnabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );
}

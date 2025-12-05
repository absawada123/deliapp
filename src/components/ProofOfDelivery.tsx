import { useState, useEffect } from 'react';
import { ArrowLeft, Camera, MapPin, Clock, CheckCircle, Upload, X, Image as ImageIcon } from 'lucide-react';
import type { Order } from '../App';

interface ProofOfDeliveryProps {
  order: Order;
  onBack: () => void;
  onComplete: () => void;
  isDarkMode: boolean;
}

export function ProofOfDelivery({ order, onBack, onComplete, isDarkMode }: ProofOfDeliveryProps) {
  const [photo, setPhoto] = useState<string | null>(null);
  const [timestamp, setTimestamp] = useState<string>('');
  const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [includeGPS, setIncludeGPS] = useState(true);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock GPS locations for Metro Manila
  const mockLocations = [
    { lat: 14.5995, lng: 120.9842, address: 'Makati City, Metro Manila' },
    { lat: 14.6091, lng: 121.0223, address: 'Mandaluyong City, Metro Manila' },
    { lat: 14.5764, lng: 121.0851, address: 'Pasig City, Metro Manila' },
    { lat: 14.6760, lng: 121.0437, address: 'Quezon City, Metro Manila' }
  ];

  useEffect(() => {
    // Set current timestamp
    const now = new Date();
    setTimestamp(now.toLocaleString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }));

    // Simulate getting GPS location
    if (includeGPS) {
      setTimeout(() => {
        const randomLocation = mockLocations[Math.floor(Math.random() * mockLocations.length)];
        setLocation(randomLocation);
      }, 1000);
    }
  }, [includeGPS]);

  const handleCapturePhoto = () => {
    setIsCapturing(true);
    
    // Simulate camera capture delay
    setTimeout(() => {
      // Create a placeholder photo (in real app, this would use device camera)
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 600;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Create a gradient background
        const gradient = ctx.createLinearGradient(0, 0, 800, 600);
        gradient.addColorStop(0, '#0A1E3E');
        gradient.addColorStop(1, '#003D7A');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 800, 600);
        
        // Add text
        ctx.fillStyle = 'white';
        ctx.font = 'bold 48px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Package Delivered', 400, 280);
        
        ctx.font = '32px sans-serif';
        ctx.fillText(order.id, 400, 340);
        
        ctx.font = '24px sans-serif';
        ctx.fillText(new Date().toLocaleString('en-PH'), 400, 380);
        
        // Convert to data URL
        const photoData = canvas.toDataURL('image/jpeg', 0.8);
        setPhoto(photoData);
      }
      
      setIsCapturing(false);
    }, 1500);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhoto(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!photo) {
      alert('Please capture or upload a photo first');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate upload delay
    setTimeout(() => {
      setIsSubmitting(false);
      onComplete();
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
            <h1 className="mb-1">Proof of Delivery</h1>
            <p className="text-blue-100">{order.id}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Instructions */}
        <div className={`rounded-2xl p-4 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-sm`}>
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <ImageIcon size={20} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className={isDarkMode ? 'text-gray-100' : 'text-gray-800'}>Required Documentation</h3>
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Capture a photo showing the delivered package at the delivery location
              </p>
            </div>
          </div>
        </div>

        {/* Photo Capture Section */}
        <div className={`rounded-2xl p-4 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-sm`}>
          <h3 className={`mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Delivery Photo</h3>
          
          {photo ? (
            <div className="relative">
              <img 
                src={photo} 
                alt="Proof of delivery" 
                className="w-full h-64 object-cover rounded-xl"
              />
              <button
                onClick={() => setPhoto(null)}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                onClick={handleCapturePhoto}
                disabled={isCapturing}
                className="w-full text-white py-4 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50"
                style={{ background: 'linear-gradient(to right, #E81E1E, #FF5A5F)' }}
              >
                <Camera size={24} />
                {isCapturing ? 'Capturing...' : 'Capture Photo'}
              </button>

              <div className="relative">
                <div className={`border-2 border-dashed rounded-xl p-8 text-center ${
                  isDarkMode ? 'border-gray-600' : 'border-gray-300'
                }`}>
                  <Upload size={48} className={`mx-auto mb-3 ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-400'
                  }`} />
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    Or upload from gallery
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <div className={`rounded-2xl p-4 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-sm`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <Clock size={20} className="text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className={isDarkMode ? 'text-gray-100' : 'text-gray-800'}>Timestamp</h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Automatically recorded
              </p>
            </div>
          </div>
          <div className={`rounded-xl p-3 ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <p className={`text-center ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              {timestamp || 'Waiting...'}
            </p>
          </div>
        </div>

        {/* GPS Location */}
        <div className={`rounded-2xl p-4 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-sm`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <MapPin size={20} className="text-purple-600" />
              </div>
              <div>
                <h3 className={isDarkMode ? 'text-gray-100' : 'text-gray-800'}>GPS Location</h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Optional verification
                </p>
              </div>
            </div>
            
            {/* Toggle GPS */}
            <label className="relative inline-block w-12 h-6 cursor-pointer">
              <input 
                type="checkbox" 
                checked={includeGPS}
                onChange={(e) => setIncludeGPS(e.target.checked)}
                className="sr-only peer" 
              />
              <div className="w-full h-full bg-gray-300 rounded-full peer-checked:bg-purple-600 transition-colors"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-6 transition-transform"></div>
            </label>
          </div>

          {includeGPS && location && (
            <div className={`rounded-xl p-3 ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <div className="flex items-start gap-2 mb-2">
                <MapPin size={16} className="text-purple-600 mt-1" />
                <div className="flex-1">
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {location.address}
                  </p>
                  <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <CheckCircle size={14} />
                <span>Location verified</span>
              </div>
            </div>
          )}

          {includeGPS && !location && (
            <div className={`rounded-xl p-3 text-center ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Getting location...
              </p>
            </div>
          )}
        </div>

        {/* Additional Notes */}
        <div className={`rounded-2xl p-4 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-sm`}>
          <h3 className={`mb-3 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
            Additional Notes (Optional)
          </h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g., Left with security guard, handed to recipient..."
            className={`w-full h-24 px-4 py-3 rounded-xl resize-none ${
              isDarkMode 
                ? 'bg-gray-700 text-gray-200 placeholder-gray-500 border-gray-600' 
                : 'bg-gray-50 text-gray-900 placeholder-gray-400 border-gray-200'
            } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>

        {/* Delivery Summary */}
        <div className={`rounded-2xl p-4 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-sm`}>
          <h3 className={`mb-3 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
            Delivery Summary
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Order ID</span>
              <span className={isDarkMode ? 'text-gray-200' : 'text-gray-800'}>{order.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Customer</span>
              <span className={isDarkMode ? 'text-gray-200' : 'text-gray-800'}>{order.customerName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Address</span>
              <span className={`text-right ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                {order.deliveryAddress.split(',')[0]}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Payment</span>
              <span className={isDarkMode ? 'text-gray-200' : 'text-gray-800'}>
                {order.paymentStatus === 'paid' ? 'Prepaid' : 'COD'}
              </span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!photo || isSubmitting}
          className="w-full text-white py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          style={{ background: 'linear-gradient(to right, #E81E1E, #FF5A5F)' }}
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Submitting...
            </>
          ) : (
            <>
              <CheckCircle size={24} />
              Complete Delivery
            </>
          )}
        </button>

        {!photo && (
          <p className={`text-center text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            Photo is required to complete delivery
          </p>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { ArrowLeft, Navigation, MapPin, Clock, Phone, AlertCircle, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import type { Order } from '../App';

interface LiveDeliveryMapProps {
  order: Order;
  onBack: () => void;
  isDarkMode: boolean;
}

export function LiveDeliveryMap({ order, onBack, isDarkMode }: LiveDeliveryMapProps) {
  const [riderPosition, setRiderPosition] = useState({ x: 15, y: 25 });
  const [remainingTime, setRemainingTime] = useState(15);
  const [remainingDistance, setRemainingDistance] = useState(3.2);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [currentStreet, setCurrentStreet] = useState('EDSA Avenue');

  const isPickedUp = ['picked_up', 'en_route_delivery', 'arrived_delivery', 'verified', 'payment_collected'].includes(order.status);
  const targetPosition = isPickedUp ? { x: 85, y: 75 } : { x: 15, y: 25 };

  // Simulate rider movement
  useEffect(() => {
    const interval = setInterval(() => {
      setRiderPosition(prev => {
        const dx = targetPosition.x - prev.x;
        const dy = targetPosition.y - prev.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 1) return prev;
        
        return {
          x: prev.x + (dx / distance) * 0.5,
          y: prev.y + (dy / distance) * 0.5
        };
      });

      // Update remaining time and distance
      setRemainingTime(prev => Math.max(0, prev - 0.1));
      setRemainingDistance(prev => Math.max(0, prev - 0.02));
    }, 100);

    return () => clearInterval(interval);
  }, [targetPosition.x, targetPosition.y]);

  // Update current street based on position
  useEffect(() => {
    const streets = [
      'EDSA Avenue',
      'Ortigas Avenue',
      'Shaw Boulevard',
      'Meralco Avenue',
      'C5 Road'
    ];
    const index = Math.floor(riderPosition.x / 20) % streets.length;
    setCurrentStreet(streets[index]);
  }, [riderPosition]);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white sticky top-0 z-20">
        <div className="flex items-center gap-4 p-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/20 rounded-xl transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1">
            <h1 className="mb-1">Live Navigation</h1>
            <p className="text-blue-100">{order.id}</p>
          </div>
          <button className="p-2 hover:bg-white/20 rounded-xl transition-colors">
            <Phone size={24} />
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative h-[60vh] bg-gray-200 overflow-hidden">
        {/* Map Grid */}
        <div 
          className="absolute inset-0 transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel / 100})` }}
        >
          {/* Background map pattern */}
          <svg className="w-full h-full opacity-30">
            <defs>
              <pattern id="map-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#94a3b8" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#map-grid)" />
          </svg>

          {/* Major roads */}
          <svg className="absolute inset-0 w-full h-full">
            <line x1="15%" y1="0" x2="15%" y2="100%" stroke="#94a3b8" strokeWidth="8" />
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#94a3b8" strokeWidth="12" />
            <line x1="85%" y1="0" x2="85%" y2="100%" stroke="#94a3b8" strokeWidth="8" />
            <line x1="0" y1="25%" x2="100%" y2="25%" stroke="#94a3b8" strokeWidth="8" />
            <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#94a3b8" strokeWidth="10" />
            <line x1="0" y1="75%" x2="100%" y2="75%" stroke="#94a3b8" strokeWidth="8" />
          </svg>

          {/* Route path - animated dashed line */}
          <svg className="absolute inset-0 w-full h-full">
            <defs>
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            <path
              d={`M ${riderPosition.x}% ${riderPosition.y}% L ${targetPosition.x}% ${targetPosition.y}%`}
              fill="none"
              stroke="url(#routeGradient)"
              strokeWidth="4"
              strokeDasharray="15,10"
              strokeLinecap="round"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="50"
                dur="1s"
                repeatCount="indefinite"
              />
            </path>
          </svg>

          {/* Pickup Location */}
          <div 
            className="absolute"
            style={{ 
              left: '15%', 
              top: '25%', 
              transform: 'translate(-50%, -100%)',
              transition: 'all 0.3s'
            }}
          >
            <div className="relative">
              <div className="bg-green-500 text-white p-4 rounded-full shadow-2xl border-4 border-white relative z-10 animate-bounce" style={{ animationDuration: '2s' }}>
                <MapPin size={28} />
              </div>
              {!isPickedUp && (
                <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
              )}
            </div>
          </div>

          {/* Delivery Location */}
          <div 
            className="absolute"
            style={{ 
              left: '85%', 
              top: '75%', 
              transform: 'translate(-50%, -100%)',
              transition: 'all 0.3s'
            }}
          >
            <div className="relative">
              <div className="bg-red-500 text-white p-4 rounded-full shadow-2xl border-4 border-white relative z-10 animate-bounce" style={{ animationDuration: '2s', animationDelay: '0.5s' }}>
                <MapPin size={28} />
              </div>
              {isPickedUp && (
                <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-75"></div>
              )}
            </div>
          </div>

          {/* Rider Position - Moving */}
          <div 
            className="absolute z-20"
            style={{ 
              left: `${riderPosition.x}%`, 
              top: `${riderPosition.y}%`, 
              transform: 'translate(-50%, -50%)',
              transition: 'all 0.1s linear'
            }}
          >
            <div className="relative">
              {/* Pulsing circle around rider */}
              <div className="absolute inset-0 -m-6">
                <div className="w-16 h-16 bg-blue-400 rounded-full animate-ping opacity-40"></div>
              </div>
              
              {/* Rider icon */}
              <div className="relative bg-blue-600 text-white p-3 rounded-full shadow-2xl border-4 border-white">
                <Navigation size={24} className="transform rotate-45" />
              </div>
              
              {/* Direction indicator */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs whitespace-nowrap shadow-lg">
                You are here
              </div>
            </div>
          </div>

          {/* Intermediate waypoint markers */}
          <div 
            className="absolute"
            style={{ left: '40%', top: '40%', transform: 'translate(-50%, -50%)' }}
          >
            <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
          </div>
          <div 
            className="absolute"
            style={{ left: '60%', top: '55%', transform: 'translate(-50%, -50%)' }}
          >
            <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
          </div>
        </div>

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
          <button 
            onClick={() => setZoomLevel(prev => Math.min(150, prev + 10))}
            className="bg-white p-3 rounded-xl shadow-lg hover:bg-gray-50 transition-colors"
          >
            <ZoomIn size={20} className="text-gray-700" />
          </button>
          <button 
            onClick={() => setZoomLevel(prev => Math.max(50, prev - 10))}
            className="bg-white p-3 rounded-xl shadow-lg hover:bg-gray-50 transition-colors"
          >
            <ZoomOut size={20} className="text-gray-700" />
          </button>
          <button className="bg-white p-3 rounded-xl shadow-lg hover:bg-gray-50 transition-colors">
            <Maximize2 size={20} className="text-gray-700" />
          </button>
        </div>

        {/* Current Street Name */}
        <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-xl shadow-lg z-10">
          <p className="text-gray-600">Current Street</p>
          <p className="text-gray-900">{currentStreet}</p>
        </div>
      </div>

      {/* Navigation Info Panel */}
      <div className={`p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        {/* Next Turn / Direction */}
        <div className="text-white rounded-2xl p-4 mb-4" style={{ background: 'linear-gradient(to right, #003D7A, #0A1E3E)' }}>
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-xl">
              <Navigation size={32} className="transform rotate-45" />
            </div>
            <div className="flex-1">
              <p className="text-blue-100 mb-1">Next Direction</p>
              <p className="text-xl">
                {isPickedUp 
                  ? 'Continue on EDSA Avenue, then turn right'
                  : 'Head to pickup location'
                }
              </p>
              <p className="text-blue-100 mt-1">in {remainingDistance.toFixed(1)} km</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className={`rounded-xl p-3 text-center ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <Clock className={`mx-auto mb-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} size={24} />
            <p className={`mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>ETA</p>
            <p className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>{Math.ceil(remainingTime)} min</p>
          </div>
          
          <div className={`rounded-xl p-3 text-center ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <MapPin className={`mx-auto mb-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} size={24} />
            <p className={`mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Distance</p>
            <p className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>{remainingDistance.toFixed(1)} km</p>
          </div>
          
          <div className={`rounded-xl p-3 text-center ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <Navigation className={`mx-auto mb-2 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} size={24} />
            <p className={`mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Speed</p>
            <p className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>45 km/h</p>
          </div>
        </div>

        {/* Destination Info */}
        <div className={`rounded-2xl p-4 ${
          isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <div className="flex items-start gap-3 mb-3">
            <div className={`${isPickedUp ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'} p-2 rounded-lg`}>
              <MapPin size={20} />
            </div>
            <div className="flex-1">
              <p className={`mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {isPickedUp ? 'Delivering to' : 'Picking up from'}
              </p>
              <p className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>
                {isPickedUp ? order.deliveryAddress : order.pickupAddress}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
              <AlertCircle size={20} />
            </div>
            <div className="flex-1">
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                {order.specialInstructions || 'No special instructions'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <button className="bg-blue-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
            <Navigation size={20} />
            Navigate
          </button>
          <button className="bg-green-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-green-700 transition-colors">
            <Phone size={20} />
            Call Customer
          </button>
        </div>
      </div>
    </div>
  );
}
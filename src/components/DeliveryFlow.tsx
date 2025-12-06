import { ArrowLeft, MapPin, Navigation, QrCode, CheckCircle, Clock, Package, ChevronRight } from 'lucide-react';
import type { Order, DeliveryStatus } from '../App';
import { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

// Encryption configuration - in production, use environment variables
const BARCODE_SECRET_KEY = import.meta.env.VITE_BARCODE_SECRET_KEY || 'delivery-rider-barcode-key-2025';

interface DeliveryFlowProps {
  order: Order;
  onBack: () => void;
  onScanBarcode: () => void;
  onVerify: () => void;
  onViewTracking: () => void;
  onViewMap: () => void;
  onStartNavigation: () => void;
  updateOrderStatus: (orderId: string, status: DeliveryStatus) => void;
  isDarkMode: boolean;
}

// Encryption utilities
export const encryptBarcode = (barcode: string): string => {
  return CryptoJS.AES.encrypt(barcode, BARCODE_SECRET_KEY).toString();
};

const decryptBarcode = (encryptedBarcode: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedBarcode, BARCODE_SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted || encryptedBarcode; // Return original if decryption fails
  } catch (e) {
    console.warn('Decryption failed, using original barcode');
    return encryptedBarcode; // Fallback to original
  }
};

// Helper to check if barcode is encrypted
const isBarcodeEncrypted = (barcode: string): boolean => {
  // Encrypted barcodes are base64-like strings with specific CryptoJS format
  return barcode.includes('U2FsdGVkX1') || (barcode.length > 20 && barcode.includes('='));
};

export function DeliveryFlow({ order, onBack, onScanBarcode, onVerify, onViewTracking, onViewMap, onStartNavigation, updateOrderStatus, isDarkMode }: DeliveryFlowProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [decryptedBarcode, setDecryptedBarcode] = useState('');

  // Decrypt barcode on component mount
  useEffect(() => {
    if (order.barcode) {
      if (isBarcodeEncrypted(order.barcode)) {
        setDecryptedBarcode(decryptBarcode(order.barcode));
      } else {
        setDecryptedBarcode(order.barcode);
      }
    }
  }, [order.barcode]);

  const handleStatusUpdate = (orderId: string, status: DeliveryStatus) => {
    setIsUpdating(true);
    
    setTimeout(() => {
      updateOrderStatus(orderId, status);
      setIsUpdating(false);
    }, 800);
  };

  const steps = [
    { status: 'accepted', label: 'Order Accepted', completed: true },
    { status: 'en_route_pickup', label: 'En Route to Pickup', completed: ['en_route_pickup', 'arrived_pickup', 'picked_up', 'en_route_delivery', 'arrived_delivery', 'verified', 'payment_collected'].includes(order.status) },
    { status: 'arrived_pickup', label: 'Arrived at Pickup', completed: ['arrived_pickup', 'picked_up', 'en_route_delivery', 'arrived_delivery', 'verified', 'payment_collected'].includes(order.status) },
    { status: 'picked_up', label: 'Package Picked Up', completed: ['picked_up', 'en_route_delivery', 'arrived_delivery', 'verified', 'payment_collected'].includes(order.status) },
    { status: 'en_route_delivery', label: 'En Route to Delivery', completed: ['en_route_delivery', 'arrived_delivery', 'verified', 'payment_collected'].includes(order.status) },
    { status: 'arrived_delivery', label: 'Arrived at Delivery', completed: ['arrived_delivery', 'verified', 'payment_collected'].includes(order.status) },
    { status: 'verified', label: 'Delivery Verified', completed: ['verified', 'payment_collected'].includes(order.status) },
    { status: 'payment_collected', label: 'Payment Collected', completed: ['payment_collected'].includes(order.status) },
  ];

  const currentStepIndex = steps.findIndex(s => s.status === order.status);

  // Demo: Show encrypted barcode in console for security audit
  useEffect(() => {
    if (order.barcode && isBarcodeEncrypted(order.barcode)) {
      console.log('🔒 Barcode is encrypted for security');
      console.log('📦 Encrypted:', order.barcode);
      console.log('🔓 Decrypted:', decryptBarcode(order.barcode));
    }
  }, [order.barcode]);

  return (
    <div className={`min-h-screen pb-24 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
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
            <h1 className="mb-1">Delivery in Progress</h1>
            <p className="text-blue-100">{order.id}</p>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="p-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-800">Delivery Progress</h2>
            <button 
              onClick={onViewTracking}
              className="text-blue-600 hover:underline"
            >
              View Timeline
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="relative">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500"
                style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
              />
            </div>
            <p className="text-gray-600 mt-2 text-center">
              Step {currentStepIndex + 1} of {steps.length}
            </p>
          </div>
        </div>

        {/* Current Location */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="text-blue-600" size={20} />
            <h2 className="text-gray-800">Current Destination</h2>
            <button 
              onClick={onViewMap}
              className="ml-auto text-blue-600 hover:underline flex items-center gap-1"
            >
              <Navigation size={16} />
              Map
            </button>
          </div>
          
          {['accepted', 'en_route_pickup', 'arrived_pickup'].includes(order.status) ? (
            <div>
              <div className="bg-green-100 text-green-700 px-2 py-1 rounded-lg inline-block mb-2">
                Pickup Location
              </div>
              <p className="text-gray-800 mb-3">{order.pickupAddress}</p>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={onViewMap}
                  className="bg-gray-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-700 transition-colors"
                >
                  <MapPin size={18} />
                  View Map
                </button>
                <button 
                  onClick={onStartNavigation}
                  className="bg-green-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
                >
                  <Navigation size={18} />
                  Navigate
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="bg-red-100 text-red-700 px-2 py-1 rounded-lg inline-block mb-2">
                Delivery Location
              </div>
              <p className="text-gray-800 mb-3">{order.deliveryAddress}</p>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={onViewMap}
                  className="bg-gray-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-700 transition-colors"
                >
                  <MapPin size={18} />
                  View Map
                </button>
                <button 
                  onClick={onStartNavigation}
                  className="bg-red-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-red-700 transition-colors"
                >
                  <Navigation size={18} />
                  Navigate
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action Cards */}
        <div className="space-y-3">
          {/* En Route to Pickup */}
          {order.status === 'accepted' && (
            <button
              onClick={() => handleStatusUpdate(order.id, 'en_route_pickup')}
              disabled={isUpdating}
              className="w-full bg-white rounded-2xl p-4 shadow-sm text-left hover:shadow-md transition-all disabled:opacity-50"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
                    {isUpdating ? (
                      <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                    ) : (
                      <Navigation size={24} />
                    )}
                  </div>
                  <div>
                    <p className="text-gray-800">
                      {isUpdating ? 'Updating status...' : 'Start Journey to Pickup'}
                    </p>
                    <p className="text-gray-500">Mark as en route</p>
                  </div>
                </div>
                <CheckCircle className="text-gray-300" size={24} />
              </div>
            </button>
          )}

          {/* Arrived at Pickup */}
          {order.status === 'en_route_pickup' && (
            <button
              onClick={() => handleStatusUpdate(order.id, 'arrived_pickup')}
              disabled={isUpdating}
              className="w-full bg-white rounded-2xl p-4 shadow-sm text-left hover:shadow-md transition-all disabled:opacity-50"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 text-green-600 p-3 rounded-xl">
                    {isUpdating ? (
                      <div className="animate-spin w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full"></div>
                    ) : (
                      <MapPin size={24} />
                    )}
                  </div>
                  <div>
                    <p className="text-gray-800">
                      {isUpdating ? 'Updating status...' : 'Arrived at Pickup Location'}
                    </p>
                    <p className="text-gray-500">Confirm arrival</p>
                  </div>
                </div>
                <CheckCircle className="text-gray-300" size={24} />
              </div>
            </button>
          )}

          {/* Scan Barcode */}
          {order.status === 'arrived_pickup' && (
            <button
              onClick={onScanBarcode}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-4 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <QrCode size={24} />
                  </div>
                  <div className="text-left">
                    <p className="mb-1">Scan Order Barcode</p>
                    <p className="text-blue-100">Required to pick up package</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-blue-100 mb-1">Encrypted</p>
                  <p className="text-xs font-mono text-blue-200">
                    {order.barcode ? (isBarcodeEncrypted(order.barcode) ? '🔒 ' + order.barcode.substring(0, 8) + '...' : '🔓 ' + order.barcode) : 'No barcode'}
                  </p>
                </div>
              </div>
            </button>
          )}

          {/* En Route to Delivery */}
          {order.status === 'picked_up' && (
            <button
              onClick={() => handleStatusUpdate(order.id, 'en_route_delivery')}
              disabled={isUpdating}
              className="w-full bg-white rounded-2xl p-4 shadow-sm text-left hover:shadow-md transition-all disabled:opacity-50"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
                    {isUpdating ? (
                      <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                    ) : (
                      <Navigation size={24} />
                    )}
                  </div>
                  <div>
                    <p className="text-gray-800">
                      {isUpdating ? 'Updating status...' : 'Start Journey to Customer'}
                    </p>
                    <p className="text-gray-500">Head to delivery location</p>
                  </div>
                </div>
                <CheckCircle className="text-gray-300" size={24} />
              </div>
            </button>
          )}

          {/* Arrived at Delivery */}
          {order.status === 'en_route_delivery' && (
            <button
              onClick={() => handleStatusUpdate(order.id, 'arrived_delivery')}
              disabled={isUpdating}
              className="w-full bg-white rounded-2xl p-4 shadow-sm text-left hover:shadow-md transition-all disabled:opacity-50"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 text-red-600 p-3 rounded-xl">
                    {isUpdating ? (
                      <div className="animate-spin w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full"></div>
                    ) : (
                      <MapPin size={24} />
                    )}
                  </div>
                  <div>
                    <p className="text-gray-800">
                      {isUpdating ? 'Updating status...' : 'Arrived at Customer Location'}
                    </p>
                    <p className="text-gray-500">Confirm arrival</p>
                  </div>
                </div>
                <CheckCircle className="text-gray-300" size={24} />
              </div>
            </button>
          )}

          {/* Verify Delivery */}
          {order.status === 'arrived_delivery' && (
            <button
              onClick={onVerify}
              className="w-full text-white rounded-2xl p-4 shadow-lg"
              style={{ background: 'linear-gradient(to right, #E81E1E, #FF5A5F)' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <CheckCircle size={24} />
                  </div>
                  <div className="text-left">
                    <p className="mb-1">Verify Delivery</p>
                    <p className="text-blue-100">Use OTP or QR code</p>
                  </div>
                </div>
              </div>
            </button>
          )}

          {order.status === 'payment_collected' && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-100 text-green-600 w-10 h-10 rounded-full flex items-center justify-center">
                  <CheckCircle size={20} />
                </div>
                <div>
                  <h3 className="text-gray-800">Payment Collected</h3>
                  <p className="text-sm text-gray-600">Ready to complete delivery</p>
                </div>
              </div>
              <button
                onClick={() => updateOrderStatus(order.id, 'completed')}
                className="w-full bg-green-600 text-white rounded-2xl p-4 shadow-lg hover:bg-green-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle size={24} />
                    <div className="text-left">
                      <p>Complete Delivery</p>
                      <p className="text-sm text-green-100">Mark order as delivered</p>
                    </div>
                  </div>
                  <ChevronRight size={24} />
                </div>
              </button>
            </div>
          )}

          {order.status === 'completed' && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-100 text-green-600 w-10 h-10 rounded-full flex items-center justify-center">
                  <CheckCircle size={20} />
                </div>
                <div>
                  <h3 className="text-gray-800">Delivery Completed</h3>
                  <p className="text-sm text-gray-600">Order has been successfully delivered</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mt-4">
          <h2 className="text-gray-800 mb-4">Order Summary</h2>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Package className="text-gray-400" size={20} />
              <div className="flex-1">
                <p className="text-gray-600">Items</p>
                <p className="text-gray-800">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Clock className="text-gray-400" size={20} />
              <div className="flex-1">
                <p className="text-gray-600">Estimated Time</p>
                <p className="text-gray-800">{order.estimatedTime}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <MapPin className="text-gray-400" size={20} />
              <div className="flex-1">
                <p className="text-gray-600">Distance</p>
                <p className="text-gray-800">{order.distance}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { ArrowLeft, Package, MapPin, Clock, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import type { Order } from '../App';

interface ParcelAssignmentProps {
  onBack: () => void;
  onAcceptParcel: (order: Order) => void;
  isDarkMode: boolean;
}

export function ParcelAssignment({ onBack, onAcceptParcel, isDarkMode }: ParcelAssignmentProps) {
  const [availableParcels] = useState<Order[]>([
    {
      id: 'ORD-2024-003',
      customerName: 'Emma Wilson',
      customerPhone: '+1 234-567-8903',
      pickupAddress: '555 Market Street, Central Hub, NY 10003',
      deliveryAddress: '789 Riverside Drive, Apartment 3C, Manhattan, NY 10025',
      items: [
        { name: 'Fashion Package', quantity: 1, price: 149.99 }
      ],
      specialInstructions: 'Handle with care - fragile items',
      status: 'pending',
      totalAmount: 149.99,
      distance: '6.2 km',
      estimatedTime: '18 mins',
      barcode: 'BAR456789123',
      otp: '2847'
    },
    {
      id: 'ORD-2024-004',
      customerName: 'David Martinez',
      customerPhone: '+1 234-567-8904',
      pickupAddress: '555 Market Street, Central Hub, NY 10003',
      deliveryAddress: '234 Broadway, Floor 8, New York, NY 10007',
      items: [
        { name: 'Office Supplies', quantity: 3, price: 89.97 }
      ],
      status: 'pending',
      totalAmount: 89.97,
      distance: '4.8 km',
      estimatedTime: '15 mins',
      barcode: 'BAR789123456',
      otp: '5629'
    },
    {
      id: 'ORD-2024-005',
      customerName: 'Lisa Anderson',
      customerPhone: '+1 234-567-8905',
      pickupAddress: '555 Market Street, Central Hub, NY 10003',
      deliveryAddress: '567 Madison Avenue, Suite 201, NY 10022',
      items: [
        { name: 'Grocery Package', quantity: 1, price: 75.50 },
        { name: 'Fresh Produce Box', quantity: 1, price: 45.00 }
      ],
      specialInstructions: 'Deliver before 6 PM - perishable items',
      status: 'pending',
      totalAmount: 120.50,
      distance: '9.1 km',
      estimatedTime: '28 mins',
      barcode: 'BAR321654987',
      otp: '8194'
    }
  ]);

  const [acceptedParcels, setAcceptedParcels] = useState<string[]>([]);
  const [rejectedParcels, setRejectedParcels] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAccept = (order: Order) => {
    setIsProcessing(true);
    setAcceptedParcels([...acceptedParcels, order.id]);
    
    setTimeout(() => {
      onAcceptParcel({ ...order, status: 'accepted' });
      setIsProcessing(false);
      
      setTimeout(() => {
        setAcceptedParcels(prev => prev.filter(id => id !== order.id));
      }, 2000);
    }, 1000);
  };

  const handleReject = (orderId: string) => {
    setRejectedParcels([...rejectedParcels, orderId]);
    
    setTimeout(() => {
      setRejectedParcels(prev => prev.filter(id => id !== orderId));
    }, 2000);
  };

  const visibleParcels = availableParcels.filter(
    p => !acceptedParcels.includes(p.id) && !rejectedParcels.includes(p.id)
  );

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`border-b sticky top-0 z-10 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center gap-4 p-4">
          <button 
            onClick={onBack}
            className={`p-2 rounded-xl transition-colors ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <ArrowLeft size={24} className={isDarkMode ? 'text-gray-300' : 'text-gray-700'} />
          </button>
          <div className="flex-1">
            <h1 className={isDarkMode ? 'text-gray-100' : 'text-gray-800'}>Hub Assignments</h1>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Central Hub - Manila</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="p-4 text-white" style={{ background: 'linear-gradient(to right, #0A1E3E, #003D7A)' }}>
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-blue-100 mb-1">Available Parcels</p>
              <p className="text-3xl">{visibleParcels.length}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <Package size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* Parcel List */}
      <div className="p-4 space-y-4">
        {visibleParcels.length === 0 ? (
          <div className={`rounded-2xl p-8 text-center ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <CheckCircle size={32} className="text-green-500" />
            </div>
            <p className={`mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>All Caught Up!</p>
            <p className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>No new assignments available</p>
          </div>
        ) : (
          visibleParcels.map((parcel) => (
            <div key={parcel.id} className={`rounded-2xl shadow-sm overflow-hidden ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className={`mb-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>{parcel.id}</p>
                    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{parcel.customerName}</p>
                  </div>
                  <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                    New
                  </div>
                </div>

                {/* Pickup */}
                <div className="mb-3">
                  <p className={`mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Pickup Location</p>
                  <div className="flex items-start gap-2">
                    <div className="bg-green-100 text-green-600 p-1 rounded-lg mt-0.5">
                      <MapPin size={14} />
                    </div>
                    <p className={`flex-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{parcel.pickupAddress}</p>
                  </div>
                </div>

                {/* Delivery */}
                <div className="mb-4">
                  <p className={`mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Delivery Location</p>
                  <div className="flex items-start gap-2">
                    <div className="bg-red-100 text-red-600 p-1 rounded-lg mt-0.5">
                      <MapPin size={14} />
                    </div>
                    <p className={`flex-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{parcel.deliveryAddress}</p>
                  </div>
                </div>

                {/* Items */}
                <div className={`rounded-xl p-3 mb-4 ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <p className={`mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Order Items</p>
                  {parcel.items.map((item, idx) => (
                    <div key={idx} className={`flex justify-between ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                      <span>{item.name} x{item.quantity}</span>
                      <span>₱{item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Special Instructions */}
                {parcel.specialInstructions && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
                    <p className="text-amber-800">{parcel.specialInstructions}</p>
                  </div>
                )}

                {/* Info Grid */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                      <MapPin size={14} />
                    </div>
                    <p className="text-gray-800">{parcel.distance}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                      <Clock size={14} />
                    </div>
                    <p className="text-gray-800">{parcel.estimatedTime}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                      <DollarSign size={14} />
                    </div>
                    <p className="text-gray-800">₱{parcel.totalAmount}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleReject(parcel.id)}
                    disabled={isProcessing}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <XCircle size={20} />
                    Decline
                  </button>
                  <button
                    onClick={() => handleAccept(parcel)}
                    disabled={isProcessing}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 disabled:opacity-50"
                  >
                    {isProcessing && acceptedParcels.includes(parcel.id) ? (
                      <>
                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={20} />
                        Accept
                      </>
                    )}
                  </button>
                </div>
              </div>

              {acceptedParcels.includes(parcel.id) && (
                <div className="bg-green-500 text-white px-4 py-3 flex items-center justify-center gap-2">
                  <CheckCircle size={20} />
                  <span>Parcel accepted! Added to your deliveries</span>
                </div>
              )}

              {rejectedParcels.includes(parcel.id) && (
                <div className="bg-red-500 text-white px-4 py-3 flex items-center justify-center gap-2">
                  <XCircle size={20} />
                  <span>Parcel declined</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
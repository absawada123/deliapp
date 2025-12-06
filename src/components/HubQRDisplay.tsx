import { useState } from 'react';
import QRCode from 'react-qr-code';
import { generatePackageQRPH } from '../utils/qrph';

interface HubQRDisplayProps {
  orderId: string;
  onPrint?: () => void;
}

export function HubQRDisplay({ orderId, onPrint }: HubQRDisplayProps) {
  const qrphData = generatePackageQRPH(orderId);
  
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Package QR Code</h1>
        <p className="text-gray-600 mb-6">Scan at pickup station</p>
        
        <div className="bg-white border-4 border-gray-200 rounded-2xl p-8 mb-6 shadow-lg">
          <QRCode 
            value={qrphData}
            size={280}
            bgColor="#FFFFFF"
            fgColor="#000000"
            level="H"
          />
        </div>
        
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-600 mb-2">Order ID</p>
          <p className="text-lg font-mono font-semibold text-gray-800">{orderId}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onPrint}
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Print Label
          </button>
          <button
            onClick={() => window.close()}
            className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

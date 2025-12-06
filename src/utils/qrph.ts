import CryptoJS from 'crypto-js';

export interface QRPHPayload {
  format: string;
  version: string;
  orderId: string;
  hubId: string;
  purpose: 'package_verification' | 'payment_collection';
  timestamp: number;
  [key: string]: any;
}

// Use a static timestamp for deterministic encryption (remove for production)
const STATIC_TIMESTAMP = 1733500800000; // Fixed timestamp

export const generatePackageQRPH = (orderId: string, hubId: string = 'HUB-MNL-001'): string => {
  const payload: QRPHPayload = {
    format: 'ph.ppmi.p2m',
    version: 'v1.0',
    orderId,
    hubId,
    timestamp: STATIC_TIMESTAMP, // Use static timestamp for consistency
    purpose: 'package_verification'
  };
  
  return CryptoJS.AES.encrypt(JSON.stringify(payload), 'package-verification-key').toString();
};

export const generatePaymentQRPH = (
  orderId: string, 
  amount: number,
  riderId: string = 'RIDER-001'
): string => {
  const payload = {
    format: 'ph.ppmi.p2m',
    version: 'v1.0',
    orderId,
    amount,
    currency: 'PHP',
    riderId,
    timestamp: STATIC_TIMESTAMP, // Use static timestamp for consistency
    purpose: 'payment_collection',
    merchantName: 'SpeedyRider Delivery',
    merchantCity: 'Manila',
    reference: `PAY-${orderId}-${STATIC_TIMESTAMP}`
  };
  
  return CryptoJS.AES.encrypt(JSON.stringify(payload), 'payment-collection-key').toString();
};

export const decryptQRPH = (qrString: string, type: 'package' | 'payment'): QRPHPayload | null => {
  try {
    const key = type === 'package' ? 'package-verification-key' : 'payment-collection-key';
    const bytes = CryptoJS.AES.decrypt(qrString, key);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (e) {
    console.error('QRPH parsing failed:', e);
    return null;
  }
};

export const isValidQRPH = (qrString: string): boolean => {
  return qrString.includes('U2FsdGVkX1') && qrString.length > 50;
};

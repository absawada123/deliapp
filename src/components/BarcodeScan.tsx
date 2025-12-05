import { useState, useEffect } from 'react';
import { ArrowLeft, QrCode, CheckCircle, XCircle, Camera } from 'lucide-react';

interface BarcodeScanProps {
  expectedBarcode: string;
  onBack: () => void;
  onScanSuccess: () => void;
  isDarkMode: boolean;
}

export function BarcodeScan({ expectedBarcode, onBack, onScanSuccess, isDarkMode }: BarcodeScanProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<'success' | 'error' | null>(null);
  const [manualCode, setManualCode] = useState('');

  useEffect(() => {
    if (scanResult === 'success') {
      setTimeout(() => {
        onScanSuccess();
      }, 1500);
    }
  }, [scanResult, onScanSuccess]);

  const handleSimulateScan = () => {
    setIsScanning(true);
    
    setTimeout(() => {
      setIsScanning(false);
      setScanResult('success');
    }, 2000);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (manualCode === expectedBarcode) {
      setScanResult('success');
    } else {
      setScanResult('error');
      setTimeout(() => setScanResult(null), 2000);
    }
  };

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
            <h1 className={isDarkMode ? 'text-gray-100' : 'text-gray-800'}>Scan Barcode</h1>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Verify package before pickup</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Scanner Area */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-6 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center text-white">
            {isScanning ? (
              <div className="space-y-4">
                <div className="relative w-48 h-48 mx-auto">
                  <div className="absolute inset-0 border-4 border-white/30 rounded-2xl"></div>
                  <div className="absolute inset-0 border-t-4 border-white rounded-2xl animate-pulse"></div>
                  <Camera className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" size={64} />
                </div>
                <p className="text-xl">Scanning...</p>
                <p className="text-blue-100">Hold camera steady</p>
              </div>
            ) : scanResult === 'success' ? (
              <div className="space-y-4">
                <div className="bg-green-500 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle size={48} />
                </div>
                <p className="text-xl">Scan Successful!</p>
                <p className="text-blue-100">Barcode verified</p>
              </div>
            ) : scanResult === 'error' ? (
              <div className="space-y-4">
                <div className="bg-red-500 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
                  <XCircle size={48} />
                </div>
                <p className="text-xl">Invalid Barcode</p>
                <p className="text-blue-100">Please try again</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-white/20 w-48 h-48 rounded-2xl flex items-center justify-center mx-auto">
                  <QrCode size={96} />
                </div>
                <p className="text-xl">Ready to Scan</p>
                <p className="text-blue-100">Position barcode in frame</p>
              </div>
            )}
          </div>
        </div>

        {/* Expected Barcode */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <p className="text-gray-600 mb-2">Expected Barcode</p>
          <div className="bg-gray-100 rounded-xl p-3">
            <p className="text-gray-800 text-center text-xl tracking-wider">{expectedBarcode}</p>
          </div>
        </div>

        {/* Manual Entry */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <h2 className="text-gray-800 mb-4">Manual Entry</h2>
          <form onSubmit={handleManualSubmit} className="space-y-3">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="Enter barcode manually"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
            />
            <button
              type="submit"
              className="w-full bg-gray-600 text-white py-3 rounded-xl hover:bg-gray-700 transition-colors"
            >
              Submit Code
            </button>
          </form>
        </div>

        {/* Scan Button */}
        {!isScanning && scanResult !== 'success' && (
          <button
            onClick={handleSimulateScan}
            className="w-full text-white py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:shadow-xl transition-all"
            style={{ background: 'linear-gradient(to right, #E81E1E, #FF5A5F)', boxShadow: '0 10px 25px -5px rgba(232, 30, 30, 0.3)' }}
          >
            <Camera size={24} />
            Start Scanning
          </button>
        )}

        {/* Instructions */}
        <div className="mt-6 space-y-3">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
            <p className="text-gray-600">Point camera at the barcode on the package</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
            <p className="text-gray-600">Hold steady until the barcode is scanned</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
            <p className="text-gray-600">If scanning fails, use manual entry option</p>
          </div>
        </div>
      </div>
    </div>
  );
}
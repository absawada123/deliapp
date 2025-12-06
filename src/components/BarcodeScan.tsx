import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, QrCode, CheckCircle, XCircle, Camera, Keyboard } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';

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
  const [showManual, setShowManual] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const scannerId = 'qr-reader-container';

  useEffect(() => {
    // Initialize scanner with default camera
    const scanner = new Html5QrcodeScanner(
      scannerId,
      { 
        fps: 10,
        qrbox: { width: 200, height: 200 },
        aspectRatio: 1.0,
        rememberLastUsedCamera: false,
        showTorchButtonIfSupported: true,
      },
      false
    );
    
    scannerRef.current = scanner;
    
    scanner.render(
      (decodedText) => {
        handleBarcodeScan(decodedText);
      },
      (errorMessage) => {
        console.debug('Scan error:', errorMessage);
      }
    );

    setIsScanning(true);

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error('Clear error:', err));
      }
    };
  }, []);

  // Auto-advance on success
  useEffect(() => {
    if (scanResult === 'success') {
      const timer = setTimeout(() => {
        onScanSuccess();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [scanResult, onScanSuccess]);

  const handleBarcodeScan = (scannedCode: string) => {
    if (scannedCode === expectedBarcode) {
      setScanResult('success');
      setIsScanning(false);
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error('Clear error:', err));
      }
    } else {
      setScanResult('error');
      setTimeout(() => setScanResult(null), 2000);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleBarcodeScan(manualCode);
  };

  const handleToggleManual = () => {
    if (!showManual && scannerRef.current) {
      scannerRef.current.clear().catch(err => console.error('Clear error:', err));
      setIsScanning(false);
    }
    setShowManual(!showManual);
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
          <button
            onClick={handleToggleManual}
            className={`p-2 rounded-xl transition-colors ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <Keyboard size={20} className={isDarkMode ? 'text-gray-300' : 'text-gray-700'} />
          </button>
        </div>
      </div>

      <div className="p-4">
        {/* Scanner Area */}
        {!showManual && (
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-4 mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center text-white">
              {/* Scanner renders here */}
              <div 
                id={scannerId}
                className={`mx-auto rounded-xl overflow-hidden ${isScanning ? '' : 'hidden'}`}
              ></div>
              
              {/* Mirror camera effect using CSS class */}
              <style dangerouslySetInnerHTML={{
                __html: `
                  #${scannerId} video {
                    transform: scaleX(-1);
                    width: 100%;
                    height: auto;
                  }
                `
              }} />
              
              {/* Status overlay */}
              {scanResult === null && isScanning && (
                <div>
                  <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Camera size={32} />
                  </div>
                  <p className="text-lg">Scanning...</p>
                  <p className="text-blue-100 text-sm">Position barcode in the frame</p>
                </div>
              )}
              
              {scanResult === 'success' && (
                <div className="space-y-4 py-12">
                  <div className="bg-green-500 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle size={48} />
                  </div>
                  <p className="text-xl">Scan Successful!</p>
                  <p className="text-blue-100">Barcode verified</p>
                </div>
              )}
              
              {scanResult === 'error' && (
                <div className="space-y-4 py-12">
                  <div className="bg-red-500 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
                    <XCircle size={48} />
                  </div>
                  <p className="text-xl">Invalid Barcode</p>
                  <p className="text-blue-100">Please try again</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Manual Entry */}
        {showManual && (
          <div className={`rounded-2xl p-4 shadow-sm mb-4 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h2 className={isDarkMode ? 'text-gray-100' : 'text-gray-800'}>Manual Entry</h2>
            <form onSubmit={handleManualSubmit} className="space-y-3 mt-4">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="Enter barcode manually"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500' 
                    : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'
                }`}
                autoFocus
              />
              <button
                type="submit"
                className="w-full bg-gray-600 text-white py-3 rounded-xl hover:bg-gray-700 transition-colors"
              >
                Submit Code
              </button>
            </form>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 space-y-3">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-sm font-bold">1</div>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Point camera at the barcode on the package</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-sm font-bold">2</div>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Hold steady until the barcode is scanned</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-sm font-bold">3</div>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Use manual entry if camera is unavailable</p>
          </div>
        </div>
      </div>
    </div>
  );
}

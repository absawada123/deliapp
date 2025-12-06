import QRCode from 'react-qr-code';

interface QRGeneratorProps {
  value: string;
  size?: number;
  isDarkMode?: boolean;
}

export function QRGenerator({ value, size = 200, isDarkMode = false }: QRGeneratorProps) {
  return (
    <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <QRCode
        value={value}
        size={size}
        bgColor={isDarkMode ? '#1F2937' : '#FFFFFF'}
        fgColor={isDarkMode ? '#FFFFFF' : '#000000'}
        level="H"
      />
    </div>
  );
}

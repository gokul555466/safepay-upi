import React, { useState, useRef } from 'react';
import {
  QrCode,
  ImagePlus,
  FolderOpen,
  Camera,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  RotateCcw,
  UploadCloud,
} from 'lucide-react';

interface ScanQRScreenProps {
  onSelectQRPayee: (
    payeeName: string,
    payeeUpi: string,
    defaultAmount: number,
    isScamScenario: boolean
  ) => void;
  onCancel: () => void;
}

export const ScanQRScreen: React.FC<ScanQRScreenProps> = ({
  onSelectQRPayee,
  onCancel,
}) => {
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string | null>(null);
  const [photoFileName, setPhotoFileName] = useState<string | null>(null);
  const [isDecoding, setIsDecoding] = useState(false);
  const [decodedPayee, setDecodedPayee] = useState<{
    name: string;
    upi: string;
    amount: number;
    isScam: boolean;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Trigger File Explorer
  const handleOpenFolderExplorer = () => {
    if (fileInputRef.current) {
      // Reset input value to allow picking same file again if desired
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  // Process file selected from File Explorer
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const resultUrl = reader.result as string;
      setSelectedPhotoUrl(resultUrl);
      simulateQrDecoding(file.name);
    };
    reader.readAsDataURL(file);
  };

  // Drag & drop support
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setPhotoFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedPhotoUrl(reader.result as string);
      simulateQrDecoding(file.name);
    };
    reader.readAsDataURL(file);
  };

  // Simulate scanning/decoding QR code from placed photo
  const simulateQrDecoding = (fileName: string) => {
    setIsDecoding(true);
    setDecodedPayee(null);

    setTimeout(() => {
      setIsDecoding(false);
      // Determine if scam from filename or default to trusted Ramesh Groceries
      const isScam =
        fileName.toLowerCase().includes('scam') ||
        fileName.toLowerCase().includes('lottery') ||
        fileName.toLowerCase().includes('fraud');

      if (isScam) {
        setDecodedPayee({
          name: 'Unknown Claim Agent',
          upi: 'lottery.claim@fakeupi',
          amount: 5000,
          isScam: true,
        });
      } else {
        setDecodedPayee({
          name: 'Ramesh Groceries',
          upi: '9840112233',
          amount: 150,
          isScam: false,
        });
      }
    }, 900);
  };

  // Fast sample QR loader (if user has no photo on disk)
  const handleLoadSamplePhoto = (name: string, upi: string, amount: number, isScam: boolean) => {
    setSelectedPhotoUrl('sample_qr');
    setPhotoFileName(`${name.replace(/\s+/g, '_')}_QR.png`);
    setIsDecoding(true);
    setTimeout(() => {
      setIsDecoding(false);
      setDecodedPayee({ name, upi, amount, isScam });
    }, 600);
  };

  return (
    <div id="screen-scan-qr" className="space-y-5 pb-6 animate-in fade-in duration-200">
      {/* Hidden File Input directing to File Explorer */}
      <input
        ref={fileInputRef}
        id="qr-file-explorer-input"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Screen Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-slate-700" />
            Scan QR Code
          </h2>
          <p className="text-xs text-slate-600">
            Place or upload a photo of any shopkeeper or UPI QR code
          </p>
        </div>
      </div>

      {/* Primary Area: User is asked to place the photo, clicking directs into File Explorer */}
      <div
        id="qr-photo-placement-zone"
        role="button"
        tabIndex={0}
        onClick={handleOpenFolderExplorer}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleOpenFolderExplorer();
          }
        }}
        className="group relative bg-white hover:bg-blue-50/40 border-2 border-dashed border-blue-400 hover:border-blue-600 rounded-3xl p-6 sm:p-8 text-center cursor-pointer transition-all shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100"
      >
        {selectedPhotoUrl ? (
          /* Render Placed Photo / QR code */
          <div className="space-y-4">
            <div className="relative w-48 h-48 mx-auto rounded-2xl overflow-hidden border-2 border-blue-500 shadow-md bg-slate-900 flex items-center justify-center">
              {selectedPhotoUrl !== 'sample_qr' ? (
                <img
                  src={selectedPhotoUrl}
                  alt="Placed QR Code"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="p-4 text-white flex flex-col items-center justify-center">
                  <QrCode className="w-24 h-24 text-emerald-400" />
                  <span className="text-[10px] font-bold text-emerald-300 mt-2 uppercase">
                    Sample QR Code
                  </span>
                </div>
              )}

              {/* Animated scanning laser */}
              {isDecoding && (
                <div className="absolute inset-x-0 h-1 bg-emerald-400 shadow-lg shadow-emerald-400 animate-bounce top-1/2" />
              )}
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                Photo Placed: {photoFileName}
              </span>
              <p className="text-xs text-slate-500 mt-2">
                Click here to choose a different photo from File Explorer
              </p>
            </div>
          </div>
        ) : (
          /* Asking the user to place the photo */
          <div className="space-y-4 py-4">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-105 group-hover:bg-blue-200 transition-all shadow-inner">
              <FolderOpen className="w-10 h-10" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-700">
                Please place the photo here
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                Click on this box to open your <strong className="text-slate-900">File Explorer</strong> and select a QR code photo or image.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 group-hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-sm transition-colors">
              <UploadCloud className="w-4 h-4" />
              <span>Click to Open File Explorer</span>
            </div>

            <p className="text-[11px] text-slate-400 font-medium">
              Supports JPG, PNG, WEBP, or screenshots from your device
            </p>
          </div>
        )}
      </div>

      {/* Decoding Status & Proceed Action */}
      {isDecoding && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-center gap-3 text-blue-800 text-xs sm:text-sm font-bold animate-pulse">
          <Sparkles className="w-5 h-5 text-blue-600 animate-spin" />
          <span>Decoding QR code from photo and verifying merchant bank records...</span>
        </div>
      )}

      {decodedPayee && !isDecoding && (
        <div className="p-5 bg-emerald-50 border-2 border-emerald-400 rounded-3xl space-y-3 animate-in fade-in duration-200">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-200 text-emerald-800 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-emerald-950">
                  QR Code Successfully Detected!
                </h4>
                <p className="text-xs text-emerald-800 font-bold">
                  Merchant: {decodedPayee.name} ({decodedPayee.upi})
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-black text-emerald-900 bg-white px-2 py-1 rounded-lg border border-emerald-300">
              ₹{decodedPayee.amount}
            </span>
          </div>

          <button
            id="btn-confirm-placed-photo-qr"
            type="button"
            onClick={() =>
              onSelectQRPayee(
                decodedPayee.name,
                decodedPayee.upi,
                decodedPayee.amount,
                decodedPayee.isScam
              )
            }
            className="w-full min-h-[50px] bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-sm rounded-2xl shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Proceed to Pay {decodedPayee.name}</span>
          </button>
        </div>
      )}

      {/* Instant Test Presets (For convenience if testing without a saved image file) */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Or test with sample QR photo:
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleLoadSamplePhoto('Ramesh Groceries', '9840112233', 150, false)}
            className="p-3 bg-white hover:bg-emerald-50/60 border border-slate-200 rounded-xl text-left flex items-start gap-2.5 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Ramesh Groceries QR</p>
              <p className="text-[11px] text-slate-500">Verified shopkeeper • ₹150</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() =>
              handleLoadSamplePhoto('Unknown Lottery Agent', 'lottery.claim@fakeupi', 5000, true)
            }
            className="p-3 bg-white hover:bg-rose-50/60 border border-rose-200 rounded-xl text-left flex items-start gap-2.5 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-rose-900">Suspicious Scam QR</p>
              <p className="text-[11px] text-slate-500">Unfamiliar agent • ₹5,000</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

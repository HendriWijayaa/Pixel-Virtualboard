import React, { useEffect, useState } from 'react';
import { Smartphone, CheckCircle2, X } from 'lucide-react';
import { DeviceInfo } from '../utils/deviceDetector';
import { soundEngine } from '../utils/soundEngine';

interface FastPairModalProps {
  device: DeviceInfo;
  roomId: string;
  isOpen: boolean;
  onClose: () => void;
  onOpenWorkspace?: () => void;
}

export const FastPairModal: React.FC<FastPairModalProps> = ({
  device,
  roomId,
  isOpen,
  onClose,
}) => {
  // State to track if popup is sliding down or reverse-animating up
  const [isRendered, setIsRendered] = useState<boolean>(false);
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const [isEntered, setIsEntered] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && device) {
      setIsRendered(true);
      setIsExiting(false);
      // Play Google Pixel pair pop-up chime sound
      soundEngine.playPixelPairChime();

      // Trigger downward slide-in on next frame
      const enterTimer = setTimeout(() => {
        setIsEntered(true);
      }, 30);

      // Automatically reverse-animate back up after 4.5 seconds
      const dismissTimer = setTimeout(() => {
        handleTriggerExit();
      }, 4500);

      return () => {
        clearTimeout(enterTimer);
        clearTimeout(dismissTimer);
      };
    } else {
      setIsEntered(false);
      setIsRendered(false);
    }
  }, [isOpen, device]);

  const handleTriggerExit = () => {
    setIsExiting(true);
    // Wait for the slide-up animation to complete before removing from DOM
    setTimeout(() => {
      setIsRendered(false);
      setIsExiting(false);
      setIsEntered(false);
      onClose();
    }, 400);
  };

  if (!isRendered || !device) return null;

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-md pointer-events-auto transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] font-['Inter'] ${
        isEntered && !isExiting
          ? 'translate-y-0 opacity-100 scale-100'
          : '-translate-y-24 opacity-0 scale-95'
      }`}
      role="alert"
    >
      {/* Top Popup Card - Tegas Tanpa Rounded */}
      <div
        onClick={handleTriggerExit}
        className="w-full bg-white dark:bg-[#18181c] border-2 border-stone-800 dark:border-zinc-700 rounded-none shadow-2xl overflow-hidden cursor-pointer select-none group"
        title="Klik untuk menutup notifikasi"
      >
        {/* Top Accent Line */}
        <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-emerald-500 to-indigo-500" />

        <div className="p-4 sm:p-5 flex items-center justify-between gap-3.5">
          {/* Left: Smartphone Icon */}
          <div className="w-12 h-12 bg-stone-100 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-none flex items-center justify-center shrink-0 text-sky-600 dark:text-sky-400">
            <Smartphone className="w-6 h-6" />
          </div>

          {/* Center: Device Details */}
          <div className="flex-1 min-w-0 pr-1">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                Pixel Virtual Keyboard
              </span>
              <span className="text-[10px] text-stone-400 dark:text-zinc-500 font-mono">
                &bull; {roomId}
              </span>
            </div>

            {/* Smartphone Name */}
            <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-zinc-100 truncate tracking-tight">
              {device.name}
            </h3>

            {/* Status Terhubung Badge */}
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 inline" />
                Terhubung
              </span>
            </div>
          </div>

          {/* Right: Dismiss 'X' Icon without box or border */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleTriggerExit();
            }}
            title="Tutup Notifikasi"
            className="p-1.5 text-stone-400 hover:text-stone-800 dark:text-zinc-500 dark:hover:text-zinc-200 transition-colors bg-transparent border-0 cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom Auto-Dismiss Progress Bar (4.5s countdown animation) */}
        <div className="h-0.5 w-full bg-stone-100 dark:bg-zinc-800 overflow-hidden">
          <div
            className={`h-full bg-sky-500 dark:bg-sky-400 transition-all duration-[4500ms] ease-linear ${
              isEntered && !isExiting ? 'w-0' : 'w-full'
            }`}
          />
        </div>
      </div>
    </div>
  );
};

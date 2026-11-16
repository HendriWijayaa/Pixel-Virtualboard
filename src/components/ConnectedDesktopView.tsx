import React, { useEffect, useState } from 'react';
import { soundEngine } from '../utils/soundEngine';
import { DeviceInfo } from '../utils/deviceDetector';
import { TextWorkspace } from './TextWorkspace';
import { Sparkles, Terminal, Copy, Check } from 'lucide-react';

interface ConnectedDesktopViewProps {
  device: DeviceInfo | null;
  deviceName: string | null;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onDisconnect: () => void;
  onOpenMultiTabModal: () => void;
  onOpenPipWindow: () => void;
  isPipSupported: boolean;
  autoCopyClipboard: boolean;
  onToggleAutoCopy: () => void;
}

export const ConnectedDesktopView: React.FC<ConnectedDesktopViewProps> = ({
  device,
  deviceName,
  text,
  setText,
  textareaRef,
  onDisconnect,
  onOpenMultiTabModal,
  onOpenPipWindow,
  isPipSupported,
  autoCopyClipboard,
  onToggleAutoCopy,
}) => {
  const [showWorkspaceDrawer, setShowWorkspaceDrawer] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Play Google signature pop-up chime sound on initial mount
  useEffect(() => {
    soundEngine.unlockAudio();
    soundEngine.playPixelPairChime();
  }, []);

  const handleCopyText = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const displayName = device?.name || deviceName || 'Google Pixel';

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 py-4 sm:py-6 relative font-['Inter'] animate-in fade-in duration-300">
      {/* Inline styles for the Google checkmark draw & bounce animation */}
      <style>{`
        @keyframes googleCirclePop {
          0% {
            transform: scale(0.7);
            opacity: 0;
          }
          65% {
            transform: scale(1.04);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes googleCheckDraw {
          0% {
            stroke-dashoffset: 200;
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }

        @keyframes googleFadeUp {
          0% {
            opacity: 0;
            transform: translateY(12px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .anim-circle-pop {
          animation: googleCirclePop 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }

        .anim-check-draw {
          stroke-dasharray: 200;
          stroke-dashoffset: 200;
          animation: googleCheckDraw 0.65s cubic-bezier(0.4, 0, 0.2, 1) 0.25s forwards;
        }

        .anim-fade-up {
          animation: googleFadeUp 0.5s ease-out 0.4s both;
        }

        @media (prefers-reduced-motion: reduce) {
          .anim-circle-pop,
          .anim-fade-up {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .anim-check-draw {
            animation: none !important;
            stroke-dashoffset: 0 !important;
            opacity: 1 !important;
          }
        }
      `}</style>

      {/* Main Centered Box Matching SVG 3 */}
      <div className="flex flex-col items-center justify-center max-w-lg w-full my-auto">
        {/* Animated #A8C7FA Circle & #174EA6 Checkmark */}
        <div className="w-[min(32vh,250px)] h-[min(32vh,250px)] flex items-center justify-center anim-circle-pop select-none">
          <svg
            viewBox="0 0 260 260"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-xs"
            aria-hidden="true"
          >
            {/* Solid Baby Blue Circle */}
            <circle
              cx="130"
              cy="130"
              r="115"
              fill="#A8C7FA"
            />

            {/* Bold #174EA6 Checkmark Path with animated stroke drawing */}
            <path
              d="M80 132 L120 172 L188 86"
              stroke="#174EA6"
              strokeWidth="18"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="anim-check-draw"
            />
          </svg>
        </div>

        {/* Text Details with Staggered Fade Up */}
        <div className="anim-fade-up flex flex-col items-center mt-[clamp(1.25rem,3vh,2.25rem)]">
          <h1 className="font-['Google_Sans_Flex'] text-[clamp(2rem,4vw,2.875rem)] font-medium tracking-tight text-[#202124] leading-tight">
            Connected
          </h1>

          <p className="text-sm sm:text-base text-[#575757] mt-2 mb-[clamp(1.25rem,3vh,2.5rem)] font-normal">
            Linked device : {displayName}
          </p>

          {/* Outlined Pill Disconnect Button with Inverted Hover */}
          <button
            type="button"
            onClick={onDisconnect}
            className="px-10 py-2.5 rounded-full border-2 border-[#EAEAEA] text-[#1A73E8] bg-white hover:bg-[#1A73E8] hover:text-white hover:border-[#1A73E8] text-sm sm:text-base font-normal transition-colors cursor-pointer"
          >
            Disconnect
          </button>
        </div>

        {/* Live Keystroke & Workspace Tool Drawer Trigger */}
        <div className="mt-[clamp(1.5rem,3.5vh,2.75rem)] flex items-center gap-3 text-xs">
          <button
            type="button"
            onClick={() => setShowWorkspaceDrawer((prev) => !prev)}
            className="px-3.5 py-1.5 rounded-full border border-stone-200 text-[#575757] bg-white/70 hover:bg-[#202124] hover:text-white hover:border-[#202124] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>{showWorkspaceDrawer ? 'Sembunyikan Workspace' : 'Buka Live Workspace & Teks'}</span>
          </button>

          {text && (
            <button
              type="button"
              onClick={handleCopyText}
              className="px-3 py-1.5 rounded-full border border-stone-200 text-[#575757] bg-white/70 hover:bg-[#202124] hover:text-white hover:border-[#202124] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Teks ({text.length})</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Expandable Live Workspace Drawer when requested by user */}
      {showWorkspaceDrawer && (
        <div className="w-full max-w-3xl mt-8 pt-8 border-t border-stone-200 dark:border-zinc-800 animate-in fade-in slide-in-from-bottom-4 duration-200 text-left">
          <div className="flex items-center justify-between mb-3 text-xs text-stone-500 dark:text-zinc-400">
            <span className="font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              <span>Area Uji Ketikan Langsung (Live Workspace)</span>
            </span>
            <span>Ketik dari Pixel Anda untuk menguji</span>
          </div>

          <TextWorkspace
            text={text}
            setText={setText}
            textareaRef={textareaRef}
            onOpenMultiTabModal={onOpenMultiTabModal}
            onOpenPipWindow={onOpenPipWindow}
            isPipSupported={isPipSupported}
            autoCopyClipboard={autoCopyClipboard}
            onToggleAutoCopy={onToggleAutoCopy}
          />
        </div>
      )}
    </div>
  );
};

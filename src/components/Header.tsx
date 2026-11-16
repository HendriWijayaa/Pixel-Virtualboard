import React from 'react';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  connectedRemotesCount?: number;
  lastConnectedDevice?: string | null;
  roomId?: string;
  onDisconnectRemote?: () => void;
  onOpenMultiTabModal?: () => void;
  showOnlyOnPixel?: boolean;
}

export const PixelKeyboardIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-auto' }) => (
  <svg
    viewBox="0 0 49 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ aspectRatio: '49/32' }}
    aria-hidden="true"
  >
    <rect width="48.4468" height="31.3041" rx="3.14979" fill="url(#pixel_kb_gradient)" />
    <rect x="6.85718" y="6.85708" width="4.47201" height="4.47201" fill="#BBE2FF" />
    <rect x="14.4596" y="6.85709" width="4.47201" height="4.47201" fill="#BBE2FF" />
    <rect x="22.062" y="6.85709" width="4.47201" height="4.47201" fill="#BBE2FF" />
    <rect x="29.6644" y="6.85709" width="4.47201" height="4.47201" fill="#BBE2FF" />
    <rect x="37.2668" y="6.85709" width="4.47201" height="4.47201" fill="#BBE2FF" />
    <rect x="6.85718" y="14.6086" width="4.47201" height="4.47201" fill="#BBE2FF" />
    <rect x="14.4596" y="14.6086" width="4.47201" height="4.47201" fill="#BBE2FF" />
    <rect x="22.062" y="14.6086" width="4.47201" height="4.47201" fill="#BBE2FF" />
    <rect x="29.6644" y="14.6086" width="4.47201" height="4.47201" fill="#BBE2FF" />
    <rect x="37.2668" y="14.6086" width="4.47201" height="4.47201" fill="#BBE2FF" />
    <rect x="11.0311" y="22.3601" width="26.5339" height="4.32295" fill="#BBE2FF" />
    <defs>
      <linearGradient id="pixel_kb_gradient" x1="24.2234" y1="0" x2="24.2234" y2="31.3041" gradientUnits="userSpaceOnUse">
        <stop stopColor="#AEA6FB" />
        <stop offset="0.254808" stopColor="#3869EF" />
        <stop offset="1" stopColor="#3950E2" />
      </linearGradient>
    </defs>
  </svg>
);

export const Header: React.FC<HeaderProps> = ({
  showOnlyOnPixel = false,
}) => {
  return (
    <header className="flex items-center justify-between px-5 sm:px-8 lg:px-12 py-3.5 sm:py-4 bg-white border-b border-[#dadce0] font-['Inter'] shrink-0 transition-colors">
      {/* Left: Pixel Keyboard SVG Icon & Pixel Virtualboard Brand */}
      <div className="flex items-center gap-3 select-none shrink-0">
        <PixelKeyboardIcon className="w-[32px] sm:w-[36px] h-auto shrink-0" />
        <span className="text-lg sm:text-[20px] tracking-tight text-[#202124] font-['Inter'] flex items-center gap-1.5">
          <strong className="font-normal text-[#202124]">Pixel</strong>
          <span className="font-normal text-[#202124]">Virtualboard</span>
        </span>
      </div>

      {/* Right: Optional "Only on Pixel" label */}
      {showOnlyOnPixel && (
        <div className="flex items-center">
          <span className="text-base sm:text-[17px] text-[#202124] font-normal select-none">
            Only on Pixel
          </span>
        </div>
      )}
    </header>
  );
};

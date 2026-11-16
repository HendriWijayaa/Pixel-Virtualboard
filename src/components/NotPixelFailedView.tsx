import React, { useEffect } from 'react';
import { Header } from './Header';
import { soundEngine } from '../utils/soundEngine';

interface NotPixelFailedViewProps {
  onBack: () => void;
}

export const NotPixelFailedView: React.FC<NotPixelFailedViewProps> = ({
  onBack,
}) => {
  useEffect(() => {
    soundEngine.playPixelErrorChime();
  }, []);

  return (
    <div className="min-h-dvh w-full bg-white text-[#202124] flex flex-col font-['Inter'] select-none">
      {/* Top Bar Header matching SVG 7 */}
      <Header
        darkMode={false}
        onToggleDarkMode={() => {}}
        showOnlyOnPixel={false}
      />

      {/* Inline styles for Failed Circle Pop + Shake & Sequential Cross (X) Stroke Draw */}
      <style>{`
        @keyframes failedCirclePopShake {
          0% {
            transform: scale(0.72);
            opacity: 0;
          }
          45% {
            transform: scale(1.04) translateX(0);
            opacity: 1;
          }
          60% {
            transform: scale(1) translateX(-7px);
          }
          74% {
            transform: scale(1) translateX(6px);
          }
          86% {
            transform: scale(1) translateX(-3px);
          }
          100% {
            transform: scale(1) translateX(0);
            opacity: 1;
          }
        }

        @keyframes failedCrossStrokeDraw {
          0% {
            stroke-dashoffset: 160;
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }

        @keyframes failedFadeUp {
          0% {
            opacity: 0;
            transform: translateY(12px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .anim-failed-circle {
          animation: failedCirclePopShake 0.72s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .anim-failed-cross-1 {
          stroke-dasharray: 160;
          stroke-dashoffset: 160;
          animation: failedCrossStrokeDraw 0.28s cubic-bezier(0.4, 0, 0.2, 1) 0.22s forwards;
        }

        .anim-failed-cross-2 {
          stroke-dasharray: 160;
          stroke-dashoffset: 160;
          animation: failedCrossStrokeDraw 0.28s cubic-bezier(0.4, 0, 0.2, 1) 0.38s forwards;
        }

        .anim-failed-fade-up {
          animation: failedFadeUp 0.5s ease-out 0.45s both;
        }

        @media (prefers-reduced-motion: reduce) {
          .anim-failed-circle,
          .anim-failed-fade-up {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .anim-failed-cross-1,
          .anim-failed-cross-2 {
            animation: none !important;
            stroke-dashoffset: 0 !important;
            opacity: 1 !important;
          }
        }
      `}</style>

      {/* Main Centered Content matching iPhone 17 - 7.svg */}
      <main className="flex-1 w-full max-w-[460px] mx-auto px-5 py-8 flex flex-col items-center justify-center text-center">
        <div className="flex flex-col items-center justify-center w-full my-auto">
          {/* Animated #A8C7FA Circle & #174EA6 X Cross */}
          <div className="w-[min(36vh,258px)] h-[min(36vh,258px)] flex items-center justify-center anim-failed-circle">
            <svg
              viewBox="0 0 260 260"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full drop-shadow-xs"
              aria-hidden="true"
            >
              {/* Solid #A8C7FA Circle */}
              <circle cx="130" cy="130" r="115" fill="#A8C7FA" />

              {/* Bold #174EA6 Cross (2 sequential animated strokes) */}
              <line
                x1="78"
                y1="78"
                x2="182"
                y2="182"
                stroke="#174EA6"
                strokeWidth="12.5"
                strokeLinecap="round"
                className="anim-failed-cross-1"
              />
              <line
                x1="182"
                y1="78"
                x2="78"
                y2="182"
                stroke="#174EA6"
                strokeWidth="12.5"
                strokeLinecap="round"
                className="anim-failed-cross-2"
              />
            </svg>
          </div>

          {/* Text & Back Button */}
          <div className="anim-failed-fade-up flex flex-col items-center mt-8">
            <h1 className="font-['Google_Sans_Flex'] font-medium text-[clamp(2rem,8.5vw,2.4rem)] tracking-tight text-[#202124] leading-tight">
              Not connected
            </h1>

            <p className="text-[15px] sm:text-base text-[#575757] mt-2.5 mb-8 font-normal leading-snug">
              looks like you&rsquo;re not<br />
              using a Pixel
            </p>

            <button
              type="button"
              onClick={onBack}
              className="px-11 py-2 rounded-full border border-[#EAEAEA] text-[#1A73E8] bg-white hover:bg-[#1A73E8] hover:text-white hover:border-[#1A73E8] text-sm font-normal transition-colors cursor-pointer"
            >
              Back
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

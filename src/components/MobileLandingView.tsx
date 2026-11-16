import React, { useState, useEffect, useRef } from 'react';

interface MobileLandingViewProps {
  onOpenMoreInfo: () => void;
}

const SLIDE_COUNT = 3;

export const MobileLandingView: React.FC<MobileLandingViewProps> = ({
  onOpenMoreInfo,
}) => {
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const touchStartXRef = useRef<number | null>(null);

  // Auto-advance Icon 1 slideshow smoothly
  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDE_COUNT);
    }, 3600);
    return () => window.clearInterval(timer);
  }, [activeSlide]);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartXRef.current === null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartXRef.current;
    const delta = endX - touchStartXRef.current;
    touchStartXRef.current = null;
    if (Math.abs(delta) > 36) {
      if (delta < 0) {
        setActiveSlide((prev) => (prev + 1) % SLIDE_COUNT);
      } else {
        setActiveSlide((prev) => (prev - 1 + SLIDE_COUNT) % SLIDE_COUNT);
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full bg-white text-[#202124]">
      {/* Main Vertical Sections matching iPhone 17 SVG 1 with recorder.google.com margins */}
      <div className="w-full max-w-[460px] mx-auto px-5 pt-10 pb-14 flex flex-col items-center text-center">
        {/* SECTION 1: Your control, Always on your Pixel */}
        <section className="w-full flex flex-col items-center">
          <h1 className="font-['Google_Sans_Flex'] font-medium text-[clamp(1.85rem,7.5vw,2.25rem)] tracking-tight text-[#202124] leading-[1.2] mb-8 text-balance">
            Your control,<br />
            Always on your Pixel
          </h1>

          {/* Icon 1 Slideshow (Landscape Pixel Keyboard / Arcade Controller / Touch & Sync) */}
          <div
            className="w-full max-w-[310px] relative overflow-hidden select-none cursor-pointer touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onClick={() => setActiveSlide((prev) => (prev + 1) % SLIDE_COUNT)}
            role="region"
            aria-label="Pixel Virtualboard controller preview slideshow"
          >
            <div
              className="flex transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ transform: `translateX(-${activeSlide * 100}%)` }}
            >
              {/* Slide 1: Landscape Pixel Keyboard (Exact SVG 1 Geometry) */}
              <div className="w-full shrink-0 flex justify-center py-1">
                <svg
                  viewBox="57 223 281 145"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-auto"
                  aria-hidden="true"
                >
                  <rect
                    x="63"
                    y="229"
                    width="269"
                    height="133"
                    rx="13"
                    stroke="#174EA6"
                    strokeWidth="6"
                    fill="white"
                  />
                  <circle cx="85.5" cy="295.5" r="6.5" fill="#174EA6" />
                  {/* Row 1 (7 keys) */}
                  <rect x="109" y="253" width="22" height="22" fill="#A8C7FA" />
                  <rect x="138" y="253" width="22" height="22" fill="#A8C7FA" />
                  <rect x="167" y="253" width="22" height="22" fill="#A8C7FA" />
                  <rect x="196" y="253" width="22" height="22" fill="#A8C7FA" />
                  <rect x="225" y="253" width="22" height="22" fill="#A8C7FA" />
                  <rect x="254" y="253" width="22" height="22" fill="#A8C7FA" />
                  <rect x="284" y="253" width="22" height="22" fill="#A8C7FA" />
                  {/* Row 2 */}
                  <rect x="109" y="285" width="36" height="22" fill="#A8C7FA" />
                  <rect x="154" y="285" width="22" height="22" fill="#A8C7FA" />
                  <rect x="182" y="285" width="22" height="22" fill="#A8C7FA" />
                  <rect x="211" y="285" width="22" height="22" fill="#A8C7FA" />
                  <rect x="240" y="285" width="22" height="22" fill="#A8C7FA" />
                  <rect x="270" y="285" width="36" height="22" fill="#A8C7FA" />
                  {/* Row 3 (Spacebar row) */}
                  <rect x="109" y="317" width="22" height="22" fill="#A8C7FA" />
                  <rect x="138" y="317" width="139" height="22" fill="#A8C7FA" />
                  <rect x="284" y="317" width="22" height="22" fill="#A8C7FA" />
                </svg>
              </div>

              {/* Slide 2: Arcade & Custom Button Mode */}
              <div className="w-full shrink-0 flex justify-center py-1">
                <svg
                  viewBox="57 223 281 145"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-auto"
                  aria-hidden="true"
                >
                  <rect
                    x="63"
                    y="229"
                    width="269"
                    height="133"
                    rx="13"
                    stroke="#174EA6"
                    strokeWidth="6"
                    fill="white"
                  />
                  <circle cx="85.5" cy="295.5" r="6.5" fill="#174EA6" />
                  <circle cx="118" cy="321" r="14" fill="#A8C7FA" />
                  <circle cx="136" cy="281" r="14" fill="#A8C7FA" />
                  <circle cx="171" cy="260" r="14" fill="#A8C7FA" />
                  <circle cx="216" cy="260" r="14" fill="#A8C7FA" />
                  <path d="M250 262V334.5" stroke="#A8C7FA" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="284" cy="284" r="16" fill="#A8C7FA" />
                  <circle cx="284" cy="322" r="11" fill="#A8C7FA" />
                </svg>
              </div>

              {/* Slide 3: Real-time Wireless Link */}
              <div className="w-full shrink-0 flex justify-center py-1">
                <svg
                  viewBox="57 223 281 145"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-auto"
                  aria-hidden="true"
                >
                  <rect
                    x="63"
                    y="229"
                    width="269"
                    height="133"
                    rx="13"
                    stroke="#174EA6"
                    strokeWidth="6"
                    fill="white"
                  />
                  <circle cx="85.5" cy="295.5" r="6.5" fill="#174EA6" />
                  {/* Dual touch / trackpad surfaces */}
                  <rect x="110" y="254" width="90" height="83" rx="10" fill="#A8C7FA" />
                  <rect x="212" y="254" width="94" height="83" rx="10" fill="#A8C7FA" />
                  <circle cx="155" cy="295.5" r="10" fill="#174EA6" />
                  <circle cx="155" cy="295.5" r="21" stroke="#174EA6" strokeWidth="3" />
                  <rect x="230" y="276" width="58" height="8" rx="4" fill="#174EA6" />
                  <rect x="230" y="294" width="42" height="8" rx="4" fill="#174EA6" />
                  <rect x="230" y="312" width="50" height="8" rx="4" fill="#174EA6" />
                </svg>
              </div>
            </div>
          </div>

          {/* 3 Pagination Dots below Icon 1 */}
          <div className="flex items-center justify-center gap-1 mt-3 mb-5" role="tablist" aria-label="Slide selector">
            {Array.from({ length: SLIDE_COUNT }).map((_, index) => {
              const isActive = activeSlide === index;
              return (
                <button
                  key={index}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Slide ${index + 1}`}
                  onClick={() => setActiveSlide(index)}
                  className="p-1.5 bg-transparent border-0 cursor-pointer flex items-center justify-center"
                >
                  <span
                    className={`block w-[7px] h-[7px] rounded-full transition-colors duration-200 ${
                      isActive ? 'bg-[#5F6368]' : 'bg-[#ACACAC]'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <p className="w-full text-[15px] text-[#5F6368] leading-relaxed font-normal">
            Turn your Pixel into a responsive wireless controller, always ready when you are.
          </p>
        </section>

        {/* SECTION 2: Try now on Desktop (h1 matches other h1s) */}
        <section className="w-full flex flex-col items-center mt-16">
          <h1 className="font-['Google_Sans_Flex'] font-medium text-[clamp(1.85rem,7.5vw,2.25rem)] tracking-tight text-[#202124] leading-[1.2] mb-8 text-balance">
            Try now on<br />
            Desktop
          </h1>

          {/* Icon 2: Static Laptop Illustration */}
          <div className="w-full max-w-[320px] mb-8 select-none">
            <svg
              viewBox="46 672 302 188"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto"
              aria-hidden="true"
            >
              {/* Laptop Outer Bezel */}
              <rect
                x="81.3154"
                y="680.155"
                width="230.435"
                height="151.935"
                rx="13"
                stroke="#174EA6"
                strokeWidth="6"
                fill="white"
              />
              {/* Inner Light Blue Frame */}
              <rect
                x="97.2021"
                y="696.042"
                width="199.595"
                height="119.226"
                stroke="#A8C7FA"
                strokeWidth="6"
              />
              {/* Screen Content (Heading Bars, Steps & QR Square) */}
              <rect x="117.565" y="716.405" width="71.9583" height="12.1488" fill="#A8C7FA" />
              <rect x="117.565" y="733.226" width="84.1071" height="12.1488" fill="#A8C7FA" />
              <rect x="117.565" y="753.786" width="33.6429" height="5.60714" fill="#A8C7FA" />
              <rect x="117.565" y="764.065" width="33.6429" height="5.60714" fill="#A8C7FA" />
              <rect x="117.565" y="774.345" width="33.6429" height="5.60714" fill="#A8C7FA" />
              <rect
                x="223"
                y="727"
                width="57"
                height="57"
                rx="8"
                fill="#A8C7FA"
              />
              {/* Laptop Base */}
              <path
                d="M54.9908 849.845H339.009C341.805 849.845 343.09 846.4 340.665 845.006L318.666 832.544C316.241 831.15 313.492 830.417 310.695 830.417H83.3048C80.5075 830.417 77.7592 831.15 75.3338 832.544L53.335 845.006C50.91 846.4 52.195 849.845 54.9908 849.845Z"
                fill="white"
                stroke="#174EA6"
                strokeWidth="6"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <button
            type="button"
            onClick={onOpenMoreInfo}
            className="rounded-full border border-[#EAEAEA] text-[#1A73E8] bg-white hover:bg-[#1A73E8] hover:text-white hover:border-[#1A73E8] px-8 py-2 text-sm font-normal transition-colors cursor-pointer"
          >
            More info
          </button>
        </section>

        {/* SECTION 3: The Virtualboard, available on Pixel. */}
        <section className="w-full flex flex-col items-center mt-16">
          <h1 className="font-['Google_Sans_Flex'] font-medium text-[clamp(1.85rem,7.5vw,2.25rem)] tracking-tight text-[#202124] leading-[1.2] mb-8 text-balance">
            The Virtualboard,<br />
            available on Pixel.
          </h1>

          {/* Icon 3: Static Dual Pixel Phones Illustration */}
          <div className="w-full max-w-[260px] mb-8 select-none">
            <svg
              viewBox="70 1104 252 284"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto"
              aria-hidden="true"
            >
              {/* Back White Pixel Phone */}
              <rect
                x="78"
                y="1112"
                width="139"
                height="231"
                rx="24"
                fill="white"
                stroke="#174EA6"
                strokeWidth="6"
              />
              <circle cx="147.5" cy="1137.5" r="6.5" fill="#174EA6" />

              {/* Front #A8C7FA Pixel Phone */}
              <rect
                x="180"
                y="1155"
                width="133"
                height="225"
                rx="21"
                fill="#A8C7FA"
                stroke="#174EA6"
                strokeWidth="6"
              />
              {/* Pixel Camera Bar Visor */}
              <rect x="194" y="1176" width="105" height="34" rx="17" fill="#174EA6" />
              <circle cx="280.5" cy="1192.5" r="6.5" fill="white" />
              {/* Google G Logo */}
              <path
                d="M259.841 1260.84L259.702 1260.24H246.897V1265.76H254.548C253.753 1269.59 250.067 1271.61 247.057 1271.61C244.866 1271.61 242.557 1270.68 241.028 1269.17C240.222 1268.36 239.58 1267.4 239.139 1266.34C238.699 1265.28 238.468 1264.14 238.46 1262.99C238.46 1260.67 239.486 1258.34 240.979 1256.82C242.472 1255.29 244.726 1254.43 246.968 1254.43C249.535 1254.43 251.375 1255.82 252.063 1256.45L255.915 1252.55C254.785 1251.54 251.681 1249 246.844 1249C243.112 1249 239.533 1250.45 236.918 1253.11C234.336 1255.72 233 1259.5 233 1263C233 1266.5 234.264 1270.09 236.766 1272.73C239.439 1275.53 243.224 1277 247.122 1277C250.669 1277 254.031 1275.59 256.426 1273.02C258.782 1270.5 260 1267 260 1263.34C260 1261.8 259.848 1260.88 259.841 1260.84Z"
                fill="#174EA6"
              />
            </svg>
          </div>

          <p className="w-full text-[15px] text-[#5F6368] leading-relaxed mb-5 font-normal">
            Virtualboard only works on Pixel phones.
          </p>

          <a
            href="https://store.google.com/category/phones"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-[#1A73E8] text-white hover:bg-[#1557B0] px-7 py-2.5 text-sm font-normal transition-colors whitespace-nowrap no-underline"
          >
            Visit the Google store
          </a>
        </section>
      </div>

      {/* Bottom Footer matching SVG 1 (#EDEDED) */}
      <footer className="w-full bg-[#EDEDED] py-10 px-5 mt-4">
        <div className="max-w-[460px] mx-auto flex items-center justify-center gap-6 flex-wrap text-[13px] text-[#5F6368]">
          {/* Clickable Google Wordmark -> google.com */}
          <a
            href="https://www.google.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Google"
            className="inline-flex items-center hover:opacity-80 transition-opacity shrink-0"
          >
            <svg
              viewBox="46 1605 64 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-[24px] w-auto"
              aria-hidden="true"
            >
              <path
                d="M54.232 1613.48V1615.65H59.4913C59.23 1618.69 56.6657 1619.99 54.232 1619.99C51.1287 1619.99 48.4173 1617.59 48.4173 1614.21C48.4173 1610.93 50.998 1608.39 54.232 1608.39C56.731 1608.39 58.201 1609.97 58.201 1609.97L59.7363 1608.39C59.7363 1608.39 57.76 1606.21 54.1503 1606.21C49.5443 1606.21 46 1610.03 46 1614.16C46 1618.21 49.3483 1622.15 54.2647 1622.15C58.593 1622.15 61.7617 1619.23 61.7617 1614.91C61.7617 1614 61.631 1613.46 61.631 1613.46L54.232 1613.48ZM67.7397 1611.92C64.6853 1611.92 62.513 1614.26 62.513 1617C62.513 1619.78 64.6363 1622.17 67.7723 1622.17C70.6143 1622.17 72.95 1620.03 72.95 1617.07C72.9663 1613.66 70.255 1611.92 67.7397 1611.92ZM67.7723 1613.92C69.275 1613.92 70.696 1615.1 70.696 1617.04C70.696 1618.92 69.275 1620.14 67.7723 1620.14C66.1063 1620.14 64.7997 1618.82 64.7997 1617.02C64.7997 1615.25 66.09 1613.92 67.7723 1613.92ZM79.124 1611.92C76.0697 1611.92 73.8973 1614.26 73.8973 1617C73.8973 1619.78 76.0207 1622.17 79.1567 1622.17C81.9987 1622.17 84.3343 1620.03 84.3343 1617.07C84.3343 1613.66 81.623 1611.92 79.124 1611.92ZM79.1567 1613.92C80.6593 1613.92 82.0803 1615.1 82.0803 1617.04C82.0803 1618.92 80.6593 1620.14 79.1567 1620.14C77.4907 1620.14 76.184 1618.82 76.184 1617.02C76.1677 1615.25 77.458 1613.92 79.1567 1613.92ZM90.2797 1611.92C87.4867 1611.92 85.2817 1614.32 85.2817 1617.04C85.2817 1620.12 87.8297 1622.17 90.2307 1622.17C91.717 1622.17 92.501 1621.59 93.089 1620.92V1621.93C93.089 1623.7 91.9947 1624.75 90.3613 1624.75C88.777 1624.75 87.9767 1623.58 87.699 1622.93L85.7063 1623.76C86.4087 1625.24 87.846 1626.79 90.3777 1626.79C93.1543 1626.79 95.2777 1625.06 95.2777 1621.44V1612.23H93.089V1613.09C92.403 1612.37 91.4883 1611.92 90.2797 1611.92ZM90.4757 1613.93C91.8477 1613.93 93.2523 1615.09 93.2523 1617.05C93.2523 1619.05 91.8477 1620.16 90.443 1620.16C88.9567 1620.16 87.5683 1618.97 87.5683 1617.07C87.5683 1615.1 89.0057 1613.93 90.4757 1613.93ZM104.963 1611.9C102.334 1611.9 100.112 1613.96 100.112 1617.02C100.112 1620.25 102.579 1622.15 105.225 1622.15C107.43 1622.15 108.769 1620.97 109.586 1619.91L107.789 1618.73C107.315 1619.44 106.548 1620.14 105.241 1620.14C103.771 1620.14 103.101 1619.34 102.693 1618.58L109.667 1615.74L109.308 1614.91C108.606 1613.27 107.038 1611.9 104.963 1611.9ZM105.045 1613.87C105.992 1613.87 106.678 1614.37 106.972 1614.96L102.317 1616.87C102.121 1615.39 103.542 1613.87 105.045 1613.87ZM96.7803 1621.86H99.067V1606.75H96.7803V1621.86Z"
                fill="#5F6368"
              />
            </svg>
          </a>
          <a
            href="https://about.google/"
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline hover:no-underline hover:text-[#202124] transition-colors whitespace-nowrap"
          >
            About Google
          </a>
          <a
            href="https://about.google/products/"
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline hover:no-underline hover:text-[#202124] transition-colors whitespace-nowrap"
          >
            Google products
          </a>
        </div>
      </footer>
    </div>
  );
};

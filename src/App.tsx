import React, { useState, useEffect, useRef, useCallback } from 'react';
import QRCode from 'qrcode';
import { X } from 'lucide-react';
import { Header } from './components/Header';
import { MobileRemoteKeyboard } from './components/MobileRemoteKeyboard';
import { KeyDefinition } from './types/keyboard';
import { pairingSocket } from './utils/pairingSocket';
import { soundEngine } from './utils/soundEngine';
import { DeviceInfo, detectDeviceAsync, isGooglePixelDevice } from './utils/deviceDetector';
import { MultiTabModal } from './components/MultiTabModal';
import { ConnectedDesktopView } from './components/ConnectedDesktopView';
import { MobileLandingView } from './components/MobileLandingView';
import { NotPixelFailedView } from './components/NotPixelFailedView';
import { generateExtensionZip } from './utils/extensionGenerator';

function generateRoomId(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let result = 'KV-';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function detectIsMobileClient(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent || '';
  const hasMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(ua);
  const nav = navigator as unknown as { userAgentData?: { mobile?: boolean } };
  const hasClientHintMobile = Boolean(nav.userAgentData?.mobile);
  const hasTouchOnlyInput = Boolean(
    window.matchMedia?.('(hover: none) and (pointer: coarse)')?.matches
  );
  const isPhoneLandscapeViewport =
    window.innerWidth > window.innerHeight && window.innerHeight < 520;
  const isNarrowViewport = window.innerWidth < 768;
  return (
    hasMobileUA ||
    hasClientHintMobile ||
    hasTouchOnlyInput ||
    isPhoneLandscapeViewport ||
    isNarrowViewport
  );
}

export default function App() {
  const [text, setText] = useState<string>('');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isMultiTabModalOpen, setIsMultiTabModalOpen] = useState<boolean>(false);
  const [isDesktopInfoOpen, setIsDesktopInfoOpen] = useState<boolean>(false);
  const [isMobileInfoOpen, setIsMobileInfoOpen] = useState<boolean>(false);
  const [autoCopyClipboard, setAutoCopyClipboard] = useState<boolean>(true);
  const [isDownloadingExtension, setIsDownloadingExtension] = useState<boolean>(false);
  const [isMobileView, setIsMobileView] = useState<boolean>(() => detectIsMobileClient());

  // Re-evaluate mobile/desktop view on resize or device orientation change (keeps mobile view even when rotated)
  useEffect(() => {
    const updateDeviceView = () => {
      setIsMobileView(detectIsMobileClient());
    };
    window.addEventListener('resize', updateDeviceView);
    window.addEventListener('orientationchange', updateDeviceView);
    return () => {
      window.removeEventListener('resize', updateDeviceView);
      window.removeEventListener('orientationchange', updateDeviceView);
    };
  }, []);

  // Direct one-click download for extension zip from landing page
  const handleDownloadExtension = async () => {
    try {
      setIsDownloadingExtension(true);
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const zipBlob = await generateExtensionZip(roomId, origin);
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Pixel-Virtualboard-Extension-${roomId}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => {
        URL.revokeObjectURL(url);
        setIsDownloadingExtension(false);
      }, 1500);
    } catch (err) {
      console.error('Failed to generate extension zip:', err);
      setIsDownloadingExtension(false);
      setIsMultiTabModalOpen(true);
    }
  };

  // Check Document Picture-in-Picture API support
  const isPipSupported = typeof window !== 'undefined' && 'documentPictureInPicture' in window;
  const pipWindowRef = useRef<Window | null>(null);

  // Pairing State
  const [roomId, setRoomId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('keyvibe_room_id');
      if (saved) return saved;
      const created = generateRoomId();
      localStorage.setItem('keyvibe_room_id', created);
      return created;
    }
    return generateRoomId();
  });
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [connectedRemotesCount, setConnectedRemotesCount] = useState<number>(0);
  const [lastConnectedDevice, setLastConnectedDevice] = useState<string | null>(null);
  const [connectedDeviceInfo, setConnectedDeviceInfo] = useState<DeviceInfo | null>(null);

  // Detect if opened as Remote Smartphone via URL parameter: ?remote=ROOM_ID
  const [remoteRoomCode, setRemoteRoomCode] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('remote');
    }
    return null;
  });
  const [remoteEligibility, setRemoteEligibility] = useState<'checking' | 'pixel' | 'not-pixel'>('checking');

  // Verify scanned QR device is strictly a Google Pixel before allowing remote pairing
  useEffect(() => {
    if (!remoteRoomCode) {
      setRemoteEligibility('checking');
      return;
    }

    let cancelled = false;
    setRemoteEligibility('checking');

    detectDeviceAsync()
      .then((info) => {
        if (cancelled) return;
        setRemoteEligibility(isGooglePixelDevice(info) ? 'pixel' : 'not-pixel');
      })
      .catch(() => {
        if (cancelled) return;
        setRemoteEligibility('not-pixel');
      });

    return () => {
      cancelled = true;
    };
  }, [remoteRoomCode]);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Sync live text with Floating PiP Window if opened
  useEffect(() => {
    if (pipWindowRef.current && !pipWindowRef.current.closed) {
      const pipDoc = pipWindowRef.current.document;
      const textDisplay = pipDoc.getElementById('pip-live-text');
      if (textDisplay) {
        textDisplay.textContent = text || '(Menunggu ketikan dari smartphone...)';
      }
    }

    // Auto-copy to clipboard if enabled
    if (autoCopyClipboard && text && typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
  }, [text, autoCopyClipboard]);

  // Handle opening floating Picture-in-Picture window
  const handleOpenPipWindow = async () => {
    if (!isPipSupported || typeof window === 'undefined') {
      setIsMultiTabModalOpen(true);
      return;
    }

    try {
      const pip = (window as unknown as {
        documentPictureInPicture: {
          requestWindow: (options: { width: number; height: number }) => Promise<Window>;
        };
      }).documentPictureInPicture;

      const pipWin = await pip.requestWindow({
        width: 440,
        height: 320,
      });

      pipWindowRef.current = pipWin;

      // Setup styling in PiP window
      pipWin.document.title = `Pixel Virtual Keyboard (${roomId})`;
      pipWin.document.body.style.cssText =
        'margin:0;padding:16px;background:#000;color:#f4f4f5;font-family:Inter,system-ui,sans-serif;height:100vh;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;';

      pipWin.document.body.innerHTML = `
        <div style="border-bottom:1px solid #27272a;padding-bottom:8px;margin-bottom:12px;display:flex;align-items:center;justify-content:space-between;">
          <div style="display:flex;align-items:center;gap:6px;font-size:12px;font-weight:bold;">
            <span style="width:8px;height:8px;background:#10b981;display:inline-block;"></span>
            <span>Pixel Virtual Keyboard</span>
            <span style="color:#71717a;font-family:monospace;font-size:11px;">(${roomId})</span>
          </div>
          <span style="font-size:10px;background:#27272a;padding:2px 6px;color:#38bdf8;">Always-on-Top</span>
        </div>
        <div id="pip-live-text" style="flex:1;background:#09090b;padding:12px;border:1px solid #27272a;font-size:15px;line-height:1.5;overflow-y:auto;white-space:pre-wrap;word-break:break-word;">
          ${text || '(Menunggu ketikan dari smartphone...)'}
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;padding-top:10px;font-size:11px;">
          <span style="color:#a1a1aa;">Otomatis tersalin ke papan klip</span>
          <button id="pip-copy-btn" style="background:#0284c7;color:#fff;border:none;padding:6px 12px;font-size:11px;font-weight:bold;cursor:pointer;">
            Salin Teks
          </button>
        </div>
      `;

      const copyBtn = pipWin.document.getElementById('pip-copy-btn');
      if (copyBtn) {
        copyBtn.onclick = () => {
          navigator.clipboard.writeText(text).then(() => {
            copyBtn.textContent = 'Tersalin!';
            setTimeout(() => {
              copyBtn.textContent = 'Salin Teks';
            }, 1500);
          });
        };
      }
    } catch (err) {
      console.warn('Could not open PiP window:', err);
      setIsMultiTabModalOpen(true);
    }
  };

  // Pairing URL for QR code
  const pairingUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?remote=${roomId}`
    : '';

  // Generate QR Code Barcode for desktop initial view
  useEffect(() => {
    if (pairingUrl) {
      QRCode.toDataURL(pairingUrl, {
        width: 320,
        margin: 0,
        color: {
          dark: '#174EA6',
          light: '#00000000',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('Failed to generate QR code', err));
    }
  }, [pairingUrl]);

  // Close info modals on Escape key
  useEffect(() => {
    if (!isDesktopInfoOpen && !isMobileInfoOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDesktopInfoOpen(false);
        setIsMobileInfoOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDesktopInfoOpen, isMobileInfoOpen]);

  // Ensure main desktop landing page stays in Light mode when not in remote smartphone mode
  useEffect(() => {
    if (!remoteRoomCode) {
      document.documentElement.classList.remove('dark');
    }
  }, [remoteRoomCode]);

  // Insert character or action into textarea at current caret position
  const insertAtCaret = useCallback((char: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setText((prev) => prev + char);
      return;
    }

    const start = textarea.selectionStart ?? textarea.value.length;
    const end = textarea.selectionEnd ?? textarea.value.length;
    const current = textarea.value;

    const updated = current.substring(0, start) + char + current.substring(end);
    setText(updated);

    // Reposition cursor right after inserted text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + char.length, start + char.length);
    }, 0);
  }, []);

  // Backspace at caret
  const handleBackspace = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setText((prev) => prev.slice(0, -1));
      return;
    }

    const start = textarea.selectionStart ?? textarea.value.length;
    const end = textarea.selectionEnd ?? textarea.value.length;
    const current = textarea.value;

    if (start === end) {
      if (start > 0) {
        const updated = current.substring(0, start - 1) + current.substring(end);
        setText(updated);
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start - 1, start - 1);
        }, 0);
      }
    } else {
      const updated = current.substring(0, start) + current.substring(end);
      setText(updated);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start, start);
      }, 0);
    }
  }, []);

  // Process Key Action received from smartphone
  const processKeyAction = useCallback((key: KeyDefinition, isShiftActiveOverride?: boolean, modifiers?: { ctrl?: boolean; alt?: boolean; shift?: boolean; meta?: boolean }) => {
    soundEngine.playThock(key.type === 'space' || key.type === 'enter');

    // Handle Ctrl shortcuts in text workspace
    if (modifiers?.ctrl && (key.code === 'KeyZ' || key.label.toLowerCase() === 'z')) {
      if (document.queryCommandSupported('undo')) {
        document.execCommand('undo');
      }
      return;
    }

    if (key.type === 'char') {
      const isShifted = Boolean(isShiftActiveOverride || modifiers?.shift);
      const toInsert = isShifted ? (key.shiftLabel || key.label.toUpperCase()) : key.label;
      insertAtCaret(toInsert);
    } else if (key.type === 'space') {
      insertAtCaret(' ');
    } else if (key.type === 'enter') {
      insertAtCaret('\n');
    } else if (key.type === 'tab') {
      insertAtCaret('  ');
    } else if (key.type === 'backspace') {
      handleBackspace();
    }
  }, [insertAtCaret, handleBackspace]);

  // Stable ref for WebSocket listener
  const processKeyActionRef = useRef(processKeyAction);
  processKeyActionRef.current = processKeyAction;

  // Initialize Host WebSocket Connection (Laptop)
  useEffect(() => {
    if (remoteRoomCode) return; // In remote mode, don't run as host

    pairingSocket.connectAsHost(roomId, {
      onRemoteConnected: (device, totalRemotes) => {
        // Strict Google Pixel-only enforcement on host side
        if (!isGooglePixelDevice(device)) return;
        setConnectedRemotesCount(totalRemotes);
        setLastConnectedDevice(device.name);
        setConnectedDeviceInfo(device);
        soundEngine.playPixelPairChime();
      },
      onRemoteDisconnected: (totalRemotes) => {
        setConnectedRemotesCount(totalRemotes);
      },
      onRemoteKeystroke: (key, isShifted, modifiers) => {
        processKeyActionRef.current(key, isShifted, modifiers);
      },
    });

    return () => {
      pairingSocket.cleanup();
    };
  }, [roomId, remoteRoomCode]);

  const handleDisconnectRemote = () => {
    const newId = generateRoomId();
    localStorage.setItem('keyvibe_room_id', newId);
    setRoomId(newId);
    setConnectedRemotesCount(0);
    setLastConnectedDevice(null);
    setConnectedDeviceInfo(null);
  };

  const handleExitRemoteMode = useCallback(() => {
    // Remove ?remote param so non-Pixel users return directly to SVG 1 landing page
    window.history.replaceState({}, '', window.location.pathname);
    setRemoteRoomCode(null);
    setRemoteEligibility('checking');
  }, []);

  // If this device opened with ?remote=CODE, verify Google Pixel eligibility first
  if (remoteRoomCode) {
    if (remoteEligibility === 'checking') {
      return (
        <div className="min-h-dvh w-full bg-white text-[#202124] flex flex-col font-['Inter']">
          <Header
            darkMode={false}
            onToggleDarkMode={() => {}}
            showOnlyOnPixel={false}
          />
        </div>
      );
    }

    if (remoteEligibility === 'not-pixel') {
      return <NotPixelFailedView onBack={handleExitRemoteMode} />;
    }

    return (
      <MobileRemoteKeyboard
        roomId={remoteRoomCode}
        onExitRemoteMode={handleExitRemoteMode}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((prev) => !prev)}
      />
    );
  }

  // Otherwise, render Laptop View scaled responsively to user screen size
  return (
    <div className="min-h-dvh w-full bg-white text-black flex flex-col font-['Inter'] selection:bg-sky-100 selection:text-sky-900 transition-colors">
      {/* Top Bar Header */}
      <Header
        darkMode={false}
        onToggleDarkMode={() => {}}
        connectedRemotesCount={connectedRemotesCount}
        lastConnectedDevice={lastConnectedDevice}
        roomId={roomId}
        onDisconnectRemote={handleDisconnectRemote}
        onOpenMultiTabModal={() => setIsMultiTabModalOpen(true)}
        showOnlyOnPixel={connectedRemotesCount === 0 && !isMobileView}
      />

      {/* Main Viewport */}
      <main
        className={`flex-1 w-full flex flex-col justify-center min-h-0 ${
          connectedRemotesCount === 0 && isMobileView
            ? 'px-0 py-0'
            : 'max-w-[1140px] mx-auto px-5 sm:px-8 lg:px-12 py-4 sm:py-6'
        }`}
      >
        {connectedRemotesCount === 0 ? (
          isMobileView ? (
            /* Mobile Initial Landing View matching iPhone 17 SVG 1 (Portrait & Landscape, no QR barcode) */
            <MobileLandingView onOpenMoreInfo={() => setIsMobileInfoOpen(true)} />
          ) : (
            /* SVG 1: Desktop Initial View (Fits user viewport height & width cleanly) */
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center w-full animate-in fade-in duration-300 my-auto">
              {/* Left Column: Headline, Numbered steps, More info button */}
              <div className="md:col-span-7 flex flex-col justify-center text-left max-w-xl">
                <h1 className="font-['Google_Sans_Flex'] text-[clamp(2.15rem,4.4vw,3.875rem)] font-medium tracking-tight text-[#202124] leading-[1.12] mb-[clamp(1.25rem,3.2vh,2.75rem)]">
                  Your Control,<br />
                  Always on your Pixel.
                </h1>

                <ol className="space-y-3 sm:space-y-4 text-[#202124] text-[clamp(0.9rem,1.25vw,1rem)] leading-relaxed mb-[clamp(1.25rem,3.2vh,2.75rem)]">
                  <li className="flex items-start gap-2.5">
                    <span className="font-normal text-[#575757]">1.</span>
                    <div>
                      Download{' '}
                      <button
                        type="button"
                        onClick={handleDownloadExtension}
                        disabled={isDownloadingExtension}
                        className="text-[#1A73E8] hover:underline font-medium cursor-pointer bg-transparent border-0 p-0 inline"
                      >
                        Extension
                      </button>
                      , Install<br className="hidden sm:inline" /> extension in your browser.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-normal text-[#575757]">2.</span>
                    <span>Scan the QR Code with your Pixel.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-normal text-[#575757]">3.</span>
                    <span>Finish. You&apos;re ready to go.</span>
                  </li>
                </ol>

                <div>
                  <button
                    type="button"
                    onClick={() => setIsDesktopInfoOpen(true)}
                    className="rounded-full border border-[#eaeaea] text-[#1A73E8] bg-white hover:bg-[#1A73E8] hover:text-white hover:border-[#1A73E8] px-7 py-2.5 text-sm font-medium transition-colors cursor-pointer"
                  >
                    More info
                  </button>
                </div>
              </div>

              {/* Right Column: #A8C7FA Rounded Square with #174EA6 QR Code */}
              <div className="md:col-span-5 flex justify-end">
                <div className="w-[min(46vh,340px)] h-[min(46vh,340px)] lg:w-[min(52vh,390px)] lg:h-[min(52vh,390px)] bg-[#A8C7FA] rounded-[clamp(2.25rem,5vh,3.625rem)] p-[clamp(2rem,4.5vh,3.5rem)] flex items-center justify-center shadow-xs select-none transition-transform hover:scale-[1.01]">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt="Scan QR Code with your Pixel"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-xs text-[#174EA6] font-medium">
                      Generating QR Code...
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        ) : (
          /* SVG 3: Desktop Connected View */
          <ConnectedDesktopView
            device={connectedDeviceInfo}
            deviceName={lastConnectedDevice}
            text={text}
            setText={setText}
            textareaRef={textareaRef}
            onDisconnect={handleDisconnectRemote}
            onOpenMultiTabModal={() => setIsMultiTabModalOpen(true)}
            onOpenPipWindow={handleOpenPipWindow}
            isPipSupported={isPipSupported}
            autoCopyClipboard={autoCopyClipboard}
            onToggleAutoCopy={() => setAutoCopyClipboard((prev) => !prev)}
          />
        )}
      </main>

      {/* SVG 2: Desktop "More info" Modal (Install an Extension) */}
      {isDesktopInfoOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/35 backdrop-blur-[1px] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150"
          onClick={() => setIsDesktopInfoOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="desktop-install-ext-title"
        >
          <div
            className="bg-white dark:bg-zinc-950 border border-[#eaeaea] dark:border-zinc-800 rounded-2xl sm:rounded-3xl max-w-2xl w-full p-7 sm:p-10 shadow-xl relative text-left animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsDesktopInfoOpen(false)}
              aria-label="Close modal"
              className="absolute top-5 right-5 p-2 rounded-full text-[#575757] dark:text-zinc-400 hover:text-[#202124] dark:hover:text-white hover:bg-stone-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer bg-transparent border-0"
            >
              <X className="w-5 h-5" />
            </button>

            <h2
              id="desktop-install-ext-title"
              className="text-2xl sm:text-[28px] font-medium text-[#202124] dark:text-white mb-6 pr-8"
            >
              Install an Extension
            </h2>

            <ol className="space-y-4 text-sm sm:text-[15px] text-[#575757] dark:text-zinc-300 leading-relaxed">
              <li className="flex items-start gap-2.5">
                <span className="font-semibold text-[#202124] dark:text-white">1.</span>
                <div>
                  <strong className="font-semibold text-[#202124] dark:text-white">
                    Open the Extensions Page
                  </strong>
                  <p className="mt-1">
                    Type{' '}
                    <code className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-zinc-900 text-[#202124] dark:text-zinc-200 font-mono text-xs sm:text-sm">
                      chrome://extensions
                    </code>{' '}
                    in the browser&rsquo;s address bar, then press Enter. Alternatively, click the three-dot icon in the top-right corner &gt; select Extensions &gt; Manage Extensions.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <span className="font-semibold text-[#202124] dark:text-white">2.</span>
                <div>
                  <strong className="font-semibold text-[#202124] dark:text-white">
                    Enable Developer Mode
                  </strong>
                  <p className="mt-1">
                    In the top-right corner of the Extensions page, click the toggle button to enable Developer Mode.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <span className="font-semibold text-[#202124] dark:text-white">3.</span>
                <div>
                  <strong className="font-semibold text-[#202124] dark:text-white">
                    Load an Extension Folder
                  </strong>
                  <p className="mt-1">
                    Click the &ldquo;Load unpacked&rdquo; button in the top-left corner, then locate and select your extension directory folder on your computer.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <span className="font-semibold text-[#202124] dark:text-white">4.</span>
                <div>
                  <strong className="font-semibold text-[#202124] dark:text-white">
                    Success Verification
                  </strong>
                  <p className="mt-1">
                    The extension will immediately appear on the page and be active.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      )}

      {/* SVG 5: Mobile "More info" Modal (How to use it) */}
      {isMobileInfoOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/35 backdrop-blur-[1px] flex items-center justify-center p-5 animate-in fade-in duration-150"
          onClick={() => setIsMobileInfoOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-how-to-use-title"
        >
          <div
            className="bg-white dark:bg-zinc-950 border border-[#eaeaea] dark:border-zinc-800 rounded-2xl max-w-sm w-full p-6 sm:p-7 shadow-xl relative text-left animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsMobileInfoOpen(false)}
              aria-label="Close modal"
              className="absolute top-4 right-4 p-1.5 rounded-full text-[#575757] dark:text-zinc-400 hover:text-[#202124] dark:hover:text-white hover:bg-stone-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer bg-transparent border-0"
            >
              <X className="w-4 h-4" />
            </button>

            <h2
              id="mobile-how-to-use-title"
              className="text-xl font-medium text-[#202124] dark:text-white mb-3 pr-7"
            >
              How to use it
            </h2>

            <p className="text-sm text-[#575757] dark:text-zinc-400 leading-relaxed">
              To use this feature, please access the page via a desktop browser, scan the QR code with your Pixel, and begin controlling your browser remotely.
            </p>
          </div>
        </div>
      )}

      {/* Universal Multi-Tab Modal */}
      <MultiTabModal
        isOpen={isMultiTabModalOpen}
        onClose={() => setIsMultiTabModalOpen(false)}
        roomId={roomId}
        onOpenPip={handleOpenPipWindow}
        isPipSupported={isPipSupported}
      />
    </div>
  );
}

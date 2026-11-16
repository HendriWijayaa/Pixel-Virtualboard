import React, { useState, useEffect, useCallback, useRef } from 'react';
import { KeyDefinition } from '../types/keyboard';
import { pairingSocket } from '../utils/pairingSocket';
import { soundEngine } from '../utils/soundEngine';
import { DeviceInfo, detectDevice, detectDeviceAsync } from '../utils/deviceDetector';
import {
  Smartphone,
  Sun,
  Moon,
  ArrowLeft,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Monitor,
  Gamepad2,
  Keyboard,
  X,
  LogOut,
  Trash2,
  Undo2,
  Redo2,
  Crosshair,
} from 'lucide-react';
import { ArcadeController } from './ArcadeController';
import { PixelKeyboardIcon } from './Header';

export type MobileThemeMode = 'light' | 'oled';

interface MobileRemoteKeyboardProps {
  roomId: string;
  onExitRemoteMode: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

interface PixelKeySpec extends KeyDefinition {
  growClass: string;
  align?: 'left' | 'right' | 'center';
  topSymbol?: string;
  bottomSymbol?: string;
  iconId?: 'gemini' | 'arrowLeft' | 'arrowRight';
}

const PIXEL_ROW_1: PixelKeySpec[] = [
  { code: 'Backquote', label: '`', shiftLabel: '~', topSymbol: '~', bottomSymbol: '`', type: 'char', growClass: 'grow-[53]' },
  { code: 'Digit1', label: '1', shiftLabel: '!', topSymbol: '!', bottomSymbol: '1', type: 'char', growClass: 'grow-[53]' },
  { code: 'Digit2', label: '2', shiftLabel: '@', topSymbol: '@', bottomSymbol: '2', type: 'char', growClass: 'grow-[53]' },
  { code: 'Digit3', label: '3', shiftLabel: '#', topSymbol: '#', bottomSymbol: '3', type: 'char', growClass: 'grow-[53]' },
  { code: 'Digit4', label: '4', shiftLabel: '$', topSymbol: '$', bottomSymbol: '4', type: 'char', growClass: 'grow-[54]' },
  { code: 'Digit5', label: '5', shiftLabel: '%', topSymbol: '%', bottomSymbol: '5', type: 'char', growClass: 'grow-[53]' },
  { code: 'Digit6', label: '6', shiftLabel: '^', topSymbol: '^', bottomSymbol: '6', type: 'char', growClass: 'grow-[54]' },
  { code: 'Digit7', label: '7', shiftLabel: '&', topSymbol: '&', bottomSymbol: '7', type: 'char', growClass: 'grow-[53]' },
  { code: 'Digit8', label: '8', shiftLabel: '*', topSymbol: '*', bottomSymbol: '8', type: 'char', growClass: 'grow-[54]' },
  { code: 'Digit9', label: '9', shiftLabel: '(', topSymbol: '(', bottomSymbol: '9', type: 'char', growClass: 'grow-[53]' },
  { code: 'Digit0', label: '0', shiftLabel: ')', topSymbol: ')', bottomSymbol: '0', type: 'char', growClass: 'grow-[54]' },
  { code: 'Minus', label: '-', shiftLabel: '_', topSymbol: '_', bottomSymbol: '-', type: 'char', growClass: 'grow-[53]' },
  { code: 'Equal', label: '=', shiftLabel: '+', topSymbol: '+', bottomSymbol: '=', type: 'char', growClass: 'grow-[54]' },
  { code: 'Backspace', label: 'backspace', type: 'backspace', growClass: 'grow-[82]', align: 'right' },
];

const PIXEL_ROW_2: PixelKeySpec[] = [
  { code: 'Tab', label: 'tab', type: 'tab', growClass: 'grow-[82]', align: 'left' },
  { code: 'KeyQ', label: 'q', shiftLabel: 'Q', type: 'char', growClass: 'grow-[53]' },
  { code: 'KeyW', label: 'w', shiftLabel: 'W', type: 'char', growClass: 'grow-[54]' },
  { code: 'KeyE', label: 'e', shiftLabel: 'E', type: 'char', growClass: 'grow-[53]' },
  { code: 'KeyR', label: 'r', shiftLabel: 'R', type: 'char', growClass: 'grow-[53]' },
  { code: 'KeyT', label: 't', shiftLabel: 'T', type: 'char', growClass: 'grow-[53]' },
  { code: 'KeyY', label: 'y', shiftLabel: 'Y', type: 'char', growClass: 'grow-[53]' },
  { code: 'KeyU', label: 'u', shiftLabel: 'U', type: 'char', growClass: 'grow-[53]' },
  { code: 'KeyI', label: 'i', shiftLabel: 'I', type: 'char', growClass: 'grow-[53]' },
  { code: 'KeyO', label: 'o', shiftLabel: 'O', type: 'char', growClass: 'grow-[54]' },
  { code: 'KeyP', label: 'p', shiftLabel: 'P', type: 'char', growClass: 'grow-[53]' },
  { code: 'BracketLeft', label: '[', shiftLabel: '{', topSymbol: '{', bottomSymbol: '[', type: 'char', growClass: 'grow-[54]' },
  { code: 'BracketRight', label: ']', shiftLabel: '}', topSymbol: '}', bottomSymbol: ']', type: 'char', growClass: 'grow-[53]' },
  { code: 'Backslash', label: '\\', shiftLabel: '|', topSymbol: '|', bottomSymbol: '\\', type: 'char', growClass: 'grow-[54]' },
];

const PIXEL_ROW_3: PixelKeySpec[] = [
  { code: 'CapsLock', label: 'caps', type: 'caps', growClass: 'grow-[97]', align: 'left' },
  { code: 'KeyA', label: 'a', shiftLabel: 'A', type: 'char', growClass: 'grow-[53]' },
  { code: 'KeyS', label: 's', shiftLabel: 'S', type: 'char', growClass: 'grow-[53]' },
  { code: 'KeyD', label: 'd', shiftLabel: 'D', type: 'char', growClass: 'grow-[53]' },
  { code: 'KeyF', label: 'f', shiftLabel: 'F', type: 'char', growClass: 'grow-[53]' },
  { code: 'KeyG', label: 'g', shiftLabel: 'G', type: 'char', growClass: 'grow-[53]' },
  { code: 'KeyH', label: 'h', shiftLabel: 'H', type: 'char', growClass: 'grow-[54]' },
  { code: 'KeyJ', label: 'j', shiftLabel: 'J', type: 'char', growClass: 'grow-[53]' },
  { code: 'KeyK', label: 'k', shiftLabel: 'K', type: 'char', growClass: 'grow-[54]' },
  { code: 'KeyL', label: 'l', shiftLabel: 'L', type: 'char', growClass: 'grow-[53]' },
  { code: 'Semicolon', label: ';', shiftLabel: ':', topSymbol: ':', bottomSymbol: ';', type: 'char', growClass: 'grow-[54]' },
  { code: 'Quote', label: "'", shiftLabel: '"', topSymbol: '"', bottomSymbol: "'", type: 'char', growClass: 'grow-[53]' },
  { code: 'Enter', label: 'enter', type: 'enter', growClass: 'grow-[98]', align: 'right' },
];

const PIXEL_ROW_4: PixelKeySpec[] = [
  { code: 'ShiftLeft', label: 'shift', type: 'shift', growClass: 'grow-[128]', align: 'left' },
  { code: 'KeyZ', label: 'z', shiftLabel: 'Z', type: 'char', growClass: 'grow-[53]' },
  { code: 'KeyX', label: 'x', shiftLabel: 'X', type: 'char', growClass: 'grow-[54]' },
  { code: 'KeyC', label: 'c', shiftLabel: 'C', type: 'char', growClass: 'grow-[53]' },
  { code: 'KeyV', label: 'v', shiftLabel: 'V', type: 'char', growClass: 'grow-[54]' },
  { code: 'KeyB', label: 'b', shiftLabel: 'B', type: 'char', growClass: 'grow-[53]' },
  { code: 'KeyN', label: 'n', shiftLabel: 'N', type: 'char', growClass: 'grow-[54]' },
  { code: 'KeyM', label: 'm', shiftLabel: 'M', type: 'char', growClass: 'grow-[53]' },
  { code: 'Comma', label: ',', shiftLabel: '<', topSymbol: '<', bottomSymbol: ',', type: 'char', growClass: 'grow-[54]' },
  { code: 'Period', label: '.', shiftLabel: '>', topSymbol: '>', bottomSymbol: '.', type: 'char', growClass: 'grow-[53]' },
  { code: 'Slash', label: '/', shiftLabel: '?', topSymbol: '?', bottomSymbol: '/', type: 'char', growClass: 'grow-[54]' },
  { code: 'ShiftRight', label: 'shift', type: 'shift', growClass: 'grow-[127]', align: 'right' },
];

export const MobileRemoteKeyboard: React.FC<MobileRemoteKeyboardProps> = ({
  roomId,
  onExitRemoteMode,
  darkMode,
}) => {
  const [hostOnline, setHostOnline] = useState<boolean>(false);
  const [hostComputerName, setHostComputerName] = useState<string>('Komputer Host');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [volumePercent, setVolumePercent] = useState<number>(() =>
    Math.round(soundEngine.getVolume() * 100)
  );
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // Mobile Theme: 2 Mode Saja - 'light' | 'oled' (Dark OLED)
  const [mobileTheme, setMobileTheme] = useState<MobileThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pixel_keyboard_theme') as MobileThemeMode | null;
      if (saved === 'oled' || saved === 'light') return saved;
    }
    return darkMode ? 'oled' : 'light';
  });

  // Mode: 'keyboard' (Virtual QWERTY) or 'arcade' (Arcade Button Controller)
  const [remoteMode, setRemoteMode] = useState<'keyboard' | 'arcade'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pixel_remote_mode');
      if (saved === 'arcade' || saved === 'keyboard') return saved;
    }
    return 'keyboard';
  });

  const handleToggleRemoteMode = () => {
    const nextMode = remoteMode === 'keyboard' ? 'arcade' : 'keyboard';
    setRemoteMode(nextMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('pixel_remote_mode', nextMode);
    }
  };

  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [capsLock, setCapsLock] = useState<boolean>(false);
  const [shift, setShift] = useState<boolean>(false);
  const [ctrl, setCtrl] = useState<boolean>(false);
  const [alt, setAlt] = useState<boolean>(false);

  // De-duplication ref to strictly prevent double-typing on touch/mouse synthetic events
  const lastPressTimeRef = useRef<{ code: string; time: number }>({ code: '', time: 0 });

  // Sync theme changes
  const handleSetTheme = (theme: MobileThemeMode) => {
    setMobileTheme(theme);
    localStorage.setItem('pixel_keyboard_theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  const handleToggleTheme = () => {
    handleSetTheme(mobileTheme === 'light' ? 'oled' : 'light');
  };

  // Device Detection State with Async High Entropy Client Hints
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => detectDevice());

  useEffect(() => {
    detectDeviceAsync().then((detected) => {
      setDeviceInfo(detected);
      pairingSocket.updateDeviceInfo(detected);
    });
  }, []);

  // Connect to room via WebSocket & play Google Pixel connection sound when paired
  useEffect(() => {
    pairingSocket.connectAsRemote(roomId, {
      onPairedSuccess: (isHostUp, hostInfo) => {
        setHostOnline(isHostUp);
        if (hostInfo) setHostComputerName(hostInfo);
        if (isHostUp) {
          soundEngine.playPixelPairChime();
        }
      },
      onHostOnline: (hostInfo) => {
        setHostOnline(true);
        if (hostInfo) setHostComputerName(hostInfo);
        soundEngine.playPixelPairChime();
      },
      onHostOffline: () => {
        setHostOnline(false);
      },
    });

    return () => {
      pairingSocket.cleanup();
    };
  }, [roomId]);

  // Track Fullscreen status
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const flashKeyVisual = useCallback((flashId: string) => {
    setActiveKeys((prev) => {
      const next = new Set(prev);
      next.add(flashId);
      return next;
    });
    setTimeout(() => {
      setActiveKeys((prev) => {
        const next = new Set(prev);
        next.delete(flashId);
        return next;
      });
    }, 110);
  }, []);

  const triggerFeedback = useCallback((isLargeKey: boolean = false) => {
    soundEngine.unlockAudio();
    if (soundEnabled && volumePercent > 0) {
      soundEngine.playThock(isLargeKey);
    }
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(12);
      } catch {
        // ignore
      }
    }
  }, [soundEnabled, volumePercent]);

  const handleKeyPress = useCallback((key: KeyDefinition) => {
    triggerFeedback(key.type === 'space' || key.type === 'enter');
    flashKeyVisual(key.code);

    const isShifted = (shift && !capsLock) || (!shift && capsLock);

    pairingSocket.sendKeystroke(key, isShifted, {
      ctrl,
      alt,
      shift: isShifted,
      meta: false,
    });

    if (key.type === 'caps') {
      setCapsLock((prev) => !prev);
    } else if (key.type === 'shift') {
      setShift((prev) => !prev);
    } else if (key.type === 'ctrl') {
      setCtrl((prev) => !prev);
    } else if (key.type === 'alt') {
      setAlt((prev) => !prev);
    } else if (key.type === 'char') {
      if (shift) setShift(false);
      if (ctrl) setCtrl(false);
      if (alt) setAlt(false);
    }
  }, [capsLock, shift, ctrl, alt, triggerFeedback, flashKeyVisual]);

  // Special Row 0 & Row 5 actions
  const handleSpecialAction = useCallback((
    actionId: string,
    keyToSend?: KeyDefinition,
    explicitModifiers?: { ctrl?: boolean; alt?: boolean; shift?: boolean; meta?: boolean },
    localSideEffect?: () => void
  ) => {
    const now = Date.now();
    if (lastPressTimeRef.current.code === actionId && (now - lastPressTimeRef.current.time) < 90) {
      return;
    }
    lastPressTimeRef.current = { code: actionId, time: now };

    triggerFeedback(false);
    flashKeyVisual(actionId);

    if (localSideEffect) {
      localSideEffect();
    }

    if (keyToSend) {
      pairingSocket.sendKeystroke(keyToSend, false, {
        ctrl: Boolean(explicitModifiers?.ctrl ?? ctrl),
        alt: Boolean(explicitModifiers?.alt ?? alt),
        shift: Boolean(explicitModifiers?.shift ?? shift),
        meta: Boolean(explicitModifiers?.meta),
      });
    }
  }, [ctrl, alt, shift, triggerFeedback, flashKeyVisual]);

  // Quick Action Trigger for 3D modeling & Blockbench shortcuts (accessible in Hamburger Menu)
  const handleTriggerQuickAction = (actionCode: 'Escape' | 'Delete' | 'Undo' | 'Redo' | 'Focus') => {
    triggerFeedback(false);

    if (actionCode === 'Escape') {
      pairingSocket.sendKeystroke({ code: 'Escape', label: 'Esc', type: 'action' }, false, { ctrl: false, alt: false, shift: false });
    } else if (actionCode === 'Delete') {
      pairingSocket.sendKeystroke({ code: 'Delete', label: 'Del', type: 'action' }, false, { ctrl: false, alt: false, shift: false });
    } else if (actionCode === 'Undo') {
      pairingSocket.sendKeystroke({ code: 'KeyZ', label: 'z', shiftLabel: 'Z', type: 'char' }, false, { ctrl: true, alt: false, shift: false });
    } else if (actionCode === 'Redo') {
      pairingSocket.sendKeystroke({ code: 'KeyY', label: 'y', shiftLabel: 'Y', type: 'char' }, false, { ctrl: true, alt: false, shift: false });
    } else if (actionCode === 'Focus') {
      pairingSocket.sendKeystroke({ code: 'KeyF', label: 'f', shiftLabel: 'F', type: 'char' }, false, { ctrl: false, alt: false, shift: false });
    }
  };

  // Safe user pointer interaction with de-duplication
  const handlePointerInteraction = (e: React.PointerEvent<HTMLButtonElement>, key: KeyDefinition) => {
    e.preventDefault();
    const now = Date.now();
    if (lastPressTimeRef.current.code === key.code && (now - lastPressTimeRef.current.time) < 90) {
      return;
    }
    lastPressTimeRef.current = { code: key.code, time: now };
    handleKeyPress(key);
  };

  const handleVolumeSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolumePercent(val);
    soundEngine.setVolume(val / 100);
    if (val === 0) {
      setSoundEnabled(false);
    } else if (!soundEnabled) {
      setSoundEnabled(true);
    }
  };

  const handleToggleMute = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    soundEngine.unlockAudio();
    if (soundEnabled && volumePercent > 0) {
      setSoundEnabled(false);
    } else {
      const nextVol = volumePercent === 0 ? 75 : volumePercent;
      setVolumePercent(nextVol);
      soundEngine.setVolume(nextVol / 100);
      setSoundEnabled(true);
      soundEngine.playThock();
    }
  };

  const isShifted = (shift && !capsLock) || (!shift && capsLock);
  const isOled = mobileTheme === 'oled';

  // Exact SVG 1 (Light) & SVG 2 (Dark OLED) Color Tokens
  const screenBgClass = isOled ? 'bg-black' : 'bg-white';
  const keySurfaceClass = isOled
    ? 'bg-[#121212] active:bg-[#1E1E1E]'
    : 'bg-[#D9D9D9] active:bg-[#C6C6C6]';
  const keyPressedClass = isOled ? 'bg-[#242424] scale-[0.98]' : 'bg-[#BFBFBF] scale-[0.98]';
  const sliderTrackBgClass = isOled ? 'bg-black' : 'bg-[#F9F9F9]';
  const keyTextClass = 'text-[#5F6368]';

  const getModifierActiveStyle = (isActive: boolean) => {
    if (!isActive) return '';
    return isOled
      ? 'ring-1 ring-[#8AB4F8]/80 bg-[#1B2230]'
      : 'ring-1 ring-[#1A73E8]/80 bg-[#D2E3FC]';
  };

  const getAlignmentClass = (align?: 'left' | 'right' | 'center') => {
    if (align === 'left') return 'items-start pl-2.5 sm:pl-3.5';
    if (align === 'right') return 'items-end pr-2.5 sm:pr-3.5';
    return 'items-center';
  };

  const renderStandardRow = (row: PixelKeySpec[], rowIndex: number) => (
    <div key={`px-row-${rowIndex}`} className="flex-1 flex items-stretch gap-1 sm:gap-1.5 w-full min-h-0">
      {row.map((key) => {
        const isPressed = activeKeys.has(key.code);
        const isCapsLockActive = key.code === 'CapsLock' && capsLock;
        const isShiftActive = (key.code === 'ShiftLeft' || key.code === 'ShiftRight') && shift;
        const isCtrlActive = (key.code === 'ControlLeft' || key.code === 'ControlRight') && ctrl;
        const isAltActive = (key.code === 'AltLeft' || key.code === 'AltRight') && alt;
        const isStickyActive = isCapsLockActive || isShiftActive || isCtrlActive || isAltActive;

        const letterLabel =
          key.type === 'char' && !key.topSymbol
            ? (isShifted ? key.label.toUpperCase() : key.label)
            : key.label;

        return (
          <button
            key={key.code}
            type="button"
            onPointerDown={(e) => handlePointerInteraction(e, key)}
            className={`
              relative basis-0 ${key.growClass} min-w-0 h-full min-h-0
              rounded-[4px] flex flex-col justify-center
              ${getAlignmentClass(key.align)}
              ${isPressed ? keyPressedClass : keySurfaceClass}
              ${getModifierActiveStyle(isStickyActive)}
              ${keyTextClass}
              font-['Inter'] touch-manipulation select-none transition-transform duration-75 cursor-pointer
            `}
          >
            {key.topSymbol && key.bottomSymbol ? (
              <div className="flex flex-col items-center justify-center leading-none gap-[3px]">
                <span
                  className={`text-[9px] sm:text-[11px] font-normal leading-none ${
                    isShifted ? 'font-semibold opacity-100' : 'opacity-90'
                  }`}
                >
                  {key.topSymbol}
                </span>
                <span
                  className={`text-[11px] sm:text-[13px] font-medium leading-none ${
                    !isShifted ? 'opacity-100' : 'opacity-75'
                  }`}
                >
                  {key.bottomSymbol}
                </span>
              </div>
            ) : (
              <span
                className={`leading-none tracking-tight ${
                  key.type === 'char'
                    ? 'text-[13px] sm:text-[16px] font-normal'
                    : 'text-[10px] sm:text-[12px] font-normal'
                } ${isStickyActive ? (isOled ? 'text-[#8AB4F8] font-medium' : 'text-[#1A73E8] font-medium') : ''}`}
              >
                {letterLabel}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <div
      className={`h-screen w-screen overflow-hidden ${
        remoteMode === 'arcade'
          ? isOled
            ? 'bg-black text-white'
            : 'bg-[#f7f6f2] text-stone-900'
          : `${screenBgClass} ${keyTextClass}`
      } font-['Inter'] flex flex-col justify-between select-none transition-colors`}
    >
      {/* SVG 6: Clean Portrait Header */}
      <header className="portrait:flex landscape:hidden items-center justify-between px-5 py-3.5 bg-white dark:bg-black border-b border-[#bebebe] dark:border-zinc-800 shrink-0 z-40 transition-colors">
        <div className="flex items-center gap-2.5 select-none shrink-0">
          <PixelKeyboardIcon className="w-[30px] h-auto shrink-0" />
          <span className="text-[17px] tracking-tight text-[#202124] dark:text-white font-['Inter'] flex items-center gap-1.5">
            <strong className="font-normal text-[#202124] dark:text-white">Pixel</strong>
            <span className="font-normal text-[#202124] dark:text-zinc-100">Virtualboard</span>
          </span>
        </div>

        <button
          type="button"
          onClick={handleToggleTheme}
          title={mobileTheme === 'oled' ? 'Mode Saat Ini: Dark (OLED) - Klik untuk Light' : 'Mode Saat Ini: Light - Klik untuk Dark (OLED)'}
          aria-label="Toggle Light / Dark OLED"
          className="p-1.5 bg-transparent border-0 opacity-85 hover:opacity-100 transition-opacity cursor-pointer text-[#575757] dark:text-zinc-300"
        >
          {mobileTheme === 'oled' ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-[#575757]" />
          )}
        </button>
      </header>

      {/* LANDSCAPE Header: Shown ONLY in Arcade Mode (Keyboard Mode fills 100% of screen per SVG 1 & SVG 2) */}
      <header
        className={`portrait:hidden ${
          remoteMode === 'arcade' ? 'landscape:flex' : 'landscape:hidden'
        } px-3 py-1 ${
          isOled ? 'bg-black border-zinc-900 text-white' : 'bg-white/95 border-[#e2ded6] text-stone-900'
        } border-b backdrop-blur-md items-center justify-between shrink-0 z-40 transition-colors`}
      >
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-black/5 dark:bg-white/5 border border-stone-300 dark:border-zinc-700 rounded-none shrink-0 text-xs">
            <Monitor className="w-3.5 h-3.5 text-sky-500 shrink-0" />
            <span className="font-semibold text-stone-900 dark:text-zinc-100 truncate max-w-[130px] sm:max-w-[200px]">
              {hostComputerName}
            </span>
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                hostOnline ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'
              }`}
            />
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium text-stone-600 dark:text-zinc-400 bg-black/5 dark:bg-white/5 border border-stone-300 dark:border-zinc-700 rounded-none truncate max-w-[150px]">
            <Smartphone className="w-3 h-3 text-emerald-500 shrink-0" />
            <span className="truncate">{deviceInfo.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleToggleRemoteMode}
            title={remoteMode === 'arcade' ? 'Beralih ke Keyboard Virtual (QWERTY)' : 'Beralih ke Mode Tombol Arcade (Gamepad)'}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold transition-all cursor-pointer rounded-none border ${
              remoteMode === 'arcade'
                ? 'bg-amber-500 border-amber-400 text-black shadow-xs'
                : 'bg-black/5 dark:bg-white/10 border-stone-300 dark:border-zinc-700 text-inherit hover:border-sky-500'
            }`}
          >
            {remoteMode === 'arcade' ? (
              <>
                <Gamepad2 className="w-3.5 h-3.5 text-inherit" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Arcade</span>
              </>
            ) : (
              <>
                <Keyboard className="w-3.5 h-3.5 text-inherit" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Keyboard</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleToggleFullscreen}
            title={isFullscreen ? 'Keluar Layar Penuh' : 'Mode Layar Penuh (Fullscreen)'}
            className="p-1.5 bg-transparent border-0 transition-opacity cursor-pointer text-inherit"
          >
            {isFullscreen ? (
              <Minimize className="w-5 h-5 text-sky-400 opacity-90 hover:opacity-100" />
            ) : (
              <Maximize className="w-5 h-5 opacity-70 hover:opacity-100" />
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.unlockAudio();
              setSoundEnabled((prev) => !prev);
              if (!soundEnabled) {
                soundEngine.playThock();
              }
            }}
            title={soundEnabled ? 'Suara Thocky Aktif' : 'Suara Dimatikan'}
            className="p-1.5 bg-transparent border-0 transition-opacity cursor-pointer text-inherit"
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5 text-emerald-400 opacity-90 hover:opacity-100" />
            ) : (
              <VolumeX className="w-5 h-5 opacity-50 hover:opacity-80" />
            )}
          </button>

          <button
            type="button"
            onClick={handleToggleTheme}
            title={mobileTheme === 'oled' ? 'Mode Saat Ini: Dark (OLED) - Klik untuk Light' : 'Mode Saat Ini: Light - Klik untuk Dark (OLED)'}
            className="p-1.5 bg-transparent border-0 opacity-80 hover:opacity-100 transition-opacity cursor-pointer text-inherit"
          >
            {mobileTheme === 'oled' ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-stone-700" />
            )}
          </button>

          <button
            type="button"
            onClick={onExitRemoteMode}
            title="Keluar dari Remote"
            className="p-1.5 bg-transparent border-0 opacity-75 hover:opacity-100 transition-opacity cursor-pointer text-inherit"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* SVG 6: PORTRAIT VIEW - Rotate your Phone with animated opposing arrows */}
      <div className="portrait:flex landscape:hidden flex-1 w-full bg-white dark:bg-black flex-col items-center justify-center p-6 text-center select-none animate-in fade-in duration-200">
        <style>{`
          @keyframes pixelRotateArrows {
            0%, 15% {
              transform: rotate(0deg);
            }
            45%, 60% {
              transform: rotate(180deg);
            }
            90%, 100% {
              transform: rotate(360deg);
            }
          }

          .anim-pixel-rotate {
            animation: pixelRotateArrows 3.6s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
            transform-origin: center center;
          }

          @media (prefers-reduced-motion: reduce) {
            .anim-pixel-rotate {
              animation: none !important;
            }
          }
        `}</style>

        <div className="max-w-xs w-full flex flex-col items-center my-auto">
          <div className="w-44 h-44 sm:w-48 sm:h-48 rounded-full bg-[#A8C7FA] flex items-center justify-center mb-8 shadow-xs">
            <svg
              viewBox="105 255 190 146"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-28 h-28 anim-pixel-rotate"
              aria-hidden="true"
            >
              <path d="M237 362H139V298" strokeWidth="12" stroke="#174EA6" strokeLinecap="square" />
              <path
                d="M137.167 291.887C138.368 290.401 140.632 290.401 141.833 291.887L162.831 317.864C164.416 319.826 163.02 322.75 160.497 322.75H118.503C115.98 322.75 114.584 319.826 116.169 317.864L137.167 291.887Z"
                fill="#174EA6"
              />
              <path d="M163 295H261V359" strokeWidth="12" stroke="#174EA6" strokeLinecap="square" />
              <path
                d="M262.833 365.113C261.632 366.599 259.368 366.599 258.167 365.113L237.169 339.136C235.584 337.174 236.98 334.25 239.503 334.25H281.497C284.02 334.25 285.416 337.174 283.831 339.136L262.833 365.113Z"
                fill="#174EA6"
              />
            </svg>
          </div>

          <h2 className="text-[28px] font-medium tracking-tight text-[#202124] dark:text-white leading-tight mb-3">
            Rotate your<br />
            Phone
          </h2>

          <p className="text-sm text-[#575757] dark:text-zinc-400 leading-relaxed mb-9 font-normal">
            Linked device :<br />
            {hostComputerName}
          </p>

          <button
            type="button"
            onClick={onExitRemoteMode}
            className="px-10 py-2.5 rounded-full border-2 border-[#EAEAEA] dark:border-zinc-800 text-[#1A73E8] dark:text-[#8ab4f8] bg-white dark:bg-black hover:bg-[#1A73E8] hover:text-white hover:border-[#1A73E8] dark:hover:bg-[#8ab4f8] dark:hover:text-black dark:hover:border-[#8ab4f8] text-sm font-normal transition-colors cursor-pointer"
          >
            Disconnect
          </button>
        </div>
      </div>

      {/* LANDSCAPE VIEW: SVG 1 (Light) / SVG 2 (Dark OLED) Full-Screen Keyboard or Arcade Controller */}
      <div
        className={`portrait:hidden landscape:flex flex-1 w-full ${
          remoteMode === 'arcade' ? 'h-[calc(100vh-38px)] p-0.5' : `h-screen ${screenBgClass} p-1.5 sm:p-2.5`
        } flex-col justify-between overflow-hidden animate-in fade-in duration-150`}
      >
        {remoteMode === 'arcade' ? (
          <ArcadeController
            onSendKeystroke={(key, isShifted, modifiers) => {
              pairingSocket.sendKeystroke(key, isShifted, modifiers);
            }}
            isOledTheme={isOled}
            soundEnabled={soundEnabled}
          />
        ) : (
          <div className="flex-1 w-full h-full flex flex-col justify-between gap-1 sm:gap-1.5 min-h-0">
            {/* ROW 0: esc, back, forward, fullscreen, window overview, rewind, play/pause, fast-forward, volume slider, G, hamburger menu */}
            <div className="flex-[0.55] flex items-stretch gap-1 sm:gap-1.5 w-full min-h-0">
              {/* esc */}
              <button
                type="button"
                onPointerDown={(e) => {
                  e.preventDefault();
                  handleSpecialAction('r0-esc', { code: 'Escape', label: 'esc', type: 'action' });
                }}
                className={`basis-0 grow-[66] min-w-0 h-full rounded-[4px] flex items-center justify-center ${
                  activeKeys.has('r0-esc') ? keyPressedClass : keySurfaceClass
                } ${keyTextClass} touch-manipulation select-none transition-transform duration-75 cursor-pointer`}
                aria-label="Escape"
              >
                <span className="text-[10px] sm:text-[12px] font-normal leading-none">esc</span>
              </button>

              {/* Back arrow */}
              <button
                type="button"
                onPointerDown={(e) => {
                  e.preventDefault();
                  handleSpecialAction(
                    'r0-back',
                    { code: 'ArrowLeft', label: 'Back', type: 'action' },
                    { alt: true }
                  );
                }}
                className={`basis-0 grow-[65] min-w-0 h-full rounded-[4px] flex items-center justify-center ${
                  activeKeys.has('r0-back') ? keyPressedClass : keySurfaceClass
                } ${keyTextClass} touch-manipulation select-none transition-transform duration-75 cursor-pointer`}
                aria-label="Browser Back"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none">
                  <path d="M10.5 6.5L5.5 12L10.5 17.5" stroke="#5F6368" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6 12H18.5" stroke="#5F6368" strokeWidth="1.9" strokeLinecap="round" />
                </svg>
              </button>

              {/* Forward arrow */}
              <button
                type="button"
                onPointerDown={(e) => {
                  e.preventDefault();
                  handleSpecialAction(
                    'r0-fwd',
                    { code: 'ArrowRight', label: 'Forward', type: 'action' },
                    { alt: true }
                  );
                }}
                className={`basis-0 grow-[66] min-w-0 h-full rounded-[4px] flex items-center justify-center ${
                  activeKeys.has('r0-fwd') ? keyPressedClass : keySurfaceClass
                } ${keyTextClass} touch-manipulation select-none transition-transform duration-75 cursor-pointer`}
                aria-label="Browser Forward"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none">
                  <path d="M13.5 6.5L18.5 12L13.5 17.5" stroke="#5F6368" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M18 12H5.5" stroke="#5F6368" strokeWidth="1.9" strokeLinecap="round" />
                </svg>
              </button>

              {/* Fullscreen Toggle */}
              <button
                type="button"
                onPointerDown={(e) => {
                  e.preventDefault();
                  handleSpecialAction('r0-fs', undefined, undefined, handleToggleFullscreen);
                }}
                className={`basis-0 grow-[65] min-w-0 h-full rounded-[4px] flex items-center justify-center ${
                  activeKeys.has('r0-fs') ? keyPressedClass : keySurfaceClass
                } ${keyTextClass} touch-manipulation select-none transition-transform duration-75 cursor-pointer`}
                aria-label="Fullscreen"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none">
                  <path d="M5 10V5.5H10.5" stroke="#5F6368" strokeWidth="1.9" strokeLinecap="square" />
                  <path d="M19 14V18.5H13.5" stroke="#5F6368" strokeWidth="1.9" strokeLinecap="square" />
                  <path d="M5 14V18.5H10.5" stroke="#5F6368" strokeWidth="1.9" strokeLinecap="square" />
                  <path d="M19 10V5.5H13.5" stroke="#5F6368" strokeWidth="1.9" strokeLinecap="square" />
                </svg>
              </button>

              {/* Window Overview / Switch Tab */}
              <button
                type="button"
                onPointerDown={(e) => {
                  e.preventDefault();
                  handleSpecialAction(
                    'r0-overview',
                    { code: 'Tab', label: 'Tab', type: 'tab' },
                    { ctrl: true }
                  );
                }}
                className={`basis-0 grow-[66] min-w-0 h-full rounded-[4px] flex items-center justify-center ${
                  activeKeys.has('r0-overview') ? keyPressedClass : keySurfaceClass
                } ${keyTextClass} touch-manipulation select-none transition-transform duration-75 cursor-pointer`}
                aria-label="Window Overview"
              >
                <svg viewBox="0 0 28 20" className="w-4 h-3.5 sm:w-5 sm:h-4" fill="none">
                  <rect x="2.5" y="4" width="13.5" height="12" stroke="#5F6368" strokeWidth="1.8" />
                  <path d="M19.8 4V16" stroke="#5F6368" strokeWidth="1.8" strokeLinecap="square" />
                  <path d="M23.6 4V16" stroke="#5F6368" strokeWidth="1.8" strokeLinecap="square" />
                </svg>
              </button>

              {/* Rewind */}
              <button
                type="button"
                onPointerDown={(e) => {
                  e.preventDefault();
                  handleSpecialAction('r0-rew', { code: 'KeyJ', label: 'j', shiftLabel: 'J', type: 'char' });
                }}
                className={`basis-0 grow-[65] min-w-0 h-full rounded-[4px] flex items-center justify-center ${
                  activeKeys.has('r0-rew') ? keyPressedClass : keySurfaceClass
                } ${keyTextClass} touch-manipulation select-none transition-transform duration-75 cursor-pointer`}
                aria-label="Rewind"
              >
                <svg viewBox="0 0 24 20" className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none">
                  <path d="M3 10L11.5 4V16L3 10Z" fill="#5F6368" />
                  <path d="M11.8 10L20.3 4V16L11.8 10Z" fill="#5F6368" />
                </svg>
              </button>

              {/* Play / Pause */}
              <button
                type="button"
                onPointerDown={(e) => {
                  e.preventDefault();
                  handleSpecialAction('r0-play', { code: 'KeyK', label: 'k', shiftLabel: 'K', type: 'char' });
                }}
                className={`basis-0 grow-[66] min-w-0 h-full rounded-[4px] flex items-center justify-center ${
                  activeKeys.has('r0-play') ? keyPressedClass : keySurfaceClass
                } ${keyTextClass} touch-manipulation select-none transition-transform duration-75 cursor-pointer`}
                aria-label="Play or Pause"
              >
                <svg viewBox="0 0 24 20" className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none">
                  <path d="M11.8 10L3.5 4V16L11.8 10Z" fill="#5F6368" />
                  <rect x="13.5" y="4" width="2.6" height="12" fill="#5F6368" />
                  <rect x="17.8" y="4" width="2.6" height="12" fill="#5F6368" />
                </svg>
              </button>

              {/* Fast-Forward */}
              <button
                type="button"
                onPointerDown={(e) => {
                  e.preventDefault();
                  handleSpecialAction('r0-ff', { code: 'KeyL', label: 'l', shiftLabel: 'L', type: 'char' });
                }}
                className={`basis-0 grow-[65] min-w-0 h-full rounded-[4px] flex items-center justify-center ${
                  activeKeys.has('r0-ff') ? keyPressedClass : keySurfaceClass
                } ${keyTextClass} touch-manipulation select-none transition-transform duration-75 cursor-pointer`}
                aria-label="Fast Forward"
              >
                <svg viewBox="0 0 24 20" className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none">
                  <path d="M21 10L12.5 4V16L21 10Z" fill="#5F6368" />
                  <path d="M12.2 10L3.7 4V16L12.2 10Z" fill="#5F6368" />
                </svg>
              </button>

              {/* Volume Slider Control Key (138 units = 2 keys wide) */}
              <div
                className={`basis-0 grow-[138] min-w-0 h-full rounded-[4px] ${keySurfaceClass} px-2 sm:px-3 flex items-center gap-1.5 sm:gap-2 touch-manipulation`}
              >
                <button
                  type="button"
                  onPointerDown={handleToggleMute}
                  className="shrink-0 p-0.5 bg-transparent border-0 flex items-center justify-center cursor-pointer"
                  aria-label={soundEnabled && volumePercent > 0 ? 'Mute Sound' : 'Unmute Sound'}
                >
                  <svg viewBox="0 0 14 18" className="w-3 h-3.5 sm:w-3.5 sm:h-4" fill="none">
                    <path
                      d="M11.6 16.3C12.1 16.3 12.5 15.9 12.5 15.4V2.6C12.5 2.1 12.1 1.7 11.6 1.7C11.2 1.7 10.9 1.8 10.5 2.2L7.1 5.6C7.1 5.6 7 5.6 6.9 5.6H4.7C3.6 5.6 3 6.3 3 7.5V10.5C3 11.7 3.6 12.4 4.7 12.4H6.9C7 12.4 7.1 12.4 7.1 12.4L10.5 15.8C10.9 16.2 11.2 16.3 11.6 16.3Z"
                      fill="#5F6368"
                      opacity={soundEnabled && volumePercent > 0 ? 1 : 0.4}
                    />
                  </svg>
                </button>

                <input
                  type="range"
                  min={0}
                  max={100}
                  value={soundEnabled ? volumePercent : 0}
                  onChange={handleVolumeSliderChange}
                  aria-label="Volume Slider"
                  className={`flex-1 min-w-0 h-[6px] sm:h-[7px] ${sliderTrackBgClass} appearance-none rounded-none cursor-pointer focus:outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[5px] [&::-webkit-slider-thumb]:h-[14px] [&::-webkit-slider-thumb]:rounded-[2px] [&::-webkit-slider-thumb]:bg-[#5F6368] [&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-[5px] [&::-moz-range-thumb]:h-[14px] [&::-moz-range-thumb]:rounded-[2px] [&::-moz-range-thumb]:bg-[#5F6368] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer`}
                />
              </div>

              {/* Google G Quick Search Shortcut (Ctrl+L) */}
              <button
                type="button"
                onPointerDown={(e) => {
                  e.preventDefault();
                  handleSpecialAction(
                    'r0-google',
                    { code: 'KeyL', label: 'l', shiftLabel: 'L', type: 'char' },
                    { ctrl: true }
                  );
                }}
                className={`basis-0 grow-[66] min-w-0 h-full rounded-[4px] flex items-center justify-center ${
                  activeKeys.has('r0-google') ? keyPressedClass : keySurfaceClass
                } ${keyTextClass} touch-manipulation select-none transition-transform duration-75 cursor-pointer`}
                aria-label="Quick Search Address Bar"
              >
                <svg viewBox="0 0 20 20" className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none">
                  <path
                    d="M17.4 8.6L17.3 8.2H10V11.3H14.4C13.9 13.4 11.8 14.5 10.1 14.5C8.8 14.5 7.5 14 6.6 13.2C6.1 12.7 5.8 12.2 5.5 11.6C5.3 11 5.1 10.4 5.1 9.8C5.1 8.5 5.7 7.2 6.6 6.3C7.4 5.5 8.7 5 10 5C11.5 5 12.6 5.8 13 6.1L15.2 4C14.5 3.4 12.7 2 10 2C7.8 2 5.8 2.8 4.2 4.3C2.8 5.7 2 7.8 2 9.8C2 11.7 2.7 13.7 4.2 15.2C5.7 16.7 7.9 17.5 10.1 17.5C12.2 17.5 14.1 16.7 15.5 15.3C16.8 13.9 17.5 12 17.5 10C17.5 9.1 17.4 8.6 17.4 8.6Z"
                    fill="#5F6368"
                  />
                </svg>
              </button>

              {/* Top-Right Corner: Functional Hamburger Menu Button */}
              <button
                type="button"
                onPointerDown={(e) => {
                  e.preventDefault();
                  handleSpecialAction('r0-menu', undefined, undefined, () => setIsMenuOpen(true));
                }}
                className={`basis-0 grow-[66] min-w-0 h-full rounded-[4px] flex items-center justify-center ${
                  isMenuOpen
                    ? isOled
                      ? 'bg-[#1B2230] ring-1 ring-[#8AB4F8]/80'
                      : 'bg-[#D2E3FC] ring-1 ring-[#1A73E8]/80'
                    : activeKeys.has('r0-menu')
                      ? keyPressedClass
                      : keySurfaceClass
                } touch-manipulation select-none transition-transform duration-75 cursor-pointer`}
                aria-label="Buka Menu"
                title="Menu Keyboard & Pengaturan"
              >
                <svg viewBox="0 0 16 14" className="w-3.5 h-3 sm:w-4 sm:h-3.5" fill="none">
                  <rect x="2" y="2" width="12" height="2" fill="#5F6368" />
                  <rect x="2" y="6" width="12" height="2" fill="#5F6368" />
                  <rect x="2" y="10" width="12" height="2" fill="#5F6368" />
                </svg>
              </button>
            </div>

            {/* ROW 1 - ROW 4: Standard Pixel Keyboard Matrix */}
            {renderStandardRow(PIXEL_ROW_1, 1)}
            {renderStandardRow(PIXEL_ROW_2, 2)}
            {renderStandardRow(PIXEL_ROW_3, 3)}
            {renderStandardRow(PIXEL_ROW_4, 4)}

            {/* ROW 5: ctrl, Gemini Star, alt, blank Space, alt, ctrl, <, stacked ^/v split key, > */}
            <div className="flex-1 flex items-stretch gap-1 sm:gap-1.5 w-full min-h-0">
              {/* Left Ctrl */}
              <button
                type="button"
                onPointerDown={(e) => handlePointerInteraction(e, { code: 'ControlLeft', label: 'ctrl', type: 'ctrl' })}
                className={`basis-0 grow-[97] min-w-0 h-full rounded-[4px] flex items-center justify-start pl-2.5 sm:pl-3.5 ${
                  activeKeys.has('ControlLeft') ? keyPressedClass : keySurfaceClass
                } ${getModifierActiveStyle(ctrl)} ${keyTextClass} touch-manipulation select-none transition-transform duration-75 cursor-pointer`}
              >
                <span className={`text-[10px] sm:text-[12px] font-normal leading-none ${ctrl ? (isOled ? 'text-[#8AB4F8] font-medium' : 'text-[#1A73E8] font-medium') : ''}`}>
                  ctrl
                </span>
              </button>

              {/* Gemini 4-point Sparkle Key (MetaLeft) */}
              <button
                type="button"
                onPointerDown={(e) => handlePointerInteraction(e, { code: 'MetaLeft', label: 'Meta', type: 'meta' })}
                className={`basis-0 grow-[53] min-w-0 h-full rounded-[4px] flex items-center justify-center ${
                  activeKeys.has('MetaLeft') ? keyPressedClass : keySurfaceClass
                } ${keyTextClass} touch-manipulation select-none transition-transform duration-75 cursor-pointer`}
                aria-label="Launcher / Meta"
              >
                <svg viewBox="127 337 25 25" className="w-4 h-4 sm:w-5 sm:h-5" fill="none">
                  <path
                    d="M139.456 338.037C139.691 338.037 139.896 338.198 139.953 338.426C140.129 339.123 140.36 339.806 140.644 340.466C141.388 342.194 142.408 343.706 143.704 345.001C145 346.297 146.511 347.317 148.239 348.061C148.899 348.345 149.582 348.576 150.28 348.752C150.508 348.809 150.668 349.014 150.668 349.249C150.668 349.484 150.508 349.689 150.279 349.746C149.582 349.921 148.899 350.152 148.239 350.437C146.511 351.18 144.999 352.201 143.704 353.496C142.408 354.792 141.388 356.304 140.644 358.031C140.36 358.692 140.129 359.374 139.953 360.072C139.925 360.183 139.861 360.281 139.771 360.351C139.681 360.422 139.571 360.46 139.456 360.46C139.221 360.46 139.017 360.3 138.959 360.072C138.784 359.374 138.553 358.692 138.268 358.031C137.525 356.303 136.505 354.792 135.209 353.496C133.913 352.201 132.401 351.18 130.674 350.437C130.013 350.152 129.331 349.921 128.633 349.746C128.523 349.718 128.424 349.654 128.354 349.564C128.283 349.474 128.245 349.363 128.245 349.249C128.245 349.014 128.405 348.809 128.633 348.752C129.331 348.577 130.013 348.346 130.674 348.061C132.401 347.318 133.914 346.297 135.209 345.002C136.505 343.706 137.525 342.194 138.269 340.466C138.553 339.806 138.784 339.124 138.959 338.426C138.987 338.315 139.051 338.217 139.141 338.146C139.231 338.076 139.342 338.037 139.456 338.037Z"
                    fill="#5F6368"
                  />
                </svg>
              </button>

              {/* Left Alt */}
              <button
                type="button"
                onPointerDown={(e) => handlePointerInteraction(e, { code: 'AltLeft', label: 'alt', type: 'alt' })}
                className={`basis-0 grow-[84] min-w-0 h-full rounded-[4px] flex items-center justify-center ${
                  activeKeys.has('AltLeft') ? keyPressedClass : keySurfaceClass
                } ${getModifierActiveStyle(alt)} ${keyTextClass} touch-manipulation select-none transition-transform duration-75 cursor-pointer`}
              >
                <span className={`text-[10px] sm:text-[12px] font-normal leading-none ${alt ? (isOled ? 'text-[#8AB4F8] font-medium' : 'text-[#1A73E8] font-medium') : ''}`}>
                  alt
                </span>
              </button>

              {/* Blank Spacebar (Exact match to SVG 1 & SVG 2) */}
              <button
                type="button"
                onPointerDown={(e) => handlePointerInteraction(e, { code: 'Space', label: 'Space', type: 'space' })}
                className={`basis-0 grow-[291] min-w-0 h-full rounded-[4px] flex items-center justify-center ${
                  activeKeys.has('Space') ? keyPressedClass : keySurfaceClass
                } touch-manipulation select-none transition-transform duration-75 cursor-pointer`}
                aria-label="Spacebar"
              />

              {/* Right Alt */}
              <button
                type="button"
                onPointerDown={(e) => handlePointerInteraction(e, { code: 'AltRight', label: 'alt', type: 'alt' })}
                className={`basis-0 grow-[54] min-w-0 h-full rounded-[4px] flex items-center justify-center ${
                  activeKeys.has('AltRight') ? keyPressedClass : keySurfaceClass
                } ${getModifierActiveStyle(alt)} ${keyTextClass} touch-manipulation select-none transition-transform duration-75 cursor-pointer`}
              >
                <span className={`text-[10px] sm:text-[12px] font-normal leading-none ${alt ? (isOled ? 'text-[#8AB4F8] font-medium' : 'text-[#1A73E8] font-medium') : ''}`}>
                  alt
                </span>
              </button>

              {/* Right Ctrl */}
              <button
                type="button"
                onPointerDown={(e) => handlePointerInteraction(e, { code: 'ControlRight', label: 'ctrl', type: 'ctrl' })}
                className={`basis-0 grow-[53] min-w-0 h-full rounded-[4px] flex items-center justify-center ${
                  activeKeys.has('ControlRight') ? keyPressedClass : keySurfaceClass
                } ${getModifierActiveStyle(ctrl)} ${keyTextClass} touch-manipulation select-none transition-transform duration-75 cursor-pointer`}
              >
                <span className={`text-[10px] sm:text-[12px] font-normal leading-none ${ctrl ? (isOled ? 'text-[#8AB4F8] font-medium' : 'text-[#1A73E8] font-medium') : ''}`}>
                  ctrl
                </span>
              </button>

              {/* Left Arrow */}
              <button
                type="button"
                onPointerDown={(e) => handlePointerInteraction(e, { code: 'ArrowLeft', label: 'Left', type: 'action' })}
                className={`basis-0 grow-[54] min-w-0 h-full rounded-[4px] flex items-center justify-center ${
                  activeKeys.has('ArrowLeft') ? keyPressedClass : keySurfaceClass
                } touch-manipulation select-none transition-transform duration-75 cursor-pointer`}
                aria-label="Arrow Left"
              >
                <svg viewBox="0 0 12 18" className="w-2.5 h-3.5 sm:w-3 sm:h-4" fill="none">
                  <path d="M8.5 2L3.5 9L8.5 16" stroke="#5F6368" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Stacked Up / Down Split Key with horizontal hairline divider */}
              <div
                className={`basis-0 grow-[67] min-w-0 h-full rounded-[4px] overflow-hidden flex flex-col ${keySurfaceClass}`}
              >
                <button
                  type="button"
                  onPointerDown={(e) => handlePointerInteraction(e, { code: 'ArrowUp', label: 'Up', type: 'action' })}
                  className={`flex-1 w-full flex items-center justify-center border-b border-[#5F6368]/65 ${
                    activeKeys.has('ArrowUp') ? keyPressedClass : 'bg-transparent'
                  } touch-manipulation select-none cursor-pointer`}
                  aria-label="Arrow Up"
                >
                  <svg viewBox="0 0 18 10" className="w-3 h-2 sm:w-3.5 sm:h-2.5" fill="none">
                    <path d="M2 7.5L9 2.5L16 7.5" stroke="#5F6368" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                <button
                  type="button"
                  onPointerDown={(e) => handlePointerInteraction(e, { code: 'ArrowDown', label: 'Down', type: 'action' })}
                  className={`flex-1 w-full flex items-center justify-center ${
                    activeKeys.has('ArrowDown') ? keyPressedClass : 'bg-transparent'
                  } touch-manipulation select-none cursor-pointer`}
                  aria-label="Arrow Down"
                >
                  <svg viewBox="0 0 18 10" className="w-3 h-2 sm:w-3.5 sm:h-2.5" fill="none">
                    <path d="M16 2.5L9 7.5L2 2.5" stroke="#5F6368" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              {/* Right Arrow */}
              <button
                type="button"
                onPointerDown={(e) => handlePointerInteraction(e, { code: 'ArrowRight', label: 'Right', type: 'action' })}
                className={`basis-0 grow-[54] min-w-0 h-full rounded-[4px] flex items-center justify-center ${
                  activeKeys.has('ArrowRight') ? keyPressedClass : keySurfaceClass
                } touch-manipulation select-none transition-transform duration-75 cursor-pointer`}
                aria-label="Arrow Right"
              >
                <svg viewBox="0 0 12 18" className="w-2.5 h-3.5 sm:w-3 sm:h-4" fill="none">
                  <path d="M3.5 2L8.5 9L3.5 16" stroke="#5F6368" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* HAMBURGER MENU SLIDE-OVER DRAWER (Triggered by Top-Right Corner ≡ Key) */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-150"
          onClick={() => setIsMenuOpen(false)}
        >
          <aside
            className={`w-[300px] sm:w-[330px] max-w-[88vw] h-full overflow-y-auto p-4 flex flex-col justify-between shadow-2xl border-l animate-in slide-in-from-right duration-200 ${
              isOled
                ? 'bg-[#09090b] border-zinc-800 text-zinc-100'
                : 'bg-white border-[#dadce0] text-[#202124]'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-zinc-800">
                <div className="flex items-center gap-2 min-w-0">
                  <PixelKeyboardIcon className="w-6 h-auto shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm font-semibold leading-tight truncate">
                      Pixel Virtualboard
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#5F6368] dark:text-zinc-400 truncate mt-0.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                          hostOnline ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'
                        }`}
                      />
                      <span className="truncate">{hostComputerName}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Tutup Menu"
                  className={`p-1.5 rounded-full cursor-pointer transition-colors ${
                    isOled ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-zinc-100 text-[#5F6368]'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Linked Smartphone Badge */}
              <div
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs ${
                  isOled ? 'bg-[#121212] text-zinc-300' : 'bg-[#f1f3f4] text-[#3c4043]'
                }`}
              >
                <span className="flex items-center gap-2 truncate">
                  <Smartphone className="w-3.5 h-3.5 text-[#1A73E8] shrink-0" />
                  <span className="truncate font-medium">{deviceInfo.name}</span>
                </span>
                <span className="text-[10px] font-medium text-emerald-500 shrink-0">
                  {hostOnline ? 'Online' : 'Menghubungkan'}
                </span>
              </div>

              {/* 2 Theme Modes Only: Light & Dark (OLED) */}
              <div>
                <div className="text-[11px] font-medium text-[#5F6368] dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
                  Tampilan
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleSetTheme('light')}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                      mobileTheme === 'light'
                        ? 'bg-[#D2E3FC] border-[#1A73E8] text-[#174EA6]'
                        : isOled
                          ? 'bg-[#121212] border-zinc-800 text-zinc-300 hover:bg-zinc-900'
                          : 'bg-white border-[#dadce0] text-[#3c4043]'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5" />
                    Light
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetTheme('oled')}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                      mobileTheme === 'oled'
                        ? 'bg-[#1B2230] border-[#8AB4F8] text-[#8AB4F8]'
                        : 'bg-[#f1f3f4] border-transparent text-[#3c4043] hover:bg-[#e8eaed]'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5" />
                    Dark (OLED)
                  </button>
                </div>
              </div>

              {/* Controller Mode Switcher */}
              <div>
                <div className="text-[11px] font-medium text-[#5F6368] dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
                  Mode Input
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setRemoteMode('keyboard');
                      localStorage.setItem('pixel_remote_mode', 'keyboard');
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                      remoteMode === 'keyboard'
                        ? isOled
                          ? 'bg-[#1B2230] border-[#8AB4F8] text-[#8AB4F8]'
                          : 'bg-[#D2E3FC] border-[#1A73E8] text-[#174EA6]'
                        : isOled
                          ? 'bg-[#121212] border-zinc-800 text-zinc-300'
                          : 'bg-[#f1f3f4] border-transparent text-[#3c4043]'
                    }`}
                  >
                    <Keyboard className="w-3.5 h-3.5" />
                    Keyboard
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRemoteMode('arcade');
                      localStorage.setItem('pixel_remote_mode', 'arcade');
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                      remoteMode === 'arcade'
                        ? isOled
                          ? 'bg-[#1B2230] border-[#8AB4F8] text-[#8AB4F8]'
                          : 'bg-[#D2E3FC] border-[#1A73E8] text-[#174EA6]'
                        : isOled
                          ? 'bg-[#121212] border-zinc-800 text-zinc-300'
                          : 'bg-[#f1f3f4] border-transparent text-[#3c4043]'
                    }`}
                  >
                    <Gamepad2 className="w-3.5 h-3.5" />
                    Arcade
                  </button>
                </div>
              </div>

              {/* Sound & Fullscreen Quick Toggles */}
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.unlockAudio();
                    const next = !soundEnabled;
                    setSoundEnabled(next);
                    if (next) {
                      if (volumePercent === 0) {
                        setVolumePercent(75);
                        soundEngine.setVolume(0.75);
                      }
                      soundEngine.playThock();
                    }
                  }}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium border cursor-pointer transition-colors ${
                    isOled
                      ? 'bg-[#121212] border-zinc-800 text-zinc-200 hover:bg-zinc-900'
                      : 'bg-[#f1f3f4] border-transparent text-[#3c4043] hover:bg-[#e8eaed]'
                  }`}
                >
                  {soundEnabled && volumePercent > 0 ? (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Suara {volumePercent}%</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-3.5 h-3.5 opacity-60" />
                      <span>Suara Mati</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleToggleFullscreen}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium border cursor-pointer transition-colors ${
                    isOled
                      ? 'bg-[#121212] border-zinc-800 text-zinc-200 hover:bg-zinc-900'
                      : 'bg-[#f1f3f4] border-transparent text-[#3c4043] hover:bg-[#e8eaed]'
                  }`}
                >
                  {isFullscreen ? (
                    <>
                      <Minimize className="w-3.5 h-3.5 text-[#1A73E8]" />
                      <span>Keluar Full</span>
                    </>
                  ) : (
                    <>
                      <Maximize className="w-3.5 h-3.5" />
                      <span>Fullscreen</span>
                    </>
                  )}
                </button>
              </div>

              {/* 3D / Blockbench Quick Shortcuts */}
              <div>
                <div className="text-[11px] font-medium text-[#5F6368] dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
                  Shortcut Cepat (3D / Editor)
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleTriggerQuickAction('Escape')}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-medium cursor-pointer transition-colors ${
                      isOled ? 'bg-[#121212] hover:bg-zinc-800 text-zinc-200' : 'bg-[#f1f3f4] hover:bg-[#e8eaed] text-[#3c4043]'
                    }`}
                  >
                    ESC
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTriggerQuickAction('Delete')}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-medium flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                      isOled ? 'bg-[#121212] hover:bg-red-950/60 text-red-400' : 'bg-red-50 hover:bg-red-100 text-red-600'
                    }`}
                  >
                    <Trash2 className="w-3 h-3" />
                    DEL
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTriggerQuickAction('Focus')}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-medium flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                      isOled ? 'bg-[#121212] hover:bg-zinc-800 text-zinc-200' : 'bg-[#f1f3f4] hover:bg-[#e8eaed] text-[#3c4043]'
                    }`}
                  >
                    <Crosshair className="w-3 h-3" />
                    Focus
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTriggerQuickAction('Undo')}
                    className={`col-span-1 py-1.5 px-2 rounded-lg text-[11px] font-medium flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                      isOled ? 'bg-[#121212] hover:bg-zinc-800 text-zinc-200' : 'bg-[#f1f3f4] hover:bg-[#e8eaed] text-[#3c4043]'
                    }`}
                  >
                    <Undo2 className="w-3 h-3" />
                    Undo
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTriggerQuickAction('Redo')}
                    className={`col-span-2 py-1.5 px-2 rounded-lg text-[11px] font-medium flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                      isOled ? 'bg-[#121212] hover:bg-zinc-800 text-zinc-200' : 'bg-[#f1f3f4] hover:bg-[#e8eaed] text-[#3c4043]'
                    }`}
                  >
                    <Redo2 className="w-3 h-3" />
                    Redo (Ctrl+Y)
                  </button>
                </div>
              </div>
            </div>

            {/* Disconnect Footer */}
            <div className="pt-4 mt-4 border-t border-black/10 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  onExitRemoteMode();
                }}
                className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                  isOled
                    ? 'border-zinc-800 bg-black text-red-400 hover:bg-red-950/30'
                    : 'border-[#EAEAEA] bg-white text-[#B3261E] hover:bg-red-50'
                }`}
              >
                <LogOut className="w-3.5 h-3.5" />
                Disconnect
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

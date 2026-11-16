import React, { useState, useEffect, useRef, useCallback } from 'react';
import { KeyDefinition, KeyModifiers } from '../types/keyboard';
import { soundEngine } from '../utils/soundEngine';
import {
  Sliders,
  Plus,
  Trash2,
  RotateCcw,
  X,
  Sparkles,
  Move,
  Check,
  Edit3,
} from 'lucide-react';

export interface CustomArcadeButton {
  id: string;
  label: string;          // e.g. "A", "B", "X", "Y", "JUMP", "ROT", "SPACE"
  subLabel?: string;      // e.g. "Z", "X", "A", "Space"
  keyCode: string;        // e.g. "KeyZ", "Space", "KeyR"
  keyLabel: string;       // e.g. "z", " ", "r"
  keyType: KeyDefinition['type'];
  modifiers?: {
    ctrl?: boolean;
    alt?: boolean;
    shift?: boolean;
  };
  x: number;              // Percentage from left (0 to 100)
  y: number;              // Percentage from top (0 to 100)
}

// Initial Clean White Arcade Layout
const DEFAULT_WHITE_BUTTONS: CustomArcadeButton[] = [
  // Top Row (Fightstick Curved Arc)
  { id: 'btn_1', label: 'X', subLabel: 'A', keyCode: 'KeyA', keyLabel: 'a', keyType: 'char', x: 62, y: 34 },
  { id: 'btn_2', label: 'Y', subLabel: 'S', keyCode: 'KeyS', keyLabel: 's', keyType: 'char', x: 74, y: 24 },
  { id: 'btn_3', label: 'RB', subLabel: 'D', keyCode: 'KeyD', keyLabel: 'd', keyType: 'char', x: 86, y: 28 },
  // Bottom Row
  { id: 'btn_4', label: 'A', subLabel: 'Z', keyCode: 'KeyZ', keyLabel: 'z', keyType: 'char', x: 60, y: 64 },
  { id: 'btn_5', label: 'B', subLabel: 'X', keyCode: 'KeyX', keyLabel: 'x', keyType: 'char', x: 72, y: 54 },
  { id: 'btn_6', label: 'RT', subLabel: 'C', keyCode: 'KeyC', keyLabel: 'c', keyType: 'char', x: 84, y: 58 },
];

// Common key options for mapping
const MAPPING_KEY_OPTIONS = [
  { label: 'Space (Spasi / Lompat / Pan)', code: 'Space', key: ' ', type: 'space' as const },
  { label: 'Enter (Konfirmasi)', code: 'Enter', key: 'Enter', type: 'enter' as const },
  { label: 'Escape (Batal / Keluar)', code: 'Escape', key: 'Escape', type: 'action' as const },
  { label: 'Shift (Lari / Modifikasi)', code: 'ShiftLeft', key: 'Shift', type: 'shift' as const },
  { label: 'Control (Ctrl)', code: 'ControlLeft', key: 'Control', type: 'ctrl' as const },
  { label: 'Delete (Hapus Objek)', code: 'Delete', key: 'Delete', type: 'action' as const },
  { label: 'Backspace', code: 'Backspace', key: 'Backspace', type: 'backspace' as const },
  { label: 'Tab', code: 'Tab', key: 'Tab', type: 'tab' as const },
  // Common gaming & 3D keys
  { label: 'A (Serang / Kiri)', code: 'KeyA', key: 'a', type: 'char' as const },
  { label: 'B', code: 'KeyB', key: 'b', type: 'char' as const },
  { label: 'C', code: 'KeyC', key: 'c', type: 'char' as const },
  { label: 'D (Kanan)', code: 'KeyD', key: 'd', type: 'char' as const },
  { label: 'E (Interact)', code: 'KeyE', key: 'e', type: 'char' as const },
  { label: 'F (Fokus / View)', code: 'KeyF', key: 'f', type: 'char' as const },
  { label: 'G', code: 'KeyG', key: 'g', type: 'char' as const },
  { label: 'J', code: 'KeyJ', key: 'j', type: 'char' as const },
  { label: 'K', code: 'KeyK', key: 'k', type: 'char' as const },
  { label: 'L', code: 'KeyL', key: 'l', type: 'char' as const },
  { label: 'M (Move)', code: 'KeyM', key: 'm', type: 'char' as const },
  { label: 'Q', code: 'KeyQ', key: 'q', type: 'char' as const },
  { label: 'R (Rotate 3D)', code: 'KeyR', key: 'r', type: 'char' as const },
  { label: 'S (Scale 3D / Mundur)', code: 'KeyS', key: 's', type: 'char' as const },
  { label: 'T (Move / Tool)', code: 'KeyT', key: 't', type: 'char' as const },
  { label: 'W (Maju)', code: 'KeyW', key: 'w', type: 'char' as const },
  { label: 'X (Special / Attack)', code: 'KeyX', key: 'x', type: 'char' as const },
  { label: 'Y (Undo / Redo)', code: 'KeyY', key: 'y', type: 'char' as const },
  { label: 'Z (Attack / Undo)', code: 'KeyZ', key: 'z', type: 'char' as const },
  // Digits
  { label: '1 (Sudut 1)', code: 'Digit1', key: '1', type: 'char' as const },
  { label: '2 (Sudut 2)', code: 'Digit2', key: '2', type: 'char' as const },
  { label: '3 (Sudut 3)', code: 'Digit3', key: '3', type: 'char' as const },
  { label: '4', code: 'Digit4', key: '4', type: 'char' as const },
  { label: '5 (Coin)', code: 'Digit5', key: '5', type: 'char' as const },
];

interface ArcadeControllerProps {
  onSendKeystroke: (key: KeyDefinition, isShifted: boolean, modifiers?: KeyModifiers) => void;
  isOledTheme: boolean;
  soundEnabled: boolean;
}

export const ArcadeController: React.FC<ArcadeControllerProps> = ({
  onSendKeystroke,
  isOledTheme,
  soundEnabled,
}) => {
  // Custom Buttons State with LocalStorage Persistence
  const [buttons, setButtons] = useState<CustomArcadeButton[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pixel_arcade_custom_buttons');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return DEFAULT_WHITE_BUTTONS;
  });

  // Size Controls ("bisa di resize")
  const [buttonSize, setButtonSize] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pixel_arcade_btn_size');
      if (saved) return Number(saved) || 72;
    }
    return 72; // default 72px diameter
  });

  const [dpadSize, setDpadSize] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pixel_arcade_dpad_size');
      if (saved) return Number(saved) || 54;
    }
    return 54;
  });

  // D-Pad Mapping mode (Arrow Keys vs WASD)
  const [dpadMode, setDpadMode] = useState<'arrows' | 'wasd'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pixel_arcade_dpad_mode');
      if (saved === 'wasd' || saved === 'arrows') return saved;
    }
    return 'arrows';
  });

  // Multi-touch active press tracking
  const [pressedButtons, setPressedButtons] = useState<Set<string>>(new Set());

  // Custom Layout Edit Mode (Drag to position & tap to remap)
  const [isLayoutEditMode, setIsLayoutEditMode] = useState<boolean>(false);
  const [editingButton, setEditingButton] = useState<CustomArcadeButton | null>(null);
  const [showResizeDrawer, setShowResizeDrawer] = useState<boolean>(false);

  // Dragging state
  const stageRef = useRef<HTMLDivElement | null>(null);
  const dragInfoRef = useRef<{
    btnId: string;
    startX: number;
    startY: number;
    initX: number;
    initY: number;
    hasMoved: boolean;
  } | null>(null);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('pixel_arcade_custom_buttons', JSON.stringify(buttons));
    localStorage.setItem('pixel_arcade_btn_size', String(buttonSize));
    localStorage.setItem('pixel_arcade_dpad_size', String(dpadSize));
    localStorage.setItem('pixel_arcade_dpad_mode', dpadMode);
  }, [buttons, buttonSize, dpadSize, dpadMode]);

  // Trigger Keystroke with microswitch click sound & mobile haptics
  const triggerKeystroke = useCallback((button: { keyCode: string; keyLabel: string; keyType: KeyDefinition['type']; modifiers?: { ctrl?: boolean; alt?: boolean; shift?: boolean } }) => {
    if (soundEnabled) {
      soundEngine.playArcadeClick();
    }
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(18);
      } catch {
        // ignore
      }
    }

    const keyDef: KeyDefinition = {
      code: button.keyCode,
      label: button.keyLabel,
      type: button.keyType,
    };

    const isShifted = Boolean(button.modifiers?.shift);
    const modifiers: KeyModifiers = {
      ctrl: Boolean(button.modifiers?.ctrl),
      alt: Boolean(button.modifiers?.alt),
      shift: isShifted,
    };

    onSendKeystroke(keyDef, isShifted, modifiers);
  }, [onSendKeystroke, soundEnabled]);

  // === TOUCH & MOUSE HANDLERS ===
  const handleButtonStart = (btn: CustomArcadeButton, clientX: number, clientY: number, e: React.SyntheticEvent) => {
    e.preventDefault();

    if (isLayoutEditMode) {
      // In Layout Edit Mode: Start dragging
      dragInfoRef.current = {
        btnId: btn.id,
        startX: clientX,
        startY: clientY,
        initX: btn.x,
        initY: btn.y,
        hasMoved: false,
      };
      return;
    }

    // Play Mode: Fire Keystroke
    setPressedButtons((prev) => new Set(prev).add(btn.id));
    triggerKeystroke(btn);
  };

  const handleStageMove = (clientX: number, clientY: number) => {
    if (!isLayoutEditMode || !dragInfoRef.current || !stageRef.current) return;

    const drag = dragInfoRef.current;
    const rect = stageRef.current.getBoundingClientRect();
    const deltaX = clientX - drag.startX;
    const deltaY = clientY - drag.startY;

    if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
      drag.hasMoved = true;
    }

    // Calculate new percentage position
    const deltaXPercent = (deltaX / rect.width) * 100;
    const deltaYPercent = (deltaY / rect.height) * 100;

    const newX = Math.round(Math.max(5, Math.min(95, drag.initX + deltaXPercent)));
    const newY = Math.round(Math.max(8, Math.min(92, drag.initY + deltaYPercent)));

    setButtons((prev) =>
      prev.map((b) => (b.id === drag.btnId ? { ...b, x: newX, y: newY } : b))
    );
  };

  const handleStageEnd = () => {
    if (isLayoutEditMode && dragInfoRef.current) {
      const drag = dragInfoRef.current;
      // If user tapped without dragging, open the Mapping Modal!
      if (!drag.hasMoved) {
        const targetBtn = buttons.find((b) => b.id === drag.btnId);
        if (targetBtn) {
          setEditingButton(targetBtn);
        }
      }
      dragInfoRef.current = null;
    }
  };

  const handleButtonRelease = (btnId: string) => {
    setPressedButtons((prev) => {
      const next = new Set(prev);
      next.delete(btnId);
      return next;
    });
  };

  // Add a new custom white arcade button
  const handleAddNewButton = () => {
    const newId = `btn_${Date.now()}`;
    const newBtn: CustomArcadeButton = {
      id: newId,
      label: 'ACT',
      subLabel: 'Spc',
      keyCode: 'Space',
      keyLabel: ' ',
      keyType: 'space',
      x: 50,
      y: 50,
    };
    setButtons((prev) => [...prev, newBtn]);
    setEditingButton(newBtn);
  };

  // Delete a button
  const handleDeleteButton = (id: string) => {
    setButtons((prev) => prev.filter((b) => b.id !== id));
    setEditingButton(null);
  };

  // Save mapping edit
  const handleSaveButtonEdit = (updated: CustomArcadeButton) => {
    setButtons((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    setEditingButton(null);
  };

  // Reset layout to clean default arc
  const handleResetLayout = () => {
    setButtons(DEFAULT_WHITE_BUTTONS);
    setButtonSize(72);
    setDpadSize(54);
    setIsLayoutEditMode(false);
  };

  // D-Pad Button config
  const getDpadBtn = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (dpadMode === 'wasd') {
      switch (direction) {
        case 'up': return { id: 'dpad_up', label: 'W', keyCode: 'KeyW', keyLabel: 'w', keyType: 'char' as const };
        case 'down': return { id: 'dpad_down', label: 'S', keyCode: 'KeyS', keyLabel: 's', keyType: 'char' as const };
        case 'left': return { id: 'dpad_left', label: 'A', keyCode: 'KeyA', keyLabel: 'a', keyType: 'char' as const };
        case 'right': return { id: 'dpad_right', label: 'D', keyCode: 'KeyD', keyLabel: 'd', keyType: 'char' as const };
      }
    } else {
      switch (direction) {
        case 'up': return { id: 'dpad_up', label: '▲', keyCode: 'ArrowUp', keyLabel: 'ArrowUp', keyType: 'arrow' as const };
        case 'down': return { id: 'dpad_down', label: '▼', keyCode: 'ArrowDown', keyLabel: 'ArrowDown', keyType: 'arrow' as const };
        case 'left': return { id: 'dpad_left', label: '◀', keyCode: 'ArrowLeft', keyLabel: 'ArrowLeft', keyType: 'arrow' as const };
        case 'right': return { id: 'dpad_right', label: '▶', keyCode: 'ArrowRight', keyLabel: 'ArrowRight', keyType: 'arrow' as const };
      }
    }
  };

  const chassisBg = isOledTheme ? 'bg-black text-white' : 'bg-[#18181b] text-white';

  return (
    <div
      ref={stageRef}
      onMouseMove={(e) => handleStageMove(e.clientX, e.clientY)}
      onMouseUp={handleStageEnd}
      onTouchMove={(e) => {
        if (e.touches[0]) {
          handleStageMove(e.touches[0].clientX, e.touches[0].clientY);
        }
      }}
      onTouchEnd={handleStageEnd}
      className={`flex-1 w-full flex flex-col justify-between ${chassisBg} p-2 select-none overflow-hidden relative font-['Inter']`}
    >
      {/* Top Arcade Action Toolbar */}
      <div className="w-full flex items-center justify-between pb-1.5 border-b border-zinc-800 text-xs shrink-0 z-20">
        {/* Left: D-Pad Mode Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDpadMode((prev) => (prev === 'arrows' ? 'wasd' : 'arrows'))}
            className="px-2.5 py-1 bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-[11px] font-mono text-zinc-300 cursor-pointer rounded-none"
            title="Ganti D-Pad antara Arrow Keys dan WASD"
          >
            D-PAD: {dpadMode.toUpperCase()}
          </button>

          {isLayoutEditMode && (
            <span className="text-[11px] text-amber-400 font-bold flex items-center gap-1 animate-pulse">
              <Move className="w-3.5 h-3.5" />
              <span>Geser tombol untuk memindahkan posisi &bull; Ketuk untuk remap</span>
            </span>
          )}
        </div>

        {/* Right: Custom Layout Tools */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Add Button in Custom Mode */}
          <button
            type="button"
            onClick={handleAddNewButton}
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white cursor-pointer rounded-none"
            title="Tambah Tombol Arcade Baru"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tambah Tombol</span>
          </button>

          {/* Toggle Custom Layout Edit Mode */}
          <button
            type="button"
            onClick={() => setIsLayoutEditMode((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold border cursor-pointer rounded-none transition-all ${
              isLayoutEditMode
                ? 'bg-amber-400 text-black border-amber-300 shadow-md ring-2 ring-amber-400/40'
                : 'bg-zinc-900 border-zinc-700 text-zinc-200 hover:text-white hover:border-zinc-500'
            }`}
          >
            {isLayoutEditMode ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Selesai Edit</span>
              </>
            ) : (
              <>
                <Move className="w-3.5 h-3.5" />
                <span>Ubah Layout</span>
              </>
            )}
          </button>

          {/* Resize Drawer Toggle */}
          <button
            type="button"
            onClick={() => setShowResizeDrawer((prev) => !prev)}
            className="p-1.5 bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white cursor-pointer rounded-none"
            title="Pengaturan Ukuran (Resize)"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Interactive Stage with Custom Freeform Positioning */}
      <div className="flex-1 w-full relative overflow-hidden my-1">
        {/* LEFT D-PAD (Crisp White Arcade Directional Buttons) */}
        <div
          className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-10 select-none flex flex-col items-center"
        >
          <div
            className="grid grid-cols-3 gap-1.5 items-center justify-center p-2 bg-black/40 border border-zinc-800 rounded-2xl shadow-inner select-none"
            style={{ width: `${dpadSize * 3 + 16}px`, height: `${dpadSize * 3 + 16}px` }}
          >
            <div />
            {/* UP */}
            {(() => {
              const upBtn = getDpadBtn('up');
              const isPressed = pressedButtons.has(upBtn.id);
              return (
                <button
                  type="button"
                  onTouchStart={(e) => {
                    e.preventDefault();
                    setPressedButtons((p) => new Set(p).add(upBtn.id));
                    triggerKeystroke(upBtn);
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    handleButtonRelease(upBtn.id);
                  }}
                  onMouseDown={() => {
                    setPressedButtons((p) => new Set(p).add(upBtn.id));
                    triggerKeystroke(upBtn);
                  }}
                  onMouseUp={() => handleButtonRelease(upBtn.id)}
                  onMouseLeave={() => handleButtonRelease(upBtn.id)}
                  style={{ width: `${dpadSize}px`, height: `${dpadSize}px` }}
                  className={`rounded-xl flex items-center justify-center text-sm font-black border transition-all cursor-pointer ${
                    isPressed
                      ? 'bg-zinc-200 border-white text-black translate-y-1 shadow-inner ring-2 ring-white/60'
                      : 'bg-gradient-to-b from-white via-zinc-100 to-zinc-200 border-zinc-300 text-stone-900 shadow-[0_4px_0_#94a3b8]'
                  }`}
                >
                  <span>{upBtn.label}</span>
                </button>
              );
            })()}
            <div />

            {/* LEFT */}
            {(() => {
              const leftBtn = getDpadBtn('left');
              const isPressed = pressedButtons.has(leftBtn.id);
              return (
                <button
                  type="button"
                  onTouchStart={(e) => {
                    e.preventDefault();
                    setPressedButtons((p) => new Set(p).add(leftBtn.id));
                    triggerKeystroke(leftBtn);
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    handleButtonRelease(leftBtn.id);
                  }}
                  onMouseDown={() => {
                    setPressedButtons((p) => new Set(p).add(leftBtn.id));
                    triggerKeystroke(leftBtn);
                  }}
                  onMouseUp={() => handleButtonRelease(leftBtn.id)}
                  onMouseLeave={() => handleButtonRelease(leftBtn.id)}
                  style={{ width: `${dpadSize}px`, height: `${dpadSize}px` }}
                  className={`rounded-xl flex items-center justify-center text-sm font-black border transition-all cursor-pointer ${
                    isPressed
                      ? 'bg-zinc-200 border-white text-black translate-y-1 shadow-inner ring-2 ring-white/60'
                      : 'bg-gradient-to-b from-white via-zinc-100 to-zinc-200 border-zinc-300 text-stone-900 shadow-[0_4px_0_#94a3b8]'
                  }`}
                >
                  <span>{leftBtn.label}</span>
                </button>
              );
            })()}

            {/* CENTER HUB */}
            <div className="w-full h-full rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
            </div>

            {/* RIGHT */}
            {(() => {
              const rightBtn = getDpadBtn('right');
              const isPressed = pressedButtons.has(rightBtn.id);
              return (
                <button
                  type="button"
                  onTouchStart={(e) => {
                    e.preventDefault();
                    setPressedButtons((p) => new Set(p).add(rightBtn.id));
                    triggerKeystroke(rightBtn);
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    handleButtonRelease(rightBtn.id);
                  }}
                  onMouseDown={() => {
                    setPressedButtons((p) => new Set(p).add(rightBtn.id));
                    triggerKeystroke(rightBtn);
                  }}
                  onMouseUp={() => handleButtonRelease(rightBtn.id)}
                  onMouseLeave={() => handleButtonRelease(rightBtn.id)}
                  style={{ width: `${dpadSize}px`, height: `${dpadSize}px` }}
                  className={`rounded-xl flex items-center justify-center text-sm font-black border transition-all cursor-pointer ${
                    isPressed
                      ? 'bg-zinc-200 border-white text-black translate-y-1 shadow-inner ring-2 ring-white/60'
                      : 'bg-gradient-to-b from-white via-zinc-100 to-zinc-200 border-zinc-300 text-stone-900 shadow-[0_4px_0_#94a3b8]'
                  }`}
                >
                  <span>{rightBtn.label}</span>
                </button>
              );
            })()}

            <div />
            {/* DOWN */}
            {(() => {
              const downBtn = getDpadBtn('down');
              const isPressed = pressedButtons.has(downBtn.id);
              return (
                <button
                  type="button"
                  onTouchStart={(e) => {
                    e.preventDefault();
                    setPressedButtons((p) => new Set(p).add(downBtn.id));
                    triggerKeystroke(downBtn);
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    handleButtonRelease(downBtn.id);
                  }}
                  onMouseDown={() => {
                    setPressedButtons((p) => new Set(p).add(downBtn.id));
                    triggerKeystroke(downBtn);
                  }}
                  onMouseUp={() => handleButtonRelease(downBtn.id)}
                  onMouseLeave={() => handleButtonRelease(downBtn.id)}
                  style={{ width: `${dpadSize}px`, height: `${dpadSize}px` }}
                  className={`rounded-xl flex items-center justify-center text-sm font-black border transition-all cursor-pointer ${
                    isPressed
                      ? 'bg-zinc-200 border-white text-black translate-y-1 shadow-inner ring-2 ring-white/60'
                      : 'bg-gradient-to-b from-white via-zinc-100 to-zinc-200 border-zinc-300 text-stone-900 shadow-[0_4px_0_#94a3b8]'
                  }`}
                >
                  <span>{downBtn.label}</span>
                </button>
              );
            })()}
            <div />
          </div>
        </div>

        {/* CENTER FUNCTION BUTTONS (White Select, Start, Spacebar) */}
        <div className="absolute left-1/2 -translate-x-1/2 top-2 z-10 flex items-center gap-3">
          {/* SELECT / COIN (White) */}
          <button
            type="button"
            onTouchStart={(e) => {
              e.preventDefault();
              setPressedButtons((p) => new Set(p).add('btn_select'));
              triggerKeystroke({ keyCode: 'ShiftLeft', keyLabel: 'Shift', keyType: 'shift' });
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              handleButtonRelease('btn_select');
            }}
            onMouseDown={() => {
              setPressedButtons((p) => new Set(p).add('btn_select'));
              triggerKeystroke({ keyCode: 'ShiftLeft', keyLabel: 'Shift', keyType: 'shift' });
            }}
            onMouseUp={() => handleButtonRelease('btn_select')}
            className={`px-3 py-1 rounded-full border text-[10px] font-extrabold tracking-wider uppercase transition-transform cursor-pointer ${
              pressedButtons.has('btn_select')
                ? 'bg-zinc-300 border-white text-black translate-y-0.5'
                : 'bg-white border-zinc-300 text-stone-900 shadow-[0_2px_0_#94a3b8]'
            }`}
          >
            SELECT
          </button>

          {/* START (White) */}
          <button
            type="button"
            onTouchStart={(e) => {
              e.preventDefault();
              setPressedButtons((p) => new Set(p).add('btn_start'));
              triggerKeystroke({ keyCode: 'Enter', keyLabel: 'Enter', keyType: 'enter' });
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              handleButtonRelease('btn_start');
            }}
            onMouseDown={() => {
              setPressedButtons((p) => new Set(p).add('btn_start'));
              triggerKeystroke({ keyCode: 'Enter', keyLabel: 'Enter', keyType: 'enter' });
            }}
            onMouseUp={() => handleButtonRelease('btn_start')}
            className={`px-3 py-1 rounded-full border text-[10px] font-extrabold tracking-wider uppercase transition-transform cursor-pointer ${
              pressedButtons.has('btn_start')
                ? 'bg-zinc-300 border-white text-black translate-y-0.5'
                : 'bg-white border-zinc-300 text-stone-900 shadow-[0_2px_0_#94a3b8]'
            }`}
          >
            START
          </button>
        </div>

        {/* CENTER BOTTOM SPACEBAR (White Arcade Bar) */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-2 z-10">
          <button
            type="button"
            onTouchStart={(e) => {
              e.preventDefault();
              setPressedButtons((p) => new Set(p).add('btn_space'));
              triggerKeystroke({ keyCode: 'Space', keyLabel: ' ', keyType: 'space' });
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              handleButtonRelease('btn_space');
            }}
            onMouseDown={() => {
              setPressedButtons((p) => new Set(p).add('btn_space'));
              triggerKeystroke({ keyCode: 'Space', keyLabel: ' ', keyType: 'space' });
            }}
            onMouseUp={() => handleButtonRelease('btn_space')}
            className={`w-36 sm:w-44 py-2 rounded-xl border text-[11px] font-black tracking-wider uppercase transition-transform cursor-pointer flex items-center justify-center ${
              pressedButtons.has('btn_space')
                ? 'bg-zinc-200 border-white text-black translate-y-1 shadow-inner'
                : 'bg-gradient-to-b from-white via-zinc-100 to-zinc-200 border-zinc-300 text-stone-900 shadow-[0_4px_0_#94a3b8]'
            }`}
          >
            SPACE
          </button>
        </div>

        {/* CUSTOM WHITE ARCADE PUSHBUTTONS (Drag & Drop in Edit Mode, Freeform Custom Positioning) */}
        {buttons.map((btn) => {
          const isPressed = pressedButtons.has(btn.id);

          return (
            <div
              key={btn.id}
              style={{
                position: 'absolute',
                left: `${btn.x}%`,
                top: `${btn.y}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: isLayoutEditMode ? 30 : 15,
                width: `${buttonSize}px`,
                height: `${buttonSize}px`,
              }}
              className="touch-none select-none"
            >
              {/* Outer Bezel (Sleek Metallic Silver / White) */}
              <div
                className={`w-full h-full rounded-full p-1.5 transition-transform bg-[#e2e8f0] border-2 border-[#94a3b8] dark:bg-[#27272a] dark:border-[#52525b] shadow-md ${
                  isLayoutEditMode ? 'ring-2 ring-amber-400 cursor-move' : ''
                }`}
              >
                {/* Inner Plunger Cap: 100% PURE WHITE ARCADE STYLE */}
                <button
                  type="button"
                  onTouchStart={(e) => {
                    if (e.touches[0]) {
                      handleButtonStart(btn, e.touches[0].clientX, e.touches[0].clientY, e);
                    }
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    if (!isLayoutEditMode) {
                      handleButtonRelease(btn.id);
                    }
                  }}
                  onMouseDown={(e) => handleButtonStart(btn, e.clientX, e.clientY, e)}
                  onMouseUp={() => {
                    if (!isLayoutEditMode) {
                      handleButtonRelease(btn.id);
                    }
                  }}
                  onMouseLeave={() => {
                    if (!isLayoutEditMode) {
                      handleButtonRelease(btn.id);
                    }
                  }}
                  className={`w-full h-full rounded-full bg-gradient-to-b from-[#ffffff] via-[#f8fafc] to-[#e2e8f0] border border-white/90 flex flex-col items-center justify-center transition-all cursor-pointer relative ${
                    isPressed
                      ? 'translate-y-1 shadow-[0_2px_0_#94a3b8,inset_0_3px_6px_rgba(0,0,0,0.2)] ring-2 ring-white/60 bg-gradient-to-b from-[#e2e8f0] to-[#cbd5e1]'
                      : 'shadow-[0_6px_0_#94a3b8,0_10px_16px_rgba(0,0,0,0.35)] dark:shadow-[0_6px_0_#3f3f46,0_10px_16px_rgba(0,0,0,0.6)]'
                  }`}
                >
                  {/* Button Label: Bold dark typography */}
                  <span
                    className="font-black text-stone-900 tracking-tight leading-none drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]"
                    style={{ fontSize: `${Math.max(12, Math.floor(buttonSize * 0.24))}px` }}
                  >
                    {btn.label}
                  </span>

                  {/* Sub-label (Keyboard Key) */}
                  {btn.subLabel && (
                    <span
                      className="text-[9px] text-stone-500 font-mono font-bold leading-none mt-0.5 uppercase tracking-tighter"
                      style={{ fontSize: `${Math.max(8, Math.floor(buttonSize * 0.13))}px` }}
                    >
                      {btn.subLabel}
                    </span>
                  )}

                  {/* Edit Indicator Badge in Layout Edit Mode */}
                  {isLayoutEditMode && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-400 text-black text-[10px] font-bold rounded-full flex items-center justify-center shadow-md">
                      <Edit3 className="w-3 h-3" />
                    </span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* FOOTER BAR: Status & Tips */}
      <div className="w-full px-2 py-1 flex items-center justify-between text-[11px] text-zinc-500 border-t border-zinc-800/80">
        <span className="flex items-center gap-1 font-mono">
          <Sparkles className="w-3 h-3 text-sky-400" />
          <span>Arcade Putih &bull; Custom Layout ({buttons.length} Tombol)</span>
        </span>
        <div className="flex items-center gap-2">
          <span>Ukuran: {buttonSize}px</span>
          <button
            type="button"
            onClick={handleResetLayout}
            className="text-zinc-400 hover:text-white flex items-center gap-1 underline text-[10px] cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Posisi</span>
          </button>
        </div>
      </div>

      {/* RESIZE SLIDER DRAWER */}
      {showResizeDrawer && (
        <div className="absolute inset-0 z-40 bg-black/85 backdrop-blur-md p-5 flex flex-col justify-between animate-in fade-in duration-150">
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-sky-400" />
                <h3 className="font-bold text-sm text-white">Ubah Ukuran Tombol (Resize)</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowResizeDrawer(false)}
                className="p-1 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Button Size Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span>Ukuran Tombol Arcade Putih:</span>
                <span className="text-sky-400 font-mono font-bold">{buttonSize}px</span>
              </div>
              <input
                type="range"
                min="50"
                max="96"
                step="2"
                value={buttonSize}
                onChange={(e) => setButtonSize(Number(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-500">
                <span>Kecil (50px)</span>
                <span>Standar (72px)</span>
                <span>Jumbo (96px)</span>
              </div>
            </div>

            {/* D-Pad Size Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span>Ukuran Tombol D-Pad:</span>
                <span className="text-sky-400 font-mono font-bold">{dpadSize}px</span>
              </div>
              <input
                type="range"
                min="44"
                max="74"
                step="2"
                value={dpadSize}
                onChange={(e) => setDpadSize(Number(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-500">
                <span>Kecil (44px)</span>
                <span>Standar (54px)</span>
                <span>Besar (74px)</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowResizeDrawer(false)}
            className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider cursor-pointer rounded-none"
          >
            Terapkan &amp; Tutup
          </button>
        </div>
      )}

      {/* MAPPING MODAL (When tapping any button in layout edit mode) */}
      {editingButton && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-700 p-5 shadow-2xl rounded-none text-white space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <span>Konfigurasi Tombol: {editingButton.label}</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingButton(null)}
                className="p-1 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Label Input */}
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 font-medium">Label Nama Tombol (Teks di Tombol):</label>
              <input
                type="text"
                value={editingButton.label}
                maxLength={8}
                onChange={(e) => setEditingButton({ ...editingButton, label: e.target.value.toUpperCase() })}
                className="w-full p-2 bg-black border border-zinc-700 text-white font-bold text-sm focus:border-sky-500 outline-none rounded-none"
                placeholder="misal: JUMP, FIRE, ROT"
              />
            </div>

            {/* Key Selector Grid */}
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 font-medium">Tombol Keyboard yang Ditekan (Mapping):</label>
              <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto p-1 bg-black/60 border border-zinc-800">
                {MAPPING_KEY_OPTIONS.map((opt) => {
                  const isSelected = editingButton.keyCode === opt.code;
                  return (
                    <button
                      key={opt.code}
                      type="button"
                      onClick={() =>
                        setEditingButton({
                          ...editingButton,
                          keyCode: opt.code,
                          keyLabel: opt.key,
                          keyType: opt.type,
                          subLabel: opt.code.replace('Key', '').replace('Digit', ''),
                        })
                      }
                      className={`p-1.5 text-[11px] text-left truncate border transition-colors cursor-pointer rounded-none ${
                        isSelected
                          ? 'bg-sky-600 border-sky-400 text-white font-bold'
                          : 'border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modifiers (Ctrl, Shift, Alt) */}
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 font-medium">Kombinasi Modifier (Shortcut Khusus):</label>
              <div className="flex gap-4 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingButton.modifiers?.ctrl)}
                    onChange={(e) =>
                      setEditingButton({
                        ...editingButton,
                        modifiers: { ...editingButton.modifiers, ctrl: e.target.checked },
                      })
                    }
                    className="accent-sky-500"
                  />
                  <span>Ctrl</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingButton.modifiers?.shift)}
                    onChange={(e) =>
                      setEditingButton({
                        ...editingButton,
                        modifiers: { ...editingButton.modifiers, shift: e.target.checked },
                      })
                    }
                    className="accent-sky-500"
                  />
                  <span>Shift</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingButton.modifiers?.alt)}
                    onChange={(e) =>
                      setEditingButton({
                        ...editingButton,
                        modifiers: { ...editingButton.modifiers, alt: e.target.checked },
                      })
                    }
                    className="accent-sky-500"
                  />
                  <span>Alt</span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => handleDeleteButton(editingButton.id)}
                className="flex items-center gap-1 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/40 border border-red-900 cursor-pointer rounded-none"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Tombol</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingButton(null)}
                  className="px-3 py-2 text-xs border border-zinc-700 hover:bg-zinc-800 text-zinc-300 cursor-pointer rounded-none"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveButtonEdit(editingButton)}
                  className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer rounded-none"
                >
                  Simpan Mapping
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

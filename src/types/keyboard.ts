export type KeyboardLayoutId = 'qwerty' | 'azerty' | 'dvorak' | 'colemak' | 'numpad' | 'symbols';

export type KeyType = 
  | 'char' 
  | 'space'
  | 'backspace' 
  | 'tab' 
  | 'caps' 
  | 'enter' 
  | 'shift' 
  | 'ctrl' 
  | 'alt' 
  | 'meta' 
  | 'fn'
  | 'arrow'
  | 'numpad'
  | 'action';

export interface KeyModifiers {
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
}

export interface KeyDefinition {
  code: string;            // Standard KeyboardEvent.code (e.g., 'KeyA', 'Digit1', 'Enter')
  label: string;           // Base label (lowercase or primary symbol)
  shiftLabel?: string;     // Shifted label (e.g. uppercase or secondary symbol)
  altLabel?: string;       // AltGr label if applicable
  type: KeyType;
  width?: string;          // Tailwind flex-grow or min-width (e.g., 'w-14', 'flex-[1.5]')
  displayIcon?: string;    // Lucide icon identifier if applicable
  fingerZone?: 'left-pinky' | 'left-ring' | 'left-middle' | 'left-index' | 'thumb' | 'right-index' | 'right-middle' | 'right-ring' | 'right-pinky';
}

export type SoundProfile = 'blue' | 'red' | 'typewriter' | 'bubble' | 'off';

export type ThemeId = 'pastel-white' | 'slate-dark' | 'retro-classic' | 'arctic-nord' | 'emerald-matrix' | 'sunset-ember';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  keyboardCase: string;
  keycapBase: string;
  keycapModifier: string;
  keycapAccent: string;
  keycapActive: string;
  textColor: string;
  subTextColor: string;
  shadowClass: string;
  bgPage: string;
}

export interface KeyPressLog {
  key: string;
  code: string;
  keyCode: number;
  location: number;
  timestamp: number;
}

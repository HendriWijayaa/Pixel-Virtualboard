import { KeyDefinition, KeyboardLayoutId } from '../types/keyboard';

// Row 1: Function / Number row
// Row 2: Top row (QWERTY)
// Row 3: Home row (ASDF)
// Row 4: Bottom row (ZXCV)
// Row 5: Space / Modifier row

export const QWERTY_LAYOUT: KeyDefinition[][] = [
  // Row 1
  [
    { code: 'Backquote', label: '`', shiftLabel: '~', type: 'char', fingerZone: 'left-pinky' },
    { code: 'Digit1', label: '1', shiftLabel: '!', type: 'char', fingerZone: 'left-pinky' },
    { code: 'Digit2', label: '2', shiftLabel: '@', type: 'char', fingerZone: 'left-ring' },
    { code: 'Digit3', label: '3', shiftLabel: '#', type: 'char', fingerZone: 'left-middle' },
    { code: 'Digit4', label: '4', shiftLabel: '$', type: 'char', fingerZone: 'left-index' },
    { code: 'Digit5', label: '5', shiftLabel: '%', type: 'char', fingerZone: 'left-index' },
    { code: 'Digit6', label: '6', shiftLabel: '^', type: 'char', fingerZone: 'right-index' },
    { code: 'Digit7', label: '7', shiftLabel: '&', type: 'char', fingerZone: 'right-index' },
    { code: 'Digit8', label: '8', shiftLabel: '*', type: 'char', fingerZone: 'right-middle' },
    { code: 'Digit9', label: '9', shiftLabel: '(', type: 'char', fingerZone: 'right-ring' },
    { code: 'Digit0', label: '0', shiftLabel: ')', type: 'char', fingerZone: 'right-pinky' },
    { code: 'Minus', label: '-', shiftLabel: '_', type: 'char', fingerZone: 'right-pinky' },
    { code: 'Equal', label: '=', shiftLabel: '+', type: 'char', fingerZone: 'right-pinky' },
    { code: 'Backspace', label: 'Backspace', type: 'backspace', width: 'flex-[1.8]', fingerZone: 'right-pinky' },
  ],
  // Row 2
  [
    { code: 'Tab', label: 'Tab', type: 'tab', width: 'flex-[1.5]', fingerZone: 'left-pinky' },
    { code: 'KeyQ', label: 'q', shiftLabel: 'Q', type: 'char', fingerZone: 'left-pinky' },
    { code: 'KeyW', label: 'w', shiftLabel: 'W', type: 'char', fingerZone: 'left-ring' },
    { code: 'KeyE', label: 'e', shiftLabel: 'E', type: 'char', fingerZone: 'left-middle' },
    { code: 'KeyR', label: 'r', shiftLabel: 'R', type: 'char', fingerZone: 'left-index' },
    { code: 'KeyT', label: 't', shiftLabel: 'T', type: 'char', fingerZone: 'left-index' },
    { code: 'KeyY', label: 'y', shiftLabel: 'Y', type: 'char', fingerZone: 'right-index' },
    { code: 'KeyU', label: 'u', shiftLabel: 'U', type: 'char', fingerZone: 'right-index' },
    { code: 'KeyI', label: 'i', shiftLabel: 'I', type: 'char', fingerZone: 'right-middle' },
    { code: 'KeyO', label: 'o', shiftLabel: 'O', type: 'char', fingerZone: 'right-ring' },
    { code: 'KeyP', label: 'p', shiftLabel: 'P', type: 'char', fingerZone: 'right-pinky' },
    { code: 'BracketLeft', label: '[', shiftLabel: '{', type: 'char', fingerZone: 'right-pinky' },
    { code: 'BracketRight', label: ']', shiftLabel: '}', type: 'char', fingerZone: 'right-pinky' },
    { code: 'Backslash', label: '\\', shiftLabel: '|', type: 'char', width: 'flex-[1.2]', fingerZone: 'right-pinky' },
  ],
  // Row 3
  [
    { code: 'CapsLock', label: 'Caps Lock', type: 'caps', width: 'flex-[1.8]', fingerZone: 'left-pinky' },
    { code: 'KeyA', label: 'a', shiftLabel: 'A', type: 'char', fingerZone: 'left-pinky' },
    { code: 'KeyS', label: 's', shiftLabel: 'S', type: 'char', fingerZone: 'left-ring' },
    { code: 'KeyD', label: 'd', shiftLabel: 'D', type: 'char', fingerZone: 'left-middle' },
    { code: 'KeyF', label: 'f', shiftLabel: 'F', type: 'char', fingerZone: 'left-index' },
    { code: 'KeyG', label: 'g', shiftLabel: 'G', type: 'char', fingerZone: 'left-index' },
    { code: 'KeyH', label: 'h', shiftLabel: 'H', type: 'char', fingerZone: 'right-index' },
    { code: 'KeyJ', label: 'j', shiftLabel: 'J', type: 'char', fingerZone: 'right-index' },
    { code: 'KeyK', label: 'k', shiftLabel: 'K', type: 'char', fingerZone: 'right-middle' },
    { code: 'KeyL', label: 'l', shiftLabel: 'L', type: 'char', fingerZone: 'right-ring' },
    { code: 'Semicolon', label: ';', shiftLabel: ':', type: 'char', fingerZone: 'right-pinky' },
    { code: 'Quote', label: "'", shiftLabel: '"', type: 'char', fingerZone: 'right-pinky' },
    { code: 'Enter', label: 'Enter', type: 'enter', width: 'flex-[2.2]', fingerZone: 'right-pinky' },
  ],
  // Row 4
  [
    { code: 'ShiftLeft', label: 'Shift', type: 'shift', width: 'flex-[2.4]', fingerZone: 'left-pinky' },
    { code: 'KeyZ', label: 'z', shiftLabel: 'Z', type: 'char', fingerZone: 'left-pinky' },
    { code: 'KeyX', label: 'x', shiftLabel: 'X', type: 'char', fingerZone: 'left-ring' },
    { code: 'KeyC', label: 'c', shiftLabel: 'C', type: 'char', fingerZone: 'left-middle' },
    { code: 'KeyV', label: 'v', shiftLabel: 'V', type: 'char', fingerZone: 'left-index' },
    { code: 'KeyB', label: 'b', shiftLabel: 'B', type: 'char', fingerZone: 'left-index' },
    { code: 'KeyN', label: 'n', shiftLabel: 'N', type: 'char', fingerZone: 'right-index' },
    { code: 'KeyM', label: 'm', shiftLabel: 'M', type: 'char', fingerZone: 'right-index' },
    { code: 'Comma', label: ',', shiftLabel: '<', type: 'char', fingerZone: 'right-middle' },
    { code: 'Period', label: '.', shiftLabel: '>', type: 'char', fingerZone: 'right-ring' },
    { code: 'Slash', label: '/', shiftLabel: '?', type: 'char', fingerZone: 'right-pinky' },
    { code: 'ShiftRight', label: 'Shift', type: 'shift', width: 'flex-[2.8]', fingerZone: 'right-pinky' },
  ],
  // Row 5
  [
    { code: 'ControlLeft', label: 'Ctrl', type: 'ctrl', width: 'flex-[1.3]', fingerZone: 'left-pinky' },
    { code: 'MetaLeft', label: 'Win', type: 'meta', width: 'flex-[1.2]', fingerZone: 'left-pinky' },
    { code: 'AltLeft', label: 'Alt', type: 'alt', width: 'flex-[1.2]', fingerZone: 'thumb' },
    { code: 'Space', label: 'Space', type: 'space', width: 'flex-[6.2]', fingerZone: 'thumb' },
    { code: 'AltRight', label: 'AltGr', type: 'alt', width: 'flex-[1.2]', fingerZone: 'thumb' },
    { code: 'MetaRight', label: 'Menu', type: 'meta', width: 'flex-[1.2]', fingerZone: 'right-pinky' },
    { code: 'ControlRight', label: 'Ctrl', type: 'ctrl', width: 'flex-[1.3]', fingerZone: 'right-pinky' },
  ]
];

// AZERTY Layout
export const AZERTY_LAYOUT: KeyDefinition[][] = [
  // Row 1
  [
    { code: 'Backquote', label: '²', shiftLabel: '³', type: 'char', fingerZone: 'left-pinky' },
    { code: 'Digit1', label: '&', shiftLabel: '1', type: 'char', fingerZone: 'left-pinky' },
    { code: 'Digit2', label: 'é', shiftLabel: '2', type: 'char', fingerZone: 'left-ring' },
    { code: 'Digit3', label: '"', shiftLabel: '3', type: 'char', fingerZone: 'left-middle' },
    { code: 'Digit4', label: "'", shiftLabel: '4', type: 'char', fingerZone: 'left-index' },
    { code: 'Digit5', label: '(', shiftLabel: '5', type: 'char', fingerZone: 'left-index' },
    { code: 'Digit6', label: '-', shiftLabel: '6', type: 'char', fingerZone: 'right-index' },
    { code: 'Digit7', label: 'è', shiftLabel: '7', type: 'char', fingerZone: 'right-index' },
    { code: 'Digit8', label: '_', shiftLabel: '8', type: 'char', fingerZone: 'right-middle' },
    { code: 'Digit9', label: 'ç', shiftLabel: '9', type: 'char', fingerZone: 'right-ring' },
    { code: 'Digit0', label: 'à', shiftLabel: '0', type: 'char', fingerZone: 'right-pinky' },
    { code: 'Minus', label: ')', shiftLabel: '°', type: 'char', fingerZone: 'right-pinky' },
    { code: 'Equal', label: '=', shiftLabel: '+', type: 'char', fingerZone: 'right-pinky' },
    { code: 'Backspace', label: 'Backspace', type: 'backspace', width: 'flex-[1.8]', fingerZone: 'right-pinky' },
  ],
  // Row 2
  [
    { code: 'Tab', label: 'Tab', type: 'tab', width: 'flex-[1.5]', fingerZone: 'left-pinky' },
    { code: 'KeyQ', label: 'a', shiftLabel: 'A', type: 'char', fingerZone: 'left-pinky' },
    { code: 'KeyW', label: 'z', shiftLabel: 'Z', type: 'char', fingerZone: 'left-ring' },
    { code: 'KeyE', label: 'e', shiftLabel: 'E', type: 'char', fingerZone: 'left-middle' },
    { code: 'KeyR', label: 'r', shiftLabel: 'R', type: 'char', fingerZone: 'left-index' },
    { code: 'KeyT', label: 't', shiftLabel: 'T', type: 'char', fingerZone: 'left-index' },
    { code: 'KeyY', label: 'y', shiftLabel: 'Y', type: 'char', fingerZone: 'right-index' },
    { code: 'KeyU', label: 'u', shiftLabel: 'U', type: 'char', fingerZone: 'right-index' },
    { code: 'KeyI', label: 'i', shiftLabel: 'I', type: 'char', fingerZone: 'right-middle' },
    { code: 'KeyO', label: 'o', shiftLabel: 'O', type: 'char', fingerZone: 'right-ring' },
    { code: 'KeyP', label: 'p', shiftLabel: 'P', type: 'char', fingerZone: 'right-pinky' },
    { code: 'BracketLeft', label: '^', shiftLabel: '¨', type: 'char', fingerZone: 'right-pinky' },
    { code: 'BracketRight', label: '$', shiftLabel: '£', type: 'char', fingerZone: 'right-pinky' },
    { code: 'Backslash', label: '*', shiftLabel: 'µ', type: 'char', width: 'flex-[1.2]', fingerZone: 'right-pinky' },
  ],
  // Row 3
  [
    { code: 'CapsLock', label: 'Caps Lock', type: 'caps', width: 'flex-[1.8]', fingerZone: 'left-pinky' },
    { code: 'KeyA', label: 'q', shiftLabel: 'Q', type: 'char', fingerZone: 'left-pinky' },
    { code: 'KeyS', label: 's', shiftLabel: 'S', type: 'char', fingerZone: 'left-ring' },
    { code: 'KeyD', label: 'd', shiftLabel: 'D', type: 'char', fingerZone: 'left-middle' },
    { code: 'KeyF', label: 'f', shiftLabel: 'F', type: 'char', fingerZone: 'left-index' },
    { code: 'KeyG', label: 'g', shiftLabel: 'G', type: 'char', fingerZone: 'left-index' },
    { code: 'KeyH', label: 'h', shiftLabel: 'H', type: 'char', fingerZone: 'right-index' },
    { code: 'KeyJ', label: 'j', shiftLabel: 'J', type: 'char', fingerZone: 'right-index' },
    { code: 'KeyK', label: 'k', shiftLabel: 'K', type: 'char', fingerZone: 'right-middle' },
    { code: 'KeyL', label: 'l', shiftLabel: 'L', type: 'char', fingerZone: 'right-ring' },
    { code: 'Semicolon', label: 'm', shiftLabel: 'M', type: 'char', fingerZone: 'right-pinky' },
    { code: 'Quote', label: 'ù', shiftLabel: '%', type: 'char', fingerZone: 'right-pinky' },
    { code: 'Enter', label: 'Enter', type: 'enter', width: 'flex-[2.2]', fingerZone: 'right-pinky' },
  ],
  // Row 4
  [
    { code: 'ShiftLeft', label: 'Shift', type: 'shift', width: 'flex-[2.4]', fingerZone: 'left-pinky' },
    { code: 'KeyZ', label: 'w', shiftLabel: 'W', type: 'char', fingerZone: 'left-pinky' },
    { code: 'KeyX', label: 'x', shiftLabel: 'X', type: 'char', fingerZone: 'left-ring' },
    { code: 'KeyC', label: 'c', shiftLabel: 'C', type: 'char', fingerZone: 'left-middle' },
    { code: 'KeyV', label: 'v', shiftLabel: 'V', type: 'char', fingerZone: 'left-index' },
    { code: 'KeyB', label: 'b', shiftLabel: 'B', type: 'char', fingerZone: 'left-index' },
    { code: 'KeyN', label: 'n', shiftLabel: 'N', type: 'char', fingerZone: 'right-index' },
    { code: 'KeyM', label: ',', shiftLabel: '?', type: 'char', fingerZone: 'right-index' },
    { code: 'Comma', label: ';', shiftLabel: '.', type: 'char', fingerZone: 'right-middle' },
    { code: 'Period', label: ':', shiftLabel: '/', type: 'char', fingerZone: 'right-ring' },
    { code: 'Slash', label: '!', shiftLabel: '§', type: 'char', fingerZone: 'right-pinky' },
    { code: 'ShiftRight', label: 'Shift', type: 'shift', width: 'flex-[2.8]', fingerZone: 'right-pinky' },
  ],
  // Row 5
  [
    { code: 'ControlLeft', label: 'Ctrl', type: 'ctrl', width: 'flex-[1.3]', fingerZone: 'left-pinky' },
    { code: 'MetaLeft', label: 'Win', type: 'meta', width: 'flex-[1.2]', fingerZone: 'left-pinky' },
    { code: 'AltLeft', label: 'Alt', type: 'alt', width: 'flex-[1.2]', fingerZone: 'thumb' },
    { code: 'Space', label: 'Space', type: 'space', width: 'flex-[6.2]', fingerZone: 'thumb' },
    { code: 'AltRight', label: 'AltGr', type: 'alt', width: 'flex-[1.2]', fingerZone: 'thumb' },
    { code: 'MetaRight', label: 'Menu', type: 'meta', width: 'flex-[1.2]', fingerZone: 'right-pinky' },
    { code: 'ControlRight', label: 'Ctrl', type: 'ctrl', width: 'flex-[1.3]', fingerZone: 'right-pinky' },
  ]
];

// DVORAK Layout
export const DVORAK_LAYOUT: KeyDefinition[][] = [
  // Row 1
  [
    { code: 'Backquote', label: '`', shiftLabel: '~', type: 'char', fingerZone: 'left-pinky' },
    { code: 'Digit1', label: '1', shiftLabel: '!', type: 'char', fingerZone: 'left-pinky' },
    { code: 'Digit2', label: '2', shiftLabel: '@', type: 'char', fingerZone: 'left-ring' },
    { code: 'Digit3', label: '3', shiftLabel: '#', type: 'char', fingerZone: 'left-middle' },
    { code: 'Digit4', label: '4', shiftLabel: '$', type: 'char', fingerZone: 'left-index' },
    { code: 'Digit5', label: '5', shiftLabel: '%', type: 'char', fingerZone: 'left-index' },
    { code: 'Digit6', label: '6', shiftLabel: '^', type: 'char', fingerZone: 'right-index' },
    { code: 'Digit7', label: '7', shiftLabel: '&', type: 'char', fingerZone: 'right-index' },
    { code: 'Digit8', label: '8', shiftLabel: '*', type: 'char', fingerZone: 'right-middle' },
    { code: 'Digit9', label: '9', shiftLabel: '(', type: 'char', fingerZone: 'right-ring' },
    { code: 'Digit0', label: '0', shiftLabel: ')', type: 'char', fingerZone: 'right-pinky' },
    { code: 'Minus', label: '[', shiftLabel: '{', type: 'char', fingerZone: 'right-pinky' },
    { code: 'Equal', label: ']', shiftLabel: '}', type: 'char', fingerZone: 'right-pinky' },
    { code: 'Backspace', label: 'Backspace', type: 'backspace', width: 'flex-[1.8]', fingerZone: 'right-pinky' },
  ],
  // Row 2
  [
    { code: 'Tab', label: 'Tab', type: 'tab', width: 'flex-[1.5]', fingerZone: 'left-pinky' },
    { code: 'KeyQ', label: "'", shiftLabel: '"', type: 'char', fingerZone: 'left-pinky' },
    { code: 'KeyW', label: ',', shiftLabel: '<', type: 'char', fingerZone: 'left-ring' },
    { code: 'KeyE', label: '.', shiftLabel: '>', type: 'char', fingerZone: 'left-middle' },
    { code: 'KeyR', label: 'p', shiftLabel: 'P', type: 'char', fingerZone: 'left-index' },
    { code: 'KeyT', label: 'y', shiftLabel: 'Y', type: 'char', fingerZone: 'left-index' },
    { code: 'KeyY', label: 'f', shiftLabel: 'F', type: 'char', fingerZone: 'right-index' },
    { code: 'KeyU', label: 'g', shiftLabel: 'G', type: 'char', fingerZone: 'right-index' },
    { code: 'KeyI', label: 'c', shiftLabel: 'C', type: 'char', fingerZone: 'right-middle' },
    { code: 'KeyO', label: 'r', shiftLabel: 'R', type: 'char', fingerZone: 'right-ring' },
    { code: 'KeyP', label: 'l', shiftLabel: 'L', type: 'char', fingerZone: 'right-pinky' },
    { code: 'BracketLeft', label: '/', shiftLabel: '?', type: 'char', fingerZone: 'right-pinky' },
    { code: 'BracketRight', label: '=', shiftLabel: '+', type: 'char', fingerZone: 'right-pinky' },
    { code: 'Backslash', label: '\\', shiftLabel: '|', type: 'char', width: 'flex-[1.2]', fingerZone: 'right-pinky' },
  ],
  // Row 3
  [
    { code: 'CapsLock', label: 'Caps Lock', type: 'caps', width: 'flex-[1.8]', fingerZone: 'left-pinky' },
    { code: 'KeyA', label: 'a', shiftLabel: 'A', type: 'char', fingerZone: 'left-pinky' },
    { code: 'KeyS', label: 'o', shiftLabel: 'O', type: 'char', fingerZone: 'left-ring' },
    { code: 'KeyD', label: 'e', shiftLabel: 'E', type: 'char', fingerZone: 'left-middle' },
    { code: 'KeyF', label: 'u', shiftLabel: 'U', type: 'char', fingerZone: 'left-index' },
    { code: 'KeyG', label: 'i', shiftLabel: 'I', type: 'char', fingerZone: 'left-index' },
    { code: 'KeyH', label: 'd', shiftLabel: 'D', type: 'char', fingerZone: 'right-index' },
    { code: 'KeyJ', label: 'h', shiftLabel: 'H', type: 'char', fingerZone: 'right-index' },
    { code: 'KeyK', label: 't', shiftLabel: 'T', type: 'char', fingerZone: 'right-middle' },
    { code: 'KeyL', label: 'n', shiftLabel: 'N', type: 'char', fingerZone: 'right-ring' },
    { code: 'Semicolon', label: 's', shiftLabel: 'S', type: 'char', fingerZone: 'right-pinky' },
    { code: 'Quote', label: '-', shiftLabel: '_', type: 'char', fingerZone: 'right-pinky' },
    { code: 'Enter', label: 'Enter', type: 'enter', width: 'flex-[2.2]', fingerZone: 'right-pinky' },
  ],
  // Row 4
  [
    { code: 'ShiftLeft', label: 'Shift', type: 'shift', width: 'flex-[2.4]', fingerZone: 'left-pinky' },
    { code: 'KeyZ', label: ';', shiftLabel: ':', type: 'char', fingerZone: 'left-pinky' },
    { code: 'KeyX', label: 'q', shiftLabel: 'Q', type: 'char', fingerZone: 'left-ring' },
    { code: 'KeyC', label: 'j', shiftLabel: 'J', type: 'char', fingerZone: 'left-middle' },
    { code: 'KeyV', label: 'k', shiftLabel: 'K', type: 'char', fingerZone: 'left-index' },
    { code: 'KeyB', label: 'x', shiftLabel: 'X', type: 'char', fingerZone: 'left-index' },
    { code: 'KeyN', label: 'b', shiftLabel: 'B', type: 'char', fingerZone: 'right-index' },
    { code: 'KeyM', label: 'm', shiftLabel: 'M', type: 'char', fingerZone: 'right-index' },
    { code: 'Comma', label: 'w', shiftLabel: 'W', type: 'char', fingerZone: 'right-middle' },
    { code: 'Period', label: 'v', shiftLabel: 'V', type: 'char', fingerZone: 'right-ring' },
    { code: 'Slash', label: 'z', shiftLabel: 'Z', type: 'char', fingerZone: 'right-pinky' },
    { code: 'ShiftRight', label: 'Shift', type: 'shift', width: 'flex-[2.8]', fingerZone: 'right-pinky' },
  ],
  // Row 5
  [
    { code: 'ControlLeft', label: 'Ctrl', type: 'ctrl', width: 'flex-[1.3]', fingerZone: 'left-pinky' },
    { code: 'MetaLeft', label: 'Win', type: 'meta', width: 'flex-[1.2]', fingerZone: 'left-pinky' },
    { code: 'AltLeft', label: 'Alt', type: 'alt', width: 'flex-[1.2]', fingerZone: 'thumb' },
    { code: 'Space', label: 'Space', type: 'space', width: 'flex-[6.2]', fingerZone: 'thumb' },
    { code: 'AltRight', label: 'AltGr', type: 'alt', width: 'flex-[1.2]', fingerZone: 'thumb' },
    { code: 'MetaRight', label: 'Menu', type: 'meta', width: 'flex-[1.2]', fingerZone: 'right-pinky' },
    { code: 'ControlRight', label: 'Ctrl', type: 'ctrl', width: 'flex-[1.3]', fingerZone: 'right-pinky' },
  ]
];

// COLEMAK Layout
export const COLEMAK_LAYOUT: KeyDefinition[][] = [
  // Row 1
  [
    { code: 'Backquote', label: '`', shiftLabel: '~', type: 'char', fingerZone: 'left-pinky' },
    { code: 'Digit1', label: '1', shiftLabel: '!', type: 'char', fingerZone: 'left-pinky' },
    { code: 'Digit2', label: '2', shiftLabel: '@', type: 'char', fingerZone: 'left-ring' },
    { code: 'Digit3', label: '3', shiftLabel: '#', type: 'char', fingerZone: 'left-middle' },
    { code: 'Digit4', label: '4', shiftLabel: '$', type: 'char', fingerZone: 'left-index' },
    { code: 'Digit5', label: '5', shiftLabel: '%', type: 'char', fingerZone: 'left-index' },
    { code: 'Digit6', label: '6', shiftLabel: '^', type: 'char', fingerZone: 'right-index' },
    { code: 'Digit7', label: '7', shiftLabel: '&', type: 'char', fingerZone: 'right-index' },
    { code: 'Digit8', label: '8', shiftLabel: '*', type: 'char', fingerZone: 'right-middle' },
    { code: 'Digit9', label: '9', shiftLabel: '(', type: 'char', fingerZone: 'right-ring' },
    { code: 'Digit0', label: '0', shiftLabel: ')', type: 'char', fingerZone: 'right-pinky' },
    { code: 'Minus', label: '-', shiftLabel: '_', type: 'char', fingerZone: 'right-pinky' },
    { code: 'Equal', label: '=', shiftLabel: '+', type: 'char', fingerZone: 'right-pinky' },
    { code: 'Backspace', label: 'Backspace', type: 'backspace', width: 'flex-[1.8]', fingerZone: 'right-pinky' },
  ],
  // Row 2
  [
    { code: 'Tab', label: 'Tab', type: 'tab', width: 'flex-[1.5]', fingerZone: 'left-pinky' },
    { code: 'KeyQ', label: 'q', shiftLabel: 'Q', type: 'char', fingerZone: 'left-pinky' },
    { code: 'KeyW', label: 'w', shiftLabel: 'W', type: 'char', fingerZone: 'left-ring' },
    { code: 'KeyE', label: 'f', shiftLabel: 'F', type: 'char', fingerZone: 'left-middle' },
    { code: 'KeyR', label: 'p', shiftLabel: 'P', type: 'char', fingerZone: 'left-index' },
    { code: 'KeyT', label: 'g', shiftLabel: 'G', type: 'char', fingerZone: 'left-index' },
    { code: 'KeyY', label: 'j', shiftLabel: 'J', type: 'char', fingerZone: 'right-index' },
    { code: 'KeyU', label: 'l', shiftLabel: 'L', type: 'char', fingerZone: 'right-index' },
    { code: 'KeyI', label: 'u', shiftLabel: 'U', type: 'char', fingerZone: 'right-middle' },
    { code: 'KeyO', label: 'y', shiftLabel: 'Y', type: 'char', fingerZone: 'right-ring' },
    { code: 'KeyP', label: ';', shiftLabel: ':', type: 'char', fingerZone: 'right-pinky' },
    { code: 'BracketLeft', label: '[', shiftLabel: '{', type: 'char', fingerZone: 'right-pinky' },
    { code: 'BracketRight', label: ']', shiftLabel: '}', type: 'char', fingerZone: 'right-pinky' },
    { code: 'Backslash', label: '\\', shiftLabel: '|', type: 'char', width: 'flex-[1.2]', fingerZone: 'right-pinky' },
  ],
  // Row 3
  [
    { code: 'CapsLock', label: 'Backspace', type: 'caps', width: 'flex-[1.8]', fingerZone: 'left-pinky' },
    { code: 'KeyA', label: 'a', shiftLabel: 'A', type: 'char', fingerZone: 'left-pinky' },
    { code: 'KeyS', label: 'r', shiftLabel: 'R', type: 'char', fingerZone: 'left-ring' },
    { code: 'KeyD', label: 's', shiftLabel: 'S', type: 'char', fingerZone: 'left-middle' },
    { code: 'KeyF', label: 't', shiftLabel: 'T', type: 'char', fingerZone: 'left-index' },
    { code: 'KeyG', label: 'd', shiftLabel: 'D', type: 'char', fingerZone: 'left-index' },
    { code: 'KeyH', label: 'h', shiftLabel: 'H', type: 'char', fingerZone: 'right-index' },
    { code: 'KeyJ', label: 'n', shiftLabel: 'N', type: 'char', fingerZone: 'right-index' },
    { code: 'KeyK', label: 'e', shiftLabel: 'E', type: 'char', fingerZone: 'right-middle' },
    { code: 'KeyL', label: 'i', shiftLabel: 'I', type: 'char', fingerZone: 'right-ring' },
    { code: 'Semicolon', label: 'o', shiftLabel: 'O', type: 'char', fingerZone: 'right-pinky' },
    { code: 'Quote', label: "'", shiftLabel: '"', type: 'char', fingerZone: 'right-pinky' },
    { code: 'Enter', label: 'Enter', type: 'enter', width: 'flex-[2.2]', fingerZone: 'right-pinky' },
  ],
  // Row 4
  [
    { code: 'ShiftLeft', label: 'Shift', type: 'shift', width: 'flex-[2.4]', fingerZone: 'left-pinky' },
    { code: 'KeyZ', label: 'z', shiftLabel: 'Z', type: 'char', fingerZone: 'left-pinky' },
    { code: 'KeyX', label: 'x', shiftLabel: 'X', type: 'char', fingerZone: 'left-ring' },
    { code: 'KeyC', label: 'c', shiftLabel: 'C', type: 'char', fingerZone: 'left-middle' },
    { code: 'KeyV', label: 'v', shiftLabel: 'V', type: 'char', fingerZone: 'left-index' },
    { code: 'KeyB', label: 'b', shiftLabel: 'B', type: 'char', fingerZone: 'left-index' },
    { code: 'KeyN', label: 'k', shiftLabel: 'K', type: 'char', fingerZone: 'right-index' },
    { code: 'KeyM', label: 'm', shiftLabel: 'M', type: 'char', fingerZone: 'right-index' },
    { code: 'Comma', label: ',', shiftLabel: '<', type: 'char', fingerZone: 'right-middle' },
    { code: 'Period', label: '.', shiftLabel: '>', type: 'char', fingerZone: 'right-ring' },
    { code: 'Slash', label: '/', shiftLabel: '?', type: 'char', fingerZone: 'right-pinky' },
    { code: 'ShiftRight', label: 'Shift', type: 'shift', width: 'flex-[2.8]', fingerZone: 'right-pinky' },
  ],
  // Row 5
  [
    { code: 'ControlLeft', label: 'Ctrl', type: 'ctrl', width: 'flex-[1.3]', fingerZone: 'left-pinky' },
    { code: 'MetaLeft', label: 'Win', type: 'meta', width: 'flex-[1.2]', fingerZone: 'left-pinky' },
    { code: 'AltLeft', label: 'Alt', type: 'alt', width: 'flex-[1.2]', fingerZone: 'thumb' },
    { code: 'Space', label: 'Space', type: 'space', width: 'flex-[6.2]', fingerZone: 'thumb' },
    { code: 'AltRight', label: 'AltGr', type: 'alt', width: 'flex-[1.2]', fingerZone: 'thumb' },
    { code: 'MetaRight', label: 'Menu', type: 'meta', width: 'flex-[1.2]', fingerZone: 'right-pinky' },
    { code: 'ControlRight', label: 'Ctrl', type: 'ctrl', width: 'flex-[1.3]', fingerZone: 'right-pinky' },
  ]
];

// Numpad Layout (Numeric Keypad)
export const NUMPAD_LAYOUT: KeyDefinition[][] = [
  [
    { code: 'NumLock', label: 'NumLk', type: 'action', width: 'flex-1' },
    { code: 'NumpadDivide', label: '/', type: 'char', width: 'flex-1' },
    { code: 'NumpadMultiply', label: '*', type: 'char', width: 'flex-1' },
    { code: 'NumpadSubtract', label: '-', type: 'char', width: 'flex-1' },
  ],
  [
    { code: 'Numpad7', label: '7', type: 'char', width: 'flex-1' },
    { code: 'Numpad8', label: '8', type: 'char', width: 'flex-1' },
    { code: 'Numpad9', label: '9', type: 'char', width: 'flex-1' },
    { code: 'NumpadAdd', label: '+', type: 'char', width: 'flex-1' },
  ],
  [
    { code: 'Numpad4', label: '4', type: 'char', width: 'flex-1' },
    { code: 'Numpad5', label: '5', type: 'char', width: 'flex-1' },
    { code: 'Numpad6', label: '6', type: 'char', width: 'flex-1' },
    { code: 'Backspace', label: '⌫', type: 'backspace', width: 'flex-1' },
  ],
  [
    { code: 'Numpad1', label: '1', type: 'char', width: 'flex-1' },
    { code: 'Numpad2', label: '2', type: 'char', width: 'flex-1' },
    { code: 'Numpad3', label: '3', type: 'char', width: 'flex-1' },
    { code: 'NumpadEnter', label: '↵', type: 'enter', width: 'flex-1' },
  ],
  [
    { code: 'Numpad0', label: '0', type: 'char', width: 'flex-[2]' },
    { code: 'NumpadDecimal', label: '.', type: 'char', width: 'flex-1' },
    { code: 'Space', label: 'Space', type: 'space', width: 'flex-1' },
  ]
];

// Special Symbols, Accents & Currency
export const SYMBOLS_LAYOUT: KeyDefinition[][] = [
  [
    { code: 'SymRp', label: 'Rp', type: 'char' },
    { code: 'SymDollar', label: '$', type: 'char' },
    { code: 'SymEuro', label: '€', type: 'char' },
    { code: 'SymPound', label: '£', type: 'char' },
    { code: 'SymYen', label: '¥', type: 'char' },
    { code: 'SymCent', label: '¢', type: 'char' },
    { code: 'SymPercent', label: '%', type: 'char' },
    { code: 'SymPlusMinus', label: '±', type: 'char' },
    { code: 'SymDegree', label: '°', type: 'char' },
    { code: 'SymMicro', label: 'µ', type: 'char' },
    { code: 'SymPi', label: 'π', type: 'char' },
    { code: 'SymInfinity', label: '∞', type: 'char' },
    { code: 'Backspace', label: 'Backspace', type: 'backspace', width: 'flex-[1.5]' },
  ],
  [
    { code: 'SymCheck', label: '✓', type: 'char' },
    { code: 'SymCross', label: '✗', type: 'char' },
    { code: 'SymHeart', label: '❤', type: 'char' },
    { code: 'SymStar', label: '★', type: 'char' },
    { code: 'SymSparkle', label: '✨', type: 'char' },
    { code: 'SymFire', label: '🔥', type: 'char' },
    { code: 'SymThumbUp', label: '👍', type: 'char' },
    { code: 'SymClap', label: '👏', type: 'char' },
    { code: 'SymSmile', label: '😊', type: 'char' },
    { code: 'SymRocket', label: '🚀', type: 'char' },
    { code: 'SymIdea', label: '💡', type: 'char' },
    { code: 'SymTarget', label: '🎯', type: 'char' },
    { code: 'Enter', label: 'Enter', type: 'enter', width: 'flex-[1.5]' },
  ],
  [
    { code: 'SymArrowLeft', label: '←', type: 'char' },
    { code: 'SymArrowRight', label: '→', type: 'char' },
    { code: 'SymArrowUp', label: '↑', type: 'char' },
    { code: 'SymArrowDown', label: '↓', type: 'char' },
    { code: 'SymCopyright', label: '©', type: 'char' },
    { code: 'SymRegistered', label: '®', type: 'char' },
    { code: 'SymTrademark', label: '™', type: 'char' },
    { code: 'SymBullet', label: '•', type: 'char' },
    { code: 'SymEllipsis', label: '…', type: 'char' },
    { code: 'SymEmDash', label: '—', type: 'char' },
    { code: 'SymEnDash', label: '–', type: 'char' },
    { code: 'SymSection', label: '§', type: 'char' },
  ],
  [
    { code: 'Space', label: 'Spasi Simbol', type: 'space', width: 'flex-[4]' },
    { code: 'SymQuoteOpen', label: '“', type: 'char' },
    { code: 'SymQuoteClose', label: '”', type: 'char' },
    { code: 'SymGuillOpen', label: '«', type: 'char' },
    { code: 'SymGuillClose', label: '»', type: 'char' },
    { code: 'SymApprox', label: '≈', type: 'char' },
    { code: 'SymNotEqual', label: '≠', type: 'char' },
    { code: 'SymLessEqual', label: '≤', type: 'char' },
    { code: 'SymGreatEqual', label: '≥', type: 'char' },
  ]
];

export const getLayout = (id: KeyboardLayoutId): KeyDefinition[][] => {
  switch (id) {
    case 'qwerty': return QWERTY_LAYOUT;
    case 'azerty': return AZERTY_LAYOUT;
    case 'dvorak': return DVORAK_LAYOUT;
    case 'colemak': return COLEMAK_LAYOUT;
    case 'numpad': return NUMPAD_LAYOUT;
    case 'symbols': return SYMBOLS_LAYOUT;
    default: return QWERTY_LAYOUT;
  }
};

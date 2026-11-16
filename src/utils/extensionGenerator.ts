import JSZip from 'jszip';

/**
 * Creates a ready-to-load Chrome/Edge extension ZIP file
 * with seamless multi-tab switching support, background tab prevention,
 * and auto-reconnect on visibilitychange/focus.
 */
export async function buildExtensionZip(roomId: string, origin: string): Promise<JSZip> {
  const zip = new JSZip();

  const wsProtocol = origin.startsWith('https:') ? 'wss:' : 'ws:';
  const wsHost = origin.replace(/^https?:\/\//, '');
  const wsUrl = `${wsProtocol}//${wsHost}`;

  // 1. Manifest V3
  const manifest = {
    manifest_version: 3,
    name: 'Pixel Virtual Keyboard',
    version: '1.2.0',
    description: 'Mengetik di semua tab browser (YouTube, Google Docs, ChatGPT, WhatsApp Web) langsung dari smartphone Anda.',
    permissions: ['storage'],
    host_permissions: ['<all_urls>'],
    action: {
      default_popup: 'popup.html',
    },
    content_scripts: [
      {
        matches: ['<all_urls>'],
        js: ['content.js'],
        run_at: 'document_idle',
        all_frames: false,
      },
    ],
  };

  zip.file('manifest.json', JSON.stringify(manifest, null, 2));

  // 2. Content Script
  const contentScript = `
(function() {
  if (window.__KEYVIBE_EXT_ACTIVE__) return;
  window.__KEYVIBE_EXT_ACTIVE__ = true;

  let ws = null;
  let currentRoomId = '${roomId}';
  let wsServerUrl = '${wsUrl}';
  let isEnabled = true;

  // Complete Key & KeyCode definitions for 3D apps (Blockbench, Blender web, Three.js) and standard typing
  const KEY_MAP = {
    // Letters
    KeyA: { code: 'KeyA', key: 'a', shiftKey: 'A', keyCode: 65 },
    KeyB: { code: 'KeyB', key: 'b', shiftKey: 'B', keyCode: 66 },
    KeyC: { code: 'KeyC', key: 'c', shiftKey: 'C', keyCode: 67 },
    KeyD: { code: 'KeyD', key: 'd', shiftKey: 'D', keyCode: 68 },
    KeyE: { code: 'KeyE', key: 'e', shiftKey: 'E', keyCode: 69 },
    KeyF: { code: 'KeyF', key: 'f', shiftKey: 'F', keyCode: 70 },
    KeyG: { code: 'KeyG', key: 'g', shiftKey: 'G', keyCode: 71 },
    KeyH: { code: 'KeyH', key: 'h', shiftKey: 'H', keyCode: 72 },
    KeyI: { code: 'KeyI', key: 'i', shiftKey: 'I', keyCode: 73 },
    KeyJ: { code: 'KeyJ', key: 'j', shiftKey: 'J', keyCode: 74 },
    KeyK: { code: 'KeyK', key: 'k', shiftKey: 'K', keyCode: 75 },
    KeyL: { code: 'KeyL', key: 'l', shiftKey: 'L', keyCode: 76 },
    KeyM: { code: 'KeyM', key: 'm', shiftKey: 'M', keyCode: 77 },
    KeyN: { code: 'KeyN', key: 'n', shiftKey: 'N', keyCode: 78 },
    KeyO: { code: 'KeyO', key: 'o', shiftKey: 'O', keyCode: 79 },
    KeyP: { code: 'KeyP', key: 'p', shiftKey: 'P', keyCode: 80 },
    KeyQ: { code: 'KeyQ', key: 'q', shiftKey: 'Q', keyCode: 81 },
    KeyR: { code: 'KeyR', key: 'r', shiftKey: 'R', keyCode: 82 },
    KeyS: { code: 'KeyS', key: 's', shiftKey: 'S', keyCode: 83 },
    KeyT: { code: 'KeyT', key: 't', shiftKey: 'T', keyCode: 84 },
    KeyU: { code: 'KeyU', key: 'u', shiftKey: 'U', keyCode: 85 },
    KeyV: { code: 'KeyV', key: 'v', shiftKey: 'V', keyCode: 86 },
    KeyW: { code: 'KeyW', key: 'w', shiftKey: 'W', keyCode: 87 },
    KeyX: { code: 'KeyX', key: 'x', shiftKey: 'X', keyCode: 88 },
    KeyY: { code: 'KeyY', key: 'y', shiftKey: 'Y', keyCode: 89 },
    KeyZ: { code: 'KeyZ', key: 'z', shiftKey: 'Z', keyCode: 90 },

    // Digits
    Digit0: { code: 'Digit0', key: '0', shiftKey: ')', keyCode: 48 },
    Digit1: { code: 'Digit1', key: '1', shiftKey: '!', keyCode: 49 },
    Digit2: { code: 'Digit2', key: '2', shiftKey: '@', keyCode: 50 },
    Digit3: { code: 'Digit3', key: '3', shiftKey: '#', keyCode: 51 },
    Digit4: { code: 'Digit4', key: '4', shiftKey: '$', keyCode: 52 },
    Digit5: { code: 'Digit5', key: '5', shiftKey: '%', keyCode: 53 },
    Digit6: { code: 'Digit6', key: '6', shiftKey: '^', keyCode: 54 },
    Digit7: { code: 'Digit7', key: '7', shiftKey: '&', keyCode: 55 },
    Digit8: { code: 'Digit8', key: '8', shiftKey: '*', keyCode: 56 },
    Digit9: { code: 'Digit9', key: '9', shiftKey: '(', keyCode: 57 },

    // Punctuations
    Backquote: { code: 'Backquote', key: String.fromCharCode(96), shiftKey: '~', keyCode: 192 },
    Minus: { code: 'Minus', key: '-', shiftKey: '_', keyCode: 189 },
    Equal: { code: 'Equal', key: '=', shiftKey: '+', keyCode: 187 },
    BracketLeft: { code: 'BracketLeft', key: '[', shiftKey: '{', keyCode: 219 },
    BracketRight: { code: 'BracketRight', key: ']', shiftKey: '}', keyCode: 221 },
    Backslash: { code: 'Backslash', key: '\\\\', shiftKey: '|', keyCode: 220 },
    Semicolon: { code: 'Semicolon', key: ';', shiftKey: ':', keyCode: 186 },
    Quote: { code: 'Quote', key: "'", shiftKey: '"', keyCode: 222 },
    Comma: { code: 'Comma', key: ',', shiftKey: '<', keyCode: 188 },
    Period: { code: 'Period', key: '.', shiftKey: '>', keyCode: 190 },
    Slash: { code: 'Slash', key: '/', shiftKey: '?', keyCode: 191 },

    // Whitespace & Actions
    Space: { code: 'Space', key: ' ', shiftKey: ' ', keyCode: 32 },
    Enter: { code: 'Enter', key: 'Enter', shiftKey: 'Enter', keyCode: 13 },
    Backspace: { code: 'Backspace', key: 'Backspace', shiftKey: 'Backspace', keyCode: 8 },
    Tab: { code: 'Tab', key: 'Tab', shiftKey: 'Tab', keyCode: 9 },
    Escape: { code: 'Escape', key: 'Escape', shiftKey: 'Escape', keyCode: 27 },
    Delete: { code: 'Delete', key: 'Delete', shiftKey: 'Delete', keyCode: 46 },
    ArrowLeft: { code: 'ArrowLeft', key: 'ArrowLeft', shiftKey: 'ArrowLeft', keyCode: 37 },
    ArrowUp: { code: 'ArrowUp', key: 'ArrowUp', shiftKey: 'ArrowUp', keyCode: 38 },
    ArrowRight: { code: 'ArrowRight', key: 'ArrowRight', shiftKey: 'ArrowRight', keyCode: 39 },
    ArrowDown: { code: 'ArrowDown', key: 'ArrowDown', shiftKey: 'ArrowDown', keyCode: 40 },

    // Modifiers
    ControlLeft: { code: 'ControlLeft', key: 'Control', shiftKey: 'Control', keyCode: 17 },
    ControlRight: { code: 'ControlRight', key: 'Control', shiftKey: 'Control', keyCode: 17 },
    ShiftLeft: { code: 'ShiftLeft', key: 'Shift', shiftKey: 'Shift', keyCode: 16 },
    ShiftRight: { code: 'ShiftRight', key: 'Shift', shiftKey: 'Shift', keyCode: 16 },
    AltLeft: { code: 'AltLeft', key: 'Alt', shiftKey: 'Alt', keyCode: 18 },
    AltRight: { code: 'AltRight', key: 'Alt', shiftKey: 'Alt', keyCode: 18 },
    MetaLeft: { code: 'MetaLeft', key: 'Meta', shiftKey: 'Meta', keyCode: 91 },
    MetaRight: { code: 'MetaRight', key: 'Meta', shiftKey: 'Meta', keyCode: 92 },
    CapsLock: { code: 'CapsLock', key: 'CapsLock', shiftKey: 'CapsLock', keyCode: 20 },
  };

  // 1. Create Visible Persistent Badge on Page (Bottom-Right)
  function createBadge() {
    let existing = document.getElementById('keyvibe-floating-indicator');
    if (existing) return existing;

    const badge = document.createElement('div');
    badge.id = 'keyvibe-floating-indicator';
    badge.style.cssText = 'position:fixed!important;bottom:20px!important;right:20px!important;z-index:2147483647!important;background:#18181b!important;color:#f4f4f5!important;font-family:Inter,system-ui,-apple-system,sans-serif!important;padding:8px 14px!important;border:2px solid #38bdf8!important;font-size:11px!important;display:flex!important;align-items:center!important;gap:8px!important;box-shadow:0 10px 25px rgba(0,0,0,0.6)!important;user-select:none!important;border-radius:0!important;line-height:1.3!important;transition:all 0.2s ease!important;';

    badge.innerHTML = '<span id=\"kv-badge-dot\" style=\"width:8px;height:8px;background:#f59e0b;display:inline-block;flex-shrink:0;\"></span>' +
      '<div style=\"display:flex;flex-direction:column;\">' +
      '<span id=\"kv-badge-title\" style=\"font-weight:bold;color:#fff;\">Pixel Keyboard: Menghubungkan...</span>' +
      '<span id=\"kv-badge-sub\" style=\"font-size:10px;color:#a1a1aa;\">Room: ' + currentRoomId + '</span>' +
      '</div>' +
      '<button id=\"kv-badge-edit\" style=\"background:#27272a;border:1px solid #3f3f46;color:#38bdf8;padding:2px 6px;font-size:10px;cursor:pointer;margin-left:6px;\" title=\"Ubah ID Room\">Ganti ID</button>' +
      '<button id=\"kv-badge-close\" style=\"background:none;border:none;color:#71717a;cursor:pointer;font-size:14px;padding:0 2px;\" title=\"Tutup Badge\">&times;</button>';

    document.body.appendChild(badge);

    const editBtn = badge.querySelector('#kv-badge-edit');
    if (editBtn) {
      editBtn.onclick = (e) => {
        e.stopPropagation();
        const newId = prompt('Ketik Room ID dari layar smartphone Anda (contoh: KV-XXXX):', currentRoomId);
        if (newId && newId.trim()) {
          currentRoomId = newId.trim().toUpperCase();
          if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            chrome.storage.local.set({ kv_room_id: currentRoomId });
          }
          updateBadgeStatus('Menghubungkan ke ' + currentRoomId + '...', '#f59e0b', '#f59e0b');
          connect();
        }
      };
    }

    const closeBtn = badge.querySelector('#kv-badge-close');
    if (closeBtn) {
      closeBtn.onclick = (e) => {
        e.stopPropagation();
        badge.style.display = 'none';
      };
    }

    return badge;
  }

  function updateBadgeStatus(text, dotColor, borderColor) {
    const badge = createBadge();
    const title = badge.querySelector('#kv-badge-title');
    const sub = badge.querySelector('#kv-badge-sub');
    const dot = badge.querySelector('#kv-badge-dot');

    if (title) title.textContent = text;
    if (sub) sub.textContent = 'Room: ' + currentRoomId;
    if (dot) dot.style.background = dotColor || '#10b981';
    if (borderColor) badge.style.borderColor = borderColor;
  }

  function flashBadgeText(text) {
    const badge = createBadge();
    const title = badge.querySelector('#kv-badge-title');
    if (title) title.textContent = text;
    badge.style.borderColor = '#10b981';
    clearTimeout(badge.__tmr);
    badge.__tmr = setTimeout(() => {
      badge.style.borderColor = '#38bdf8';
      if (title) title.textContent = document.hidden ? 'Pixel Keyboard: Standby' : 'Pixel Keyboard: Siap Mengetik & Shortcut 3D';
    }, 1200);
  }

  // 2. Load Stored Room ID & Sync Across Tabs
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    chrome.storage.local.get(['kv_room_id', 'kv_enabled'], (res) => {
      if (res.kv_room_id) currentRoomId = res.kv_room_id;
      if (typeof res.kv_enabled === 'boolean') isEnabled = res.kv_enabled;
      if (isEnabled) connect();
    });

    chrome.storage.onChanged.addListener((changes) => {
      if (changes.kv_room_id) {
        currentRoomId = changes.kv_room_id.newValue;
        connect();
      }
      if (changes.kv_enabled) {
        isEnabled = changes.kv_enabled.newValue;
        if (!isEnabled && ws) {
          try { ws.close(); } catch(e) {}
          updateBadgeStatus('Pixel Keyboard: Nonaktif', '#71717a', '#3f3f46');
        } else if (isEnabled) {
          connect();
        }
      }
    });
  } else {
    connect();
  }

  // 3. Connect to Pixel Keyboard Server
  function connect() {
    if (!isEnabled) return;
    try {
      if (ws) {
        try { ws.close(); } catch(e) {}
      }

      updateBadgeStatus('Menghubungkan ke ' + currentRoomId + '...', '#f59e0b', '#f59e0b');

      ws = new WebSocket(wsServerUrl);

      ws.onopen = () => {
        ws.send(JSON.stringify({
          type: 'register_host',
          roomId: currentRoomId,
          hostInfo: 'Tab: ' + (document.title || 'Browser Tab').substring(0, 30)
        }));
        if (document.hidden) {
          updateBadgeStatus('Pixel Keyboard: Standby (Latar Belakang)', '#71717a', '#3f3f46');
        } else {
          updateBadgeStatus('Pixel Keyboard: Siap Mengetik & Shortcut 3D', '#10b981', '#10b981');
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'remote_keystroke') {
            // CRITICAL: Only type into the ACTIVE/FOCUSED tab that the user is currently viewing!
            if (document.hidden) {
              return;
            }
            handleRemoteKey(data.key, Boolean(data.isShifted), data.modifiers || {});
          }
        } catch(e) {}
      };

      ws.onclose = () => {
        if (!document.hidden) {
          updateBadgeStatus('Terputus. Mencoba lagi...', '#ef4444', '#ef4444');
        }
        if (isEnabled) {
          setTimeout(() => {
            if (!document.hidden || !ws || ws.readyState === WebSocket.CLOSED) {
              connect();
            }
          }, 3000);
        }
      };

      ws.onerror = () => {
        if (!document.hidden) {
          updateBadgeStatus('Gagal terhubung ke server', '#ef4444', '#ef4444');
        }
      };
    } catch(e) {
      console.warn('Socket error:', e);
    }
  }

  // 4. TAB SWITCHING HANDLER: Seamlessly wake up when user switches to this tab!
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        connect();
      } else {
        updateBadgeStatus('Pixel Keyboard: Siap Mengetik & Shortcut 3D', '#10b981', '#10b981');
      }
    } else {
      updateBadgeStatus('Pixel Keyboard: Standby', '#71717a', '#3f3f46');
    }
  });

  window.addEventListener('focus', () => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      connect();
    }
  });

  // 5. Target Element Detection (Inputs, Textareas, 3D Canvas in Blockbench, or Body)
  function getBestTargetElement() {
    let el = document.activeElement;
    while (el && el.shadowRoot && el.shadowRoot.activeElement) {
      el = el.shadowRoot.activeElement;
    }

    const isInput = el && (
      el.tagName === 'INPUT' ||
      el.tagName === 'TEXTAREA' ||
      el.isContentEditable ||
      el.getAttribute('contenteditable') === 'true' ||
      el.getAttribute('role') === 'textbox'
    );
    if (isInput) return el;

    // Check for 3D Viewport canvas (Blockbench, Blender web, Three.js)
    if (!el || el === document.body) {
      const canvas = document.querySelector('canvas#canvas, canvas.preview_canvas, canvas');
      if (canvas && canvas.offsetParent !== null) {
        return canvas;
      }
    }

    // Auto-find primary search / chat field on various websites if user hasn't clicked yet
    const autoCandidates = [
      'input#search',
      'textarea[name="q"]',
      'input[name="q"]',
      '#prompt-textarea',
      'div[contenteditable="true"][role="textbox"]',
      '.docs-texteventtarget-iframe',
      'input[type="search"]',
      'input[type="text"]',
      'textarea'
    ];

    for (const selector of autoCandidates) {
      const found = document.querySelector(selector);
      if (found && found.offsetParent !== null) {
        return found;
      }
    }

    return el || document.body || document.documentElement;
  }

  // 6. Create standard synthetic KeyboardEvent with full getters for legacy/game engine compatibility
  function createSyntheticKeyEvent(type, keyName, codeName, keyCodeVal, modifiers) {
    const isCtrl = Boolean(modifiers && modifiers.ctrl);
    const isShift = Boolean(modifiers && modifiers.shift);
    const isAlt = Boolean(modifiers && modifiers.alt);
    const isMeta = Boolean(modifiers && modifiers.meta);

    const init = {
      key: keyName,
      code: codeName,
      keyCode: keyCodeVal,
      which: keyCodeVal,
      charCode: (type === 'keypress') ? keyCodeVal : 0,
      bubbles: true,
      cancelable: true,
      composed: true,
      ctrlKey: isCtrl,
      shiftKey: isShift,
      altKey: isAlt,
      metaKey: isMeta,
      view: window,
      repeat: false
    };

    let evt;
    try {
      evt = new KeyboardEvent(type, init);
    } catch(e) {
      evt = document.createEvent('KeyboardEvent');
      evt.initEvent(type, true, true);
    }

    // Force define read-only properties for libraries that inspect them directly (like Blockbench Keybinds)
    try {
      Object.defineProperty(evt, 'keyCode', { get: () => keyCodeVal, configurable: true });
      Object.defineProperty(evt, 'which', { get: () => keyCodeVal, configurable: true });
      Object.defineProperty(evt, 'key', { get: () => keyName, configurable: true });
      Object.defineProperty(evt, 'code', { get: () => codeName, configurable: true });
      Object.defineProperty(evt, 'charCode', { get: () => (type === 'keypress' ? keyCodeVal : 0), configurable: true });
      Object.defineProperty(evt, 'ctrlKey', { get: () => isCtrl, configurable: true });
      Object.defineProperty(evt, 'shiftKey', { get: () => isShift, configurable: true });
      Object.defineProperty(evt, 'altKey', { get: () => isAlt, configurable: true });
      Object.defineProperty(evt, 'metaKey', { get: () => isMeta, configurable: true });
    } catch(e) {}

    return evt;
  }

  function dispatchKeyEventToPage(type, target, keyName, codeName, keyCodeVal, modifiers) {
    let prevented = false;

    // 1. Dispatch on target element
    try {
      const evt1 = createSyntheticKeyEvent(type, keyName, codeName, keyCodeVal, modifiers);
      target.dispatchEvent(evt1);
      if (evt1.defaultPrevented) prevented = true;
    } catch(e) {}

    // 2. Also dispatch on document and window
    // Blockbench, Blender Web, and many 3D tools attach window.addEventListener('keydown', ...)
    if (target !== window && target !== document) {
      try {
        const evt2 = createSyntheticKeyEvent(type, keyName, codeName, keyCodeVal, modifiers);
        window.dispatchEvent(evt2);
        if (evt2.defaultPrevented) prevented = true;
      } catch(e) {}
    }

    return prevented;
  }

  // 7. Handle Keystrokes & 3D Shortcuts
  function handleRemoteKey(key, isShifted, modifiers) {
    const el = getBestTargetElement();

    const code = key.code || '';
    const mapped = KEY_MAP[code] || null;

    let keyName = mapped ? (isShifted ? mapped.shiftKey : mapped.key) : (key.label || code);
    let codeName = mapped ? mapped.code : code;
    let keyCodeVal = mapped ? mapped.keyCode : 0;

    // Fallbacks
    if (!keyCodeVal) {
      if (key.type === 'char') {
        const char = isShifted ? (key.shiftLabel || key.label.toUpperCase()) : key.label;
        keyName = char;
        keyCodeVal = char.toUpperCase().charCodeAt(0);
        if (!codeName) codeName = 'Key' + char.toUpperCase();
      } else if (key.type === 'space') {
        keyName = ' ';
        codeName = 'Space';
        keyCodeVal = 32;
      } else if (key.type === 'enter') {
        keyName = 'Enter';
        codeName = 'Enter';
        keyCodeVal = 13;
      } else if (key.type === 'backspace') {
        keyName = 'Backspace';
        codeName = 'Backspace';
        keyCodeVal = 8;
      } else if (key.type === 'tab') {
        keyName = 'Tab';
        codeName = 'Tab';
        keyCodeVal = 9;
      }
    }

    // Merge shift into modifiers
    const mod = {
      ctrl: Boolean(modifiers && modifiers.ctrl),
      alt: Boolean(modifiers && modifiers.alt),
      shift: Boolean((modifiers && modifiers.shift) || isShifted),
      meta: Boolean(modifiers && modifiers.meta)
    };

    // Construct UI flash text
    let display = keyName;
    if (mod.ctrl) display = 'Ctrl+' + display;
    if (mod.alt) display = 'Alt+' + display;
    flashBadgeText((mod.ctrl || !['INPUT', 'TEXTAREA'].includes(el?.tagName)) ? 'Shortcut 3D: ' + display : 'Ketik: ' + display);

    // 1. Dispatch full KEYDOWN event
    const wasPrevented = dispatchKeyEventToPage('keydown', el, keyName, codeName, keyCodeVal, mod);

    // 2. Schedule matching KEYUP event after 50ms so held state resets in 3D apps
    setTimeout(() => {
      dispatchKeyEventToPage('keyup', el, keyName, codeName, keyCodeVal, mod);
    }, 50);

    // 3. Handle Text Input insertion if element is an editable input and not prevented
    const isInputElement = el && (
      el.tagName === 'INPUT' ||
      el.tagName === 'TEXTAREA' ||
      el.isContentEditable ||
      el.getAttribute('contenteditable') === 'true' ||
      el.getAttribute('role') === 'textbox'
    );

    if (isInputElement && !wasPrevented && !mod.ctrl && !mod.meta) {
      if (key.type === 'char') {
        const char = isShifted ? (key.shiftLabel || key.label.toUpperCase()) : key.label;
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          const start = el.selectionStart !== null ? el.selectionStart : el.value.length;
          const end = el.selectionEnd !== null ? el.selectionEnd : el.value.length;
          const val = el.value || '';
          const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set ||
                               Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
          const updated = val.substring(0, start) + char + val.substring(end);
          if (nativeSetter) nativeSetter.call(el, updated);
          else el.value = updated;
          el.selectionStart = el.selectionEnd = start + char.length;
          el.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
          el.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
        } else {
          document.execCommand('insertText', false, char);
        }
      } else if (key.type === 'space') {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          const start = el.selectionStart !== null ? el.selectionStart : el.value.length;
          const end = el.selectionEnd !== null ? el.selectionEnd : el.value.length;
          el.value = el.value.substring(0, start) + ' ' + el.value.substring(end);
          el.selectionStart = el.selectionEnd = start + 1;
          el.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        } else {
          document.execCommand('insertText', false, ' ');
        }
      } else if (key.type === 'backspace') {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          const start = el.selectionStart;
          const end = el.selectionEnd;
          const val = el.value || '';
          if (start === end && start > 0) {
            el.value = val.substring(0, start - 1) + val.substring(end);
            el.selectionStart = el.selectionEnd = start - 1;
          } else if (start !== end) {
            el.value = val.substring(0, start) + val.substring(end);
            el.selectionStart = el.selectionEnd = start;
          }
          el.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
          el.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
        } else {
          document.execCommand('delete', false, null);
        }
      } else if (key.type === 'enter') {
        const ytSearchBtn = document.getElementById('search-icon-legacy');
        if (ytSearchBtn && el.id === 'search') {
          ytSearchBtn.click();
        } else if (el.tagName === 'INPUT' && el.form) {
          if (typeof el.form.requestSubmit === 'function') el.form.requestSubmit();
          else el.form.submit();
        } else if (el.tagName === 'TEXTAREA') {
          const start = el.selectionStart || 0;
          el.value = el.value.substring(0, start) + '\\n' + el.value.substring(el.selectionEnd || start);
          el.selectionStart = el.selectionEnd = start + 1;
          el.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        } else {
          document.execCommand('insertParagraph', false, null);
        }
      }
    }
  }

  // Initial badge creation on DOM load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createBadge);
  } else {
    createBadge();
  }
})();
  `.trim();

  zip.file('content.js', contentScript);

  // 3. Popup HTML & Script
  const popupHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      width: 290px;
      margin: 0;
      padding: 16px;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      background: #18181b;
      color: #f4f4f5;
      font-size: 12px;
      box-sizing: border-box;
    }
    h2 {
      margin: 0 0 4px 0;
      font-size: 14px;
      font-weight: bold;
      color: #38bdf8;
    }
    p {
      margin: 0 0 12px 0;
      color: #a1a1aa;
      font-size: 11px;
      line-height: 1.4;
    }
    .field {
      margin-bottom: 12px;
    }
    label {
      display: block;
      font-size: 10px;
      text-transform: uppercase;
      font-weight: bold;
      color: #71717a;
      margin-bottom: 4px;
    }
    input {
      width: 100%;
      padding: 7px 10px;
      background: #09090b;
      border: 1px solid #27272a;
      color: #fff;
      font-size: 13px;
      font-weight: bold;
      letter-spacing: 1px;
      box-sizing: border-box;
      outline: none;
    }
    input:focus {
      border-color: #38bdf8;
    }
    button.btn {
      width: 100%;
      padding: 8px;
      background: #0284c7;
      border: none;
      color: #fff;
      font-weight: bold;
      cursor: pointer;
      font-size: 11px;
      margin-top: 4px;
    }
    button.btn:hover {
      background: #0369a1;
    }
    .status {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      margin-top: 12px;
      color: #10b981;
      padding-top: 8px;
      border-top: 1px solid #27272a;
    }
  </style>
</head>
<body>
  <h2>Pixel Virtual Keyboard</h2>
  <p>Pastikan ID Room di bawah sama dengan ID yang muncul di layar smartphone Anda.</p>

  <div class="field">
    <label>ID Room Pairing Smartphone</label>
    <input type="text" id="roomIdInput" value="${roomId}" />
  </div>

  <button class="btn" id="saveBtn">Simpan &amp; Hubungkan Ulang</button>

  <div class="status">
    <span style="width:7px;height:7px;background:#10b981;display:inline-block;"></span>
    <span id="statusTxt">Siap Mengetik di Semua Tab</span>
  </div>

  <script src="popup.js"></script>
</body>
</html>
  `.trim();

  const popupJs = `
document.addEventListener('DOMContentLoaded', () => {
  const roomInput = document.getElementById('roomIdInput');
  const saveBtn = document.getElementById('saveBtn');

  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    chrome.storage.local.get(['kv_room_id'], (res) => {
      if (res.kv_room_id) roomInput.value = res.kv_room_id;
    });

    saveBtn.onclick = () => {
      const val = roomInput.value.trim().toUpperCase();
      chrome.storage.local.set({ kv_room_id: val }, () => {
        saveBtn.textContent = 'Tersimpan & Terhubung!';
        setTimeout(() => { saveBtn.textContent = 'Simpan & Hubungkan Ulang'; }, 1500);
      });
    };
  }
});
  `.trim();

  zip.file('popup.html', popupHtml);
  zip.file('popup.js', popupJs);

  const readme = `
=====================================================
PANDUAN LENGKAP PIXEL VIRTUAL KEYBOARD (MULTI-TAB)
=====================================================

1. Ekstrak file .zip ini ke folder komputer Anda.
2. Buka browser Chrome / Edge.
3. Buka alamat: chrome://extensions (atau edge://extensions)
4. Nyalakan "Developer mode" di pojok kanan atas.
5. Klik "Load unpacked" lalu pilih folder hasil ekstrak tadi.
6. PENTING SAAT PINDAH TAB:
   - Jika tab sudah terbuka sebelumnya (misal YouTube atau Docs), TEKAN F5 (REFRESH).
   - Di pojok kanan bawah tab yang aktif akan muncul kotak: "Pixel Keyboard: Siap Mengetik & Shortcut 3D".
   - Saat Anda berpindah ke tab lain, Pixel Keyboard otomatis aktif di tab yang sedang Anda lihat!
   - Catatan: Jangan coba di halaman tab kosong bawaan Chrome (chrome://newtab), bukalah alamat web asli seperti google.com, youtube.com, atau docs.google.com.
7. KHUSUS APLIKASI 3D (BLOCKBENCH, BLENDER WEB, FIGMA):
   - Shortcut keyboard dideteksi penuh (R = Rotate, S = Scale, T/M = Move, Space = Pan, Delete = Hapus, Ctrl+Z = Undo, Ctrl+Y = Redo, 1/2/3 = Sudut Pandang).
   - Klik satu kali pada kanvas / viewport 3D Blockbench agar jendela browser menerima fokus aktif.
   - Jika Anda baru saja memperbarui ekstensi, buka chrome://extensions lalu klik ikon reload 🔄 pada kartu Pixel Virtual Keyboard dan refresh tab Blockbench (F5).
  `.trim();

  zip.file('CARA_PASANG.txt', readme);

  return zip;
}

export async function generateExtensionZip(roomId: string, origin: string): Promise<Blob> {
  const zip = await buildExtensionZip(roomId, origin);
  return await zip.generateAsync({ type: 'blob' });
}

/**
 * Generates a self-contained, zero-dependency Bookmarklet script
 * that connects any browser tab (YouTube, Google Docs, ChatGPT, WhatsApp Web, etc.)
 * directly to Pixel Virtual Keyboard's WebSocket room like a real external keyboard.
 */

export function generateBookmarkletCode(roomId: string, origin: string): string {
  const wsProtocol = origin.startsWith('https:') ? 'wss:' : 'ws:';
  const wsHost = origin.replace(/^https?:\/\//, '');
  const wsUrl = `${wsProtocol}//${wsHost}`;

  // Minified self-contained Bookmarklet payload
  const rawCode = `
(function() {
  if (window.__KEYVIBE_INJECTED__) {
    const existing = document.getElementById('keyvibe-floating-badge');
    if (existing) {
      existing.style.display = 'flex';
      existing.style.opacity = '1';
      alert('Pixel Virtual Keyboard sudah aktif di tab ini (' + '${roomId}' + ')!');
    }
    return;
  }
  window.__KEYVIBE_INJECTED__ = true;

  const roomId = '${roomId}';
  const wsUrl = '${wsUrl}';

  // 1. Create Floating Status Badge (Unrounded, minimalist, draggable)
  const badge = document.createElement('div');
  badge.id = 'keyvibe-floating-badge';
  badge.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:2147483647;background:#18181b;color:#f4f4f5;font-family:Inter,system-ui,-apple-system,sans-serif;padding:8px 12px;border:1.5px solid #38bdf8;box-shadow:0 10px 25px rgba(0,0,0,0.5);font-size:11px;display:flex;align-items:center;gap:8px;user-select:none;transition:opacity 0.2s;line-height:1.2;border-radius:0;';
  badge.innerHTML = '<span id="kv-dot" style="width:7px;height:7px;background:#f59e0b;display:inline-block;"></span><span id="kv-status"><strong>Pixel Keyboard:</strong> Menghubungkan...</span><button id="kv-close" style="background:none;border:none;color:#a1a1aa;cursor:pointer;font-size:13px;padding:0 2px;margin-left:4px;" title="Tutup">&times;</button>';
  document.body.appendChild(badge);

  const dot = document.getElementById('kv-dot');
  const status = document.getElementById('kv-status');
  const closeBtn = document.getElementById('kv-close');

  badge.addEventListener('mouseenter', function() { badge.style.opacity = '1'; });
  badge.addEventListener('mouseleave', function() { if (window.__KV_CONNECTED__) badge.style.opacity = '0.5'; });

  closeBtn.onclick = function(e) {
    e.stopPropagation();
    if (ws) ws.close();
    badge.remove();
    window.__KEYVIBE_INJECTED__ = false;
  };

  // 2. Connect to Pixel Virtual Keyboard WebSocket
  let ws = null;
  function connect() {
    try {
      ws = new WebSocket(wsUrl);

      ws.onopen = function() {
        window.__KV_CONNECTED__ = true;
        ws.send(JSON.stringify({
          type: 'register_host',
          roomId: roomId,
          hostInfo: 'Tab: ' + (document.title || 'Browser Tab').substring(0, 30)
        }));
        if (dot) dot.style.background = '#10b981';
        if (status) status.innerHTML = '<strong>Pixel Keyboard:</strong> Siap Mengetik (' + roomId + ')';
        setTimeout(function() {
          if (badge) badge.style.opacity = '0.5';
        }, 3000);
      };

      ws.onmessage = function(event) {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'remote_keystroke') {
            handleRemoteKey(data.key, Boolean(data.isShifted));
          }
        } catch(e) {}
      };

      ws.onclose = function() {
        window.__KV_CONNECTED__ = false;
        if (dot) dot.style.background = '#ef4444';
        if (status) status.innerHTML = '<strong>Pixel Keyboard:</strong> Terputus';
        if (badge) badge.style.opacity = '1';
      };
    } catch(e) {
      if (status) status.innerHTML = '<strong>Pixel Keyboard:</strong> Gagal terhubung';
    }
  }

  // 3. Realistic Keystroke Injection into active input/contenteditable
  function handleRemoteKey(key, isShifted) {
    const el = document.activeElement || document.body;

    // Flash badge subtly
    if (badge) {
      badge.style.borderColor = '#10b981';
      setTimeout(function() { badge.style.borderColor = '#38bdf8'; }, 100);
    }

    if (key.type === 'char') {
      const char = isShifted ? (key.shiftLabel || key.label.toUpperCase()) : key.label;
      insertText(char, el);
    } else if (key.type === 'space') {
      insertText(' ', el);
    } else if (key.type === 'enter') {
      handleEnter(el);
    } else if (key.type === 'backspace') {
      handleBackspace(el);
    } else if (key.type === 'tab') {
      insertText('\\t', el);
    }
  }

  function insertText(text, el) {
    if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) {
      const start = el.selectionStart !== null ? el.selectionStart : el.value.length;
      const end = el.selectionEnd !== null ? el.selectionEnd : el.value.length;
      const val = el.value || '';
      
      // Native setter to trigger React/Vue listeners
      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set ||
                           Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;

      const updated = val.substring(0, start) + text + val.substring(end);
      if (nativeSetter) {
        nativeSetter.call(el, updated);
      } else {
        el.value = updated;
      }

      el.selectionStart = el.selectionEnd = start + text.length;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    } else if (el && el.isContentEditable) {
      // Modern document.execCommand for rich editors (Google Docs, Notion, WhatsApp Web, ChatGPT)
      document.execCommand('insertText', false, text);
    } else {
      // If no input focused, show feedback in badge
      if (status) {
        status.innerHTML = '<strong style="color:#38bdf8;">Ketik:</strong> ' + text + ' (Klik kotak teks)';
        if (badge) badge.style.opacity = '1';
        clearTimeout(window.__KV_TMR__);
        window.__KV_TMR__ = setTimeout(function() {
          if (status) status.innerHTML = '<strong>Pixel Keyboard:</strong> Siap Mengetik (' + roomId + ')';
          if (badge) badge.style.opacity = '0.5';
        }, 1800);
      }
    }
  }

  function handleBackspace(el) {
    if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) {
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const val = el.value || '';
      if (start === end) {
        if (start > 0) {
          el.value = val.substring(0, start - 1) + val.substring(end);
          el.selectionStart = el.selectionEnd = start - 1;
        }
      } else {
        el.value = val.substring(0, start) + val.substring(end);
        el.selectionStart = el.selectionEnd = start;
      }
      el.dispatchEvent(new Event('input', { bubbles: true }));
    } else if (el && el.isContentEditable) {
      document.execCommand('delete', false, null);
    }
  }

  function handleEnter(el) {
    if (el && el.tagName === 'INPUT') {
      if (el.form) {
        if (typeof el.form.requestSubmit === 'function') el.form.requestSubmit();
        else el.form.submit();
      } else {
        el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true }));
      }
    } else if (el && el.tagName === 'TEXTAREA') {
      insertText('\\n', el);
    } else if (el && el.isContentEditable) {
      document.execCommand('insertParagraph', false, null);
    }
  }

  connect();
})();
  `.trim();

  // Compress into safe javascript URI
  const minified = rawCode.replace(/\n\s*/g, ' ');
  return `javascript:${encodeURIComponent(minified)}`;
}

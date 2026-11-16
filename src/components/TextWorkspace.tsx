import React, { useState } from 'react';
import {
  Globe,
  Copy,
  Check,
  Trash2,
  Layers,
  Sparkles,
  ClipboardCheck,
} from 'lucide-react';

interface TextWorkspaceProps {
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onOpenMultiTabModal: () => void;
  onOpenPipWindow?: () => void;
  isPipSupported?: boolean;
  autoCopyClipboard: boolean;
  onToggleAutoCopy: () => void;
}

export const TextWorkspace: React.FC<TextWorkspaceProps> = ({
  text,
  setText,
  textareaRef,
  onOpenMultiTabModal,
  onOpenPipWindow,
  isPipSupported = false,
  autoCopyClipboard,
  onToggleAutoCopy,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyAll = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleClear = () => {
    if (text && window.confirm('Hapus semua teks yang telah diketik?')) {
      setText('');
      if (textareaRef.current) textareaRef.current.focus();
    }
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  return (
    <div className="w-full bg-white dark:bg-[#1c1c20] border border-[#dedad1] dark:border-zinc-800 rounded-none overflow-hidden shadow-sm transition-colors font-['Inter']">
      {/* Top Workspace Toolbar */}
      <div className="px-4 py-2.5 bg-stone-50 dark:bg-zinc-900/80 border-b border-[#dedad1] dark:border-zinc-800 flex items-center justify-between flex-wrap gap-2.5">
        {/* Left: Quick Actions to Type in Other Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Universal Multi-Tab Mode Button */}
          <button
            type="button"
            onClick={onOpenMultiTabModal}
            title="Ketik di semua tab browser (YouTube, Docs, WhatsApp, dll) tanpa instal terminal"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs border border-sky-400 rounded-none cursor-pointer transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Ketik di Tab Lain (Universal)</span>
          </button>

          {/* Floating Picture-in-Picture Button */}
          {isPipSupported && onOpenPipWindow && (
            <button
              type="button"
              onClick={onOpenPipWindow}
              title="Buka jendela melayang (Always-on-top) di atas tab lain"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-zinc-800 hover:bg-stone-100 dark:hover:bg-zinc-700 text-stone-800 dark:text-zinc-200 font-semibold text-xs border border-stone-300 dark:border-zinc-700 rounded-none cursor-pointer transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-500" />
              <span className="hidden sm:inline">Jendela Melayang (PiP)</span>
            </button>
          )}

          {/* Auto-Copy to Clipboard Switch */}
          <button
            type="button"
            onClick={onToggleAutoCopy}
            title="Saat aktif, teks otomatis tersalin ke papan klip sehingga bisa langsung Ctrl+V di aplikasi apapun"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium border rounded-none cursor-pointer transition-colors ${
              autoCopyClipboard
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 font-semibold'
                : 'bg-white dark:bg-zinc-800 border-stone-300 dark:border-zinc-700 text-stone-600 dark:text-zinc-400 hover:text-stone-900'
            }`}
          >
            <ClipboardCheck className={`w-3.5 h-3.5 ${autoCopyClipboard ? 'text-emerald-500' : 'text-stone-400'}`} />
            <span>Auto-Copy: {autoCopyClipboard ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        {/* Right: Copy All, Clear, & Stats */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[11px] text-stone-400 dark:text-zinc-500 font-mono hidden md:inline">
            {wordCount} kata &bull; {charCount} huruf
          </span>

          <button
            type="button"
            onClick={handleCopyAll}
            disabled={!text}
            title="Salin semua teks ke clipboard"
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-stone-700 dark:text-zinc-300 hover:text-stone-950 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed bg-white dark:bg-zinc-800 border border-stone-300 dark:border-zinc-700 rounded-none cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleClear}
            disabled={!text}
            title="Bersihkan teks"
            className="p-1 text-stone-400 hover:text-red-500 dark:text-zinc-500 dark:hover:text-red-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors bg-transparent border-0 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Text Area */}
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ketik langsung dari smartphone Anda..."
        rows={14}
        className="w-full p-6 sm:p-8 bg-transparent text-stone-900 dark:text-zinc-100 placeholder-stone-400 dark:placeholder-zinc-500 font-['Inter'] text-xl leading-relaxed focus:outline-none resize-y min-h-[380px] max-h-[680px]"
        autoFocus
      />

      {/* Bottom Hint Footer */}
      <div className="px-5 py-2 bg-stone-50/50 dark:bg-zinc-900/40 border-t border-[#dedad1] dark:border-zinc-800 flex items-center justify-between text-[11px] text-stone-500 dark:text-zinc-400">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-sky-500" />
          <span>Ingin mengetik langsung di Google Docs, YouTube, atau WhatsApp Web? Klik <strong>&ldquo;Ketik di Tab Lain&rdquo;</strong> di atas!</span>
        </span>
        <span className="font-mono text-[10px] hidden sm:inline">
          Real-time WebSocket Sync
        </span>
      </div>
    </div>
  );
};

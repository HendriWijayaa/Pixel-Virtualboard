import React, { useState } from 'react';
import {
  X,
  Globe,
  Download,
  Bookmark,
  Copy,
  Check,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileArchive,
  ExternalLink,
  Bluetooth,
  ArrowRight,
} from 'lucide-react';
import { generateBookmarkletCode } from '../utils/bookmarkletGenerator';
import { generateExtensionZip } from '../utils/extensionGenerator';

interface MultiTabModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
  onOpenPip?: () => void;
  isPipSupported?: boolean;
}

export const MultiTabModal: React.FC<MultiTabModalProps> = ({
  isOpen,
  onClose,
  roomId,
  onOpenPip,
  isPipSupported = false,
}) => {
  const [copiedBookmarklet, setCopiedBookmarklet] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'deploy-info' | 'extension' | 'pip' | 'bluetooth'>('deploy-info');

  if (!isOpen) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const isDevUrl = currentOrigin.includes('ais-dev-');
  const sharedUrl = 'https://ais-pre-6g3dyu24hcmq27urmrzlqj-735661801184.asia-east1.run.app';

  // Use the public shared URL if in dev so external tabs can actually connect without Google Auth rejection
  const targetOrigin = isDevUrl ? sharedUrl : currentOrigin;

  const bookmarkletCode = generateBookmarkletCode(roomId, targetOrigin);

  const handleDownloadExtension = async () => {
    try {
      setIsDownloading(true);
      const zipBlob = await generateExtensionZip(roomId, targetOrigin);
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Pixel-Virtual-Keyboard-Extension-${roomId}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => {
        URL.revokeObjectURL(url);
        setIsDownloading(false);
      }, 1500);
    } catch (err) {
      console.error('Failed to generate extension zip:', err);
      setIsDownloading(false);
    }
  };

  const handleCopyBookmarklet = async () => {
    try {
      await navigator.clipboard.writeText(bookmarkletCode);
      setCopiedBookmarklet(true);
      setTimeout(() => setCopiedBookmarklet(false), 2500);
    } catch {
      // fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 font-['Inter'] animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white dark:bg-[#18181b] border-2 border-stone-800 dark:border-zinc-700 shadow-2xl rounded-none flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-stone-200 dark:border-zinc-800 flex items-center justify-between bg-stone-50 dark:bg-zinc-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-zinc-100 flex items-center gap-2">
                <span>Solusi Mengetik di Tab Lain &amp; Keyboard Eksternal</span>
              </h3>
              <p className="text-xs text-stone-500 dark:text-zinc-400">
                Panduan lengkap agar smartphone bisa mengetik ke YouTube, Google Docs, WhatsApp, dll.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-800 dark:text-zinc-500 dark:hover:text-zinc-200 transition-colors bg-transparent border-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-stone-200 dark:border-zinc-800 bg-stone-100/50 dark:bg-zinc-900/30 text-xs font-semibold overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('deploy-info')}
            className={`py-3 px-3 flex items-center justify-center gap-1.5 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'deploy-info'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400 bg-white dark:bg-[#18181b]'
                : 'border-transparent text-stone-600 dark:text-zinc-400 hover:text-stone-900'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span>Penyebab &amp; Solusi Utama (Deploy)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pip')}
            className={`py-3 px-3 flex items-center justify-center gap-1.5 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'pip'
                ? 'border-sky-500 text-sky-600 dark:text-sky-400 bg-white dark:bg-[#18181b]'
                : 'border-transparent text-stone-600 dark:text-zinc-400 hover:text-stone-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-sky-500" />
            <span>Jendela Melayang (Langsung Bisa)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('extension')}
            className={`py-3 px-3 flex items-center justify-center gap-1.5 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'extension'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-[#18181b]'
                : 'border-transparent text-stone-600 dark:text-zinc-400 hover:text-stone-900'
            }`}
          >
            <FileArchive className="w-3.5 h-3.5 text-emerald-500" />
            <span>Ekstensi Browser (.ZIP)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bluetooth')}
            className={`py-3 px-3 flex items-center justify-center gap-1.5 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'bluetooth'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-[#18181b]'
                : 'border-transparent text-stone-600 dark:text-zinc-400 hover:text-stone-900'
            }`}
          >
            <Bluetooth className="w-3.5 h-3.5 text-indigo-500" />
            <span>Bluetooth Fisik (Asli 100%)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-stone-800 dark:text-zinc-200 text-xs">
          {activeTab === 'deploy-info' && (
            <div className="space-y-4">
              {/* The Honest Engineering Reason */}
              <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-500/40 text-amber-950 dark:text-amber-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-amber-700 dark:text-amber-300">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <span>Mengapa Sebelumnya &ldquo;Masih Tidak Bisa&rdquo;?</span>
                </div>
                <p className="text-xs leading-relaxed opacity-95">
                  Saat ini aplikasi Anda masih berjalan di <strong>URL Development AI Studio</strong> (<code className="font-mono text-[11px] bg-amber-100 dark:bg-amber-900/60 px-1">ais-dev-...</code>).
                  Google <strong>mengunci akses URL ini dengan sistem keamanan login internal</strong>, sehingga tab lain (seperti YouTube atau Google Docs) <strong>otomatis ditolak oleh Google</strong> ketika mencoba menyambung ke server keyboard Anda!
                </p>
              </div>

              {/* Action Required: Deploy */}
              <div className="p-5 bg-stone-50 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 space-y-3">
                <span className="font-bold text-stone-900 dark:text-zinc-100 text-sm block">
                  Langkah yang Harus Dilakukan:
                </span>

                <ol className="list-decimal list-inside space-y-2 text-xs leading-relaxed text-stone-700 dark:text-zinc-300">
                  <li>
                    Klik tombol <strong>&ldquo;Deploy&rdquo;</strong> di pojok kanan atas layar AI Studio.
                  </li>
                  <li>
                    Tunggu proses build selesai, lalu buka URL hasil Deploy (URL Publik: <code className="font-mono text-[11px] bg-stone-200 dark:bg-zinc-800 px-1">{sharedUrl}</code>).
                  </li>
                  <li>
                    Karena URL Deploy bersifat <strong>Publik &amp; Tidak Dikunci Google</strong>, barulah tab YouTube / Google Docs / ekstensi bisa saling terhubung secara real-time!
                  </li>
                </ol>

                <div className="pt-2">
                  <a
                    href={sharedUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-none cursor-pointer"
                  >
                    <span>Buka URL Publik Hasil Deploy</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pip' && (
            <div className="space-y-4">
              <div className="p-4 bg-sky-50 dark:bg-sky-950/40 border border-sky-500/30 text-sky-950 dark:text-sky-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-sky-700 dark:text-sky-300">
                  <Layers className="w-5 h-5 shrink-0" />
                  <span>Jendela Melayang Always-On-Top (Solusi Langsung Bisa Detik Ini)</span>
                </div>
                <p className="text-xs leading-relaxed opacity-95">
                  Jika Anda ingin langsung mengetik sambil menonton YouTube atau membaca tab lain <strong>tanpa harus deploy</strong>, gunakan fitur <strong>Jendela Melayang (Picture-in-Picture)</strong>!
                  Jendela ini akan mengambang di atas semua aplikasi laptop Anda, menampilkan teks yang Anda ketik dari smartphone secara live, dan otomatis menyalin ke clipboard.
                </p>
              </div>

              {onOpenPip && (
                <div className="text-center py-3">
                  <button
                    type="button"
                    onClick={() => {
                      onOpenPip();
                      onClose();
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-lg border border-sky-400 cursor-pointer rounded-none"
                  >
                    <Layers className="w-4 h-4" />
                    <span>Buka Jendela Melayang (Always-on-Top)</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'extension' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-950 dark:text-emerald-200 space-y-1">
                <span className="font-bold text-sm text-emerald-700 dark:text-emerald-300 block">
                  Ekstensi Chrome / Edge Siap Pakai (.ZIP)
                </span>
                <p className="text-xs leading-relaxed opacity-95">
                  Paket ekstensi ini dibuat agar smartphone Anda bisa mengetik langsung ke dalam kotak pencarian YouTube atau kolom Google Docs tanpa menyentuh terminal laptop.
                </p>
              </div>

              <div className="p-4 bg-stone-50 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <span className="font-bold text-stone-900 dark:text-zinc-100 text-xs block">
                    File Ekstensi Pixel Virtual Keyboard
                  </span>
                  <span className="text-[11px] text-stone-500 dark:text-zinc-400 font-mono">
                    ID Sesi: {roomId}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadExtension}
                  disabled={isDownloading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-md border border-emerald-400 cursor-pointer rounded-none"
                >
                  <Download className="w-4 h-4" />
                  <span>{isDownloading ? 'Menyiapkan ZIP...' : 'Download Ekstensi (.ZIP)'}</span>
                </button>
              </div>

              <div className="p-3 bg-stone-100 dark:bg-zinc-900/60 border border-stone-200 dark:border-zinc-800 text-[11px] space-y-1">
                <strong>Cara Pasang / Update:</strong> Ekstrak ZIP &gt; Buka <code className="font-mono bg-stone-200 dark:bg-zinc-800 px-1">chrome://extensions</code> &gt; Nyalakan Developer Mode &gt; Klik &ldquo;Load unpacked&rdquo; &gt; Pilih folder hasil ekstrak. (Jika sudah terpasang, cukup klik tombol reload 🔄 pada kartu Pixel Virtual Keyboard lalu refresh tab Blockbench).
              </div>

              <div className="p-3.5 bg-sky-50 dark:bg-sky-950/40 border border-sky-500/30 text-sky-950 dark:text-sky-200 text-[11px] space-y-1.5">
                <strong className="text-sky-700 dark:text-sky-300 flex items-center gap-1.5 font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Dukungan Penuh Shortcut 3D (Blockbench, Blender Web, Figma)</span>
                </strong>
                <p className="leading-relaxed opacity-95">
                  Ekstensi ini menyintesis <code>KeyboardEvent</code> lengkap beserta <code>code</code>, <code>key</code>, <code>keyCode</code>, dan modifier <code>ctrlKey / shiftKey / altKey</code>.
                  Shortcut Blockbench seperti <strong>R (Rotate)</strong>, <strong>S (Scale)</strong>, <strong>T/M (Move)</strong>, <strong>Space (Pan)</strong>, <strong>Delete (Hapus)</strong>, serta <strong>Ctrl+Z (Undo)</strong> langsung bekerja seketika!
                </p>
              </div>
            </div>
          )}

          {activeTab === 'bluetooth' && (
            <div className="space-y-4">
              <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-500/30 text-indigo-950 dark:text-indigo-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-indigo-700 dark:text-indigo-300">
                  <Bluetooth className="w-5 h-5 shrink-0" />
                  <span>Jadikan Smartphone Keyboard Bluetooth Asli (OS-Level)</span>
                </div>
                <p className="text-xs leading-relaxed opacity-95">
                  Tahukah Anda? Browser web dibatasi oleh sistem operasi laptop agar tidak bisa sembarangan mengontrol aplikasi lain.
                  Namun smartphone Anda (Android / iPhone) memiliki chip Bluetooth yang bisa menjadi <strong>Keyboard Bluetooth Fisik Sesungguhnya</strong>!
                </p>
              </div>

              <div className="p-4 bg-stone-50 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 space-y-2">
                <span className="font-bold text-stone-900 dark:text-zinc-100 text-xs block">
                  Cara Terbaik Tanpa Instal Apapun di Komputer:
                </span>
                <ol className="list-decimal list-inside space-y-1.5 text-xs text-stone-700 dark:text-zinc-300 leading-relaxed">
                  <li>
                    Di smartphone Anda, buka Play Store / App Store dan cari aplikasi: <strong>&ldquo;Bluetooth Keyboard &amp; Mouse&rdquo;</strong> (Serverless Bluetooth Keyboard).
                  </li>
                  <li>
                    Nyalakan Bluetooth laptop dan smartphone Anda, lalu sambungkan (Pairing).
                  </li>
                  <li>
                    <strong>Selesai!</strong> Laptop akan mendeteksi smartphone Anda seperti keyboard Logitech/Apple Bluetooth biasa. Anda bisa mengetik di tab apapun, game, Excel, Word, bahkan saat laptop tidak ada internet!
                  </li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-6 py-3 border-t border-stone-200 dark:border-zinc-800 bg-stone-50 dark:bg-zinc-900/60 flex items-center justify-between">
          <span className="text-[11px] text-stone-500 dark:text-zinc-400">
            Room Pairing: <strong className="font-mono text-sky-600 dark:text-sky-400">{roomId}</strong>
          </span>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-900 dark:bg-zinc-100 text-white dark:text-stone-900 text-xs font-semibold rounded-none cursor-pointer hover:opacity-90"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

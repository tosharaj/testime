'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  X, Maximize, Minimize, ChevronLeft, ChevronRight,
  Download, Share2, Flag, ZoomIn, ZoomOut, CheckCircle2, Layers,
} from 'lucide-react';
import type { Resource } from '@/types/notes';
import { recordResourceActivity, recordDownload, recordShare, languageName, formatBytes } from '@/lib/notesStore';

interface PdfReaderProps {
  resource: Resource;
  onClose: () => void;
  onReport?: (resource: Resource) => void;
}

export default function PdfReader({ resource, onClose, onReport }: PdfReaderProps) {
  const total = Math.max(1, resource.pageCount || 1);
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [fitWidth, setFitWidth] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const goTo = useCallback((p: number) => {
    const next = Math.min(total, Math.max(1, p));
    setPage(next);
    recordResourceActivity(resource.id, next, total);
  }, [resource.id, total]);

  useEffect(() => {
    recordResourceActivity(resource.id, 1, total);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' || e.key === 'PageDown') goTo(page + 1);
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') goTo(page - 1);
      if (e.key === '+' || e.key === '=') setZoom(z => Math.min(2.5, z + 0.2));
      if (e.key === '-') setZoom(z => Math.max(0.5, z - 0.2));
      if (e.key.toLowerCase() === 'f') toggleFullscreen();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, onClose]);

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setFullscreen(false);
    } else {
      containerRef.current?.requestFullscreen?.().then(() => setFullscreen(true)).catch(() => setFullscreen(false));
    }
  }

  const handleDownload = () => {
    recordDownload(resource.id);
    if (resource.fileUrl) window.open(resource.fileUrl, '_blank');
  };
  const handleShare = () => {
    recordShare(resource.id);
    const url = `${window.location.origin}/notes/resource/${resource.slug}`;
    if (navigator.share) navigator.share({ title: resource.title, url }).catch(() => {});
    else if (navigator.clipboard) navigator.clipboard.writeText(url);
  };

  const progressPct = Math.round((page / total) * 100);
  const finished = page >= total - 1;

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 flex flex-col bg-[#1d2136]">
      {/* Toolbar */}
      <header className="flex items-center gap-2 border-b border-white/10 bg-[#111426] px-3 py-2.5 text-white">
        <button onClick={onClose} className="rounded-lg p-2 text-surface-300 hover:bg-white/10 hover:text-white transition-colors" title="Close (Esc)">
          <X className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold leading-tight">{resource.title}</p>
          <p className="truncate text-[11px] text-surface-400">
            {resource.type} · {languageName(resource.language)} · {resource.format}
            {resource.fileSize > 0 ? ` · ${formatBytes(resource.fileSize)}` : ''}
          </p>
        </div>
        <div className="hidden items-center gap-1 sm:flex">
          <button onClick={() => setZoom(z => Math.max(0.5, z - 0.2))} className="rounded-lg p-2 text-surface-300 hover:bg-white/10 hover:text-white" title="Zoom out">
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="w-12 text-center text-xs font-medium text-surface-300">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.min(2.5, z + 0.2))} className="rounded-lg p-2 text-surface-300 hover:bg-white/10 hover:text-white" title="Zoom in">
            <ZoomIn className="h-4 w-4" />
          </button>
          <button onClick={() => setFitWidth(v => !v)} className={`rounded-lg p-2 hover:bg-white/10 ${fitWidth ? 'text-mint-400' : 'text-surface-300'}`} title="Fit to width">
            <Maximize className="h-4 w-4" />
          </button>
          <button onClick={toggleFullscreen} className="rounded-lg p-2 text-surface-300 hover:bg-white/10 hover:text-white" title="Fullscreen (F)">
            {fullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </button>
        </div>
        <div className="ml-1 flex items-center gap-1">
          <button onClick={handleDownload} className="flex items-center gap-1.5 rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-600 transition-colors" title="Download">
            <Download className="h-4 w-4" /> <span className="hidden sm:inline">Download</span>
          </button>
          <button onClick={handleShare} className="rounded-lg p-2 text-surface-300 hover:bg-white/10 hover:text-white" title="Share">
            <Share2 className="h-4 w-4" />
          </button>
          <button onClick={() => onReport?.(resource)} className="rounded-lg p-2 text-surface-300 hover:bg-white/10 hover:text-coral-400" title="Report issue">
            <Flag className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Progress */}
      <div className="flex items-center gap-3 border-b border-white/10 bg-[#111426] px-3 py-1.5 text-xs text-surface-300">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-gradient-to-r from-brand-400 to-mint-400 transition-all duration-300" style={{ width: `${progressPct}%` }} />
        </div>
        <span className="shrink-0 font-medium text-white">{page} / {total}</span>
        {finished && (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-mint-500/20 px-2 py-0.5 font-semibold text-mint-300">
            <CheckCircle2 className="h-3.5 w-3.5" /> Read
          </span>
        )}
      </div>

      {/* Pages canvas */}
      <div className="flex-1 overflow-auto bg-[#1d2136] p-4 sm:p-8" onClick={() => setFitWidth(true)}>
        <div className="mx-auto flex flex-col items-center gap-6" style={{ maxWidth: fitWidth ? 780 : undefined }}>
          <PlaceholderPage page={page} total={total} zoom={zoom} title={resource.title} fitWidth={fitWidth} />
        </div>
      </div>

      {/* Bottom controls */}
      <footer className="flex items-center justify-center gap-3 border-t border-white/10 bg-[#111426] px-4 py-3">
        <button onClick={() => goTo(page - 1)} disabled={page <= 1}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white transition-colors hover:bg-white/10 disabled:opacity-30">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-1.5 text-sm text-white">
          <input
            type="number"
            value={page}
            min={1}
            max={total}
            onChange={e => goTo(Number(e.target.value))}
            className="h-9 w-16 rounded-lg border border-white/15 bg-white/5 px-2 text-center text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <span className="text-surface-400">/ {total}</span>
        </div>
        <button onClick={() => goTo(page + 1)} disabled={page >= total}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-white transition-colors hover:bg-brand-600 disabled:opacity-30">
          <ChevronRight className="h-5 w-5" />
        </button>
      </footer>
    </div>
  );
}

function PlaceholderPage({ page, total, zoom, title, fitWidth }: { page: number; total: number; zoom: number; title: string; fitWidth: boolean }) {
  const width = 780;
  const height = 1040;
  const lines = useMemo(() => {
    const arr: { w: number; h: number; pad: boolean }[] = [];
    const seed = page * 31 + total * 7;
    const count = 12 + (seed % 8);
    for (let i = 0; i < count; i++) {
      const w = 55 + ((seed * (i + 3)) % 40);
      const h = i % 5 === 0 ? 16 : 10;
      arr.push({ w, h, pad: i % 6 === 0 });
    }
    return arr;
  }, [page, total]);

  return (
    <div
      className="relative shrink-0 rounded-lg bg-white shadow-2xl transition-all duration-200"
      style={{ width: fitWidth ? '100%' : width * zoom, maxWidth: fitWidth ? 780 : undefined, aspectRatio: '780/1040' }}
    >
      <div className="absolute inset-0 overflow-hidden rounded-lg">
        {/* Page header band */}
        <div className="h-14 border-b border-surface-100 bg-surface-50 px-10 pt-5">
          <div className="h-3 w-2/3 rounded-full bg-gradient-to-r from-brand-200 to-brand-100" />
        </div>
        <div className="px-10 py-8">
          <div className="mb-6 space-y-2">
            <div className="h-4 w-1/2 rounded-full bg-surface-200" />
            <div className="h-3 w-1/3 rounded-full bg-surface-100" />
          </div>
          <div className="space-y-2.5">
            {lines.map((l, i) => (
              <div key={i} className="flex items-center gap-2">
                {l.pad && <div className="h-3 w-2 shrink-0 rounded bg-mint-200" />}
                <div className="h-3 rounded-full bg-surface-100" style={{ width: `${l.w}%` }} />
              </div>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-surface-50 p-3">
              <div className="mb-2 h-2.5 w-1/3 rounded-full bg-brand-200" />
              <div className="space-y-1.5">
                <div className="h-2 rounded-full bg-surface-200" />
                <div className="h-2 w-5/6 rounded-full bg-surface-200" />
              </div>
            </div>
            <div className="rounded-lg bg-surface-50 p-3">
              <div className="mb-2 h-2.5 w-1/3 rounded-full bg-mint-200" />
              <div className="space-y-1.5">
                <div className="h-2 rounded-full bg-surface-200" />
                <div className="h-2 w-4/6 rounded-full bg-surface-200" />
              </div>
            </div>
          </div>
        </div>
        {/* Page number */}
        <div className="absolute bottom-4 right-6 flex items-center gap-1.5 text-xs font-medium text-surface-400">
          <Layers className="h-3.5 w-3.5" /> Page {page} of {total}
        </div>
      </div>
    </div>
  );
}

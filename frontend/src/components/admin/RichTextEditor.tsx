'use client';
import { useEffect, useRef, useState } from 'react';
import {
  Bold, Italic, Underline, List, ListOrdered, Quote, Heading2,
  Link2, Image, Undo2, Redo2, Eraser, Eye,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}

const TOOLBAR: { icon: React.ReactNode; label: string; cmd: string; arg?: string; block?: string }[] = [
  { icon: <Undo2 className="h-4 w-4" />, label: 'Undo', cmd: 'undo' },
  { icon: <Redo2 className="h-4 w-4" />, label: 'Redo', cmd: 'redo' },
  { icon: <Heading2 className="h-4 w-4" />, label: 'Heading', cmd: 'formatBlock', block: 'h2' },
  { icon: <Bold className="h-4 w-4" />, label: 'Bold', cmd: 'bold' },
  { icon: <Italic className="h-4 w-4" />, label: 'Italic', cmd: 'italic' },
  { icon: <Underline className="h-4 w-4" />, label: 'Underline', cmd: 'underline' },
  { icon: <List className="h-4 w-4" />, label: 'Bullet list', cmd: 'insertUnorderedList' },
  { icon: <ListOrdered className="h-4 w-4" />, label: 'Numbered list', cmd: 'insertOrderedList' },
  { icon: <Quote className="h-4 w-4" />, label: 'Quote', cmd: 'formatBlock', block: 'blockquote' },
];

export default function RichTextEditor({ value, onChange, placeholder = 'Write your content here...', minHeight = 320 }: RichTextEditorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exec = (cmd: string, arg?: string) => {
    ref.current?.focus();
    document.execCommand(cmd, false, arg || undefined);
    if (onChange) onChange(ref.current?.innerHTML || '');
  };

  const insertImage = () => {
    const url = window.prompt('Image URL');
    if (!url) return;
    ref.current?.focus();
    document.execCommand('insertImage', false, url);
    onChange(ref.current?.innerHTML || '');
  };

  const insertLink = () => {
    const url = window.prompt('Link URL (https://...)');
    if (!url) return;
    const selection = window.getSelection()?.toString();
    ref.current?.focus();
    if (selection) {
      document.execCommand('createLink', false, url);
    } else {
      document.execCommand('insertHTML', false, `<a href="${url}" target="_blank" rel="noopener">${url}</a>`);
    }
    onChange(ref.current?.innerHTML || '');
  };

  const clearFormatting = () => {
    ref.current?.focus();
    document.execCommand('removeFormat');
    onChange(ref.current?.innerHTML || '');
  };

  const renderPreview = () => {
    return { __html: value };
  };

  return (
    <div className="rounded-xl border border-surface-300 overflow-hidden bg-white focus-within:ring-2 focus-within:ring-brand-500/30 focus-within:border-brand-400 transition-all">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-surface-50 border-b border-surface-200">
        {TOOLBAR.map((t, i) => (
          <button
            key={i}
            type="button"
            title={t.label}
            onMouseDown={(e) => { e.preventDefault(); exec(t.cmd, t.block); }}
            className="p-1.5 rounded-lg text-surface-500 hover:text-brand-600 hover:bg-white transition-colors"
          >
            {t.icon}
          </button>
        ))}
        <button type="button" title="Link" onMouseDown={(e) => { e.preventDefault(); insertLink(); }} className="p-1.5 rounded-lg text-surface-500 hover:text-brand-600 hover:bg-white transition-colors">
          <Link2 className="h-4 w-4" />
        </button>
        <button type="button" title="Image" onMouseDown={(e) => { e.preventDefault(); insertImage(); }} className="p-1.5 rounded-lg text-surface-500 hover:text-brand-600 hover:bg-white transition-colors">
          <Image className="h-4 w-4" />
        </button>
        <button type="button" title="Clear formatting" onMouseDown={(e) => { e.preventDefault(); clearFormatting(); }} className="p-1.5 rounded-lg text-surface-500 hover:text-red-500 hover:bg-white transition-colors">
          <Eraser className="h-4 w-4" />
        </button>
        <div className="mx-1 w-px h-5 bg-surface-200" />
        <button
          type="button"
          onClick={() => setPreview(p => !p)}
          className={`ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            preview ? 'bg-brand-500 text-white' : 'text-surface-600 hover:bg-white'
          }`}
        >
          <Eye className="h-3.5 w-3.5" /> {preview ? 'Edit' : 'Preview'}
        </button>
      </div>

      {/* Editor / Preview */}
      {preview ? (
        <div className="prose-note p-5" style={{ minHeight }}>
          <div dangerouslySetInnerHTML={renderPreview()} />
        </div>
      ) : (
        <div
          ref={ref}
          contentEditable
          data-placeholder={placeholder}
          onInput={() => onChange(ref.current?.innerHTML || '')}
          className="prose-note p-5 outline-none text-surface-800"
          style={{ minHeight }}
        />
      )}
    </div>
  );
}

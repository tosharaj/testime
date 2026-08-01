'use client';
import { useMemo } from 'react';
import { SlidersHorizontal, X, RotateCcw, ChevronDown } from 'lucide-react';
import type { FilterState } from '@/types/notes';
import { getLibrary } from '@/lib/notesStore';

interface FilterRailProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-surface-400">{title}</p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function Chip({
  active, onClick, label, count,
}: { active: boolean; onClick: () => void; label: string; count?: number }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-sm transition-all ${
        active ? 'bg-brand-600 text-white font-medium shadow-sm' : 'text-surface-600 hover:bg-surface-100'
      }`}
    >
      <span>{label}</span>
      {typeof count === 'number' && <span className={active ? 'opacity-70' : 'text-xs text-surface-400'}>{count}</span>}
    </button>
  );
}

export function FilterRail({ filters, onChange }: FilterRailProps) {
  const data = getLibrary();
  const set = (patch: Partial<FilterState>) => onChange({ ...filters, ...patch, page: 1 });
  const activeCount =
    (filters.type && filters.type !== 'all' ? 1 : 0) +
    (filters.language && filters.language !== 'all' ? 1 : 0) +
    (filters.format && filters.format !== 'all' ? 1 : 0) +
    (filters.access && filters.access !== 'all' ? 1 : 0) +
    (filters.examCategoryId ? 1 : 0) +
    (filters.examId ? 1 : 0) +
    (filters.subjectId ? 1 : 0) +
    (filters.institutionId ? 1 : 0);

  const typeCounts = useMemo(() => {
    const m: Record<string, number> = {};
    data.resources.forEach(r => { m[r.type] = (m[r.type] || 0) + 1; });
    return m;
  }, [data]);

  return (
    <div className="rounded-2xl border border-surface-200 bg-white p-4 shadow-card space-y-5">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 font-display text-sm font-bold text-surface-900">
          <SlidersHorizontal className="h-4 w-4 text-brand-600" /> Filters
        </p>
        {activeCount > 0 && (
          <button onClick={() => onChange({ page: 1, sort: filters.sort })} className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700">
            <RotateCcw className="h-3 w-3" /> Reset
          </button>
        )}
      </div>

      <Section title="Sort By">
        <Chip active={!filters.sort || filters.sort === 'latest'} onClick={() => set({ sort: 'latest' })} label="Latest" />
        <Chip active={filters.sort === 'popular'} onClick={() => set({ sort: 'popular' })} label="Most Viewed" />
        <Chip active={filters.sort === 'downloads'} onClick={() => set({ sort: 'downloads' })} label="Most Downloaded" />
        <Chip active={filters.sort === 'title'} onClick={() => set({ sort: 'title' })} label="Title A–Z" />
      </Section>

      <Section title="Type">
        <Chip active={!filters.type || filters.type === 'all'} onClick={() => set({ type: 'all' })} label="All Types" />
        {data.resourceTypes.map(t => (
          <Chip
            key={t.id}
            active={filters.type === t.slug}
            onClick={() => set({ type: filters.type === t.slug ? 'all' : t.slug })}
            label={t.name}
            count={typeCounts[t.slug.toUpperCase()] || 0}
          />
        ))}
      </Section>

      <Section title="Access">
        <Chip active={!filters.access || filters.access === 'all'} onClick={() => set({ access: 'all' })} label="All" />
        <Chip active={filters.access === 'free'} onClick={() => set({ access: 'free' })} label="Free" />
        <Chip active={filters.access === 'restricted'} onClick={() => set({ access: 'restricted' })} label="Restricted" />
        <Chip active={filters.access === 'premium'} onClick={() => set({ access: 'premium' })} label="Premium" />
      </Section>

      <Section title="Language">
        <Chip active={!filters.language || filters.language === 'all'} onClick={() => set({ language: 'all' })} label="All Languages" />
        {data.languages.map(l => (
          <Chip
            key={l.id}
            active={filters.language === l.code}
            onClick={() => set({ language: filters.language === l.code ? 'all' : l.code })}
            label={l.name}
          />
        ))}
      </Section>

      <Section title="Format">
        <Chip active={!filters.format || filters.format === 'all'} onClick={() => set({ format: 'all' })} label="All Formats" />
        {data.formats.map(f => (
          <Chip
            key={f.id}
            active={filters.format === f.slug}
            onClick={() => set({ format: filters.format === f.slug ? 'all' : f.slug })}
            label={f.name.toUpperCase()}
          />
        ))}
      </Section>
    </div>
  );
}

interface FilterSheetProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  open: boolean;
  onClose: () => void;
}

export function FilterSheet({ filters, onChange, open, onClose }: FilterSheetProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-5 pb-8 shadow-2xl animate-fade-in-up">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-surface-200" />
        <div className="mb-4 flex items-center justify-between">
          <p className="flex items-center gap-2 font-display text-lg font-bold text-surface-900">
            <SlidersHorizontal className="h-5 w-5 text-brand-600" /> Filters
          </p>
          <button onClick={onClose} className="rounded-xl p-2 text-surface-400 hover:bg-surface-100 hover:text-surface-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mb-4 flex flex-wrap gap-2">
          {filters.type && filters.type !== 'all' && (
            <button onClick={() => onChange({ ...filters, type: 'all', page: 1 })} className="flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
              Type: {filters.type} <X className="h-3 w-3" />
            </button>
          )}
          {filters.examId && <MobileTag label="Exam selected" onRemove={() => onChange({ ...filters, examId: undefined, page: 1 })} />}
          {filters.subjectId && <MobileTag label="Subject selected" onRemove={() => onChange({ ...filters, subjectId: undefined, page: 1 })} />}
          {filters.access && filters.access !== 'all' && (
            <MobileTag label={`Access: ${filters.access}`} onRemove={() => onChange({ ...filters, access: 'all', page: 1 })} />
          )}
        </div>
        <FilterRail filters={filters} onChange={onChange} />
        <button onClick={onClose} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-surface-900 py-3 text-sm font-semibold text-white">
          <ChevronDown className="h-4 w-4" /> Apply &amp; Close
        </button>
      </div>
    </div>
  );
}

function MobileTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button onClick={onRemove} className="flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
      {label} <X className="h-3 w-3" />
    </button>
  );
}

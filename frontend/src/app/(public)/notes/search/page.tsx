'use client';
import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, ChevronRight, ChevronLeft, SlidersHorizontal, BookOpen, X } from 'lucide-react';
import type { FilterState } from '@/types/notes';
import { getResources, getLibrary } from '@/lib/notesStore';
import ResourceCard from '@/components/notes/ResourceCard';
import { FilterRail, FilterSheet } from '@/components/notes/FilterRail';
import Button from '@/components/ui/Button';
import { typeLabel } from '@/lib/resourceStyles';

function SearchContent() {
  const searchParams = useSearchParams();
  const data = getLibrary();

  const [filters, setFilters] = useState<FilterState>(() => ({
    query: searchParams.get('q') || '',
    type: 'all',
    language: 'all',
    format: 'all',
    access: 'all',
    sort: 'latest',
    page: 1,
    perPage: 12,
  }));
  const [sheetOpen, setSheetOpen] = useState(false);
  const [debounced, setDebounced] = useState<FilterState>(filters);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(filters), 250);
    return () => clearTimeout(t);
  }, [filters]);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null && q !== filters.query) {
      setFilters(f => ({ ...f, query: q, page: 1 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const { data: results, total, totalPages, page } = useMemo(
    () => getResources(debounced),
    [debounced],
  );

  const activeChips = useMemo(() => {
    const chips: { label: string; clear: () => void }[] = [];
    if (filters.query) chips.push({ label: `"${filters.query}"`, clear: () => setFilters(f => ({ ...f, query: '' })) });
    if (filters.type && filters.type !== 'all') chips.push({ label: typeLabel(filters.type.toUpperCase()), clear: () => setFilters(f => ({ ...f, type: 'all', page: 1 })) });
    if (filters.access && filters.access !== 'all') chips.push({ label: filters.access === 'free' ? 'Free' : filters.access === 'restricted' ? 'Restricted' : 'Premium', clear: () => setFilters(f => ({ ...f, access: 'all', page: 1 })) });
    return chips;
  }, [filters]);

  return (
    <div className="bg-white animate-fade-in">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 lg:py-10">
        <nav className="mb-6 flex items-center gap-1.5 text-sm text-surface-400">
          <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/notes" className="hover:text-brand-600 transition-colors">Notes</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-surface-600">Search</span>
        </nav>

        {/* Search bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-surface-400 pointer-events-none" />
            <input
              value={filters.query}
              onChange={e => setFilters(f => ({ ...f, query: e.target.value, page: 1 }))}
              placeholder="Search by title, topic or tag..."
              className="w-full rounded-2xl border border-surface-200 bg-white py-3.5 pl-12 pr-4 text-base shadow-sm placeholder:text-surface-400 focus:outline-none focus:ring-4 focus:ring-brand-500/15 focus:border-brand-300 transition-all"
            />
            {filters.query && (
              <button onClick={() => setFilters(f => ({ ...f, query: '' }))} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-surface-400 hover:bg-surface-100">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {activeChips.map((c, i) => (
              <button key={i} onClick={c.clear} className="flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 hover:bg-brand-100">
                {c.label} <X className="h-3 w-3" />
              </button>
            ))}
            <span className="text-sm text-surface-400">{total} result{total !== 1 ? 's' : ''}</span>
            <button onClick={() => setSheetOpen(true)} className="ml-auto flex items-center gap-1.5 rounded-xl border border-surface-200 bg-white px-3 py-1.5 text-sm font-medium text-surface-600 lg:hidden">
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Desktop filter rail */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-24">
              <FilterRail filters={filters} onChange={setFilters} />
            </div>
          </aside>

          {/* Results */}
          <div className="min-w-0 flex-1">
            {results.length === 0 ? (
              <div className="rounded-3xl border border-surface-200 bg-surface-50/50 py-20 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <BookOpen className="h-8 w-8 text-surface-300" />
                </div>
                <p className="text-lg font-semibold text-surface-900">No resources found</p>
                <p className="mx-auto mt-1 max-w-sm text-sm text-surface-500">Try different keywords or clear filters. You can also request this resource from us.</p>
                <div className="mt-5 flex justify-center gap-2">
                  <Button variant="outline" onClick={() => setFilters({ query: '', type: 'all', language: 'all', format: 'all', access: 'all', sort: 'latest', page: 1, perPage: 12 })}>
                    Clear filters
                  </Button>
                  <Link href="/notes/request"><Button variant="accent">Request resource</Button></Link>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {results.map(r => <ResourceCard key={r.id} resource={r} />)}
                </div>

                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setFilters(f => ({ ...f, page: Math.max(1, page - 1) }))}
                      disabled={page <= 1}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-surface-200 bg-white text-surface-600 transition-colors hover:border-brand-300 disabled:opacity-40"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    {Array.from({ length: totalPages }).slice(0, 7).map((_, i) => {
                      const p = i + 1;
                      return (
                        <button
                          key={p}
                          onClick={() => setFilters(f => ({ ...f, page: p }))}
                          className={`h-10 w-10 rounded-xl text-sm font-semibold transition-colors ${p === page ? 'bg-brand-600 text-white shadow-sm' : 'border border-surface-200 bg-white text-surface-600 hover:border-brand-300'}`}
                        >
                          {p}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setFilters(f => ({ ...f, page: Math.min(totalPages, page + 1) }))}
                      disabled={page >= totalPages}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-surface-200 bg-white text-surface-600 transition-colors hover:border-brand-300 disabled:opacity-40"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <FilterSheet filters={filters} onChange={setFilters} open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-surface-400">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}

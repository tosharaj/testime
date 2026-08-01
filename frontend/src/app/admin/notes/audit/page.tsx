'use client';
import { useState } from 'react';
import { ScrollText, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { getLibrary } from '@/lib/notesStore';
import { formatDate } from '@/lib/utils';

const actionLabels: Record<string, { label: string; tone: 'default' | 'success' | 'warning' | 'danger' | 'info' }> = {
  create_resource: { label: 'Created resource', tone: 'success' },
  update_resource: { label: 'Updated resource', tone: 'info' },
  delete_resource: { label: 'Deleted resource', tone: 'danger' },
  save_exam: { label: 'Saved exam', tone: 'info' },
  seed: { label: 'Seeded library', tone: 'default' },
};

export default function AdminAuditLogPage() {
  const data = getLibrary();
  const [search, setSearch] = useState('');

  const filtered = data.auditLog.filter(e => {
    const q = search.toLowerCase().trim();
    return !q || e.action.toLowerCase().includes(q) || e.entity.toLowerCase().includes(q);
  });

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search audit log..." className="w-72 rounded-lg border border-surface-300 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30" />
        </div>
        <span className="text-sm text-surface-400">{filtered.length} entries</span>
        <span className="ml-auto text-xs text-surface-400">Stored locally in this browser (demo)</span>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-200 bg-surface-50 text-left text-xs font-medium text-surface-400 uppercase tracking-wider">
                  <th className="px-5 py-3">Action</th>
                  <th className="px-5 py-3">Entity</th>
                  <th className="px-5 py-3">Entity ID</th>
                  <th className="px-5 py-3">By</th>
                  <th className="px-5 py-3">Time</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(e => {
                  const meta = actionLabels[e.action] || { label: e.action.replace(/_/g, ' '), tone: 'default' as const };
                  return (
                    <tr key={e.id} className="border-b border-surface-100 hover:bg-surface-50/50 transition-colors">
                      <td className="px-5 py-3"><Badge variant={meta.tone} size="sm">{meta.label}</Badge></td>
                      <td className="px-5 py-3 font-medium text-surface-800">{e.entity}</td>
                      <td className="px-5 py-3 font-mono text-xs text-surface-400">{e.entityId}</td>
                      <td className="px-5 py-3 text-surface-600">{e.by}</td>
                      <td className="px-5 py-3 text-surface-500 text-xs">{formatDate(e.at)}</td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="px-5 py-16 text-center">
                    <ScrollText className="h-10 w-10 text-surface-300 mx-auto mb-3" />
                    <p className="text-surface-500 font-medium">No audit entries found</p>
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

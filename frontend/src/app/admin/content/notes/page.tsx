'use client';
import { API_BASE } from '@/lib/apiBase';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Plus, Eye, Edit2, Trash2, FileText } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminNotesPage() {
  const [notes, setNotes] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_BASE}/notes?limit=50`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json()).then(d => setNotes(d.data || [])).catch(console.error);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-surface-900">Notes Management</h1>
        <Button><Plus className="h-4 w-4 mr-1" /> New Note</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-200 bg-surface-50">
                  <th className="text-left px-4 py-3 font-medium text-surface-700">Title</th>
                  <th className="text-left px-4 py-3 font-medium text-surface-700">Exam</th>
                  <th className="text-left px-4 py-3 font-medium text-surface-700">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-surface-700">Views</th>
                  <th className="text-left px-4 py-3 font-medium text-surface-700">Created</th>
                  <th className="text-right px-4 py-3 font-medium text-surface-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {notes.map((note) => (
                  <tr key={note.id} className="border-b border-surface-100 hover:bg-surface-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-surface-900">{note.title}</td>
                    <td className="px-4 py-3 text-surface-600">{note.exam?.name || '-'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <Badge variant={note.isPremium ? 'warning' : 'success'}>{note.isPremium ? 'Premium' : 'Free'}</Badge>
                        {!note.isPublished && <Badge variant="danger">Draft</Badge>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-surface-600">{note.viewCount}</td>
                    <td className="px-4 py-3 text-surface-500">{formatDate(note.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <button className="p-1.5 text-surface-400 hover:text-brand-600 transition-colors"><Eye className="h-4 w-4" /></button>
                      <button className="p-1.5 text-surface-400 hover:text-amber-600 transition-colors"><Edit2 className="h-4 w-4" /></button>
                      <button className="p-1.5 text-surface-400 hover:text-red-600 transition-colors"><Trash2 className="h-4 w-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {notes.length === 0 && (
        <div className="text-center py-16">
          <FileText className="h-10 w-10 text-surface-300 mx-auto mb-3" />
          <p className="text-surface-500">No notes yet.</p>
        </div>
      )}
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { Users, Search, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');

  const fetchUsers = () => {
    const q = `?page=${page}&limit=20${search ? `&search=${search}` : ''}`;
    fetch(`http://localhost:4000/api/users${q}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(r => r.json()).then(d => { setUsers(d.data || []); setTotal(d.total || 0); }).catch(console.error);
  };

  useEffect(() => { fetchUsers(); }, [page]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-surface-900">Users</h1>
        <div className="flex items-center gap-2">
          <input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
            className="w-64 rounded-lg border border-surface-300 px-3 py-2 text-sm text-surface-900 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
          />
          <button onClick={fetchUsers} className="p-2 rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition-colors"><Search className="h-4 w-4" /></button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-200 bg-surface-50">
                  <th className="text-left px-4 py-3 font-medium text-surface-700">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-surface-700">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-surface-700">Role</th>
                  <th className="text-left px-4 py-3 font-medium text-surface-700">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-surface-700">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-surface-100 hover:bg-surface-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-surface-900">{u.name}</td>
                    <td className="px-4 py-3 text-surface-600">{u.email}</td>
                    <td className="px-4 py-3"><Badge variant={u.role === 'SUPER_ADMIN' ? 'danger' : u.role === 'STUDENT' ? 'default' : 'info'}>{u.role.replace('_', ' ')}</Badge></td>
                    <td className="px-4 py-3"><Badge variant={u.isActive ? 'success' : 'danger'}>{u.isActive ? 'Active' : 'Inactive'}</Badge></td>
                    <td className="px-4 py-3 text-surface-500">{formatDate(u.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-surface-500">{total} users total</p>
        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="px-3 py-1.5 text-sm border border-surface-200 rounded-lg disabled:opacity-50 hover:bg-surface-50 text-surface-600 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setPage(p => p + 1)}
            className="px-3 py-1.5 text-sm border border-surface-200 rounded-lg hover:bg-surface-50 text-surface-600 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

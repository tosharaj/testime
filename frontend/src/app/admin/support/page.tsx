'use client';
import { API_BASE } from '@/lib/apiBase';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { Ticket, MessageSquare, User } from 'lucide-react';

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_BASE}/support/tickets`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json()).then(d => setTickets(d.data || [])).catch(console.error);
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-surface-900">Support Tickets</h1>
        <p className="text-surface-500 mt-1">Manage user enquiries and support requests</p>
      </div>

      <div className="space-y-4">
        {tickets.map((ticket) => (
          <Card key={ticket.id} className="hover:shadow-card-hover transition-shadow cursor-pointer">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-full bg-surface-100 flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-surface-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-surface-900 mb-1">{ticket.subject}</h3>
                    <p className="text-sm text-surface-600 line-clamp-1">{ticket.message}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-surface-400">
                      <span className="font-medium">{ticket.user?.name || 'Unknown'}</span>
                      <span>{formatDate(ticket.createdAt)}</span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {ticket._count?.replies || 0}
                      </span>
                    </div>
                  </div>
                </div>
                <Badge variant={ticket.status === 'OPEN' ? 'danger' : ticket.status === 'IN_PROGRESS' ? 'warning' : 'success'}>
                  {ticket.status?.replace('_', ' ')}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
        {tickets.length === 0 && (
          <div className="text-center py-20">
            <Ticket className="h-10 w-10 text-surface-300 mx-auto mb-3" />
            <p className="text-surface-500">No support tickets</p>
          </div>
        )}
      </div>
    </div>
  );
}

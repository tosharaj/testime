'use client';
import { API_BASE } from '@/lib/apiBase';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { DollarSign, ShoppingCart } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_BASE}/orders`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json()).then(d => { setOrders(d.data || []); setTotal(d.total || 0); }).catch(console.error);
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-surface-900">Orders</h1>
        <p className="text-surface-500 mt-1">Track and manage all platform orders</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-200 bg-surface-50">
                  <th className="text-left px-4 py-3 font-medium text-surface-700">Order ID</th>
                  <th className="text-left px-4 py-3 font-medium text-surface-700">User</th>
                  <th className="text-left px-4 py-3 font-medium text-surface-700">Plan</th>
                  <th className="text-left px-4 py-3 font-medium text-surface-700">Amount</th>
                  <th className="text-left px-4 py-3 font-medium text-surface-700">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-surface-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-surface-100 hover:bg-surface-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-surface-600">{order.orderId}</td>
                    <td className="px-4 py-3 text-surface-900">{order.user?.name || '-'}</td>
                    <td className="px-4 py-3 text-surface-600">{order.plan?.name || '-'}</td>
                    <td className="px-4 py-3 font-medium text-surface-900">₹{order.amount}</td>
                    <td className="px-4 py-3">
                      <Badge variant={order.status === 'COMPLETED' ? 'success' : order.status === 'PENDING' ? 'warning' : 'danger'}>{order.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-surface-500">{formatDate(order.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {orders.length === 0 && (
        <div className="text-center py-20">
          <ShoppingCart className="h-10 w-10 text-surface-300 mx-auto mb-3" />
          <p className="text-surface-500">No orders yet.</p>
        </div>
      )}

      {orders.length > 0 && (
        <p className="mt-4 text-sm text-surface-500">{total} orders total</p>
      )}
    </div>
  );
}

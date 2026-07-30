'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { ShoppingCart, CheckCircle, XCircle, Clock, Package } from 'lucide-react';

export default function PurchasesPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    api.getMyOrders().then(setOrders).catch(console.error);
  }, []);

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 mb-2">My Purchases</h1>
      <p className="text-surface-500 mb-8">View your subscription history and orders</p>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="h-16 w-16 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="h-8 w-8 text-surface-300" />
          </div>
          <p className="text-lg font-semibold text-surface-900 mb-2">No purchases yet</p>
          <p className="text-sm text-surface-500 mb-6">Subscribe to a plan to unlock premium features</p>
          <Link href="/pricing"><Button>View Plans</Button></Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="card-hover">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-11 w-11 rounded-xl bg-brand-50 flex items-center justify-center">
                      <Package className="h-5 w-5 text-brand-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5 mb-0.5">
                        <h3 className="font-semibold text-surface-900">{order.plan?.name}</h3>
                        {order.paymentId && <Badge variant={order.status === 'COMPLETED' ? 'success' : order.status === 'PENDING' ? 'warning' : 'danger'} size="sm">{order.status}</Badge>}
                      </div>
                      <p className="text-xs text-surface-400">Order: {order.orderId} &bull; {formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-surface-900">₹{order.amount}</p>
                    {order.status === 'COMPLETED' && <CheckCircle className="h-4 w-4 text-emerald-500 ml-auto mt-1" />}
                    {order.status === 'PENDING' && <Clock className="h-4 w-4 text-amber-500 ml-auto mt-1" />}
                    {order.status === 'FAILED' && <XCircle className="h-4 w-4 text-red-500 ml-auto mt-1" />}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

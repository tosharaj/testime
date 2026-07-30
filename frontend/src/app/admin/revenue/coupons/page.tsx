'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Plus, Edit2, Trash2, Percent } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:4000/api/coupons', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json()).then(setCoupons).catch(console.error);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-surface-900">Coupons</h1>
        <Button><Plus className="h-4 w-4 mr-1" /> Add Coupon</Button>
      </div>

      {coupons.length === 0 && (
        <div className="text-center py-20">
          <Percent className="h-10 w-10 text-surface-300 mx-auto mb-3" />
          <p className="text-surface-500">No coupons created yet.</p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((coupon) => (
          <Card key={coupon.id} className="hover:shadow-card-hover transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Percent className="h-4 w-4 text-brand-500" />
                  <span className="font-mono font-bold text-lg text-surface-900">{coupon.code}</span>
                </div>
                <Badge variant={coupon.isActive ? 'success' : 'danger'}>{coupon.isActive ? 'Active' : 'Inactive'}</Badge>
              </div>
              <p className="text-2xl font-bold text-surface-900 mb-1">{coupon.discountPct}% OFF</p>
              <p className="text-xs text-surface-500">
                Used {coupon.usedCount}/{coupon.maxUses || '∞'} times
                {coupon.maxDiscount && ` • Max discount ₹${coupon.maxDiscount}`}
              </p>
              {coupon.expiresAt && (
                <p className="text-xs text-surface-400 mt-2">Expires: {formatDate(coupon.expiresAt)}</p>
              )}
              <div className="flex gap-1 mt-3 pt-3 border-t border-surface-100">
                <Button variant="ghost" size="sm"><Edit2 className="h-3.5 w-3.5 mr-1" /> Edit</Button>
                <Button variant="ghost" size="sm" className="!text-red-600 hover:!bg-red-50"><Trash2 className="h-3.5 w-3.5 mr-1" /> Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

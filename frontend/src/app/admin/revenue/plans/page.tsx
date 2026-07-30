'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Plus, Edit2, Trash2, DollarSign } from 'lucide-react';

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:4000/api/plans', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json()).then(setPlans).catch(console.error);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-surface-900">Subscription Plans</h1>
        <Button><Plus className="h-4 w-4 mr-1" /> Add Plan</Button>
      </div>

      {plans.length === 0 && (
        <div className="text-center py-20">
          <DollarSign className="h-10 w-10 text-surface-300 mx-auto mb-3" />
          <p className="text-surface-500">No plans created yet.</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <Card key={plan.id} className="hover:shadow-card-hover transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-surface-900">{plan.name}</h3>
                <Badge variant={plan.isActive ? 'success' : 'danger'}>{plan.isActive ? 'Active' : 'Inactive'}</Badge>
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                {plan.discountedPrice && plan.discountedPrice < plan.price ? (
                  <>
                    <span className="text-2xl font-bold text-surface-900">₹{plan.discountedPrice}</span>
                    <span className="text-sm text-surface-400 line-through">₹{plan.price}</span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-surface-900">₹{plan.price}</span>
                )}
              </div>
              <p className="text-sm text-surface-500 mb-3">{plan.durationDays} days • {plan.testAccess} access</p>
              <p className="text-xs text-surface-400 line-clamp-2">{plan.description}</p>
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

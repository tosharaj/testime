'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { BarChart3, TrendingUp, Users, FileText, DollarSign } from 'lucide-react';

export default function AdminReportsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:4000/api/dashboard/admin', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(r => r.json()).then(setData).catch(console.error);
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-surface-900">Reports & Analytics</h1>
        <p className="text-surface-500 mt-1">Key metrics and platform insights</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Card className="hover:shadow-card-hover transition-shadow">
          <CardContent className="p-6 text-center">
            <div className="h-10 w-10 rounded-xl bg-brand-50 flex items-center justify-center mx-auto mb-3">
              <Users className="h-5 w-5 text-brand-600" />
            </div>
            <p className="text-3xl font-bold text-surface-900">{data?.users?.total || 0}</p>
            <p className="text-sm text-surface-500 mt-0.5">Total Users</p>
            <p className="text-xs text-surface-400 mt-1">{data?.users?.active || 0} active • {data?.users?.paid || 0} paid</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-card-hover transition-shadow">
          <CardContent className="p-6 text-center">
            <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center mx-auto mb-3">
              <FileText className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-surface-900">{data?.content?.totalNotes || 0}</p>
            <p className="text-sm text-surface-500 mt-0.5">Notes Published</p>
            <p className="text-xs text-surface-400 mt-1">{data?.content?.totalQuestions || 0} questions in bank</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-card-hover transition-shadow">
          <CardContent className="p-6 text-center">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-3">
              <DollarSign className="h-5 w-5 text-emerald-600" />
            </div>
            <p className="text-3xl font-bold text-surface-900">₹{(data?.revenue?.total || 0).toLocaleString()}</p>
            <p className="text-sm text-surface-500 mt-0.5">Total Revenue</p>
            <p className="text-xs text-surface-400 mt-1">{data?.revenue?.orders || 0} orders placed</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-brand-500" />
            Platform Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: 'Conversion Rate', value: data?.users?.total ? `${((data?.users?.paid || 0) / data?.users?.total * 100).toFixed(1)}%` : '0%', icon: TrendingUp, color: 'text-brand-600' },
              { label: 'Content per User', value: data?.users?.total ? `${((data?.content?.totalNotes || 0) / data?.users?.total).toFixed(2)}` : '0', icon: FileText, color: 'text-purple-600' },
              { label: 'Revenue per User', value: data?.users?.total ? `₹${((data?.revenue?.total || 0) / data?.users?.total).toFixed(0)}` : '₹0', icon: DollarSign, color: 'text-emerald-600' },
              { label: 'Support Rate', value: data?.users?.total ? `${((data?.support?.openTickets || 0) / data?.users?.total * 100).toFixed(2)}%` : '0%', icon: BarChart3, color: 'text-amber-600' },
            ].map((item) => (
              <div key={item.label}>
                <item.icon className={`h-5 w-5 mx-auto ${item.color} mb-2`} />
                <p className="text-xl font-bold text-surface-900">{item.value}</p>
                <p className="text-xs text-surface-500">{item.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

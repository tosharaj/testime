'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { api } from '@/lib/api';
import { Users, FileText, HelpCircle, BrainCircuit, DollarSign, Ticket, TrendingUp, BookOpen, Activity } from 'lucide-react';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.getAdminDashboard().then(setData).catch(console.error);
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="h-12 w-12 rounded-xl bg-brand-50 flex items-center justify-center mx-auto mb-4 animate-pulse-soft">
            <Activity className="h-6 w-6 text-brand-600" />
          </div>
          <p className="text-surface-400 animate-pulse-soft">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const cards = [
    { icon: Users, label: 'Total Users', value: data.users?.total || 0, sub: `${data.users?.active || 0} active`, color: 'bg-brand-500' },
    { icon: Users, label: 'Paid Users', value: data.users?.paid || 0, sub: 'paying customers', color: 'bg-emerald-500' },
    { icon: BookOpen, label: 'Total Notes', value: data.content?.totalNotes || 0, sub: `${data.content?.pendingNotes || 0} pending`, color: 'bg-purple-500' },
    { icon: HelpCircle, label: 'Questions', value: data.content?.totalQuestions || 0, sub: 'in question bank', color: 'bg-amber-500' },
    { icon: BrainCircuit, label: 'Tests', value: data.content?.totalTests || 0, sub: 'test series', color: 'bg-pink-500' },
    { icon: DollarSign, label: 'Revenue', value: `₹${(data.revenue?.total || 0).toLocaleString()}`, sub: `${data.revenue?.orders || 0} orders`, color: 'bg-cyan-500' },
    { icon: Ticket, label: 'Open Tickets', value: data.support?.openTickets || 0, sub: 'support needed', color: 'bg-red-500' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-surface-900">Admin Dashboard</h1>
        <p className="text-surface-500 mt-1">Overview of your platform metrics</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Card key={card.label} className="card-hover">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className={`h-11 w-11 rounded-xl ${card.color} flex items-center justify-center text-white shadow-md`}>
                  <card.icon className="h-5 w-5" />
                </div>
                <TrendingUp className="h-4 w-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-bold text-surface-900">{card.value}</p>
              <p className="text-sm text-surface-500 font-medium mt-0.5">{card.label}</p>
              <p className="text-xs text-surface-400 mt-1">{card.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

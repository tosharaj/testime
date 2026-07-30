'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { api } from '@/lib/api';
import { User, Mail, Phone, Target, Shield, BadgeCheck, GraduationCap } from 'lucide-react';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProfile().then(setProfile).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="h-12 w-12 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-4 animate-pulse-soft">
            <User className="h-6 w-6 text-brand-600" />
          </div>
          <p className="text-surface-400 animate-pulse-soft">Loading profile...</p>
        </div>
      </div>
    );
  }

  const details = [
    { icon: Mail, label: 'Email', value: profile?.email },
    { icon: Phone, label: 'Phone', value: profile?.phone || 'Not set' },
    { icon: Target, label: 'Target Exam', value: profile?.targetExam || 'Not set' },
    { icon: Shield, label: 'Email Verified', value: profile?.emailVerified ? 'Verified' : 'Not Verified', verified: profile?.emailVerified },
  ];

  return (
    <div className="max-w-2xl animate-fade-in">
      <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 mb-2">My Profile</h1>
      <p className="text-surface-500 mb-8">Manage your account information</p>

      <Card>
        <CardContent className="p-7">
          <div className="flex items-center gap-5 mb-8 pb-6 border-b border-surface-100">
            <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-brand-500/20">
              {profile?.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-surface-900">{profile?.name}</h2>
              <p className="text-sm text-surface-500 capitalize">{profile?.role?.toLowerCase().replace('_', ' ')}</p>
            </div>
          </div>

          <div className="space-y-3">
            {details.map((d) => (
              <div key={d.label} className="flex items-center gap-4 p-3.5 rounded-xl bg-surface-50 hover:bg-surface-100 transition-colors">
                <div className="h-9 w-9 rounded-lg bg-white shadow-sm flex items-center justify-center">
                  <d.icon className="h-4 w-4 text-surface-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-surface-900 truncate">{d.value}</p>
                  <p className="text-xs text-surface-400">{d.label}</p>
                </div>
                {'verified' in d && (
                  d.verified
                    ? <BadgeCheck className="h-5 w-5 text-emerald-500 shrink-0" />
                    : <Shield className="h-5 w-5 text-amber-500 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

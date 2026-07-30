'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Settings, Shield, Bell, CreditCard, Save } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="max-w-3xl animate-fade-in">
      <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 mb-2">Settings</h1>
      <p className="text-surface-500 mb-8">Manage your platform configuration</p>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-brand-50 flex items-center justify-center">
                <Shield className="h-4 w-4 text-brand-600" />
              </div>
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input id="site-name" label="Site Name" defaultValue="Testime" />
            <Input id="site-desc" label="Site Description" defaultValue="India's most advanced exam preparation platform" />
            <Input id="support-email" label="Support Email" defaultValue="support@testime.in" />
            <Button><Save className="h-4 w-4 mr-1.5" /> Save Settings</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-brand-50 flex items-center justify-center">
                <CreditCard className="h-4 w-4 text-brand-600" />
              </div>
              Payment Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input id="razorpay-id" label="Razorpay Key ID" />
            <Input id="razorpay-secret" label="Razorpay Key Secret" type="password" />
            <Input id="currency" label="Currency" defaultValue="INR" />
            <Button><Save className="h-4 w-4 mr-1.5" /> Save Payment Settings</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-brand-50 flex items-center justify-center">
                <Bell className="h-4 w-4 text-brand-600" />
              </div>
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-lg bg-surface-50">
              <div>
                <p className="text-sm font-semibold text-surface-900">Email Notifications</p>
                <p className="text-xs text-surface-400">Send email for order confirmations</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-10 h-5 bg-surface-300 rounded-full peer peer-checked:bg-brand-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-3.5 rounded-lg bg-surface-50">
              <div>
                <p className="text-sm font-semibold text-surface-900">SMS Notifications</p>
                <p className="text-xs text-surface-400">Send SMS for exam reminders</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-10 h-5 bg-surface-300 rounded-full peer peer-checked:bg-brand-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
              </label>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

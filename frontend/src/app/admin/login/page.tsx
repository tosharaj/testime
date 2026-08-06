'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { supabase } from '@/lib/supabase';
import { ADMIN_EMAIL } from '@/lib/admin';
import { ncertApi, setBackendToken } from '@/lib/ncertApi';
import { Mail, LogIn, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const addr = email.trim().toLowerCase();
    if (addr !== ADMIN_EMAIL.toLowerCase()) {
      setError('Only the administrator email can access the admin panel.');
      return;
    }
    if (!password) { setError('Enter your password.'); return; }
    setLoading(true); setError('');
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: addr, password });
      if (error) throw new Error(error.message);
      if (data.user?.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        await supabase.auth.signOut();
        throw new Error('This account is not authorized to access the admin panel.');
      }
      if (data.session) {
        localStorage.setItem('token', data.session.access_token);
      }
      try {
        const backend = await ncertApi.backendLogin(addr, password);
        setBackendToken(backend.accessToken);
      } catch {
        setBackendToken(null);
      }
      router.push('/admin/dashboard');
    } catch (err: any) {
      const code = err?.code ? ` (${err.code})` : '';
      const msg = err?.message || (typeof err === 'object' ? JSON.stringify(err) : String(err));
      setError(`${msg}${code}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFBFA] px-4 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-100/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-lavender-100/20 blur-3xl" />
      </div>
      <Card className="w-full max-w-md relative animate-fade-in-up shadow-xl shadow-brand-500/5">
        <CardHeader className="text-center pt-8">
          <div className="flex justify-center mb-4">
            <img src="/images/admin_icon.png" alt="Admin" className="h-16 w-16 rounded-2xl object-contain shadow-md" />
          </div>
          <CardTitle className="text-2xl">Admin Sign In</CardTitle>
          <p className="text-sm text-surface-500 mt-1.5">Restricted to administrators only</p>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          {error && (
            <div className="mb-4 p-3.5 text-sm font-medium text-red-600 bg-red-50 rounded-xl border border-red-100">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              id="admin-email"
              label="Admin Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              icon={<Mail className="h-4 w-4" />}
              placeholder="admin@testime.in"
            />
            <div className="relative">
              <Input
                id="admin-password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                icon={<Lock className="h-4 w-4" />}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 bottom-2.5 text-surface-400 hover:text-surface-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
              <LogIn className="h-4 w-4 ml-1.5" />
            </Button>
          </form>
          <Link href="/" className="mt-6 flex items-center justify-center gap-1.5 text-sm text-surface-500 hover:text-brand-600 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to site
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

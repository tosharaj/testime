'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { supabase } from '@/lib/supabase';
import { ADMIN_EMAIL } from '@/lib/admin';
import { Mail, LogIn, ShieldCheck, KeyRound, ArrowLeft } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const addr = email.trim().toLowerCase();
    if (addr !== ADMIN_EMAIL.toLowerCase()) {
      setError('Only the administrator email can access the admin panel.');
      return;
    }
    setLoading(true); setError(''); setNotice('');
    try {
      const { error } = await supabase.auth.signInWithOtp({ email: addr });
      if (error) throw new Error(error.message);
      setStep('otp');
      setTimer(120);
      setNotice(`OTP sent to ${addr}`);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) { setError('Enter the complete 6-digit OTP'); return; }
    setLoading(true); setError(''); setNotice('');
    try {
      const { data, error } = await supabase.auth.verifyOtp({ email: email.trim().toLowerCase(), token: otpString, type: 'email' });
      if (error) throw new Error(error.message);
      if (data.session) {
        localStorage.setItem('token', data.session.access_token);
      }
      const user = data.user;
      if (!user || user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        await supabase.auth.signOut();
        throw new Error('This account is not authorized to access the admin panel.');
      }
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setError(''); setNotice('');
    try {
      const { error } = await supabase.auth.signInWithOtp({ email: email.trim().toLowerCase() });
      if (error) throw new Error(error.message);
      setTimer(120);
      setOtp(['', '', '', '', '', '']);
      setNotice(`OTP resent to ${email.trim().toLowerCase()}`);
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP');
    }
  };

  if (step === 'otp') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFBFA] px-4 py-12">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-100/30 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-lavender-100/20 blur-3xl" />
        </div>
        <Card className="w-full max-w-md relative animate-fade-in-up shadow-xl shadow-brand-500/5">
          <CardHeader className="text-center pt-8">
            <div className="flex justify-center mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl gradient-primary text-white shadow-md">
                <ShieldCheck className="h-6 w-6" />
              </div>
            </div>
            <CardTitle className="text-2xl">Admin OTP Verification</CardTitle>
            <p className="text-sm text-surface-500 mt-1.5">Enter the 6-digit code sent to your email</p>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            {error && (
              <div className="mb-4 p-3.5 text-sm font-medium text-red-600 bg-red-50 rounded-xl border border-red-100">{error}</div>
            )}
            {notice && (
              <div className="mb-4 p-3.5 text-sm font-medium text-green-700 bg-green-50 rounded-xl border border-green-100">{notice}</div>
            )}
            <div className="text-center mb-5">
              <p className="font-semibold text-surface-800">{email.trim().toLowerCase()}</p>
              <button
                type="button"
                onClick={() => setStep('email')}
                className="text-xs text-brand-600 hover:underline mt-1"
              >
                Change email
              </button>
            </div>
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="flex gap-2 justify-center">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-11 h-12 text-center text-lg font-semibold rounded-lg border border-surface-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                  />
                ))}
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify & Sign In'}
                <LogIn className="h-4 w-4 ml-1.5" />
              </Button>
              <p className="text-center text-sm text-surface-500">
                {timer > 0 ? (
                  <>Resend OTP in <span className="font-semibold text-brand-600">{timer}s</span></>
                ) : (
                  <button type="button" onClick={handleResend} className="text-brand-600 hover:underline font-semibold">
                    Resend OTP
                  </button>
                )}
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFBFA] px-4 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-100/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-lavender-100/20 blur-3xl" />
      </div>
      <Card className="w-full max-w-md relative animate-fade-in-up shadow-xl shadow-brand-500/5">
        <CardHeader className="text-center pt-8">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl gradient-primary text-white shadow-md">
              <ShieldCheck className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-2xl">Admin Sign In</CardTitle>
          <p className="text-sm text-surface-500 mt-1.5">Email OTP access for administrators only</p>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          {error && (
            <div className="mb-4 p-3.5 text-sm font-medium text-red-600 bg-red-50 rounded-xl border border-red-100">{error}</div>
          )}
          {notice && (
            <div className="mb-4 p-3.5 text-sm font-medium text-green-700 bg-green-50 rounded-xl border border-green-100">{notice}</div>
          )}
          <form onSubmit={handleSendOtp} className="space-y-5">
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
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sending OTP...' : 'Send OTP'}
              <KeyRound className="h-4 w-4 ml-1.5" />
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

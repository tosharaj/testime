'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { api } from '@/lib/api';
import { LogIn, Mail, Lock, Phone, Eye, EyeOff, MessageSquare, Smartphone, Chrome } from 'lucide-react';

type AuthMethod = 'email' | 'phone' | 'google';

export default function LoginPage() {
  const router = useRouter();
  const [method, setMethod] = useState<AuthMethod>('email');

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 px-4 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-100/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent-100/20 blur-3xl" />
      </div>

      <Card className="w-full max-w-md relative animate-fade-in-up shadow-xl shadow-brand-500/5">
        <CardHeader className="text-center pt-8">
          <div className="flex justify-center mb-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary text-white font-bold shadow-md">
                T
              </div>
            </Link>
          </div>
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <p className="text-sm text-surface-500 mt-1.5">Sign in to continue your preparation</p>
        </CardHeader>

        <div className="px-8">
          <div className="flex rounded-lg bg-surface-100 p-1 mb-6">
            <button
              type="button"
              onClick={() => setMethod('email')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${method === 'email' ? 'bg-white text-brand-700 shadow-sm' : 'text-surface-500 hover:text-surface-700'}`}
            >
              <Mail className="h-4 w-4 inline mr-1.5" />
              Email
            </button>
            <button
              type="button"
              onClick={() => setMethod('phone')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${method === 'phone' ? 'bg-white text-brand-700 shadow-sm' : 'text-surface-500 hover:text-surface-700'}`}
            >
              <Smartphone className="h-4 w-4 inline mr-1.5" />
              Phone
            </button>
            <button
              type="button"
              onClick={() => setMethod('google')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${method === 'google' ? 'bg-white text-brand-700 shadow-sm' : 'text-surface-500 hover:text-surface-700'}`}
            >
              <Chrome className="h-4 w-4 inline mr-1.5" />
              Google
            </button>
          </div>
        </div>

        <CardContent className="px-8 pb-8">
          {method === 'email' && <EmailLogin />}
          {method === 'phone' && <PhoneLogin />}
          {method === 'google' && <GoogleLogin />}

          <p className="mt-6 text-center text-sm text-surface-500">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-brand-600 hover:text-brand-700 font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function EmailLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await api.login(email, password);
      localStorage.setItem('token', res.accessToken);
      localStorage.setItem('user', JSON.stringify(res.user));
      if (res.user.role === 'STUDENT') router.push('/dashboard');
      else router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3.5 text-sm font-medium text-red-600 bg-red-50 rounded-xl border border-red-100">
          {error}
        </div>
      )}
      <Input
        id="email"
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        icon={<Mail className="h-4 w-4" />}
        placeholder="you@example.com"
      />
      <div className="relative">
        <Input
          id="password"
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
  );
}

function PhoneLogin() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [error, setError] = useState('');
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
    setLoading(true); setError('');
    try {
      await api.sendPhoneOtp(phone);
      setStep('otp');
      setTimer(30);
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
    if (otpString.length !== 6) { setError('Enter complete 6-digit OTP'); return; }
    setLoading(true); setError('');
    try {
      const res = await api.verifyPhoneOtp(phone, otpString);
      localStorage.setItem('token', res.accessToken);
      localStorage.setItem('user', JSON.stringify(res.user));
      router.push('/dashboard');
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
    setError('');
    try {
      await api.sendPhoneOtp(phone);
      setTimer(30);
      setOtp(['', '', '', '', '', '']);
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP');
    }
  };

  if (step === 'otp') {
    return (
      <form onSubmit={handleVerifyOtp} className="space-y-5">
        {error && (
          <div className="p-3.5 text-sm font-medium text-red-600 bg-red-50 rounded-xl border border-red-100">
            {error}
          </div>
        )}
        <div className="text-center">
          <p className="text-sm text-surface-500 mb-1">Enter OTP sent to</p>
          <p className="font-semibold text-surface-800">{phone}</p>
          <button
            type="button"
            onClick={() => setStep('phone')}
            className="text-xs text-brand-600 hover:underline mt-1"
          >
            Change number
          </button>
        </div>
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
    );
  }

  return (
    <form onSubmit={handleSendOtp} className="space-y-5">
      {error && (
        <div className="p-3.5 text-sm font-medium text-red-600 bg-red-50 rounded-xl border border-red-100">
          {error}
        </div>
      )}
      <Input
        id="phone"
        label="Mobile Number"
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
        icon={<Smartphone className="h-4 w-4" />}
        placeholder="+91 98765 43210"
      />
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Sending OTP...' : 'Send OTP'}
        <MessageSquare className="h-4 w-4 ml-1.5" />
      </Button>
    </form>
  );
}

function GoogleLogin() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
          callback: handleGoogleResponse,
        });
      }
    };
    return () => { document.body.removeChild(script); };
  }, []);

  const handleGoogleResponse = async (response: any) => {
    setLoading(true); setError('');
    try {
      const res = await api.googleLogin(response.credential);
      localStorage.setItem('token', res.accessToken);
      localStorage.setItem('user', JSON.stringify(res.user));
      if (res.user.role === 'STUDENT') router.push('/dashboard');
      else router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    if (window.google) {
      window.google.accounts.id.prompt();
    } else {
      setError('Google Sign-In is loading. Please try again.');
    }
  };

  return (
    <div className="space-y-5">
      {error && (
        <div className="p-3.5 text-sm font-medium text-red-600 bg-red-50 rounded-xl border border-red-100">
          {error}
        </div>
      )}
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={loading}
        onClick={handleGoogleSignIn}
      >
        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        {loading ? 'Signing in...' : 'Continue with Google'}
      </Button>
    </div>
  );
}

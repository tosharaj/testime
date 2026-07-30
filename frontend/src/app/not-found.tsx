import Link from 'next/link';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center px-4">
        <div className="h-20 w-20 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto mb-6">
          <FileQuestion className="h-10 w-10 text-surface-400" />
        </div>
        <h1 className="text-4xl font-bold text-surface-900 mb-2">404</h1>
        <p className="text-lg text-surface-500 mb-6">Page not found</p>
        <Link href="/" className="inline-flex items-center gap-2 rounded-xl bg-brand-500 text-white px-6 py-2.5 text-sm font-semibold hover:bg-brand-600 transition-colors">Go Home</Link>
      </div>
    </div>
  );
}

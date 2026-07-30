'use client';
import Link from 'next/link';
import { Bell, LogOut, User, ChevronDown, Settings } from 'lucide-react';

export default function AdminHeader() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <header className="h-16 border-b border-surface-200/60 bg-white flex items-center justify-between px-6">
      <div>
        <h1 className="text-lg font-bold text-surface-900">Admin Panel</h1>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative p-2.5 text-surface-400 hover:text-surface-600 rounded-xl hover:bg-surface-100 transition-all">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-red-500 rounded-full ring-2 ring-white" />
        </button>
        <div className="flex items-center gap-3 pl-3 border-l border-surface-200">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white text-sm font-bold shadow-sm">
            A
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-surface-900">Admin</p>
            <p className="text-xs text-surface-400">Administrator</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm text-surface-400 hover:text-red-500 px-3 py-2 rounded-xl hover:bg-red-50 transition-all"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}

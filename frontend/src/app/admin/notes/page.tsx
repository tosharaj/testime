'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminNotesIndex() {
  const router = useRouter();
  useEffect(() => { router.replace('/admin/notes/overview'); }, [router]);
  return null;
}

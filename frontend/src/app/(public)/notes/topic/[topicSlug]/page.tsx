'use client';
import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import TopicContent from '@/components/notes/TopicHub';

function TopicPageContent() {
  const { topicSlug } = useParams<{ topicSlug: string }>();
  return <TopicContent topicSlug={topicSlug} />;
}

export default function TopicPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-surface-400">Loading...</div>}>
      <TopicPageContent />
    </Suspense>
  );
}

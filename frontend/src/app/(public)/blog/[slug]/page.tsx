'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { ArrowLeft, Calendar, Clock, Share2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    api.getBlogPost(slug).then(setPost).catch(console.error);
  }, [slug]);

  if (!post) {
    return (
      <div className="py-24 text-center">
        <div className="h-12 w-12 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-4 animate-pulse-soft">
          <Clock className="h-6 w-6 text-brand-600" />
        </div>
        <p className="text-surface-400 animate-pulse-soft">Loading...</p>
      </div>
    );
  }

  return (
    <div className="py-16 lg:py-24 animate-fade-in">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-surface-400 hover:text-brand-600 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>

        <div className="mb-2">
          {post.tags && post.tags.split(',').slice(0, 2).map((t: string) => (
            <span key={t} className="inline-block bg-brand-50 text-brand-700 text-xs font-semibold px-3 py-1 rounded-lg mr-2">
              {t.trim()}
            </span>
          ))}
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-surface-900 mb-4 leading-tight">
          {post.title}
        </h1>

        {post.publishedAt && (
          <div className="flex items-center gap-4 text-sm text-surface-400 mb-10 pb-6 border-b border-surface-100">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {formatDate(post.publishedAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              5 min read
            </span>
          </div>
        )}

        {post.coverImage && (
          <div className="mb-10 rounded-2xl overflow-hidden shadow-lg">
            <img src={post.coverImage} alt="" className="w-full h-auto" />
          </div>
        )}

        <div className="prose-note bg-white rounded-2xl border border-surface-200/60 p-6 sm:p-10 shadow-sm">
          <div dangerouslySetInnerHTML={{ __html: post.content || '' }} />
        </div>
      </div>
    </div>
  );
}

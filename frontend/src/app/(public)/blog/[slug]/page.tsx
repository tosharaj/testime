'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getBlogPostBySlug, getBlogPosts, BlogPost } from '@/lib/blogStore';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, Calendar, Clock, Share2, Newspaper, User, ArrowRight, ChevronRight } from 'lucide-react';

function readingTime(content: string) {
  const words = content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);

  useEffect(() => {
    const p = getBlogPostBySlug(slug);
    setPost(p || null);
    if (p) {
      setRelated(getBlogPosts().filter(r => r.id !== p.id && (r.category === p.category || r.tags?.split(',').some(t => p.tags?.includes(t)))).slice(0, 3));
    }
  }, [slug]);

  if (!post) {
    return (
      <div className="py-24 text-center">
        <div className="h-16 w-16 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto mb-4">
          <Newspaper className="h-8 w-8 text-surface-300" />
        </div>
        <p className="text-lg font-semibold text-surface-900 mb-2">Post not found</p>
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white animate-fade-in">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 lg:py-10">
        <nav className="flex items-center gap-1.5 text-sm text-surface-400 mb-8">
          <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/blog" className="hover:text-brand-600 transition-colors">Blog</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-surface-600 font-medium truncate max-w-[240px]">{post.title}</span>
        </nav>

        <article className="max-w-3xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-surface-400 hover:text-brand-600 mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> All articles
          </Link>

          <div className="mb-4 flex flex-wrap items-center gap-2">
            {post.tags && post.tags.split(',').slice(0, 3).map(t => (
              <span key={t} className="inline-block bg-brand-50 text-brand-700 text-xs font-semibold px-3 py-1 rounded-full">
                {t.trim()}
              </span>
            ))}
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-surface-900 mb-5 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-surface-400 mb-8 pb-6 border-b border-surface-100">
            <span className="inline-flex items-center gap-1.5">
              <User className="h-4 w-4" /> {post.author || 'Testime Team'}
            </span>
            {post.publishedAt && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" /> {formatDate(post.publishedAt)}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {readingTime(post.content)} min read
            </span>
            <button
              onClick={() => navigator.share?.({ title: post.title, url: window.location.href }).catch(() => {})}
              className="ml-auto inline-flex items-center gap-1.5 text-surface-500 hover:text-brand-600 transition-colors"
            >
              <Share2 className="h-4 w-4" /> Share
            </button>
          </div>

          {post.coverImage ? (
            <div className="mb-8 rounded-3xl overflow-hidden shadow-lg">
              <img src={post.coverImage} alt="" className="w-full h-auto" />
            </div>
          ) : (
            <div className="mb-8 rounded-3xl overflow-hidden shadow-lg bg-gradient-hero border border-surface-200/60 p-10 flex items-center justify-center">
              <Newspaper className="h-20 w-20 text-brand-300" />
            </div>
          )}

          <div className="prose-note bg-white rounded-3xl border border-surface-200/60 p-6 sm:p-10 lg:p-12 shadow-sm">
            <div dangerouslySetInnerHTML={{ __html: post.content || '' }} />
          </div>
        </article>

        {related.length > 0 && (
          <div className="max-w-3xl mx-auto mt-16 pt-8 border-t border-surface-100">
            <h2 className="font-display text-xl font-bold text-surface-900 mb-6">Related Articles</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {related.map(r => (
                <Link key={r.id} href={`/blog/${r.slug}`} className="group">
                  <div className="rounded-2xl border border-surface-200 p-5 hover:shadow-card-hover hover:-translate-y-0.5 transition-all h-full bg-white">
                    <h3 className="font-bold text-surface-900 text-sm leading-snug mb-2 line-clamp-2 group-hover:text-brand-600 transition-colors">
                      {r.title}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 group-hover:gap-1.5 transition-all">
                      Read <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

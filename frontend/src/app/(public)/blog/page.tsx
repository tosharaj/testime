'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { getBlogPosts, blogCategories, BlogPost } from '@/lib/blogStore';
import { formatDate } from '@/lib/utils';
import { Newspaper, Calendar, ArrowRight, Clock, Search, ChevronRight, TrendingUp, Sparkles, BookOpenText } from 'lucide-react';
import CrayonStick from '@/components/ui/CrayonStick';
import { crayon } from '@/lib/crayon';

const categoryColors: Record<string, string> = {
  'Exam Tips': 'bg-brand-50 text-brand-700',
  'Current Affairs': 'bg-ocean-50 text-ocean-700',
  'Study Material': 'bg-mint-50 text-mint-700',
  'Notifications': 'bg-sunny-50 text-sunny-700',
  'Success Stories': 'bg-accent-50 text-accent-700',
};

function readingTime(content: string) {
  const words = content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function CategoryPill({ category }: { category?: string }) {
  if (!category) return null;
  const cls = categoryColors[category] || 'bg-surface-100 text-surface-600';
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${cls}`}>{category}</span>;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activeCat, setActiveCat] = useState('All');
  const [query, setQuery] = useState('');

  useEffect(() => {
    setPosts(getBlogPosts());
  }, []);

  const filtered = useMemo(() => {
    return posts.filter(p => {
      const mCat = activeCat === 'All' || p.category === activeCat;
      const q = query.toLowerCase().trim();
      const mSearch = !q || p.title.toLowerCase().includes(q) || p.excerpt?.toLowerCase().includes(q) || p.tags?.toLowerCase().includes(q);
      return mCat && mSearch;
    });
  }, [posts, activeCat, query]);

  const [featured, ...rest] = filtered;

  return (
    <div className="bg-white animate-fade-in">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 lg:py-10">
        <nav className="flex items-center gap-1.5 text-sm text-surface-400 mb-8">
          <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-surface-600 font-medium">Blog</span>
        </nav>

        {/* Hero */}
        <div className="relative overflow-hidden rounded-4xl bg-[#FFFBFA] border-2 border-surface-200/70 p-8 lg:p-12 mb-10">
          <div
            className="absolute inset-0 opacity-60"
            style={{ backgroundImage: 'radial-gradient(circle, rgba(239,97,80,0.12) 0.6px, transparent 0.6px)', backgroundSize: '22px 22px' }}
          />
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-coral-200/40 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-lavender-200/40 blur-3xl" />
          <div className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 items-end gap-2 lg:flex xl:right-12">
            <CrayonStick c={crayon(5)} height={80} tilt={-8} delay={0} />
            <CrayonStick c={crayon(2)} height={100} tilt={6} delay={0.4} />
            <CrayonStick c={crayon(4)} height={88} tilt={-4} delay={0.8} />
            <CrayonStick c={crayon(3)} height={112} tilt={9} delay={1.2} />
          </div>
          <div className="relative max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-surface-200 bg-white/80 px-3 py-1 text-xs font-bold text-brand-600 mb-5 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Insights &amp; Updates
            </div>
            <h1 className="font-display text-3xl lg:text-5xl font-bold text-surface-900 mb-4 leading-tight">
              Exam Tips, News &amp; <span className="bg-gradient-to-r from-coral-500 via-sunny-500 to-mint-500 bg-clip-text text-transparent">Study Strategies</span>
            </h1>
            <p className="text-surface-500 text-base lg:text-lg leading-relaxed max-w-xl">
              Expert guidance, notifications, and success stories to power your preparation for every Odisha competitive exam.
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {['All', ...blogCategories].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`px-4 py-1.5 rounded-full border-2 text-sm font-semibold transition-all ${
                  activeCat === cat
                    ? 'bg-brand-500 border-transparent text-white shadow-md'
                    : 'border-surface-200 bg-white text-surface-600 hover:border-surface-300 hover:text-surface-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400 pointer-events-none" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full rounded-xl border-2 border-surface-200 bg-white pl-10 pr-4 py-2.5 text-sm text-surface-700 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-300 transition-all"
            />
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="h-16 w-16 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto mb-4">
              <Newspaper className="h-8 w-8 text-surface-300" />
            </div>
            <p className="text-lg font-semibold text-surface-900 mb-2">No posts yet</p>
            <p className="text-sm text-surface-500">Check back soon for new content.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="h-16 w-16 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-surface-300" />
            </div>
            <p className="text-lg font-semibold text-surface-900 mb-2">No matching posts</p>
            <p className="text-sm text-surface-500">Try a different category or search term.</p>
          </div>
        ) : (
          <>
            {featured && (
              <Link href={`/blog/${featured.slug}`} className="group mb-10 block">
                <Card variant="raised" className="overflow-hidden">
                  <div className="grid lg:grid-cols-2">
                    <div className={`relative min-h-[220px] lg:min-h-full overflow-hidden ${featured.coverImage ? '' : 'bg-gradient-brand'}`}>
                      {featured.coverImage ? (
                        <img src={featured.coverImage} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-brand flex items-center justify-center">
                          <Newspaper className="h-16 w-16 text-white/40" />
                        </div>
                      )}
                      <span className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-xs font-bold text-brand-700 shadow-sm">
                        <TrendingUp className="h-3.5 w-3.5" /> Featured
                      </span>
                    </div>
                    <CardContent className="p-6 lg:p-10 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-4">
                        <CategoryPill category={featured.category} />
                        <span className="inline-flex items-center gap-1 text-xs text-surface-400">
                          <Clock className="h-3 w-3" /> {readingTime(featured.content)} min read
                        </span>
                      </div>
                      <h2 className="font-display text-2xl lg:text-3xl font-bold text-surface-900 mb-3 leading-snug group-hover:text-brand-600 transition-colors">
                        {featured.title}
                      </h2>
                      {featured.excerpt && (
                        <p className="text-surface-500 leading-relaxed mb-5 line-clamp-3">{featured.excerpt}</p>
                      )}
                      <div className="flex items-center gap-4">
                        <span className="inline-flex items-center gap-1.5 text-sm text-surface-400">
                          <Calendar className="h-4 w-4" />
                          {featured.publishedAt ? formatDate(featured.publishedAt) : 'Draft'}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 group-hover:gap-2.5 transition-all">
                          Read Article <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </Link>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((post, i) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="card-hover h-full group overflow-hidden">
                    <div className={`h-40 overflow-hidden ${post.coverImage ? '' : 'bg-gradient-mint'}`}>
                      {post.coverImage ? (
                        <img src={post.coverImage} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-brand-100 via-ocean-100 to-accent-100 flex items-center justify-center">
                          <BookOpenText className={`h-10 w-10 ${i % 2 ? 'text-accent-300' : 'text-brand-300'}`} />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <CategoryPill category={post.category} />
                        <span className="inline-flex items-center gap-1 text-xs text-surface-400 ml-auto">
                          <Clock className="h-3 w-3" /> {readingTime(post.content)} min
                        </span>
                      </div>
                      <h2 className="font-bold text-surface-900 mb-2 line-clamp-2 group-hover:text-brand-600 transition-colors leading-snug">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-sm text-surface-500 mb-4 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                      )}
                      <div className="flex items-center justify-between pt-4 border-t border-surface-100">
                        <span className="inline-flex items-center gap-1.5 text-xs text-surface-400">
                          <Calendar className="h-3.5 w-3.5" />
                          {post.publishedAt ? formatDate(post.publishedAt) : 'Draft'}
                        </span>
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 group-hover:gap-2 transition-all">
                          Read <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { Newspaper, Calendar, ArrowRight, Clock, Bookmark } from 'lucide-react';

interface BlogPost {
  id: string; title: string; slug: string; excerpt?: string;
  coverImage?: string; tags?: string; publishedAt: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    api.getBlogPosts().then((res) => setPosts(res.data)).catch(console.error);
  }, []);

  return (
    <div className="py-16 lg:py-24 animate-fade-in">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-2xl border border-brand-200/60 bg-brand-50 px-4 py-1.5 text-sm font-semibold text-brand-700 mb-6">
            <Newspaper className="h-4 w-4" />
            Our Blog
          </div>
          <h1 className="section-heading text-surface-900 mb-4">Exam Tips &amp; Updates</h1>
          <p className="section-subheading">Stay informed with the latest exam strategies, tips, and platform updates</p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="h-16 w-16 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto mb-4">
              <Newspaper className="h-8 w-8 text-surface-300" />
            </div>
            <p className="text-lg font-semibold text-surface-900 mb-2">No posts yet</p>
            <p className="text-sm text-surface-500">Check back soon for new content.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card className="card-hover group">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-5">
                      {post.coverImage && (
                        <div className="hidden sm:block w-24 h-24 rounded-xl overflow-hidden shrink-0">
                          <img src={post.coverImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-bold text-surface-900 mb-2 line-clamp-2 group-hover:text-brand-600 transition-colors">
                          {post.title}
                        </h2>
                        {post.excerpt && (
                          <p className="text-sm text-surface-500 mb-3 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-surface-400">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            {post.publishedAt ? formatDate(post.publishedAt) : 'Draft'}
                          </span>
                          {post.tags && post.tags.split(',').slice(0, 2).map(t => (
                            <span key={t} className="bg-surface-100 text-surface-500 px-2.5 py-0.5 rounded-lg font-medium">
                              {t.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="hidden sm:flex items-center text-surface-300 group-hover:text-brand-400 transition-colors shrink-0">
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

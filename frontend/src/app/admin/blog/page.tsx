'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { getAdminBlogPosts, saveBlogPost, deleteBlogPost, getBlogStoreKey, slugify, blogCategories, BlogPost } from '@/lib/blogStore';
import { formatDate } from '@/lib/utils';
import { Plus, Edit2, Trash2, Eye, Search, Newspaper, CheckCircle2, Loader2, ArrowLeft, Image as ImageIcon, Tag, FileText, Globe } from 'lucide-react';

const emptyForm = {
  title: '',
  category: 'Exam Tips',
  excerpt: '',
  content: '',
  coverImage: '',
  tags: '',
  author: 'Testime Team',
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [publish, setPublish] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<BlogPost | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setPosts(getAdminBlogPosts());
    setLoading(false);
  }, []);

  const refresh = () => setPosts(getAdminBlogPosts());

  const resetForm = () => {
    setForm(emptyForm);
    setPublish(false);
    setEditId(null);
    setEditorOpen(false);
    setSaved(false);
  };

  const openNew = () => {
    resetForm();
    setEditorOpen(true);
  };

  const openEdit = (p: BlogPost) => {
    setForm({
      title: p.title,
      category: p.category || 'Exam Tips',
      excerpt: p.excerpt || '',
      content: p.content || '',
      coverImage: p.coverImage || '',
      tags: p.tags || '',
      author: p.author || 'Testime Team',
    });
    setPublish(p.isPublished);
    setEditId(p.id);
    setEditorOpen(true);
  };

  const handleSave = () => {
    if (!form.title.trim()) return;
    setSaving(true);
    const now = new Date().toISOString();
    if (editId) {
      const existing = posts.find(p => p.id === editId);
      const post: BlogPost = {
        id: editId,
        title: form.title.trim(),
        slug: existing?.slug || `${slugify(form.title)}-${Date.now()}`,
        excerpt: form.excerpt.trim() || undefined,
        content: form.content || '',
        coverImage: form.coverImage.trim() || undefined,
        tags: form.tags.trim() || undefined,
        category: form.category,
        author: form.author.trim() || 'Testime Team',
        isPublished: publish,
        publishedAt: publish ? (existing?.publishedAt || now) : existing?.publishedAt,
        createdAt: existing?.createdAt || now,
      };
      saveBlogPost(post);
    } else {
      const post: BlogPost = {
        id: `p${Date.now()}`,
        title: form.title.trim(),
        slug: `${slugify(form.title)}-${Date.now()}`,
        excerpt: form.excerpt.trim() || undefined,
        content: form.content || '',
        coverImage: form.coverImage.trim() || undefined,
        tags: form.tags.trim() || undefined,
        category: form.category,
        author: form.author.trim() || 'Testime Team',
        isPublished: publish,
        publishedAt: publish ? now : undefined,
        createdAt: now,
      };
      saveBlogPost(post);
    }
    setTimeout(() => {
      setSaving(false);
      refresh();
      resetForm();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }, 400);
  };

  const handleDelete = () => {
    if (!confirmDelete) return;
    deleteBlogPost(confirmDelete.id);
    refresh();
    setConfirmDelete(null);
  };

  const togglePublish = (p: BlogPost) => {
    saveBlogPost({ ...p, isPublished: !p.isPublished, publishedAt: !p.isPublished ? (p.publishedAt || new Date().toISOString()) : p.publishedAt });
    refresh();
  };

  const filtered = posts.filter(p => {
    const q = search.toLowerCase().trim();
    return !q || p.title.toLowerCase().includes(q) || p.tags?.toLowerCase().includes(q);
  });

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 text-brand-500 animate-spin" /><span className="ml-2 text-sm text-surface-400">Loading...</span></div>;
  }

  // Editor view
  if (editorOpen) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <button onClick={resetForm} className="p-2 rounded-xl text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-surface-900">{editId ? 'Edit Post' : 'New Post'}</h1>
            <p className="text-sm text-surface-500 mt-0.5">Write and publish a new blog article</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {editId && (
              <Button variant="outline" size="sm" onClick={() => { togglePublish(posts.find(p => p.id === editId)!); }}>
                <Eye className="h-4 w-4 mr-1" /> {publish ? 'View Draft' : 'View Live'}
              </Button>
            )}
            <Button size="sm" disabled={saving} onClick={handleSave}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              {editId ? 'Update Post' : 'Create Post'}
            </Button>
          </div>
        </div>

        {saved && (
          <div className="mb-6 rounded-xl border border-mint-200 bg-mint-50 px-4 py-3 text-sm font-medium text-mint-700">
            {publish ? 'Post published successfully!' : 'Post saved as draft.'}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <Card>
              <CardContent className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-surface-500 mb-1.5">Title *</label>
                  <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Enter a compelling blog title..." />
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-500 mb-1.5">Excerpt</label>
                  <textarea
                    value={form.excerpt}
                    onChange={e => setForm({ ...form, excerpt: e.target.value })}
                    rows={3}
                    placeholder="Short summary shown on the blog listing..."
                    className="w-full rounded-lg border border-surface-300 px-3 py-2 text-sm text-surface-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition-all"
                  />
                  <p className="text-xs text-surface-400 mt-1">{form.excerpt.length}/200</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-500 mb-1.5">
                    <FileText className="h-3.5 w-3.5 inline mr-1" /> Content *
                  </label>
                  <RichTextEditor value={form.content} onChange={html => setForm({ ...form, content: html })} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-5">
            <Card>
              <CardContent className="p-5 space-y-4">
                <h3 className="font-bold text-surface-900 text-sm">Post Settings</h3>
                <div>
                  <label className="block text-xs font-medium text-surface-500 mb-1.5">Category</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-lg border border-surface-300 px-3 py-2.5 text-sm text-surface-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                  >
                    {blogCategories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-500 mb-1.5">
                    <Tag className="h-3.5 w-3.5 inline mr-1" /> Tags (comma separated)
                  </label>
                  <Input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="OSSC, Strategy, Preparation" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-500 mb-1.5">Author</label>
                  <Input value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} placeholder="Testime Team" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-500 mb-1.5">
                    <Globe className="h-3.5 w-3.5 inline mr-1" /> Cover Image URL
                  </label>
                  <Input value={form.coverImage} onChange={e => setForm({ ...form, coverImage: e.target.value })} placeholder="https://.../image.jpg" />
                </div>
                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={publish}
                      onChange={e => setPublish(e.target.checked)}
                      className="rounded border-surface-300 text-brand-500 focus:ring-brand-500 h-4 w-4"
                    />
                    <span className="text-sm font-medium text-surface-700">Publish immediately</span>
                  </label>
                  <p className="text-xs text-surface-400 mt-1">Uncheck to save as a draft.</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <h3 className="font-bold text-surface-900 text-sm mb-3">Cover Preview</h3>
                {form.coverImage ? (
                  <div className="rounded-xl overflow-hidden">
                    <img src={form.coverImage} alt="Cover preview" className="w-full h-36 object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </div>
                ) : (
                  <div className="rounded-xl bg-gradient-brand h-36 flex items-center justify-center">
                    <ImageIcon className="h-10 w-10 text-white/50" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Blog Posts</h1>
          <p className="text-sm text-surface-500 mt-0.5">Write, edit and publish articles for the public blog</p>
        </div>
        <Button onClick={openNew}>
          <Plus className="h-4 w-4 mr-1" /> New Post
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400 pointer-events-none" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search posts..."
            className="w-full rounded-lg border border-surface-300 pl-9 pr-3 py-2 text-sm text-surface-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30"
          />
        </div>
        <span className="text-sm text-surface-400">{filtered.length} posts</span>
        <span className="ml-auto text-xs text-surface-400 flex items-center gap-1">
          <Globe className="h-3.5 w-3.5" /> Stored locally in this browser
        </span>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-200 bg-surface-50 text-left text-xs font-medium text-surface-400 uppercase tracking-wider">
                  <th className="px-5 py-3">Title</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Published</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} className="border-b border-surface-100 hover:bg-surface-50/50 transition-colors">
                    <td className="px-5 py-4 max-w-md">
                      <p className="font-medium text-surface-900 truncate">{p.title}</p>
                      <p className="text-xs text-surface-400 truncate mt-0.5">{p.excerpt || 'No excerpt'}</p>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant="info" size="sm">{p.category || 'Uncategorized'}</Badge>
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => togglePublish(p)} className="cursor-pointer">
                        <Badge variant={p.isPublished ? 'success' : 'default'} size="sm">{p.isPublished ? 'Published' : 'Draft'}</Badge>
                      </button>
                    </td>
                    <td className="px-5 py-4 text-surface-500 text-xs">{p.publishedAt ? formatDate(p.publishedAt) : '-'}</td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {p.isPublished && (
                          <a href={`/blog/${p.slug}`} target="_blank" rel="noopener noreferrer" className="p-1.5 text-surface-400 hover:text-brand-600 rounded-lg hover:bg-brand-50 transition-colors">
                            <Eye className="h-4 w-4" />
                          </a>
                        )}
                        <button onClick={() => openEdit(p)} className="p-1.5 text-surface-400 hover:text-amber-600 rounded-lg hover:bg-amber-50 transition-colors">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button onClick={() => setConfirmDelete(p)} className="p-1.5 text-surface-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Newspaper className="h-10 w-10 text-surface-300 mx-auto mb-3" />
              <p className="text-surface-500 font-medium">No blog posts found</p>
              <p className="text-xs text-surface-400 mt-1">Click "New Post" to write your first article.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4" onClick={() => setConfirmDelete(null)}>
          <div className="bg-white rounded-xl p-6 max-w-sm mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-surface-900 mb-2">Delete post?</h3>
            <p className="text-sm text-surface-500 mb-5">"{confirmDelete.title}" will be permanently removed from the blog.</p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancel</Button>
              <Button variant="danger" onClick={handleDelete}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

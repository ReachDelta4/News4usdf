import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../../lib/api';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { 
  Plus, Edit, Trash2, Eye, Save, ArrowLeft, Calendar,
  Tag, FileText, GripVertical, Star
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { RichTextEditor } from './RichTextEditor';
import { ImageUploader } from './ImageUploader';

interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  tags: string[];
  content: string;
  summary: string;
  status: 'draft' | 'scheduled' | 'published';
  publishDate: string;
  author: string;
  views: number;
  featuredImage?: string;
  featured: boolean;
}

interface ArticlesPanelProps {
  currentUser: any;
}

export function ArticlesPanel({ currentUser }: ArticlesPanelProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);

  const [view, setView] = useState<'list' | 'editor' | 'featured'>('list');
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  const featuredArticles = articles.filter(a => a.featured);

  useEffect(() => {
    (async () => {
      try {
        const [cats, rows] = await Promise.all([
          api.categories.getAll(),
          api.articles.getAll({ limit: 200 }),
        ]);
        setCategories((cats || []).map((c: any) => ({ id: c.id, name: c.name })));
        const mapped = (rows || []).map((r: any) => ({
          id: String(r.id),
          title: r.title,
          slug: r.slug || '',
          category: r.categories?.name || 'News',
          tags: (r.article_tags || []).map((t: any) => t?.tags?.name).filter(Boolean),
          content: r.content || '',
          summary: r.summary || '',
          status: (r.status || 'draft') as any,
          publishDate: r.publish_date ? new Date(r.publish_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          author: r.users?.name || r.users?.email || currentUser?.name || '',
          views: r.views || 0,
          featuredImage: r.featured_image_url || undefined,
          featured: !!r.featured,
        }));
        setArticles(mapped);
      } catch (e) {
        console.error(e);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const categoriesByName = useMemo(() => {
    const m = new Map<string, number>();
    for (const c of categories) m.set((c.name || '').toLowerCase(), c.id);
    return m;
  }, [categories]);

  const handleCreate = () => {
    setEditingArticle({
      id: '',
      title: '',
      slug: '',
      category: 'Politics',
      tags: [],
      content: '',
      summary: '',
      status: 'draft',
      publishDate: new Date().toISOString().split('T')[0],
      author: currentUser?.name || '',
      views: 0,
      featured: false,
    });
    setIsCreating(true);
    setView('editor');
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setIsCreating(false);
    setView('editor');
  };

  const handleSave = async () => {
    if (!editingArticle) return;
    if (!editingArticle.title || !editingArticle.content) {
      toast.error('Please fill in title and content');
      return;
    }
    const slug = (editingArticle.slug && editingArticle.slug.trim()) || editingArticle.title
      .toLowerCase()
      .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
    const catId = categoriesByName.get((editingArticle.category || 'news').toLowerCase()) || null;
    try {
      if (isCreating) {
        const created = await api.articles.create({
          title: editingArticle.title,
          slug,
          summary: editingArticle.summary,
          content: editingArticle.content,
          category_id: catId as any,
          status: editingArticle.status as any,
          featured: editingArticle.featured,
          featured_image_url: editingArticle.featuredImage as any,
          publish_date: editingArticle.status === 'published' ? new Date().toISOString() : null,
        } as any, editingArticle.tags || []);
        setArticles(prev => [...prev, { ...editingArticle, id: String(created.id), slug }]);
        toast.success('Article created successfully');
      } else {
        const idNum = parseInt(editingArticle.id, 10);
        const updated = await api.articles.update(idNum, {
          title: editingArticle.title,
          slug,
          summary: editingArticle.summary,
          content: editingArticle.content,
          category_id: catId as any,
          status: editingArticle.status as any,
          featured: editingArticle.featured,
          featured_image_url: editingArticle.featuredImage as any,
          publish_date: editingArticle.status === 'published' ? (editingArticle.publishDate ? new Date(editingArticle.publishDate).toISOString() : new Date().toISOString()) : null,
        } as any, editingArticle.tags || []);
        setArticles(prev => prev.map(a => a.id === editingArticle.id ? { ...editingArticle, slug } : a));
        toast.success('Article updated successfully');
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to save article');
    }
    setView('list');
    setEditingArticle(null);
    setIsCreating(false);
  };
      

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this article?')) {
      try {
        await api.articles.delete(parseInt(id, 10));
        setArticles(prev => prev.filter(article => article.id !== id));
        toast.success('Article deleted successfully');
      } catch (e) {
        console.error(e);
        toast.error('Failed to delete article');
      }
    }
  };

  const handleAutoSave = () => {
    // Auto-save draft logic
    if (editingArticle && editingArticle.id) {
      setArticles(prev =>
        prev.map(article =>
          article.id === editingArticle.id ? editingArticle : article
        )
      );
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;

    const newArticles = [...featuredArticles];
    const draggedArticle = newArticles[draggedItem];
    newArticles.splice(draggedItem, 1);
    newArticles.splice(index, 0, draggedArticle);
    
    // Update main articles list
    const updatedArticles = articles.map(a => {
      const featuredIndex = newArticles.findIndex(fa => fa.id === a.id);
      if (featuredIndex !== -1) {
        return newArticles[featuredIndex];
      }
      return a;
    });
    
    setArticles(updatedArticles);
    setDraggedItem(index);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    toast.success('Featured articles reordered');
  };

  const toggleFeatured = async (id: string) => {
    const target = articles.find(a => a.id === id);
    if (!target) return;
    const next = !target.featured;
    setArticles(prev => prev.map(a => a.id === id ? { ...a, featured: next } : a));
    try {
      await api.articles.update(parseInt(id, 10), { featured: next } as any);
    } catch (e) {
      console.error(e);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default:
        return '';
    }
  };

  // Article List View
  if (view === 'list') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Articles Management</h1>
            <p className="text-gray-600 dark:text-gray-300">Create and manage news articles</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setView('featured')}
            >
              <FileText className="w-4 h-4 mr-2" />
              Featured ({featuredArticles.length})
            </Button>
            {(currentUser?.role === 'admin' || currentUser?.role === 'editor') && (
              <Button onClick={handleCreate} className="bg-red-600 hover:bg-red-700">
                <Plus className="w-4 h-4 mr-2" />
                New Article
              </Button>
            )}
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {articles.map((article) => (
                    <tr key={article.id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {article.featured && (
                            <span className="text-yellow-500 text-lg">★</span>
                          )}
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {article.title}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {article.publishDate}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="outline">{article.category}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={getStatusColor(article.status)}>
                          {article.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {article.author}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {article.views.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(article)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleFeatured(article.id)}
                          title={article.featured ? 'Remove from featured' : 'Add to featured'}
                        >
                          <span className={article.featured ? 'text-yellow-500' : 'text-gray-400'}>
                            ★
                          </span>
                        </Button>
                        {(currentUser?.role === 'admin' || currentUser?.role === 'editor') && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(article.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Featured Articles Manager View
  if (view === 'featured') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Featured Articles</h1>
            <p className="text-gray-600 dark:text-gray-300">Manage homepage featured content - Drag to reorder</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setView('list')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to All Articles
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Homepage Featured Section</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {featuredArticles.map((article, index) => (
                <div
                  key={article.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-move"
                >
                  <GripVertical className="w-5 h-5 text-gray-400" />
                  <span className="text-yellow-500 text-lg">★</span>
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {article.category}
                      </Badge>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {article.views.toLocaleString()} views
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(article)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFeatured(article.id)}
                      className="text-red-600"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Article Editor View
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isCreating ? 'Create New Article' : 'Edit Article'}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {isCreating ? 'Write and publish your content' : 'Update existing content'}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setView('list')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-red-600 hover:bg-red-700">
            <Save className="w-4 h-4 mr-2" />
            {isCreating ? 'Publish' : 'Update'}
          </Button>
        </div>
      </div>

      {editingArticle && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Article Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={editingArticle.title}
                    onChange={(e) => setEditingArticle({
                      ...editingArticle,
                      title: e.target.value,
                    })}
                    placeholder="Enter article title"
                  />
                </div>

                <div>
                  <Label htmlFor="slug">URL Slug (auto-generated)</Label>
                  <Input
                    id="slug"
                    value={editingArticle.slug || editingArticle.title.toLowerCase().replace(/\s+/g, '-')}
                    onChange={(e) => setEditingArticle({
                      ...editingArticle,
                      slug: e.target.value,
                    })}
                    placeholder="article-url-slug"
                  />
                </div>

                <div>
                  <Label htmlFor="summary">Summary</Label>
                  <Input
                    id="summary"
                    value={editingArticle.summary}
                    onChange={(e) => setEditingArticle({
                      ...editingArticle,
                      summary: e.target.value,
                    })}
                    placeholder="Brief article summary (for previews)"
                  />
                </div>

                <div>
                  <Label>Article Content</Label>
                  <RichTextEditor
                    value={editingArticle.content}
                    onChange={(content) => setEditingArticle({
                      ...editingArticle,
                      content,
                    })}
                    placeholder="Write your article content here..."
                    onAutoSave={handleAutoSave}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={editingArticle.category}
                    onValueChange={(value) => setEditingArticle({
                      ...editingArticle,
                      category: value,
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={editingArticle.status}
                    onValueChange={(value: any) => setEditingArticle({
                      ...editingArticle,
                      status: value,
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="publishDate">Publish Date</Label>
                  <Input
                    id="publishDate"
                    type="date"
                    value={editingArticle.publishDate}
                    onChange={(e) => setEditingArticle({
                      ...editingArticle,
                      publishDate: e.target.value,
                    })}
                  />
                </div>

                <div>
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    value={editingArticle.tags.join(', ')}
                    onChange={(e) => setEditingArticle({
                      ...editingArticle,
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean),
                    })}
                    placeholder="tag1, tag2, tag3"
                  />
                </div>
              </CardContent>
            </Card>

            <ImageUploader
              onImageSelect={(imageUrl) => setEditingArticle({
                ...editingArticle,
                featuredImage: imageUrl,
              })}
              currentImage={editingArticle.featuredImage}
            />
          </div>
        </div>
      )}
    </div>
  );
}






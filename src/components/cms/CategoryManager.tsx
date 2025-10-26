import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Plus, Edit, Trash2, GripVertical, Star } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  color: string;
  featured: boolean;
  articleCount: number;
  subcategories?: string[];
}

export function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const rows = await api.categories.getAll();
        setCategories((rows || []).map((r: any) => ({
          id: r.id,
          name: r.name,
          slug: r.slug || r.name.toLowerCase().replace(/\s+/g, '-'),
          description: r.description || '',
          color: r.color || '#ef4444',
          featured: !!r.featured,
          articleCount: r.article_count || 0,
        })));
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const handleDragStart = (index: number) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;
    const newCategories = [...categories];
    const draggedCategory = newCategories[draggedItem];
    newCategories.splice(draggedItem, 1);
    newCategories.splice(index, 0, draggedCategory);
    setCategories(newCategories);
    setDraggedItem(index);
  };

  const handleDragEnd = async () => {
    setDraggedItem(null);
    try {
      const orders = categories.map((c, idx) => ({ id: c.id, display_order: idx }));
      await api.categories.updateOrder(orders as any);
      toast.success('Category order updated');
    } catch (e) {
      console.error(e);
      toast.error('Failed to update order');
    }
  };

  const handleSaveCategory = async () => {
    if (!editingCategory) return;
    try {
      if (editingCategory.id) {
        const updated = await api.categories.update(editingCategory.id, {
          name: editingCategory.name,
          description: editingCategory.description,
          color: editingCategory.color,
          featured: editingCategory.featured,
          slug: editingCategory.slug || editingCategory.name.toLowerCase().replace(/\s+/g, '-'),
        } as any);
        setCategories(prev => prev.map(cat => cat.id === editingCategory.id ? { ...editingCategory, id: updated.id } : cat));
        toast.success('Category updated successfully');
      } else {
        const created = await api.categories.create({
          name: editingCategory.name,
          description: editingCategory.description,
          color: editingCategory.color,
          featured: editingCategory.featured,
          slug: editingCategory.name.toLowerCase().replace(/\s+/g, '-'),
        } as any);
        const newCategory: Category = {
          id: created.id,
          name: created.name,
          slug: created.slug,
          description: created.description || '',
          color: created.color || '#ef4444',
          featured: !!created.featured,
          articleCount: created.article_count || 0,
        };
        setCategories(prev => [...prev, newCategory]);
        toast.success('Category created successfully');
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to save category');
    }
    setIsDialogOpen(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = async (id: number) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await api.categories.delete(id);
        setCategories(prev => prev.filter(cat => cat.id !== id));
        toast.success('Category deleted successfully');
      } catch (e) {
        console.error(e);
        toast.error('Failed to delete category');
      }
    }
  };

  const handleToggleFeatured = async (id: number) => {
    const target = categories.find(c => c.id === id);
    if (!target) return;
    const next = !target.featured;
    setCategories(prev => prev.map(cat => cat.id === id ? { ...cat, featured: next } : cat));
    try { await api.categories.update(id, { featured: next } as any); } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Category Manager</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage content categories and subcategories</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingCategory({
                  id: 0,
                  name: '',
                  slug: '',
                  description: '',
                  color: '#ef4444',
                  featured: false,
                  articleCount: 0,
                });
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCategory && editingCategory.id ? 'Edit Category' : 'Add New Category'}
              </DialogTitle>
            </DialogHeader>
            {editingCategory && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Category Name</Label>
                  <Input
                    id="name"
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({
                      ...editingCategory,
                      name: e.target.value,
                    })}
                    placeholder="e.g., Politics"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editingCategory.description}
                    onChange={(e) => setEditingCategory({
                      ...editingCategory,
                      description: e.target.value,
                    })}
                    placeholder="Brief description"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="color">Color Tag</Label>
                  <div className="flex gap-2">
                    <Input
                      id="color"
                      type="color"
                      value={editingCategory.color}
                      onChange={(e) => setEditingCategory({
                        ...editingCategory,
                        color: e.target.value,
                      })}
                      className="w-20 h-10"
                    />
                    <Input
                      value={editingCategory.color}
                      onChange={(e) => setEditingCategory({
                        ...editingCategory,
                        color: e.target.value,
                      })}
                      placeholder="#ef4444"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="featured">Featured in Header Navigation</Label>
                  <Switch
                    id="featured"
                    checked={editingCategory.featured}
                    onCheckedChange={(checked) => setEditingCategory({
                      ...editingCategory,
                      featured: checked,
                    })}
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setEditingCategory(null);
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveCategory}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    Save Category
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {categories.map((category, index) => (
              <div
                key={category.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-move"
              >
                <GripVertical className="w-5 h-5 text-gray-400" />
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {category.name}
                    </h3>
                    {category.featured && (
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {category.description}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {category.articleCount}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">Articles</p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingCategory(category);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleFeatured(category.id)}
                    >
                      {category.featured ? 'Unfeature' : 'Feature'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


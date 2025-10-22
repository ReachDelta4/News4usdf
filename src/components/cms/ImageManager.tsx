import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Upload, Trash2, Edit, Image as ImageIcon, User, 
  Newspaper, Tag, LayoutGrid, Save, X 
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { ImageUploader } from './ImageUploader';

interface ImageItem {
  id: string;
  url: string;
  title: string;
  category: 'leadership' | 'banner' | 'article' | 'category' | 'logo';
  uploadDate: string;
  alt: string;
}

export function ImageManager() {
  const [images, setImages] = useState<ImageItem[]>([
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
      title: 'Dr. B. M. Sivaprasad',
      category: 'leadership',
      uploadDate: '2025-01-15',
      alt: 'CEO & Editor-in-Chief'
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
      title: 'B. T. Vijay Kumar',
      category: 'leadership',
      uploadDate: '2025-01-15',
      alt: 'Andhra Pradesh Head'
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
      title: 'S. Bhavesh',
      category: 'leadership',
      uploadDate: '2025-01-15',
      alt: 'Lead Developer'
    },
    {
      id: '4',
      url: 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=800',
      title: 'Breaking News Banner',
      category: 'banner',
      uploadDate: '2025-01-20',
      alt: 'Homepage Hero Banner'
    },
    {
      id: '5',
      url: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=600',
      title: 'Politics Category Cover',
      category: 'category',
      uploadDate: '2025-01-18',
      alt: 'Politics Section Background'
    },
  ]);

  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', alt: '' });
  const [showUploader, setShowUploader] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<ImageItem['category']>('article');

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this image?')) {
      setImages(images.filter(img => img.id !== id));
      toast.success('Image deleted successfully');
    }
  };

  const handleEdit = (image: ImageItem) => {
    setSelectedImage(image);
    setEditForm({ title: image.title, alt: image.alt });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (selectedImage) {
      setImages(images.map(img => 
        img.id === selectedImage.id 
          ? { ...img, title: editForm.title, alt: editForm.alt }
          : img
      ));
      toast.success('Image updated successfully');
      setIsEditing(false);
      setSelectedImage(null);
    }
  };

  const handleImageUpload = (imageData: { url: string; width: number; height: number }) => {
    const newImage: ImageItem = {
      id: Date.now().toString(),
      url: imageData.url,
      title: `New ${uploadCategory} image`,
      category: uploadCategory,
      uploadDate: new Date().toISOString().split('T')[0],
      alt: `${uploadCategory} image`
    };
    setImages([newImage, ...images]);
    toast.success('Image uploaded successfully');
    setShowUploader(false);
  };

  const filterImagesByCategory = (category: ImageItem['category']) => {
    return images.filter(img => img.category === category);
  };

  const ImageCard = ({ image }: { image: ImageItem }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video bg-gray-100 dark:bg-gray-700 relative">
        <img 
          src={image.url} 
          alt={image.alt}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 flex gap-1">
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
            onClick={() => handleEdit(image)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="h-8 w-8 p-0"
            onClick={() => handleDelete(image.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">
          {image.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 truncate">
          {image.alt}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Uploaded: {new Date(image.uploadDate).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Image Manager</h1>
          <p className="text-gray-600 dark:text-gray-300">Upload and manage all website images</p>
        </div>
        <Button 
          onClick={() => setShowUploader(true)}
          className="bg-red-600 hover:bg-red-700"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Image
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">All</span>
          </TabsTrigger>
          <TabsTrigger value="leadership" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Leadership</span>
          </TabsTrigger>
          <TabsTrigger value="banner" className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Banners</span>
          </TabsTrigger>
          <TabsTrigger value="article" className="flex items-center gap-2">
            <Newspaper className="w-4 h-4" />
            <span className="hidden sm:inline">Articles</span>
          </TabsTrigger>
          <TabsTrigger value="category" className="flex items-center gap-2">
            <Tag className="w-4 h-4" />
            <span className="hidden sm:inline">Categories</span>
          </TabsTrigger>
          <TabsTrigger value="logo" className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Logo</span>
          </TabsTrigger>
        </TabsList>

        {/* All Images */}
        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {images.map(image => (
              <ImageCard key={image.id} image={image} />
            ))}
          </div>
        </TabsContent>

        {/* Leadership Images */}
        <TabsContent value="leadership" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Leadership Profile Images</CardTitle>
              <CardDescription>
                Manage profile photos for leadership team members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filterImagesByCategory('leadership').map(image => (
                  <ImageCard key={image.id} image={image} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Banner Images */}
        <TabsContent value="banner" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Homepage Banners</CardTitle>
              <CardDescription>
                Manage hero section and promotional banners
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filterImagesByCategory('banner').map(image => (
                  <ImageCard key={image.id} image={image} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Article Images */}
        <TabsContent value="article" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Article Thumbnails</CardTitle>
              <CardDescription>
                Manage featured images for articles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filterImagesByCategory('article').map(image => (
                  <ImageCard key={image.id} image={image} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Category Images */}
        <TabsContent value="category" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Category Cover Images</CardTitle>
              <CardDescription>
                Manage background images for category sections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filterImagesByCategory('category').map(image => (
                  <ImageCard key={image.id} image={image} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Logo Management */}
        <TabsContent value="logo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Site Logo</CardTitle>
              <CardDescription>
                Manage NEWS4US brand logo and variations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filterImagesByCategory('logo').map(image => (
                  <ImageCard key={image.id} image={image} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Image Dialog */}
      {isEditing && selectedImage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Edit Image Details</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedImage(null);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                <img 
                  src={selectedImage.url} 
                  alt={selectedImage.alt}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  placeholder="Image title"
                />
              </div>

              <div>
                <Label htmlFor="edit-alt">Alt Text</Label>
                <Input
                  id="edit-alt"
                  value={editForm.alt}
                  onChange={(e) => setEditForm({ ...editForm, alt: e.target.value })}
                  placeholder="Alternative text for accessibility"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleSaveEdit}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedImage(null);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Upload Image Dialog */}
      {showUploader && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Upload New Image</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUploader(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="upload-category">Image Category</Label>
                <select
                  id="upload-category"
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value as ImageItem['category'])}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="leadership">Leadership Profile</option>
                  <option value="banner">Homepage Banner</option>
                  <option value="article">Article Thumbnail</option>
                  <option value="category">Category Cover</option>
                  <option value="logo">Site Logo</option>
                </select>
              </div>

              <ImageUploader onImageUpload={handleImageUpload} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

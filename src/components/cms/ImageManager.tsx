import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Upload, Trash2, Edit, Image as ImageIcon, User, 
  LayoutGrid, Save, X 
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { ImageUploader } from './ImageUploader';
import { api } from '../../lib/api';
import { supabase } from '../../lib/supabase';

interface ImageItem {
  id: string;
  url: string;
  title: string;
  category: 'leadership' | 'banner' | 'article' | 'category' | 'logo';
  uploadDate: string;
  alt: string;
}

export function ImageManager() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', alt: '' });
  const [showUploader, setShowUploader] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<ImageItem['category']>('article');
const [logoUrl, setLogoUrl] = useState<string>('');
const [faviconUrl, setFaviconUrl] = useState<string>('');
const [leaderTeam, setLeaderTeam] = useState<Array<{ name: string; role: string; qualification: string; specialty: string; image: string }>>([
  { name: 'Dr. B. M. Sivaprasad', role: 'CEO & Editor-in-Chief', qualification: 'PhD (Journalism), MJMC, MBA', specialty: 'Journalism Leadership', image: '' },
  { name: 'B. T. Vijay Kumar', role: 'Andhra Pradesh Head', qualification: 'MA', specialty: 'Regional Affairs', image: '' },
  { name: 'S. Bhavesh', role: 'Lead Developer', qualification: 'B.Tech', specialty: 'Technology & Innovation', image: '' },
]);
const [pickerOpen, setPickerOpen] = useState<{ type: 'logo' | 'favicon' | 'leader' | null; index?: number }>({ type: null });

useEffect(() => {
    (async () => {
      try {
        const rows = await api.mediaFiles.getAll();
        let mapped: ImageItem[] = (rows || []).map((r: any) => ({
          id: r.id,
          url: r.file_url,
          title: r.title,
          category: (r.file_type || 'article') as ImageItem['category'],
          uploadDate: r.created_at ? new Date(r.created_at).toISOString().split('T')[0] : '',
          alt: r.alt_text || ''
        }));

        // Fallback: if no rows in media_files, list public files from the 'media' bucket
        if (!mapped.length) {
          const { data: files, error } = await supabase.storage.from('media').list('', { limit: 100 });
          if (!error && Array.isArray(files)) {
            mapped = files
              .filter((f: any) => typeof f?.name === 'string')
              .map((f: any, idx: number) => {
                const name = f.name as string;
                const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(name);
                // naive category inference by filename
                const lower = name.toLowerCase();
                const inferred: ImageItem['category'] = lower.includes('logo')
                  ? 'logo' : lower.includes('banner')
                  ? 'banner' : lower.includes('leader')
                  ? 'leadership' : lower.includes('category')
                  ? 'category' : 'article';
                return {
                  id: `media:${idx}:${name}`,
                  url: publicUrl,
                  title: name,
                  category: inferred,
                  uploadDate: new Date().toISOString().split('T')[0],
                  alt: name,
                } as ImageItem;
              });
          }
        }

        setImages(mapped);
        try {
          const [siteLogo, fav, leaders] = await Promise.all([
            api.settings.get<string>("site_logo_url"),
            api.settings.get<string>("favicon_url"),
            api.settings.get<any[]>("leadership_team"),
          ]);
          if (siteLogo) setLogoUrl(siteLogo);
          if (fav) setFaviconUrl(fav);
          if (Array.isArray(leaders) && leaders.length === 3) setLeaderTeam(leaders);
        } catch {}

        try {
          const [siteLogo, fav, leaders] = await Promise.all([
            api.settings.get<string>('site_logo_url'),
            api.settings.get<string>('favicon_url'),
            api.settings.get<any[]>('leadership_team'),
          ]);
          if (siteLogo) setLogoUrl(siteLogo);
          if (fav) setFaviconUrl(fav);
          if (Array.isArray(leaders) && leaders.length === 3) setLeaderTeam(leaders);
        } catch {}
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this image?')) {
      try {
        await api.mediaFiles.delete(id);
        setImages(prev => prev.filter(img => img.id !== id));
        toast.success('Image deleted successfully');
      } catch (e) {
        console.error(e);
        toast.error('Failed to delete image');
      }
    }
  };

  const handleEdit = (image: ImageItem) => {
    setSelectedImage(image);
    setEditForm({ title: image.title, alt: image.alt });
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedImage) return;
    try {
      await api.mediaFiles.update(selectedImage.id, { title: editForm.title, alt_text: editForm.alt } as any);
      setImages(prev => prev.map(img => img.id === selectedImage.id ? { ...img, title: editForm.title, alt: editForm.alt } : img));
      toast.success('Image updated successfully');
      setIsEditing(false);
      setSelectedImage(null);
    } catch (e) {
      console.error(e);
      toast.error('Failed to update image');
    }
  };

    async function resizeImage(file: File, maxDim = 1600): Promise<File> {
    try {
      const img = document.createElement('img');
      const url = URL.createObjectURL(file);
      await new Promise<void>((resolve, reject) => { img.onload = () => resolve(); img.onerror = reject; img.src = url; });
      const canvas = document.createElement('canvas');
      let w = img.width, h = img.height;
      const scale = Math.min(1, maxDim / Math.max(w, h));
      w = Math.round(w * scale); h = Math.round(h * scale);
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('No ctx');
      ctx.drawImage(img, 0, 0, w, h);
      const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
      const blob: Blob = await new Promise((res) => canvas.toBlob((b)=>res(b as Blob), mime, 0.85));
      URL.revokeObjectURL(url);
      return new File([blob], file.name.replace(/\.(png|jpe?g)$/i, mime === 'image/png' ? '.png' : '.jpg'), { type: mime });
    } catch { return file; }
  }
  const handleFileChosen = async (file: File) => {
    try {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      const resized = await resizeImage(file, 1600);
      const path = `${Date.now()}_${resized.name}`;
      const { publicUrl } = await api.storage.uploadFile('media', path, resized);
      const created = await api.mediaFiles.create({
        title: resized.name,
        alt_text: `${uploadCategory} image`,
        file_url: publicUrl,
        storage_path: path,
        file_type: uploadCategory,
        mime_type: resized.type,
        file_size: resized.size,
      } as any);
      const newImage: ImageItem = {
        id: created.id,
        url: created.file_url,
        title: created.title,
        category: created.file_type as ImageItem['category'],
        uploadDate: created.created_at ? new Date(created.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        alt: created.alt_text || ''
      };
      setImages(prev => [newImage, ...prev]);
      toast.success('Image uploaded successfully');
      setShowUploader(false);
    } catch (e) {
      console.error(e);
      toast.error('Failed to upload image');
    }
  };

  const handleImageUpload = (_imageData: { url: string; width: number; height: number }) => {
    toast.info('Use the Upload Image button to select a file');
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
        <div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f=e.target.files?.[0]; if (f) handleFileChosen(f); }} />
          <Button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-red-600 hover:bg-red-700"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Image
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
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
              <CardTitle>Logo & Favicon</CardTitle>
              <CardDescription>Change the site logo and favicon from here</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Site Logo</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input value={logoUrl} onChange={(e)=>setLogoUrl(e.target.value)} placeholder="https://..." />
                    <Button variant="outline" onClick={()=> setPickerOpen({ type: 'logo' })}>Browse</Button>
                  </div>
                  {logoUrl && <img src={logoUrl} alt="Logo preview" className="h-12 mt-2 object-contain" />}
                </div>
                <div>
                  <Label>Favicon</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input value={faviconUrl} onChange={(e)=>setFaviconUrl(e.target.value)} placeholder="https://..." />
                    <Button variant="outline" onClick={()=> setPickerOpen({ type: 'favicon' })}>Browse</Button>
                  </div>
                  {faviconUrl && <img src={faviconUrl} alt="Favicon preview" className="h-10 mt-2 object-contain" />}
                </div>
              </div>
              <div className="flex justify-end">
                <Button className="bg-red-600 hover:bg-red-700" onClick={async ()=>{ await Promise.all([
                  api.settings.upsert('site_logo_url', logoUrl),
                  api.settings.upsert('favicon_url', faviconUrl),
                ]); toast.success('Brand updated'); }}>Save</Button>
              </div>
              <div>
                <Label>All Logo Images</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                  {filterImagesByCategory('logo').map(image => (
                    <ImageCard key={image.id} image={image} />
                  ))}
                </div>
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
                  
                  <option value="article">Article Thumbnail</option>
                  
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















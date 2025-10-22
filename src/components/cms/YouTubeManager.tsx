import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Plus, Edit, Trash2, GripVertical, Video, Eye } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface YouTubeVideo {
  id: string;
  title: string;
  url: string;
  videoId: string;
  thumbnail: string;
  category: string;
  visible: boolean;
  views: number;
}

export function YouTubeManager() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([
    {
      id: '1',
      title: 'Live: Breaking News Coverage',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      videoId: 'dQw4w9WgXcQ',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      category: 'Politics',
      visible: true,
      views: 12500
    },
    {
      id: '2',
      title: 'Health Tips: Daily Wellness',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      videoId: 'dQw4w9WgXcQ',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      category: 'Health',
      visible: true,
      views: 8900
    },
  ]);

  const [editingVideo, setEditingVideo] = useState<YouTubeVideo | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  const extractVideoId = (url: string): string => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : '';
  };

  const handleDragStart = (index: number) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;

    const newVideos = [...videos];
    const draggedVideo = newVideos[draggedItem];
    newVideos.splice(draggedItem, 1);
    newVideos.splice(index, 0, draggedVideo);
    
    setVideos(newVideos);
    setDraggedItem(index);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    toast.success('Video order updated');
  };

  const handleSave = () => {
    if (!editingVideo) return;

    if (!editingVideo.url) {
      toast.error('Please enter a YouTube URL');
      return;
    }

    const videoId = extractVideoId(editingVideo.url);
    if (!videoId) {
      toast.error('Invalid YouTube URL');
      return;
    }

    const videoWithId = {
      ...editingVideo,
      videoId,
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    };

    if (editingVideo.id) {
      setVideos(prev =>
        prev.map(video => video.id === editingVideo.id ? videoWithId : video)
      );
      toast.success('Video updated successfully');
    } else {
      const newVideo = {
        ...videoWithId,
        id: Date.now().toString(),
        views: 0,
      };
      setVideos(prev => [...prev, newVideo]);
      toast.success('Video added successfully');
    }

    setIsDialogOpen(false);
    setEditingVideo(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this video?')) {
      setVideos(prev => prev.filter(video => video.id !== id));
      toast.success('Video deleted successfully');
    }
  };

  const handleToggleVisibility = (id: string) => {
    setVideos(prev =>
      prev.map(video =>
        video.id === id ? { ...video, visible: !video.visible } : video
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">YouTube Videos</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage embedded video content</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingVideo({
                  id: '',
                  title: '',
                  url: '',
                  videoId: '',
                  thumbnail: '',
                  category: 'Politics',
                  visible: true,
                  views: 0,
                });
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Video Link
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingVideo?.id ? 'Edit Video Link' : 'Add New Video Link'}
              </DialogTitle>
            </DialogHeader>
            {editingVideo && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="url">YouTube URL</Label>
                  <Input
                    id="url"
                    value={editingVideo.url}
                    onChange={(e) => {
                      const url = e.target.value;
                      const videoId = extractVideoId(url);
                      setEditingVideo({
                        ...editingVideo,
                        url,
                        videoId,
                        thumbnail: videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '',
                      });
                    }}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="title">Video Title</Label>
                  <Input
                    id="title"
                    value={editingVideo.title}
                    onChange={(e) => setEditingVideo({
                      ...editingVideo,
                      title: e.target.value,
                    })}
                    placeholder="Enter video title"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={editingVideo.category}
                    onValueChange={(value) => setEditingVideo({
                      ...editingVideo,
                      category: value,
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Politics">Politics</SelectItem>
                      <SelectItem value="Health">Health</SelectItem>
                      <SelectItem value="Sports">Sports</SelectItem>
                      <SelectItem value="Entertainment">Entertainment</SelectItem>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {editingVideo.thumbnail && (
                  <div>
                    <Label>Preview</Label>
                    <div className="relative aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                      <img
                        src={editingVideo.thumbnail}
                        alt="Video thumbnail"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                          <Video className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <Label htmlFor="visible">Show on Website</Label>
                  <Switch
                    id="visible"
                    checked={editingVideo.visible}
                    onCheckedChange={(checked) => setEditingVideo({
                      ...editingVideo,
                      visible: checked,
                    })}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setEditingVideo(null);
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    {editingVideo.id ? 'Update' : 'Add'} Video
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video, index) => (
          <div
            key={video.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className="cursor-move"
          >
            <Card>
              <CardHeader className="p-0">
                <div className="relative aspect-video bg-gray-100 dark:bg-gray-700 rounded-t-lg overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <GripVertical className="w-5 h-5 text-white drop-shadow-lg" />
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge variant={video.visible ? 'default' : 'secondary'}>
                      {video.visible ? 'Visible' : 'Hidden'}
                    </Badge>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-red-600 bg-opacity-90 rounded-full flex items-center justify-center">
                      <Video className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2">
                    {video.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {video.category}
                    </Badge>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {video.views.toLocaleString()} views
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(video.url, '_blank')}
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Watch
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleVisibility(video.id)}
                  >
                    {video.visible ? 'Hide' : 'Show'}
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingVideo(video);
                      setIsDialogOpen(true);
                    }}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(video.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

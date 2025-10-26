import React, { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import {
  Upload, X, RotateCw, Crop, ZoomIn, ZoomOut, Sun, Image as ImageIcon
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { api } from '../../lib/api';

interface ImageUploaderProps {
  onImageSelect: (imageUrl: string) => void;
  currentImage?: string;
}

export function ImageUploader({ onImageSelect, currentImage }: ImageUploaderProps) {
  const [image, setImage] = useState<string | null>(currentImage || null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(100);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      try {
        const path = `${Date.now()}_${file.name}`;
        const { publicUrl } = await api.storage.uploadFile('media', path, file);
        await api.mediaFiles.create({
          title: file.name,
          alt_text: 'article image',
          file_url: publicUrl,
          storage_path: path,
          file_type: 'article',
          mime_type: file.type,
          file_size: file.size,
        } as any);
        setImage(publicUrl);
        onImageSelect(publicUrl);
        toast.success('Image uploaded successfully');
      } catch (err) {
        console.error(err);
        toast.error('Failed to upload image');
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      try {
        const path = `${Date.now()}_${file.name}`;
        const { publicUrl } = await api.storage.uploadFile('media', path, file);
        await api.mediaFiles.create({
          title: file.name,
          alt_text: 'article image',
          file_url: publicUrl,
          storage_path: path,
          file_type: 'article',
          mime_type: file.type,
          file_size: file.size,
        } as any);
        setImage(publicUrl);
        onImageSelect(publicUrl);
        toast.success('Image uploaded successfully');
      } catch (err) {
        console.error(err);
        toast.error('Failed to upload image');
      }
    }
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    setBrightness(100);
    setContrast(100);
    setRotation(0);
    setZoom(100);
  };

  const handleSave = () => {
    if (image) {
      onImageSelect(image);
      toast.success('Image saved successfully');
    }
  };

  const imageStyle = {
    filter: `brightness(${brightness}%) contrast(${contrast}%)`,
    transform: `rotate(${rotation}deg) scale(${zoom / 100})`,
    transition: 'all 0.3s ease',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Image Upload & Editor</span>
          {image && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setImage(null)}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!image ? (
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center cursor-pointer hover:border-red-500 dark:hover:border-red-500 transition-colors"
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              Click to upload or drag and drop
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              PNG, JPG, GIF up to 5MB
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        ) : (
          <>
            {/* Image Preview */}
            <div className="relative bg-gray-100 dark:bg-gray-700 rounded-lg p-4 overflow-hidden">
              <div className="flex items-center justify-center min-h-[300px]">
                <img
                  src={image}
                  alt="Preview"
                  style={imageStyle}
                  className="max-w-full max-h-[400px] object-contain"
                />
              </div>
            </div>

            {/* Editor Controls */}
            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="flex items-center gap-2">
                    <Sun className="w-4 h-4" />
                    Brightness
                  </Label>
                  <span className="text-sm text-gray-600 dark:text-gray-300">{brightness}%</span>
                </div>
                <Slider
                  value={[brightness]}
                  onValueChange={(value) => setBrightness(value[0])}
                  min={0}
                  max={200}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Contrast
                  </Label>
                  <span className="text-sm text-gray-600 dark:text-gray-300">{contrast}%</span>
                </div>
                <Slider
                  value={[contrast]}
                  onValueChange={(value) => setContrast(value[0])}
                  min={0}
                  max={200}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="flex items-center gap-2">
                    <ZoomIn className="w-4 h-4" />
                    Zoom
                  </Label>
                  <span className="text-sm text-gray-600 dark:text-gray-300">{zoom}%</span>
                </div>
                <Slider
                  value={[zoom]}
                  onValueChange={(value) => setZoom(value[0])}
                  min={50}
                  max={200}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRotate}
                  className="flex-1"
                >
                  <RotateCw className="w-4 h-4 mr-2" />
                  Rotate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="flex-1"
                >
                  Reset
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  Apply
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

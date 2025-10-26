import React, { useEffect, useRef, useState } from 'react';
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
import { Upload, FileText, Eye, Trash2, Calendar, Download, Plus } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { api } from '../../lib/api';

interface EPaper {
  id: string;
  title: string;
  description: string;
  date: string;
  fileUrl: string;
  fileName: string;
  fileSize: string;
  visible: boolean;
  downloads: number;
}

export function EPaperManager() {
  const [ePapers, setEPapers] = useState<EPaper[]>([]);

  const [editingPaper, setEditingPaper] = useState<EPaper | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Please select a PDF file');
        return;
      }
      
      if (file.size > 50 * 1024 * 1024) {
        toast.error('File size must be less than 50MB');
        return;
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      toast.success('PDF file selected');
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const rows = await api.ePapers.getAll();
        setEPapers((rows || []).map((r: any) => ({
          id: r.id,
          title: r.title,
          description: r.description || '',
          date: r.publication_date,
          fileUrl: r.file_url,
          fileName: r.file_name,
          fileSize: r.file_size ? `${(r.file_size / (1024 * 1024)).toFixed(1)} MB` : '',
          visible: !!r.visible,
          downloads: r.downloads || 0,
        })));
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const handleSave = async () => {
    if (!editingPaper) return;

    if (!selectedFile && !editingPaper.id) {
      toast.error('Please select a PDF file');
      return;
    }

    try {
      if (editingPaper.id) {
        // update metadata only
        await api.ePapers.update(editingPaper.id, {
          title: editingPaper.title,
          description: editingPaper.description,
          publication_date: editingPaper.date,
          visible: editingPaper.visible,
        } as any);
        setEPapers(prev => prev.map(paper => paper.id === editingPaper.id ? editingPaper : paper));
        toast.success('E-Paper updated successfully');
      } else {
        if (!selectedFile) return;
        if (selectedFile.type !== 'application/pdf') {
          toast.error('Please select a PDF file');
          return;
        }
        const path = `${Date.now()}_${selectedFile.name}`;
        const { publicUrl } = await api.storage.uploadFile('e-papers', path, selectedFile);
        const created = await api.ePapers.create({
          title: editingPaper.title,
          description: editingPaper.description,
          publication_date: editingPaper.date,
          file_url: publicUrl,
          storage_path: path,
          file_name: selectedFile.name,
          file_size: selectedFile.size,
          visible: editingPaper.visible,
        } as any);
        const newPaper: EPaper = {
          id: created.id,
          title: created.title,
          description: created.description || '',
          date: created.publication_date,
          fileUrl: created.file_url,
          fileName: created.file_name,
          fileSize: created.file_size ? `${(created.file_size / (1024 * 1024)).toFixed(1)} MB` : '',
          visible: !!created.visible,
          downloads: created.downloads || 0,
        };
        setEPapers(prev => [...prev, newPaper]);
        toast.success('E-Paper uploaded successfully');
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to save E-Paper');
    }

    setIsDialogOpen(false);
    setEditingPaper(null);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this E-Paper?')) {
      try {
        await api.ePapers.delete(id);
        setEPapers(prev => prev.filter(paper => paper.id !== id));
        toast.success('E-Paper deleted successfully');
      } catch (e) {
        console.error(e);
        toast.error('Failed to delete E-Paper');
      }
    }
  };

  const handleToggleVisibility = async (id: string) => {
    const paper = ePapers.find(p => p.id === id);
    if (!paper) return;
    const next = !paper.visible;
    setEPapers(prev => prev.map(p => p.id === id ? { ...p, visible: next } : p));
    try { await api.ePapers.update(id, { visible: next } as any); } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">E-Paper Management</h1>
          <p className="text-gray-600 dark:text-gray-300">Upload and manage digital newspaper editions</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingPaper({
                  id: '',
                  title: '',
                  description: '',
                  date: new Date().toISOString().split('T')[0],
                  fileUrl: '',
                  fileName: '',
                  fileSize: '',
                  visible: true,
                  downloads: 0,
                });
                setSelectedFile(null);
                setPreviewUrl(null);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Upload E-Paper
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPaper?.id ? 'Edit E-Paper' : 'Upload New E-Paper'}
              </DialogTitle>
            </DialogHeader>
            {editingPaper && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={editingPaper.title}
                    onChange={(e) => setEditingPaper({
                      ...editingPaper,
                      title: e.target.value,
                    })}
                    placeholder="e.g., NEWS4US Daily - January 20, 2025"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editingPaper.description}
                    onChange={(e) => setEditingPaper({
                      ...editingPaper,
                      description: e.target.value,
                    })}
                    placeholder="Brief description of this edition"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="date">Publication Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={editingPaper.date}
                    onChange={(e) => setEditingPaper({
                      ...editingPaper,
                      date: e.target.value,
                    })}
                  />
                </div>

                <div>
                  <Label>Upload PDF File</Label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-red-500 dark:hover:border-red-500 transition-colors"
                  >
                    {selectedFile || editingPaper.fileName ? (
                      <div className="space-y-2">
                        <FileText className="w-12 h-12 text-red-600 mx-auto" />
                        <p className="text-gray-900 dark:text-white font-medium">
                          {selectedFile?.name || editingPaper.fileName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {selectedFile 
                            ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`
                            : editingPaper.fileSize
                          }
                        </p>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-300 mb-2">
                          Click to upload PDF
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          PDF files up to 50MB
                        </p>
                      </>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* PDF Preview */}
                {previewUrl && (
                  <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                    <div className="bg-gray-100 dark:bg-gray-700 p-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Preview</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(previewUrl, '_blank')}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Full View
                      </Button>
                    </div>
                    <iframe
                      src={previewUrl}
                      className="w-full h-96"
                      title="PDF Preview"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <Label htmlFor="visible">Show on Website</Label>
                  <Switch
                    id="visible"
                    checked={editingPaper.visible}
                    onCheckedChange={(checked) => setEditingPaper({
                      ...editingPaper,
                      visible: checked,
                    })}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setEditingPaper(null);
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    {editingPaper.id ? 'Update' : 'Upload'}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ePapers.map((paper) => (
          <Card key={paper.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base">{paper.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {new Date(paper.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Badge variant={paper.visible ? 'default' : 'secondary'}>
                  {paper.visible ? 'Visible' : 'Hidden'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                {paper.description}
              </p>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  {paper.fileSize}
                </div>
                <div className="flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  {paper.downloads}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(paper.fileUrl, '_blank')}
                  className="flex-1"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleVisibility(paper.id)}
                  className="flex-1"
                >
                  {paper.visible ? 'Hide' : 'Show'}
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingPaper(paper);
                    setIsDialogOpen(true);
                  }}
                  className="flex-1"
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(paper.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

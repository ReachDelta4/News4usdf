import React, { useEffect, useMemo, useState } from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../ui/breadcrumb';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Link } from '../Router';
import { Calendar, Download, Eye, FileText, ZoomIn, ZoomOut, RotateCw, Share2 } from 'lucide-react';
import { Sidebar } from '../Sidebar';
import { SocialShare } from '../SocialShare';
import { api } from '../../lib/api';

export function EPaperPage() {
  const [selectedEdition, setSelectedEdition] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [editions, setEditions] = useState<Array<{ id: string; date: string; title: string; thumbnail?: string; pdfUrl: string; size?: string; pages?: number }>>([]);

  useEffect(() => {
    (async () => {
      try {
        const rows = await api.ePapers.getAll(true);
        const mapped = (rows || []).map((r: any) => ({
          id: String(r.id),
          date: r.publication_date ? new Date(r.publication_date).toLocaleDateString() : '',
          title: r.title,
          thumbnail: undefined as string | undefined,
          pdfUrl: r.file_url,
          size: r.file_size ? `${(r.file_size / (1024 * 1024)).toFixed(1)} MB` : undefined,
          pages: undefined,
        }));
        setEditions(mapped);
        if (mapped.length > 0) {
          setSelectedEdition(mapped[0].id);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const selectedEditionData = useMemo(() => editions.find(edition => edition.id === selectedEdition), [editions, selectedEdition]);

  const handleZoomIn = () => setZoom(prev => Math.min(200, prev + 25));
  const handleZoomOut = () => setZoom(prev => Math.max(50, prev - 25));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumbs */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold">E-Paper</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">
          <span className="text-red-600 dark:text-red-400">Digital</span>
          <span className="text-gray-900 dark:text-white"> E-Paper</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Read the complete newspaper in digital format. Access current and archived editions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {selectedEdition ? (
            /* PDF Viewer */
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {selectedEditionData?.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">{selectedEditionData?.date}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <SocialShare 
                    url={`/e-paper/${selectedEdition}`}
                    title={`${selectedEditionData?.title} - NEWS4US E-Paper`}
                    variant="button"
                  />
                  <Button size="sm" variant="outline" onClick={() => { if (selectedEdition) { api.ePapers.incrementDownloads(selectedEdition); } if (selectedEditionData?.pdfUrl) window.open(selectedEditionData.pdfUrl, '_blank'); }}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
              <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                {selectedEditionData?.pdfUrl ? (
                  <iframe
                    src={`${selectedEditionData.pdfUrl}#view=FitH`}
                    title={selectedEditionData.title}
                    className="w-full h-[80vh]"
                  />
                ) : (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    <FileText className="w-12 h-12 mx-auto mb-2" />
                    Unable to load E-Paper. Try downloading instead.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center text-gray-600 dark:text-gray-300">
              No E-Paper available yet.
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  );
}

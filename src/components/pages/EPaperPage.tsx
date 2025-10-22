import React, { useState } from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../ui/breadcrumb';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Link } from '../Router';
import { Calendar, Download, Eye, FileText, ZoomIn, ZoomOut, RotateCw, Share2 } from 'lucide-react';
import { Sidebar } from '../Sidebar';
import { SocialShare } from '../SocialShare';

export function EPaperPage() {
  const [selectedEdition, setSelectedEdition] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  // Mock e-paper editions
  const editions = [
    {
      id: '1',
      date: 'January 20, 2024',
      title: 'Morning Edition',
      thumbnail: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXdzcGFwZXIlMjBmcm9udCUyMHBhZ2V8ZW58MXx8fHwxNzU4MDEwODc2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      pdfUrl: '/sample-newspaper.pdf',
      size: '12.4 MB',
      pages: 24
    },
    {
      id: '2',
      date: 'January 19, 2024',
      title: 'Evening Edition',
      thumbnail: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXdzcGFwZXIlMjBmcm9udCUyMHBhZ2V8ZW58MXx8fHwxNzU4MDEwODc2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      pdfUrl: '/sample-newspaper.pdf',
      size: '11.8 MB',
      pages: 20
    },
    {
      id: '3',
      date: 'January 18, 2024',
      title: 'Morning Edition',
      thumbnail: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXdzcGFwZXIlMjBmcm9udCUyMHBhZ2V8ZW58MXx8fHwxNzU4MDEwODc2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      pdfUrl: '/sample-newspaper.pdf',
      size: '10.9 MB',
      pages: 18
    },
    {
      id: '4',
      date: 'January 17, 2024',
      title: 'Weekend Special',
      thumbnail: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXdzcGFwZXIlMjBmcm9udCUyMHBhZ2V8ZW58MXx8fHwxNzU4MDEwODc2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      pdfUrl: '/sample-newspaper.pdf',
      size: '15.2 MB',
      pages: 32
    }
  ];

  const selectedEditionData = editions.find(edition => edition.id === selectedEdition);

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
          {!selectedEdition ? (
            <>
              {/* Latest Edition Highlight */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Today's Edition</h2>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <img 
                      src={editions[0].thumbnail}
                      alt={editions[0].title}
                      className="w-full rounded-lg shadow-md"
                    />
                  </div>
                  <div className="md:w-2/3">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {editions[0].title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{editions[0].date}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <span className="flex items-center space-x-1">
                        <FileText className="w-4 h-4" />
                        <span>{editions[0].pages} pages</span>
                      </span>
                      <span>{editions[0].size}</span>
                    </div>
                    <div className="flex space-x-3">
                      <Button 
                        onClick={() => setSelectedEdition(editions[0].id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Read Online
                      </Button>
                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* All Editions Grid */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Recent Editions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {editions.map((edition) => (
                    <Card key={edition.id} className="hover:shadow-xl transition-shadow">
                      <CardHeader className="p-4">
                        <img 
                          src={edition.thumbnail}
                          alt={edition.title}
                          className="w-full h-48 object-cover rounded-lg mb-3"
                        />
                        <CardTitle className="text-lg">{edition.title}</CardTitle>
                        <CardDescription className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{edition.date}</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                          <span>{edition.pages} pages</span>
                          <span>{edition.size}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            onClick={() => setSelectedEdition(edition.id)}
                            className="flex-1 bg-red-600 hover:bg-red-700"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Read
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          ) : (
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
                  <Button size="sm" variant="outline" onClick={handleZoomOut}>
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <span className="text-sm font-medium px-2">{zoom}%</span>
                  <Button size="sm" variant="outline" onClick={handleZoomIn}>
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleRotate}>
                    <RotateCw className="w-4 h-4" />
                  </Button>
                  <SocialShare 
                    url={`/e-paper/${selectedEdition}`}
                    title={`${selectedEditionData?.title} - NEWS4US E-Paper`}
                    variant="button"
                  />
                  <Button size="sm" variant="outline" onClick={() => setSelectedEdition(null)}>
                    Back to List
                  </Button>
                </div>
              </div>

              {/* PDF Viewer Placeholder */}
              <div 
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center"
                style={{ 
                  transform: `scale(${zoom/100}) rotate(${rotation}deg)`,
                  transformOrigin: 'center',
                  minHeight: '600px'
                }}
              >
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  PDF Viewer
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  This is a placeholder for the PDF viewer. In a real application, you would integrate a PDF library like react-pdf or pdf.js.
                </p>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
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
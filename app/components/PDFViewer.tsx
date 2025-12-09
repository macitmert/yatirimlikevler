"use client";

import { Document, Page, pdfjs } from 'react-pdf';
import { useState, useEffect } from 'react';

interface PDFViewerProps {
  pdfPath: string;
  startPage?: number;
}

export default function PDFViewer({ pdfPath, startPage = 1 }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [mounted, setMounted] = useState(false);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    // PDF.js worker'ı ayarla - sadece client-side
    if (typeof window !== 'undefined') {
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
    }
    
    setMounted(true);
    // Mobilde scale'i ayarla
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width < 400) setScale(0.4);
      else if (width < 600) setScale(0.5);
      else if (width < 768) setScale(0.6);
      else setScale(1);
    }
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-auto bg-white">
      <div className="flex flex-col items-center py-4">
        <Document
          file={pdfPath}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex items-center justify-center h-screen">
              <p className="text-gray-500">PDF yükleniyor...</p>
            </div>
          }
          error={
            <div className="flex flex-col items-center justify-center h-screen p-4">
              <p className="text-red-500 mb-2">PDF yüklenirken hata oluştu.</p>
              <p className="text-sm text-gray-500">PDF dosyası: {pdfPath}</p>
            </div>
          }
        >
          {startPage && startPage > 0 ? (
            <Page
              pageNumber={startPage}
              scale={scale}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="mb-4 shadow-lg"
            />
          ) : (
            Array.from(new Array(numPages), (el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                scale={scale}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="mb-4 shadow-lg"
              />
            ))
          )}
        </Document>
      </div>
    </div>
  );
}


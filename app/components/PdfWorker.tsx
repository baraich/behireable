"use client";

import { useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

export function PdfWorker() {
  useEffect(() => {
    // Initialize PDF.js worker using CDN
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
  }, []);

  return null;
} 
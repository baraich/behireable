import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export async function convertHtmlToPdf(html: string): Promise<Blob> {
  // Create temporary container
  const container = document.createElement('div');
  container.innerHTML = html;
  container.style.width = '210mm'; // A4 width
  container.style.padding = '0';
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  document.body.appendChild(container);

  try {
    // Convert to canvas
    const canvas = await html2canvas(container, {
      scale: 2, // Higher quality
      useCORS: true,
      logging: false,
      width: 2480, // A4 width at 300 DPI
      height: 3508, // A4 height at 300 DPI
      windowWidth: 2480,
      windowHeight: 3508,
    });

    // Initialize PDF
    const pdf = new jsPDF({
      format: 'a4',
      unit: 'mm',
      orientation: 'portrait',
    });

    // Add image to PDF maintaining aspect ratio
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

    // Get PDF as blob
    return pdf.output('blob');
  } finally {
    // Cleanup
    document.body.removeChild(container);
  }
} 
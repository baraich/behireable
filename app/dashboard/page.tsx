"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, Link as LinkIcon, Loader2, ArrowRight, FileIcon, Building2, MapPin, Users } from "lucide-react";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { PdfWorker } from '@/app/components/PdfWorker';
import * as pdfjsLib from "pdfjs-dist";
import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// Initialize pdfmake with fonts
pdfMake.vfs = pdfFonts.vfs;

interface JobDetails {
  jobTitle: string;
  company: string;
  location: string;
  description: string;
  jobId: string;
  source: string;
  parsed_at: string;
  companyDetails: {
    logo: string;
    description: string;
    url: string;
    followerCount: number;
    staffCount: number;
    industries: string[];
    specialities: string[];
    headquarter: {
      city: string;
      country: string;
      line1: string;
      line2: string | null;
      postalCode: string;
      region: string;
      fullAddress: string;
    };
  };
  jobDetails: {
    type: string;
    workPlace: string;
    workRemoteAllowed: boolean;
    experienceLevel: string;
    functions: string[];
    industries: string[];
    applies: number;
    views: number;
    postedDate: string;
    expiresAt: string;
    salary?: {
      min: number;
      max: number;
      currency: string;
      period: string;
      display: string;
    };
  };
  applyUrl: string;
}

async function extractTextFromPdf(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item: unknown) => (item as {str: string}).str)
        .join(' ');
      fullText += pageText + '\n';
    }

    return fullText.trim();
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

export default function DashboardPage() {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jobUrl, setJobUrl] = useState("");
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
  const [isLoadingJob, setIsLoadingJob] = useState(false);
  const [pdfText, setPdfText] = useState<string | null>(null);
  const [downloadUrl] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      setSelectedFile(acceptedFiles[0]);
      try {
        const text = await extractTextFromPdf(acceptedFiles[0]);
        setPdfText(text);
      } catch (error) {
        toast.error('Failed to read PDF content');
        if (process.env.NODE_ENV === "development") {
          console.log(error);
        }
        setSelectedFile(null);
        setPdfText(null);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  const handleOptimize = async () => {
    if (!selectedFile || !jobDetails || !pdfText) return;
    
    try {
      setIsOptimizing(true);

      const formData = new FormData();
      formData.append('resume', pdfText);
      formData.append('details', JSON.stringify({
        title: jobDetails.jobTitle,
        company: jobDetails.company,
        description: jobDetails.description,
        location: jobDetails.location,
        type: jobDetails.jobDetails.type,
        experienceLevel: jobDetails.jobDetails.experienceLevel,
        workPlace: jobDetails.jobDetails.workPlace,
        industries: jobDetails.jobDetails.industries,
        salary: jobDetails.jobDetails.salary,
        companyDescription: jobDetails.companyDetails.description,
        companyIndustries: jobDetails.companyDetails.industries,
      }));

      const response = await fetch('/api/resumes/optimize', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to optimize resume');
      }

      const data = await response.json();

      // Create temporary container for HTML content
      const container = document.createElement('div');
      container.innerHTML = data.htmlContent;
      container.style.width = '210mm'; // A4 width
      container.style.margin = '0';
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      document.body.appendChild(container);

      try {
        // Convert to canvas
        const canvas = await html2canvas(container, {
          scale: 2, // Higher quality
          useCORS: true,
          logging: false,
          width: 795, // A4 width at 300 DPI
          height: 1120, // A4 height at 300 DPI
          windowWidth: 795,
          windowHeight: 1120,
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
        const pdfBlob = pdf.output('blob');
        const downloadUrl = URL.createObjectURL(pdfBlob);

        // Trigger download
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `${jobDetails.jobTitle.toLowerCase().replace(/\s+/g, '-')}–${jobDetails.company.toLowerCase().replace(/\s+/g, '-')}.pdf`;
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        document.body.removeChild(container);
        URL.revokeObjectURL(downloadUrl);

        toast.success('Resume optimization completed!');
        
        // Reset form
        setSelectedFile(null);
        setJobUrl("");
        setJobDetails(null);
        setPdfText(null);

      } catch (pdfError) {
        console.error('PDF generation error:', pdfError);
        throw new Error('Failed to generate PDF');
      }

    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to optimize resume');
    } finally {
      setIsOptimizing(false);
    }
  };

  const parseJobUrl = async (url: string) => {
    try {
      setIsLoadingJob(true);
      const response = await fetch('/api/jobs/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to parse job details');
      }

      const data = await response.json();
      setJobDetails(data);
      toast.success('Job details loaded successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to parse job details');
      setJobDetails(null);
    } finally {
      setIsLoadingJob(false);
    }
  };

  const handleJobUrlChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setJobUrl(url);
    
    if (!url) {
      setJobDetails(null);
      return;
    }

    if (url.includes('linkedin.com/jobs/view/')) {
      await parseJobUrl(url);
    }
  };

  return (
    <>
      <PdfWorker />
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Upload Section */}
        <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur">
          <CardHeader className="border-b border-zinc-800 pb-8">
            <CardTitle className="text-2xl font-bold text-white">
              Optimize Your Resume
            </CardTitle>
            <p className="text-zinc-400 mt-2">
              Upload your resume and provide the job link to get an AI-optimized version
            </p>
          </CardHeader>
          <CardContent className="pt-8">
            <div className="space-y-8">
              {/* Steps */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center p-4 rounded-lg bg-zinc-800/50">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Upload className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-medium text-white mb-1">1. Upload Resume</h3>
                  <p className="text-sm text-zinc-400">Upload your current resume in PDF format</p>
                </div>
                <div className="flex flex-col items-center text-center p-4 rounded-lg bg-zinc-800/50">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <LinkIcon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-medium text-white mb-1">2. Add Job Link</h3>
                  <p className="text-sm text-zinc-400">Paste the LinkedIn job posting URL</p>
                </div>
                <div className="flex flex-col items-center text-center p-4 rounded-lg bg-zinc-800/50">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <ArrowRight className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-medium text-white mb-1">3. Get Optimized</h3>
                  <p className="text-sm text-zinc-400">Receive your tailored resume instantly</p>
                </div>
              </div>

              {/* Form */}
              <div className="space-y-6 bg-zinc-800/30 p-6 rounded-lg">
                {/* Resume Upload - Drag & Drop */}
                <div className="space-y-2">
                  <Label htmlFor="resume" className="text-white">Upload Resume</Label>
                  <div 
                    {...getRootProps()} 
                    className={`
                      border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer
                      ${isDragActive 
                        ? 'border-primary bg-primary/5' 
                        : 'border-zinc-700 hover:border-primary/50'
                      }
                      ${selectedFile ? 'bg-zinc-800/50' : ''}
                    `}
                  >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center gap-3 text-center">
                      {selectedFile ? (
                        <>
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <FileIcon className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <p className="text-white font-medium">{selectedFile.name}</p>
                            <p className="text-sm text-zinc-400">
                              Click or drag to replace
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
                            <Upload className="w-6 h-6 text-zinc-400" />
                          </div>
                          <div>
                            <p className="text-white font-medium">
                              Drop your resume here or click to browse
                            </p>
                            <p className="text-sm text-zinc-400">
                              Supports PDF files up to 10MB
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Job URL Input - Enhanced */}
                <div className="space-y-2">
                  <Label htmlFor="jobUrl" className="text-white">LinkedIn Job URL</Label>
                  <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 space-y-4">
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-zinc-400">
                        <LinkIcon className="h-4 w-4" />
                      </div>
                      <Input
                        id="jobUrl"
                        type="url"
                        placeholder="https://www.linkedin.com/jobs/view/..."
                        value={jobUrl}
                        onChange={handleJobUrlChange}
                        className="pl-9 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                      />
                    </div>

                    {isLoadingJob && (
                      <div className="flex items-center gap-2 text-zinc-400">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Loading job details...</span>
                      </div>
                    )}

                    {jobDetails && (
                      <div className="border border-zinc-700 rounded-lg p-4 space-y-4">
                        <div className="flex items-start gap-4">
                          {jobDetails.companyDetails.logo && (
                            <img 
                              src={jobDetails.companyDetails.logo} 
                              alt={jobDetails.company}
                              className="w-12 h-12 rounded-lg"
                            />
                          )}
                          <div className="space-y-1 flex-1">
                            <h3 className="text-white font-medium">{jobDetails.jobTitle}</h3>
                            <div className="flex items-center gap-2 text-sm text-zinc-400">
                              <Building2 className="w-4 h-4" />
                              <span>{jobDetails.company}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-zinc-400">
                              <MapPin className="w-4 h-4" />
                              <span>{jobDetails.location}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="space-y-1">
                            <p className="text-zinc-400">Experience Level</p>
                            <p className="text-white">{jobDetails.jobDetails.experienceLevel}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-zinc-400">Work Type</p>
                            <p className="text-white">
                              {jobDetails.jobDetails.type} • {jobDetails.jobDetails.workPlace}
                            </p>
                          </div>
                          {jobDetails.jobDetails.salary && (
                            <div className="col-span-2 space-y-1">
                              <p className="text-zinc-400">Salary</p>
                              <p className="text-white">{jobDetails.jobDetails.salary.display}</p>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-zinc-400">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{jobDetails.jobDetails.applies} applicants</span>
                          </div>
                          <span>•</span>
                          <span>{jobDetails.jobDetails.views} views</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Optimize Button */}
                <Button
                  onClick={handleOptimize}
                  disabled={!selectedFile || !jobDetails || !pdfText || isOptimizing}
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                >
                  {isOptimizing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Optimize Resume
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Download Button */}
        {downloadUrl && (
          <Button
            onClick={() => window.open(downloadUrl, '_blank')}
            className="w-full bg-primary hover:bg-primary/90 text-white mt-4"
          >
            <FileIcon className="mr-2 h-4 w-4" />
            Download Optimized Resume
          </Button>
        )}

        {/* Recent Activity */}
        <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center text-zinc-400">
              <p className="text-lg font-medium mb-2">Coming Soon</p>
              <p className="text-sm">Track your resume optimization history and status</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
} 
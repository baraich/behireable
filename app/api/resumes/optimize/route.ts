import { NextResponse } from "next/server";

interface JobDetails {
  title: string;
  company: string;
  description: string;
  location: string;
  type: string;
  experienceLevel: string;
  workPlace: string;
  industries: string[];
  salary?: {
    min: number;
    max: number;
    currency: string;
    period: string;
    display: string;
  };
  companyDescription: string;
  companyIndustries: string[];
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const resume = formData.get('resume') as string;
    const details = JSON.parse(formData.get('details') as string) as JobDetails;

    if (!resume || !details) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get HTML content from webhook
    const webhookResponse = await fetch('https://hook.us2.make.com/o1jj2ycfiu8omg4lus4i2ff9bbd1pi55', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resume,
        details
      }),
    });

    if (!webhookResponse.ok) {
      throw new Error('Failed to process optimization request');
    }

    const htmlContent = await webhookResponse.text();

    return NextResponse.json({
      success: true,
      htmlContent
    });

  } catch (error) {
    console.error('Error optimizing resume:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to optimize resume',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}

export const runtime = 'edge';
export const dynamic = 'force-dynamic'; 
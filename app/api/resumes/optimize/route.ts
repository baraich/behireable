import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

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
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const resume = formData.get('resume') as string;
    const details = JSON.parse(formData.get('details') as string) as JobDetails;

    if (!resume || !details) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create resume record
    const resumeRecord = await prisma.resume.create({
      data: {
        clerkId: userId,
        originalText: resume,
        jobTitle: details.title,
        company: details.company,
        status: 'processing'
      }
    });

    try {
      // Send webhook request
      const webhookResponse = await fetch('https://hook.us2.make.com/o1jj2ycfiu8omg4lus4i2ff9bbd1pi55', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resume,
          details,
          resumeId: resumeRecord.id
        }),
      });

      if (!webhookResponse.ok) {
        throw new Error('Webhook request failed');
      }

      return NextResponse.json({
        success: true,
        message: 'Optimization request sent successfully',
        resumeId: resumeRecord.id
      });

    } catch (webhookError) {
      console.log((webhookError as Error).message);
      // Delete the resume record if webhook fails
      await prisma.resume.delete({
        where: { id: resumeRecord.id }
      });

      console.error('Webhook error:', webhookError);
      throw new Error('Failed to send optimization request');
    }

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

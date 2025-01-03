import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url || !url.includes('linkedin.com/jobs/view/')) {
      return NextResponse.json(
        { error: 'Invalid LinkedIn job URL' },
        { status: 400 }
      );
    }

    // Extract job ID from URL
    const jobId = url.match(/jobs\/view\/(\d+)/)?.[1];
    if (!jobId) {
      return NextResponse.json(
        { error: 'Invalid LinkedIn job URL format' },
        { status: 400 }
      );
    }

    // Try to get job from database first
    const existingJob = await prisma.jobApplication.findFirst({
      where: {
        id: jobId
      }
    });

    if (existingJob) {
      return NextResponse.json({
        jobTitle: existingJob.jobTitle,
        company: existingJob.company,
        location: existingJob.location,
        description: existingJob.description,
        jobId: existingJob.id,
        source: 'LinkedIn',
        parsed_at: existingJob.createdAt.toISOString(),
        companyDetails: {
          industries: existingJob.industries,
        },
        jobDetails: {
          type: existingJob.type,
          workPlace: existingJob.workPlace,
          industries: existingJob.industries,
        },
      });
    }

    // If not in database, fetch from API
    const encodedUrl = encodeURIComponent(url);
    const rapidApiResponse = await fetch(
      `https://fresh-linkedin-profile-data.p.rapidapi.com/get-job-details?job_url=${encodedUrl}&include_skills=false&include_hiring_team=false`,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': '75e5be8e99msh571281e35077b64p1e36eajsn211a6687ab2b',
          'X-RapidAPI-Host': 'fresh-linkedin-profile-data.p.rapidapi.com',
        },
      }
    );

    if (!rapidApiResponse.ok) {
      throw new Error(`API responded with status: ${rapidApiResponse.status}`);
    }

    const response = await rapidApiResponse.json();
    
    if (!response.data) {
      throw new Error('Invalid API response format');
    }

    const { data } = response;

    // Save to database
    await prisma.jobApplication.create({
      data: {
        id: jobId,
        jobTitle: data.job_title,
        company: data.company_name,
        description: data.job_description,
        location: data.job_location,
        type: data.job_type,
        workPlace: data.remote_allow ? 'Remote' : data.job_location,
        industries: data.industries || [],
      }
    });

    return NextResponse.json({
      jobTitle: data.job_title,
      company: data.company_name,
      location: data.job_location,
      description: data.job_description,
      jobId: data.job_id,
      source: 'LinkedIn',
      parsed_at: new Date().toISOString(),
      companyDetails: {
        logo: data.company_logo_url,
        description: data.company_description,
        url: data.company_linkedin_url,
        followerCount: data.follower_count,
        staffCount: data.employee_count,
        industries: data.industries,
        specialities: data.specialities,
        headquarter: {
          city: data.hq_city,
          country: data.hq_country,
          line1: data.hq_address_line1,
          line2: data.hq_address_line2,
          postalCode: data.hq_postalcode,
          region: data.hq_region,
          fullAddress: data.hq_full_address,
        },
      },
      jobDetails: {
        type: data.job_type,
        workPlace: data.remote_allow ? 'Remote' : data.job_location,
        workRemoteAllowed: data.remote_allow,
        experienceLevel: data.experience_level,
        functions: [],
        industries: data.industries,
        applies: 0,
        views: 0,
        postedDate: new Date().toISOString(),
        expiresAt: new Date().toISOString(),
        salary: data.salary_details ? {
          min: data.salary_details.min_salary,
          max: data.salary_details.max_salary,
          currency: data.salary_details.currency_code,
          period: data.salary_details.pay_period,
          display: data.salary_display,
        } : null,
      },
      applyUrl: data.job_url,
    });

  } catch (error) {
    console.error('Error parsing job:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const statusCode = 
      errorMessage.includes('429') ? 429 :
      errorMessage.includes('403') ? 403 :
      errorMessage.includes('Invalid') ? 400 : 500;

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}

export const dynamic = 'force-dynamic'; 
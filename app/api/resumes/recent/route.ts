import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const recentResumes = await prisma.resume.findMany({
      where: {
        clerkId: userId
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 3
    });

    return NextResponse.json(recentResumes);

  } catch (error) {
    console.error('Error fetching recent resumes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent resumes' },
      { status: 500 }
    );
  }
} 
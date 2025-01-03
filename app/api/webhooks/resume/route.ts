import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    // Verify webhook secret
    const headersList = headers();
    const webhookSecret = (await headersList).get("x-webhook-secret");

    if (!webhookSecret || webhookSecret !== process.env.WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized webhook request" },
        { status: 401 }
      );
    }

    // Get text content
    const textContent = await req.text();

    // Parse the text content
    const [status, resumeId, htmlContent] = textContent.split("..");

    if (!htmlContent || !resumeId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const isResumeValid = await prisma.resume.findUnique({
      where: {
        id: resumeId,
      },
    });

    if (isResumeValid !== null) {
      await prisma.resume.update({
        where: {
          id: resumeId,
        },
        data: {
          optimizedHtml: htmlContent,
          status: "completed",
        },
      });
    }

    return NextResponse.json({
      success: true,
      code: status,
      message: "Resume optimization completed",
    });
  } catch (error) {
    console.log((error as Error).message);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to process webhook",
      },
      { status: 500 }
    );
  }
}

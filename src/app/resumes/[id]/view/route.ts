import { get } from "@vercel/blob";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  const { id } = await params;

  const resume = await prisma.resume.findUnique({
    where: {
      id,
    },
  });

  if (!resume) {
    return new NextResponse("Resume not found", {
      status: 404,
    });
  }

  const result = await get(resume.filePath, {
    access: "private",
  });

  if (!result || !result.stream) {
    return new NextResponse("Resume file not found", {
      status: 404,
    });
  }

  return new NextResponse(result.stream, {
    headers: {
      "Content-Type":
        resume.fileType || "application/octet-stream",

      "Content-Disposition": `inline; filename="${encodeURIComponent(
        resume.fileName
      )}"`,
    },
  });
}
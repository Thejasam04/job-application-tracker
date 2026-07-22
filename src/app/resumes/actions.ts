"use server";

import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

export async function createResume(formData: FormData) {
  const name = formData.get("name")?.toString().trim();
  const description = formData.get("description")?.toString().trim();
  const isDefault = formData.get("isDefault") === "on";
  const file = formData.get("file");

  // Validate resume name
  if (!name) {
    throw new Error("Resume name is required.");
  }

  // Validate uploaded file
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Please select a resume file.");
  }

  // Allowed file types
  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Only PDF and DOCX files are supported.");
  }

  // Maximum file size: 10 MB
  const maxFileSize = 10 * 1024 * 1024;

  if (file.size > maxFileSize) {
    throw new Error("Resume file must be smaller than 10 MB.");
  }

  // Upload resume to private Vercel Blob storage
  const blob = await put(
    `resumes/${Date.now()}-${file.name}`,
    file,
    {
      access: "private",
      addRandomSuffix: true,
    }
  );

  // Remove existing default resume if required
  if (isDefault) {
    await prisma.resume.updateMany({
      where: {
        isDefault: true,
      },
      data: {
        isDefault: false,
      },
    });
  }

  // Save resume details in PostgreSQL
  await prisma.resume.create({
    data: {
      name,
      fileName: file.name,
      filePath: blob.url,
      fileType: file.type,
      fileSize: file.size,
      description: description || null,
      isDefault,
    },
  });

  // Refresh the resumes page
  revalidatePath("/resumes");

  // Redirect back to resumes
  redirect("/resumes");
}
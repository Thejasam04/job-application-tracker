"use server";

import fs from "fs/promises";
import path from "path";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

export async function createResume(formData: FormData) {
  const name = formData.get("name")?.toString().trim();
  const description = formData.get("description")?.toString().trim();
  const isDefault = formData.get("isDefault") === "on";
  const file = formData.get("file");

  if (!name) {
    throw new Error("Resume name is required.");
  }

  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Please select a resume file.");
  }

  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Only PDF and DOCX files are supported.");
  }

  const maxFileSize = 10 * 1024 * 1024;

  if (file.size > maxFileSize) {
    throw new Error("Resume file must be smaller than 10 MB.");
  }

  const uploadDirectory = path.join(
    process.cwd(),
    "public",
    "uploads",
    "resumes"
  );

  await fs.mkdir(uploadDirectory, {
    recursive: true,
  });

  const extension = path.extname(file.name);

  const storedFileName = `${Date.now()}-${crypto.randomUUID()}${extension}`;

  const absoluteFilePath = path.join(
    uploadDirectory,
    storedFileName
  );

  const bytes = await file.arrayBuffer();

  await fs.writeFile(
    absoluteFilePath,
    Buffer.from(bytes)
  );

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

  await prisma.resume.create({
    data: {
      name,
      fileName: file.name,
      filePath: `/uploads/resumes/${storedFileName}`,
      fileType: file.type,
      fileSize: file.size,
      description: description || null,
      isDefault,
    },
  });

  redirect("/resumes");
}
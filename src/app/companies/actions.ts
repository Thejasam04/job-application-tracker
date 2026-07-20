"use server";

import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

function optionalString(value: FormDataEntryValue | null) {
  const stringValue = value?.toString().trim();

  return stringValue ? stringValue : null;
}

export async function updateCompany(
  companyId: string,
  formData: FormData
) {
  const name = formData.get("name")?.toString().trim();

  if (!name) {
    throw new Error("Company name is required.");
  }

  const company = await prisma.company.findUnique({
    where: {
      id: companyId,
    },
  });

  if (!company) {
    throw new Error("Company not found.");
  }

  await prisma.company.update({
    where: {
      id: companyId,
    },

    data: {
      name,
      website: optionalString(formData.get("website")),
      industry: optionalString(formData.get("industry")),
      location: optionalString(formData.get("location")),
      description: optionalString(formData.get("description")),
      contactName: optionalString(formData.get("contactName")),
      contactEmail: optionalString(formData.get("contactEmail")),
      contactPhone: optionalString(formData.get("contactPhone")),
    },
  });

  redirect(`/companies/${companyId}`);
}
"use server";

import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import {
  ApplicationSource,
  ApplicationStatus,
  EmploymentType,
  WorkMode,
} from "@/generated/prisma/client";

function optionalString(value: FormDataEntryValue | null) {
  const text = value?.toString().trim();
  return text || null;
}

/* =========================================================
   CREATE APPLICATION
========================================================= */

export async function createApplication(formData: FormData) {
  const companyName = formData.get("company")?.toString().trim();
  const jobTitle = formData.get("jobTitle")?.toString().trim();

  if (!companyName || !jobTitle) {
    throw new Error("Company and Job Title are required.");
  }

  const status =
    (formData.get("status")?.toString() as ApplicationStatus) ??
    ApplicationStatus.SAVED;

  const workMode = optionalString(formData.get("workMode"));
  const employmentType = optionalString(
    formData.get("employmentType")
  );
  const source = optionalString(formData.get("source"));

  const salaryMin = optionalString(formData.get("salaryMin"));
  const salaryMax = optionalString(formData.get("salaryMax"));

  const appliedAt = optionalString(formData.get("appliedAt"));
  const closingDate = optionalString(formData.get("closingDate"));

  // Get selected resume
  const resumeId = optionalString(formData.get("resumeId"));

  // Find existing company
  let company = await prisma.company.findFirst({
    where: {
      name: {
        equals: companyName,
        mode: "insensitive",
      },
    },
  });

  // Create company if it doesn't exist
  if (!company) {
    company = await prisma.company.create({
      data: {
        name: companyName,
      },
    });
  }

  await prisma.application.create({
    data: {
      jobTitle,
      companyId: company.id,

      jobUrl: optionalString(formData.get("jobUrl")),
      location: optionalString(formData.get("location")),

      // Link resume to application
      resumeId,

      status,

      workMode: workMode
        ? (workMode as WorkMode)
        : null,

      employmentType: employmentType
        ? (employmentType as EmploymentType)
        : null,

      source: source
        ? (source as ApplicationSource)
        : null,

      salaryMin: salaryMin
        ? Number(salaryMin)
        : null,

      salaryMax: salaryMax
        ? Number(salaryMax)
        : null,

      appliedAt: appliedAt
        ? new Date(appliedAt)
        : null,

      closingDate: closingDate
        ? new Date(closingDate)
        : null,

      jobDescription: optionalString(
        formData.get("jobDescription")
      ),

      notes: optionalString(
        formData.get("notes")
      ),

      statusHistory: {
        create: {
          status,
          notes: "Application created",
        },
      },
    },
  });

  redirect("/applications");
}

/* =========================================================
   UPDATE APPLICATION
========================================================= */

export async function updateApplication(
  applicationId: string,
  formData: FormData
) {
  const existingApplication =
    await prisma.application.findUnique({
      where: {
        id: applicationId,
      },
    });

  if (!existingApplication) {
    throw new Error("Application not found.");
  }

  const companyName =
    formData.get("company")?.toString().trim();

  const jobTitle =
    formData.get("jobTitle")?.toString().trim();

  if (!companyName || !jobTitle) {
    throw new Error(
      "Company and Job Title are required."
    );
  }

  const status =
    (formData.get("status")?.toString() as ApplicationStatus) ??
    ApplicationStatus.SAVED;

  const workMode = optionalString(
    formData.get("workMode")
  );

  const employmentType = optionalString(
    formData.get("employmentType")
  );

  const source = optionalString(
    formData.get("source")
  );

  const salaryMin = optionalString(
    formData.get("salaryMin")
  );

  const salaryMax = optionalString(
    formData.get("salaryMax")
  );

  const appliedAt = optionalString(
    formData.get("appliedAt")
  );

  const closingDate = optionalString(
    formData.get("closingDate")
  );

  // Get selected resume
  const resumeId = optionalString(
    formData.get("resumeId")
  );

  // Find company
  let company = await prisma.company.findFirst({
    where: {
      name: {
        equals: companyName,
        mode: "insensitive",
      },
    },
  });

  // Create company if needed
  if (!company) {
    company = await prisma.company.create({
      data: {
        name: companyName,
      },
    });
  }

  await prisma.application.update({
    where: {
      id: applicationId,
    },

    data: {
      jobTitle,

      // Update company relationship
      companyId: company.id,

      jobUrl: optionalString(
        formData.get("jobUrl")
      ),

      location: optionalString(
        formData.get("location")
      ),

      // Update resume relationship
      resumeId,

      status,

      workMode: workMode
        ? (workMode as WorkMode)
        : null,

      employmentType: employmentType
        ? (employmentType as EmploymentType)
        : null,

      source: source
        ? (source as ApplicationSource)
        : null,

      salaryMin: salaryMin
        ? Number(salaryMin)
        : null,

      salaryMax: salaryMax
        ? Number(salaryMax)
        : null,

      appliedAt: appliedAt
        ? new Date(appliedAt)
        : null,

      closingDate: closingDate
        ? new Date(closingDate)
        : null,

      jobDescription: optionalString(
        formData.get("jobDescription")
      ),

      notes: optionalString(
        formData.get("notes")
      ),

      ...(existingApplication.status !== status && {
        statusHistory: {
          create: {
            status,
            notes: `Status changed from ${existingApplication.status} to ${status}`,
          },
        },
      }),
    },
  });

  redirect(`/applications/${applicationId}`);
}

/* =========================================================
   DELETE APPLICATION
========================================================= */

export async function deleteApplication(
  applicationId: string
) {
  const application =
    await prisma.application.findUnique({
      where: {
        id: applicationId,
      },
    });

  if (!application) {
    throw new Error("Application not found.");
  }

  await prisma.application.delete({
    where: {
      id: applicationId,
    },
  });

  redirect("/applications");
}
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { updateApplication } from "@/app/applications/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { prisma } from "@/lib/prisma";

function formatDateForInput(date: Date | null) {
  if (!date) {
    return "";
  }

  return date.toISOString().split("T")[0];
}

export default async function EditApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const application = await prisma.application.findUnique({
    where: {
      id,
    },
    include: {
      company: true,
    },
  });

  if (!application) {
    notFound();
  }

  const resumes = await prisma.resume.findMany({
  orderBy: [
    {
      isDefault: "desc",
    },
    {
      createdAt: "desc",
    },
  ],
});

  const updateApplicationWithId =
    updateApplication.bind(null, application.id);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/applications/${application.id}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>

        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Edit Application
          </h2>

          <p className="text-muted-foreground">
            Update your application for {application.company.name}.
          </p>
        </div>
      </div>

      <form
        action={updateApplicationWithId}
        className="space-y-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>

            <CardDescription>
              Update the position and company information.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company">
                Company *
              </Label>

              <Input
                id="company"
                name="company"
                defaultValue={application.company.name}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobTitle">
                Job Title *
              </Label>

              <Input
                id="jobTitle"
                name="jobTitle"
                defaultValue={application.jobTitle}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">
                Location
              </Label>

              <Input
                id="location"
                name="location"
                defaultValue={application.location ?? ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobUrl">
                Job URL
              </Label>

              <Input
                id="jobUrl"
                name="jobUrl"
                type="url"
                defaultValue={application.jobUrl ?? ""}
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>

              <Select
                name="status"
                defaultValue={application.status}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="SAVED">
                    Saved
                  </SelectItem>

                  <SelectItem value="APPLIED">
                    Applied
                  </SelectItem>

                  <SelectItem value="SCREENING">
                    Screening
                  </SelectItem>

                  <SelectItem value="INTERVIEW">
                    Interview
                  </SelectItem>

                  <SelectItem value="OFFER">
                    Offer
                  </SelectItem>

                  <SelectItem value="REJECTED">
                    Rejected
                  </SelectItem>

                  <SelectItem value="WITHDRAWN">
                    Withdrawn
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Work Mode</Label>

              <Select
                name="workMode"
                defaultValue={
                  application.workMode ?? undefined
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select work mode" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="ONSITE">
                    On-site
                  </SelectItem>

                  <SelectItem value="HYBRID">
                    Hybrid
                  </SelectItem>

                  <SelectItem value="REMOTE">
                    Remote
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Employment Type</Label>

              <Select
                name="employmentType"
                defaultValue={
                  application.employmentType ?? undefined
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select employment type" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="FULL_TIME">
                    Full Time
                  </SelectItem>

                  <SelectItem value="PART_TIME">
                    Part Time
                  </SelectItem>

                  <SelectItem value="CONTRACT">
                    Contract
                  </SelectItem>

                  <SelectItem value="INTERNSHIP">
                    Internship
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Source</Label>

              <Select
                name="source"
                defaultValue={
                  application.source ?? undefined
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="LINKEDIN">
                    LinkedIn
                  </SelectItem>

                  <SelectItem value="NAUKRI">
                    Naukri
                  </SelectItem>

                  <SelectItem value="INDEED">
                    Indeed
                  </SelectItem>

                  <SelectItem value="COMPANY_WEBSITE">
                    Company Website
                  </SelectItem>

                  <SelectItem value="REFERRAL">
                    Referral
                  </SelectItem>

                  <SelectItem value="OTHER">
                    Other
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Application Details
            </CardTitle>

            <CardDescription>
              Update salary and important dates.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="salaryMin">
                Minimum Salary
              </Label>

              <Input
                id="salaryMin"
                name="salaryMin"
                type="number"
                defaultValue={
                  application.salaryMin ?? ""
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="salaryMax">
                Maximum Salary
              </Label>

              <Input
                id="salaryMax"
                name="salaryMax"
                type="number"
                defaultValue={
                  application.salaryMax ?? ""
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="appliedAt">
                Applied Date
              </Label>

              <Input
                id="appliedAt"
                name="appliedAt"
                type="date"
                defaultValue={formatDateForInput(
                  application.appliedAt
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="closingDate">
                Closing Date
              </Label>

              <Input
                id="closingDate"
                name="closingDate"
                type="date"
                defaultValue={formatDateForInput(
                  application.closingDate
                )}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
  <Label htmlFor="resumeId">
    Resume Used
  </Label>

  {resumes.length > 0 ? (
    <select
      id="resumeId"
      name="resumeId"
      defaultValue={application.resumeId ?? ""}
      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none"
    >
      <option value="">
        No resume selected
      </option>

      {resumes.map((resume) => (
        <option
          key={resume.id}
          value={resume.id}
        >
          {resume.name}
          {resume.isDefault ? " — Default" : ""}
        </option>
      ))}
    </select>
  ) : (
    <p className="text-sm text-muted-foreground">
      No resumes have been added yet.
    </p>
  )}
</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Additional Information
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="jobDescription">
                Job Description
              </Label>

              <Textarea
                id="jobDescription"
                name="jobDescription"
                rows={8}
                defaultValue={
                  application.jobDescription ?? ""
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">
                Notes
              </Label>

              <Textarea
                id="notes"
                name="notes"
                rows={4}
                defaultValue={
                  application.notes ?? ""
                }
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Link href={`/applications/${application.id}`}>
            <Button
              variant="outline"
              type="button"
            >
              Cancel
            </Button>
          </Link>

          <Button type="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
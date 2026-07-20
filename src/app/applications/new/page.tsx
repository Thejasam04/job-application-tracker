import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { createApplication } from "@/app/applications/actions";
import { prisma } from "@/lib/prisma";

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

export default async function NewApplicationPage() {
  // Load all resumes from the database
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

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link href="/applications">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>

        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Add Application
          </h2>

          <p className="text-muted-foreground">
            Add a new job application to your tracker.
          </p>
        </div>
      </div>

      <form action={createApplication} className="space-y-6">
        {/* Job Details */}
        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>

            <CardDescription>
              Enter the basic information about the position.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-6 md:grid-cols-2">
            {/* Company */}
            <div className="space-y-2">
              <Label htmlFor="company">Company *</Label>

              <Input
                id="company"
                name="company"
                placeholder="e.g. Amazon"
                required
              />
            </div>

            {/* Job Title */}
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title *</Label>

              <Input
                id="jobTitle"
                name="jobTitle"
                placeholder="e.g. Cloud Support Engineer"
                required
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>

              <Input
                id="location"
                name="location"
                placeholder="e.g. Bengaluru"
              />
            </div>

            {/* Job URL */}
            <div className="space-y-2">
              <Label htmlFor="jobUrl">Job URL</Label>

              <Input
                id="jobUrl"
                name="jobUrl"
                type="url"
                placeholder="https://..."
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>Status</Label>

              <Select name="status" defaultValue="SAVED">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="SAVED">Saved</SelectItem>
                  <SelectItem value="APPLIED">Applied</SelectItem>
                  <SelectItem value="SCREENING">Screening</SelectItem>
                  <SelectItem value="INTERVIEW">Interview</SelectItem>
                  <SelectItem value="OFFER">Offer</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="WITHDRAWN">Withdrawn</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Work Mode */}
            <div className="space-y-2">
              <Label>Work Mode</Label>

              <Select name="workMode">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select work mode" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="ONSITE">On-site</SelectItem>
                  <SelectItem value="HYBRID">Hybrid</SelectItem>
                  <SelectItem value="REMOTE">Remote</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Employment Type */}
            <div className="space-y-2">
              <Label>Employment Type</Label>

              <Select name="employmentType">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select employment type" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="FULL_TIME">Full Time</SelectItem>
                  <SelectItem value="PART_TIME">Part Time</SelectItem>
                  <SelectItem value="CONTRACT">Contract</SelectItem>
                  <SelectItem value="INTERNSHIP">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Source */}
            <div className="space-y-2">
              <Label>Source</Label>

              <Select name="source">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Where did you find this job?" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="LINKEDIN">LinkedIn</SelectItem>
                  <SelectItem value="NAUKRI">Naukri</SelectItem>
                  <SelectItem value="INDEED">Indeed</SelectItem>

                  <SelectItem value="COMPANY_WEBSITE">
                    Company Website
                  </SelectItem>

                  <SelectItem value="REFERRAL">Referral</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Application Details */}
        <Card>
          <CardHeader>
            <CardTitle>Application Details</CardTitle>

            <CardDescription>
              Track salary, resume and important dates.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-6 md:grid-cols-2">
            {/* Minimum Salary */}
            <div className="space-y-2">
              <Label htmlFor="salaryMin">Minimum Salary</Label>

              <Input
                id="salaryMin"
                name="salaryMin"
                type="number"
                placeholder="500000"
              />
            </div>

            {/* Maximum Salary */}
            <div className="space-y-2">
              <Label htmlFor="salaryMax">Maximum Salary</Label>

              <Input
                id="salaryMax"
                name="salaryMax"
                type="number"
                placeholder="800000"
              />
            </div>

            {/* Applied Date */}
            <div className="space-y-2">
              <Label htmlFor="appliedAt">Applied Date</Label>

              <Input
                id="appliedAt"
                name="appliedAt"
                type="date"
              />
            </div>

            {/* Closing Date */}
            <div className="space-y-2">
              <Label htmlFor="closingDate">Closing Date</Label>

              <Input
                id="closingDate"
                name="closingDate"
                type="date"
              />
            </div>

{/* Resume */}
<div className="space-y-2 md:col-span-2">
  <Label>Resume Used</Label>

  {resumes.length > 0 ? (
    <select
      name="resumeId"
      defaultValue=""
      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none"
    >
      <option value="">Select the resume used</option>

      {resumes.map((resume) => (
        <option key={resume.id} value={resume.id}>
          {resume.name}
          {resume.isDefault ? " — Default" : ""}
        </option>
      ))}
    </select>
  ) : (
    <div className="rounded-md border p-4">
      <p className="text-sm text-muted-foreground">
        You haven't added any resumes yet.
      </p>

      <Link
        href="/resumes"
        className="mt-2 inline-block text-sm font-medium underline"
      >
        Add a resume
      </Link>
    </div>
  )}
</div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Job Description */}
            <div className="space-y-2">
              <Label htmlFor="jobDescription">
                Job Description
              </Label>

              <Textarea
                id="jobDescription"
                name="jobDescription"
                placeholder="Paste the job description here..."
                rows={8}
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>

              <Textarea
                id="notes"
                name="notes"
                placeholder="Add any notes about this application..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end gap-3">
          <Link href="/applications">
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>

          <Button type="submit">
            Save Application
          </Button>
        </div>
      </form>
    </div>
  );
}
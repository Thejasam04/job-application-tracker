import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Calendar,
  ExternalLink,
  FileText,
  MapPin,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ResumeDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatStatus(status: string) {
  return status
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default async function ResumeDetailsPage({
  params,
}: ResumeDetailsPageProps) {
  const { id } = await params;

  const resume = await prisma.resume.findUnique({
    where: {
      id,
    },
    include: {
      applications: {
        include: {
          company: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!resume) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link href="/resumes">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>

          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
            <FileText className="h-6 w-6" />
          </div>

          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold tracking-tight">
                {resume.name}
              </h2>

              {resume.isDefault && <Badge>Default</Badge>}
            </div>

            <p className="mt-1 text-muted-foreground">
              {resume.fileName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
  <Badge variant="secondary">
    {resume.applications.length}{" "}
    {resume.applications.length === 1
      ? "application"
      : "applications"}
  </Badge>

  <a
    href={resume.filePath}
    target="_blank"
    rel="noopener noreferrer"
  >
    <Button variant="outline">
      <ExternalLink className="mr-2 h-4 w-4" />
      View Resume
    </Button>
  </a>
</div>
      </div>

      {/* Resume Information */}
      <Card>
        <CardHeader>
          <CardTitle>Resume Information</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-8 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">
              Resume Name
            </p>

            <p className="mt-1 font-medium">
              {resume.name}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              File Name
            </p>

            <p className="mt-1 font-medium">
              {resume.fileName}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              File Type
            </p>

            <p className="mt-1 font-medium">
              {resume.fileType || "—"}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Added Date
            </p>

            <div className="mt-1 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />

              <span>
                {resume.createdAt.toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          {resume.description && (
            <div className="md:col-span-2">
              <p className="text-sm text-muted-foreground">
                Description
              </p>

              <p className="mt-1">
                {resume.description}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Applications */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BriefcaseBusiness className="h-5 w-5" />
              Applications
            </CardTitle>

            <Badge variant="secondary">
              {resume.applications.length}
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          {resume.applications.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center text-center">
              <BriefcaseBusiness className="mb-4 h-12 w-12 text-muted-foreground" />

              <h3 className="font-semibold">
                No applications using this resume
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Applications linked to this resume will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {resume.applications.map((application) => (
                <div
                  key={application.id}
                  className="flex items-center justify-between gap-4 py-4"
                >
                  <div className="space-y-1">
                    <Link
                      href={`/applications/${application.id}`}
                      className="font-semibold hover:underline"
                    >
                      {application.jobTitle}
                    </Link>

                    <p className="text-sm text-muted-foreground">
                      {application.company.name}
                    </p>

                    {application.location && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />

                        {application.location}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant="outline">
                      {formatStatus(application.status)}
                    </Badge>

                    <Link
                      href={`/applications/${application.id}`}
                    >
                      <Button
                        variant="outline"
                        size="icon"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
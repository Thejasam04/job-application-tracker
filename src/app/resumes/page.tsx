import Link from "next/link";
import {
  BriefcaseBusiness,
  FileText,
  Plus,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

// Always fetch the latest resume data from the database
export const dynamic = "force-dynamic";
export const revalidate = 0;

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function ResumesPage() {
  // Fetch all resumes from PostgreSQL
  const resumes = await prisma.resume.findMany({
    include: {
      applications: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Resumes
          </h2>

          <p className="text-muted-foreground">
            Manage resume versions and track which one you used for each
            application.
          </p>
        </div>

        <Link href="/resumes/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Resume
          </Button>
        </Link>
      </div>

      {/* Empty State */}
      {resumes.length === 0 ? (
        <Card>
          <CardContent className="flex min-h-80 flex-col items-center justify-center text-center">
            <FileText className="mb-4 h-12 w-12 text-muted-foreground" />

            <h3 className="text-lg font-semibold">
              No resumes yet
            </h3>

            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Add your resume versions here so you can track exactly which
              resume was used for every job application.
            </p>

            <Link href="/resumes/new" className="mt-5">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Resume
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        /* Resume Cards */
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {resumes.map((resume) => (
            <Card key={resume.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <FileText className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <CardTitle className="truncate text-lg">
                        <Link
                          href={`/resumes/${resume.id}`}
                          className="hover:underline"
                        >
                          {resume.name}
                        </Link>
                      </CardTitle>

                      <p className="mt-1 text-sm text-muted-foreground">
                        Added {formatDate(resume.createdAt)}
                      </p>
                    </div>
                  </div>

                  <Badge variant="secondary">
                    {resume.applications.length}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex items-center gap-2 text-sm">
                  <BriefcaseBusiness className="h-4 w-4 text-muted-foreground" />

                  <span>
                    Used in {resume.applications.length}{" "}
                    {resume.applications.length === 1
                      ? "application"
                      : "applications"}
                  </span>
                </div>

                {resume.isDefault && (
                  <Badge className="mt-4">
                    Default Resume
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
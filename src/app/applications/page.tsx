import Link from "next/link";
import {
  BriefcaseBusiness,
  ExternalLink,
  MapPin,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/prisma";

function formatStatus(status: string) {
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDate(date: Date | null) {
  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

const statuses = [
  "ALL",
  "SAVED",
  "APPLIED",
  "SCREENING",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
  "WITHDRAWN",
];

type ApplicationsPageProps = {
  searchParams: Promise<{
    search?: string;
    status?: string;
  }>;
};

export default async function ApplicationsPage({
  searchParams,
}: ApplicationsPageProps) {
  const params = await searchParams;

  const search = params.search?.trim() ?? "";
  const status = params.status?.trim() ?? "ALL";

  const applications = await prisma.application.findMany({
    where: {
      AND: [
        search
          ? {
              OR: [
                {
                  jobTitle: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  company: {
                    name: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                },
                {
                  location: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {},
        status !== "ALL"
          ? {
              status: status as
                | "SAVED"
                | "APPLIED"
                | "SCREENING"
                | "INTERVIEW"
                | "OFFER"
                | "REJECTED"
                | "WITHDRAWN",
            }
          : {},
      ],
    },

    include: {
      company: true,
      resume: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  function getStatusUrl(selectedStatus: string) {
    const params = new URLSearchParams();

    if (search) {
      params.set("search", search);
    }

    if (selectedStatus !== "ALL") {
      params.set("status", selectedStatus);
    }

    const query = params.toString();

    return query
      ? `/applications?${query}`
      : "/applications";
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Applications
          </h2>

          <p className="text-muted-foreground">
            Manage and track all your job applications.
          </p>
        </div>

        <Link href="/applications/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Application
          </Button>
        </Link>
      </div>

      {/* Status Filters */}

      <div className="flex flex-wrap gap-2">
        {statuses.map((statusOption) => {
          const isActive = status === statusOption;

          return (
            <Link
              key={statusOption}
              href={getStatusUrl(statusOption)}
            >
              <Button
                variant={isActive ? "default" : "outline"}
                size="sm"
              >
                {formatStatus(statusOption)}
              </Button>
            </Link>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {status === "ALL"
              ? "All Applications"
              : `${formatStatus(status)} Applications`}{" "}
            ({applications.length})
          </CardTitle>
        </CardHeader>

        <CardContent>
          {applications.length === 0 ? (
            <div className="flex min-h-80 flex-col items-center justify-center text-center">
              <BriefcaseBusiness className="mb-4 h-12 w-12 text-muted-foreground" />

              <h3 className="text-lg font-semibold">
                No applications found
              </h3>

              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                {search || status !== "ALL"
                  ? "No applications match your current search or filter."
                  : "Start tracking your job search by adding your first application."}
              </p>

              {(search || status !== "ALL") && (
                <Link
                  href="/applications"
                  className="mt-6"
                >
                  <Button variant="outline">
                    Clear Filters
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Position</TableHead>

                    <TableHead>Company</TableHead>

                    <TableHead>Status</TableHead>

                    <TableHead>Location</TableHead>

                    <TableHead>Applied Date</TableHead>

                    <TableHead>Resume</TableHead>

                    <TableHead className="text-right">
                      Job
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {applications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell>
                        <div>
                          <Link
                            href={`/applications/${application.id}`}
                            className="font-medium hover:underline"
                          >
                            {application.jobTitle}
                          </Link>

                          {application.workMode && (
                            <p className="text-xs text-muted-foreground">
                              {formatStatus(
                                application.workMode
                              )}
                            </p>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="font-medium">
                        {application.company.name}
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline">
                          {formatStatus(
                            application.status
                          )}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        {application.location ? (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />

                            <span>
                              {application.location}
                            </span>
                          </div>
                        ) : (
                          "—"
                        )}
                      </TableCell>

                      <TableCell>
                        {formatDate(
                          application.appliedAt
                        )}
                      </TableCell>

                      <TableCell>
                        {application.resume?.name ?? "—"}
                      </TableCell>

                      <TableCell className="text-right">
                        {application.jobUrl ? (
                          <a
                            href={application.jobUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </a>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
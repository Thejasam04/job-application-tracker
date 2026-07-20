import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteApplication } from "@/app/applications/actions";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  ExternalLink,
  MapPin,
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

function formatValue(value: string | null) {
  if (!value) return "—";

  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDate(date: Date | null) {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatSalary(
  minimum: number | null,
  maximum: number | null,
  currency: string
) {
  if (!minimum && !maximum) return "—";

  const formatter = new Intl.NumberFormat("en-IN");

  if (minimum && maximum) {
    return `${currency} ${formatter.format(minimum)} - ${formatter.format(
      maximum
    )}`;
  }

  if (minimum) {
    return `${currency} ${formatter.format(minimum)}+`;
  }

  return `Up to ${currency} ${formatter.format(maximum!)}`;
}

export default async function ApplicationDetailsPage({
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
      resume: true,
      statusHistory: {
        orderBy: {
          changedAt: "desc",
        },
      },
    },
  });

  if (!application) {
    notFound();
  }
  const deleteApplicationWithId = deleteApplication.bind(
  null,
  application.id
);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link href="/applications">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>

          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {application.jobTitle}
            </h2>

            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                {application.company.name}
              </span>

              {application.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {application.location}
                </span>
              )}
            </div>
          </div>
        </div>

        <Badge variant="outline" className="text-sm">
          {formatValue(application.status)}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Application Details</CardTitle>
          </CardHeader>

          <CardContent className="grid gap-6 md:grid-cols-2">
            <DetailItem
              label="Status"
              value={formatValue(application.status)}
            />

            <DetailItem
              label="Work Mode"
              value={formatValue(application.workMode)}
            />

            <DetailItem
              label="Employment Type"
              value={formatValue(application.employmentType)}
            />

            <DetailItem
              label="Source"
              value={formatValue(application.source)}
            />

            <DetailItem
              label="Salary"
              value={formatSalary(
                application.salaryMin,
                application.salaryMax,
                application.currency
              )}
            />

            <DetailItem
              label="Resume Used"
              value={application.resume?.name ?? "—"}
            />

            <DetailItem
              label="Applied Date"
              value={formatDate(application.appliedAt)}
            />

            <DetailItem
              label="Closing Date"
              value={formatDate(application.closingDate)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {application.jobUrl ? (
              <a
                href={application.jobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button variant="outline" className="w-full">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Job Posting
                </Button>
              </a>
            ) : (
              <Button variant="outline" className="w-full" disabled>
                No Job URL
              </Button>
            )}

            <Link
              href={`/applications/${application.id}/edit`}
              className="block"
            >
              <Button className="w-full">
                Edit Application
              </Button>

            </Link>
            <form action={deleteApplicationWithId}>
  <Button
    type="submit"
    variant="destructive"
    className="w-full"
  >
    Delete Application
  </Button>
</form>
          </CardContent>
        </Card>
      </div>

      {application.jobDescription && (
        <Card>
          <CardHeader>
            <CardTitle>Job Description</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="whitespace-pre-wrap text-sm leading-7">
              {application.jobDescription}
            </p>
          </CardContent>
        </Card>
      )}

      {application.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="whitespace-pre-wrap text-sm leading-7">
              {application.notes}
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Status History
          </CardTitle>
        </CardHeader>

        <CardContent>
          {application.statusHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No status history available.
            </p>
          ) : (
            <div className="space-y-4">
              {application.statusHistory.map((history) => (
                <div
                  key={history.id}
                  className="flex items-start justify-between gap-4 border-b pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <Badge variant="outline">
                      {formatValue(history.status)}
                    </Badge>

                    {history.notes && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {history.notes}
                      </p>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {formatDate(history.changedAt)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 font-medium">
        {value}
      </p>
    </div>
  );
}
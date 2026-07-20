import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
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

function formatStatus(status: string) {
  return status
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
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

export default async function CompanyDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const company = await prisma.company.findUnique({
    where: {
      id,
    },
    include: {
      applications: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!company) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link href="/companies">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>

        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
              <Building2 className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                {company.name}
              </h2>

              {company.industry && (
                <p className="text-muted-foreground">
                  {company.industry}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
  <Badge variant="secondary">
    {company.applications.length}{" "}
    {company.applications.length === 1
      ? "application"
      : "applications"}
  </Badge>

  <Link href={`/companies/${company.id}/edit`}>
    <Button variant="outline">
      Edit Company
    </Button>
  </Link>
</div>
      </div>

      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="mb-1 text-sm text-muted-foreground">
              Industry
            </p>
            <p>{company.industry || "—"}</p>
          </div>

          <div>
            <p className="mb-1 text-sm text-muted-foreground">
              Location
            </p>

            {company.location ? (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{company.location}</span>
              </div>
            ) : (
              <p>—</p>
            )}
          </div>

          <div>
            <p className="mb-1 text-sm text-muted-foreground">
              Website
            </p>

            {company.website ? (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:underline"
              >
                {company.website}
                <ExternalLink className="h-4 w-4" />
              </a>
            ) : (
              <p>—</p>
            )}
          </div>

          <div>
            <p className="mb-1 text-sm text-muted-foreground">
              Contact Person
            </p>
            <p>{company.contactName || "—"}</p>
          </div>

          <div>
            <p className="mb-1 text-sm text-muted-foreground">
              Contact Email
            </p>

            {company.contactEmail ? (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{company.contactEmail}</span>
              </div>
            ) : (
              <p>—</p>
            )}
          </div>

          <div>
            <p className="mb-1 text-sm text-muted-foreground">
              Contact Phone
            </p>

            {company.contactPhone ? (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{company.contactPhone}</span>
              </div>
            ) : (
              <p>—</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      {company.description && (
        <Card>
          <CardHeader>
            <CardTitle>About Company</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="whitespace-pre-wrap">
              {company.description}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Applications */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BriefcaseBusiness className="h-5 w-5" />
              Applications
            </CardTitle>

            <Badge variant="secondary">
              {company.applications.length}
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          {company.applications.length === 0 ? (
            <div className="flex min-h-48 flex-col items-center justify-center text-center">
              <BriefcaseBusiness className="mb-3 h-10 w-10 text-muted-foreground" />

              <h3 className="font-semibold">
                No applications for this company
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Applications associated with this company will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {company.applications.map((application) => (
                <Link
                  key={application.id}
                  href={`/applications/${application.id}`}
                  className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">
                      {application.jobTitle}
                    </p>

                    <div className="mt-1 flex flex-wrap gap-3 text-sm text-muted-foreground">
                      {application.location && (
                        <span>{application.location}</span>
                      )}

                      <span>
                        Applied: {formatDate(application.appliedAt)}
                      </span>
                    </div>
                  </div>

                  <Badge variant="outline">
                    {formatStatus(application.status)}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
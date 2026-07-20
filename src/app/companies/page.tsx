import Link from "next/link";
import {
  Building2,
  BriefcaseBusiness,
  Globe,
  MapPin,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export default async function CompaniesPage() {
  const companies = await prisma.company.findMany({
    include: {
      applications: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Companies
        </h2>

        <p className="text-muted-foreground">
          View companies and the applications associated with them.
        </p>
      </div>

      {companies.length === 0 ? (
        <Card>
          <CardContent className="flex min-h-80 flex-col items-center justify-center text-center">
            <Building2 className="mb-4 h-12 w-12 text-muted-foreground" />

            <h3 className="text-lg font-semibold">
              No companies yet
            </h3>

            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Companies will automatically appear here when you add job
              applications.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {companies.map((company) => (
            <Link
              key={company.id}
              href={`/companies/${company.id}`}
              className="block"
            >
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <Building2 className="h-5 w-5" />
                      </div>

                      <div>
                        <CardTitle className="text-lg">
                          {company.name}
                        </CardTitle>

                        {company.industry && (
                          <p className="mt-1 text-sm text-muted-foreground">
                            {company.industry}
                          </p>
                        )}
                      </div>
                    </div>

                    <Badge variant="secondary">
                      {company.applications.length}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {company.location && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {company.location}
                    </div>
                  )}

                  {company.website && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Globe className="h-4 w-4" />
                      Website available
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm">
                    <BriefcaseBusiness className="h-4 w-4 text-muted-foreground" />

                    <span>
                      {company.applications.length}{" "}
                      {company.applications.length === 1
                        ? "application"
                        : "applications"}
                    </span>
                  </div>

                  {company.applications.length > 0 && (
                    <div className="border-t pt-4">
                      <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">
                        Latest Application
                      </p>

                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate text-sm font-medium">
                          {company.applications[0].jobTitle}
                        </p>

                        <Badge variant="outline">
                          {company.applications[0].status
                            .toLowerCase()
                            .replace("_", " ")}
                        </Badge>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
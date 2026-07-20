import {
  BriefcaseBusiness,
  CalendarCheck,
  CircleCheckBig,
  CircleX,
  TrendingUp,
  Bookmark,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default async function AnalyticsPage() {
  const applications = await prisma.application.findMany({
    select: {
      status: true,
      source: true,
      createdAt: true,
      appliedAt: true,
      statusHistory: {
        select: {
          status: true,
        },
      },
    },
  });

  const totalApplications = applications.length;

  // Current application statuses
  const saved = applications.filter(
    (application) => application.status === "SAVED"
  ).length;

  const applied = applications.filter(
    (application) => application.status === "APPLIED"
  ).length;

  const screening = applications.filter(
    (application) => application.status === "SCREENING"
  ).length;

  const currentInterviews = applications.filter(
    (application) => application.status === "INTERVIEW"
  ).length;

  const currentOffers = applications.filter(
    (application) => application.status === "OFFER"
  ).length;

  const rejected = applications.filter(
    (application) => application.status === "REJECTED"
  ).length;

  const withdrawn = applications.filter(
    (application) => application.status === "WITHDRAWN"
  ).length;

  // Applications that have ever reached Interview
  const applicationsWithInterview = applications.filter(
    (application) =>
      application.status === "INTERVIEW" ||
      application.status === "OFFER" ||
      application.statusHistory.some(
        (history) => history.status === "INTERVIEW"
      )
  ).length;

  // Applications that have ever reached Offer
  const applicationsWithOffer = applications.filter(
    (application) =>
      application.status === "OFFER" ||
      application.statusHistory.some(
        (history) => history.status === "OFFER"
      )
  ).length;

  // Historical conversion rates
  const interviewRate =
    totalApplications > 0
      ? Math.round(
          (applicationsWithInterview / totalApplications) * 100
        )
      : 0;

  const offerRate =
    totalApplications > 0
      ? Math.round(
          (applicationsWithOffer / totalApplications) * 100
        )
      : 0;

  // Current status distribution
  const statusData = [
    { name: "Saved", value: saved },
    { name: "Applied", value: applied },
    { name: "Screening", value: screening },
    { name: "Interview", value: currentInterviews },
    { name: "Offer", value: currentOffers },
    { name: "Rejected", value: rejected },
    { name: "Withdrawn", value: withdrawn },
  ];

  // Application source distribution
  const sourceCounts = applications.reduce<Record<string, number>>(
    (counts, application) => {
      const source = application.source || "UNKNOWN";

      counts[source] = (counts[source] || 0) + 1;

      return counts;
    },
    {}
  );

  const sourceData = Object.entries(sourceCounts)
    .map(([name, value]) => ({
      name: formatLabel(name),
      value,
    }))
    .sort((a, b) => b.value - a.value);

  const maxStatusValue = Math.max(
    ...statusData.map((item) => item.value),
    1
  );

  const maxSourceValue = Math.max(
    ...sourceData.map((item) => item.value),
    1
  );

  const stats = [
    {
      title: "Total Applications",
      value: totalApplications,
      description: "Applications tracked",
      icon: BriefcaseBusiness,
    },
    {
      title: "Interviews",
      value: applicationsWithInterview,
      description: `${interviewRate}% interview rate`,
      icon: CalendarCheck,
    },
    {
      title: "Offers",
      value: applicationsWithOffer,
      description: `${offerRate}% offer rate`,
      icon: CircleCheckBig,
    },
    {
      title: "Rejected",
      value: rejected,
      description: "Applications rejected",
      icon: CircleX,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Analytics
        </h2>

        <p className="text-muted-foreground">
          Understand your job search performance and application progress.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      {stat.title}
                    </p>

                    <p className="mt-4 text-3xl font-bold">
                      {stat.value}
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {stat.description}
                    </p>
                  </div>

                  <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Status and Sources */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Application Status
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            {statusData.map((status) => {
              const percentage =
                totalApplications > 0
                  ? Math.round(
                      (status.value / totalApplications) * 100
                    )
                  : 0;

              const barWidth =
                (status.value / maxStatusValue) * 100;

              return (
                <div key={status.name}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {status.name}
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {percentage}%
                      </span>

                      <Badge variant="secondary">
                        {status.value}
                      </Badge>
                    </div>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-foreground transition-all"
                      style={{
                        width: `${barWidth}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Source Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bookmark className="h-5 w-5" />
              Application Sources
            </CardTitle>
          </CardHeader>

          <CardContent>
            {sourceData.length === 0 ? (
              <div className="flex min-h-64 flex-col items-center justify-center text-center">
                <Bookmark className="mb-4 h-10 w-10 text-muted-foreground" />

                <p className="font-semibold">
                  No source data yet
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Application sources will appear here as you add jobs.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {sourceData.map((source) => {
                  const percentage =
                    totalApplications > 0
                      ? Math.round(
                          (source.value / totalApplications) * 100
                        )
                      : 0;

                  const barWidth =
                    (source.value / maxSourceValue) * 100;

                  return (
                    <div key={source.name}>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {source.name}
                        </span>

                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {percentage}%
                          </span>

                          <Badge variant="secondary">
                            {source.value}
                          </Badge>
                        </div>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-foreground transition-all"
                          style={{
                            width: `${barWidth}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Job Search Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Job Search Summary</CardTitle>
        </CardHeader>

        <CardContent>
          {totalApplications === 0 ? (
            <p className="text-muted-foreground">
              Start adding job applications to see your job search insights.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Active Applications
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {applied + screening + currentInterviews}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Interview Rate
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {interviewRate}%
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Offer Rate
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {offerRate}%
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Applications Saved
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {saved}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
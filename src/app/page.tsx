import Link from "next/link";
import {
  BriefcaseBusiness,
  CalendarCheck,
  CircleCheckBig,
  CircleX,
  TrendingUp,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
export const dynamic = "force-dynamic";
export default async function DashboardPage() {
  const applications = await prisma.application.findMany({
    include: {
      company: true,
      statusHistory: {
        select: {
          status: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalApplications = applications.length;

  // Current stages
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

  // Historical milestones
  const applicationsWithInterview = applications.filter(
    (application) =>
      application.status === "INTERVIEW" ||
      application.status === "OFFER" ||
      application.statusHistory.some(
        (history) => history.status === "INTERVIEW"
      )
  ).length;

  const applicationsWithOffer = applications.filter(
    (application) =>
      application.status === "OFFER" ||
      application.statusHistory.some(
        (history) => history.status === "OFFER"
      )
  ).length;

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
      description: "Applications that reached interview",
      icon: CalendarCheck,
    },
    {
      title: "Offers",
      value: applicationsWithOffer,
      description: "Offers received",
      icon: CircleCheckBig,
    },
    {
      title: "Rejected",
      value: rejected,
      description: "Currently rejected",
      icon: CircleX,
    },
  ];

  const pipeline = [
    {
      name: "Applied",
      value: applied,
    },
    {
      name: "Screening",
      value: screening,
    },
    {
      name: "Interview",
      value: currentInterviews,
    },
    {
      name: "Offer",
      value: currentOffers,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Welcome back
        </h2>

        <p className="text-muted-foreground">
          Here&apos;s an overview of your job search progress.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>

                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>

              <CardContent>
                <div className="text-3xl font-bold">
                  {stat.value}
                </div>

                <p className="mt-1 text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pipeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Application Pipeline
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            {pipeline.map((stage) => {
              const percentage =
                totalApplications > 0
                  ? (stage.value / totalApplications) * 100
                  : 0;

              return (
                <div key={stage.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{stage.name}</span>

                    <span className="font-semibold">
                      {stage.value}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Recent Applications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Applications</CardTitle>

            <Badge variant="secondary">
              {totalApplications}{" "}
              {totalApplications === 1
                ? "application"
                : "applications"}
            </Badge>
          </CardHeader>

          <CardContent>
            {applications.length === 0 ? (
              <div className="flex min-h-52 flex-col items-center justify-center text-center">
                <BriefcaseBusiness className="mb-4 h-10 w-10 text-muted-foreground" />

                <h3 className="font-semibold">
                  No applications yet
                </h3>

                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Add your first job application and it will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.slice(0, 5).map((application) => (
                  <Link
                    key={application.id}
                    href={`/applications/${application.id}`}
                    className="block"
                  >
                    <div className="flex items-center justify-between gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50">
                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {application.jobTitle}
                        </p>

                        <p className="truncate text-sm text-muted-foreground">
                          {application.company.name}
                          {application.location
                            ? ` • ${application.location}`
                            : ""}
                        </p>
                      </div>

                      <Badge variant="outline">
                        {formatStatus(application.status)}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
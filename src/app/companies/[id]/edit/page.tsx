import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { updateCompany } from "@/app/companies/actions";
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
import { Textarea } from "@/components/ui/textarea";
import { prisma } from "@/lib/prisma";

export default async function EditCompanyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const company = await prisma.company.findUnique({
    where: {
      id,
    },
  });

  if (!company) {
    notFound();
  }

  const updateCompanyWithId = updateCompany.bind(
    null,
    company.id
  );

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/companies/${company.id}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>

        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Edit Company
          </h2>

          <p className="text-muted-foreground">
            Update information about {company.name}.
          </p>
        </div>
      </div>

      <form
        action={updateCompanyWithId}
        className="space-y-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>

            <CardDescription>
              Add the basic details about this company.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">
                Company Name *
              </Label>

              <Input
                id="name"
                name="name"
                defaultValue={company.name}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">
                Industry
              </Label>

              <Input
                id="industry"
                name="industry"
                placeholder="e.g. Information Technology"
                defaultValue={company.industry ?? ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">
                Website
              </Label>

              <Input
                id="website"
                name="website"
                type="url"
                placeholder="https://example.com"
                defaultValue={company.website ?? ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">
                Location
              </Label>

              <Input
                id="location"
                name="location"
                placeholder="e.g. Bengaluru"
                defaultValue={company.location ?? ""}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>

            <CardDescription>
              Store recruiter or hiring contact details.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contactName">
                Contact Person
              </Label>

              <Input
                id="contactName"
                name="contactName"
                placeholder="Recruiter or hiring manager"
                defaultValue={company.contactName ?? ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail">
                Contact Email
              </Label>

              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                placeholder="name@company.com"
                defaultValue={company.contactEmail ?? ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone">
                Contact Phone
              </Label>

              <Input
                id="contactPhone"
                name="contactPhone"
                type="tel"
                placeholder="+91 98765 43210"
                defaultValue={company.contactPhone ?? ""}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Company Notes</CardTitle>

            <CardDescription>
              Keep useful information about the company here.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="description">
                Description
              </Label>

              <Textarea
                id="description"
                name="description"
                rows={7}
                placeholder="Company overview, interview notes, culture, technologies, or anything useful..."
                defaultValue={company.description ?? ""}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Link href={`/companies/${company.id}`}>
            <Button
              type="button"
              variant="outline"
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
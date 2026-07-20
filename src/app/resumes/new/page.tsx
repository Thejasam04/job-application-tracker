import Link from "next/link";
import { ArrowLeft, FileText, Upload } from "lucide-react";

import { createResume } from "@/app/resumes/actions";
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

export default function NewResumePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/resumes">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>

        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Add Resume
          </h2>

          <p className="text-muted-foreground">
            Store a resume version and use it when tracking job applications.
          </p>
        </div>
      </div>

      <form action={createResume}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Resume Details
            </CardTitle>

            <CardDescription>
              Upload a PDF or DOCX resume up to 10 MB.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">
                Resume Name *
              </Label>

              <Input
                id="name"
                name="name"
                placeholder="e.g. Cloud Support Resume"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">
                Resume File *
              </Label>

              <Input
                id="file"
                name="file"
                type="file"
                accept=".pdf,.docx"
                required
              />

              <p className="text-xs text-muted-foreground">
                Supported formats: PDF and DOCX. Maximum size: 10 MB.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Description
              </Label>

              <Textarea
                id="description"
                name="description"
                rows={4}
                placeholder="e.g. Tailored for AWS Cloud Support and Infrastructure roles"
              />
            </div>

            <div className="flex items-center gap-3 rounded-lg border p-4">
              <input
                id="isDefault"
                name="isDefault"
                type="checkbox"
                className="h-4 w-4"
              />

              <div>
                <Label htmlFor="isDefault">
                  Set as default resume
                </Label>

                <p className="text-xs text-muted-foreground">
                  Use this as your primary resume version.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Link href="/resumes">
                <Button
                  type="button"
                  variant="outline"
                >
                  Cancel
                </Button>
              </Link>

              <Button type="submit">
                <Upload className="mr-2 h-4 w-4" />
                Upload Resume
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
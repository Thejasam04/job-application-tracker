import {
  Database,
  Info,
  Settings,
  User,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Settings
        </h2>

        <p className="text-muted-foreground">
          Manage your JobTracker preferences and application information.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <User className="h-5 w-5" />
              </div>

              <div>
                <CardTitle>Profile</CardTitle>
                <CardDescription>
                  Personal information used in your tracker.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Application Owner
              </p>

              <p className="font-medium">
                Thejas AM
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Tracker Type
              </p>

              <p className="font-medium">
                Personal Job Application Tracker
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Settings className="h-5 w-5" />
              </div>

              <div>
                <CardTitle>Preferences</CardTitle>

                <CardDescription>
                  Default preferences for job applications.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Default Currency
              </p>

              <p className="font-medium">
                INR (₹)
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Date Format
              </p>

              <p className="font-medium">
                DD MMM YYYY
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Database */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Database className="h-5 w-5" />
              </div>

              <div>
                <CardTitle>Data Storage</CardTitle>

                <CardDescription>
                  Information about your application data.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Database
              </p>

              <p className="font-medium">
                PostgreSQL
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Resume Storage
              </p>

              <p className="font-medium">
                Local Storage
              </p>
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Info className="h-5 w-5" />
              </div>

              <div>
                <CardTitle>About JobTracker</CardTitle>

                <CardDescription>
                  Application information.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Version
              </p>

              <p className="font-medium">
                1.0.0
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Purpose
              </p>

              <p className="font-medium">
                Track job applications, companies, resumes and job search
                analytics.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
"use client";

import Link from "next/link";
import { Search, Plus } from "lucide-react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/applications": "Applications",
  "/companies": "Companies",
  "/resumes": "Resumes",
  "/analytics": "Analytics",
  "/settings": "Settings",
};

export function Header() {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? "JobTracker";

  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b bg-background px-6">
      <div>
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <form
          action="/applications"
          method="GET"
          className="relative hidden w-72 lg:block"
        >
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            name="search"
            placeholder="Search applications..."
            className="pl-9"
          />
        </form>

        <Link href="/applications/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Application
          </Button>
        </Link>
      </div>
    </header>
  );
}
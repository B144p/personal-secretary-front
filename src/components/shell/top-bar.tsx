import Link from "next/link";
import { Nav } from "@/components/shell/nav";
import { ThemeToggle } from "@/components/shell/theme-toggle";
import { LogoutButton } from "@/components/shell/logout-button";
import type { User } from "@/lib/schemas";

export function TopBar({ user }: { user: User }) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-4 px-4">
        <Link href="/plans" className="mr-4 text-sm font-bold tracking-tight">
          Personal Secretary
        </Link>
        <Nav />
        <div className="ml-auto flex items-center gap-2">
          <span className="hidden text-xs text-muted-foreground sm:block">
            {user.email}
          </span>
          <ThemeToggle />
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}

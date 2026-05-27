"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Plans", href: "/plans" },
  { label: "Feedback", href: "/feedback" },
  { label: "Settings", href: "/settings" },
];

export function Nav({ isAdmin }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const items = isAdmin
    ? [...NAV_ITEMS, { label: "Admin", href: "/admin/users" }]
    : NAV_ITEMS;

  return (
    <nav className="flex items-center gap-1">
      {items.map(({ label, href }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            pathname.startsWith(href)
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}

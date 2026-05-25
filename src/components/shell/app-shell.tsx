import { TopBar } from "@/components/shell/top-bar";
import type { User } from "@/lib/schemas";

export function AppShell({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <TopBar user={user} />
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}

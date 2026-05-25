import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { UserSchema } from "@/lib/schemas";
import { LogoutButton } from "@/components/shell/logout-button";

async function getMe() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/me`, {
      cache: "no-store",
      headers: { Cookie: cookieHeader },
    });
    if (!res.ok) return null;
    const json: unknown = await res.json();
    return UserSchema.parse(json);
  } catch {
    return null;
  }
}

export default async function PendingApprovalPage() {
  const user = await getMe();
  if (!user) redirect("/signin");
  if (user.status === "APPROVED") redirect("/plans");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Awaiting Approval</h1>
        <p className="max-w-sm text-muted-foreground">
          Your account is awaiting approval. You&apos;ll be able to access the
          app once the admin approves your request.
        </p>
      </div>
      <LogoutButton />
    </div>
  );
}

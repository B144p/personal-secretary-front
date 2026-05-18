import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { AppShell } from "@/components/shell/app-shell";
import { UserSchema, type User } from "@/lib/schemas";

async function getMe(): Promise<User | null> {
  const cookieStore = await cookies();
  const headersList = await headers();
  const cookieHeader = cookieStore.toString();

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/me`,
      {
        cache: "no-store",
        headers: {
          Cookie: cookieHeader,
          "x-forwarded-for": headersList.get("x-forwarded-for") ?? "",
        },
      }
    );
    if (!res.ok) return null;
    const json: unknown = await res.json();
    return UserSchema.parse(json);
  } catch {
    return null;
  }
}

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getMe();
  if (!user) redirect("/signin");

  return <AppShell user={user}>{children}</AppShell>;
}

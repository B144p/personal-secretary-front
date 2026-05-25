import { Button } from "@/components/ui/button";
import { ReauthToast } from "@/app/(auth)/signin/reauth-toast";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ reauth?: string }>;
}) {
  const { reauth } = await searchParams;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      {reauth === "1" && <ReauthToast />}
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Personal Secretary</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to manage your plans and schedule.
        </p>
      </div>
      <Button asChild size="lg">
        <a href={`${API_BASE}/auth/google`}>Sign in with Google</a>
      </Button>
    </div>
  );
}

export default async function PlanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <p className="text-muted-foreground">Plan {id} detail — coming in T22.</p>
  );
}

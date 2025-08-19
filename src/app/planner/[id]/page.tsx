import React from "react";

export default async function Page({ params }: IPageProps) {
  const { id } = await params;
  return <>Planner: {id}</>;
}

interface IPageProps {
  params: Promise<{ id: string }>;
}

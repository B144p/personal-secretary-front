import { axiosInstance } from "@/lib/axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body: IPostPayload = await req.json();
  const { data } = await axiosInstance.post<IOpenAIResponse>(
    "task/generate/",
    body
  );

  return NextResponse.json(data, { status: 200 });
}

interface IPostPayload {
  goal: string;
}

interface IOpenAIResponse {
  goal: string;
  duration_days: number;
  daily_tasks: Array<{
    day: number;
    title: string;
    objective: string;
    tasks: Array<string>;
    estimated_hours: number;
    priority: string;
    status: string;
  }>;
}

export type IGeneratePlanResponse = IOpenAIResponse;

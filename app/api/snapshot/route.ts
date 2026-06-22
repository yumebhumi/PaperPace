import { NextResponse } from "next/server";

import { getAppSnapshot } from "@/lib/data";

export async function GET() {
  const snapshot = await getAppSnapshot();

  return NextResponse.json(snapshot);
}

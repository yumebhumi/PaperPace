import { NextResponse } from "next/server";
import { z } from "zod";

import { createReadingSession } from "@/lib/data";

const sessionSchema = z.object({
  bookId: z.string(),
  startPage: z.number().int().nonnegative(),
  endPage: z.number().int().positive(),
  durationSeconds: z.number().int().positive(),
  mood: z.string().optional(),
  focusScore: z.number().int().min(1).max(100).optional(),
  notes: z.string().optional(),
});

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = sessionSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid session payload", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const result = await createReadingSession(parsed.data);

  return NextResponse.json(result);
}

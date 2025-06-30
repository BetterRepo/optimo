import { db } from "../../lib/db";
import { submissions } from "../../db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Use Drizzle ORM to fetch all records from the submissions table
    const allSubmissions = await db.select().from(submissions);
    return NextResponse.json({ success: true, data: allSubmissions });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

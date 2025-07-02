import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { submissions } from "../../../db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  console.log("Fetching submission with ID:", id);
  if (!id) {
    return NextResponse.json(
      { success: false, error: "ID is required" },
      { status: 400 }
    );
  }

  try {
    const response = await db.query.submissions.findFirst({
      where: eq(submissions.id, id),
      columns: {
        form1Data: true,
      },
    });
    const ubillFilesUrls = response?.form1Data?.ubillFilesUrls;
    return NextResponse.json({ success: true, data: ubillFilesUrls });
  } catch (error) {
    console.error("Error in GET handler:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

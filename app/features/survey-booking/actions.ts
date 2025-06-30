"use server";

import { db } from "../../lib/db";
import { submissions } from "../../db/schema";
import { eq } from "drizzle-orm";

export async function saveForm(id: string, formData: any) {
  const existing = await db.query.submissions.findFirst({
    where: eq(submissions.id, id),
  });

  if (existing) {
    await db
      .update(submissions)
      .set({ form2Data: formData, form2Filled: true })
      .where(eq(submissions.id, id));
  } else {
    await db.insert(submissions).values({
      id: id,
      form2Data: formData,
      form1Filled: true,
    });
  }
}

"use server";

import { db } from "../../lib/db";
import { submissions } from "../../db/schema";
import { eq } from "drizzle-orm";

interface FormDataType {
  [key: string]: any;
}

export async function saveForm(id: string, formData: FormDataType) {
  try {
    const existing = await db.query.submissions.findFirst({
      where: eq(submissions.id, id),
    });
    console.log("Existing submission found:", existing);
    if (existing) {
      await db
        .update(submissions)
        .set({ form1Data: JSON.stringify(formData), form1Filled: true })
        .where(eq(submissions.id, id));
    } else {
      await db.insert(submissions).values({
        id: id,
        form1Data: JSON.stringify(formData),
        form1Filled: true,
      });
    }
  } catch (error) {
    console.error("Error saving form data:", error);
    throw error;
  }
}

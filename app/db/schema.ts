// db/schema.ts
import { pgTable, uuid, jsonb, boolean, timestamp } from "drizzle-orm/pg-core";

export const submissions = pgTable("submissions", {
  id: uuid("id").primaryKey(),
  form1Data: jsonb("form1_data"),
  form2Data: jsonb("form2_data"),
  form1Filled: boolean("form1_filled").default(false),
  form2Filled: boolean("form2_filled").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

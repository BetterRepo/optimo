import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "../db/schema";

const connectionString = process.env.POSTGRES_URL;
if (!connectionString) {
  throw new Error("POSTGRES_URL environment variable is not set");
}
export const db = drizzle(connectionString, { schema });

// Optional: Check DB connection on startup
export async function checkDbConnection() {
  try {
    // Try a simple query to check connection
    await db.execute("SELECT 1");
    console.log("Database connection successful");
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    return false;
  }
}

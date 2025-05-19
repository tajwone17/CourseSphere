// Database helper functions for testing database connection
import db from "@/lib/db";

/**
 * Test database connection
 * @returns Promise with test query result
 */
export async function testDatabaseConnection(): Promise<unknown> {
  return new Promise((resolve, reject) => {
    try {
      // First check if db is properly initialized
      if (!db || typeof db.query !== "function") {
        console.error("Database connection not properly initialized");
        reject(new Error("Database connection not properly initialized"));
        return;
      }

      db.query("SELECT 1 + 1 AS solution", (err, results) => {
        if (err) {
          console.error("Database test query failed:", err.stack);
          reject(err);
          return;
        }
        console.log("Database test query successful:", results);
        resolve(results);
      });
    } catch (error) {
      console.error("Exception in testDatabaseConnection:", error);
      reject(error);
    }
  });
}

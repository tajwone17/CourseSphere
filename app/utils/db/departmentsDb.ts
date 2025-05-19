// Database helper functions for departments operations
import db from "@/lib/db";

/**
 * Interface for department records
 */
export interface Department {
  id: number;
  department_name: string;
}

/**
 * Fetch all departments from database
 * @returns Promise with array of department records
 */
export async function getAllDepartments(): Promise<Department[]> {
  return new Promise((resolve, reject) => {
    try {
      // First check if db is properly initialized
      if (!db || typeof db.query !== "function") {
        console.error("Database connection not properly initialized");
        reject(new Error("Database connection not properly initialized"));
        return;
      }

      db.query("SELECT id, department_name FROM department", (err, results) => {
        if (err) {
          console.error("Error fetching departments:", err);
          reject(err);
          return;
        }

        // Ensure results is always an array
        const resultArray = Array.isArray(results)
          ? results
          : results
            ? [results]
            : [];
        resolve(resultArray as Department[]);
      });
    } catch (error) {
      console.error("Exception in getAllDepartments:", error);
      reject(error);
    }
  });
}

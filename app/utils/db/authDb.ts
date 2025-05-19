// Database helper functions for authentication operations
import db from "@/lib/db";
import { StudentRecord, UserResult } from "../validation/authValidation";
import bcrypt from "bcrypt";

/**
 * Check if user with email or registration number exists
 * @param email User email
 * @param registration_number User registration number
 * @returns Promise with array of matching student records
 */
export async function checkUserExists(
  email: string,
  registration_number: string,
): Promise<StudentRecord[]> {
  return new Promise((resolve, reject) => {
    try {
      const query =
        "SELECT * FROM student WHERE email = ? OR registration_number = ?";

      db.query(query, [email, registration_number], (err, results) => {
        if (err) {
          console.error("Error checking if user exists:", err);
          reject(err);
          return;
        }

        // Ensure results is always an array
        const resultArray = Array.isArray(results)
          ? results
          : results
            ? [results]
            : [];
        resolve(resultArray as StudentRecord[]);
      });
    } catch (error) {
      console.error("Exception in checkUserExists:", error);
      reject(error);
    }
  });
}

/**
 * Hash a password using bcrypt
 * @param password Plain text password
 * @returns Promise with hashed password string
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Create a new user in the database
 * @param userData User data to insert
 * @returns Promise resolving when operation completes
 */
export async function createUser(userData: StudentRecord): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const query = "INSERT INTO student SET ?";

      db.query(query, userData, (err, result) => {
        if (err) {
          console.error("Error creating user:", err);
          reject(err);
          return;
        }

        console.log("User created successfully:", result);
        resolve();
      });
    } catch (error) {
      console.error("Exception in createUser:", error);
      reject(error);
    }
  });
}

/**
 * Find user by email across all user tables
 * @param email User email
 * @returns Promise with array of matching user results
 */
export async function findUserByEmail(email: string): Promise<UserResult[]> {
  // Try student table first
  const students = await queryUserTable("student", email);
  if (students.length > 0) {
    return students;
  }

  // Then try admin table
  const admins = await queryUserTable("admin", email);
  if (admins.length > 0) {
    return admins;
  }

  // Finally check advisor table
  const advisors = await queryUserTable("advisor", email);
  return advisors;
}

/**
 * Helper function to query a user table
 * @param tableType Type of user table to query
 * @param email User email
 * @returns Promise with array of matching user results
 */
async function queryUserTable(
  tableType: string,
  email: string,
): Promise<UserResult[]> {
  return new Promise((resolve, reject) => {
    try {
      const query = `SELECT *, '${tableType}' as userType FROM ${tableType} WHERE email = ?`;

      db.query(query, [email], (err, results) => {
        if (err) {
          console.error(`Error querying ${tableType} table:`, err);
          reject(err);
          return;
        }

        // Ensure results is always an array
        const resultArray = Array.isArray(results)
          ? results
          : results
            ? [results]
            : [];
        resolve(resultArray as UserResult[]);
      });
    } catch (error) {
      console.error(`Exception in queryUserTable for ${tableType}:`, error);
      reject(error);
    }
  });
}

/**
 * Compare password with hashed password
 * @param password Plain text password
 * @param hash Hashed password
 * @returns Promise with boolean indicating if passwords match
 */
export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Test bcrypt is working properly
 * @returns Promise with boolean indicating if test passed
 */
export async function testBcrypt(): Promise<boolean> {
  try {
    const testHash = await bcrypt.hash("test", 10);
    return await bcrypt.compare("test", testHash);
  } catch (error) {
    console.error("Bcrypt self-test error:", error);
    return false;
  }
}

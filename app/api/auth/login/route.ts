import { NextResponse } from "next/server";
import db from "@/lib/db";
import bcrypt from "bcrypt";

// Define types for database results
interface UserResult {
  // Define both lowercase and uppercase variants since MySQL might return uppercase keys
  id?: number;
  ID?: number;
  email?: string;
  EMAIL?: string;
  password?: string;
  PASSWORD?: string;
  name?: string;
  NAME?: string;
  userType?: string;
  status?: number;
  STATUS?:number;
  // Add any other fields that might be relevant
  REGISTRATION_NUMBER?: string;
  DEPARTMENT_ID?: number;
  SESSION?: string;
  MOBILE?: string;
  CREATED_AT?: string;
  [key: string]: unknown; // For other properties that may vary between user types
}

// Helper functions for validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

const loginAttempts: Record<string, { count: number; lastAttempt: number }> =
  {};

// Rate limiting function
function checkRateLimit(email: string): { allowed: boolean; message?: string } {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 5;

  // Clean up old entries
  Object.keys(loginAttempts).forEach((key) => {
    if (now - loginAttempts[key].lastAttempt > windowMs) {
      delete loginAttempts[key];
    }
  });

  // Check if this email has exceeded attempts
  if (!loginAttempts[email]) {
    loginAttempts[email] = { count: 1, lastAttempt: now };
    return { allowed: true };
  }

  // If within time window, check count
  if (loginAttempts[email].count >= maxAttempts) {
    const timeLeft = Math.ceil(
      (windowMs - (now - loginAttempts[email].lastAttempt)) / 60000,
    );
    return {
      allowed: false,
      message: `Too many login attempts. Please try again in ${timeLeft} minutes.`,
    };
  }

  // Increment count and update time
  loginAttempts[email].count += 1;
  loginAttempts[email].lastAttempt = now;
  return { allowed: true };
}

export async function POST(request: Request) {
  try {
    // Test that bcrypt is working properly
    try {
      const testHash = await bcrypt.hash("test", 10);
      const testVerify = await bcrypt.compare("test", testHash);
      console.log("Bcrypt self-test:", testVerify ? "PASSED" : "FAILED");
    } catch (bcryptErr) {
      console.error("Bcrypt self-test error:", bcryptErr);
    }

    const { email, password } = await request.json();

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Check password minimum length
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 },
      );
    }

    // Check rate limiting
    const rateCheck = checkRateLimit(email);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: rateCheck.message },
        { status: 429 }, // Too Many Requests
      );
    }

    // Determine which table to query based on the role or default to checking all tables
    let user: UserResult | null = null;
    let userTable = ""; // First check in student table
    const studentQuery =
      "SELECT *, 'student' as userType FROM student WHERE email = ?";
    const students: UserResult[] = await new Promise((resolve, reject) => {
      db.query(studentQuery, [email], (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        console.log(
          "Student query results:",
          Array.isArray(results)
            ? `Found ${results.length} results`
            : "No results found",
        );

        if (Array.isArray(results) && results.length > 0) {
          // Log the structure (but not the actual values) to debug
          console.log(
            "User data structure:",
            Object.keys(results[0]).join(", "),
          );
        }

        resolve(results as UserResult[]);
      });
    });

    if (students && students.length > 0) {
      user = students[0];
      userTable = "student";
    }

    // If not found in student, check in admin table
    if (!user) {
      const adminQuery =
        "SELECT *, 'admin' as userType FROM admin WHERE email = ?";
      const admins: UserResult[] = await new Promise((resolve, reject) => {
        db.query(adminQuery, [email], (err, results) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(results as UserResult[]);
        });
      });

      if (admins && admins.length > 0) {
        user = admins[0];
        userTable = "admin";
      }
    }

    // If not found in admin, check in advisor table
    if (!user) {
      const advisorQuery =
        "SELECT *, 'advisor' as userType FROM advisor WHERE email = ?";
      const advisors: UserResult[] = await new Promise((resolve, reject) => {
        db.query(advisorQuery, [email], (err, results) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(results as UserResult[]);
        });
      });

      if (advisors && advisors.length > 0) {
        user = advisors[0];
        userTable = "advisor";
      }
    } // Check if user exists in any table
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    } // Log user object keys to see what we're working with
    console.log("User object keys:", Object.keys(user));

    // Check for password field case-insensitively
    const passwordField = Object.keys(user).find(
      (key) => key.toLowerCase() === "password",
    );

    if (!passwordField) {
      console.error("Missing password field in user record");
      return NextResponse.json(
        { error: "Authentication error" },
        { status: 500 },
      );
    }

    if (!user[passwordField]) {
      console.error("Missing password hash value in user record");
      return NextResponse.json(
        { error: "Authentication error" },
        { status: 500 },
      );
    }

    // Log for debugging (remove in production)    console.log("Found password field:", passwordField);
    console.log("Attempting password verification");
    try {
      // We already have the password field from above, no need to find it again

      // Add more detailed debugging      console.log("Input password length:", password ? password.length : 0);
      const storedPwd = user[passwordField];
      console.log(
        "Stored hash length:",
        storedPwd ? String(storedPwd).length : 0,
      );

      // Ensure we're working with proper string values
      const inputPassword = String(password);
      const storedHash = String(user[passwordField]);

      // Compare passwords with proper error handling
      const passwordMatch = await bcrypt.compare(inputPassword, storedHash);
      console.log("Password match result:", passwordMatch);

      if (!passwordMatch) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 },
        );
      }
    } catch (err) {
      console.error("Password comparison error:", err);

      // Provide more specific error messages based on type of error
      if (err instanceof Error) {
        // Check for common bcrypt errors
        if (err.message.includes("data and hash")) {
          console.error("Bcrypt error: data or hash arguments invalid");
          return NextResponse.json(
            { error: "Invalid credentials format" },
            { status: 500 },
          );
        } else if (err.message.includes("hash")) {
          console.error("Bcrypt error: hash format issue");
          return NextResponse.json(
            { error: "Password verification failed" },
            { status: 500 },
          );
        }
      }

      return NextResponse.json(
        { error: "Authentication error" },
        { status: 500 },
      );
    } // Check account status for students
    // Find the status field case-insensitively

    // Find the status field case-insensitively
    const statusField = Object.keys(user).find(
      (key) => key.toLowerCase() === "status"
    );
    const userStatus = statusField ? user[statusField] : null;

    if (userTable === "student" && userStatus !== 1 && userStatus !== "1") {
      let message =
        "Your account is pending activation by the Head of Department.";
      if (userStatus === 0 || userStatus === "0") {
        message =
          "Your account has been deactivated. Please contact administration.";
      }
      return NextResponse.json(
        {
          error: "Account not activated",
          message,
          redirectTo: "/registration-status",
          status: userStatus,
        },
        { status: 403 },
      );
    } // Return user data without sensitive information
    // Find password field and create a new object without it
    const passwordKey = Object.keys(user).find(
      (key) => key.toLowerCase() === "password",
    );
    const userData = { ...user };

    // Remove the password field (whatever its case is)
    if (passwordKey) {
      delete userData[passwordKey];
    }

    return NextResponse.json({
      status: "success",
      message: "Login successful",
      user: {
        ...userData,
        userType: userTable, // Include the user type in the response
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      {
        status: "error",
        message: "Login failed",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import db from "@/lib/db";
import bcrypt from "bcrypt";

// Define types for database results
interface UserResult {
  id: number;
  email: string;
  password: string;
  name?: string;
  userType?: string;
  status?: string; // Add status for student account status
  [key: string]: unknown; // For other properties that may vary between user types
}

// Helper functions for validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Simple in-memory storage for rate limiting
// In production, use Redis or another persistent store
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
    let userTable = "";

    // First check in student table
    const studentQuery =
      "SELECT *, 'student' as userType FROM student WHERE email = ?";
    const students: UserResult[] = await new Promise((resolve, reject) => {
      db.query(studentQuery, [email], (err, results) => {
        if (err) {
          reject(err);
          return;
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
    }

    // Check if user exists in any table
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Check account status for students
    if (user.userType === "student" && user.status !== "active") {
      let message =
        "Your account is pending activation by the Head of Department.";
      if (user.status === "inactive") {
        message =
          "Your account has been deactivated. Please contact administration.";
      }
      return NextResponse.json(
        {
          error: "Account not activated",
          message,
          redirectTo: "/registration-status",
          status: user.status,
        },
        { status: 403 },
      );
    }

    // Return user data without sensitive information
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: passwordField, ...userData } = user;

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

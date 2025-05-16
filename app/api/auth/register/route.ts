import { NextResponse } from "next/server";
import db from "@/lib/db";
import bcrypt from "bcrypt";

// Define interfaces for database operations
interface StudentRecord {
  id?: number;
  name: string;
  email: string;
  password: string;
  registration_number: string;
  department_id: number;
  mobile: string; // Changed from string | null to make it required
  session: string;
  status: string;
}

// Helper functions for validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isStrongPassword(password: string): boolean {
  // Password should be at least 8 characters with at least one uppercase, one lowercase, one number, and one special character
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

function isValidRegistrationNumber(regNum: string): boolean {
  const regNumRegex = /^[A-Za-z0-9-]{5,20}$/;
  return regNumRegex.test(regNum);
}

function isValidMobileNumber(mobile: string | null): boolean {
  if (!mobile) return false; // Mobile is now required
  const mobileRegex = /^[0-9]{10,15}$/;
  return mobileRegex.test(mobile);
}

export async function POST(request: Request) {
  try {
    const {
      name,
      email,
      password,
      registration_number,
      department_id,
      mobile,
      session,
    } = await request.json(); // Field-specific error collection
    const fieldErrors: Record<string, string> = {}; // Validate required fields
    if (!name) fieldErrors.name = "Name is required";
    if (!email) fieldErrors.email = "Email is required";
    if (!password) fieldErrors.password = "Password is required";
    if (!registration_number)
      fieldErrors.registration_number = "Registration number is required";
    if (!session) fieldErrors.session = "Session is required";
    if (!mobile) fieldErrors.mobile = "Mobile number is required";

    // Return all required field errors at once
    if (Object.keys(fieldErrors).length > 0) {
      return NextResponse.json(
        {
          error: "Please fix the following errors",
          fieldErrors,
        },
        { status: 400 },
      );
    } // Enhanced validations
    if (name.length < 2 || name.length > 100) {
      fieldErrors.name = "Name must be between 2 and 100 characters";
    }

    if (!isValidEmail(email)) {
      fieldErrors.email = "Invalid email format";
    }

    if (!isStrongPassword(password)) {
      fieldErrors.password =
        "Password must be at least 8 characters and include uppercase, lowercase, numbers, and special characters";
    }

    if (!isValidRegistrationNumber(registration_number)) {
      fieldErrors.registration_number =
        "Registration number must be 5-20 characters and can contain letters, numbers and hyphens";
    }

    if (mobile && !isValidMobileNumber(mobile)) {
      fieldErrors.mobile = "Mobile number must be 10-15 digits";
    }
    // Return validation errors if any
    if (Object.keys(fieldErrors).length > 0) {
      return NextResponse.json(
        {
          error: "Please fix the following errors",
          fieldErrors,
        },
        { status: 400 },
      );
    }
    if (
      department_id &&
      (isNaN(Number(department_id)) || Number(department_id) <= 0)
    ) {
      fieldErrors.department_id = "Please select a valid department";
      return NextResponse.json(
        {
          error: "Please fix the following errors",
          fieldErrors,
        },
        { status: 400 },
      );
    } // Check if session is valid (if provided)
    if (session) {
      // Updated regex to accept both YYYY, YYYY-YYYY and Spring/Fall-YYYY formats
      const sessionRegex = /^\d{4}$|^\d{4}-\d{4}$|^(Spring|Fall|Summer)-\d{4}$/;
      if (!sessionRegex.test(session)) {
        const fieldErrors: Record<string, string> = {
          session:
            "Invalid session format. Use YYYY, YYYY-YYYY, Spring-YYYY, Fall-YYYY, or Summer-YYYY format",
        };
        return NextResponse.json(
          {
            error: "Please fix the following errors",
            fieldErrors,
          },
          { status: 400 },
        );
      }
    }

    // Check if student already exists with this email or registration number
    const checkUserQuery =
      "SELECT * FROM student WHERE email = ? OR registration_number = ?";

    const existingUser: StudentRecord[] = await new Promise(
      (resolve, reject) => {
        db.query(
          checkUserQuery,
          [email, registration_number],
          (err, results) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(results as StudentRecord[]);
          },
        );
      },
    );
    if (existingUser && existingUser.length > 0) {
      // Check which field is duplicated
      const fieldErrors: Record<string, string> = {};

      // Determine whether email or registration number is duplicate
      existingUser.forEach((user) => {
        if (user.email === email) {
          fieldErrors.email = "This email is already registered";
        }
        if (user.registration_number === registration_number) {
          fieldErrors.registration_number =
            "This registration number is already registered";
        }
      });

      return NextResponse.json(
        {
          error: "Account already exists",
          fieldErrors,
        },
        { status: 409 },
      );
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds); // Prepare user data for insertion
    const userData: StudentRecord = {
      name,
      email,
      password: hashedPassword,
      registration_number,
      department_id: department_id || 1, // Default to department ID 1 if not provided
      mobile: mobile, // Mobile is now required, not null
      session: session || new Date().getFullYear().toString(), // Use provided session or fall back to current year
      status: "pending", // Set default status to pending
    };

    // Insert the user into the database
    const insertUserQuery = "INSERT INTO student SET ?";

    await new Promise<void>((resolve, reject) => {
      db.query(insertUserQuery, userData, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });

    return NextResponse.json(
      {
        status: "success",
        message:
          "Student registered successfully. Your account is awaiting activation by the Head of Department.",
        redirectTo: "/registration-status",
      },
      { status: 201 },
    );
  } catch (error) {
    // Log error in development environment only
    if (process.env.NODE_ENV !== "production") {
      console.error("Registration error:", error);
    }

    return NextResponse.json(
      {
        status: "error",
        message: "Registration failed",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

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
  mobile: string | null;
  session: string;
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
  // Assuming registration numbers follow a specific format
  // Modify this regex based on your institution's registration number format
  const regNumRegex = /^[A-Za-z0-9-]{5,20}$/;
  return regNumRegex.test(regNum);
}

function isValidMobileNumber(mobile: string | null): boolean {
  if (!mobile) return true; // Mobile is optional
  // Adjust the regex based on your country's mobile number format
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
    } = await request.json();

    // Validate required fields
    if (!name || !email || !password || !registration_number) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Enhanced validations
    if (name.length < 2 || name.length > 100) {
      return NextResponse.json(
        { error: "Name must be between 2 and 100 characters" },
        { status: 400 },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    if (!isStrongPassword(password)) {
      return NextResponse.json(
        {
          error:
            "Password must be at least 8 characters and include uppercase, lowercase, numbers, and special characters",
        },
        { status: 400 },
      );
    }

    if (!isValidRegistrationNumber(registration_number)) {
      return NextResponse.json(
        { error: "Invalid registration number format" },
        { status: 400 },
      );
    }

    if (mobile && !isValidMobileNumber(mobile)) {
      return NextResponse.json(
        { error: "Invalid mobile number format" },
        { status: 400 },
      );
    }

    if (
      department_id &&
      (isNaN(Number(department_id)) || Number(department_id) <= 0)
    ) {
      return NextResponse.json(
        { error: "Invalid department ID" },
        { status: 400 },
      );
    }

    // Check if session is valid (if provided)
    if (session) {
      const sessionRegex = /^\d{4}-\d{4}$|^\d{4}$/;
      if (!sessionRegex.test(session)) {
        return NextResponse.json(
          { error: "Invalid session format. Use YYYY or YYYY-YYYY format" },
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
      return NextResponse.json(
        { error: "Email or registration number already in use" },
        { status: 409 },
      );
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Prepare user data for insertion
    const userData: StudentRecord = {
      name,
      email,
      password: hashedPassword,
      registration_number,
      department_id: department_id || 1, // Default to department ID 1 if not provided
      mobile: mobile || null,
      session: session || new Date().getFullYear().toString(), // Use provided session or fall back to current year
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
        message: "Student registered successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);

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

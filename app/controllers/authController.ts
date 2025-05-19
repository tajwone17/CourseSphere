// Authentication controller functions
import { NextResponse } from "next/server";
import {
  validateRegistrationData,
  validateLoginData,
  StudentRecord,
  RegisterData,
} from "@/app/utils/validation/authValidation";
import {
  checkUserExists,
  createUser,
  hashPassword,
  findUserByEmail,
  comparePassword,
  testBcrypt,
} from "@/app/utils/db/authDb";

/**
 * Handle user registration
 * @param request Registration request
 * @returns NextResponse with registration result
 */
export async function registerUser(request: Request) {
  try {
    // Parse request body
    const registrationData = (await request.json()) as RegisterData;

    // Validate registration data
    const { valid, fieldErrors } = validateRegistrationData(registrationData);

    // Return validation errors if any
    if (!valid) {
      return NextResponse.json(
        {
          error: "Please fix the following errors",
          fieldErrors,
        },
        { status: 400 },
      );
    }

    const {
      name,
      email,
      password,
      registration_number,
      department_id,
      mobile,
      session,
    } = registrationData;

    // Check if student already exists
    const existingUser = await checkUserExists(email, registration_number);

    if (existingUser && existingUser.length > 0) {
      // Check which field is duplicated
      const duplicateFieldErrors: Record<string, string> = {};

      existingUser.forEach((user) => {
        if (user.email === email) {
          duplicateFieldErrors.email = "This email is already registered";
        }
        if (user.registration_number === registration_number) {
          duplicateFieldErrors.registration_number =
            "This registration number is already registered";
        }
      });

      return NextResponse.json(
        {
          error: "Account already exists",
          fieldErrors: duplicateFieldErrors,
        },
        { status: 409 },
      );
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Prepare user data for insertion
    const userData: StudentRecord = {
      name,
      email,
      password: hashedPassword,
      registration_number,
      department_id: Number(department_id) || 1, // Default to department ID 1 if not provided
      mobile, // Mobile is required
      session: session || new Date().getFullYear().toString(), // Use provided session or current year
      status: "pending", // Set default status to pending
    };

    // Insert the user into the database
    await createUser(userData);

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

/**
 * Handle user login
 * @param request Login request
 * @returns NextResponse with login result
 */
export async function loginUser(request: Request) {
  try {
    // Test that bcrypt is working
    const bcryptTest = await testBcrypt();
    console.log("Bcrypt self-test:", bcryptTest ? "PASSED" : "FAILED");

    if (!bcryptTest) {
      console.error(
        "Bcrypt self-test failed, this could cause authentication issues",
      );
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error("Error parsing request body:", parseError);
      return NextResponse.json(
        { error: "Invalid request format" },
        { status: 400 },
      );
    }

    const email = body.email;
    const password = body.password;

    // Validate login data
    const validation = validateLoginData(email, password);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: validation.status || 400 },
      );
    }

    // Find user in database
    const users = await findUserByEmail(email);

    // Check if user exists
    if (!users || users.length === 0) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    const user = users[0];
    const userTable = user.userType || "";

    // Find the password field (case-insensitive)
    const passwordField = Object.keys(user).find(
      (key) => key.toLowerCase() === "password",
    );

    if (!passwordField || !user[passwordField]) {
      console.error("Missing password field/value in user record");
      return NextResponse.json(
        { error: "Authentication error" },
        { status: 500 },
      );
    }

    try {
      // Compare passwords
      const inputPassword = String(password);
      const storedHash = String(user[passwordField]);
      const passwordMatch = await comparePassword(inputPassword, storedHash);

      if (!passwordMatch) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 },
        );
      }
    } catch (err) {
      console.error("Password comparison error:", err);

      // Provide specific error messages for common bcrypt errors
      if (err instanceof Error) {
        if (err.message.includes("data and hash")) {
          return NextResponse.json(
            { error: "Invalid credentials format" },
            { status: 500 },
          );
        } else if (err.message.includes("hash")) {
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
    }

    // Check student account status
    const statusField = Object.keys(user).find(
      (key) => key.toLowerCase() === "status",
    );
    const userStatus = statusField ? user[statusField] : null;

    // Handle different status values (could be number or string)
    if (
      userTable === "student" &&
      userStatus !== 1 &&
      userStatus !== "1" &&
      userStatus !== true &&
      String(userStatus).toLowerCase() !== "active"
    ) {
      let message =
        "Your account is pending activation by the Head of Department.";

      if (
        userStatus === 0 ||
        userStatus === "0" ||
        userStatus === false ||
        String(userStatus).toLowerCase() === "inactive"
      ) {
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
    }

    // Remove password from response
    const passwordKey = Object.keys(user).find(
      (key) => key.toLowerCase() === "password",
    );
    const userData = { ...user };

    if (passwordKey) {
      delete userData[passwordKey];
    }

    return NextResponse.json({
      status: "success",
      message: "Login successful",
      user: {
        ...userData,
        userType: userTable,
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

import { NextRequest } from "next/server";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "@/app/lib/db";

export async function POST(request: NextRequest) {
  try {
    // Get JWT secret key
    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
      return Response.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    // Parse and validate request body
    const body = await request.json();

    const { email, password, role } = body;

    // Fetch user with a single query instead of two separate queries
    //eslint-disable-next-line
    const [rows]: Array<any> = await db.query(
      `SELECT * FROM ${role} WHERE email = ?`,
      [email],
    );

    // Check if user exists
    if (!rows || rows.length === 0) {
      return Response.json({ error: "User not found" }, { status: 401 });
    }

    const user = rows[0];

    // Verify password
    console.log(password, user.PASSWORD);
    const isMatch = await bcrypt.compare(password, user.PASSWORD);
    if (!isMatch) {
      return Response.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Check account status
    if (role !== "admin" && !user.STATUS) {
      return Response.json({ error: "Account is not active" }, { status: 403 });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, secretKey, {
      expiresIn: "7d",
    });

    // Return success response with user data and token
    return Response.json(
      {
        token,
        user: {
          id: user.ID,
          name: user.NAME,
          email: user.EMAIL,
          department: user.DEPARTMENT_ID,
          role: role,
        },
      },
      {
        status: 200,
        headers: {
          "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict; Secure`,
        },
      },
    );
  } catch (error) {
    console.error("Login error:", error);
    return Response.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}

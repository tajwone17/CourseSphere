import { NextRequest, NextResponse } from "next/server";
import db from "@/app/lib/db";
import { RowDataPacket } from "mysql2";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const { email, role, currentPassword, newPassword } = await req.json();

    if (!email || !role || !currentPassword || !newPassword) {
      return NextResponse.json(
        {
          error: "Email, role, current password, and new password are required",
        },
        { status: 400 },
      );
    }

    // Map role to table name
    let tableName = "";

    switch (role.toLowerCase()) {
      case "student":
        tableName = "student";
        break;
      case "admin":
        tableName = "admin";
        break;
      case "accounts_admin":
        tableName = "accounts_admin";
        break;
      case "advisor":
        tableName = "advisor";
        break;
      case "exam_controller":
        tableName = "exam_controller";
        break;
      case "hod":
        tableName = "hod";
        break;
      default:
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Get the user's current password from the appropriate table
    const [result] = await db.query<RowDataPacket[]>(
      `SELECT PASSWORD FROM ${tableName} WHERE EMAIL = ?`,
      [email],
    );

    if (result.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const storedPassword = result[0].PASSWORD;

    if (!storedPassword) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, storedPassword);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 401 },
      );
    }

    // Hash the new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update the password
    await db.query(`UPDATE ${tableName} SET PASSWORD = ? WHERE EMAIL = ?`, [
      hashedPassword,
      email,
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error changing password:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import db from "@/app/lib/db";
import { RowDataPacket } from "mysql2";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { error: "Email, OTP, and new password are required" },
        { status: 400 },
      );
    }

    // Verify OTP
    const [verificationResults] = await db.query<RowDataPacket[]>(
      "SELECT * FROM verification WHERE EMAIL = ? AND OTP = ? AND TYPE = 'PASSWORD_RESET' AND EXPIRES_AT > NOW() AND IS_USED = 0",
      [email, otp],
    );

    if (verificationResults.length === 0) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 },
      );
    }

    // OTP is valid, now mark it as used
    await db.query("UPDATE verification SET IS_USED = 1 WHERE ID = ?", [
      verificationResults[0].ID,
    ]);

    // Hash the new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Find out which table the user belongs to
    const [userResults] = await db.query<RowDataPacket[]>(
      `SELECT 
        (SELECT 1 FROM student WHERE EMAIL = ? LIMIT 1) as is_student,
        (SELECT 1 FROM admin WHERE EMAIL = ? LIMIT 1) as is_admin,
        (SELECT 1 FROM accounts_admin WHERE EMAIL = ? LIMIT 1) as is_accounts_admin,
        (SELECT 1 FROM advisor WHERE EMAIL = ? LIMIT 1) as is_advisor,
        (SELECT 1 FROM exam_controller WHERE EMAIL = ? LIMIT 1) as is_exam_controller,
        (SELECT 1 FROM hod WHERE EMAIL = ? LIMIT 1) as is_hod
      `,
      [email, email, email, email, email, email],
    );

    const user = userResults[0];

    // Update password in the appropriate table
    if (user.is_student) {
      await db.query("UPDATE student SET PASSWORD = ? WHERE EMAIL = ?", [
        hashedPassword,
        email,
      ]);
    } else if (user.is_admin) {
      await db.query("UPDATE admin SET PASSWORD = ? WHERE EMAIL = ?", [
        hashedPassword,
        email,
      ]);
    } else if (user.is_accounts_admin) {
      await db.query("UPDATE accounts_admin SET PASSWORD = ? WHERE EMAIL = ?", [
        hashedPassword,
        email,
      ]);
    } else if (user.is_advisor) {
      await db.query("UPDATE advisor SET PASSWORD = ? WHERE EMAIL = ?", [
        hashedPassword,
        email,
      ]);
    } else if (user.is_exam_controller) {
      await db.query(
        "UPDATE exam_controller SET PASSWORD = ? WHERE EMAIL = ?",
        [hashedPassword, email],
      );
    } else if (user.is_hod) {
      await db.query("UPDATE hod SET PASSWORD = ? WHERE EMAIL = ?", [
        hashedPassword,
        email,
      ]);
    } else {
      return NextResponse.json(
        { error: "User account not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in reset password:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import db from "@/app/lib/db";
import { sendMail } from "@/app/lib/mail";
import { RowDataPacket } from "mysql2";

// Function to generate a 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if user exists in any of these tables: student, admin, accounts_admin, advisor, exam_controller, hod
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
    const userExists =
      user.is_student ||
      user.is_admin ||
      user.is_accounts_admin ||
      user.is_advisor ||
      user.is_exam_controller ||
      user.is_hod;

    // Generate OTP whether user exists or not (for security)
    const otp = generateOTP();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15); // OTP expires in 15 minutes

    if (userExists) {
      // Delete any existing OTPs for this email
      await db.query(
        "DELETE FROM verification WHERE EMAIL = ? AND TYPE = 'PASSWORD_RESET'",
        [email],
      );

      // Save new OTP in the verification table
      await db.query(
        "INSERT INTO verification (EMAIL, TYPE, OTP, EXPIRES_AT) VALUES (?, 'PASSWORD_RESET', ?, ?)",
        [email, otp, expiresAt],
      );

      // Send OTP via email
      await sendMail({
        receiver: email,
        subject: "CourseSphere Password Reset",
        text: `Your password reset code is: ${otp}. This code will expire in 15 minutes.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h2 style="color: #333; text-align: center;">CourseSphere Password Reset</h2>
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
              <p>You requested to reset your password. Use the verification code below to continue:</p>
              <h1 style="text-align: center; letter-spacing: 5px; font-size: 32px; color: #92e3a9; margin: 25px 0;">${otp}</h1>
              <p style="text-align: center; font-size: 14px; color: #666;">This code will expire in 15 minutes.</p>
            </div>
            <p style="color: #666; font-size: 14px;">If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
            <p style="text-align: center; margin-top: 30px; color: #888; font-size: 12px;">© ${new Date().getFullYear()} CourseSphere. All rights reserved.</p>
          </div>
        `,
      });
    }

    // Always return success (for security, don't reveal if the account exists)
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in forgot password:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

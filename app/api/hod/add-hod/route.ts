import { NextRequest } from "next/server";

//Import crypto to generate a random password
import crypto from "crypto";
import { sendMail } from "@/app/lib/mail";
import db from "@/app/lib/db";

export async function POST(request: NextRequest) {
  const { name, email, department, phone } = await request.json();

  // Validate the input data
  if (!name || !email || !department || !phone) {
    return new Response("Invalid input", { status: 400 });
  }

  // Generate a random password
  const password = crypto.randomBytes(8).toString("hex");

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user]: any = await db.query("SELECT * FROM hod WHERE email = ?", [
    email,
  ]);
  if (user.length > 0) {
    return new Response("User already exists", { status: 409 });
  }

  // Insert the new HOD into the database
  const result = await db.query(
    "INSERT INTO hod (name, email, department_id, phone, password, status) VALUES (?, ?, ?, ?, ?, ?)",
    [name, email, department, phone, password, true],
  );
  if (!result) {
    return new Response("Failed to add HOD", { status: 500 });
  }
  const mailoptions = {
    receiver: email,
    subject: "Welcome to Coursesphere",
    text: `Hello ${name},\n\nYour account has been created successfully.\n\nEmail: ${email}\nPassword: ${password}\n\nBest regards,\nCoursesphere Team`,
    html: `<p>Hello ${name},</p><p>Your account has been created successfully.</p><p>Email: ${email}</p><p>Password: ${password}</p><p>Best regards,<br>Coursesphere Team</p>`,
  };

  // Send the email
  const emailResponse = await sendMail(mailoptions);
  if (!emailResponse.success) {
    return new Response("Failed to send email", { status: 500 });
  }

  // Send a success response
  return new Response("HOD added successfully", { status: 200 });
}

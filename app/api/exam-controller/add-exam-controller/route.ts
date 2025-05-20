import { NextRequest } from "next/server";

//Import crypto to generate a random password
import crypto from "crypto";
import { sendMail } from "@/app/lib/mail";
import db from "@/app/lib/db";
import bcrypt from "bcrypt";
export async function POST(request: NextRequest) {
  const { name, email, phone } = await request.json();

  // Validate the input data
  if (!name || !email  || !phone) {
    return new Response("Invalid input", { status: 400 });
  }

  // Generate a random password
  const Password = crypto.randomBytes(8).toString("hex");
  const password = await bcrypt.hash(Password, 10);
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user]: any = await db.query("SELECT * FROM exam_controller WHERE email = ?", [
    email,
  ]);
  if (user.length > 0) {
    return new Response("User already exists", { status: 409 });
  }

  // Insert the new Exam Controller into the database
  const result = await db.query(
    "INSERT INTO exam_controller (name, email,  phone, password, status) VALUES (?, ?, ?, ?, ?)",
    [name, email,  phone, password, true],
  );
  if (!result) {
    return new Response("Failed to add Exam Controller", { status: 500 });
  }
  const mailoptions = {
    receiver: email,
    subject: "Welcome to Coursesphere",
    text: `Hello ${name},\n\nYour account has been created successfully.\n\nEmail: ${email}\nPassword: ${Password}\n\nBest regards,\nCoursesphere Team`,
    html: `<p>Hello ${name},</p><p>Your account has been created successfully.</p><p>Email: ${email}</p><p>Password: ${Password}</p><p>Best regards,<br>Coursesphere Team</p>`,
  };

  // Send the email
  const emailResponse = await sendMail(mailoptions);
  if (!emailResponse.success) {
    return new Response("Failed to send email", { status: 500 });
  }

  // Send a success response
  return new Response("Exam Controller added successfully", { status: 200 });
}

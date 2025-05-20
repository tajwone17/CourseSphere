import { NextRequest } from "next/server";
import bcrypt from "bcrypt";
import db from "@/app/lib/db";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { name, email, registration_number, session, password, department_id, mobile } = body;

  try {
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [userExists]: any = await db.query(
      "SELECT email FROM student WHERE email = ?",
      [email],
    );

    if (userExists.length > 0) {
      return new Response("User already exists", { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [result]: any = await db.query(
      "INSERT INTO student (name, email, registration_number, session, password, department_id, mobile) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, email, registration_number, session, hashedPassword, department_id, mobile],
    );
    if (result.affectedRows === 0) {
      return new Response("Failed to create account", { status: 500 });
    }

    return new Response("Account created successfully", { status: 200 });

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error.message);
    return new Response(error.message, { status: 500 });
  }
}

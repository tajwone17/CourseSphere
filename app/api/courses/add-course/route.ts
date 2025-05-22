import { NextRequest } from "next/server";

import db from "@/app/lib/db";
export async function POST(request: NextRequest) {
  try {
    const { name, code, credit, department_id, instructor_id } = await request.json();
  
    if (!name || !code || !credit || !department_id || !instructor_id) {
      return Response.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Insert the new course into the database
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [result]: any = await db.query(
      `INSERT INTO COURSES (NAME, CODE, CREDIT, DEPARTMENT_ID, STATUS, INSTRUCTOR_ID) VALUES (?, ?, ?, ?, ?, ?)`,
      [name, code, credit, department_id, true, instructor_id]
    );

    return Response.json(
      { message: "Course added successfully", courseId: result.insertId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding course:", error);
    return Response.json(
      { error: "Failed to add course" },
      { status: 500 }
    );
  }
}

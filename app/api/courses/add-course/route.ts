import { NextRequest } from "next/server";
import db from "@/app/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { title, code, credit, department, instructor_name, prerequisites } =
      await request.json();

    if (!title || !code || !credit || !department || !instructor_name) {
      return Response.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    // Start a transaction
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Insert the new course into the database
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const [result]: any = await connection.query(
        `INSERT INTO COURSE (TITLE, CODE, CREDIT, DEPARTMENT_ID, STATUS, INSTRUCTOR_NAME) VALUES (?, ?, ?, ?, ?, ?)`,
        [title, code, credit, department, true, instructor_name],
      );

      const newCourseId = result.insertId;

      // Add prerequisites if any are provided
      if (prerequisites && prerequisites.length > 0) {
        // Use parameterized query for safety
        const prereqQuery = `INSERT INTO prerequisite (COURSE_ID, PREREQ_COURSE_ID) VALUES (?, ?)`;

        // Insert each prerequisite
        for (const prereqId of prerequisites) {
          await connection.query(prereqQuery, [newCourseId, prereqId]);
        }
      }

      // Commit the transaction
      await connection.commit();

      return Response.json(
        { message: "Course added successfully", courseId: newCourseId },
        { status: 201 },
      );
    } catch (error) {
      // If any error occurs, rollback the transaction
      await connection.rollback();
      throw error;
    } finally {
      // Release the connection
      connection.release();
    }
  } catch (error) {
    console.error("Error adding course:", error);
    return Response.json({ error: "Failed to add course" }, { status: 500 });
  }
}

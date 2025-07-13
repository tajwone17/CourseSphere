import { NextRequest } from "next/server";
import db from "@/app/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { userId, courseId } = await request.json();

    if (!userId || !courseId) {
      return Response.json(
        { error: "Missing userId or courseId" },
        { status: 400 },
      );
    }

    // Check if the user has an active registration already
    //eslint-disable-next-line 
    const [activeRegistrations]: any = await db.query(
      `SELECT * FROM registration_bundle 
       WHERE STUDENT_ID = ? AND STATUS NOT IN ('COMPLETED', 'REJECTED')`,
      [userId],
    );

    if (activeRegistrations && activeRegistrations.length > 0) {
      return Response.json(
        {
          error:
            "You have an active registration in progress. Cannot add new courses until it's completed.",
          hasActiveRegistration: true,
        },
        { status: 403 },
      );
    }

    // Check if course exists
    //eslint-disable-next-line
    const [courseRows]: any = await db.query(
      "SELECT * FROM course WHERE ID = ?",
      [courseId],
    );

    if (!courseRows || courseRows.length === 0) {
      return Response.json({ error: "Course not found" }, { status: 404 });
    }

    // Check if the course is already in the user's cart
    //eslint-disable-next-line
    const [existingRows]: any = await db.query(
      "SELECT * FROM course_cart WHERE USER_ID = ? AND COURSE_ID = ?",
      [userId, courseId],
    );

    if (existingRows && existingRows.length > 0) {
      return Response.json({ message: "Course already in cart", exists: true });
    }

    // Insert the course into the cart
    await db.query(
      "INSERT INTO course_cart (USER_ID, COURSE_ID, STATUS) VALUES (?, ?, 0)",
      [userId, courseId],
    );

    return Response.json({ success: true, message: "Course added to cart" });
  } catch (error) {
    console.error("Error adding course to cart:", error);
    return Response.json(
      { error: "Failed to add course to cart" },
      { status: 500 },
    );
  }
}

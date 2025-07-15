import { NextRequest } from "next/server";
import db from "@/app/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { userId, courseId } = await request.json();

    if (!userId || !courseId) {
      return Response.json(
        { error: "Missing userId or courseId. Please provide both values." },
        { status: 400 },
      );
    }

    // Validate user exists
    try {
      //eslint-disable-next-line
      const [userRows]: any = await db.query(
        "SELECT * FROM student WHERE ID = ?",
        [userId],
      );

      if (!userRows || userRows.length === 0) {
        return Response.json(
          { error: "User not found. Please sign in again." },
          { status: 404 },
        );
      }
    } catch (dbError) {
      console.error("Error validating user:", dbError);
      return Response.json(
        { error: "Error validating user account. Please try again." },
        { status: 500 },
      );
    }

    // Check if the user has an active registration already
    try {
      //eslint-disable-next-line
      const [activeRegistrations]: any = await db.query(
        `SELECT * FROM registration_bundle 
         WHERE STUDENT_ID = ? AND STATUS NOT IN ('COMPLETED', 'REJECTED', 'CANCELLED')`,
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
    } catch (dbError) {
      console.error("Error checking active registrations:", dbError);
      return Response.json(
        { error: "Error checking active registrations. Please try again." },
        { status: 500 },
      );
    }

    // Check if course exists
    try {
      //eslint-disable-next-line
      const [courseRows]: any = await db.query(
        "SELECT * FROM course WHERE ID = ?",
        [courseId],
      );

      if (!courseRows || courseRows.length === 0) {
        return Response.json(
          {
            error: "Course not found or no longer available",
          },
          { status: 404 },
        );
      }
    } catch (dbError) {
      console.error("Error checking course:", dbError);
      return Response.json(
        { error: "Error verifying course availability. Please try again." },
        { status: 500 },
      );
    }

    // Check if the course is already in the user's cart
    try {
      //eslint-disable-next-line
      const [existingRows]: any = await db.query(
        "SELECT * FROM course_cart WHERE USER_ID = ? AND COURSE_ID = ?",
        [userId, courseId],
      );

      if (existingRows && existingRows.length > 0) {
        return Response.json({
          message: "Course already in your cart",
          exists: true,
          success: true,
        });
      }
    } catch (dbError) {
      console.error("Error checking cart:", dbError);
      return Response.json(
        { error: "Error checking your current cart. Please try again." },
        { status: 500 },
      );
    }

    // Insert the course into the cart
    try {
      await db.query(
        "INSERT INTO course_cart (USER_ID, COURSE_ID, STATUS) VALUES (?, ?, 0)",
        [userId, courseId],
      );

      return Response.json({
        success: true,
        message: "Course successfully added to cart",
      });
    } catch (dbError) {
      console.error("Error inserting course to cart:", dbError);
      return Response.json(
        { error: "Failed to add course to cart. Database error occurred." },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error adding course to cart:", error);
    return Response.json(
      { error: "Failed to process your request. Please try again later." },
      { status: 500 },
    );
  }
}

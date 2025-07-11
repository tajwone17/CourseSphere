import { NextRequest } from "next/server";
import db from "@/app/lib/db";

export async function DELETE(request: NextRequest) {
  try {
    const { userId, courseId } = await request.json();
    
    if (!userId || !courseId) {
      return Response.json({ error: "Missing userId or courseId" }, { status: 400 });
    }

    // Delete the course from the cart
    await db.query(
      "DELETE FROM course_cart WHERE USER_ID = ? AND COURSE_ID = ?",
      [userId, courseId]
    );

    return Response.json({ success: true, message: "Course removed from cart" });
  } catch (error) {
    console.error("Error removing course from cart:", error);
    return Response.json({ error: "Failed to remove course from cart" }, { status: 500 });
  }
}

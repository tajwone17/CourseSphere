import { NextRequest } from "next/server";
import db from "@/app/lib/db";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    
    if (!userId) {
      return Response.json({ error: "Missing userId parameter" }, { status: 400 });
    }

    // Get all courses in the user's cart with course details
    //eslint-disable-next-line
    const [cartItems]: any = await db.query(
      `SELECT cc.ID as cartId, cc.COURSE_ID, cc.STATUS, cc.ADDED_AT,
              c.TITLE as name, c.CODE as code, c.CREDIT as credit,
              c.INSTRUCTOR_NAME as instructor, c.DEPARTMENT_ID as department_id,
              d.DEPARTMENT_NAME as department_name
       FROM course_cart cc
       JOIN course c ON cc.COURSE_ID = c.ID
       LEFT JOIN department d ON c.DEPARTMENT_ID = d.ID
       WHERE cc.USER_ID = ?`,
      [userId]
    );

    return Response.json({ success: true, cartItems });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return Response.json({ error: "Failed to fetch cart items" }, { status: 500 });
  }
}

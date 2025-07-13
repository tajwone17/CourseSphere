import { NextRequest } from "next/server";
import db from "@/app/lib/db";

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return Response.json({ error: "Missing userId" }, { status: 400 });
    }

    // Delete all items from the user's cart
    await db.query("DELETE FROM course_cart WHERE USER_ID = ?", [userId]);

    return Response.json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return Response.json({ error: "Failed to clear cart" }, { status: 500 });
  }
}

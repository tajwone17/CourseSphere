import { NextRequest } from "next/server";
import db from "@/app/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { 
      userId, 
      advisorId, 
      semester, 
      totalAmount 
    } = await request.json();
    
    if (!userId || !advisorId || !semester) {
      return Response.json({ 
        error: "Missing required fields: userId, advisorId, and semester are required" 
      }, { status: 400 });
    }

    // Start a transaction
    await db.query("START TRANSACTION");

    try {
      // 1. Create a registration bundle
      const [bundleResult]: any = await db.query(
        `INSERT INTO registration_bundle (
          STUDENT_ID, 
          SEMESTER, 
          STATUS, 
          TOTAL_AMOUNT
        ) VALUES (?, ?, 'PENDING', ?)`,
        [userId, semester, totalAmount || 0]
      );

      const bundleId = bundleResult.insertId;

      // 2. Get all courses from the user's cart
      const [cartItems]: any = await db.query(
        `SELECT * FROM course_cart WHERE USER_ID = ?`,
        [userId]
      );

      if (!cartItems || cartItems.length === 0) {
        // Rollback if no courses in cart
        await db.query("ROLLBACK");
        return Response.json({ 
          error: "No courses found in cart for registration" 
        }, { status: 400 });
      }

      // 3. Add each course to course_registration
      for (const item of cartItems) {
        await db.query(
          `INSERT INTO course_registration (
            BUNDLE_ID, 
            COURSE_ID, 
            ADVISOR_ID, 
            STATUS
          ) VALUES (?, ?, ?, 'PENDING')`,
          [bundleId, item.COURSE_ID, advisorId]
        );
      }

      // 4. Update cart items status to 1 (registered)
      await db.query(
        `UPDATE course_cart SET STATUS = 1 WHERE USER_ID = ?`,
        [userId]
      );

      // 5. Commit the transaction
      await db.query("COMMIT");

      return Response.json({ 
        success: true, 
        message: "Registration submitted successfully", 
        bundleId,
        status: "PENDING",
        nextStep: "Your registration is pending advisor approval."
      });
    } catch (error) {
      // Rollback in case of any error
      await db.query("ROLLBACK");
      throw error;
    }
  } catch (error) {
    console.error("Error submitting registration:", error);
    return Response.json({ 
      error: "Failed to submit registration" 
    }, { status: 500 });
  }
}

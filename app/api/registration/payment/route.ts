import { NextRequest } from "next/server";
import db from "@/app/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { 
      bundleId,
      amount,
      paymentMethod,
      transactionId
    } = await request.json();
    
    if (!bundleId || !amount) {
      return Response.json({ 
        error: "Missing required fields: bundleId and amount" 
      }, { status: 400 });
    }

    // Check if the registration is approved and ready for payment
    const [bundles]: any = await db.query(
      `SELECT * FROM registration_bundle WHERE ID = ?`,
      [bundleId]
    );

    if (!bundles || bundles.length === 0) {
      return Response.json({ 
        error: "Registration bundle not found" 
      }, { status: 404 });
    }

    const bundle = bundles[0];
    
    if (bundle.STATUS !== 'APPROVED') {
      return Response.json({ 
        error: "Registration must be approved before payment can be processed" 
      }, { status: 400 });
    }

    // Start a transaction
    await db.query("START TRANSACTION");

    try {
      // Record the payment
      const [paymentResult]: any = await db.query(
        `INSERT INTO payment (
          BUNDLE_ID, 
          AMOUNT, 
          STATUS,
          PAYMENT_METHOD,
          TRANSACTION_ID
        ) VALUES (?, ?, 'COMPLETED', ?, ?)`,
        [bundleId, amount, paymentMethod || 'Online', transactionId || null]
      );

      // Check if the paid amount equals or exceeds the total amount
      const [payments]: any = await db.query(
        `SELECT SUM(AMOUNT) as total_paid 
         FROM payment 
         WHERE BUNDLE_ID = ? AND STATUS = 'COMPLETED'`,
        [bundleId]
      );

      let paymentStatus = 'PENDING';
      let registrationStatus = bundle.STATUS;
      
      if (payments && payments[0] && payments[0].total_paid) {
        if (payments[0].total_paid >= bundle.TOTAL_AMOUNT) {
          paymentStatus = 'PAID';
          registrationStatus = 'COMPLETED';
        } else if (payments[0].total_paid > 0) {
          paymentStatus = 'PARTIALLY_PAID';
        }
      }

      // Update the registration bundle payment status
      await db.query(
        `UPDATE registration_bundle 
         SET PAYMENT_STATUS = ?, STATUS = ? 
         WHERE ID = ?`,
        [paymentStatus, registrationStatus, bundleId]
      );

      // If registration is completed, update course_registration status
      if (registrationStatus === 'COMPLETED') {
        // Update course_registration status
        await db.query(
          `UPDATE course_registration 
           SET STATUS = 'COMPLETED' 
           WHERE BUNDLE_ID = ? AND STATUS = 'APPROVED'`,
          [bundleId]
        );
        
        // Get student ID from the bundle
        const [bundleDetails]: any = await db.query(
          `SELECT STUDENT_ID FROM registration_bundle WHERE ID = ?`,
          [bundleId]
        );
        
        if (bundleDetails && bundleDetails.length > 0) {
          const studentId = bundleDetails[0].STUDENT_ID;
          
          // Get approved courses from the bundle
          const [courses]: any = await db.query(
            `SELECT COURSE_ID FROM course_registration 
             WHERE BUNDLE_ID = ? AND STATUS = 'COMPLETED'`,
            [bundleId]
          );
          
          // Add each course to registered_courses
          if (courses && courses.length > 0) {
            for (const course of courses) {
              // Check if the course is already in registered_courses
              const [existingRecord]: any = await db.query(
                `SELECT ID FROM registered_courses 
                 WHERE STUDENT_ID = ? AND COURSE_ID = ?`,
                [studentId, course.COURSE_ID]
              );
              
              // Only insert if the course is not already registered
              if (!existingRecord || existingRecord.length === 0) {
                await db.query(
                  `INSERT INTO registered_courses (STUDENT_ID, COURSE_ID, SEMESTER, REGISTRATION_DATE)
                   VALUES (?, ?, ?, NOW())`,
                  [studentId, course.COURSE_ID, bundle.SEMESTER]
                );
              }
            }
          }
        }
      }

      // Commit the transaction
      await db.query("COMMIT");

      return Response.json({ 
        success: true, 
        message: "Payment processed successfully",
        paymentId: paymentResult.insertId,
        paymentStatus,
        registrationStatus
      });
    } catch (error) {
      // Rollback in case of any error
      await db.query("ROLLBACK");
      throw error;
    }
  } catch (error) {
    console.error("Error processing payment:", error);
    return Response.json({ 
      error: "Failed to process payment" 
    }, { status: 500 });
  }
}

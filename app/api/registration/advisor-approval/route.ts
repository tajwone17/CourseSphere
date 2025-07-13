import { NextRequest } from "next/server";
import db from "@/app/lib/db";
import { RowDataPacket } from "mysql2";

export async function POST(request: NextRequest) {
  try {
    const { 
      bundleId, 
      advisorId,
      approved, 
      courseApprovals, // Array of { courseId, approved }
      advisorComment // Optional comment from the advisor
    } = await request.json();
    
    if (!bundleId || !advisorId) {
      return Response.json({ 
        error: "Missing required fields: bundleId and advisorId" 
      }, { status: 400 });
    }

    // Start a transaction
    await db.query("START TRANSACTION");

    try {
      // 1. Update individual course statuses if provided
      if (courseApprovals && courseApprovals.length > 0) {
        for (const approval of courseApprovals) {
          await db.query(
            `UPDATE course_registration 
             SET STATUS = ?, ADVISOR_COMMENT = ? 
             WHERE BUNDLE_ID = ? AND COURSE_ID = ?`,
            [
              approval.approved ? 'APPROVED' : 'REJECTED',
              advisorComment || null,
              bundleId, 
              approval.courseId
            ]
          );
        }
      }

      // 2. Update the overall bundle status
      let newStatus = 'PENDING';
      
      if (approved === true) {
        // Set advisor approval
        await db.query(
          `UPDATE registration_bundle SET ADVISOR_APPROVAL = 1 WHERE ID = ?`,
          [bundleId]
        );
        
        // Update status to PARTIALLY_APPROVED
        newStatus = 'PARTIALLY_APPROVED';
        
        // Update all pending courses to APPROVED if not specified individually
        if (!courseApprovals || courseApprovals.length === 0) {
          await db.query(
            `UPDATE course_registration 
             SET STATUS = 'APPROVED' 
             WHERE BUNDLE_ID = ? AND STATUS = 'PENDING'`,
            [bundleId]
          );
        }
      } else if (approved === false) {
        // If explicitly rejected, update status
        newStatus = 'REJECTED';
        
        // Reject all pending courses if not specified individually
        if (!courseApprovals || courseApprovals.length === 0) {
          await db.query(
            `UPDATE course_registration 
             SET STATUS = 'REJECTED'
             WHERE BUNDLE_ID = ? AND STATUS = 'PENDING'`,
            [bundleId]
          );
        }
      }

      // Update the bundle status
      await db.query(
        `UPDATE registration_bundle SET STATUS = ? WHERE ID = ?`,
        [newStatus, bundleId]
      );

      // Calculate new total amount based on approved courses only
      if (courseApprovals && courseApprovals.length > 0) {
        // Get courses and their credits
        const [courseDetailsRows] = await db.execute<RowDataPacket[]>(
          `SELECT cr.COURSE_ID, c.CREDIT, cr.STATUS, d.AMOUNT_PER_CREDIT
           FROM course_registration cr
           JOIN course c ON cr.COURSE_ID = c.ID
           JOIN registration_bundle rb ON cr.BUNDLE_ID = rb.ID
           JOIN student s ON rb.STUDENT_ID = s.ID
           JOIN department d ON s.DEPARTMENT_ID = d.ID
           WHERE cr.BUNDLE_ID = ?`,
          [bundleId]
        );
        
        // Calculate new total amount based on approved courses only
        let newTotalAmount = 0;
        for (const course of courseDetailsRows) {
          if (course.STATUS === 'APPROVED') {
            newTotalAmount += course.CREDIT * course.AMOUNT_PER_CREDIT;
          }
        }
        
        // Update the bundle with the new total
        await db.query(
          `UPDATE registration_bundle SET TOTAL_AMOUNT = ? WHERE ID = ?`,
          [newTotalAmount, bundleId]
        );
      }

      // Commit the transaction
      await db.query("COMMIT");

      return Response.json({ 
        success: true, 
        message: approved ? 
          "Registration approved by advisor" : 
          "Registration rejected by advisor",
        status: newStatus
      });
    } catch (error) {
      // Rollback in case of any error
      await db.query("ROLLBACK");
      console.error("Transaction error:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error processing advisor approval:", error);
    return Response.json({ 
      error: "Failed to process advisor approval: " + (error instanceof Error ? error.message : "Unknown error")
    }, { status: 500 });
  }
}

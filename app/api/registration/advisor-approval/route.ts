import { NextRequest } from "next/server";
import db from "@/app/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { 
      bundleId, 
      advisorId,
      approved, 
      courseApprovals // Array of { courseId, approved }
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
             SET STATUS = ? 
             WHERE BUNDLE_ID = ? AND COURSE_ID = ?`,
            [
              approval.approved ? 'APPROVED' : 'REJECTED', 
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
      throw error;
    }
  } catch (error) {
    console.error("Error processing advisor approval:", error);
    return Response.json({ 
      error: "Failed to process advisor approval" 
    }, { status: 500 });
  }
}

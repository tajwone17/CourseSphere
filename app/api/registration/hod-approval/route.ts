import { NextRequest } from "next/server";
import db from "@/app/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { 
      bundleId, 
      hodId,
      approved, 
      comment
    } = await request.json();
    
    if (!bundleId || !hodId) {
      return Response.json({ 
        error: "Missing required fields: bundleId and hodId" 
      }, { status: 400 });
    }

    // Check if advisor has already approved
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
    
    if (!bundle.ADVISOR_APPROVAL) {
      return Response.json({ 
        error: "Advisor approval is required before HOD approval" 
      }, { status: 400 });
    }

    // Start a transaction
    await db.query("START TRANSACTION");

    try {
      let newStatus = bundle.STATUS;
      
      if (approved) {
        // Set HOD approval
        await db.query(
          `UPDATE registration_bundle SET HOD_APPROVAL = 1 WHERE ID = ?`,
          [bundleId]
        );
        
        // Update status to keep as PARTIALLY_APPROVED if not already APPROVED
        if (newStatus === 'PARTIALLY_APPROVED') {
          newStatus = 'PARTIALLY_APPROVED';
        }
      } else {
        // If rejected, update status
        newStatus = 'REJECTED';
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
          "Registration approved by HOD" : 
          "Registration rejected by HOD",
        status: newStatus
      });
    } catch (error) {
      // Rollback in case of any error
      await db.query("ROLLBACK");
      throw error;
    }
  } catch (error) {
    console.error("Error processing HOD approval:", error);
    return Response.json({ 
      error: "Failed to process HOD approval" 
    }, { status: 500 });
  }
}

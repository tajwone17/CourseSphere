import { NextRequest } from "next/server";
import db from "@/app/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { 
      bundleId, 
      accountsAdminId,
      approved, 
      totalAmount
    } = await request.json();
    
    if (!bundleId || !accountsAdminId) {
      return Response.json({ 
        error: "Missing required fields: bundleId and accountsAdminId" 
      }, { status: 400 });
    }

    // Check if advisor and HOD have already approved
    //eslint-disable-next-line
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
    
    if (!bundle.ADVISOR_APPROVAL || !bundle.HOD_APPROVAL) {
      return Response.json({ 
        error: "Both advisor and HOD approval are required before accounts approval" 
      }, { status: 400 });
    }

    // Start a transaction
    await db.query("START TRANSACTION");

    try {
      let newStatus = bundle.STATUS;
      
      if (approved) {
        // Set accounts admin approval and update total amount
        await db.query(
          `UPDATE registration_bundle 
           SET ACCOUNTS_ADMIN_APPROVAL = 1, 
               TOTAL_AMOUNT = ?
           WHERE ID = ?`,
          [totalAmount || bundle.TOTAL_AMOUNT, bundleId]
        );
        
        // Update status to APPROVED
        newStatus = 'APPROVED';
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
          "Registration approved by Accounts Admin" : 
          "Registration rejected by Accounts Admin",
        status: newStatus
      });
    } catch (error) {
      // Rollback in case of any error
      await db.query("ROLLBACK");
      throw error;
    }
  } catch (error) {
    console.error("Error processing accounts approval:", error);
    return Response.json({ 
      error: "Failed to process accounts approval" 
    }, { status: 500 });
  }
}

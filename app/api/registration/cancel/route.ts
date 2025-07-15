import { NextRequest } from "next/server";
import db from "@/app/lib/db";

export async function POST(request: NextRequest) {
  // Use a connection to manage the transaction
  let connection;

  try {
    const data = await request.json();
    const { registrationId } = data;

    if (!registrationId) {
      return Response.json(
        {
          success: false,
          error: "Registration ID is required",
        },
        { status: 400 },
      );
    }

    // Get a connection from the pool for transaction
    connection = await db.getConnection();

    // Check if registration exists and can be cancelled
    //eslint-disable-next-line
    const [registrations]: any = await connection.query(
      `SELECT * FROM registration_bundle 
       WHERE ID = ? AND STATUS NOT IN ('COMPLETED', 'REJECTED', 'CANCELLED')`,
      [registrationId],
    );

    if (!registrations || registrations.length === 0) {
      await connection.release();
      return Response.json(
        {
          success: false,
          error: "Registration not found or cannot be cancelled",
        },
        { status: 404 },
      );
    }

    try {
      // Begin transaction
      await connection.beginTransaction();

      // Update registration status to cancelled
      await connection.query(
        `UPDATE registration_bundle SET STATUS = 'CANCELLED' WHERE ID = ?`,
        [registrationId],
      );

      // Update all individual course registrations to cancelled
      await connection.query(
        `UPDATE course_registration SET STATUS = 'CANCELLED' WHERE BUNDLE_ID = ?`,
        [registrationId],
      );

      // Commit the transaction
      await connection.commit();
    } catch (error) {
      // If anything goes wrong, roll back the transaction
      await connection.rollback();
      throw error;
    } finally {
      // Release the connection back to the pool
      await connection.release();
    }

    return Response.json({
      success: true,
      message: "Registration cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling registration:", error);

    // Make sure to release the connection if it exists
    if (connection) {
      try {
        await connection.release();
      } catch (releaseError) {
        console.error("Error releasing database connection:", releaseError);
      }
    }

    return Response.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to cancel registration",
      },
      { status: 500 },
    );
  }
}

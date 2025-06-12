import { NextRequest, NextResponse } from "next/server";
import db from "../../../../lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Extract accounts ID from params
    const accountsAdminId = await params.id;



    // Parse the request body to get the status
    const body = await request.json();
    const { status } = body;



    // Update accounts status in the database
    await db.query("UPDATE EXAM_CONTROLLER SET STATUS = ? WHERE ID = ?", [
      status,
      accountsAdminId,
    ]);

    return NextResponse.json(
      {
        message: `Exam Controller status updated to ${status === 1 ? "active" : "inactive"}`,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating Exam Controller status:", error);
    return NextResponse.json(
      { error: "Failed to update Exam Controller status" },
      { status: 500 },
    );
  }
}

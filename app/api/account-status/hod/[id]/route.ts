import { NextRequest, NextResponse } from "next/server";
import db from "../../../../lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Extract advisor ID from params
    const advisorId = parseInt(params.id);

    if (isNaN(advisorId)) {
      return NextResponse.json(
        { error: "Invalid advisor ID" },
        { status: 400 },
      );
    }

    // Parse the request body to get the status
    const body = await request.json();
    const { status } = body;



    // Update advisor status in the database
    await db.query("UPDATE HOD SET STATUS = ? WHERE ID = ?", [
      status,
      advisorId,
    ]);

    return NextResponse.json(
      {
        message: `Advisor status updated to ${status === 1 ? "active" : "inactive"}`,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating advisor status:", error);
    return NextResponse.json(
      { error: "Failed to update advisor status" },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import db from "@/app/lib/db";

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

    // Validate status
    if (status !== 0 && status !== 1) {
      return NextResponse.json(
        { error: "Status must be 0 (inactive) or 1 (active)" },
        { status: 400 },
      );
    }

    // Update advisor status in the database
    await db.query("UPDATE ADVISOR SET STATUS = ? WHERE ID = ?", [
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

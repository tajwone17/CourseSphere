import { NextRequest, NextResponse } from "next/server";
import db from "../../../../lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Await params before accessing its properties

    const hodId = await params.id;

    // Parse the request body to get the status
    const body = await request.json();
    const { status } = body;

    // Update advisor status in the database
    await db.query("UPDATE HOD SET STATUS = ? WHERE ID = ?", [status, hodId]);

    return NextResponse.json(
      {
        message: `hHOD status updated to ${status === 1 ? "active" : "inactive"}`,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating HOD status:", error);
    return NextResponse.json(
      { error: "Failed to update HOD status" },
      { status: 500 },
    );
  }
}

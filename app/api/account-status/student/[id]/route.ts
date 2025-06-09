import { NextRequest, NextResponse } from "next/server";
import  db  from "../../../../lib/db"; // Adjust the import path as necessary

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Extract student ID from params
    const studentId = parseInt(params.id);
    
    if (isNaN(studentId)) {
      return NextResponse.json({ error: "Invalid student ID" }, { status: 400 });
    }

    // Parse the request body to get the status
    const body = await request.json();
    const { status } = body;

    // Validate status
    if (status !== 0 && status !== 1) {
      return NextResponse.json(
        { error: "Status must be 0 (inactive) or 1 (active)" },
        { status: 400 }
      );
    }

    // Update student status in the database
    await db.execute(
      "UPDATE STUDENT SET STATUS = ? WHERE ID = ?",
      [status, studentId]
    );

    return NextResponse.json(
      { message: `Student status updated to ${status === 1 ? 'active' : 'inactive'}` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating student status:", error);
    return NextResponse.json(
      { error: "Failed to update student status" },
      { status: 500 }
    );
  }
}
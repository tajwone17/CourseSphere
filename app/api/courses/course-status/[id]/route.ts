import { NextRequest, NextResponse } from "next/server";
import db from "../../../../lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
  
    const courseId = parseInt(params.id);

    if (isNaN(courseId)) {
      return NextResponse.json(
        { error: "Invalid course ID" },
        { status: 400 },
      );
    }

    // Parse the request body to get the status
    const body = await request.json();
    const { status } = body;



    // Update advisor status in the database
    await db.query("UPDATE COURSE SET STATUS = ? WHERE ID = ?", [
      status,
      courseId,
    ]);

    return NextResponse.json(
      {
        message: `course status updated to ${status === 1 ? "active" : "inactive"}`,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating course status:", error);
    return NextResponse.json(
      { error: "Failed to update course status" },
      { status: 500 },
    );
  }
}

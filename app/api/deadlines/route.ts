import { NextResponse } from "next/server";
import db from "@/app/lib/db";

// Get deadlines for a specific department
export async function GET(request: Request) {
  // Get departmentId from the request headers
  const departmentId = request.headers.get("departmentid");

  if (!departmentId) {
    return NextResponse.json(
      { error: "Department ID is required in headers" },
      { status: 400 },
    );
  }

  try {
    const [results] = await db.execute(
      "SELECT * FROM deadlines WHERE department_id = ?",
      [departmentId],
    );

    return NextResponse.json({ deadlines: results });
  } catch (error) {
    console.error("Error fetching deadlines:", error);
    return NextResponse.json(
      { error: "Failed to fetch deadlines" },
      { status: 500 },
    );
  }
}

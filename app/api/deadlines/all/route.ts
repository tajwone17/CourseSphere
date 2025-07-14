import { NextResponse } from "next/server";
import db from "@/app/lib/db";

// Get deadlines for all departments with department names
export async function GET() {
  try {
    // Join deadlines with department table to get department names
    const [results] = await db.query(`
      SELECT d.*, dept.DEPARTMENT_NAME 
      FROM deadlines d
      JOIN department dept ON d.department_id = dept.ID
      ORDER BY dept.DEPARTMENT_NAME
    `);

    return NextResponse.json({ departmentDeadlines: results });
  } catch (error) {
    console.error("Error fetching all deadlines:", error);
    return NextResponse.json(
      { error: "Failed to fetch deadlines for all departments" },
      { status: 500 },
    );
  }
}

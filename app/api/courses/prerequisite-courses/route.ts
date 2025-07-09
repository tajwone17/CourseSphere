import { NextRequest, NextResponse } from "next/server";
import db from "@/app/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET(request: NextRequest) {
  try {
    // Get department ID from headers if available
    const departmentId = request.headers.get("departmentid");

    let query = `
      SELECT ID, CODE, TITLE, DEPARTMENT_ID 
      FROM course 
      WHERE STATUS = 1
    `;

    // If departmentId is provided, filter by department
    const queryParams = [];
    if (departmentId) {
      query += ` AND DEPARTMENT_ID = ?`;
      queryParams.push(departmentId);
    }

    query += ` ORDER BY CODE ASC`;

    const [courses] = await db.query<RowDataPacket[]>(query, queryParams);

    return NextResponse.json({ courses });
  } catch (error) {
    console.error("Error fetching courses for prerequisites:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 },
    );
  }
}

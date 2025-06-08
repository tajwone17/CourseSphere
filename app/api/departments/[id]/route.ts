import { NextRequest, NextResponse } from "next/server";
import db from "../../../lib/db";
import { RowDataPacket } from "mysql2"; // Add this import

// Define an interface that extends RowDataPacket
interface DepartmentRow extends RowDataPacket {
  ID: number;
  DEPARTMENT_NAME: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const id = params.id;

    // Query the database for department details
    const [rows] = await db.query<DepartmentRow[]>(
      "SELECT ID, DEPARTMENT_NAME FROM DEPARTMENT WHERE ID = ?",
      [id],
    );

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json(
        { error: "Department not found" },
        { status: 404 },
      );
    }

    const department = rows[0];
    return NextResponse.json({
      department: {
        id: department.ID,
        name: department.DEPARTMENT_NAME,
      },
    });
  } catch (error) {
    console.error("Error fetching department:", error);
    return NextResponse.json(
      { error: "Failed to fetch department details" },
      { status: 500 },
    );
  }
}

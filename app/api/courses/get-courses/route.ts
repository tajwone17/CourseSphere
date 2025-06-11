import { NextResponse } from "next/server";
import db from "../../../lib/db";

export async function GET(request: Request) {
  // Get departmentId from the request headers
  const departmentId = request.headers.get("departmentid");

  if (!departmentId) {
    return NextResponse.json(
      { error: "departmentId is required in headers" },
      { status: 400 },
    );
  }

  const [results] = await db.execute(
    "SELECT * FROM COURSE WHERE DEPARTMENT_ID = ?",
    [departmentId],
  );
  return NextResponse.json({ courses: results });
}

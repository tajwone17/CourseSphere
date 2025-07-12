import db from "../../../lib/db";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    const [results] = await db.execute("SELECT * FROM hod");
    return NextResponse.json({ hods: results });
  } catch (error) {
    console.error("Error fetching HODs:", error);
    return NextResponse.json(
      { error: "Failed to fetch HODs" },
      { status: 500 },
    );
  }
}

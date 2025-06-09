import { NextResponse } from "next/server";
import db from "../../lib/db";
export async function GET() {
    const [results] = await db.execute("SELECT * FROM ADVISOR");
    return NextResponse.json({ advisors: results });
}
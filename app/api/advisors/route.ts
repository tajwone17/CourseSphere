import { NextResponse } from "next/server";
import db from "../../lib/db";

export async function GET(request: Request) {
    // Get departmentId from the request headers or URL
    const url = new URL(request.url);
    let departmentId = request.headers.get("departmentid");
    
    // If not in headers, try query params
    if (!departmentId) {
        departmentId = url.searchParams.get("departmentId");
    }

    if (!departmentId) {
        return NextResponse.json({ error: "departmentId is required in headers or query parameters" }, { status: 400 });
    }

    const [results] = await db.execute(
        "SELECT * FROM advisor WHERE DEPARTMENT_ID = ?", 
        [departmentId]
    );
    
    return NextResponse.json({ advisors: results });
}

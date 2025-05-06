import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    // Fetch departments from database
    const departments = await new Promise((resolve, reject) => {
      db.query("SELECT id, department_name FROM department", (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results);
      });
    });
    
    

    return NextResponse.json({
      status: "success",
      departments,
    });
  } catch (error) {
    console.error("Error fetching departments:", error);

    // Return error response
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to fetch departments",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

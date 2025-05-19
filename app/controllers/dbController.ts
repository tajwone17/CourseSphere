// Database testing controller functions
import { NextResponse } from "next/server";
import { testDatabaseConnection } from "@/app/utils/db/testDb";

/**
 * Test database connection
 * @returns NextResponse with test results or error
 */
export async function testDatabase() {
  try {
    const result = await testDatabaseConnection();

    return NextResponse.json({
      status: "success",
      message: "Database connection successful",
      result,
    });
  } catch (error) {
    console.error("Database connection test error:", error);

    return NextResponse.json(
      {
        status: "error",
        message: "Database connection failed",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

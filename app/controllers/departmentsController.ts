// Departments controller functions
import { NextResponse } from "next/server";
import { getAllDepartments } from "@/app/utils/db/departmentsDb";

/**
 * Get all departments
 * @returns NextResponse with departments data or error
 */
export async function getDepartments() {
  try {
    const departments = await getAllDepartments();

    return NextResponse.json({
      status: "success",
      departments,
    });
  } catch (error) {
    console.error("Error fetching departments:", error);

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

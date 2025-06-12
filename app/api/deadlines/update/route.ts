import { NextRequest, NextResponse } from "next/server";
import db from "../../../lib/db";

export async function PUT(request: NextRequest) {
  try {
    const {
      department_id,
      course_registration_without_fine,
      course_registration_with_fine,
      admit_card_collection,
    } = await request.json();

    if (
      !department_id ||
      !course_registration_without_fine ||
      !course_registration_with_fine ||
      !admit_card_collection
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    // Check if deadlines exist for this department
    const [exists] = await db.execute(
      "SELECT id FROM deadlines WHERE department_id = ?",
      [department_id],
    );

    // Convert to array if not already
    const existsArray = Array.isArray(exists) ? exists : [exists];

    if (existsArray.length > 0) {
      // Update existing deadlines
      await db.execute(
        `UPDATE deadlines SET 
         course_registration_without_fine = ?, 
         course_registration_with_fine = ?, 
         admit_card_collection = ?
         WHERE department_id = ?`,
        [
          course_registration_without_fine,
          course_registration_with_fine,
          admit_card_collection,
          department_id,
        ],
      );
      return NextResponse.json({ message: "Deadlines updated successfully" });
    } else {
      // Insert new deadlines
      await db.execute(
        `INSERT INTO deadlines 
         (department_id, course_registration_without_fine, course_registration_with_fine, admit_card_collection)
         VALUES (?, ?, ?, ?)`,
        [
          department_id,
          course_registration_without_fine,
          course_registration_with_fine,
          admit_card_collection,
        ],
      );
      return NextResponse.json({ message: "Deadlines created successfully" });
    }
  } catch (error) {
    console.error("Error updating deadlines:", error);
    return NextResponse.json(
      { error: "Failed to update deadlines" },
      { status: 500 },
    );
  }
}

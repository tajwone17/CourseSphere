import db from "../../../../lib/db";
import { NextRequest } from "next/server";
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { title, description, date, creatorId } = await request.json();

  // Validate the input data
  if (!title || !description || !date || !creatorId) {
    return new Response("Invalid input", { status: 400 });
  }
  try {
    // Update the notice in the database
    const result = await db.query(
      "UPDATE NOTICE SET TITLE = ?, DESCRIPTION = ?, CREATOR_ID = ? WHERE ID = ?",
      [title, description, creatorId, params.id],
    );
    if (!result) {
      return new Response("Failed to update notice", { status: 500 });
    }

    // Send a success response
    return new Response("Notice updated successfully", { status: 200 });
  } catch (error) {
    console.error("Error updating notice:", error);
    return new Response(`Error updating notice: ${error}`, { status: 500 });
  }
}

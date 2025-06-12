import db from "../../../../lib/db";
import { NextRequest } from "next/server";
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  // Get id from the URL params
  const id = params.id;

  // Validate the input data
  if (!id) {
    return new Response("Invalid input", { status: 400 });
  }

  try {
    // Delete the notice from the database
    const result = await db.query("DELETE FROM NOTICE WHERE ID = ?", [id]);

    if (!result) {
      return new Response("Failed to delete notice", { status: 500 });
    }

    // Send a success response
    return new Response("Notice deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting notice:", error);
    return new Response(`Error deleting notice: ${error}`, { status: 500 });
  }
}

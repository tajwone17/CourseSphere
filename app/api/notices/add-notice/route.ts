import db from "../../../lib/db";
import { NextRequest } from "next/server";
export async function POST(request: NextRequest) {
  const { title, description,  creatorId } = await request.json();

  // Validate the input data
  if (!title || !description ) {
    return new Response("Invalid input", { status: 400 });
  }
  try {
    // Insert the new notice into the database
    const result = await db.query(
      "INSERT INTO NOTICE (TITLE, DESCRIPTION, CREATOR_ID) VALUES (?, ?, ?)",
      [title, description, creatorId, ],
    );

    if (!result) {
      return new Response("Failed to add notice", { status: 500 });
    }

    // Send a success response
    return new Response("Notice added successfully", { status: 200 });
  } catch (error) {
    console.error("Error adding notice:", error);
    return new Response(`Error adding notice: ${error}`, { status: 500 });
  }
}

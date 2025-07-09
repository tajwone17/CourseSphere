import db from "../../lib/db";

export async function GET(req: Request) {
  try {
    // Get departmentId from query params
    const { searchParams } = new URL(req.url);
    const departmentId = searchParams.get("departmentId");
    if (!departmentId) {
      return new Response("Missing departmentId", { status: 400 });
    }

    // Join notice and hod to get notices for the department
    const [notices] = await db.query(
      `SELECT n.ID, n.TITLE, n.DESCRIPTION, n.CREATED_AT, h.NAME as createdBy, h.DEPARTMENT_ID
       FROM notice n
       JOIN hod h ON n.CREATOR_ID = h.ID
       WHERE h.DEPARTMENT_ID = ?
       ORDER BY n.CREATED_AT DESC`,
      [departmentId],
    );

    return Response.json({ notices });
  } catch (error) {
    console.error("Error fetching notices:", error);
    return new Response(`Error fetching notices: ${error}`, { status: 500 });
  }
}

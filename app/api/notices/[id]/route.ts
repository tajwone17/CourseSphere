import db from "../../../lib/db";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const noticeId = params.id;
    
    if (!noticeId) {
      return new Response("Missing notice ID", { status: 400 });
    }

    // Query to get notice details with creator information
    const [notices] = await db.query(
      `SELECT n.ID, n.TITLE, n.DESCRIPTION, n.CREATED_AT, h.NAME as createdBy
       FROM notice n
       JOIN hod h ON n.CREATOR_ID = h.ID
       WHERE n.ID = ?`,
      [noticeId]
    );

    // Define the proper type for notices result
    interface NoticeRow {
      ID: number;
      TITLE: string;
      DESCRIPTION: string;
      CREATED_AT: string;
      createdBy: string;
    }
    
    const noticeArray = notices as NoticeRow[];
    
    if (!noticeArray || noticeArray.length === 0) {
      return new Response("Notice not found", { status: 404 });
    }

    return Response.json({ notice: noticeArray[0] });
  } catch (error) {
    console.error("Error fetching notice details:", error);
    return new Response(`Error fetching notice details: ${error}`, { status: 500 });
  }
}

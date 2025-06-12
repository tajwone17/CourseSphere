import { headers } from "next/headers";
import db from "../../lib/db";
export async function GET() {
  try {
    const headersList = headers();
    const creatorId = (await headersList).get("creatorId");


     const [notices] = await db.query("SELECT * FROM NOTICE WHERE CREATOR_ID = ?", [
        creatorId,
      ]);
     console.log(notices);

    return Response.json({notices:notices});
  } catch (error) {
    console.error("Error fetching notices:", error);
    return new Response(`Error fetching notices: ${error}`, { status: 500 });
  }
}

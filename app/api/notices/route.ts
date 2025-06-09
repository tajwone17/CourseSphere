import db  from "../../lib/db";
export async function GET(){
    const notices = await db.query("SELECT * FROM notices");
    return Response.json(notices);
}

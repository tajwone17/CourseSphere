export async function GET(){
    const notices = await db.query("SELECT * FROM notices");
    return Response.json(notices);
}

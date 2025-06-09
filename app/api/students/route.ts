import db from "@/app/lib/db";

export async function GET() {
  const [results] = await db.query("SELECT * FROM student");
  return new Response(JSON.stringify({ students: results }), {
    status: 200,
  });
}

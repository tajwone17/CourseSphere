import db from "@/app/lib/db";

export async function GET() {
  const [results] = await db.query("SELECT * FROM department");
  return new Response(JSON.stringify({ departments: results }), {
    status: 200,
  });
}

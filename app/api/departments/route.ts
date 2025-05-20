import db from "@/app/lib/db";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const [results] = await db.query("SELECT * FROM department");
  return new Response(JSON.stringify({ departments: results }), {
    status: 200,
  });
}

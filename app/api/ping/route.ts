import { NextRequest } from "next/server";
//eslint-disable-next-line
export async function GET(request: NextRequest) {
  return new Response("Pong");
}

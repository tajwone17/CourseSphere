import db from "../../lib/db";
import { NextResponse} from "next/server";
export async function GET() {
    try{
        const [results]=await db.execute("SELECT* FROM EXAM_CONTROLLER");
        return NextResponse.json({ examControllers: results });
    }
    catch(error){
        console.log(error);
        return NextResponse.json({ error: "Failed to fetch Exam Controllers" });
    }

}
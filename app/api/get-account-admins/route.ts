import db from "../../lib/db";
import { NextResponse} from "next/server";
export async function GET() {
    try{
        const [results]=await db.execute("SELECT* FROM ACCOUNTS_ADMIN");
        return NextResponse.json({ accountsAdmin: results });
    }
    catch(error){
        console.log(error);
        return NextResponse.json({ error: "Failed to fetch accounts admin" });
    }

}
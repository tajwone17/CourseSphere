import { NextRequest, NextResponse } from "next/server";
import db from "../../../../lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Extract accounts ID from params
    const accountsAdminId = await params.id;

    // if (isNaN(accountsAdminId)) {
    //   return NextResponse.json(
    //     { error: "Invalid Accounts Admin ID" },
    //     { status: 400 },
    //   );
    // }

    // Parse the request body to get the status
    const body = await request.json();
    const { status } = body;



    // Update accounts status in the database
    await db.query("UPDATE ACCOUNTS_ADMIN SET STATUS = ? WHERE ID = ?", [
      status,
      accountsAdminId,
    ]);

    return NextResponse.json(
      {
        message: `accounts status updated to ${status === 1 ? "active" : "inactive"}`,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating Accounts Admin status:", error);
    return NextResponse.json(
      { error: "Failed to update Accounts Admin status" },
      { status: 500 },
    );
  }
}

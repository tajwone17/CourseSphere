import {  NextResponse } from "next/server";
import db from "@/app/lib/db";

export async function GET() {
  try {
    // Define the CountResult interface for type safety
    interface CountResult {
      count: number;
    }

    interface Deadline {
      course_registration_without_fine: string;
      course_registration_with_fine: string;
      admit_card_collection: string;
    }

    // Get total approved course registrations
    const [approvedCountResult] = await db.query(
      "SELECT COUNT(*) as count FROM course_registration WHERE STATUS = 'APPROVED'",
    );
    const approvedCountArray = approvedCountResult as CountResult[];
    const approvedCount = approvedCountArray[0]?.count || 0;

    // Get total rejected course registrations
    const [rejectedCountResult] = await db.query(
      "SELECT COUNT(*) as count FROM course_registration WHERE STATUS = 'REJECTED'",
    );
    const rejectedCountArray = rejectedCountResult as CountResult[];
    const rejectedCount = rejectedCountArray[0]?.count || 0;

    // Get total pending course registrations
    const [pendingCountResult] = await db.query(
      "SELECT COUNT(*) as count FROM course_registration WHERE STATUS = 'PENDING'",
    );
    const pendingCountArray = pendingCountResult as CountResult[];
    const pendingCount = pendingCountArray[0]?.count || 0;

    // Get remaining hours before next deadline
    let hoursRemaining = 0;
    // Get the closest deadline
    const [deadlinesResult] = await db.query(
      "SELECT * FROM deadlines ORDER BY course_registration_without_fine ASC LIMIT 1",
    );

    const deadlines = deadlinesResult as Deadline[];

    if (deadlines && deadlines.length > 0) {
      const closestDeadline = new Date(
        deadlines[0].course_registration_without_fine,
      );
      const now = new Date();
      const diff = closestDeadline.getTime() - now.getTime();
      hoursRemaining = Math.max(0, Math.floor(diff / (1000 * 60 * 60)));
    }

    return NextResponse.json({
      approvedCount,
      rejectedCount,
      pendingCount,
      hoursRemaining,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard statistics" },
      { status: 500 },
    );
  }
}

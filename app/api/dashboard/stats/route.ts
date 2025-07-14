import { NextResponse } from "next/server";
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
    let nextDeadline = null;

    // Get all deadlines
    const [deadlinesResult] = await db.query(
      "SELECT * FROM deadlines WHERE course_registration_without_fine >= CURDATE() OR course_registration_with_fine >= CURDATE() OR admit_card_collection >= CURDATE()",
    );

    const deadlines = deadlinesResult as Deadline[];
    const now = new Date();

    if (deadlines && deadlines.length > 0) {
      // Find closest deadline date
      let closestTimestamp = Number.MAX_VALUE;
      let closestDeadlineType = "";
      let closestDeadlineDate = "";

      // Check all deadlines from all departments
      for (const deadline of deadlines) {
        // Helper function to check each deadline type
        const checkDate = (dateStr: string | null, type: string) => {
          if (!dateStr) return;

          const deadlineDate = new Date(dateStr);
          // Skip past dates
          if (deadlineDate <= now) return;

          const timestamp = deadlineDate.getTime();
          if (timestamp < closestTimestamp) {
            closestTimestamp = timestamp;
            closestDeadlineType = type;
            closestDeadlineDate = dateStr;
          }
        };

        // Check all deadline types
        checkDate(
          deadline.course_registration_without_fine,
          "Course Registration (Without Fine)",
        );
        checkDate(
          deadline.course_registration_with_fine,
          "Course Registration (With Fine)",
        );
        checkDate(deadline.admit_card_collection, "Admit Card Collection");
      }

      // Calculate hours remaining to the closest deadline
      if (closestTimestamp !== Number.MAX_VALUE) {
        const diff = closestTimestamp - now.getTime();
        hoursRemaining = Math.max(0, Math.floor(diff / (1000 * 60 * 60)));

        nextDeadline = {
          type: closestDeadlineType,
          date: closestDeadlineDate,
        };
      }
    }

    return NextResponse.json({
      approvedCount,
      rejectedCount,
      pendingCount,
      hoursRemaining,
      nextDeadline,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard statistics" },
      { status: 500 },
    );
  }
}

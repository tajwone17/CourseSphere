import { NextResponse } from "next/server";
import db from "@/app/lib/db";

export async function GET() {
  try {
    // Get urgent approvals with their details (approaching deadlines)
    // Check if there are pending approvals in the database
    const [courseRegistrations] = await db.query(`
  SELECT COUNT(*) as count 
  FROM course_registration cr
  JOIN registration_bundle rb ON cr.BUNDLE_ID = rb.ID
  WHERE cr.STATUS = 'APPROVED' 
  AND (rb.HOD_APPROVAL = 0 OR rb.ADVISOR_APPROVAL = 0 OR rb.ACCOUNTS_ADMIN_APPROVAL = 0)
`);

    // Type the result to avoid any
    interface CountResult {
      count: number;
    }

    // If there are no pending registrations, return an empty array
    const registrations = courseRegistrations as CountResult[];
    const registrationCount = registrations[0]?.count || 0;

    if (registrationCount === 0) {
      return NextResponse.json([]);
    }

    const [urgentApprovals] = await db.query(`
      SELECT 
        cr.ID as id,
        s.NAME as student,
        s.REGISTRATION_NUMBER as regId,
        rb.CREATED_AT as submissionDate,
        c.TITLE as courseTitle,
        c.CODE as courseCode,
        d.course_registration_with_fine as deadline
      FROM 
        course_registration cr
      JOIN 
        registration_bundle rb ON cr.BUNDLE_ID = rb.ID
      JOIN 
        student s ON rb.STUDENT_ID = s.ID
      JOIN 
        course c ON cr.COURSE_ID = c.ID
      LEFT JOIN 
        deadlines d ON s.DEPARTMENT_ID = d.department_id
      WHERE 
        cr.STATUS = 'APPROVED'
        AND (rb.HOD_APPROVAL = 0 OR rb.ADVISOR_APPROVAL = 0 OR rb.ACCOUNTS_ADMIN_APPROVAL = 0)
      ORDER BY 
        d.course_registration_with_fine ASC
      LIMIT 10
    `);

    // Process the results to group courses by student
    const groupedApprovals = [];
    const processedBundles = new Map();

    // Type the approval objects
    interface Approval {
      id: number;
      student: string;
      regId: string;
      submissionDate: string;
      courseTitle: string;
      courseCode: string;
      deadline: string;
    }

    // Cast urgentApprovals to an array of Approval objects
    const approvals = urgentApprovals as Approval[];

    for (const approval of approvals) {
      const bundleId = approval.id;

      if (!processedBundles.has(bundleId)) {
        processedBundles.set(bundleId, {
          id: bundleId,
          student: approval.student,
          regId: approval.regId,
          submissionDate: approval.submissionDate
            ? new Date(approval.submissionDate).toISOString().split("T")[0]
            : null,
          courses: [approval.courseTitle],
          deadline: approval.deadline
            ? new Date(approval.deadline).toISOString().split("T")[0]
            : null,
        });
      } else {
        const existingBundle = processedBundles.get(bundleId);
        existingBundle.courses.push(approval.courseTitle);
      }
    }

    // Convert map to array
    for (const [, value] of processedBundles) {
      groupedApprovals.push(value);
    }

    return NextResponse.json(groupedApprovals);
  } catch (error) {
    console.error("Error fetching urgent approvals:", error);
    return NextResponse.json(
      { error: "Failed to fetch urgent approvals" },
      { status: 500 },
    );
  }
}

import { NextRequest } from "next/server";
import db from "@/app/lib/db";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const bundleId = params.id;
    
    if (!bundleId) {
      return Response.json({ 
        error: "Bundle ID is required" 
      }, { status: 400 });
    }

    // Get the registration bundle with all details
    const [bundles]: any = await db.query(
      `SELECT 
        rb.*, 
        s.ID as student_id,
        s.NAME as student_name,
        s.EMAIL as student_email,
        s.REGISTRATION_NUMBER,
        s.MOBILE as student_mobile,
        d.ID as department_id,
        d.DEPARTMENT_NAME
      FROM registration_bundle rb
      JOIN student s ON rb.STUDENT_ID = s.ID
      JOIN department d ON s.DEPARTMENT_ID = d.ID
      WHERE rb.ID = ?`,
      [bundleId]
    );
    
    if (!bundles || bundles.length === 0) {
      return Response.json({ 
        error: "Registration bundle not found" 
      }, { status: 404 });
    }

    const bundle = bundles[0];
    
    // Get all courses in this registration
    const [courses]: any = await db.query(
      `SELECT 
        cr.*,
        c.CODE as course_code,
        c.TITLE as course_title,
        c.CREDIT as course_credit,
        c.INSTRUCTOR_NAME as instructor,
        a.NAME as advisor_name,
        a.EMAIL as advisor_email
      FROM course_registration cr
      JOIN course c ON cr.COURSE_ID = c.ID
      LEFT JOIN advisor a ON cr.ADVISOR_ID = a.ID
      WHERE cr.BUNDLE_ID = ?`,
      [bundleId]
    );

    // Get all available advisors for the department
    const [advisors]: any = await db.query(
      `SELECT ID, NAME, EMAIL 
       FROM advisor
       WHERE DEPARTMENT_ID = ?`,
      [bundle.department_id]
    );

    return Response.json({ 
      success: true, 
      bundle,
      courses,
      advisors: advisors || []
    });
  } catch (error) {
    console.error("Error fetching registration details:", error);
    return Response.json({ 
      error: "Failed to fetch registration details" 
    }, { status: 500 });
  }
}

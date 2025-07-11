import { NextRequest } from "next/server";
import db from "@/app/lib/db";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    const bundleId = request.nextUrl.searchParams.get("bundleId");
    
    if (!userId && !bundleId) {
      return Response.json({ 
        error: "Either userId or bundleId is required" 
      }, { status: 400 });
    }

    let query, params;
    
    if (bundleId) {
      // Get by specific bundle ID
      query = `
        SELECT 
          rb.*, 
          s.NAME as student_name,
          s.EMAIL as student_email,
          d.DEPARTMENT_NAME as department_name
        FROM registration_bundle rb
        JOIN student s ON rb.STUDENT_ID = s.ID
        JOIN department d ON s.DEPARTMENT_ID = d.ID
        WHERE rb.ID = ?
      `;
      params = [bundleId];
    } else {
      // Get latest registration bundle for a user
      query = `
        SELECT 
          rb.*, 
          s.NAME as student_name,
          s.EMAIL as student_email,
          d.DEPARTMENT_NAME as department_name
        FROM registration_bundle rb
        JOIN student s ON rb.STUDENT_ID = s.ID
        JOIN department d ON s.DEPARTMENT_ID = d.ID
        WHERE rb.STUDENT_ID = ?
        ORDER BY rb.CREATED_AT DESC
        LIMIT 1
      `;
      params = [userId];
    }

    const [bundles]: any = await db.query(query, params);
    
    if (!bundles || bundles.length === 0) {
      return Response.json({ 
        error: "No registration found" 
      }, { status: 404 });
    }

    const bundle = bundles[0];
    
    // Get the registered courses for this bundle
    const [courses]: any = await db.query(
      `SELECT 
        cr.ID as registration_id,
        cr.COURSE_ID,
        cr.STATUS,
        cr.ADVISOR_COMMENT,
        c.TITLE as course_title,
        c.CODE as course_code,
        c.CREDIT as course_credit,
        c.INSTRUCTOR_NAME as instructor,
        a.NAME as advisor_name,
        a.EMAIL as advisor_email
      FROM course_registration cr
      JOIN course c ON cr.COURSE_ID = c.ID
      LEFT JOIN advisor a ON cr.ADVISOR_ID = a.ID
      WHERE cr.BUNDLE_ID = ?`,
      [bundle.ID]
    );

    // Get payment info if exists
    const [payments]: any = await db.query(
      `SELECT * FROM payment WHERE BUNDLE_ID = ?`,
      [bundle.ID]
    );

    // Create human-readable status message
    let statusMessage = "";
    let nextStep = "";
    
    switch(bundle.STATUS) {
      case "PENDING":
        statusMessage = "Your registration is pending review.";
        nextStep = "Wait for advisor approval.";
        break;
      case "PARTIALLY_APPROVED":
        statusMessage = "Your registration is partially approved.";
        if (!bundle.ADVISOR_APPROVAL)
          nextStep = "Waiting for advisor approval.";
        else if (!bundle.HOD_APPROVAL)
          nextStep = "Waiting for HOD approval.";
        else if (!bundle.ACCOUNTS_ADMIN_APPROVAL)
          nextStep = "Waiting for accounts approval.";
        break;
      case "APPROVED":
        statusMessage = "Your registration is approved.";
        if (bundle.PAYMENT_STATUS === "PENDING")
          nextStep = "Proceed to payment.";
        else
          nextStep = "Your registration is complete.";
        break;
      case "REJECTED":
        statusMessage = "Your registration was rejected.";
        nextStep = "Please contact your advisor or department for more information.";
        break;
      case "COMPLETED":
        statusMessage = "Your registration is complete.";
        nextStep = "You can now access your courses.";
        break;
    }

    return Response.json({ 
      success: true, 
      registration: {
        ...bundle,
        courses,
        payments: payments || [],
        statusMessage,
        nextStep
      }
    });
  } catch (error) {
    console.error("Error fetching registration status:", error);
    return Response.json({ 
      error: "Failed to fetch registration status" 
    }, { status: 500 });
  }
}

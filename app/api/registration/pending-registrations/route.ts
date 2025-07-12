import { NextRequest } from "next/server";
import db from "@/app/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const userRole = searchParams.get("role");
    const departmentId = searchParams.get("departmentId");
    
    if (!userRole) {
      return Response.json({ 
        error: "User role is required" 
      }, { status: 400 });
    }

    // Validate user role
    const validRoles = ['advisor', 'hod', 'accounts_admin'];
    if (!validRoles.includes(userRole)) {
      return Response.json({ 
        error: `Invalid user role. Must be one of: ${validRoles.join(', ')}` 
      }, { status: 400 });
    }

    // Validate department ID if provided
    if (departmentId && !/^\d+$/.test(departmentId)) {
      return Response.json({ 
        error: "Department ID must be a number" 
      }, { status: 400 });
    }

    let query = "";
    let params: any[] = [];

    // Different queries based on role to maintain hierarchy
    if (userRole === "advisor") {
      // Advisors see students with PENDING status only (not yet approved by anyone)
      query = `
        SELECT 
          rb.ID as BUNDLE_ID,
          rb.STUDENT_ID,
          rb.SEMESTER,
          rb.STATUS,
          rb.SUBMITTED_AT,
          rb.TOTAL_AMOUNT,
          s.NAME as student_name,
          s.EMAIL as student_email,
          s.REGISTRATION_NUMBER,
          s.STATUS as account_status,
          d.ID as DEPARTMENT_ID,
          d.DEPARTMENT_NAME,
          COUNT(cr.ID) as course_count
        FROM registration_bundle AS rb
        JOIN student s ON rb.STUDENT_ID = s.ID
        JOIN department d ON s.DEPARTMENT_ID = d.ID
        JOIN course_registration cr ON rb.ID = cr.BUNDLE_ID
        WHERE rb.STATUS = 'PENDING' AND rb.ADVISOR_APPROVAL = 0
          ${departmentId ? "AND d.ID = ?" : ""}
        GROUP BY rb.ID
        ORDER BY rb.SUBMITTED_AT DESC
      `;
      
      if (departmentId) params.push(departmentId);
    } 
    else if (userRole === "hod") {
      // HOD sees registrations that have been approved by advisors but not by HOD
      query = `
        SELECT 
          rb.ID as BUNDLE_ID,
          rb.STUDENT_ID,
          rb.SEMESTER,
          rb.STATUS,
          rb.SUBMITTED_AT,
          rb.TOTAL_AMOUNT,
          s.NAME as student_name,
          s.EMAIL as student_email,
          s.REGISTRATION_NUMBER,
          s.STATUS as account_status,
          d.ID as DEPARTMENT_ID,
          d.DEPARTMENT_NAME,
          COUNT(cr.ID) as course_count
        FROM registration_bundle rb
        JOIN student s ON rb.STUDENT_ID = s.ID
        JOIN department d ON s.DEPARTMENT_ID = d.ID
        JOIN course_registration cr ON rb.ID = cr.BUNDLE_ID
        WHERE rb.ADVISOR_APPROVAL = 1 AND rb.HOD_APPROVAL = 0 AND rb.STATUS <> 'REJECTED'
          ${departmentId ? "AND d.ID = ?" : ""}
        GROUP BY rb.ID
        ORDER BY rb.SUBMITTED_AT DESC
      `;
      
      if (departmentId) params.push(departmentId);
    }
    else if (userRole === "accounts_admin") {
      // Accounts admin sees registrations approved by HOD but not by accounts
      query = `
        SELECT 
          rb.ID as BUNDLE_ID,
          rb.STUDENT_ID,
          rb.SEMESTER,
          rb.STATUS,
          rb.SUBMITTED_AT,
          rb.TOTAL_AMOUNT,
          s.NAME as student_name,
          s.EMAIL as student_email,
          s.REGISTRATION_NUMBER,
          s.STATUS as account_status,
          d.ID as DEPARTMENT_ID,
          d.DEPARTMENT_NAME,
          COUNT(cr.ID) as course_count
        FROM registration_bundle rb
        JOIN student s ON rb.STUDENT_ID = s.ID
        JOIN department d ON s.DEPARTMENT_ID = d.ID
        JOIN course_registration cr ON rb.ID = cr.BUNDLE_ID
        WHERE rb.HOD_APPROVAL = 1 AND rb.ACCOUNTS_ADMIN_APPROVAL = 0 AND rb.STATUS <> 'REJECTED'
          ${departmentId ? "AND d.ID = ?" : ""}
        GROUP BY rb.ID
        ORDER BY rb.SUBMITTED_AT DESC
      `;
      
      if (departmentId) params.push(departmentId);
    }

    const [registrations]: any = await db.query(query, params);

    return Response.json({ 
      success: true, 
      registrations,
      counts: {
        total: registrations.length,
        pending: registrations.filter((reg: any) => reg.STATUS === 'PENDING').length,
        partiallyApproved: registrations.filter((reg: any) => reg.STATUS === 'PARTIALLY_APPROVED').length,
        rejected: registrations.filter((reg: any) => reg.STATUS === 'REJECTED').length
      }
    });
  } catch (error) {
    console.error("Error fetching pending registrations:", error);
    return Response.json({ 
      error: "Failed to fetch registration requests" 
    }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import db from "../../lib/db";
import { RowDataPacket } from "mysql2";

// Define interfaces for our data types
interface StudentRow extends RowDataPacket {
  ID: number;
  NAME: string;
  DEPARTMENT_ID: number;
  SESSION: string;
}

interface DepartmentRow extends RowDataPacket {
  TOTAL_CREDITS: number;
}

interface CompletedCreditsRow extends RowDataPacket {
  COMPLETED_CREDITS: number | null;
}

interface CourseCountRow extends RowDataPacket {
  COURSE_COUNT: number | null;
}

interface PaymentRow extends RowDataPacket {
  TOTAL_AMOUNT: number;
}

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get student ID from token (in a production app, you'd verify the token)
    const token = authHeader.split(" ")[1];

    // For demonstration, we'll assume the token is the student ID
    // In a real app, you would decode and verify the JWT token
    const studentId = token;

    // Get student's information including department
    const [studentRows] = await db.execute<StudentRow[]>(
      `SELECT s.ID, s.NAME, s.DEPARTMENT_ID, s.SESSION 
       FROM student s 
       WHERE s.ID = ?`,
      [studentId],
    );

    if (studentRows.length === 0) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const student = studentRows[0];

    // Get department's total credits
    const [departmentRows] = await db.execute<DepartmentRow[]>(
      `SELECT TOTAL_CREDITS 
       FROM department 
       WHERE ID = ?`,
      [student.DEPARTMENT_ID],
    );

    if (departmentRows.length === 0) {
      return NextResponse.json(
        { error: "Department not found" },
        { status: 404 },
      );
    }

    const department = departmentRows[0];
    const totalCredits = department.TOTAL_CREDITS;

    // Calculate completed credits by joining results with course table
    const [completedCreditsRows] = await db.execute<CompletedCreditsRow[]>(
      `SELECT SUM(c.CREDIT) as COMPLETED_CREDITS
       FROM results r
       JOIN course c ON r.COURSE_ID = c.ID
       WHERE r.STUDENT_ID = ? AND r.GRADE != 'F'`,
      [studentId],
    );

    const completedCreditsData = completedCreditsRows[0];
    const completedCredits = completedCreditsData.COMPLETED_CREDITS || 0;

    // Get current registered courses count for this semester
    const [currentSemesterRows] = await db.execute<CourseCountRow[]>(
      `SELECT COUNT(*) as COURSE_COUNT
       FROM registered_courses
       WHERE STUDENT_ID = ? AND SEMESTER = (
         SELECT MAX(SEMESTER) FROM registered_courses WHERE STUDENT_ID = ?
       )`,
      [studentId, studentId],
    );

    const currentSemesterData = currentSemesterRows[0];
    const registeredCourses = currentSemesterData.COURSE_COUNT || 0;

    // Calculate current semester based on the student's session
    const session = student.SESSION;
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    // Parse the session year (assuming format like "Fall-2022")
    const sessionParts = session?.split("-");
    const startYear =
      sessionParts && sessionParts.length > 1
        ? parseInt(sessionParts[1])
        : currentYear;

    // Calculate years passed
    const yearsPassed = currentYear - startYear;

    // Calculate semester number (assuming 3 semesters per year)
    let semesterNumber = yearsPassed * 3;

    // Add current semester based on month
    if (currentMonth >= 0 && currentMonth <= 3) {
      // Spring (January - April)
      semesterNumber += 1;
    } else if (currentMonth >= 4 && currentMonth <= 7) {
      // Summer (May - August)
      semesterNumber += 2;
    } else {
      // Fall (September - December)
      semesterNumber += 3;
    }

    // Determine current semester name
    let currentSemester = "";
    const semesterMod = semesterNumber % 3;

    if (semesterMod === 1) {
      currentSemester = `Spring ${currentYear}`;
    } else if (semesterMod === 2) {
      currentSemester = `Summer ${currentYear}`;
    } else {
      currentSemester = `Fall ${currentYear}`;
    }

    // Get pending payment information
    const [paymentRows] = await db.execute<PaymentRow[]>(
      `SELECT rb.TOTAL_AMOUNT
       FROM registration_bundle rb
       WHERE rb.STUDENT_ID = ? AND rb.PAYMENT_STATUS = 'PENDING'
       ORDER BY rb.CREATED_AT DESC
       LIMIT 1`,
      [studentId],
    );

    const pendingPayment =
      paymentRows.length > 0 ? paymentRows[0].TOTAL_AMOUNT : 0;

    return NextResponse.json({
      success: true,
      data: {
        studentName: student.NAME,
        totalCredits,
        completedCredits,
        registeredCourses,
        currentSemester,
        pendingPayment,
      },
    });
  } catch (error) {
    console.error("Error fetching student dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch student dashboard data" },
      { status: 500 },
    );
  }
}

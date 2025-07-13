import { NextResponse } from "next/server";
import db from "../../lib/db";
import { RowDataPacket } from "mysql2";

// Define interfaces for our data types
interface StudentRow extends RowDataPacket {
  ID: number;
  NAME: string;
  DEPARTMENT_ID: number;
  SESSION: string;
  REGISTRATION_NUMBER: string;
}

interface DepartmentRow extends RowDataPacket {
  TOTAL_CREDITS: number;
  DEPARTMENT_NAME: string;
}

interface CompletedCreditsRow extends RowDataPacket {
  COMPLETED_CREDITS: number | null;
}

interface CourseCountRow extends RowDataPacket {
  COURSE_COUNT: number | null;
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
      `SELECT s.ID, s.NAME, s.DEPARTMENT_ID, s.SESSION, s.REGISTRATION_NUMBER
       FROM student s 
       WHERE s.ID = ?`,
      [studentId],
    );

    if (studentRows.length === 0) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const student = studentRows[0];

    // Get department's total credits and name
    const [departmentRows] = await db.execute<DepartmentRow[]>(
      `SELECT TOTAL_CREDITS, DEPARTMENT_NAME
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
    const departmentTotalCredits = department.TOTAL_CREDITS;

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
    let semesterNumber = yearsPassed * 2;

    // Add current semester based on month
    if (currentMonth >= 0 && currentMonth <= 6) {
      // Spring (January - June)
      semesterNumber += 1;
    } else if (currentMonth >= 7 && currentMonth <= 12) {
      // Summer (July - December)
      semesterNumber += 2;
    } 

    // Determine current semester name
    let currentSemester = "";
    const semesterMod = semesterNumber % 2;

    if (semesterMod === 1) {
      currentSemester = `Spring ${currentYear}`;
    } else if (semesterMod === 2) {
      currentSemester = `Summer ${currentYear}`;
    } 

    // Calculate CGPA from the results table
    const [gradeRows] = await db.execute<RowDataPacket[]>(
      `SELECT r.GRADE, c.CREDIT
       FROM results r
       JOIN course c ON r.COURSE_ID = c.ID
       WHERE r.STUDENT_ID = ?`,
      [studentId],
    );

    // Convert letter grades to grade points
    let totalGradePoints = 0;
    let creditsAttempted = 0;

    for (const row of gradeRows) {
      let gradePoint = 0;

      switch (row.GRADE) {
        case "A+":
          gradePoint = 4.0;
          break;
        case "A":
          gradePoint = 3.75;
          break;
        case "A-":
          gradePoint = 3.5;
          break;
        case "B+":
          gradePoint = 3.3;
          break;
        case "B":
          gradePoint = 3.0;
          break;
        case "B-":
          gradePoint = 2.7;
          break;
        case "C+":
          gradePoint = 2.3;
          break;
        case "C":
          gradePoint = 2.0;
          break;
        case "D":
          gradePoint = 1.0;
          break;
        case "F":
          gradePoint = 0.0;
          break;
        default:
          gradePoint = 0.0;
      }

      totalGradePoints += gradePoint * row.CREDIT;
      creditsAttempted += row.CREDIT;
    }

    const cgpa =
      creditsAttempted > 0
        ? (totalGradePoints / creditsAttempted).toFixed(2)
        : "0.00";

    return NextResponse.json({
      success: true,
      data: {
        studentName: student.NAME,
        studentId: student.REGISTRATION_NUMBER,
        departmentName: department.DEPARTMENT_NAME,
        totalCredits: departmentTotalCredits,
        completedCredits,
        registeredCourses,
        currentSemester,
        cgpa,
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

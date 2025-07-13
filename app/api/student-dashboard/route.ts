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

interface RegisteredCourseRow extends RowDataPacket {
  // Define all possible case variations of column names
  COURSE_CODE?: string;
  course_code?: string;
  Course_Code?: string;
  COURSE_TITLE?: string;
  course_title?: string;
  Title?: string;
  COURSE_CREDIT?: number;
  course_credit?: number;
  Credit?: number;
  STATUS?: string;
  status?: string;
  Status?: string;
  REGISTRATION_DATE?: string;
  registration_date?: string;
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
    const registeredCoursesCount = currentSemesterData.COURSE_COUNT || 0;

    // Calculate current semester based on the student's session
    const session = student.SESSION;
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    // Parse the session year (assuming format like "Spring-2022" or "Summer-2022")
    const sessionParts = session?.split("-");
    let startYear;

    // Handle different session format patterns
    if (sessionParts && sessionParts.length > 1) {
      // Try to extract a 4-digit year
      const yearMatch = sessionParts[1].match(/\d{4}/);
      if (yearMatch) {
        startYear = parseInt(yearMatch[0]);
      } else if (sessionParts[1].startsWith("20")) {
        // If it's like "Spring-202" (incomplete year), assume it's 2020s
        startYear = parseInt("20" + sessionParts[1].substring(2));
      } else {
        startYear = currentYear - 1; // Default fallback
      }
    } else {
      startYear = currentYear - 1; // Default if no valid session
    }

    // Calculate years passed
    const yearsPassed = currentYear - startYear;

    // Calculate semester number (assuming 2 semesters per year)
    let semesterNumber = yearsPassed * 2;

    // Add current semester based on month
    if (currentMonth >= 0 && currentMonth <= 5) {
      // Spring (January - June)
      semesterNumber += 1;
    } else {
      // Summer (July - December)
      semesterNumber += 2;
    }

    // Determine current semester name
    let currentSemesterName = "";
    const semesterMod = semesterNumber % 2;

    if (semesterMod === 1) {
      currentSemesterName = `Spring ${currentYear}`;
    } else {
      currentSemesterName = `Summer ${currentYear}`;
    }

    // Calculate which numbered semester the student is in (1st, 2nd, etc.)
    let semesterOrdinal = "";
    if (semesterNumber === 1) {
      semesterOrdinal = "1st";
    } else if (semesterNumber === 2) {
      semesterOrdinal = "2nd";
    } else if (semesterNumber === 3) {
      semesterOrdinal = "3rd";
    } else {
      semesterOrdinal = `${semesterNumber}th`;
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
          gradePoint = 3.25;
          break;
        case "B":
          gradePoint = 3.0;
          break;
        case "B-":
          gradePoint = 2.75;
          break;
        case "C+":
          gradePoint = 2.5;
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

    // Get important registration deadlines
    const [deadlinesRows] = await db.execute<RowDataPacket[]>(
      `SELECT 
        course_registration_without_fine,
        course_registration_with_fine,
        admit_card_collection
       FROM deadlines
       WHERE department_id = ?
       ORDER BY id DESC LIMIT 1`,
      [student.DEPARTMENT_ID],
    );

    // Format the deadlines
    const deadlines = deadlinesRows.length > 0 ? deadlinesRows[0] : null;

    // Create an array of important dates
    const importantDates = [];

    if (deadlines) {
      // Helper function to add days remaining to description
      const addDaysRemaining = (date: Date | string | null): string => {
        if (!date) return "";
        const deadlineDate = new Date(date);
        const today = new Date();
        const timeDiff = deadlineDate.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

        if (daysDiff > 0) {
          return daysDiff === 1
            ? " (Tomorrow)"
            : ` (${daysDiff} days remaining)`;
        } else if (daysDiff === 0) {
          return " (Today)";
        } else {
          return " (Passed)";
        }
      };

      if (deadlines.course_registration_without_fine) {
        const date = new Date(deadlines.course_registration_without_fine);
        importantDates.push({
          title: "Course Registration (Regular)",
          date: date.toISOString().split("T")[0],
          description: `Last day to register without fine${addDaysRemaining(date)}`,
          urgent:
            date >= new Date() &&
            date <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
      }

      if (deadlines.course_registration_with_fine) {
        const date = new Date(deadlines.course_registration_with_fine);
        importantDates.push({
          title: "Course Registration (Late)",
          date: date.toISOString().split("T")[0],
          description: `Last day to register with fine${addDaysRemaining(date)}`,
          urgent:
            date >= new Date() &&
            date <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        });
      }

      if (deadlines.admit_card_collection) {
        const date = new Date(deadlines.admit_card_collection);
        importantDates.push({
          title: "Admit Card Collection",
          date: date.toISOString().split("T")[0],
          description: `Last day to collect admit cards${addDaysRemaining(date)}`,
          urgent:
            date >= new Date() &&
            date <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        });
      }
    }

    // Get registered courses for the current semester
    const [registeredCoursesRows] = await db.execute<RegisteredCourseRow[]>(
      `SELECT 
        c.CODE as COURSE_CODE, 
        c.TITLE as COURSE_TITLE, 
        c.CREDIT as COURSE_CREDIT,
        'Registered' as STATUS, -- Assuming all courses are registered
        rc.REGISTRATION_DATE as REGISTRATION_DATE
       FROM registered_courses rc
       JOIN course c ON rc.COURSE_ID = c.ID
       WHERE rc.STUDENT_ID = ? AND rc.SEMESTER = ?
       ORDER BY rc.REGISTRATION_DATE DESC
       LIMIT 10`,
      [studentId, currentSemesterName],
    );

    // Log the first row to see what's returned (for debugging)
    if (registeredCoursesRows.length > 0) {
      console.log(
        "First registered course row:",
        JSON.stringify(registeredCoursesRows[0]),
      );
    } else {
      console.log(
        "No registered courses found for student ID:",
        studentId,
        "and semester:",
        currentSemesterName,
      );
    }

    // Format the registered courses
    const recentRegistrations = Array.isArray(registeredCoursesRows)
      ? registeredCoursesRows.map((course) => {
          // MySQL column names might be case-sensitive or not depending on settings
          // Check all possible case variations for course code
          const courseCode =
            course.COURSE_CODE ||
            course.course_code ||
            course.Course_Code ||
            null;

          // Add additional logging to debug any issues
          if (!courseCode) {
            console.warn(
              "Missing course code in registered course data:",
              course,
            );
          }

          return {
            courseCode: courseCode || "N/A",
            title:
              course.COURSE_TITLE ||
              course.course_title ||
              course.Title ||
              "Unknown Course",
            credits:
              course.COURSE_CREDIT ||
              course.course_credit ||
              course.Credit ||
              0,
            status:
              course.STATUS || course.status || course.Status || "Pending",
            date:
              course.REGISTRATION_DATE || course.registration_date
                ? new Date(
                    course.REGISTRATION_DATE || course.registration_date || "",
                  )
                    .toISOString()
                    .split("T")[0]
                : new Date().toISOString().split("T")[0],
          };
        })
      : [];

    return NextResponse.json({
      success: true,
      data: {
        studentName: student.NAME,
        studentId: student.REGISTRATION_NUMBER,
        departmentName: department.DEPARTMENT_NAME,
        totalCredits: departmentTotalCredits,
        completedCredits,
        registeredCourses: registeredCoursesCount,
        currentSemester: currentSemesterName,
        semesterOrdinal,
        cgpa,
        importantDates,
        recentRegistrations,
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

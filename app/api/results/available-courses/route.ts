import { NextRequest } from "next/server";
import db from "@/app/lib/db";

export async function GET(request: NextRequest) {
  try {
    const studentId = request.nextUrl.searchParams.get("studentId");
    
    if (!studentId) {
      return Response.json({ 
        error: "Student ID is required" 
      }, { status: 400 });
    }
    
    // Get student ID from registration number
    const [students]: any = await db.query(
      `SELECT s.ID, s.DEPARTMENT_ID 
       FROM student s
       WHERE s.REGISTRATION_NUMBER = ?`,
      [studentId]
    );
    
    if (!students || students.length === 0) {
      return Response.json({ 
        error: "Student not found" 
      }, { status: 404 });
    }
    
    const student = students[0];
    
    // Get all courses from student's department
    const [departmentCourses]: any = await db.query(
      `SELECT c.ID, c.CODE, c.TITLE, c.CREDIT, c.INSTRUCTOR_NAME
       FROM course c
       WHERE c.DEPARTMENT_ID = ? AND c.STATUS = 1`,
      [student.DEPARTMENT_ID]
    );
    
    // Get passed courses (all courses the student has passed)
    const [passedCourses]: any = await db.query(
      `SELECT r.COURSE_ID
       FROM results r
       WHERE r.STUDENT_ID = ? AND r.GRADE != 'F'
       GROUP BY r.COURSE_ID`,
      [student.ID]
    );
    
    // Get failed courses (courses the student has attempted but failed)
    const [failedCourses]: any = await db.query(
      `SELECT r.COURSE_ID, c.CODE, c.TITLE, c.CREDIT, c.INSTRUCTOR_NAME
       FROM results r
       JOIN course c ON r.COURSE_ID = c.ID
       WHERE r.STUDENT_ID = ? AND r.GRADE = 'F'
       AND NOT EXISTS (
         SELECT 1 FROM results r2 
         WHERE r2.STUDENT_ID = r.STUDENT_ID 
         AND r2.COURSE_ID = r.COURSE_ID 
         AND r2.GRADE != 'F'
       )
       GROUP BY r.COURSE_ID`,
      [student.ID]
    );
    
    // Set of passed course IDs for quick lookup
    const passedCourseIds = new Set(passedCourses.map((c: any) => c.COURSE_ID));
    
    // Available courses = department courses that haven't been passed
    const availableCourses = departmentCourses.filter(
      (course: any) => !passedCourseIds.has(course.ID)
    );
    
    return Response.json({
      success: true,
      availableCourses,
      retakeCourses: failedCourses
    });
  } catch (error) {
    console.error("Error fetching available courses:", error);
    return Response.json({ 
      error: "Failed to fetch available courses" 
    }, { status: 500 });
  }
}

import { NextRequest } from "next/server";
import db from "@/app/lib/db";

export async function GET(request: NextRequest) {
  try {
    const studentId = request.nextUrl.searchParams.get("studentId");
    
    // If studentId is provided, get specific student results
    if (studentId) {
      // Get student details
      //eslint-disable-next-line
      const [students]: any = await db.query(
        `SELECT s.ID, s.REGISTRATION_NUMBER, s.NAME, s.EMAIL, d.DEPARTMENT_NAME,s.SESSION 
         FROM student s
         JOIN department d ON s.DEPARTMENT_ID = d.ID
         WHERE s.REGISTRATION_NUMBER = ?`,
        [studentId]
      );
      
      if (!students || students.length === 0) {
        return Response.json({ 
          error: "Student not found" 
        }, { status: 404 });
      }
      
      const student = students[0];
      
      // Get student results
      //eslint-disable-next-line
      const [results]: any = await db.query(
        `SELECT r.ID, r.COURSE_ID, r.GRADE, c.CODE as course_code, c.TITLE as course_title, 
                c.CREDIT as course_credit, r.SEMESTER
         FROM results r
         JOIN course c ON r.COURSE_ID = c.ID
         WHERE r.STUDENT_ID = ?
         ORDER BY r.CREATED_AT DESC`,
        [student.ID]
      );
      
      // Process results to include passed status
      //eslint-disable-next-line
      const processedResults = results.map((result: any) => {
        const passed = !["F"].includes(result.GRADE);
        return {
          ...result,
          passed
        };
      });
      
      return Response.json({
        success: true,
        student: {
          id: student.REGISTRATION_NUMBER,
          name: student.NAME,
          email: student.EMAIL,
          department: student.DEPARTMENT_NAME,
          session: student.SESSION,
          results: processedResults
        }
      });
    } 
    // Otherwise, get all students with basic info
    else {
      //eslint-disable-next-line
      const [students]: any = await db.query(
        `SELECT s.ID, s.REGISTRATION_NUMBER, s.NAME, d.DEPARTMENT_NAME,s.SESSION 
         FROM student s
         JOIN department d ON s.DEPARTMENT_ID = d.ID
         ORDER BY s.NAME`
      );
      
      return Response.json({
        success: true,
        //eslint-disable-next-line
        students: students.map((student: any) => ({
          id: student.REGISTRATION_NUMBER,
          name: student.NAME,
          department: student.DEPARTMENT_NAME,
          session:student.SESSION
        }))
      });
    }
  } catch (error) {
    console.error("Error fetching results:", error);
    return Response.json({ 
      error: "Failed to fetch results" 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { 
      studentId,
      courseId,
      grade,
      semester
    } = await request.json();
    
    if (!studentId || !courseId || !grade || !semester) {
      return Response.json({ 
        error: "Missing required fields" 
      }, { status: 400 });
    }
    
    // Get student ID from registration number
    //eslint-disable-next-line
    const [students]: any = await db.query(
      `SELECT ID FROM student WHERE REGISTRATION_NUMBER = ?`,
      [studentId]
    );
    
    if (!students || students.length === 0) {
      return Response.json({ 
        error: "Student not found" 
      }, { status: 404 });
    }
    
    const student = students[0];
    
    // Check if result already exists
    //eslint-disable-next-line
    const [existingResults]: any = await db.query(
      `SELECT ID FROM results 
       WHERE STUDENT_ID = ? AND COURSE_ID = ? AND SEMESTER = ?`,
      [student.ID, courseId, semester]
    );
    
    // Start transaction
    await db.query("START TRANSACTION");
    
    try {
      let resultId;
      
      // If result exists, update it, otherwise insert new
      if (existingResults && existingResults.length > 0) {
        await db.query(
          `UPDATE results SET GRADE = ? WHERE ID = ?`,
          [grade, existingResults[0].ID]
        );
        resultId = existingResults[0].ID;
      } else {
       
        //eslint-disable-next-line
        const [result]: any = await db.query(
          `INSERT INTO results (STUDENT_ID, COURSE_ID, GRADE, SEMESTER) 
           VALUES (?, ?, ?, ?)`,
          [student.ID, courseId, grade, semester]
        );
        resultId = result.insertId;
      }
      
      // If passed, add to registered_courses if not already there
      if (!["F"].includes(grade)) {
        // Check if course is already in registered_courses
        //eslint-disable-next-line
        const [registeredCourse]: any = await db.query(
          `SELECT ID FROM registered_courses 
           WHERE STUDENT_ID = ? AND COURSE_ID = ?`,
          [student.ID, courseId]
        );
        
        if (!registeredCourse || registeredCourse.length === 0) {
          await db.query(
            `INSERT INTO registered_courses (STUDENT_ID, COURSE_ID, SEMESTER, REGISTRATION_DATE) 
             VALUES (?, ?, ?, NOW())`,
            [student.ID, courseId, semester]
          );
        }
      } else {
        // If failed, remove from registered_courses if exists
        await db.query(
          `DELETE FROM registered_courses 
           WHERE STUDENT_ID = ? AND COURSE_ID = ?`,
          [student.ID, courseId]
        );
      }
      
      await db.query("COMMIT");
      
      return Response.json({
        success: true,
        message: "Result saved successfully",
        resultId
      });
    } catch (error) {
      await db.query("ROLLBACK");
      throw error;
    }
  } catch (error) {
    console.error("Error saving result:", error);
    return Response.json({ 
      error: "Failed to save result" 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { 
      resultId,
      grade
    } = await request.json();
    
    if (!resultId || !grade) {
      return Response.json({ 
        error: "Missing required fields" 
      }, { status: 400 });
    }
    
    // Get result details
    //eslint-disable-next-line
    const [results]: any = await db.query(
      `SELECT r.ID, r.STUDENT_ID, r.COURSE_ID, r.SEMESTER
       FROM results r
       WHERE r.ID = ?`,
      [resultId]
    );
    
    if (!results || results.length === 0) {
      return Response.json({ 
        error: "Result not found" 
      }, { status: 404 });
    }
    
    const result = results[0];
    
    // Start transaction
    await db.query("START TRANSACTION");
    
    try {
      // Update the result
      await db.query(
        `UPDATE results SET GRADE = ? WHERE ID = ?`,
        [grade, resultId]
      );
      
      // If passed, add to registered_courses if not already there
      if (!["F"].includes(grade)) {
        // Check if course is already in registered_courses
        //eslint-disable-next-line
        const [registeredCourse]: any = await db.query(
          `SELECT ID FROM registered_courses 
           WHERE STUDENT_ID = ? AND COURSE_ID = ?`,
          [result.STUDENT_ID, result.COURSE_ID]
        );
        
        if (!registeredCourse || registeredCourse.length === 0) {
          await db.query(
            `INSERT INTO registered_courses (STUDENT_ID, COURSE_ID, SEMESTER, REGISTRATION_DATE) 
             VALUES (?, ?, ?, NOW())`,
            [result.STUDENT_ID, result.COURSE_ID, result.SEMESTER]
          );
        }
      } else {
        // If failed, remove from registered_courses if exists
        await db.query(
          `DELETE FROM registered_courses 
           WHERE STUDENT_ID = ? AND COURSE_ID = ?`,
          [result.STUDENT_ID, result.COURSE_ID]
        );
      }
      
      await db.query("COMMIT");
      
      return Response.json({
        success: true,
        message: "Result updated successfully"
      });
    } catch (error) {
      await db.query("ROLLBACK");
      throw error;
    }
  } catch (error) {
    console.error("Error updating result:", error);
    return Response.json({ 
      error: "Failed to update result" 
    }, { status: 500 });
  }
}

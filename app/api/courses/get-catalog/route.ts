import { NextRequest, NextResponse } from "next/server";
import db from "@/app/lib/db";
import { RowDataPacket } from "mysql2";

interface Course extends RowDataPacket {
  ID: number;
  CODE: string;
  TITLE: string;
  CREDIT: number;
  DEPARTMENT_ID: number;
  INSTRUCTOR_NAME: string;
  prerequisites: string[];
}

interface Prerequisite extends RowDataPacket {
  COURSE_ID: number;
  TITLE: string;
  CODE: string;
}

export async function GET(request: NextRequest) {
  try {
    // Get query parameters for filtering
    const searchParams = request.nextUrl.searchParams;
    const departmentId = searchParams.get("departmentId") || null;
    const code = searchParams.get("code") || null;
    const title = searchParams.get("title") || null;
    const instructor = searchParams.get("instructor") || null;

    // Base query to get all courses with filtering options
    let courseQuery = `
      SELECT c.ID, c.CODE, c.TITLE, c.CREDIT, c.DEPARTMENT_ID, c.INSTRUCTOR_NAME, d.DEPARTMENT_NAME
      FROM course c
      JOIN department d ON c.DEPARTMENT_ID = d.ID
      WHERE c.STATUS = 1
    `;

    const queryParams = [];

    // Add filters if they're provided
    if (departmentId && departmentId !== "all") {
      courseQuery += " AND c.DEPARTMENT_ID = ?";
      queryParams.push(departmentId);
    }

    if (code) {
      courseQuery += " AND c.CODE = ?";
      queryParams.push(code);
    }

    if (title) {
      courseQuery += " AND c.TITLE = ?";
      queryParams.push(title);
    }

    if (instructor) {
      courseQuery += " AND c.INSTRUCTOR_NAME = ?";
      queryParams.push(instructor);
    }

    courseQuery += " ORDER BY c.CODE";

    // Execute the query to get courses
    const [coursesResult] = await db.query<Course[]>(courseQuery, queryParams);

    // Get all prerequisites for these courses
    const courseIds = coursesResult.map((course) => course.ID);

    let prerequisites: Prerequisite[] = [];

    if (courseIds.length > 0) {
      const prereqQuery = `
        SELECT p.COURSE_ID, c.TITLE, c.CODE
        FROM prerequisite p
        JOIN course c ON p.PREREQ_COURSE_ID = c.ID
        WHERE p.COURSE_ID IN (?)
      `;

      const [prereqResults] = await db.query<Prerequisite[]>(prereqQuery, [
        courseIds,
      ]);
      prerequisites = prereqResults;
    }

    // Map prerequisites to their respective courses
    const courses = coursesResult.map((course) => {
      const coursePrereqs = prerequisites
        .filter((prereq) => prereq.COURSE_ID === course.ID)
        .map((prereq) => prereq.TITLE);

      return {
        id: course.ID,
        code: course.CODE,
        name: course.TITLE,
        credit: course.CREDIT,
        instructor: course.INSTRUCTOR_NAME,
        department_id: course.DEPARTMENT_ID,
        department_name: course.DEPARTMENT_NAME,
        prerequisites: coursePrereqs,
      };
    });

    // Get all unique department names for the filter
    const [departments] = await db.query<RowDataPacket[]>(
      "SELECT ID, DEPARTMENT_NAME FROM department ORDER BY DEPARTMENT_NAME",
    );

    // Return both courses and departments
    return NextResponse.json({
      courses,
      departments: departments.map((dept) => ({
        id: dept.ID,
        name: dept.DEPARTMENT_NAME,
      })),
    });
  } catch (error) {
    console.error("Error fetching course catalog:", error);
    return NextResponse.json(
      { error: "Failed to fetch course catalog" },
      { status: 500 },
    );
  }
}

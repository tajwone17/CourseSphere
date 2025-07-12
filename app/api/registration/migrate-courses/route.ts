import { NextRequest } from "next/server";
import db from "@/app/lib/db";

export async function POST(request: NextRequest) {
  try {
    // This route is for migrating existing completed registrations
    // It will add all approved courses to the registered_courses table
    
    // Start a transaction
    await db.query("START TRANSACTION");
    
    try {
      // Get all completed registration bundles
      const [completedBundles]: any = await db.query(
        `SELECT ID, STUDENT_ID, SEMESTER 
         FROM registration_bundle 
         WHERE STATUS = 'COMPLETED'`
      );
      
      let migratedCount = 0;
      
      if (completedBundles && completedBundles.length > 0) {
        for (const bundle of completedBundles) {
          // Get approved courses from the bundle
          const [courses]: any = await db.query(
            `SELECT COURSE_ID FROM course_registration 
             WHERE BUNDLE_ID = ? AND STATUS = 'COMPLETED'`,
            [bundle.ID]
          );
          
          // Add each course to registered_courses
          if (courses && courses.length > 0) {
            for (const course of courses) {
              // Check if the course is already in registered_courses
              const [existingRecord]: any = await db.query(
                `SELECT ID FROM registered_courses 
                 WHERE STUDENT_ID = ? AND COURSE_ID = ?`,
                [bundle.STUDENT_ID, course.COURSE_ID]
              );
              
              // Only insert if the course is not already registered
              if (!existingRecord || existingRecord.length === 0) {
                await db.query(
                  `INSERT INTO registered_courses (STUDENT_ID, COURSE_ID, SEMESTER, REGISTRATION_DATE)
                   VALUES (?, ?, ?, NOW())`,
                  [bundle.STUDENT_ID, course.COURSE_ID, bundle.SEMESTER]
                );
                migratedCount++;
              }
            }
          }
        }
      }
      
      // Commit the transaction
      await db.query("COMMIT");
      
      return Response.json({
        success: true,
        message: `Successfully migrated ${migratedCount} courses to registered_courses table`,
        migratedCount
      });
    } catch (error) {
      // Rollback in case of any error
      await db.query("ROLLBACK");
      throw error;
    }
  } catch (error) {
    console.error("Error migrating courses to registered_courses:", error);
    return Response.json({
      error: "Failed to migrate courses to registered_courses"
    }, { status: 500 });
  }
}

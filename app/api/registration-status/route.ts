import db from "@/app/lib/db";

export async function GET() {
    const [results] = await db.query(
        `SELECT student.*, course_registration.status
         FROM student
         JOIN registration_bundle ON student.id = registration_bundle.student_id
         JOIN course_registration ON registration_bundle.bundle_id = course_registration.bundle_id`
    );
    return new Response(JSON.stringify({ students: results }), {
        status: 200,
    });
}


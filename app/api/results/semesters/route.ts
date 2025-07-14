import { NextResponse } from "next/server";
import db from "../../../lib/db";

export async function GET() {
  try {
    // Get unique semesters from student results table
    const [semestersResult] = await db.execute(
      "SELECT DISTINCT SEMESTER FROM results ORDER BY SEMESTER DESC",
    );

    if (!semestersResult) {
      return NextResponse.json(
        { error: "Failed to fetch semesters" },
        { status: 500 },
      );
    }

    // Extract semester values
    const rows = semestersResult as Array<{ SEMESTER: string }>;
    const existingSemesters = rows.map((row) => row.SEMESTER);

    // Get current year and determine current semester
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    // Add future semesters (current year + 1 year ahead) if not already in the list
    const seasonSemesters = ["Spring", "Summer", "Fall"];
    const futureSemesters = [];

    for (let year = currentYear; year <= currentYear + 1; year++) {
      for (const season of seasonSemesters) {
        const semester = `${season}-${year}`;
        if (!existingSemesters.includes(semester)) {
          futureSemesters.push(semester);
        }
      }
    }

    // Combine existing and future semesters
    const allSemesters = [...existingSemesters, ...futureSemesters];

    // Sort semesters - most recent first
    allSemesters.sort((a, b) => {
      const [aSeason, aYear] = a.split("-");
      const [bSeason, bYear] = b.split("-");

      if (aYear !== bYear) {
        return parseInt(bYear) - parseInt(aYear); // More recent years first
      }

      // Within the same year, sort by season: Spring -> Summer -> Fall
      const seasonOrder = { Spring: 1, Summer: 2, Fall: 3 };
      return (
        seasonOrder[bSeason as keyof typeof seasonOrder] -
        seasonOrder[aSeason as keyof typeof seasonOrder]
      );
    });

    return NextResponse.json({
      success: true,
      semesters: allSemesters,
    });
  } catch (error) {
    console.error("Error fetching semesters:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  HiAcademicCap,
  HiClipboardCheck,
  HiClock,
  HiCalendar,

  HiDocumentText,
  HiRefresh,
} from "react-icons/hi";
import { useAuth } from "../../context/AuthContext";

interface ImportantDate {
  title: string;
  date: string;
  description: string;
  urgent: boolean;
}

interface DashboardData {
  studentName: string;
  studentId: string;
  departmentName: string;
  totalCredits: number;
  completedCredits: number;
  registeredCourses: number;
  currentSemester: string;
  semesterOrdinal: string;
  cgpa: string;
  importantDates: ImportantDate[];
}

// Format date function with proper handling
// const formatDate = (dateString: string | null): string => {
//   if (!dateString) return "N/A";

//   try {
//     const date = new Date(dateString);
//     if (isNaN(date.getTime())) return "Invalid Date";

//     return date.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   } catch (e) {
//     console.error("Date formatting error:", e);
//     return "Error";
//   }
// };

export default function StudentDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch dashboard data - wrapped in useCallback to prevent recreation on every render
  const fetchDashboardData = useCallback(
    async (isRefresh = false) => {
      if (!user) return;

      if (isRefresh) {
        setRefreshing(true);
      }

      try {
        // Use the user ID as the token for authorization
        const response = await fetch("/api/student-dashboard", {
          headers: {
            Authorization: `Bearer ${user.id}`,
          },
          // Add cache busting parameter when refreshing
          cache: isRefresh ? "no-cache" : "default",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const result = await response.json();
        if (result.success) {
          setDashboardData(result.data);
          console.log("Dashboard Data:", result.data);
          setError(null); // Clear any previous errors on successful fetch
        } else {
          setError(result.error || "Failed to fetch dashboard data");
        }
      } catch (err) {
        setError("An error occurred while fetching dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
        if (isRefresh) {
          setRefreshing(false);
        }
      }
    },
    [user, setRefreshing, setDashboardData, setError, setLoading],
  );

  // Handle manual refresh
  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Define stats dynamically based on fetched data
  const stats = [
    {
      title: "Total Credits",
      value: dashboardData
        ? `${dashboardData.completedCredits}/${dashboardData.totalCredits}`
        : "Loading...",
      icon: HiAcademicCap,
      description: "Credits completed",
    },
    {
      title: dashboardData ? dashboardData.semesterOrdinal : "...",
      value: dashboardData ? dashboardData.currentSemester : "Loading...",
      icon: HiCalendar,
      description: "Current Semester",
    },
    {
      title: "Registered Courses",
      value: dashboardData
        ? dashboardData.registeredCourses.toString()
        : "Loading...",
      icon: HiClipboardCheck,
      description: "This semester",
    },
    {
      title: "CGPA",
      value: dashboardData ? dashboardData.cgpa : "Loading...",
      icon: HiAcademicCap,
      description: "Cumulative GPA",
    },
  ];

  // Use the dynamic importantDates from the API if available, otherwise show a fallback
  const importantDates =
    dashboardData?.importantDates && dashboardData.importantDates.length > 0
      ? dashboardData.importantDates
      : loading
        ? [
            {
              title: "Loading...",
              date: new Date().toISOString().split("T")[0],
              description: "Loading deadlines information",
              urgent: false,
            },
          ]
        : [
            {
              title: "No Deadlines",
              date: new Date().toISOString().split("T")[0],
              description:
                "No upcoming deadlines available for your department",
              urgent: false,
            },
          ];

  const recentRegistrations = [
    {
      courseCode: "CSE301",
      title: "Database Management Systems",
      credits: 3,
      status: "Approved",
    },
    {
      courseCode: "CSE311",
      title: "Computer Networks",
      credits: 3,
      status: "Pending",
    },
    {
      courseCode: "CSE325",
      title: "Operating Systems",
      credits: 3,
      status: "Pending",
    },
  ];

  // Loading state
  if (loading && !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-t-4 border-blue-500"></div>
          <p className="text-lg text-white">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="rounded-lg bg-red-100 p-6 text-center">
          <h2 className="mb-2 text-2xl font-bold text-red-800">Error</h2>
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded bg-red-700 px-4 py-2 text-white hover:bg-red-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
      {/* Welcome Section */}
      <div
        className="relative mb-8 text-center"
        data-aos="fade-down"
        data-aos-duration="1000"
      >
        <div className="absolute top-0 right-0 flex items-center lg:right-10">
          {refreshing && (
            <span className="mr-2 text-xs text-blue-400">Refreshing...</span>
          )}
          <button
            onClick={handleRefresh}
            className="text-gray-400 transition-colors hover:text-white"
            disabled={refreshing}
            aria-label="Refresh dashboard data"
          >
            <HiRefresh
              className={`h-6 w-6 ${refreshing ? "animate-spin text-blue-500" : ""}`}
            />
          </button>
        </div>
        {importantDates.some((date) => date.urgent) && (
          <div className="absolute -top-4 right-0 flex animate-pulse items-center gap-2 rounded-full bg-red-900 px-4 py-2 text-white lg:right-10">
            <span className="h-2 w-2 rounded-full bg-red-400"></span>
            <span className="text-sm">You have urgent deadlines!</span>
          </div>
        )}
        <h1 className="mb-2 text-4xl font-bold tracking-tight text-white lg:text-5xl">
          Welcome Back, {user?.name || dashboardData?.studentName || "Student"}
        </h1>
        <p className="mt-4 text-lg text-gray-400">
          Student ID: {dashboardData ? dashboardData.studentId : "Loading..."} |{" "}
          {dashboardData ? dashboardData.departmentName : "Loading..."}
        </p>
        <p className="mt-4 text-lg text-gray-400">
          North East University Bangladesh
        </p>
      </div>

      {/* Stats Grid */}
      <div
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="rounded-lg border border-gray-800 bg-gray-900 p-6 shadow-xl transition-transform hover:scale-105"
              data-aos="fade-up"
              data-aos-delay={300 + index * 100}
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-lg bg-gray-800 p-3">
                  <Icon className="h-6 w-6 text-[#92e3a9]" />
                </div>
                <span className="text-2xl font-bold text-white">
                  {stat.value}
                </span>
              </div>
              <h3 className="mb-1 text-lg font-semibold text-white">
                {stat.title}
              </h3>
              <p className="text-sm text-gray-400">{stat.description}</p>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout for Important Dates and Recent Registrations */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Important Registration Dates */}
        <div
          className="relative overflow-hidden rounded-lg border border-gray-800 bg-gray-900 p-6 shadow-xl"
          data-aos="fade-right"
          data-aos-delay="400"
        >
          <div className="absolute top-0 right-0 -mt-8 -mr-8 h-24 w-24 rounded-full bg-gradient-to-br from-[#92e3a9] to-transparent opacity-20"></div>
          <h2 className="relative mb-4 flex items-center gap-2 text-xl font-semibold">
            <HiClock className="h-6 w-6 text-[#92e3a9]" />
            <span className="text-white">Important Registration Deadlines</span>
          </h2>
          <div className="space-y-4">
            {importantDates.map((date, index) => (
              <div
                key={index}
                className={`flex items-start gap-4 rounded-lg ${date.urgent ? "bg-opacity-30 bg-red-900" : "bg-gray-800"} border p-4 transition-all hover:scale-105 hover:shadow-lg ${date.urgent ? "border-red-700" : "border-gray-700"}`}
                data-aos="fade-up"
                data-aos-delay={500 + index * 100}
              >
                <div className="min-w-[52px] text-center">
                  <div
                    className={`${date.urgent ? "bg-red-800" : "bg-gray-700"} rounded-t-md py-1`}
                  >
                    <div className="text-xs font-medium text-gray-300">
                      {date.date
                        ? new Date(date.date).toLocaleDateString("en-US", {
                            month: "short",
                          })
                        : "N/A"}
                    </div>
                  </div>
                  <div
                    className={`${date.urgent ? "bg-red-900" : "bg-gray-900"} rounded-b-md py-1`}
                  >
                    <div className="text-xl font-bold text-white">
                      {date.date ? new Date(date.date).getDate() : "--"}
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="flex items-center gap-2 font-medium text-white">
                    {date.title}
                    {date.urgent && (
                      <span className="rounded-full bg-red-900 px-2 py-1 text-xs text-red-300">
                        Urgent
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-400">{date.description}</p>
                  {date.date && new Date(date.date) > new Date() && (
                    <div className="mt-2">
                      <div className="h-1.5 w-full rounded-full bg-gray-700">
                        <div
                          className={`h-1.5 rounded-full ${date.urgent ? "bg-red-500" : "bg-blue-500"}`}
                          style={{
                            width: `${Math.min(100, Math.max(5, 100 - Math.floor(((new Date(date.date).getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000)) * 10)))}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Course Registrations */}
        <div
          className="rounded-lg border border-gray-800 bg-gray-900 shadow-xl"
          data-aos="fade-left"
          data-aos-delay="400"
        >
          <div className="p-6">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
              <HiDocumentText className="text-[#92e3a9]" />
              <span className="text-white">Recent Course Registrations</span>
            </h2>
          </div>
          <div className="overflow-hidden">
            <div className="w-full overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-800 bg-gray-800">
                    <th
                      scope="col"
                      className="px-4 py-2 text-left text-xs font-medium whitespace-nowrap text-gray-400"
                    >
                      Code
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2 text-left text-xs font-medium whitespace-nowrap text-gray-400"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2 text-left text-xs font-medium whitespace-nowrap text-gray-400"
                    >
                      Credits
                    </th>
                 
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {recentRegistrations.length > 0 ? (
                    recentRegistrations.map((course, index) => (
                      <tr
                        key={index}
                        className="bg-gray-900 transition-colors hover:bg-gray-800"
                      >
                        <td className="px-4 py-2 text-sm whitespace-nowrap text-white">
                          {course.courseCode}
                        </td>
                        <td className="px-4 py-2 text-sm text-white">
                          {course.title}
                        </td>
                        <td className="px-4 py-2 text-sm whitespace-nowrap text-white">
                          {course.credits}
                        </td>
                      
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-8 text-center text-gray-400"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <HiDocumentText className="mb-3 h-10 w-10 text-gray-600" />
                          <p>No course registrations found for this semester</p>
                          <a
                            href="/course-selection"
                            className="mt-3 inline-block rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                          >
                            Register for Courses
                          </a>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

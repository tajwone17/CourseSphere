"use client";

import React, { useEffect, useState } from "react";
import {
  HiAcademicCap,
  HiClipboardCheck,
  HiClock,
  HiCurrencyDollar,
  HiCalendar,
  HiCheck,
  HiClock as HiPending,
  HiDocumentText,
} from "react-icons/hi";
import { useAuth } from "../../context/AuthContext";

interface DashboardData {
  studentName: string;
  totalCredits: number;
  completedCredits: number;
  registeredCourses: number;
  currentSemester: string;
  pendingPayment: number;
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        // Use the user ID as the token for authorization
        const response = await fetch("/api/student-dashboard", {
          headers: {
            Authorization: `Bearer ${user.id}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const result = await response.json();
        if (result.success) {
          setDashboardData(result.data);
          console.log("Dashboard Data:", result.data);
        } else {
          setError(result.error || "Failed to fetch dashboard data");
        }
      } catch (err) {
        setError("An error occurred while fetching dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

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
      title:"Semester",
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
      title: "Pending Payment",
      value:
        dashboardData && typeof dashboardData.pendingPayment === "number"
          ? `$${dashboardData.pendingPayment.toFixed(2)}`
          : "Loading...",
      icon: HiCurrencyDollar,
      description: "Registration fee",
    },
  ];

  const importantDates = [
    {
      title: "Course Registration",
      date: "April 30, 2024",
      description: "Summer 2024 semester registration opens",
      urgent: true,
    },
    {
      title: "Registration Fee",
      date: "May 1, 2024",
      description: "Last date for registration payment",
      urgent: true,
    },
    {
      title: "Add/Drop Period",
      date: "May 5, 2024",
      description: "Last day to modify course selection",
      urgent: false,
    },
    {
      title: "Department Approval",
      date: "May 10, 2024",
      description: "Final course approval deadline",
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
        className="mb-8 text-center"
        data-aos="fade-down"
        data-aos-duration="1000"
      >
        <h1 className="mb-2 text-4xl font-bold tracking-tight text-white lg:text-5xl">
          Welcome Back, {user?.name || dashboardData?.studentName || "Student"}
        </h1>
        <p className="mt-4 text-lg text-gray-400">
          Student ID: 0562310005101031 | Computer Science Engineering
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
          className="rounded-lg border border-gray-800 bg-gray-900 p-6 shadow-xl"
          data-aos="fade-right"
          data-aos-delay="400"
        >
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
            <HiClock className="text-[#92e3a9]" />
            <span className="text-white">Important Registration Dates</span>
          </h2>
          <div className="space-y-4">
            {importantDates.map((date, index) => (
              <div
                key={index}
                className="flex items-start gap-4 rounded-lg bg-gray-800 p-4 transition-transform hover:scale-105"
                data-aos="fade-up"
                data-aos-delay={500 + index * 100}
              >
                <div className="min-w-[40px] text-center">
                  <div className="text-sm font-medium text-gray-400">
                    {new Date(date.date).toLocaleDateString("en-US", {
                      month: "short",
                    })}
                  </div>
                  <div className="text-xl font-bold text-white">
                    {new Date(date.date).getDate()}
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
                    <th
                      scope="col"
                      className="px-4 py-2 text-left text-xs font-medium whitespace-nowrap text-gray-400"
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {recentRegistrations.map((course, index) => (
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
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                            course.status === "Approved"
                              ? "bg-opacity-20 bg-[#92e3a9] text-black"
                              : "bg-yellow-900 text-yellow-300"
                          }`}
                        >
                          {course.status === "Approved" ? (
                            <HiCheck className="h-3 w-3" />
                          ) : (
                            <HiPending className="h-3 w-3" />
                          )}
                          {course.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

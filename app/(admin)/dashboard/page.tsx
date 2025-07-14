"use client";

import React from "react";
import { Card } from "flowbite-react";
import {
  HiAcademicCap,
  HiUserGroup,
  HiClipboardCheck,
  HiClock,
  HiCalendar,
  HiOfficeBuilding,
} from "react-icons/hi";
import { useAuth } from "@/app/context/AuthContext";
import { useDepartmentDeadlines } from "@/app/hooks/useDepartmentDeadlines";
import { useAllDepartmentDeadlines } from "@/app/hooks/useAllDepartmentDeadlines";
import { useDashboardData } from "@/app/hooks/useDashboardData";

export default function AdminDashboard() {
  const { user } = useAuth();
  const {
    deadlines,
    loading: deadlinesLoading,
    error: deadlinesError,
  } = useDepartmentDeadlines();
  const {
    departmentDeadlines,
    loading: allDeadlinesLoading,
    error: allDeadlinesError,
  } = useAllDepartmentDeadlines();
  const {
    stats,
    urgentApprovals,
    loading: statsLoading,
    error: statsError,
  } = useDashboardData();

  // Get color based on urgency level
  const getUrgencyColor = (hours: number): string => {
    if (hours <= 24) {
      return "bg-red-500"; // urgent - less than 24 hours
    } else if (hours <= 72) {
      return "bg-yellow-500"; // warning - less than 3 days
    } else {
      return "bg-[#92e3a9]"; // ok - more than 3 days
    }
  };

  // Format date strings to a more readable format
  const formatDate = (dateString: string) => {
    if (!dateString) return "Not set";
    try {
      // Parse the date string from MySQL format (YYYY-MM-DD)
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Date error";
    }
  };

  // Format hours into days and hours for better readability
  const formatHoursRemaining = (hours: number): string => {
    if (hours <= 0) return "Deadline passed";

    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;

    if (days > 0) {
      return `${days}d ${remainingHours}h`;
    } else {
      return `${remainingHours}h`;
    }
  };

  // Generate dynamic deadline items from fetched data
  const generateDeadlineItems = () => {
    if (!deadlines) return [];

    const items = [];

    // Add course registration without fine deadline if it exists
    if (deadlines.course_registration_without_fine) {
      items.push({
        id: 1,
        title: "Course Registration Deadline (Without Fine)",
        date: formatDate(deadlines.course_registration_without_fine),
        description:
          "Last date for students to submit course registration forms without fine",
      });
    }

    // Add course registration with fine deadline if it exists
    if (deadlines.course_registration_with_fine) {
      items.push({
        id: 2,
        title: "Course Registration Deadline (With Fine)",
        date: formatDate(deadlines.course_registration_with_fine),
        description:
          "Last date for students to submit course registration forms with fine",
      });
    }

    // Add admit card collection deadline if it exists
    if (deadlines.admit_card_collection) {
      items.push({
        id: 3,
        title: "Admit Card Collection",
        date: formatDate(deadlines.admit_card_collection),
        description: "Deadline for collecting admit cards",
      });
    }

    return items;
  };

  // Generate all department deadlines for accounts admin
  const generateAllDepartmentDeadlines = () => {
    if (!departmentDeadlines || departmentDeadlines.length === 0) return {};

    // Group deadlines by department
    const deadlinesByDepartment = departmentDeadlines.reduce(
      (acc, deadline) => {
        const deptName = deadline.DEPARTMENT_NAME;
        if (!acc[deptName]) {
          acc[deptName] = [];
        }

        // Add course registration without fine deadline if it exists
        if (deadline.course_registration_without_fine) {
          acc[deptName].push({
            id: `${deadline.id}-1`,
            title: "Course Registration (Without Fine)",
            date: formatDate(deadline.course_registration_without_fine),
            description:
              "Last date for students to submit course registration forms without fine",
          });
        }

        // Add course registration with fine deadline if it exists
        if (deadline.course_registration_with_fine) {
          acc[deptName].push({
            id: `${deadline.id}-2`,
            title: "Course Registration (With Fine)",
            date: formatDate(deadline.course_registration_with_fine),
            description:
              "Last date for students to submit course registration forms with fine",
          });
        }

        // Add admit card collection deadline if it exists
        if (deadline.admit_card_collection) {
          acc[deptName].push({
            id: `${deadline.id}-3`,
            title: "Admit Card Collection",
            date: formatDate(deadline.admit_card_collection),
            description: "Deadline for collecting admit cards",
          });
        }

        return acc;
      },
      {} as Record<
        string,
        Array<{ id: string; title: string; date: string; description: string }>
      >,
    );

    return deadlinesByDepartment;
  };

  // Use dynamic deadlines from the database
  const importantDeadlines = generateDeadlineItems();
  const allDepartmentDeadlines: Record<
    string,
    { id: string; title: string; date: string; description: string }[]
  > = generateAllDepartmentDeadlines();

  // Loading state for all data
  const isLoading = deadlinesLoading || statsLoading || allDeadlinesLoading;
  const hasError = deadlinesError || statsError || allDeadlinesError;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-6 md:py-8 lg:px-8">
      {/* Welcome Section */}
      <div
        className="mb-4 sm:mb-6 md:mb-8"
        data-aos="fade-down"
        data-aos-duration="1000"
      >
        <h1 className="text-2xl font-bold text-white sm:text-3xl md:text-4xl">
          Welcome, {user ? user.name : "Admin"}
        </h1>
        {isLoading && (
          <p className="mt-2 text-sm text-gray-400 sm:text-base">
            Loading dashboard data...
          </p>
        )}
        {hasError && (
          <p className="mt-2 text-sm text-red-400 sm:text-base">
            Error loading data: {deadlinesError || statsError}
          </p>
        )}
      </div>

      {/* Stats Section */}
      <div
        className="xs:grid-cols-2 mb-4 grid grid-cols-1 gap-3 sm:mb-6 sm:gap-4 md:mb-8 md:gap-6 lg:grid-cols-4"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        <Card className="border-gray-700 bg-gray-800">
          <div className="flex items-center">
            <div className="mr-3 rounded-lg bg-[#92e3a9] p-2 sm:mr-4 sm:p-3">
              <HiUserGroup className="h-4 w-4 text-gray-900 sm:h-5 sm:w-5 md:h-6 md:w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 sm:text-sm">
                Total Approved
              </p>
              <p className="text-lg font-bold text-white sm:text-xl md:text-2xl">
                {statsLoading ? "..." : stats?.approvedCount || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-gray-700 bg-gray-800">
          <div className="flex items-center">
            <div className="mr-3 rounded-lg bg-[#92e3a9] p-2 sm:mr-4 sm:p-3">
              <HiClipboardCheck className="h-4 w-4 text-gray-900 sm:h-5 sm:w-5 md:h-6 md:w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 sm:text-sm">
                Total Rejected
              </p>
              <p className="text-lg font-bold text-white sm:text-xl md:text-2xl">
                {statsLoading ? "..." : stats?.rejectedCount || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-gray-700 bg-gray-800">
          <div className="flex items-center">
            <div className="mr-3 rounded-lg bg-[#92e3a9] p-2 sm:mr-4 sm:p-3">
              <HiAcademicCap className="h-4 w-4 text-gray-900 sm:h-5 sm:w-5 md:h-6 md:w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 sm:text-sm">
                Pending Approvals
              </p>
              <p className="text-lg font-bold text-white sm:text-xl md:text-2xl">
                {statsLoading ? "..." : stats?.pendingCount || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-gray-700 bg-gray-800">
          <div className="flex items-center">
            <div
              className={`mr-3 rounded-lg p-2 sm:mr-4 sm:p-3 ${getUrgencyColor(stats?.hoursRemaining || 0)}`}
            >
              <HiClock className="h-4 w-4 text-gray-900 sm:h-5 sm:w-5 md:h-6 md:w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 sm:text-sm">
                Next Deadline In
              </p>
              <p className="text-lg font-bold text-white sm:text-xl md:text-2xl">
                {statsLoading
                  ? "..."
                  : formatHoursRemaining(stats?.hoursRemaining || 0)}
              </p>
              {stats?.nextDeadline && (
                <p className="mt-1 max-w-[150px] truncate text-xs text-gray-400 sm:max-w-none">
                  {stats.nextDeadline.type}:<br />
                  {formatDate(stats.nextDeadline.date)}
                </p>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Urgent Approvals Section */}
      <div
        className="mb-4 sm:mb-6 md:mb-8"
        data-aos="fade-up"
        data-aos-duration="1000"
      >
        <h2 className="mb-2 text-xl font-bold text-white sm:mb-4 sm:text-2xl">
          Urgent Approvals
        </h2>
        <div className="overflow-x-auto rounded-lg border border-gray-700">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-400 uppercase sm:px-4 sm:py-3 md:px-6 md:py-3">
                  Student
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-400 uppercase sm:px-4 sm:py-3 md:px-6 md:py-3">
                  Reg ID
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-400 uppercase sm:px-4 sm:py-3 md:px-6 md:py-3">
                  Submission
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-400 uppercase sm:px-4 sm:py-3 md:px-6 md:py-3">
                  Courses
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-400 uppercase sm:px-4 sm:py-3 md:px-6 md:py-3">
                  Deadline
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 bg-gray-900">
              {statsLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-2 py-4 text-center text-sm text-white sm:px-4 md:px-6"
                  >
                    Loading urgent approvals...
                  </td>
                </tr>
              ) : urgentApprovals.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-2 py-4 text-center text-sm text-white sm:px-4 md:px-6"
                  >
                    No urgent approvals pending
                  </td>
                </tr>
              ) : (
                urgentApprovals.map((approval) => (
                  <tr key={approval.id} className="hover:bg-gray-800">
                    <td className="px-2 py-2 text-xs whitespace-nowrap text-white sm:px-4 sm:py-3 sm:text-sm md:px-6 md:py-4">
                      {approval.student}
                    </td>
                    <td className="px-2 py-2 text-xs whitespace-nowrap text-white sm:px-4 sm:py-3 sm:text-sm md:px-6 md:py-4">
                      {approval.regId}
                    </td>
                    <td className="px-2 py-2 text-xs whitespace-nowrap text-white sm:px-4 sm:py-3 sm:text-sm md:px-6 md:py-4">
                      {formatDate(approval.submissionDate)}
                    </td>
                    <td className="max-w-[100px] truncate px-2 py-2 text-xs text-white sm:max-w-[200px] sm:px-4 sm:py-3 sm:text-sm md:max-w-none md:px-6 md:py-4">
                      {approval.courses.join(", ")}
                    </td>
                    <td className="px-2 py-2 text-xs whitespace-nowrap text-white sm:px-4 sm:py-3 sm:text-sm md:px-6 md:py-4">
                      {formatDate(approval.deadline)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* All Departments Deadlines Section (Only for Accounts Admin) */}
      {user && user.role === "accounts_admin" && (
        <div
          className="mb-6 sm:mb-8 md:mb-12"
          data-aos="fade-up"
          data-aos-delay="600"
        >
          <h2 className="mb-3 border-b border-gray-700 pb-2 text-xl font-bold text-white sm:mb-4 sm:text-2xl md:mb-6 md:text-3xl">
            All Department Deadlines
          </h2>

          {allDeadlinesLoading ? (
            <div className="text-sm text-white sm:text-base">
              Loading all department deadlines...
            </div>
          ) : allDeadlinesError ? (
            <div className="text-sm text-red-400 sm:text-base">
              Failed to load deadlines: {allDeadlinesError}
            </div>
          ) : Object.keys(allDepartmentDeadlines).length === 0 ? (
            <div className="rounded-lg border border-gray-700 bg-gray-800 p-3 text-sm text-gray-400 sm:p-4 sm:text-base">
              No deadlines have been set for any department.
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6 md:space-y-8">
              {Object.keys(allDepartmentDeadlines).map((deptName) => {
                const deadlines = allDepartmentDeadlines[deptName];
                return (
                  <div
                    key={deptName}
                    className="rounded-lg border border-gray-700 bg-gray-800 p-3 sm:p-4"
                  >
                    <div className="mb-3 flex items-center gap-2 sm:mb-4 sm:gap-3">
                      <HiOfficeBuilding className="h-5 w-5 text-[#92e3a9] sm:h-6 sm:w-6" />
                      <h3 className="text-lg font-semibold text-white sm:text-xl md:text-2xl">
                        {deptName} Department
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                      {deadlines.map((deadline) => (
                        <Card
                          key={deadline.id}
                          className="border-gray-700 bg-gray-900 transition-transform hover:scale-[1.02]"
                        >
                          <div className="flex items-center gap-3 sm:gap-4">
                            <div className="rounded-lg bg-[#92e3a9] p-2 sm:p-3">
                              <HiCalendar className="h-5 w-5 text-gray-900 sm:h-6 sm:w-6" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="truncate text-base font-semibold text-white sm:text-lg">
                                {deadline.title}
                              </h4>
                              <p className="line-clamp-2 text-xs text-gray-400 sm:text-sm">
                                {deadline.description}
                              </p>
                              <p className="mt-1 text-xs font-medium text-[#92e3a9] sm:mt-2 sm:text-sm">
                                Due: {deadline.date}
                              </p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Important Deadlines Section - Visible for non-accounts-admin roles */}
      {(!user || user.role !== "accounts_admin") && (
        <div data-aos="fade-right" data-aos-delay="400">
          <h2 className="mb-2 text-xl font-bold text-white sm:mb-4 sm:text-2xl">
            Important Deadlines
          </h2>

          {deadlinesLoading ? (
            <div className="text-sm text-white sm:text-base">
              Loading deadlines...
            </div>
          ) : deadlinesError ? (
            <div className="text-sm text-red-400 sm:text-base">
              Failed to load deadlines: {deadlinesError}
            </div>
          ) : importantDeadlines.length === 0 ? (
            <div className="rounded-lg border border-gray-700 bg-gray-800 p-3 text-sm text-gray-400 sm:p-4 sm:text-base">
              No deadlines have been set for your department.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              {importantDeadlines.map((deadline) => (
                <Card
                  key={deadline.id}
                  className="border-gray-700 bg-gray-800 transition-transform hover:scale-[1.02]"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="rounded-lg bg-[#92e3a9] p-2 sm:p-3">
                      <HiCalendar className="h-5 w-5 text-gray-900 sm:h-6 sm:w-6" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-semibold text-white sm:text-lg">
                        {deadline.title}
                      </h3>
                      <p className="line-clamp-2 text-xs text-gray-400 sm:text-sm">
                        {deadline.description}
                      </p>
                      <p className="mt-1 text-xs font-medium text-[#92e3a9] sm:mt-2 sm:text-sm">
                        Due: {deadline.date}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

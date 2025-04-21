import React from "react";
import {
  HiAcademicCap,
  HiClipboardCheck,
  HiClock,
  HiCurrencyDollar,
  HiCalendar,
} from "react-icons/hi";

export default function StudentDashboard() {
  // Sample data - in a real app, this would come from an API or state management
  const stats = [
    {
      title: "Total Credits",
      value: "45/160",
      icon: HiAcademicCap,
      description: "Credits completed",
    },
    {
      title: "Current Semester",
      value: "Fall 2024",
      icon: HiCalendar,
      description: "3rd semester",
    },
    {
      title: "Active Courses",
      value: "5",
      icon: HiClipboardCheck,
      description: "Currently enrolled",
    },
    {
      title: "Due Payment",
      value: "$2,500",
      icon: HiCurrencyDollar,
      description: "Current semester",
    },
  ];

  const deadlines = [
    {
      title: "Mid-term Examination",
      date: "May 15, 2024",
      description: "All enrolled courses",
      urgent: true,
    },
    {
      title: "Course Registration",
      date: "April 30, 2024",
      description: "Summer 2024 semester",
      urgent: true,
    },
    {
      title: "Fee Payment",
      date: "May 1, 2024",
      description: "Last date without fine",
      urgent: false,
    },
    {
      title: "Assignment Submission",
      date: "April 25, 2024",
      description: "Database Systems",
      urgent: false,
    },
  ];

  const recentRegistrations = [
    {
      courseCode: "CS301",
      title: "Data Structures",
      credits: 3,
      status: "Approved",
    },
    {
      courseCode: "CS315",
      title: "Database Systems",
      credits: 3,
      status: "Pending",
    },
    {
      courseCode: "CS325",
      title: "Operating Systems",
      credits: 3,
      status: "Pending",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold">Welcome, John Doe</h1>
        <p className="text-gray-400">Student ID: 2024001 | Computer Science</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="rounded-lg border border-gray-800 bg-gray-900 p-6 shadow-xl"
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

      {/* Two Column Layout for Deadlines and Recent Registrations */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Upcoming Deadlines */}
        <div className="rounded-lg border border-gray-800 bg-gray-900 p-6 shadow-xl">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
            <HiClock className="text-[#92e3a9]" />
            <span className="text-white">Upcoming Deadlines</span>
          </h2>
          <div className="space-y-4">
            {deadlines.map((deadline, index) => (
              <div
                key={index}
                className="flex items-start gap-4 rounded-lg bg-gray-800 p-4"
              >
                <div className="min-w-[40px] text-center">
                  <div className="text-sm font-medium text-gray-400">
                    {new Date(deadline.date).toLocaleDateString("en-US", {
                      month: "short",
                    })}
                  </div>
                  <div className="text-xl font-bold text-white">
                    {new Date(deadline.date).getDate()}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="flex items-center gap-2 font-medium text-white">
                    {deadline.title}
                    {deadline.urgent && (
                      <span className="rounded-full bg-red-900 px-2 py-1 text-xs text-red-300">
                        Urgent
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {deadline.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Course Registrations */}
        <div className="rounded-lg border border-gray-800 bg-gray-900 p-6 shadow-xl">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
            <HiClipboardCheck className="text-[#92e3a9]" />
            <span className="text-white">Recent Course Registrations</span>
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Course Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Credits
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {recentRegistrations.map((course, index) => (
                  <tr key={index} className="bg-gray-900">
                    <td className="px-6 py-4 whitespace-nowrap text-white">
                      {course.courseCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-white">
                      {course.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-white">
                      {course.credits}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`rounded-full px-3 py-1 text-xs ${
                          course.status === "Approved"
                            ? "bg-opacity-20 bg-[#92e3a9] text-[#92e3a9]"
                            : "bg-yellow-900 text-yellow-300"
                        }`}
                      >
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
  );
}

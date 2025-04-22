"use client";

import React from "react";
import { Card } from "flowbite-react";
import {
  HiAcademicCap,
  HiUserGroup,
  HiClipboardCheck,
  HiClock,
  HiCalendar,
} from "react-icons/hi";

export default function AdvisorDashboard() {
  // Sample data for urgent approvals
  const urgentApprovals = [
    {
      id: 1,
      student: "John Smith",
      regId: "2024CSE001",
      submissionDate: "2024-04-20",
      courses: ["Database Systems", "Software Engineering"],
      deadline: "2024-04-25",
    },
    {
      id: 2,
      student: "Emma Wilson",
      regId: "2024CSE045",
      submissionDate: "2024-04-21",
      courses: ["Computer Networks", "Operating Systems"],
      deadline: "2024-04-26",
    },
    {
      id: 3,
      student: "Michael Brown",
      regId: "2024CSE078",
      submissionDate: "2024-04-21",
      courses: ["Web Development", "Data Structures"],
      deadline: "2024-04-26",
    },
  ];

  // Sample data for important deadlines
  const importantDeadlines = [
    {
      id: 1,
      title: "Course Registration Deadline",
      date: "2024-04-30",
      description: "Last date for students to submit course registration forms",
    },
    {
      id: 2,
      title: "Mid-term Exam Schedule Submission",
      date: "2024-05-15",
      description: "Deadline for submitting mid-term examination schedule",
    },
    {
      id: 3,
      title: "Course Drop Period Ends",
      date: "2024-05-01",
      description: "Final date for students to drop courses without penalty",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl p-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">Welcome, Dr. Johnson</h1>
        <p className="mt-2 text-lg text-gray-400">
          Overview of your advisees&apos; activities today
        </p>
      </div>

      {/* Stats Section */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="border-gray-700 bg-gray-800">
          <div className="flex items-center">
            <div className="mr-4 rounded-lg bg-[#92e3a9] p-3">
              <HiUserGroup className="h-6 w-6 text-gray-900" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">
                Total Advisees
              </p>
              <p className="text-2xl font-bold text-white">145</p>
            </div>
          </div>
        </Card>

        <Card className="border-gray-700 bg-gray-800">
          <div className="flex items-center">
            <div className="mr-4 rounded-lg bg-[#92e3a9] p-3">
              <HiClipboardCheck className="h-6 w-6 text-gray-900" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">
                Pending Approvals
              </p>
              <p className="text-2xl font-bold text-white">12</p>
            </div>
          </div>
        </Card>

        <Card className="border-gray-700 bg-gray-800">
          <div className="flex items-center">
            <div className="mr-4 rounded-lg bg-[#92e3a9] p-3">
              <HiAcademicCap className="h-6 w-6 text-gray-900" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">
                Registered Students
              </p>
              <p className="text-2xl font-bold text-white">98</p>
            </div>
          </div>
        </Card>

        <Card className="border-gray-700 bg-gray-800">
          <div className="flex items-center">
            <div className="mr-4 rounded-lg bg-[#92e3a9] p-3">
              <HiClock className="h-6 w-6 text-gray-900" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">
                Urgent Actions
              </p>
              <p className="text-2xl font-bold text-white">8</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Urgent Approvals Section */}
      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-bold text-white">Urgent Approvals</h2>
        <div className="overflow-x-auto rounded-lg border border-gray-700">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Reg ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Submission Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Courses
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Deadline
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 bg-gray-900">
              {urgentApprovals.map((approval) => (
                <tr key={approval.id} className="hover:bg-gray-800">
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-white">
                    {approval.student}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-white">
                    {approval.regId}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-white">
                    {approval.submissionDate}
                  </td>
                  <td className="px-6 py-4 text-sm text-white">
                    {approval.courses.join(", ")}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-white">
                    {approval.deadline}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Important Deadlines Section */}
      <div>
        <h2 className="mb-4 text-2xl font-bold text-white">
          Important Deadlines
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {importantDeadlines.map((deadline) => (
            <Card
              key={deadline.id}
              className="border-gray-700 bg-gray-800 transition-transform hover:scale-[1.02]"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-[#92e3a9] p-3">
                  <HiCalendar className="h-6 w-6 text-gray-900" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {deadline.title}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {deadline.description}
                  </p>
                  <p className="mt-2 text-sm font-medium text-[#92e3a9]">
                    Due: {deadline.date}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

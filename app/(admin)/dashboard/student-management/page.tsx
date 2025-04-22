"use client";

import React from "react";
import { Button, TextInput, Select } from "flowbite-react";
import { HiSearch, HiEye, HiPencilAlt } from "react-icons/hi";

export default function StudentManagement() {
  // Sample student data
  const students = [
    {
      id: 1,
      name: "John Smith",
      studentId: "2024CSE001",
      email: "john.smith@example.com",
      registrationStatus: "Pending",
    },
    {
      id: 2,
      name: "Emma Wilson",
      studentId: "2024CSE045",
      email: "emma.wilson@example.com",
      registrationStatus: "Approved",
    },
    {
      id: 3,
      name: "Michael Brown",
      studentId: "2024CSE078",
      email: "michael.brown@example.com",
      registrationStatus: "Rejected",
    },
    {
      id: 4,
      name: "Sarah Johnson",
      studentId: "2024CSE102",
      email: "sarah.j@example.com",
      registrationStatus: "Pending",
    },
    {
      id: 5,
      name: "David Lee",
      studentId: "2024CSE156",
      email: "david.lee@example.com",
      registrationStatus: "Approved",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "text-green-400";
      case "rejected":
        return "text-red-400";
      default:
        return "text-yellow-400";
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-8">
      {/* Title Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">Student Management</h1>
        <p className="mt-2 text-lg text-gray-400">
          Manage and monitor your assigned students
        </p>
      </div>

      {/* Filter Section */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <div>
          <TextInput
            type="text"
            placeholder="Search by name or ID"
            icon={HiSearch}
            className="border-gray-700 bg-gray-800 text-white"
          />
        </div>
        <div>
          <Select className="border-gray-700 bg-gray-800 text-white">
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </Select>
        </div>

      </div>

      {/* Students Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-700">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                Student ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                Registration Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700 bg-gray-900">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-800">
                <td className="px-6 py-4 text-sm whitespace-nowrap text-white">
                  {student.name}
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-white">
                  {student.studentId}
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-white">
                  {student.email}
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap">
                  <span className={getStatusColor(student.registrationStatus)}>
                    {student.registrationStatus}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap">
                  <div className="flex gap-2">
                    <Button
                         style={{
                            backgroundColor: "#92e3a9",
                            color: "#000000",
                       
                            width: "fit-content",
                            cursor: "pointer",
                          }}
                      size="sm"
                      className="bg-[#92e3a9] text-gray-900 hover:bg-[#7ac892]"
                    >
                      <HiEye className="h-4 w-4" />
                    </Button>
                    <Button
                         style={{
                            backgroundColor: "#92e3a9",
                            color: "#000000",
                           
                            width: "fit-content",
                            cursor: "pointer",
                          }}
                      size="sm"
                      className="bg-[#92e3a9] text-gray-900 hover:bg-[#7ac892]"
                    >
                      <HiPencilAlt className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

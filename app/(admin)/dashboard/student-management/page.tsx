"use client";

import { Button, TextInput, Select } from "flowbite-react";
import Link from "next/link";
import { HiSearch } from "react-icons/hi";
import { FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";

export default function StudentManagement() {
  const students = [
    {
      id: "1",
      name: "Tajwone Chowdhury",
      studentId: "0562310005101031",
      email: "tajwone.chowdhury@neub.edu.bd",
      semester: "Spring 2024",
      department: "CSE",
      status: "pending",
    },
    {
      id: "2",
      name: "Jakaria",
      studentId: "0562310005101032",
      email: "jakaria@neub.edu.bd",
      semester: "Spring 2024",
      department: "CSE",
      status: "approved",
    },
    {
      id: "3",
      name: "Oli Ahmed",
      studentId: "0562310005101033",
      email: "oli.ahmed@neub.edu.bd",
      semester: "Spring 2024",
      department: "CSE",
      status: "pending",
    },
    {
      id: "4",
      name: "Masum Pradhania",
      studentId: "0562310005101034",
      email: "masum.pradhania@neub.edu.bd",
      semester: "Spring 2024",
      department: "CSE",
      status: "pending",
    },
  ];

  const getStatus = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 rounded bg-green-800/30 px-2 py-1 text-sm font-medium text-green-500">
            <FaCheckCircle className="text-green-400" />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 rounded bg-red-800/30 px-2 py-1 text-sm font-medium text-red-500">
            <FaTimesCircle className="text-red-400" />
            Rejected
          </span>
        );
      case "pending":
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded bg-yellow-700/30 px-2 py-1 text-sm font-medium text-yellow-400">
            <FaClock className="text-yellow-300" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-8">
      <h1 className="mb-8 text-4xl font-bold text-white">Student Management</h1>

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
            <option value="">All Departments</option>
            <option value="cse">CSE</option>
            <option value="ece">ECE</option>
            <option value="mech">MECH</option>
          </Select>
        </div>
        <div>
          <Select className="border-gray-700 bg-gray-800 text-white">
            <option value="">All Semesters</option>
            <option value="spring2024">Spring 2024</option>
            <option value="fall2023">Fall 2023</option>
          </Select>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto rounded-lg border border-gray-700">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800 text-gray-400">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium">
                Student ID
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium">Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Email</th>
              <th className="px-6 py-3 text-left text-sm font-medium">
                Department
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium">
                Semester
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700 bg-gray-900">
            {students.map((student) => (
              <tr key={student.id} className="text-white hover:bg-gray-800">
                <td className="px-6 py-4">{student.studentId}</td>
                <td className="px-6 py-4">{student.name}</td>
                <td className="px-6 py-4">{student.email}</td>
                <td className="px-6 py-4">{student.department}</td>
                <td className="px-6 py-4">{student.semester}</td>
                <td className="px-6 py-4">{getStatus(student.status)}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Link href={`/dashboard/student-management/${student.id}`}>
                      <Button
                        style={{
                          backgroundColor: "#92e3a9",
                          color: "#000000",
                          cursor: "pointer",
                        }}
                        size="sm"
                        className="bg-[#92e3a9] text-gray-900 hover:bg-[#7ac892]"
                      >
                        Review
                      </Button>
                    </Link>
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

"use client";

import { Button, TextInput, Select } from "flowbite-react";
import Link from "next/link";
import { HiSearch } from "react-icons/hi";

export default function StudentManagement() {
  const students = [
    {
      id: "1",
      name: "John Smith",
      studentId: "2024CSE001",
      email: "john.smith@example.com",
      semester: "Spring 2024",
      department: "CSE",
    },
    {
      id: "2",
      name: "Emma Wilson",
      studentId: "2024CSE045",
      email: "emma.wilson@example.com",
      semester: "Spring 2024",
      department: "CSE",
    },
    {
      id: "3",
      name: "Michael Brown",
      studentId: "2024CSE078",
      email: "michael.brown@example.com",
      semester: "Spring 2024",
      department: "CSE",
    },
    {
      id: "4",
      name: "Sarah Johnson",
      studentId: "2024CSE102",
      email: "sarah.j@example.com",
      semester: "Spring 2024",
      department: "CSE",
    },
    {
      id: "5",
      name: "David Lee",
      studentId: "2024CSE156",
      email: "david.lee@example.com",
      semester: "Spring 2024",
      department: "CSE",
    },
  ];

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
              <th className="px-6 py-3 text-left text-sm font-medium">Student ID</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Email</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Department</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Semester</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700 bg-gray-900">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-800 text-white">
                <td className="px-6 py-4">{student.studentId}</td>
                <td className="px-6 py-4">{student.name}</td>
                <td className="px-6 py-4">{student.email}</td>
                <td className="px-6 py-4">{student.department}</td>
                <td className="px-6 py-4">{student.semester}</td>
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

"use client";

import { Button, TextInput, Select } from "flowbite-react";
import Link from "next/link";
import { HiSearch } from "react-icons/hi";
import { FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";
import { useEffect, useState } from "react";

interface Student {
  ID: number;
  NAME: string;
  EMAIL: string;
  REGISTRATION_NUMBER?: string;
  DEPARTMENT_ID: number;
  SESSION?: string;
  STATUS: boolean;
  MOBILE?: string;
}

export default function StudentManagement() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [searchId, setSearchId] = useState("");
  const [searchSession, setSearchSession] = useState("");
  const [searchStatus, setSearchStatus] = useState("");

  useEffect(() => {
    async function fetchStudents() {
      try {
        setLoading(true);
        const response = await fetch("/api/students");
        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }
        const data = await response.json();
        setStudents(data.students);
        setFilteredStudents(data.students); // Initialize filteredStudents
        console.log("Fetched students:", data.students);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.error("Error fetching students:", errorMessage);
      } finally {
        setLoading(false);
      }
    }

    fetchStudents();
  }, []);

  const adminRole =
    typeof window !== "undefined" ? localStorage.getItem("adminRole") : null;
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

  // Filter students based on search criteria
  useEffect(() => {
    let filtered = students;

    if (searchName) {
      filtered = filtered.filter((student) =>
        student.NAME.toLowerCase().includes(searchName.toLowerCase()),
      );
    }

    if (searchId) {
      filtered = filtered.filter((student) =>
        student.REGISTRATION_NUMBER?.toLowerCase().includes(
          searchId.toLowerCase(),
        ),
      );
    }

    if (searchSession) {
      filtered = filtered.filter(
        (student) => student.SESSION === searchSession,
      );
    }

    if (searchStatus) {
      filtered = filtered.filter((student) => {
        if (searchStatus === "approved") return student.STATUS === true;
        if (searchStatus === "pending") return student.STATUS === false;
        if (searchStatus === "rejected") return student.STATUS === false;
        return true;
      });
    }

    setFilteredStudents(filtered);
  }, [searchName, searchId, searchSession, searchStatus, students]);

  return (
    <div
      className="mx-auto max-w-7xl p-8"
      data-aos="fade-right"
      data-aos-duration="1000"
    >
      <h1 className="mb-8 text-4xl font-bold text-white">Student Management</h1>
      {/* Filter Section */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <div>
          <TextInput
            type="text"
            placeholder="Search by name"
            icon={HiSearch}
            className="border-gray-700 bg-gray-800 text-white"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>
        <div>
          <TextInput
            type="text"
            placeholder="Search by ID"
            icon={HiSearch}
            className="border-gray-700 bg-gray-800 text-white"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
        </div>
        <div>
          <Select
            className="border-gray-700 bg-gray-800 text-white"
            value={searchSession}
            onChange={(e) => setSearchSession(e.target.value)}
          >
            <option value="">All Semesters</option>
            <option value="spring2024">Spring 2024</option>
            <option value="fall2023">Fall 2023</option>
          </Select>
        </div>
        {adminRole !== "accounts" && (
          <div>
            <Select
              className="border-gray-700 bg-gray-800 text-white"
              value={searchStatus}
              onChange={(e) => setSearchStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </Select>
          </div>
        )}
      </div>{" "}
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
                Session
              </th>
              {adminRole !== "accounts" && (
                <th className="px-6 py-3 text-left text-sm font-medium">
                  Status
                </th>
              )}
              <th className="px-6 py-3 text-left text-sm font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700 bg-gray-900">
            {loading ? (
              <tr>
                <td
                  colSpan={adminRole !== "accounts" ? 7 : 6}
                  className="px-6 py-4 text-center text-white"
                >
                  Loading students data...
                </td>
              </tr>
            ) : filteredStudents.length === 0 ? (
              <tr>
                <td
                  colSpan={adminRole !== "accounts" ? 7 : 6}
                  className="px-6 py-4 text-center text-white"
                >
                  No students found.
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr key={student.ID} className="text-white hover:bg-gray-800">
                  <td className="px-6 py-4">
                    {student.REGISTRATION_NUMBER || "N/A"}
                  </td>
                  <td className="px-6 py-4">{student.NAME}</td>
                  <td className="px-6 py-4">{student.EMAIL}</td>
                  <td className="px-6 py-4">{student.SESSION || "N/A"}</td>
                  {adminRole !== "accounts" && (
                    <td className="px-6 py-4">
                      {getStatus(student.STATUS ? "approved" : "pending")}
                    </td>
                  )}
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link
                        href={`/dashboard/student-management/${student.ID}`}
                      >
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

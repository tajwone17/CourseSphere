"use client";

import { Button, TextInput, Select } from "flowbite-react";
import Link from "next/link";
import {
  HiIdentification,
  HiCalendar,
  HiAcademicCap,
  HiUserGroup,
  HiEnvelope,
  HiBuildingOffice2,
} from "react-icons/hi2";
import { FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
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

// Dummy static data for demonstration
const dummyStudents: Student[] = [
  {
    ID: 1001,
    NAME: "John Smith",
    EMAIL: "john.smith@example.com",
    REGISTRATION_NUMBER: "CSE2021001",
    DEPARTMENT_ID: 1,
    SESSION: "spring2024",
    STATUS: true,
    MOBILE: "+1-555-123-4567",
  },
  {
    ID: 1002,
    NAME: "Sarah Johnson",
    EMAIL: "sarah.j@example.com",
    REGISTRATION_NUMBER: "CSE2021002",
    DEPARTMENT_ID: 1,
    SESSION: "spring2024",
    STATUS: false,
    MOBILE: "+1-555-234-5678",
  },
  {
    ID: 1003,
    NAME: "Michael Chen",
    EMAIL: "m.chen@example.com",
    REGISTRATION_NUMBER: "EEE2021045",
    DEPARTMENT_ID: 2,
    SESSION: "fall2023",
    STATUS: true,
    MOBILE: "+1-555-345-6789",
  },
  {
    ID: 1004,
    NAME: "Emily Rodriguez",
    EMAIL: "e.rodriguez@example.com",
    REGISTRATION_NUMBER: "BBA2022013",
    DEPARTMENT_ID: 3,
    SESSION: "fall2023",
    STATUS: true,
    MOBILE: "+1-555-456-7890",
  },
  {
    ID: 1005,
    NAME: "David Kim",
    EMAIL: "d.kim@example.com",
    REGISTRATION_NUMBER: "CSE2022078",
    DEPARTMENT_ID: 1,
    SESSION: "spring2024",
    STATUS: false,
    MOBILE: "+1-555-567-8901",
  },
  {
    ID: 1006,
    NAME: "Priya Patel",
    EMAIL: "p.patel@example.com",
    REGISTRATION_NUMBER: "MED2023011",
    DEPARTMENT_ID: 4,
    SESSION: "fall2023",
    STATUS: true,
    MOBILE: "+1-555-678-9012",
  },
  {
    ID: 1007,
    NAME: "James Wilson",
    EMAIL: "j.wilson@example.com",
    REGISTRATION_NUMBER: "EEE2022056",
    DEPARTMENT_ID: 2,
    SESSION: "spring2024",
    STATUS: false,
    MOBILE: "+1-555-789-0123",
  },
];

export default function StudentManagement() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [searchId, setSearchId] = useState("");
  const [searchSession, setSearchSession] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [searchDepartment, setSearchDepartment] = useState("");

  // Load dummy data on component mount
  useEffect(() => {
    // Simulate API call with a timeout
    const timer = setTimeout(() => {
      setStudents(dummyStudents);
      setFilteredStudents(dummyStudents);
      setLoading(false);
    }, 800); // Short delay to simulate loading

    return () => clearTimeout(timer);
  }, []);

  const [adminRole, setAdminRole] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (typeof window !== "undefined" && user && user.role) {
      setAdminRole(user.role);
    }
  }, [user]);
  const getDepartmentName = (departmentId: number) => {
    switch (departmentId) {
      case 1:
        return "Computer Science";
      case 2:
        return "Electrical Engineering";
      case 3:
        return "Business Administration";
      case 4:
        return "Medicine";
      default:
        return "Unknown Department";
    }
  };

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

    if (searchDepartment) {
      filtered = filtered.filter(
        (student) => student.DEPARTMENT_ID.toString() === searchDepartment,
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
  }, [
    searchName,
    searchId,
    searchSession,
    searchStatus,
    searchDepartment,
    students,
  ]);

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
          {" "}
          <div className="relative">
            <TextInput
              type="text"
              placeholder="Search by name"
              icon={HiUserGroup}
              className="border-gray-700 bg-gray-800 text-white"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              style={{ paddingLeft: "2.5rem" }}
            />
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <HiUserGroup className="h-5 w-5 text-[#92e3a9]" />
            </div>
          </div>
        </div>{" "}
        <div>
          <div className="relative">
            <TextInput
              type="text"
              placeholder="Search by ID"
              className="border-gray-700 bg-gray-800 pl-10 text-white"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <HiIdentification className="h-5 w-5 text-[#92e3a9]" />
            </div>
          </div>
        </div>{" "}
        <div>
          <div className="relative">
            <Select
              className="border-gray-700 bg-gray-800 pl-10 text-white"
              value={searchSession}
              onChange={(e) => setSearchSession(e.target.value)}
            >
              <option value="">All Semesters</option>
              <option value="spring2024">Spring 2024</option>
              <option value="fall2023">Fall 2023</option>
            </Select>{" "}
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <HiCalendar className="h-5 w-5 text-[#92e3a9]" />
            </div>
          </div>
        </div>{" "}
        {adminRole === "accounts_admin" ? (
          <div>
            <div className="relative">
              <Select
                className="border-gray-700 bg-gray-800 pl-10 text-white"
                value={searchDepartment}
                onChange={(e) => setSearchDepartment(e.target.value)}
              >
                <option value="">All Departments</option>
                <option value="1">Computer Science</option>
                <option value="2">Electrical Engineering</option>
                <option value="3">Business Administration</option>
                <option value="4">Medicine</option>
              </Select>{" "}
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <HiBuildingOffice2 className="h-5 w-5 text-[#92e3a9]" />
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="relative">
              <Select
                className="border-gray-700 bg-gray-800 pl-10 text-white"
                value={searchStatus}
                onChange={(e) => setSearchStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </Select>{" "}
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <HiAcademicCap className="h-5 w-5 text-[#92e3a9]" />
              </div>
            </div>
          </div>
        )}
      </div>{" "}
      {/* Table Section */}
      <div className="overflow-x-auto rounded-lg border border-gray-700">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800 text-gray-400">
            <tr>
              {" "}
              <th className="px-6 py-3 text-left text-sm font-medium">
                <span className="flex items-center gap-1">
                  <HiIdentification className="text-[#92e3a9]" />
                  Student ID
                </span>
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium">
                <span className="flex items-center gap-1">
                  <HiUserGroup className="text-[#92e3a9]" />
                  Name
                </span>
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium">
                <span className="flex items-center gap-1">
                  <HiEnvelope className="text-[#92e3a9]" />
                  Email
                </span>
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium">
                <span className="flex items-center gap-1">
                  <HiCalendar className="text-[#92e3a9]" />
                  Session
                </span>
              </th>
              {adminRole === "accounts_admin" && (
                <th className="px-6 py-3 text-left text-sm font-medium">
                  <span className="flex items-center gap-1">
                    <HiBuildingOffice2 className="text-[#92e3a9]" />
                    Department
                  </span>
                </th>
              )}
              {adminRole !== "accounts_admin" && (
                <th className="px-6 py-3 text-left text-sm font-medium">
                  <span className="flex items-center gap-1">
                    <HiAcademicCap className="text-[#92e3a9]" />
                    Status
                  </span>
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
                <td colSpan={6} className="px-6 py-4 text-center text-white">
                  Loading students data...
                </td>
              </tr>
            ) : filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-white">
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
                  {adminRole === "accounts_admin" && (
                    <td className="px-6 py-4">
                      {getDepartmentName(student.DEPARTMENT_ID)}
                    </td>
                  )}
                  {adminRole !== "accounts_admin" && (
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

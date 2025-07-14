"use client";

import { Button, TextInput, Select } from "flowbite-react";
import Link from "next/link";
import {
  HiIdentification,
  HiCalendar,
  HiAcademicCap,
  HiBuildingOffice2,
  HiUserGroup,
} from "react-icons/hi2";
import { FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";
import { HiClock as HiPending } from "react-icons/hi";
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";

// interface Student {
//   ID: number;
//   NAME: string;
//   EMAIL: string;
//   REGISTRATION_NUMBER?: string;
//   DEPARTMENT_ID: number;
//   SESSION?: string;
//   STATUS: boolean;
//   MOBILE?: string;
// }

interface RegistrationRequest {
  BUNDLE_ID: number;
  STUDENT_ID: number;
  SEMESTER: string;
  STATUS: string;
  SUBMITTED_AT: string;
  TOTAL_AMOUNT: number;
  student_name: string;
  student_email: string;
  REGISTRATION_NUMBER: string;
  account_status: boolean;
  DEPARTMENT_ID: number;
  DEPARTMENT_NAME: string;
  course_count: number;
}

export default function StudentManagement() {
  const [registrations, setRegistrations] = useState<RegistrationRequest[]>([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState<
    RegistrationRequest[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchName, setSearchName] = useState("");
  const [searchId, setSearchId] = useState("");
  const [searchSession, setSearchSession] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [searchDepartment, setSearchDepartment] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [departmentId, setDepartmentId] = useState<string | null>(null);
  const [counts, setCounts] = useState<{
    pending: number;
    approved: number;
    rejected: number;
  }>({
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const { user } = useAuth();

  useEffect(() => {
    if (typeof window !== "undefined" && user && user.role) {
      setUserRole(user.role);
      if (user.departmentId) {
        setDepartmentId(user.departmentId.toString());
      }
    }
  }, [user]);

  // Filter registrations based on search criteria
  useEffect(() => {
    let filtered = registrations;

    if (searchName) {
      filtered = filtered.filter((reg: RegistrationRequest) =>
        reg.student_name.toLowerCase().includes(searchName.toLowerCase()),
      );
    }

    if (searchId) {
      filtered = filtered.filter((reg: RegistrationRequest) =>
        reg.REGISTRATION_NUMBER?.toLowerCase().includes(searchId.toLowerCase()),
      );
    }

    if (searchSession) {
      filtered = filtered.filter(
        (reg: RegistrationRequest) => reg.SEMESTER === searchSession,
      );
    }

    if (searchDepartment) {
      filtered = filtered.filter(
        (reg: RegistrationRequest) =>
          reg.DEPARTMENT_ID.toString() === searchDepartment,
      );
    }

    if (searchStatus) {
      filtered = filtered.filter((reg: RegistrationRequest) => {
        if (searchStatus === "approved") {
          if (userRole === "advisor")
            return reg.STATUS !== "PENDING" && reg.STATUS !== "REJECTED";
          else if (userRole === "hod")
            return reg.STATUS !== "PENDING" && reg.STATUS !== "REJECTED";
          else if (userRole === "accounts_admin")
            return reg.STATUS !== "PENDING" && reg.STATUS !== "REJECTED";
          return reg.STATUS === "PARTIALLY_APPROVED";
        }
        if (searchStatus === "pending") return reg.STATUS === "PENDING";
        if (searchStatus === "rejected") return reg.STATUS === "REJECTED";
        return true;
      });
    }

    setFilteredRegistrations(filtered);
  }, [
    searchName,
    searchId,
    searchSession,
    searchStatus,
    searchDepartment,
    registrations,
    userRole,
  ]);

  // Fetch registration requests based on user role
  useEffect(() => {
    const fetchRegistrationRequests = async () => {
      if (!userRole) return;

      try {
        setLoading(true);

        // Build query URL with role and optional departmentId
        let url = `/api/registration/pending-registrations?role=${userRole}`;
        if (departmentId) {
          url += `&departmentId=${departmentId}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch registration requests");
        }

        const data = await response.json();

        if (data.success && data.registrations) {
          setRegistrations(data.registrations);
          setFilteredRegistrations(data.registrations);

          // Set counts if available
          if (data.counts) {
            setCounts(data.counts);
          }
        } else {
          throw new Error(data.error || "No registration requests found");
        }
      } catch (err) {
        console.error("Error fetching registration requests:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrationRequests();
  }, [userRole, departmentId]);

  // eslint-disable-next-line
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
      case "PARTIALLY_APPROVED":
        return (
          <span className="inline-flex items-center gap-1 rounded bg-green-800/30 px-1 py-0.5 text-xs font-medium text-green-500 sm:px-2 sm:py-1 sm:text-sm">
            <FaCheckCircle className="text-xs text-green-400 sm:text-sm" />
            <span className="xs:inline hidden">Partially</span> Approved
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 rounded bg-red-800/30 px-1 py-0.5 text-xs font-medium text-red-500 sm:px-2 sm:py-1 sm:text-sm">
            <FaTimesCircle className="text-xs text-red-400 sm:text-sm" />
            Rejected
          </span>
        );
      case "PENDING":
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded bg-yellow-700/30 px-1 py-0.5 text-xs font-medium text-yellow-400 sm:px-2 sm:py-1 sm:text-sm">
            <FaClock className="text-xs text-yellow-300 sm:text-sm" />
            Pending
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    // For smaller screens, return more compact date format
    if (typeof window !== "undefined" && window.innerWidth < 640) {
      return date.toLocaleDateString("en-US", {
        year: "2-digit",
        month: "short",
        day: "numeric",
      });
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-6 md:p-8"
      data-aos="fade-right"
      data-aos-duration="1000"
    >
      <h1 className="mb-4 text-2xl font-bold text-white sm:mb-6 sm:text-3xl md:mb-8 md:text-4xl">
        Registration Approval Requests
      </h1>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500 bg-red-900/20 p-3 text-sm text-red-300 sm:p-4 sm:text-base">
          {error}
        </div>
      )}

      {/* Role-specific guidance message */}
      <div className="mb-4 rounded-lg border border-blue-500 bg-blue-900/20 p-3 text-sm text-blue-300 sm:mb-6 sm:p-4 sm:text-base">
        {userRole === "advisor" && (
          <div className="flex items-start">
            <div className="mt-1 mr-3 flex-shrink-0 sm:mr-4">
              <HiAcademicCap className="h-5 w-5 text-blue-400 sm:h-6 sm:w-6" />
            </div>
            <div>
              <h3 className="text-base font-medium text-blue-400 sm:text-lg">
                Advisor Role
              </h3>
              <p className="text-xs sm:text-sm md:text-base">
                You are viewing registration requests that need initial
                approval. After your approval, requests will proceed to the Head
                of Department.
              </p>
            </div>
          </div>
        )}
        {userRole === "hod" && (
          <div className="flex items-start">
            <div className="mt-1 mr-3 flex-shrink-0 sm:mr-4">
              <HiBuildingOffice2 className="h-5 w-5 text-blue-400 sm:h-6 sm:w-6" />
            </div>
            <div>
              <h3 className="text-base font-medium text-blue-400 sm:text-lg">
                Head of Department Role
              </h3>
              <p className="text-xs sm:text-sm md:text-base">
                You are viewing registration requests that have been approved by
                advisors and now require your review. After your approval,
                requests will proceed to the Accounts Office.
              </p>
            </div>
          </div>
        )}
        {userRole === "accounts_admin" && (
          <div className="flex items-start">
            <div className="mt-1 mr-3 flex-shrink-0 sm:mr-4">
              <HiCalendar className="h-5 w-5 text-blue-400 sm:h-6 sm:w-6" />
            </div>
            <div>
              <h3 className="text-base font-medium text-blue-400 sm:text-lg">
                Accounts Admin Role
              </h3>
              <p className="text-xs sm:text-sm md:text-base">
                You are viewing registration requests that have been approved by
                the Head of Department and now require final verification and
                fee setting before payment can be made.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="mb-4 grid gap-3 sm:mb-6 sm:grid-cols-3 sm:gap-4 md:mb-8">
        <div className="rounded-lg border border-gray-700 bg-gray-800 p-3 shadow sm:p-4">
          <div className="flex items-center">
            <div className="mr-3 rounded-full bg-yellow-900/30 p-2 sm:mr-4 sm:p-3">
              <HiPending className="h-4 w-4 text-yellow-400 sm:h-5 sm:w-5 md:h-6 md:w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 sm:text-sm">
                {userRole === "advisor" && "Pending Approval"}
                {userRole === "hod" && "Pending HOD Review"}
                {userRole === "accounts_admin" && "Pending Accounts"}
                {!userRole && "Pending"}
              </p>
              <p className="text-lg font-bold text-white sm:text-xl md:text-2xl">
                {counts.pending}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-700 bg-gray-800 p-3 shadow sm:p-4">
          <div className="flex items-center">
            <div className="mr-3 rounded-full bg-green-900/30 p-2 sm:mr-4 sm:p-3">
              <FaCheckCircle className="h-4 w-4 text-green-400 sm:h-5 sm:w-5 md:h-6 md:w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 sm:text-sm">
                {userRole === "advisor" && "Approved"}
                {userRole === "hod" && "HOD Approved"}
                {userRole === "accounts_admin" && "Accounts Approved"}
                {!userRole && "Approved"}
              </p>
              <p className="text-lg font-bold text-white sm:text-xl md:text-2xl">
                {counts.approved}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-700 bg-gray-800 p-3 shadow sm:p-4">
          <div className="flex items-center">
            <div className="mr-3 rounded-full bg-red-900/30 p-2 sm:mr-4 sm:p-3">
              <FaTimesCircle className="h-4 w-4 text-red-400 sm:h-5 sm:w-5 md:h-6 md:w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 sm:text-sm">
                {userRole === "advisor" && "Rejected"}
                {userRole === "hod" && "Rejected by HOD"}
                {userRole === "accounts_admin" && "Rejected"}
                {!userRole && "Rejected"}
              </p>
              <p className="text-lg font-bold text-white sm:text-xl md:text-2xl">
                {counts.rejected}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="mb-4 grid grid-cols-1 gap-3 sm:mb-6 sm:grid-cols-2 sm:gap-4 md:mb-8 md:grid-cols-3 lg:grid-cols-4">
        <div>
          <div className="relative">
            <TextInput
              type="text"
              placeholder="Search by name"
              icon={HiUserGroup}
              className="border-gray-700 bg-gray-800 pl-10 text-sm text-white sm:text-base"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              style={{ paddingLeft: "2.5rem" }}
            />
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <HiUserGroup className="h-4 w-4 text-[#92e3a9] sm:h-5 sm:w-5" />
            </div>
          </div>
        </div>
        <div>
          <div className="relative">
            <TextInput
              type="text"
              placeholder="Search by ID"
              className="border-gray-700 bg-gray-800 pl-10 text-sm text-white sm:text-base"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <HiIdentification className="h-4 w-4 text-[#92e3a9] sm:h-5 sm:w-5" />
            </div>
          </div>
        </div>
        <div>
          <div className="relative">
            <Select
              className="border-gray-700 bg-gray-800 pl-10 text-sm text-white sm:text-base"
              value={searchSession}
              onChange={(e) => setSearchSession(e.target.value)}
            >
              <option value="">All Semesters</option>
              <option value="Spring 2024">Spring 2024</option>
              <option value="Fall 2023">Fall 2023</option>
              <option value="Summer 2024">Summer 2024</option>
            </Select>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <HiCalendar className="h-4 w-4 text-[#92e3a9] sm:h-5 sm:w-5" />
            </div>
          </div>
        </div>
        {userRole === "accounts_admin" ? (
          <div>
            <div className="relative">
              <Select
                className="border-gray-700 bg-gray-800 pl-10 text-sm text-white sm:text-base"
                value={searchDepartment}
                onChange={(e) => setSearchDepartment(e.target.value)}
              >
                <option value="">All Departments</option>
                <option value="1">Computer Science</option>
                <option value="2">Electrical Engineering</option>
                <option value="3">Business Administration</option>
                <option value="4">Medicine</option>
              </Select>
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <HiBuildingOffice2 className="h-4 w-4 text-[#92e3a9] sm:h-5 sm:w-5" />
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="relative">
              <Select
                className="border-gray-700 bg-gray-800 pl-10 text-sm text-white sm:text-base"
                value={searchStatus}
                onChange={(e) => setSearchStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </Select>
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <HiAcademicCap className="h-4 w-4 text-[#92e3a9] sm:h-5 sm:w-5" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto rounded-lg border border-gray-700">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800 text-gray-400">
            <tr>
              <th className="px-2 py-2 text-left text-xs font-medium sm:px-4 sm:py-3 md:px-6 md:py-3">
                <span className="flex items-center gap-1">
                  <HiIdentification className="h-3 w-3 text-[#92e3a9] sm:h-4 sm:w-4" />
                  <span className="xs:inline hidden">Student</span> ID
                </span>
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium sm:px-4 sm:py-3 md:px-6 md:py-3">
                <span className="flex items-center gap-1">
                  <HiUserGroup className="h-3 w-3 text-[#92e3a9] sm:h-4 sm:w-4" />
                  Name
                </span>
              </th>
              <th className="hidden px-2 py-2 text-left text-xs font-medium sm:table-cell sm:px-4 sm:py-3 md:px-6 md:py-3">
                <span className="flex items-center gap-1">
                  <HiCalendar className="h-3 w-3 text-[#92e3a9] sm:h-4 sm:w-4" />
                  Semester
                </span>
              </th>
              <th className="hidden px-2 py-2 text-left text-xs font-medium sm:px-4 sm:py-3 md:table-cell md:px-6 md:py-3">
                <span className="flex items-center gap-1">
                  <HiCalendar className="h-3 w-3 text-[#92e3a9] sm:h-4 sm:w-4" />
                  Submitted
                </span>
              </th>
              <th className="hidden px-2 py-2 text-left text-xs font-medium sm:px-4 sm:py-3 md:px-6 md:py-3 lg:table-cell">
                <span className="flex items-center gap-1">
                  <HiBuildingOffice2 className="h-3 w-3 text-[#92e3a9] sm:h-4 sm:w-4" />
                  Department
                </span>
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium sm:px-4 sm:py-3 md:px-6 md:py-3">
                <span className="flex items-center gap-1">
                  <HiAcademicCap className="h-3 w-3 text-[#92e3a9] sm:h-4 sm:w-4" />
                  Status
                </span>
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium sm:px-4 sm:py-3 md:px-6 md:py-3">
                <span className="flex items-center justify-center gap-1">
                  <HiAcademicCap className="h-3 w-3 text-[#92e3a9] sm:h-4 sm:w-4" />
                  <span className="xs:inline hidden">Courses</span>
                  <span className="xs:hidden">#</span>
                </span>
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium sm:px-4 sm:py-3 md:px-6 md:py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700 bg-gray-900">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-3 py-4 text-center text-white">
                  <div className="flex justify-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-t-2 border-b-2 border-[#92e3a9] sm:h-8 sm:w-8"></div>
                  </div>
                  <p className="mt-2 text-xs sm:text-sm">
                    Loading registration requests...
                  </p>
                </td>
              </tr>
            ) : filteredRegistrations.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-3 py-4 text-center text-xs text-white sm:text-sm"
                >
                  No registration requests found.
                </td>
              </tr>
            ) : (
              filteredRegistrations.map((reg) => (
                <tr
                  key={reg.BUNDLE_ID}
                  className="text-xs text-white hover:bg-gray-800 sm:text-sm"
                >
                  <td className="max-w-[80px] truncate px-2 py-2 sm:max-w-[120px] sm:px-4 sm:py-3 md:px-6 md:py-4">
                    {reg.REGISTRATION_NUMBER || "N/A"}
                  </td>
                  <td className="max-w-[100px] truncate px-2 py-2 sm:max-w-[150px] sm:px-4 sm:py-3 md:max-w-[200px] md:px-6 md:py-4">
                    {reg.student_name}
                  </td>
                  <td className="hidden px-2 py-2 sm:table-cell sm:px-4 sm:py-3 md:px-6 md:py-4">
                    {reg.SEMESTER}
                  </td>
                  <td className="hidden px-2 py-2 sm:px-4 sm:py-3 md:table-cell md:px-6 md:py-4">
                    {formatDate(reg.SUBMITTED_AT)}
                  </td>
                  <td className="hidden max-w-[120px] truncate px-2 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 lg:table-cell">
                    {reg.DEPARTMENT_NAME}
                  </td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4">
                    {getStatus(reg.STATUS)}
                  </td>
                  <td className="px-2 py-2 text-center sm:px-4 sm:py-3 md:px-6 md:py-4">
                    {reg.course_count}
                  </td>
                  <td className="px-2 py-2 text-center sm:px-4 sm:py-3 md:px-6 md:py-4">
                    <div className="flex justify-center gap-2">
                      <Link
                        href={`/dashboard/student-management/${reg.BUNDLE_ID}`}
                      >
                        <Button
                          style={{
                            backgroundColor: "#92e3a9",
                            color: "#000000",
                            cursor: "pointer",
                          }}
                          size="xs"
                          className="bg-[#92e3a9] px-2 text-xs text-gray-900 hover:bg-[#7ac892] sm:px-4 sm:text-sm"
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

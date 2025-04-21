"use client";

import { useState } from "react";
import { Select, TextInput } from "flowbite-react";
import { HiSearch, HiBookOpen, HiUser, HiOfficeBuilding } from "react-icons/hi";

// ✅ Updated with more departments
const departmentNames: Record<number, string> = {
  1: "Computer Science",
  2: "Electrical Engineering",
  3: "Mechanical Engineering",
  4: "Civil Engineering",
  5: "Business Administration",
};

const courses = [
  {
    id: 1,
    name: "Data Structures",
    code: "CS301",
    credit: 3,
    instructor: "Dr. Jane Smith",
    department_id: 1,
    prerequisites: ["Intro to Programming", "Mathematics I"],
  },
  {
    id: 2,
    name: "Database Systems",
    code: "CS315",
    credit: 3,
    instructor: "Prof. Robert Johnson",
    department_id: 1,
    prerequisites: ["Data Structures", "Computer Architecture"],
  },
  {
    id: 3,
    name: "Operating Systems",
    code: "CS325",
    credit: 3,
    instructor: "Dr. Michael Chen",
    department_id: 1,
    prerequisites: ["Computer Architecture", "Database Systems"],
  },
  {
    id: 4,
    name: "Web Development",
    code: "CS375",
    credit: 3,
    instructor: "Dr. Emma Wilson",
    department_id: 2,
    prerequisites: ["Intro to Programming", "UI/UX Basics"],
  },
  {
    id: 5,
    name: "Thermodynamics",
    code: "ME201",
    credit: 3,
    instructor: "Dr. Alice Brown",
    department_id: 3,
    prerequisites: ["Physics I"],
  },
  {
    id: 6,
    name: "Structural Analysis",
    code: "CE310",
    credit: 3,
    instructor: "Prof. David Lee",
    department_id: 4,
    prerequisites: ["Engineering Mechanics"],
  },
  {
    id: 7,
    name: "Marketing 101",
    code: "BA105",
    credit: 3,
    instructor: "Dr. Clara Evans",
    department_id: 5,
    prerequisites: [],
  },
];

export default function CourseCatalogTable() {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Set the number of items per page

  const filtered = courses.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(search.toLowerCase()) ||
      course.code.toLowerCase().includes(search.toLowerCase()) ||
      course.instructor.toLowerCase().includes(search.toLowerCase());
    const matchesDept =
      department === "all" || course.department_id.toString() === department;
    return matchesSearch && matchesDept;
  });

  // Calculate the total pages
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  // Get the current page data
  const currentCourses = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
      {/* Heading */}
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold">Course Catalog</h1>
        <p className="text-gray-400">
          Browse and select courses for registration
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="rounded-lg border border-gray-800 bg-gray-900 p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-semibold text-white">
          Search & Filter
        </h2>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full sm:w-60"
          >
            <option value="all">All Departments</option>
            {Object.entries(departmentNames).map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </Select>

          <TextInput
            icon={HiSearch}
            placeholder="Search by course, code or instructor"
            className="w-full sm:max-w-md"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Course List Section */}
      <div className="rounded-lg border border-gray-800 bg-gray-900 p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-semibold text-white">
          Available Courses
        </h2>
        <div className="relative overflow-x-auto">
          <table className="min-w-full table-fixed divide-y divide-gray-800">
            <thead className="bg-gray-800">
              <tr>
                <th className="w-24 px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Code
                </th>
                <th className="w-48 px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Course Title
                </th>
                <th className="w-20 px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Credits
                </th>
                <th className="w-40 px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Instructor
                </th>
                <th className="w-40 px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Department
                </th>
                <th className="w-40 px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Prerequisites
                </th>
                <th className="w-32 px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase">
                  Selection
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {currentCourses.map((course) => (
                <tr key={course.id} className="bg-gray-900">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-white">
                      <HiBookOpen className="text-[#92e3a9]" />
                      {course.code}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-white">
                    {course.name}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-white">
                    {course.credit}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-white">
                      <HiUser className="text-[#92e3a9]" />
                      {course.instructor}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-white">
                      <HiOfficeBuilding className="text-[#92e3a9]" />
                      {departmentNames[course.department_id] || "Unknown"}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {course.prerequisites.length > 0 ? (
                      <div className="space-y-1">
                        {course.prerequisites.map((prereq, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 text-white"
                          >
                            <HiBookOpen className="text-sm text-[#92e3a9]" />
                            {prereq}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">None</span>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex justify-center">
                      {selectedCourses.includes(course.id) ? (
                        <span className="inline-block min-w-[100px] text-center text-gray-400">
                          Selected
                        </span>
                      ) : (
                        <button
                          className="hover:bg-opacity-90 inline-flex w-full min-w-[100px] justify-center rounded-md bg-[#92e3a9] px-3 py-2 text-sm font-medium text-black transition-colors"
                          onClick={() =>
                            setSelectedCourses([...selectedCourses, course.id])
                          }
                        >
                          Select Course
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-4 text-center text-gray-400"
                  >
                    No courses found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="mt-6 flex justify-center gap-4">
        <button
          className="rounded-md border border-gray-700 bg-[#92e3a9] px-4 py-2 text-black transition-colors hover:bg-gray-800 disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
        <span className="flex items-center text-gray-400">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="hover:bg-opacity-90 rounded-md bg-[#92e3a9] px-4 py-2 text-black transition-colors disabled:opacity-50"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

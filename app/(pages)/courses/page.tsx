"use client";

import { useState } from "react";
import { Button, Select, TextInput } from "flowbite-react";
import {
  HiSearch,
  HiBookOpen,
  HiUser,
  HiOutlineAcademicCap,
  HiOfficeBuilding,
} from "react-icons/hi";

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
  const [cart, setCart] = useState<number[]>([]);

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
    <div className="mx-auto max-w-7xl p-4 sm:p-6">
      <h2 className="mb-6 flex flex-col items-center justify-center gap-2 text-center text-2xl font-extrabold sm:flex-row sm:text-3xl">
        <HiOutlineAcademicCap className="text-[#92e3a9]" />
        COURSE CATALOG
      </h2>

      {/* Filter Controls */}
      <div className="mb-6 flex flex-col flex-wrap justify-center gap-4 sm:flex-row">
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

      {/* Responsive Table Wrapper */}
      <div className="w-full overflow-x-auto rounded-md shadow">
        <table className="w-full min-w-[700px] table-auto text-left">
          <thead
            style={{ backgroundColor: "#92e3a9" }}
            className="text-sm font-semibold text-black"
          >
            <tr>
              <th className="p-3 whitespace-nowrap">Code</th>
              <th className="p-3 whitespace-nowrap">Course Title</th>
              <th className="p-3 whitespace-nowrap">Credits</th>
              <th className="p-3 whitespace-nowrap">Instructor</th>
              <th className="p-3 whitespace-nowrap">Department</th>
              <th className="p-3 whitespace-nowrap">Prerequisites</th>
              <th className="p-3 whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentCourses.map((course) => (
              <tr key={course.id} className="border-t transition">
                <td className="p-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <HiBookOpen className="text-[#92e3a9]" />
                    {course.code}
                  </div>
                </td>
                <td className="p-3 font-medium whitespace-nowrap">
                  {course.name}
                </td>
                <td className="p-3 whitespace-nowrap">{course.credit}</td>
                <td className="p-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <HiUser className="text-[#92e3a9]" />
                    {course.instructor}
                  </div>
                </td>
                <td className="p-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <HiOfficeBuilding className="text-[#92e3a9]" />
                    {departmentNames[course.department_id] || "Unknown"}
                  </div>
                </td>
                <td className="space-y-1 p-3 text-sm whitespace-nowrap">
                  {course.prerequisites.length > 0 ? (
                    course.prerequisites.map((prereq, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <HiBookOpen className="text-sm text-[#92e3a9]" />
                        {prereq}
                      </div>
                    ))
                  ) : (
                    <span className="text-gray-400">None</span>
                  )}
                </td>
                <td className="p-3 whitespace-nowrap">
                  {cart.includes(course.id) ? (
                    <span className="text-sm text-gray-500">In Cart</span>
                  ) : (
                    <Button
                      size="sm"
                      className="text-black"
                      style={{ backgroundColor: "#92e3a9" }}
                      onClick={() => setCart([...cart, course.id])}
                    >
                      Add to Cart
                    </Button>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">
                  No courses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-6 flex flex-col items-center justify-center gap-2 text-sm sm:flex-row">
        <Button
          size="sm"
          disabled={currentPage === 1}
          style={{ backgroundColor: "#92e3a9", color: "black" }}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </Button>
        <span className="px-2">{`Page ${currentPage} of ${totalPages}`}</span>
        <Button
          style={{ backgroundColor: "#92e3a9", color: "black" }}
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

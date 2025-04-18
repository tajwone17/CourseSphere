"use client";

import { useState } from "react";
import { Button, Select, TextInput } from "flowbite-react";
import {
  HiSearch,
  HiBookOpen,
  HiUser,
  HiOutlineAcademicCap,
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
    <div className="mx-auto max-w-7xl p-6">
      <h2 className="mb-6 text-center text-3xl font-extrabold">
        COURSE CATALOG
      </h2>

      {/* Filter Controls */}
      <div className="mb-6 flex flex-wrap justify-center gap-4">
        <Select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="w-60"
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
          className="w-full max-w-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Course Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto rounded-md border text-left shadow">
          <thead
            style={{ backgroundColor: "#92e3a9" }}
            className="text-sm font-semibold text-black"
          >
            <tr>
              <th className="p-3">Code</th>
              <th className="p-3">Course Title</th>
              <th className="p-3">Credits</th>
              <th className="p-3">Instructor</th>
              <th className="p-3">Department</th>
              <th className="p-3">Prerequisites</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentCourses.map((course) => (
              <tr key={course.id} className="border-t transition">
                <td className="flex items-center gap-2 p-3">
                  <HiBookOpen style={{ color: "#92e3a9" }} />
                  {course.code}
                </td>
                <td className="p-3 font-medium">{course.name}</td>
                <td className="p-3">{course.credit}</td>
                <td className="flex items-center gap-2 p-3">
                  <HiUser style={{ color: "#92e3a9" }} />
                  {course.instructor}
                </td>
                <td className="items-center gap-2 p-3">
                  <HiOutlineAcademicCap style={{ color: "#92e3a9" }} />
                  {departmentNames[course.department_id] || "Unknown"}
                </td>
                <td className="space-y-1 p-3 text-sm">
                  {course.prerequisites.length > 0 ? (
                    course.prerequisites.map((prereq, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <HiBookOpen
                          className="text-sm"
                          style={{ color: "#92e3a9" }}
                        />
                        {prereq}
                      </div>
                    ))
                  ) : (
                    <span className="text-gray-400">None</span>
                  )}
                </td>
                <td className="p-3">
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
      <div className="mt-4 flex justify-center gap-2">
        <Button
          size="sm"
          disabled={currentPage === 1}
          style={{ backgroundColor: "#92e3a9", color: "black" }}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </Button>
        <span className="flex items-center">{`Page ${currentPage} of ${totalPages}`}</span>
        <Button
          style={{
            backgroundColor: "#92e3a9",
            color: "black",
          }}
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

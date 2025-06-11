"use client";

import { useState } from "react";
import { Select } from "flowbite-react";
import { HiBookOpen, HiUser, HiOfficeBuilding, HiSearch } from "react-icons/hi";
import ReactSelect from "react-select";

// Department names
const departmentNames: Record<number, string> = {
  1: "Computer Science",
  2: "Electrical Engineering",
  3: "Mechanical Engineering",
  4: "Civil Engineering",
  5: "Business Administration",
};

// Courses list
const courses = [
  {
    id: 1,
    name: "Database Management Systems",
    code: "CSE301",
    credit: 3,
    instructor: "Dr. Tajwone Chowdhury",
    department_id: 1,
    prerequisites: ["Data Structures", "Computer Architecture"],
  },
  {
    id: 2,
    name: "Computer Networks",
    code: "CSE311",
    credit: 3,
    instructor: "Prof. Chironto Rudra Paul",
    department_id: 1,
    prerequisites: ["Operating Systems", "Digital Logic Design"],
  },
  {
    id: 3,
    name: "Operating Systems",
    code: "CSE325",
    credit: 3,
    instructor: "Oli Ahmed",
    department_id: 1,
    prerequisites: ["Computer Architecture", "Programming Fundamentals"],
  },
  {
    id: 4,
    name: "Software Engineering",
    code: "CSE405",
    credit: 3,
    instructor: "Masum Pradhania",
    department_id: 1,
    prerequisites: ["Object Oriented Programming", "Web Programming"],
  },
  {
    id: 5,
    name: "Artificial Intelligence",
    code: "CSE415",
    credit: 3,
    instructor: "Tajwone Chowdhury",
    department_id: 1,
    prerequisites: ["Data Structures", "Algorithm Analysis"],
  },
  {
    id: 6,
    name: "Web Programming",
    code: "CSE426",
    credit: 3,
    instructor: "Jakaria",
    department_id: 1,
    prerequisites: ["Programming Fundamentals", "Database Management Systems"],
  },
];

export default function CourseCatalogTable() {
  const [department, setDepartment] = useState("all");
  const [searchCode, setSearchCode] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  const [searchInstructor, setSearchInstructor] = useState("");
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filtered = courses.filter((course) => {
    const matchesCode = !searchCode || course.code === searchCode;
    const matchesTitle = !searchTitle || course.name === searchTitle;
    const matchesInstructor =
      !searchInstructor || course.instructor === searchInstructor;
    const matchesDept =
      department === "all" || course.department_id.toString() === department;
    return matchesCode && matchesTitle && matchesInstructor && matchesDept;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentCourses = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const courseCodeOptions = Array.from(new Set(courses.map((c) => c.code))).map(
    (code) => ({
      value: code,
      label: code,
    }),
  );

  const courseTitleOptions = Array.from(
    new Set(courses.map((c) => c.name)),
  ).map((title) => ({
    value: title,
    label: title,
  }));

  const instructorOptions = Array.from(
    new Set(courses.map((c) => c.instructor)),
  ).map((instructor) => ({
    value: instructor,
    label: instructor,
  }));

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
      <div
        className="mb-8 text-center"
        data-aos="fade-down"
        data-aos-duration="1000"
      >
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-gray-200 lg:text-5xl">
          Course Catalog
        </h1>
        <p className="mt-4 text-lg text-gray-400">
          Browse and select courses for your upcoming semester
        </p>
      </div>

      <div
        className="rounded-lg border border-gray-800 bg-gray-900 p-6 shadow-xl"
        data-aos="fade-up"
        data-aos-duration="800"
      >
        <h2 className="mb-4 text-xl font-semibold text-white">
          Search & Filter
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full"
          >
            <option value="all">All Departments</option>
            {Object.entries(departmentNames).map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </Select>

          <div className="relative">
            <HiSearch className="absolute top-3.5 left-3 text-gray-500" />
            <ReactSelect
              options={courseCodeOptions}
              placeholder="Search by code"
              isClearable
              instanceId="course-code-select"
              onChange={(option) => setSearchCode(option?.value || "")}
              className="pl-8"
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: "#1f2937", // dark background
                  borderColor: "#374151",
                  color: "white",
                }),
                singleValue: (base) => ({
                  ...base,
                  color: "white", // selected value
                }),
                input: (base) => ({
                  ...base,
                  color: "white", // input text
                }),
                placeholder: (base) => ({
                  ...base,
                  color: "#9ca3af", // placeholder text (gray-400)
                }),
                menu: (base) => ({
                  ...base,
                  backgroundColor: "#1f2937", // dropdown menu background
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isFocused ? "#374151" : "#1f2937",
                  color: "white", // <-- suggestion text color
                  cursor: "pointer",
                }),
              }}
            />
          </div>

          <div className="relative">
            <ReactSelect
              options={courseTitleOptions}
              placeholder="Search by title"
              isClearable
              instanceId="course-title-select"
              onChange={(option) => setSearchTitle(option?.value || "")}
              className="pl-8"
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: "#1f2937", // dark background
                  borderColor: "#374151",
                  color: "white",
                }),
                singleValue: (base) => ({
                  ...base,
                  color: "white", // selected value
                }),
                input: (base) => ({
                  ...base,
                  color: "white", // input text
                }),
                placeholder: (base) => ({
                  ...base,
                  color: "#9ca3af", // placeholder text (gray-400)
                }),
                menu: (base) => ({
                  ...base,
                  backgroundColor: "#1f2937", // dropdown menu background
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isFocused ? "#374151" : "#1f2937",
                  color: "white", // <-- suggestion text color
                  cursor: "pointer",
                }),
              }}
            />
          </div>

          <div className="relative">
            <HiSearch className="absolute top-3.5 left-3 text-gray-500" />
            <ReactSelect
              options={instructorOptions}
              placeholder="Search by Instructor"
              isClearable
              instanceId="instructor-select"
              onChange={(option) => setSearchInstructor(option?.value || "")}
              className="pl-8"
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: "#1f2937", // dark background
                  borderColor: "#374151",
                  color: "white",
                }),
                singleValue: (base) => ({
                  ...base,
                  color: "white", // selected value
                }),
                input: (base) => ({
                  ...base,
                  color: "white", // input text
                }),
                placeholder: (base) => ({
                  ...base,
                  color: "#9ca3af", // placeholder text (gray-400)
                }),
                menu: (base) => ({
                  ...base,
                  backgroundColor: "#1f2937", // dropdown menu background
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isFocused ? "#374151" : "#1f2937",
                  color: "white", // <-- suggestion text color
                  cursor: "pointer",
                }),
              }}
            />
          </div>
        </div>
      </div>

      <div
        className="rounded-lg border border-gray-800 bg-gray-900 p-6 shadow-xl"
        data-aos="fade-up"
        data-aos-delay="200"
        style={{ maxWidth: "100%" }}
      >
        <h2 className="mb-4 text-xl font-semibold text-white">
          Available Courses
        </h2>
        <div className="max-w-full overflow-x-auto">
          <div className="w-full">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full table-auto text-left text-sm">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase">
                      Code
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase">
                      Course Title
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase">
                      Credits
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase">
                      Instructor
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase">
                      Department
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase">
                      Prerequisites
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase">
                      Selection
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {currentCourses.map((course) => (
                    <tr
                      key={course.id}
                      className="bg-gray-900 transition-colors duration-200 hover:bg-gray-800"
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="group flex items-center gap-2 text-white">
                          <HiBookOpen className="text-[#92e3a9] transition-transform group-hover:scale-110" />
                          {course.code}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-white hover:text-[#92e3a9]">
                        {course.name}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-white">
                        {course.credit}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="group flex items-center gap-2 text-white">
                          <HiUser className="text-[#92e3a9] transition-transform group-hover:scale-110" />
                          {course.instructor}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="group flex items-center gap-2 text-white">
                          <HiOfficeBuilding className="text-[#92e3a9] transition-transform group-hover:scale-110" />
                          {departmentNames[course.department_id] || "Unknown"}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {course.prerequisites.length > 0 ? (
                          <div className="space-y-1">
                            {course.prerequisites.map((prereq, i) => (
                              <div
                                key={i}
                                className="group flex items-center gap-2 text-white"
                              >
                                <HiBookOpen className="text-sm text-[#92e3a9] transition-transform group-hover:scale-110" />
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
                            <span className="inline-block min-w-[100px] rounded-md border border-[#92e3a9] bg-[#92e3a9]/10 px-3 py-2 text-center text-[#92e3a9]">
                              Selected
                            </span>
                          ) : (
                            <button
                              className="inline-flex w-full min-w-[100px] justify-center rounded-md bg-[#92e3a9] px-3 py-2 text-sm font-medium text-black transition-all hover:scale-105 hover:bg-[#7acc91] hover:shadow-lg"
                              onClick={() =>
                                setSelectedCourses([
                                  ...selectedCourses,
                                  course.id,
                                ])
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
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          className="rounded-md bg-[#92e3a9] px-4 py-2 text-black transition-all hover:bg-[#7acc91] hover:shadow-lg disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
        <span className="flex items-center text-gray-400">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="rounded-md bg-[#92e3a9] px-4 py-2 text-black transition-all hover:bg-[#7acc91] hover:shadow-lg disabled:opacity-50"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

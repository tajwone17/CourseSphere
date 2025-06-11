"use client";
import React, { useState } from "react";
import { Button, Modal, TextInput, Label } from "flowbite-react";
import { HiPlus, HiCode, HiDocumentText, HiUser } from "react-icons/hi";
import Select, { SingleValue } from "react-select";

interface Course {
  id: number;
  code: string;
  title: string;
  credit: number;
  department: string;
  instructor: string;
  status: "Active" | "Inactive";
}

const initialCourses: Course[] = [
  {
    id: 1,
    code: "CSE101",
    title: "Introduction to Programming",
    credit: 3,
    department: "CSE",
    instructor: "Dr. A. Rahman",
    status: "Active",
  },
  {
    id: 2,
    code: "EEE201",
    title: "Basic Electronics",
    credit: 3,
    department: "EEE",
    instructor: "Prof. S. Islam",
    status: "Active",
  },
  {
    id: 3,
    code: "CIV150",
    title: "Engineering Drawing",
    credit: 2,
    department: "Civil",
    instructor: "Engr. M. Hasan",
    status: "Inactive",
  },
];

export default function ManageCourse() {
  const [courses, setCourses] = useState(initialCourses);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCourse, setNewCourse] = useState({
    code: "",
    title: "",
    credit: "",
    department: "",
    instructor: "",
  });

  // Replace single search with separate search fields
  const [codeSearch, setCodeSearch] = useState("");
  const [titleSearch, setTitleSearch] = useState("");
  const [instructorSearch, setInstructorSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const handleAddCourse = () => {
    if (
      !newCourse.code ||
      !newCourse.title ||
      !newCourse.credit ||
      !newCourse.department ||
      !newCourse.instructor
    )
      return;
    setCourses([
      ...courses,
      {
        id: courses.length + 1,
        code: newCourse.code,
        title: newCourse.title,
        credit: Number(newCourse.credit),
        department: newCourse.department,
        instructor: newCourse.instructor,
        status: "Active",
      },
    ]);
    setShowAddModal(false);
    setNewCourse({
      code: "",
      title: "",
      credit: "",
      department: "",
      instructor: "",
    });
  };

  const handleToggleStatus = (id: number) => {
    setCourses((prev) =>
      prev.map((course) =>
        course.id === id
          ? {
              ...course,
              status: course.status === "Active" ? "Inactive" : "Active",
            }
          : course,
      ),
    );
  };

  // Add handlers for search fields
  const handleCodeSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setCodeSearch(event.target.value);
  };

  const handleTitleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTitleSearch(event.target.value);
  };

  const handleInstructorSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setInstructorSearch(event.target.value);
  };

  const handleStatusChange = (
    selectedOption: SingleValue<{ value: string; label: string }> | null,
  ) => {
    if (selectedOption) {
      setStatusFilter(selectedOption.value);
    } else {
      setStatusFilter("");
    }
  };

  const statusOptions = [
    { value: "", label: "All" },
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];

  // Update filtering logic to use all search fields
  const filteredCourses = courses.filter(
    (course) =>
      (codeSearch === "" ||
        course.code.toLowerCase().includes(codeSearch.toLowerCase())) &&
      (titleSearch === "" ||
        course.title.toLowerCase().includes(titleSearch.toLowerCase())) &&
      (instructorSearch === "" ||
        course.instructor
          .toLowerCase()
          .includes(instructorSearch.toLowerCase())) &&
      (statusFilter === "" || course.status === statusFilter),
  );

  return (
    <div
      className="mx-auto max-w-5xl p-8"
      data-aos="zoom-in"
      data-aos-duration="1000"
    >
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Manage Courses</h1>
          <p className="mt-4 text-lg text-gray-400">
            Add, view, and manage courses
          </p>
        </div>
        <Button
          style={{
            backgroundColor: "#92e3a9",
            color: "#000",
            marginTop: 20,
            width: "fit-content",
            cursor: "pointer",
          }}
          onClick={() => setShowAddModal(true)}
        >
          <HiPlus className="mr-2" /> Add New Course
        </Button>
      </div>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <div className="relative">
          <input
            type="text"
            className="w-full rounded border border-gray-700 bg-gray-800 py-2 pr-4 pl-10 text-white placeholder-gray-400 focus:border-[#92e3a9] focus:outline-none"
            placeholder="Search by code"
            value={codeSearch}
            onChange={handleCodeSearchChange}
          />
          <div className="absolute top-0 left-0 flex h-full items-center pl-3">
            <HiCode className="h-5 w-5 text-[#92e3a9]" />
          </div>
        </div>
        <div className="relative">
          <input
            type="text"
            className="w-full rounded border border-gray-700 bg-gray-800 py-2 pr-4 pl-10 text-white placeholder-gray-400 focus:border-[#92e3a9] focus:outline-none"
            placeholder="Search by title"
            value={titleSearch}
            onChange={handleTitleSearchChange}
          />
          <div className="absolute top-0 left-0 flex h-full items-center pl-3">
            <HiDocumentText className="h-5 w-5 text-[#92e3a9]" />
          </div>
        </div>
        <div className="relative">
          <input
            type="text"
            className="w-full rounded border border-gray-700 bg-gray-800 py-2 pr-4 pl-10 text-white placeholder-gray-400 focus:border-[#92e3a9] focus:outline-none"
            placeholder="Search by instructor"
            value={instructorSearch}
            onChange={handleInstructorSearchChange}
          />
          <div className="absolute top-0 left-0 flex h-full items-center pl-3">
            <HiUser className="h-5 w-5 text-[#92e3a9]" />
          </div>
        </div>
        <div className="relative">
          <Select
            options={statusOptions}
            onChange={handleStatusChange}
            placeholder="Filter by Status"
            isSearchable={false}
            value={statusOptions.find(
              (option) => option.value === statusFilter,
            )}
            styles={{
              control: (baseStyles) => ({
                ...baseStyles,
                backgroundColor: "#1f2937", // Dark background
                borderColor: "#374151",
                color: "white",
                "&:hover": {
                  borderColor: "#4b5563",
                },
              }),
              menu: (baseStyles) => ({
                ...baseStyles,
                backgroundColor: "#1f2937", // Dark background for dropdown menu
              }),
              option: (baseStyles, { isFocused, isSelected }) => ({
                ...baseStyles,
                backgroundColor: isSelected
                  ? "#92e3a9" // Primary green color for selected item
                  : isFocused
                    ? "#374151" // Slightly lighter dark for hover
                    : "#1f2937", // Dark background
                color: isSelected ? "black" : "white",
                cursor: "pointer",
                ":active": {
                  backgroundColor: isSelected ? "#92e3a9" : "#374151",
                },
              }),
              singleValue: (baseStyles) => ({
                ...baseStyles,
                color: "white", // Text color for selected value
              }),
              placeholder: (baseStyles) => ({
                ...baseStyles,
                color: "#9ca3af", // Light gray for placeholder
              }),
              dropdownIndicator: (baseStyles) => ({
                ...baseStyles,
                color: "#9ca3af", // Light gray for dropdown arrow
                "&:hover": {
                  color: "white",
                },
              }),
              indicatorSeparator: (baseStyles) => ({
                ...baseStyles,
                backgroundColor: "#4b5563",
              }),
              input: (baseStyles) => ({
                ...baseStyles,
                color: "white",
              }),
            }}
          />
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-700 lg:overflow-hidden">
        <table className="min-w-full divide-y divide-gray-800">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                Credit
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                Instructor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 bg-gray-900">
            {filteredCourses.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-400">
                  No courses found.
                </td>
              </tr>
            )}
            {filteredCourses.map((course) => (
              <tr key={course.id} className="hover:bg-gray-800">
                <td className="px-6 py-4 whitespace-nowrap text-white">
                  {course.code}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-white">
                  {course.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-white">
                  {course.credit}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-white">
                  {course.instructor}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-white">
                  {course.status}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Button
                    size="xs"
                    style={{
                      backgroundColor:
                        course.status === "Active" ? "#ef4444" : "#22c55e",
                      color: "#fff",
                    }}
                    onClick={() => handleToggleStatus(course.id)}
                  >
                    {course.status === "Active" ? "Set Inactive" : "Set Active"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal show={showAddModal} onClose={() => setShowAddModal(false)}>
        <div className="relative rounded-lg bg-gray-800 p-6">
          <div className="mb-4 text-xl font-semibold text-white">
            Add New Course
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddCourse();
            }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="code" className="text-gray-300">
                Course Code
              </Label>
              <TextInput
                id="code"
                value={newCourse.code}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, code: e.target.value })
                }
                className="border-gray-700 bg-gray-900 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="title" className="text-gray-300">
                Title
              </Label>
              <TextInput
                id="title"
                value={newCourse.title}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, title: e.target.value })
                }
                className="border-gray-700 bg-gray-900 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="credit" className="text-gray-300">
                Credit
              </Label>
              <TextInput
                id="credit"
                type="number"
                value={newCourse.credit}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, credit: e.target.value })
                }
                className="border-gray-700 bg-gray-900 text-white"
                required
                min={1}
                max={6}
              />
            </div>

            <div>
              <Label htmlFor="instructor" className="text-gray-300">
                Instructor
              </Label>
              <TextInput
                id="instructor"
                value={newCourse.instructor}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, instructor: e.target.value })
                }
                className="border-gray-700 bg-gray-900 text-white"
                required
              />
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button
                color="gray"
                onClick={() => setShowAddModal(false)}
                type="button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                style={{ backgroundColor: "#92e3a9", color: "#000" }}
              >
                Add Course
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

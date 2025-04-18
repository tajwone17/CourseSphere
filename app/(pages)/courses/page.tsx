"use client";

import { useState } from "react";
import { Button, Card, TextInput, Select } from "flowbite-react";

import {
  HiArrowRight,
  HiBookOpen,
  HiOutlineIdentification,
  HiOutlineCalculator,
  HiOutlineOfficeBuilding,
  HiOutlineUser,
  HiSearch,
} from "react-icons/hi";

interface Course {
  id: number;
  name: string;
  code: string;
  credit: number;
  department_id: number;
  instructor: string;
  prerequisites?: string[]; // Added field for prerequisites
}

// Static course data with multiple prerequisites
const courses: Course[] = [
  {
    id: 1,
    name: "Data Structures",
    code: "CS201",
    credit: 3.0,
    department_id: 1,
    instructor: "Dr. Abdullah",
    prerequisites: [
      "Introduction to Programming",
      "Mathematics for Computer Science",
    ], // Multiple prerequisites
  },
  {
    id: 2,
    name: "Operating Systems",
    code: "CS301",
    credit: 3.5,
    department_id: 1,
    instructor: "Prof. Jakaria",
    prerequisites: ["Data Structures", "Computer Architecture"], // Multiple prerequisites
  },
  {
    id: 3,
    name: "Database Systems",
    code: "CS305",
    credit: 3.0,
    department_id: 1,
    instructor: "Dr. Chowdhury",
    prerequisites: ["Operating Systems", "Data Structures"], // Multiple prerequisites
  },
  {
    id: 4,
    name: "Networking Basics",
    code: "CS210",
    credit: 2.5,
    department_id: 2,
    instructor: "Prof. Tajwone",
    prerequisites: ["Introduction to Programming", "Mathematics for Engineers"], // Multiple prerequisites
  },
  {
    id: 5,
    name: "Elementary Programming",
    code: "CS211",
    credit: 2.5,
    department_id: 2,
    instructor: "Prof. Tajwone",
    prerequisites: ["None"], // No prerequisites
  },
  {
    id: 6,
    name: "Software Engineering",
    code: "CS212",
    credit: 2.5,
    department_id: 2,
    instructor: "Prof. Tajwone",
    prerequisites: ["Data Structures", "Software Development Practices"], // Multiple prerequisites
  },
  {
    id: 7,
    name: "Advanced Data Structures",
    code: "CS213",
    credit: 2.5,
    department_id: 2,
    instructor: "Prof. Tajwone",
    prerequisites: ["Data Structures", "Algorithms"], // Multiple prerequisites
  },
];

const departmentNames: Record<number, string> = {
  1: "Computer Science",
  2: "Electrical Engineering",
};

export default function CourseComponent() {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");
  const [cart, setCart] = useState<Course[]>([]); // Cart state to store added courses
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null); // Course details for modal
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(search.toLowerCase()) ||
      course.code.toLowerCase().includes(search.toLowerCase());

    const matchesDept =
      department === "all" || course.department_id.toString() === department;

    return matchesSearch && matchesDept;
  });

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const handleAddToCart = (course: Course) => {
    setCart([...cart, course]);
    setShowModal(false); // Close the modal after adding to cart
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close modal without adding to cart
  };

  return (
    <div className="px-4 py-8">
      {/* Page Heading */}
      <h1 className="flex items-center justify-center gap-2 text-center text-3xl font-extrabold">
        Course List
        <HiBookOpen className="text-4xl text-[#92e3a9]" />
      </h1>

      {/* Search and Filter */}
      <div className="mt-6 flex flex-wrap justify-center gap-4">
        <TextInput
          icon={HiSearch}
          placeholder="Search by name or code"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm"
        />
        <Select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="w-full max-w-xs"
        >
          <option value="all">All Departments</option>
          <option value="1">Computer Science</option>
          <option value="2">Electrical Engineering</option>
        </Select>
      </div>

      {/* Course Cards */}
      <div className="mt-10 flex flex-wrap justify-center gap-x-4 gap-y-4 overflow-hidden">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <Card
              key={course.id}
              data-aos="fade-up"
              style={{
                backgroundColor: "#000000",
                color: "#ffffff",
                width: "280px",
              }}
              className="rounded-lg border-2 border-white"
            >
              <h5 className="flex items-center gap-2 text-xl font-bold">
                <HiBookOpen className="text-[#92e3a9]" /> {course.name}
              </h5>

              <p className="flex items-center gap-2 text-gray-300">
                <HiOutlineIdentification /> Code: {course.code}
              </p>

              <p className="flex items-center gap-2 text-gray-300">
                <HiOutlineCalculator /> Credit: {course.credit}
              </p>

              <p className="flex items-center gap-2 text-gray-300">
                <HiOutlineOfficeBuilding /> Dept:{" "}
                {departmentNames[course.department_id]}
              </p>

              <p className="flex items-center gap-2 text-gray-300">
                <HiOutlineUser /> Instructor: {course.instructor}
              </p>

              <Button
                onClick={() => handleCourseSelect(course)}
                className="mt-2 cursor-pointer"
                style={{
                  backgroundColor: "#92e3a9",
                  color: "#000000",
                }}
              >
                View Course
                <HiArrowRight className="ml-2" size={20} />
              </Button>
            </Card>
          ))
        ) : (
          <p className="text-center text-white">No courses found.</p>
        )}
      </div>

      {/* Modal for course details */}
      {showModal && selectedCourse && (
        <div className="bg-opacity-50 fixed inset-0 flex items-center justify-center backdrop-blur">
          <div
            className="w-full max-w-md rounded-lg border-2 border-white bg-black p-8"
            data-aos="zoom-in"
          >
            <h3 className="mb-4 text-2xl font-bold">Course Details</h3>
            <p className="mb-2">
              <strong>Name:</strong> {selectedCourse.name}
            </p>
            <p className="mb-2">
              <strong>Code:</strong> {selectedCourse.code}
            </p>
            <p className="mb-2">
              <strong>Instructor:</strong> {selectedCourse.instructor}
            </p>
            <p className="mb-2">
              <strong>Credit:</strong> {selectedCourse.credit}
            </p>
            <p className="mb-2">
              <strong>Department:</strong>{" "}
              {departmentNames[selectedCourse.department_id]}
            </p>

            {/* Prerequisites */}
            <p className="mb-2">
              <strong>Prerequisites:</strong>{" "}
              {selectedCourse.prerequisites?.length ? (
                selectedCourse.prerequisites.join(", ")
              ) : (
                <span>No prerequisites</span>
              )}
            </p>

            <div className="mt-4 flex justify-between">
              <Button
                onClick={handleCloseModal}
                style={{
                  backgroundColor: "#f00",
                  color: "#fff",
                }}
              >
                Close
              </Button>

              <Button
                onClick={() => handleAddToCart(selectedCourse)}
                style={{
                  backgroundColor: "#92e3a9",
                  color: "#000000",
                }}
              >
                Checkout
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import { Button, Modal, TextInput, Label } from "flowbite-react";
import {
  HiPlus,
  HiOutlineHashtag,
  HiDocumentText,
  HiUser,
  HiCheck,
  HiStatusOffline,
  HiStatusOnline,
  HiX,
  HiCreditCard,
  HiClock,
} from "react-icons/hi";
import Select, { SingleValue } from "react-select";
import { useAuth } from "../../../context/AuthContext";
interface COURSE {
  ID: number;
  CODE: string;
  TITLE: string;
  CREDIT: number;
  DEPARTMENT: string;
  INSTRUCTOR_NAME: string;
  STATUS: number;
}

export default function ManageCourse() {
  const { user } = useAuth();
  const [courseList, setCourseList] = useState<COURSE[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<COURSE | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCourse, setNewCourse] = useState({
    code: "",
    title: "",
    credit: "",
    department: "",
    instructor_name: "",
  });

  // Replace single search with separate search fields
  const [codeSearch, setCodeSearch] = useState("");
  const [titleSearch, setTitleSearch] = useState("");
  const [instructorSearch, setInstructorSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("inactive");

  useEffect(() => {
    console.log("User data:", user);

    if (user && user.department && user.departmentId) {
      setNewCourse((prev) => ({
        ...prev,
        department: user.departmentId,
      }));
    }
  }, [user]);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch("/api/courses/get-courses", {
          headers: {
            departmentid: user?.departmentId ? String(user.departmentId) : "",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch Courses");
        }
        const data = await response.json();
        console.log(data.courses);
        setCourseList(data.courses);
      } catch (error: unknown) {
        console.log(error);
      }
    }
    fetchCourses();
  }, [user?.departmentId]);

  const handleAddCourse = async () => {
    // Validate the form data
    if (
      !newCourse.code ||
      !newCourse.title ||
      !newCourse.credit ||
      !newCourse.instructor_name
    ) {
      // console.error("All fields are required");
      alert("All fields are required");
      return;
    }

    try {
      console.log("Sending data:", newCourse);
      const res = await fetch("/api/courses/add-course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          departmentid: user?.departmentId,
        },
        credentials: "include",
        body: JSON.stringify(newCourse),
      });

      if (!res.ok) {
        const errorText = await res.text();
        const errorMsg = errorText.split("\n")[0];
        console.log("Error response:", errorText);
        alert(` ${errorMsg}`);
        throw new Error(errorMsg);
      } else {
        // Fetch updated list after successful addition
        const response = await fetch("/api/courses/get-courses", {
          headers: {
            departmentid: user?.departmentId ? String(user.departmentId) : "",
          },
        });
        if (response.ok) {
          const data = await response.json();
          setCourseList(data.courses);
        }
        alert("Course added successfully");
        console.log("New Course added successfully");
      }
    } catch (error) {
      console.log("Error adding Course:", error);
    }

    // Reset the form and close modal
    setNewCourse({
      code: "",
      title: "",
      credit: "",
      department: "",
      instructor_name: "",
    });
    setShowAddModal(false);
  };
  const openModal = (course: COURSE, action: "active" | "inactive") => {
    setSelectedCourse(course);
    setStatus(action);
    setShowModal(true);
  };
  // const filteredCourseList = courseList.filter((course) => {
  //   // Name filter
  //   const codeMatch =
  //     !codeSearch ||
  //     course.CODE.toLowerCase().includes(codeSearch.toLowerCase());

  //   // Title filter
  //   const titleMatch =
  //     !titleSearch ||
  //     course.TITLE.toLowerCase().includes(titleSearch.toLowerCase());

  //   // Instructor filter
  //   const instructorMatch =
  //     !instructorSearch ||
  //     course.INSTRUCTOR.toLowerCase().includes(instructorSearch.toLowerCase());

  //   // Status filter
  //   const statusMatch =
  //     !statusFilter ||
  //     course.STATUS ===
  //       (statusFilter === "Active"
  //         ? 1
  //         : statusFilter === "Inactive"
  //           ? 0
  //           : course.STATUS);

  //   return codeMatch && titleMatch && instructorMatch && statusMatch;
  // });

  const confirmAction = async () => {
    if (selectedCourse) {
      try {
        // Update local state
        setCourseList((prev) =>
          prev.map((course) =>
            course.ID === selectedCourse.ID
              ? { ...course, STATUS: status === "active" ? 1 : 0 }
              : course,
          ),
        );

        // Make API call to update status in the database
        const response = await fetch(
          `/api/courses/course-status/${selectedCourse.ID}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              status: status === "active" ? 1 : 0,
            }),
          },
        );
        if (response.ok) {
          alert(
            `Course status updated to ${status === "active" ? "Active" : "Inactive"}`,
          );
        }
        if (!response.ok) {
          alert("Failed to update status");
        }
      } catch (error) {
        console.error("Error updating account status:", error);
        // You could add error handling UI here
      }
    }
    setShowModal(false);
  };
  const handleStatusChange = (
    selectedOption: SingleValue<{ value: string; label: string }> | null,
  ) => {
    if (selectedOption) {
      setStatusFilter(selectedOption.value); // Set the value of the selected option
    } else {
      setStatusFilter(""); // Clear the filter if nothing is selected
    }
  };
  const statusOptions = [
    { value: " ", label: "All" },
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];

  // Email filter
  //   const emailMatch =
  //     !searchEmail ||
  //     course.INSTRUCTOR.toLowerCase().includes(searchEmail.toLowerCase());

  //   // Status filter
  //   const statusMatch =
  //     !statusFilter ||
  //     course.STATUS ===
  //       (statusFilter === "Active"
  //         ? 1
  //         : statusFilter === "Inactive"
  //           ? 0
  //           : course.STATUS);

  //   return codeMatch && titleMatch && instructorMatch && statusMatch;
  // });

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

  // Update filtering logic to use all search fields
  const filteredCourses = courseList.filter(
    (course) =>
      (codeSearch === "" ||
        course.CODE.toLowerCase().includes(codeSearch.toLowerCase())) &&
      (titleSearch === "" ||
        course.TITLE.toLowerCase().includes(titleSearch.toLowerCase())) &&
      (instructorSearch === "" ||
        course.INSTRUCTOR_NAME.toLowerCase().includes(
          instructorSearch.toLowerCase(),
        )) &&
      (statusFilter === "" ||
        course.STATUS ===
          (statusFilter === "Active"
            ? 1
            : statusFilter === "Inactive"
              ? 0
              : course.STATUS)),
  );

  return (
    <div
      className="mx-auto max-w-5xl p-8"
      data-aos="zoom-in"
      data-aos-duration="1000"
    >
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="flex items-center text-4xl font-bold text-white">
            <HiDocumentText className="mr-3 h-10 w-10 text-[#92e3a9]" />
            Manage Courses
          </h1>
         
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
            <HiOutlineHashtag className="h-5 w-5 text-[#92e3a9]" />
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
                <div className="flex items-center gap-2">
                  <HiOutlineHashtag className="h-4 w-4 text-[#92e3a9]" />
                  <span>Code</span>
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                <div className="flex items-center gap-2">
                  <HiDocumentText className="h-4 w-4 text-[#92e3a9]" />
                  <span>Title</span>
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                <div className="flex items-center gap-2">
                  <HiCreditCard className="h-4 w-4 text-[#92e3a9]" />
                  <span>Credit</span>
                </div>
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                <div className="flex items-center gap-2">
                  <HiUser className="h-4 w-4 text-[#92e3a9]" />
                  <span>Instructor</span>
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                <div className="flex items-center gap-2">
                  <HiStatusOnline className="h-4 w-4 text-[#92e3a9]" />
                  <span>Status</span>
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                <div className="flex items-center gap-2">
                  <HiClock className="h-4 w-4 text-[#92e3a9]" />
                  <span>Action</span>
                </div>
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
              <tr key={course.ID} className="hover:bg-gray-800">
                <td className="px-6 py-4 whitespace-nowrap text-white">
                  {course.CODE}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-white">
                  {course.TITLE}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-white">
                  {course.CREDIT}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-white">
                  {course.INSTRUCTOR_NAME}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-white">
                  {course.STATUS === 1 ? (
                    <HiStatusOnline className="mr-2 inline text-green-500" />
                  ) : (
                    <HiStatusOffline className="mr-2 inline text-red-500" />
                  )}
                  {course.STATUS === 1 ? "Active" : "Inactive"}
                </td>
                {/* {" "} */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {course.STATUS === 0 ? (
                    <Button
                      size="xs"
                      style={{ backgroundColor: "#22c55e", color: "#fff" }}
                      onClick={() => openModal(course, "active")}
                      className="flex items-center gap-1 px-3 py-1 transition-transform hover:scale-105"
                    >
                      <HiCheck className="h-4 w-4 text-white" />
                      <span>Activate</span>
                    </Button>
                  ) : (
                    <Button
                      size="xs"
                      style={{ backgroundColor: "#ef4444", color: "#fff" }}
                      onClick={() => openModal(course, "inactive")}
                      className="flex items-center gap-1 px-3 py-1 transition-transform hover:scale-105"
                    >
                      <HiX className="h-4 w-4 text-white" />
                      <span>Deactivate</span>
                    </Button>
                  )}
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
                value={newCourse.instructor_name}
                onChange={(e) =>
                  setNewCourse({
                    ...newCourse,
                    instructor_name: e.target.value,
                  })
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
      {/* Confirmation Modal */}{" "}
      <Modal show={showModal} size="md" onClose={() => setShowModal(false)}>
        <div className="p-6 text-center">
          {status === "active" ? (
            <HiStatusOnline className="mx-auto mb-4 h-14 w-14 text-green-500" />
          ) : (
            <HiX className="mx-auto mb-4 h-14 w-14 text-red-500" />
          )}
          <h3 className="mb-5 text-lg font-normal text-gray-300">
            Are you sure you want to{" "}
            <span className="font-semibold text-white">{status}</span> the
            account of{" "}
            <span className="font-semibold text-white">
              {selectedCourse?.TITLE}
            </span>
            ?
          </h3>
          <div className="flex justify-center gap-4">
            <Button
              color={status === "active" ? "success" : "failure"}
              onClick={confirmAction}
              className="flex items-center gap-2"
            >
              {status === "active" ? (
                <HiCheck className="text-white" />
              ) : (
                <HiX className="text-white" />
              )}
              Yes, {status}
            </Button>
            <Button color="gray" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

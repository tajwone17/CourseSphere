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
  HiLink,
} from "react-icons/hi";
import Select, { SingleValue, MultiValue } from "react-select";
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

interface PrerequisiteCourse {
  ID: number;
  CODE: string;
  TITLE: string;
}

export default function ManageCourse() {
  const { user } = useAuth();
  const [courseList, setCourseList] = useState<COURSE[]>([]);
  const [prerequisiteCourses, setPrerequisiteCourses] = useState<
    PrerequisiteCourse[]
  >([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<COURSE | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCourse, setNewCourse] = useState({
    code: "",
    title: "",
    credit: "",
    department: "",
    instructor_name: "",
    prerequisites: [] as number[],
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

  // Define fetchPrerequisiteCourses with useCallback
  const fetchPrerequisiteCourses = React.useCallback(async () => {
    try {
      const response = await fetch("/api/courses/prerequisite-courses", {
        headers: {
          departmentid: user?.departmentId ? String(user.departmentId) : "",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch prerequisite courses");
      }
      const data = await response.json();
      setPrerequisiteCourses(data.courses);
    } catch (error) {
      console.error("Error fetching prerequisite courses:", error);
    }
  }, [user?.departmentId]);

  // Fetch prerequisite courses when the add course modal is opened
  useEffect(() => {
    if (showAddModal) {
      fetchPrerequisiteCourses();
    }
  }, [showAddModal, fetchPrerequisiteCourses]);

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
      prerequisites: [],
    });
    setShowAddModal(false);
  };

  const handlePrerequisiteChange = (
    selectedOptions: MultiValue<{ value: number; label: string }>,
  ) => {
    const selectedIds = selectedOptions.map((option) => option.value);
    setNewCourse((prev) => ({
      ...prev,
      prerequisites: selectedIds,
    }));
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
      className="mx-auto max-w-5xl p-4 sm:p-6 md:p-8"
      data-aos="zoom-in"
      data-aos-duration="1000"
    >
      <div className="mb-6 flex flex-col justify-between sm:mb-8 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center text-2xl font-bold text-white sm:text-3xl md:text-4xl">
            <HiDocumentText className="mr-2 h-6 w-6 text-[#92e3a9] sm:mr-3 sm:h-8 sm:w-8 md:h-10 md:w-10" />
            Manage Courses
          </h1>
        </div>
        <Button
          style={{
            backgroundColor: "#92e3a9",
            color: "#000",
            marginTop: "10px",
            width: "fit-content",
            cursor: "pointer",
          }}
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1 text-sm sm:gap-2 sm:text-base"
        >
          <HiPlus className="h-4 w-4 sm:h-5 sm:w-5" />
          <span>Add New Course</span>
        </Button>
      </div>
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-4">
        <div className="relative">
          <input
            type="text"
            className="w-full rounded border border-gray-700 bg-gray-800 py-2 pr-4 pl-8 text-sm text-white placeholder-gray-400 focus:border-[#92e3a9] focus:outline-none sm:pl-10 sm:text-base"
            placeholder="Search by code"
            value={codeSearch}
            onChange={handleCodeSearchChange}
          />
          <div className="absolute top-0 left-0 flex h-full items-center pl-2 sm:pl-3">
            <HiOutlineHashtag className="h-4 w-4 text-[#92e3a9] sm:h-5 sm:w-5" />
          </div>
        </div>
        <div className="relative">
          <input
            type="text"
            className="w-full rounded border border-gray-700 bg-gray-800 py-2 pr-4 pl-8 text-sm text-white placeholder-gray-400 focus:border-[#92e3a9] focus:outline-none sm:pl-10 sm:text-base"
            placeholder="Search by title"
            value={titleSearch}
            onChange={handleTitleSearchChange}
          />
          <div className="absolute top-0 left-0 flex h-full items-center pl-2 sm:pl-3">
            <HiDocumentText className="h-4 w-4 text-[#92e3a9] sm:h-5 sm:w-5" />
          </div>
        </div>
        <div className="relative">
          <input
            type="text"
            className="w-full rounded border border-gray-700 bg-gray-800 py-2 pr-4 pl-8 text-sm text-white placeholder-gray-400 focus:border-[#92e3a9] focus:outline-none sm:pl-10 sm:text-base"
            placeholder="Search by instructor"
            value={instructorSearch}
            onChange={handleInstructorSearchChange}
          />
          <div className="absolute top-0 left-0 flex h-full items-center pl-2 sm:pl-3">
            <HiUser className="h-4 w-4 text-[#92e3a9] sm:h-5 sm:w-5" />
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
                backgroundColor: "#1f2937",
                borderColor: "#374151",
                color: "white",
                fontSize: "0.875rem",
                minHeight: "40px",
                "&:hover": {
                  borderColor: "#4b5563",
                },
              }),
              menu: (baseStyles) => ({
                ...baseStyles,
                backgroundColor: "#1f2937",
              }),
              option: (baseStyles, { isFocused, isSelected }) => ({
                ...baseStyles,
                backgroundColor: isSelected
                  ? "#92e3a9"
                  : isFocused
                    ? "#374151"
                    : "#1f2937",
                color: isSelected ? "black" : "white",
                cursor: "pointer",
                fontSize: "0.875rem",
                ":active": {
                  backgroundColor: isSelected ? "#92e3a9" : "#374151",
                },
              }),
              singleValue: (baseStyles) => ({
                ...baseStyles,
                color: "white",
                fontSize: "0.875rem",
              }),
              placeholder: (baseStyles) => ({
                ...baseStyles,
                color: "#9ca3af",
                fontSize: "0.875rem",
              }),
              dropdownIndicator: (baseStyles) => ({
                ...baseStyles,
                color: "#9ca3af",
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
                fontSize: "0.875rem",
              }),
            }}
          />
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-700 lg:overflow-hidden">
        <table className="min-w-full divide-y divide-gray-800">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-400 uppercase sm:px-4 sm:py-3 md:px-6">
                <div className="flex items-center gap-1 sm:gap-2">
                  <HiOutlineHashtag className="h-3 w-3 text-[#92e3a9] sm:h-4 sm:w-4" />
                  <span>Code</span>
                </div>
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-400 uppercase sm:px-4 sm:py-3 md:px-6">
                <div className="flex items-center gap-1 sm:gap-2">
                  <HiDocumentText className="h-3 w-3 text-[#92e3a9] sm:h-4 sm:w-4" />
                  <span>Title</span>
                </div>
              </th>
              <th className="xs:table-cell hidden px-2 py-2 text-left text-xs font-medium text-gray-400 uppercase sm:px-4 sm:py-3 md:px-6">
                <div className="flex items-center gap-1 sm:gap-2">
                  <HiCreditCard className="h-3 w-3 text-[#92e3a9] sm:h-4 sm:w-4" />
                  <span>Credit</span>
                </div>
              </th>

              <th className="hidden px-2 py-2 text-left text-xs font-medium text-gray-400 uppercase sm:table-cell sm:px-4 sm:py-3 md:px-6">
                <div className="flex items-center gap-1 sm:gap-2">
                  <HiUser className="h-3 w-3 text-[#92e3a9] sm:h-4 sm:w-4" />
                  <span>Instructor</span>
                </div>
              </th>
              <th className="xs:table-cell hidden px-2 py-2 text-left text-xs font-medium text-gray-400 uppercase sm:px-4 sm:py-3 md:px-6">
                <div className="flex items-center gap-1 sm:gap-2">
                  <HiStatusOnline className="h-3 w-3 text-[#92e3a9] sm:h-4 sm:w-4" />
                  <span>Status</span>
                </div>
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-400 uppercase sm:px-4 sm:py-3 md:px-6">
                <div className="flex items-center gap-1 sm:gap-2">
                  <HiClock className="h-3 w-3 text-[#92e3a9] sm:h-4 sm:w-4" />
                  <span>Action</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 bg-gray-900">
            {filteredCourses.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-2 py-2 text-center text-xs text-gray-400 sm:px-4 sm:py-4 sm:text-sm md:px-6"
                >
                  No courses found.
                </td>
              </tr>
            )}
            {filteredCourses.map((course) => (
              <tr key={course.ID} className="hover:bg-gray-800">
                <td className="px-2 py-2 text-xs whitespace-nowrap text-white sm:px-4 sm:py-4 sm:text-sm md:px-6">
                  {course.CODE}
                </td>
                <td className="px-2 py-2 text-xs whitespace-nowrap text-white sm:px-4 sm:py-4 sm:text-sm md:px-6">
                  <div className="max-w-[120px] truncate sm:max-w-[200px]">
                    {course.TITLE}
                  </div>
                </td>
                <td className="xs:table-cell hidden px-2 py-2 text-xs whitespace-nowrap text-white sm:px-4 sm:py-4 sm:text-sm md:px-6">
                  {course.CREDIT}
                </td>

                <td className="hidden px-2 py-2 text-xs whitespace-nowrap text-white sm:table-cell sm:px-4 sm:py-4 sm:text-sm md:px-6">
                  <div className="max-w-[150px] truncate lg:max-w-full">
                    {course.INSTRUCTOR_NAME}
                  </div>
                </td>
                <td className="xs:table-cell hidden px-2 py-2 text-xs whitespace-nowrap text-white sm:px-4 sm:py-4 sm:text-sm md:px-6">
                  {course.STATUS === 1 ? (
                    <HiStatusOnline className="mr-1 inline text-green-500 sm:mr-2" />
                  ) : (
                    <HiStatusOffline className="mr-1 inline text-red-500 sm:mr-2" />
                  )}
                  {course.STATUS === 1 ? "Active" : "Inactive"}
                </td>
                {/* {" "} */}
                <td className="px-2 py-2 whitespace-nowrap sm:px-4 sm:py-4 md:px-6">
                  {course.STATUS === 0 ? (
                    <Button
                      size="xs"
                      style={{ backgroundColor: "#22c55e", color: "#fff" }}
                      onClick={() => openModal(course, "active")}
                      className="flex items-center gap-1 px-2 py-0.5 text-xs transition-transform hover:scale-105 sm:px-3 sm:py-1"
                    >
                      <HiCheck className="h-3 w-3 text-white sm:h-4 sm:w-4" />
                      <span className="xs:inline hidden">Activate</span>
                      <span className="xs:hidden">Act</span>
                    </Button>
                  ) : (
                    <Button
                      size="xs"
                      style={{ backgroundColor: "#ef4444", color: "#fff" }}
                      onClick={() => openModal(course, "inactive")}
                      className="flex items-center gap-1 px-2 py-0.5 text-xs transition-transform hover:scale-105 sm:px-3 sm:py-1"
                    >
                      <HiX className="h-3 w-3 text-white sm:h-4 sm:w-4" />
                      <span className="xs:inline hidden">Deactivate</span>
                      <span className="xs:hidden">Deact</span>
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal show={showAddModal} onClose={() => setShowAddModal(false)}>
        <div className="relative rounded-lg bg-gray-800 p-3 sm:p-4 md:p-6">
          <div className="mb-3 text-lg font-semibold text-white sm:mb-4 sm:text-xl">
            Add New Course
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddCourse();
            }}
            className="space-y-3 sm:space-y-4"
          >
            <div>
              <Label
                htmlFor="code"
                className="text-sm text-gray-300 sm:text-base"
              >
                Course Code
              </Label>
              <TextInput
                id="code"
                value={newCourse.code}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, code: e.target.value })
                }
                className="border-gray-700 bg-gray-900 text-sm text-white sm:text-base"
                required
              />
            </div>
            <div>
              <Label
                htmlFor="title"
                className="text-sm text-gray-300 sm:text-base"
              >
                Title
              </Label>
              <TextInput
                id="title"
                value={newCourse.title}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, title: e.target.value })
                }
                className="border-gray-700 bg-gray-900 text-sm text-white sm:text-base"
                required
              />
            </div>
            <div>
              <Label
                htmlFor="credit"
                className="text-sm text-gray-300 sm:text-base"
              >
                Credit
              </Label>
              <TextInput
                id="credit"
                type="number"
                value={newCourse.credit}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, credit: e.target.value })
                }
                className="border-gray-700 bg-gray-900 text-sm text-white sm:text-base"
                required
                min={1}
                max={6}
              />
            </div>

            <div>
              <Label
                htmlFor="instructor"
                className="text-sm text-gray-300 sm:text-base"
              >
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
                className="border-gray-700 bg-gray-900 text-sm text-white sm:text-base"
                required
              />
            </div>

            <div>
              <Label
                htmlFor="prerequisites"
                className="mb-1 flex items-center gap-1 text-sm text-gray-300 sm:mb-2 sm:gap-2 sm:text-base"
              >
                <HiLink className="text-[#92e3a9]" />
                Prerequisites
              </Label>
              <Select
                isMulti
                options={prerequisiteCourses.map((course) => ({
                  value: course.ID,
                  label: `${course.CODE}: ${course.TITLE}`,
                }))}
                onChange={handlePrerequisiteChange}
                placeholder="Select prerequisite courses (optional)"
                className="react-select-container"
                classNamePrefix="react-select"
                styles={{
                  control: (baseStyles) => ({
                    ...baseStyles,
                    backgroundColor: "#1f2937",
                    borderColor: "#374151",
                    color: "white",
                    fontSize: "0.875rem",
                    minHeight: "38px",
                    "&:hover": {
                      borderColor: "#4b5563",
                    },
                  }),
                  menu: (baseStyles) => ({
                    ...baseStyles,
                    backgroundColor: "#1f2937",
                  }),
                  option: (baseStyles, { isFocused, isSelected }) => ({
                    ...baseStyles,
                    backgroundColor: isSelected
                      ? "#92e3a9"
                      : isFocused
                        ? "#374151"
                        : "#1f2937",
                    color: isSelected ? "black" : "white",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                    ":active": {
                      backgroundColor: isSelected ? "#92e3a9" : "#374151",
                    },
                  }),
                  multiValue: (baseStyles) => ({
                    ...baseStyles,
                    backgroundColor: "#374151",
                  }),
                  multiValueLabel: (baseStyles) => ({
                    ...baseStyles,
                    color: "white",
                    fontSize: "0.875rem",
                  }),
                  multiValueRemove: (baseStyles) => ({
                    ...baseStyles,
                    color: "#9ca3af",
                    ":hover": {
                      backgroundColor: "#ef4444",
                      color: "white",
                    },
                  }),
                  placeholder: (baseStyles) => ({
                    ...baseStyles,
                    color: "#9ca3af",
                    fontSize: "0.875rem",
                  }),
                  input: (baseStyles) => ({
                    ...baseStyles,
                    color: "white",
                    fontSize: "0.875rem",
                  }),
                }}
              />
            </div>

            <div className="mt-4 flex justify-end gap-2 sm:mt-6">
              <Button
                color="gray"
                onClick={() => setShowAddModal(false)}
                type="button"
                className="text-xs sm:text-sm"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                style={{ backgroundColor: "#92e3a9", color: "#000" }}
                className="text-xs sm:text-sm"
              >
                Add Course
              </Button>
            </div>
          </form>
        </div>
      </Modal>
      {/* Confirmation Modal */}{" "}
      <Modal show={showModal} size="md" onClose={() => setShowModal(false)}>
        <div className="p-4 text-center sm:p-6">
          {status === "active" ? (
            <HiStatusOnline className="mx-auto mb-3 h-10 w-10 text-green-500 sm:mb-4 sm:h-14 sm:w-14" />
          ) : (
            <HiX className="mx-auto mb-3 h-10 w-10 text-red-500 sm:mb-4 sm:h-14 sm:w-14" />
          )}
          <h3 className="mb-4 text-sm font-normal text-gray-300 sm:mb-5 sm:text-base md:text-lg">
            Are you sure you want to{" "}
            <span className="font-semibold text-white">{status}</span> the
            account of{" "}
            <span className="font-semibold text-white">
              {selectedCourse?.TITLE}
            </span>
            ?
          </h3>
          <div className="flex justify-center gap-3 sm:gap-4">
            <Button
              color={status === "active" ? "success" : "failure"}
              onClick={confirmAction}
              className="flex items-center gap-1 text-xs sm:gap-2 sm:text-sm"
            >
              {status === "active" ? (
                <HiCheck className="h-3 w-3 text-white sm:h-4 sm:w-4" />
              ) : (
                <HiX className="h-3 w-3 text-white sm:h-4 sm:w-4" />
              )}
              Yes, {status}
            </Button>
            <Button
              color="gray"
              onClick={() => setShowModal(false)}
              className="text-xs sm:text-sm"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

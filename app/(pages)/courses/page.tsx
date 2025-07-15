"use client";

import { useState, useEffect } from "react";
import { Select } from "flowbite-react";
import {
  HiBookOpen,
  HiUser,
  HiOfficeBuilding,
  HiSearch,
  HiShoppingCart,
  HiExclamation,
  HiCheck,
} from "react-icons/hi";
import ReactSelect from "react-select";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useActiveRegistration from "@/app/hooks/useActiveRegistration";
import { useDepartmentDeadlines } from "@/app/hooks/useDepartmentDeadlines";

interface Course {
  id: number;
  name: string;
  code: string;
  credit: number;
  instructor: string;
  department_id: number;
  department_name: string;
  prerequisites: string[];
}

export default function CourseCatalogTable() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [searchCode, setSearchCode] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  const [searchInstructor, setSearchInstructor] = useState("");
  const [selectedCredit, setSelectedCredit] = useState("all");
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [addingCourse, setAddingCourse] = useState<number | null>(null);
  const [passedCourses, setPassedCourses] = useState<number[]>([]);
  const [failedCourses, setFailedCourses] = useState<Record<number, boolean>>(
    {},
  );
  //eslint-disable-next-line
  const [loadingCourseHistory, setLoadingCourseHistory] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Check if user has an active registration
  const { hasActiveRegistration } = useActiveRegistration();

  // Get department deadlines
  const { deadlines, loading: loadingDeadlines } = useDepartmentDeadlines();
  const [isDeadlineValid, setIsDeadlineValid] = useState(false);
  const [deadlineMessage, setDeadlineMessage] = useState<string | null>(null);

  // Check if registration is allowed based on deadlines
  useEffect(() => {
    if (loadingDeadlines || !deadlines) {
      setIsDeadlineValid(false);
      setDeadlineMessage(
        "Course Registration for this semester hasn`t been started yet.",
      );
      return;
    }

    const currentDate = new Date();
    // Parse the date string from the format YYYY-MM-DD
    const withFineDeadline = deadlines.course_registration_with_fine
      ? new Date(deadlines.course_registration_with_fine)
      : null;

    if (!withFineDeadline) {
      setIsDeadlineValid(false);
      setDeadlineMessage(
        "Course Registration for this semester hasn`t been started yet. Please contact your department office.",
      );
      return;
    }

    // Set time to end of day to include the deadline day fully
    withFineDeadline.setHours(23, 59, 59, 999);

    if (currentDate > withFineDeadline) {
      setIsDeadlineValid(false);
      setDeadlineMessage(
        `Course registration deadline has passed (${deadlines.course_registration_with_fine}). Registration is closed.`,
      );
    } else {
      setIsDeadlineValid(true);
      setDeadlineMessage(null);
    }
  }, [deadlines, loadingDeadlines]);

  // Fetch courses on component mount and filter by user's department
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        // Get all courses
        const response = await fetch(`/api/courses/get-catalog`);

        if (!response.ok) {
          throw new Error("Failed to fetch course catalog");
        }

        const data = await response.json();

        // If user is authenticated and has a department, filter courses by their department
        if (isAuthenticated && user?.departmentId) {
          const userDepartmentId = user.departmentId.toString();
          const filteredCourses = data.courses.filter(
            (course: Course) =>
              course.department_id.toString() === userDepartmentId,
          );
          setCourses(filteredCourses);
        } else {
          // If not authenticated or no department, show all courses
          setCourses(data.courses);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [isAuthenticated, user?.departmentId]);

  // Fetch cart items and update selectedCourses
  useEffect(() => {
    const fetchCartItems = async () => {
      if (!isAuthenticated || !user?.id) return;

      try {
        const response = await fetch(
          `/api/course-selection/get-cart?userId=${user.id}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch cart items");
        }

        const data = await response.json();
        if (data.success && data.cartItems) {
          /* eslint-disable-next-line */
          const courseIds = data.cartItems.map((item: any) => item.COURSE_ID);
          setSelectedCourses(courseIds);
          setCartCount(courseIds.length);
        }
      } catch (err) {
        console.error("Error fetching cart items:", err);
      }
    };

    fetchCartItems();
  }, [isAuthenticated, user?.id]);

  // Fetch course history for the logged in student
  useEffect(() => {
    const fetchCourseHistory = async () => {
      if (!isAuthenticated || !user?.registration_number) {
        return;
      }

      setLoadingCourseHistory(true);
      try {
        const response = await fetch(
          `/api/results/available-courses?studentId=${user.registration_number}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch course results");
        }

        const data = await response.json();

        if (data.success) {
          // Create a set of passed course IDs
          const passedIds = new Set<number>();
          const failedCoursesMap: Record<number, boolean> = {};

          // Process failed courses (retake courses)
          if (data.retakeCourses && Array.isArray(data.retakeCourses)) {
            //eslint-disable-next-line
            data.retakeCourses.forEach((course: any) => {
              failedCoursesMap[course.COURSE_ID] = true;
            });
          }

          // Find passed courses (courses not in available courses)
          const availableIds = new Set(
            //eslint-disable-next-line
            data.availableCourses.map((c: any) => c.ID),
          );

          // All courses that are not in available courses and not failed are passed
          courses.forEach((course) => {
            if (!availableIds.has(course.id) && !failedCoursesMap[course.id]) {
              passedIds.add(course.id);
            }
          });

          setPassedCourses(Array.from(passedIds));
          setFailedCourses(failedCoursesMap);
        }
      } catch (error) {
        console.error("Error fetching course history:", error);
      } finally {
        setLoadingCourseHistory(false);
      }
    };

    if (courses.length > 0) {
      fetchCourseHistory();
    }
  }, [isAuthenticated, user?.registration_number, courses]);

  // Handle course selection
  const handleSelectCourse = async (courseId: number) => {
    if (!isAuthenticated) {
      alert("Please sign in to select courses");
      router.push("/signin");
      return;
    }

    if (!user?.id) {
      setError("User information not available. Please sign in again.");
      return;
    }

    if (hasActiveRegistration) {
      setError(
        "You have an active registration in progress. You cannot select courses until it's completed.",
      );
      return;
    }

    if (!isDeadlineValid) {
      setError(
        deadlineMessage ||
          "Course registration is currently not available. Please check with your department for registration deadlines.",
      );
      return;
    }

    setAddingCourse(courseId);

    try {
      const response = await fetch("/api/course-selection/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          courseId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Get detailed error message from the server response if available
        throw new Error(data.error || "Failed to add course to cart");
      }

      if (data.success || data.exists) {
        // Check if the course is already selected
        const isAlreadySelected = selectedCourses.includes(courseId);
        
        // Only add to selected courses if not already there
        setSelectedCourses((prev) => 
          prev.includes(courseId) ? prev : [...prev, courseId]
        );
        
        // Only increment count if it's a new addition, not if it was already in cart
        if (!isAlreadySelected) {
          setCartCount((prev) => prev + 1);
        }
        
        // Show success message
        setError(null);
        setSuccessMessage(data.message || "Course added to cart successfully");
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error adding course to cart:", err);
    } finally {
      setAddingCourse(null);
    }
  };

  // Filter courses based on search criteria and hide passed courses
  const filtered = courses.filter((course) => {
    // Don't show passed courses
    if (passedCourses.includes(course.id)) {
      return false;
    }

    const matchesCode = !searchCode || course.code === searchCode;
    const matchesTitle = !searchTitle || course.name === searchTitle;
    const matchesInstructor =
      !searchInstructor || course.instructor === searchInstructor;
    const matchesCredit =
      selectedCredit === "all" || course.credit.toString() === selectedCredit;
    return matchesCode && matchesTitle && matchesInstructor && matchesCredit;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentCourses = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Generate select options
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
    <div className="mx-auto max-w-7xl space-y-4 px-3 py-5 sm:space-y-8 sm:px-4 sm:py-8">
      <div
        className="relative mb-6 text-center sm:mb-8"
        data-aos="fade-down"
        data-aos-duration="1000"
      >
        {isAuthenticated && (
          <div className="absolute top-0 right-0">
            <Link
              href="/course-selection"
              className="flex items-center gap-1 rounded-lg bg-gray-800 px-2 py-1.5 transition-colors hover:bg-gray-700 sm:gap-2 sm:px-4 sm:py-2"
            >
              <HiShoppingCart className="text-lg text-[#92e3a9] sm:text-xl" />
              <span className="text-sm text-white sm:text-base">
                {cartCount} {cartCount === 1 ? "Course" : "Courses"}
              </span>
            </Link>
          </div>
        )}
        <h1 className="mb-1 text-2xl font-bold tracking-tight text-gray-200 sm:mb-2 sm:text-3xl md:text-4xl lg:text-5xl">
          Course Catalog
        </h1>
        <p className="mt-2 text-sm text-gray-400 sm:mt-4 sm:text-base md:text-lg">
          Browse and select courses for your upcoming semester
        </p>
      </div>
      {hasActiveRegistration && isAuthenticated && (
        <div className="mb-4 rounded-md border border-yellow-500 bg-yellow-900/20 p-3 sm:mb-6 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-start">
            <div className="mb-2 flex-shrink-0 sm:mb-0">
              <HiExclamation className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="sm:ml-3">
              <h3 className="text-sm font-medium text-yellow-400">
                Active Registration In Progress
              </h3>
              <div className="mt-1.5 text-xs text-yellow-300 sm:mt-2 sm:text-sm">
                <p>
                  You have an ongoing course registration that requires
                  approval. While this registration is in progress, you cannot
                  select additional courses or start a new registration.
                </p>
                <div className="mt-3 sm:mt-4">
                  <Link href="/registration-status">
                    <button className="rounded bg-yellow-600 px-2 py-1 text-xs font-medium text-white hover:bg-yellow-700 sm:px-3 sm:py-1.5 sm:text-sm">
                      View Registration Status
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {!hasActiveRegistration &&
        isAuthenticated &&
        !isDeadlineValid &&
        deadlineMessage && (
          <div className="mb-4 rounded-md border border-red-500 bg-red-900/20 p-3 sm:mb-6 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-start">
              <div className="mb-2 flex-shrink-0 sm:mb-0">
                <HiExclamation className="h-5 w-5 text-red-400" />
              </div>
              <div className="sm:ml-3">
                <h3 className="text-sm font-medium text-red-400">
                  Course Selection Not Available
                </h3>
                <div className="mt-1.5 text-xs text-red-300 sm:mt-2 sm:text-sm">
                  <p>{deadlineMessage}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      <div
        className="rounded-lg border border-gray-800 bg-gray-900 p-4 shadow-xl sm:p-6"
        data-aos="fade-up"
        data-aos-duration="800"
      >
        <h2 className="mb-3 text-lg font-semibold text-white sm:mb-4 sm:text-xl">
          Search & Filter
        </h2>
        <div
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4"
          style={{ position: "relative", zIndex: 100 }}
        >
          <div className="relative">
            <Select
              value={selectedCredit}
              onChange={(e) => setSelectedCredit(e.target.value)}
              className="w-full text-sm sm:text-base"
            >
              <option value="all">All Credits</option>
              <option value="1">1 Credit</option>
              <option value="1.5">1.5 Credits</option>
              <option value="2">2 Credits</option>
              <option value="3">3 Credits</option>
              <option value="4">4 Credits</option>
            </Select>
          </div>

          <div className="relative z-50">
            <HiSearch className="absolute top-3.5 left-3 text-gray-500" />
            <ReactSelect
              options={courseCodeOptions}
              placeholder="Search by code"
              isClearable
              instanceId="course-code-select"
              onChange={(option) => setSearchCode(option?.value || "")}
              className="pl-8"
              menuPortalTarget={
                typeof document !== "undefined" ? document.body : null
              }
              menuPosition="fixed"
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
                  zIndex: 9999, // Add high z-index to ensure dropdown appears above other elements
                  position: "absolute",
                }),
                menuPortal: (base) => ({
                  ...base,
                  zIndex: 9999,
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

          <div className="relative z-50">
            <HiSearch className="absolute top-3.5 left-3 text-gray-500" />

            <ReactSelect
              options={courseTitleOptions}
              placeholder="Search by title"
              isClearable
              instanceId="course-title-select"
              onChange={(option) => setSearchTitle(option?.value || "")}
              className="pl-8"
              menuPortalTarget={
                typeof document !== "undefined" ? document.body : null
              }
              menuPosition="fixed"
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
                  zIndex: 9999, // Add high z-index to ensure dropdown appears above other elements
                  position: "absolute",
                }),
                menuPortal: (base) => ({
                  ...base,
                  zIndex: 9999,
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

          <div className="relative z-50">
            <HiSearch className="absolute top-3.5 left-3 text-gray-500" />
            <ReactSelect
              options={instructorOptions}
              placeholder="Search by Instructor"
              isClearable
              instanceId="instructor-select"
              onChange={(option) => setSearchInstructor(option?.value || "")}
              className="pl-8"
              menuPortalTarget={
                typeof document !== "undefined" ? document.body : null
              }
              menuPosition="fixed"
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
                  zIndex: 9999, // Add high z-index to ensure dropdown appears above other elements
                  position: "absolute",
                }),
                menuPortal: (base) => ({
                  ...base,
                  zIndex: 9999,
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
      </div>{" "}
      <div
        className="rounded-lg border border-gray-800 bg-gray-900 p-4 shadow-xl sm:p-6"
        data-aos="fade-up"
        data-aos-delay="200"
        style={{ maxWidth: "100%", position: "relative", zIndex: 10 }}
      >
        <h2 className="mb-4 text-lg font-semibold text-white sm:text-xl">
          Available Courses
        </h2>

        {loading && (
          <div className="flex items-center justify-center py-10 sm:py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-t-2 border-b-2 border-[#92e3a9] sm:h-12 sm:w-12"></div>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 rounded-md border border-green-500 bg-green-900/20 p-4 text-green-300">
            <div className="flex items-center">
              <HiCheck className="mr-2 h-5 w-5 text-green-400" />
              <p>{successMessage}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-md border border-red-500 bg-red-900/20 p-4 text-red-300">
            <p>{error}</p>
            <button
              onClick={() => {
                setError(null);
                window.location.reload();
              }}
              className="mt-2 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="max-w-full overflow-x-auto">
            <div className="w-full">
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                {/* Desktop view - Table */}
                <table className="hidden w-full table-auto text-left text-sm md:table">
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
                            {course.department_name || "Unknown"}
                            {isAuthenticated &&
                              user?.departmentId &&
                              course.department_id.toString() ===
                                user.departmentId.toString() && (
                                <span className="ml-2 rounded-full bg-[#92e3a9]/20 px-2 py-0.5 text-xs text-[#92e3a9]">
                                  My Department
                                </span>
                              )}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {course.prerequisites &&
                          course.prerequisites.length > 0 ? (
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
                              <Link
                                href="/course-selection"
                                className="inline-block min-w-[100px] rounded-md border border-[#92e3a9] bg-[#92e3a9]/10 px-3 py-2 text-center text-[#92e3a9] transition-colors hover:bg-[#92e3a9]/20"
                              >
                                View in Cart
                              </Link>
                            ) : (
                              <button
                                className={`inline-flex w-full min-w-[100px] justify-center rounded-md px-3 py-2 text-sm font-medium transition-all hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:hover:scale-100 ${
                                  failedCourses[course.id]
                                    ? "bg-amber-500 text-white hover:bg-amber-600"
                                    : "bg-[#92e3a9] text-black hover:bg-[#7acc91]"
                                }`}
                                onClick={() => handleSelectCourse(course.id)}
                                disabled={
                                  addingCourse === course.id ||
                                  hasActiveRegistration ||
                                  !isDeadlineValid
                                }
                                title={
                                  hasActiveRegistration
                                    ? "You have an active registration in progress"
                                    : !isDeadlineValid
                                      ? deadlineMessage ||
                                        "Course registration is not available"
                                      : ""
                                }
                              >
                                {addingCourse === course.id ? (
                                  <div className="flex items-center">
                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-t-2 border-b-2 border-black"></div>
                                    Adding...
                                  </div>
                                ) : hasActiveRegistration ? (
                                  "Unavailable"
                                ) : !isDeadlineValid ? (
                                  "Closed"
                                ) : failedCourses[course.id] ? (
                                  "Retake"
                                ) : (
                                  "Select Course"
                                )}
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

                {/* Mobile view - Cards */}
                <div className="space-y-4 md:hidden">
                  {currentCourses.map((course) => (
                    <div
                      key={course.id}
                      className="rounded-lg border border-gray-800 bg-gray-900 p-4 transition-colors hover:bg-gray-800"
                    >
                      <div className="mb-3 flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <HiBookOpen className="text-[#92e3a9]" />
                          <span className="font-medium text-white">
                            {course.code}
                          </span>
                        </div>
                        <div className="text-right text-white">
                          {course.credit} credits
                        </div>
                      </div>

                      <h3 className="mb-2 font-medium text-white">
                        {course.name}
                      </h3>

                      <div className="mb-3 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <HiUser className="text-[#92e3a9]" />
                          <span>{course.instructor}</span>
                        </div>

                        <div className="flex items-start gap-2 text-sm text-gray-300">
                          <HiOfficeBuilding className="mt-1 text-[#92e3a9]" />
                          <div>
                            <span>{course.department_name || "Unknown"}</span>
                            {isAuthenticated &&
                              user?.departmentId &&
                              course.department_id.toString() ===
                                user.departmentId.toString() && (
                                <span className="ml-2 inline-block rounded-full bg-[#92e3a9]/20 px-2 py-0.5 text-xs text-[#92e3a9]">
                                  My Department
                                </span>
                              )}
                          </div>
                        </div>

                        <div className="flex items-start gap-2 text-sm text-gray-300">
                          <span className="font-medium text-white">
                            Prerequisites:
                          </span>
                          <div>
                            {course.prerequisites &&
                            course.prerequisites.length > 0 ? (
                              <div className="space-y-1">
                                {course.prerequisites.map((prereq, i) => (
                                  <div
                                    key={i}
                                    className="flex items-center gap-1"
                                  >
                                    <HiBookOpen className="text-xs text-[#92e3a9]" />
                                    <span>{prereq}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-400">None</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        {selectedCourses.includes(course.id) ? (
                          <Link
                            href="/course-selection"
                            className="block w-full rounded-md border border-[#92e3a9] bg-[#92e3a9]/10 px-3 py-2 text-center text-[#92e3a9] transition-colors hover:bg-[#92e3a9]/20"
                          >
                            View in Cart
                          </Link>
                        ) : (
                          <button
                            className={`w-full rounded-md px-3 py-2 text-sm font-medium transition-all hover:shadow-lg disabled:opacity-50 ${
                              failedCourses[course.id]
                                ? "bg-amber-500 text-white hover:bg-amber-600"
                                : "bg-[#92e3a9] text-black hover:bg-[#7acc91]"
                            }`}
                            onClick={() => handleSelectCourse(course.id)}
                            disabled={
                              addingCourse === course.id ||
                              hasActiveRegistration ||
                              !isDeadlineValid
                            }
                          >
                            {addingCourse === course.id ? (
                              <div className="flex items-center justify-center">
                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-t-2 border-b-2 border-black"></div>
                                Adding...
                              </div>
                            ) : hasActiveRegistration ? (
                              "Unavailable"
                            ) : !isDeadlineValid ? (
                              "Registration Closed"
                            ) : failedCourses[course.id] ? (
                              "Retake"
                            ) : (
                              "Select Course"
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {filtered.length === 0 && (
                    <div className="rounded-lg border border-gray-800 bg-gray-900 p-4 text-center text-gray-400">
                      No courses found.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Pagination */}
      {!loading && !error && filtered.length > 0 && (
        <div className="mt-4 flex items-center justify-center gap-2 sm:mt-6 sm:gap-4">
          <button
            className="rounded-md bg-[#92e3a9] px-3 py-1.5 text-sm text-black transition-all hover:bg-[#7acc91] hover:shadow-lg disabled:opacity-50 sm:px-4 sm:py-2 sm:text-base"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </button>
          <span className="flex items-center text-xs text-gray-400 sm:text-sm">
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            className="rounded-md bg-[#92e3a9] px-3 py-1.5 text-sm text-black transition-all hover:bg-[#7acc91] hover:shadow-lg disabled:opacity-50 sm:px-4 sm:py-2 sm:text-base"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

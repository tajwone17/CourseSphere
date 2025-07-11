"use client";

import { useState, useEffect } from "react";
import { Select } from "flowbite-react";
import { HiBookOpen, HiUser, HiOfficeBuilding, HiSearch, HiShoppingCart } from "react-icons/hi";
import ReactSelect from "react-select";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  const [addingCourse, setAddingCourse] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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
        const response = await fetch(`/api/course-selection/get-cart?userId=${user.id}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch cart items");
        }
        
        const data = await response.json();
        if (data.success && data.cartItems) {
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
      
      if (!response.ok) {
        throw new Error("Failed to add course to cart");
      }
      
      const data = await response.json();
      
      if (data.success || data.exists) {
        setSelectedCourses(prev => [...prev, courseId]);
        setCartCount(prev => prev + 1);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error adding course to cart:", err);
    } finally {
      setAddingCourse(null);
    }
  };

  // Filter courses based on search criteria
  const filtered = courses.filter((course) => {
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
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
      <div
        className="mb-8 text-center relative"
        data-aos="fade-down"
        data-aos-duration="1000"
      >
        {isAuthenticated && (
          <div className="absolute right-0 top-0">
            <Link href="/course-selection" className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
              <HiShoppingCart className="text-[#92e3a9] text-xl" />
              <span className="text-white">{cartCount} {cartCount === 1 ? 'Course' : 'Courses'}</span>
            </Link>
          </div>
        )}
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
        {" "}
        <h2 className="mb-4 text-xl font-semibold text-white">
          Search & Filter
        </h2>
        <div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          style={{ position: "relative", zIndex: 100 }}
        >
          <div className="relative">
          
            <Select
              value={selectedCredit}
              onChange={(e) => setSelectedCredit(e.target.value)}
              className="w-full"
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
        className="rounded-lg border border-gray-800 bg-gray-900 p-6 shadow-xl"
        data-aos="fade-up"
        data-aos-delay="200"
        style={{ maxWidth: "100%", position: "relative", zIndex: 10 }}
      >
        <h2 className="mb-4 text-xl font-semibold text-white">
          Available Courses
        </h2>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-[#92e3a9]"></div>
          </div>
        )}

        {error && (
          <div className="rounded-md border border-red-500 bg-red-900/20 p-4 text-red-300">
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
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
                              <Link href="/course-selection" className="inline-block min-w-[100px] rounded-md border border-[#92e3a9] bg-[#92e3a9]/10 px-3 py-2 text-center text-[#92e3a9] hover:bg-[#92e3a9]/20 transition-colors">
                                View in Cart
                              </Link>
                            ) : (
                              <button
                                className="inline-flex w-full min-w-[100px] justify-center rounded-md bg-[#92e3a9] px-3 py-2 text-sm font-medium text-black transition-all hover:scale-105 hover:bg-[#7acc91] hover:shadow-lg disabled:opacity-50 disabled:hover:scale-100"
                                onClick={() => handleSelectCourse(course.id)}
                                disabled={addingCourse === course.id}
                              >
                                {addingCourse === course.id ? (
                                  <div className="flex items-center">
                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-t-2 border-b-2 border-black"></div>
                                    Adding...
                                  </div>
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
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Pagination */}
      {!loading && !error && filtered.length > 0 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            className="rounded-md bg-[#92e3a9] px-4 py-2 text-black transition-all hover:bg-[#7acc91] hover:shadow-lg disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </button>
          <span className="flex items-center text-gray-400">
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            className="rounded-md bg-[#92e3a9] px-4 py-2 text-black transition-all hover:bg-[#7acc91] hover:shadow-lg disabled:opacity-50"
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

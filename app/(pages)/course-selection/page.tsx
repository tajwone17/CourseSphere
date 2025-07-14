"use client";
import React, { useState, useEffect } from "react";
import { Button, Checkbox, Select } from "flowbite-react";
import {
  HiAcademicCap,
  HiCurrencyDollar,
  HiTrash,
  HiArrowLeft,
  HiExclamation,
} from "react-icons/hi";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import useActiveRegistration from "@/app/hooks/useActiveRegistration";
import { useDepartmentDeadlines } from "@/app/hooks/useDepartmentDeadlines";

interface CartItem {
  cartId: number;
  COURSE_ID: number;
  name: string;
  code: string;
  credit: number;
  instructor: string;
  department_id: number;
  department_name: string;
  ADDED_AT: string;
}

interface Advisor {
  ID: number;
  NAME: string;
  EMAIL: string;
  DEPARTMENT_ID: number;
}

export default function CourseSelectionPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [selectedCourses, setSelectedCourses] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingCourse, setRemovingCourse] = useState<number | null>(null);
  const [selectedAdvisor, setSelectedAdvisor] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [advisorOptions, setAdvisorOptions] = useState<Advisor[]>([]);
  const [isDeadlineValid, setIsDeadlineValid] = useState(false);
  const [deadlineMessage, setDeadlineMessage] = useState<string | null>(null);

  // Registration state
  const [submitting, setSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(
    null,
  );

  // Check if user has an active registration process
  //eslint-disable-next-line
  const { hasActiveRegistration, loading: checkingActiveRegistration } =
    useActiveRegistration();

  // Get department deadlines
  const { deadlines, loading: loadingDeadlines } = useDepartmentDeadlines();

  // Check if registration is allowed based on deadlines
  useEffect(() => {
    if (loadingDeadlines || !deadlines) {
      setIsDeadlineValid(false);
      setDeadlineMessage(
        "Registration deadlines have not been set yet. Please contact your department office.",
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
        "Registration deadlines have not been properly set. Please contact your department office.",
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

  // Calculate cost per course
  const getCostPerCredit = (departmentId: number) => {
    // Default cost
    const defaultCost = 1500;

    // Map department IDs to their costs
    const departmentCosts: Record<number, number> = {
      1: 1500, // CSE
      2: 1400, // EEE
      3: 1300, // BBA
      4: 1200, // English
    };

    return departmentCosts[departmentId] || defaultCost;
  };

  // Calculate totals
  const totalCourses = selectedCourses.length;
  const totalCredits = selectedCourses.reduce(
    (sum, course) => sum + Number(course.credit),
    0,
  );

  // Calculate total cost
  const totalCost = selectedCourses.reduce((total, course) => {
    const costPerCredit = getCostPerCredit(course.department_id);
    return total + costPerCredit * Number(course.credit);
  }, 0);

  // Fetch cart items from API
  useEffect(() => {
    const fetchCartItems = async () => {
      if (!isAuthenticated || !user?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `/api/course-selection/get-cart?userId=${user.id}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch cart items");
        }

        const data = await response.json();
        if (data.success && data.cartItems) {
          setSelectedCourses(data.cartItems);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching cart items:", err);
      } finally {
        setLoading(false);
      }
    };

    // Fetch advisor options
    const fetchAdvisors = async () => {
      if (!isAuthenticated || !user?.departmentId) return;

      try {
        const response = await fetch(
          `/api/advisors?departmentId=${user.departmentId}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch advisors");
        }

        const data = await response.json();
        if (data.advisors) {
          setAdvisorOptions(data.advisors);
        }
      } catch (err) {
        console.error("Error fetching advisors:", err);
        // Set some default options if API fails
        setAdvisorOptions([
          {
            ID: 1,
            NAME: "Tajwone Chowdhury",
            EMAIL: "tajwone@example.com",
            DEPARTMENT_ID: 1,
          },
          {
            ID: 2,
            NAME: "Jakaria",
            EMAIL: "jakaria@example.com",
            DEPARTMENT_ID: 1,
          },
          {
            ID: 3,
            NAME: "Oli Ahmed",
            EMAIL: "oli@example.com",
            DEPARTMENT_ID: 1,
          },
          {
            ID: 4,
            NAME: "Masum Pradhania",
            EMAIL: "masum@example.com",
            DEPARTMENT_ID: 1,
          },
        ]);
      }
    };

    fetchCartItems();
    fetchAdvisors();
  }, [isAuthenticated, user?.id, user?.departmentId]);

  // Handle removing a course from cart
  const handleRemoveCourse = async (courseId: number) => {
    if (!isAuthenticated || !user?.id) return;

    setRemovingCourse(courseId);

    try {
      const response = await fetch("/api/course-selection/remove", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          courseId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove course from cart");
      }

      // Update UI after successful removal
      setSelectedCourses((prev) =>
        prev.filter((course) => course.COURSE_ID !== courseId),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error removing course from cart:", err);
    } finally {
      setRemovingCourse(null);
    }
  };

  // Handle registration submission
  const handleSubmitRegistration = async () => {
    if (!isAuthenticated || !user?.id) {
      setRegistrationError("You must be logged in to register for courses");
      return;
    }

    if (hasActiveRegistration) {
      setRegistrationError(
        "You already have an active registration in progress. Please wait for it to complete before submitting a new one.",
      );
      return;
    }

    if (!isDeadlineValid) {
      setRegistrationError(
        deadlineMessage || "Course registration is currently not available",
      );
      return;
    }

    if (!selectedAdvisor) {
      setRegistrationError("Please select an advisor before proceeding");
      return;
    }

    if (selectedCourses.length === 0) {
      setRegistrationError("You need to select at least one course");
      return;
    }

    if (!acceptedTerms) {
      setRegistrationError("You must accept the terms before proceeding");
      return;
    }

    setSubmitting(true);
    setRegistrationError(null);

    try {
      // Find the advisor ID from the selected advisor name
      const advisorObj = advisorOptions.find((a) => a.NAME === selectedAdvisor);

      if (!advisorObj) {
        throw new Error("Selected advisor not found");
      }

      // Determine current semester (you may want to get this from a settings API)
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      let semester = "";

      const month = currentDate.getMonth() + 1; // 0-indexed
      if (month >= 1 && month <= 6) {
        semester = `Spring-${year}`;
      } else if (month >= 7 && month <= 12) {
        semester = `Summer-${year}`;
      }

      const response = await fetch("/api/registration/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          advisorId: advisorObj.ID,
          semester,
          totalAmount: totalCost,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit registration");
      }

      if (data.success) {
        setRegistrationSuccess(true);

        // Clear the cart after successful registration
        try {
          await fetch("/api/course-selection/clear-cart", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: user.id,
            }),
          });

          // Clear the selected courses from state as well
          setSelectedCourses([]);
        } catch (clearError) {
          console.error("Error clearing cart:", clearError);
          // Continue with redirect even if clearing cart fails
        }

        // Redirect to registration status page after a delay
        setTimeout(() => {
          router.push(`/registration-status?bundleId=${data.bundleId}`);
        }, 2000);
      }
    } catch (err) {
      console.error("Error submitting registration:", err);
      setRegistrationError(
        err instanceof Error
          ? err.message
          : "An error occurred during registration",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
      <div
        className="mb-8 text-center"
        data-aos="fade-down"
        data-aos-duration="1000"
      >
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-gray-200 lg:text-5xl">
          Course Selection Review
        </h1>
        <p className="mt-4 text-lg text-gray-400">
          Review your selected courses before proceeding with registration
        </p>
      </div>

      {hasActiveRegistration && (
        <div className="mb-6 rounded-md border border-yellow-500 bg-yellow-900/20 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <HiExclamation className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-400">
                Active Registration In Progress
              </h3>
              <div className="mt-2 text-sm text-yellow-300">
                <p>
                  You already have a course registration in progress that
                  requires approval. You cannot select new courses or submit a
                  new registration until your current registration is completed.
                </p>
                <div className="mt-4">
                  <Link href="/registration-status">
                    <Button className="bg-yellow-600 hover:bg-yellow-700">
                      View Registration Status
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!hasActiveRegistration && !isDeadlineValid && deadlineMessage && (
        <div className="mb-6 rounded-md border border-red-500 bg-red-900/20 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <HiExclamation className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-400">
                Registration Not Available
              </h3>
              <div className="mt-2 text-sm text-red-300">
                <p>{deadlineMessage}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading || loadingDeadlines ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-[#92e3a9]"></div>
        </div>
      ) : error ? (
        <div className="rounded-md border border-red-500 bg-red-900/20 p-4 text-red-300">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      ) : !isDeadlineValid ? (
        <div className="rounded-lg border border-gray-800 bg-gray-900 p-6 shadow-xl">
          <h2 className="mb-4 text-xl font-semibold text-white">
            Course Selection Unavailable
          </h2>
          <p className="text-gray-400">
           Course Registration for this semester has not been started yet.
          </p>
          <p className="mt-2 text-gray-400">
            Please contact your department office for more information.
          </p>
        </div>
      ) : (
        <>
          {/* Advisor selection */}
          <div className="flex items-center justify-center rounded-lg border border-gray-800 bg-gray-900 p-6 shadow-xl">
            <div>
              <h2 className="mb-4 text-center text-xl font-semibold text-white">
                Select Your Advisor
              </h2>
              <Select
                className="w-full sm:w-72"
                value={selectedAdvisor}
                onChange={(e) => setSelectedAdvisor(e.target.value)}
              >
                <option value="">Choose your advisor</option>
                {advisorOptions.map((advisor) => (
                  <option key={advisor.ID} value={advisor.NAME}>
                    {advisor.NAME}
                  </option>
                ))}
              </Select>
              {selectedAdvisor === "" && (
                <p className="mt-2 text-sm text-red-400">
                  You must select an advisor before proceeding.
                </p>
              )}
            </div>
          </div>

          {/* Selected Courses */}
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-6 shadow-xl">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
              <HiAcademicCap className="text-[#92e3a9]" />
              Selected Courses
            </h2>
            {selectedCourses.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                <p>You haven`t selected any courses yet.</p>

                <Link href="/courses">
                  <button className="mt-4 inline-flex items-center gap-2 rounded-md border border-[#92e3a9] bg-transparent px-4 py-2 text-[#92e3a9] hover:bg-[#92e3a9]/10">
                    <HiArrowLeft />
                    Browse Courses
                  </button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-800">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                        Course Code
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
                        Cost
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {selectedCourses.map((course) => {
                      const costPerCredit = getCostPerCredit(
                        course.department_id,
                      );
                      const totalCost = costPerCredit * course.credit;

                      return (
                        <tr key={course.COURSE_ID} className="bg-gray-900">
                          <td className="px-6 py-4 whitespace-nowrap text-white">
                            {course.code}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-white">
                            {course.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-white">
                            {course.credit}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-white">
                            {course.instructor}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-white">
                            ${totalCost}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              className="text-red-500 hover:text-red-400 disabled:opacity-50"
                              onClick={() =>
                                handleRemoveCourse(course.COURSE_ID)
                              }
                              disabled={removingCourse === course.COURSE_ID}
                            >
                              {removingCourse === course.COURSE_ID ? (
                                <div className="h-5 w-5 animate-spin rounded-full border-t-2 border-b-2 border-red-500"></div>
                              ) : (
                                <HiTrash className="h-5 w-5" />
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Registration Summary */}
          {selectedCourses.length > 0 && (
            <div className="rounded-lg border border-gray-800 bg-gray-900 p-6 shadow-xl">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                <HiCurrencyDollar className="text-[#92e3a9]" />
                Registration Summary
              </h2>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-400">Total Courses:</span>
                    <span className="font-medium text-white">
                      {totalCourses}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-400">Course Advisor:</span>
                    <span className="font-medium text-white">
                      {selectedAdvisor || "Not selected"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-400">Total Credits:</span>
                    <span className="font-medium text-white">
                      {totalCredits}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-400">Total Cost:</span>
                    <span className="font-medium text-white">
                      $
                      {selectedCourses.reduce((total, course) => {
                        const costPerCredit = getCostPerCredit(
                          course.department_id,
                        );
                        return total + costPerCredit * course.credit;
                      }, 0)}
                    </span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="mb-2 font-medium text-white">
                      Important Notes:
                    </h3>
                    <ul className="list-inside list-disc space-y-1 text-gray-400">
                      <li>Registration is subject to advisor approval</li>
                      <li>Course schedule conflicts will be verified</li>
                      <li>Prerequisites will be checked</li>
                      <li>Payment is required to complete registration</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="terms"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                      />
                      <label htmlFor="terms" className="text-gray-400">
                        I confirm that I have reviewed the courses and accept
                        the registration terms
                      </label>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <Link href="/courses">
                        <Button
                          size="sm"
                          className="flex items-center gap-2"
                          style={{
                            backgroundColor: "transparent",
                            borderColor: "#92e3a9",
                            color: "#92e3a9",
                          }}
                        >
                          <HiArrowLeft />
                          Select More Courses
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        onClick={handleSubmitRegistration}
                        disabled={
                          !acceptedTerms ||
                          selectedAdvisor === "" ||
                          selectedCourses.length === 0 ||
                          submitting ||
                          hasActiveRegistration ||
                          !isDeadlineValid
                        }
                        className="flex items-center gap-2"
                        style={{
                          backgroundColor:
                            acceptedTerms &&
                            selectedAdvisor &&
                            selectedCourses.length > 0 &&
                            !submitting &&
                            !hasActiveRegistration
                              ? "#92e3a9"
                              : "#4B5563",
                          color:
                            acceptedTerms &&
                            selectedAdvisor &&
                            selectedCourses.length > 0 &&
                            !submitting &&
                            !hasActiveRegistration
                              ? "black"
                              : "white",
                        }}
                      >
                        {submitting
                          ? "Processing..."
                          : "Proceed to Registration"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Registration Success/Error Messages */}
              {registrationSuccess && (
                <div className="mt-4 rounded-md border border-green-500 bg-green-900/20 p-4 text-green-300">
                  <p>
                    Registration submitted successfully! Redirecting to
                    registration status page...
                  </p>
                </div>
              )}
              {registrationError && (
                <div className="mt-4 rounded-md border border-red-500 bg-red-900/20 p-4 text-red-300">
                  <p>{registrationError}</p>
                  <button
                    onClick={() => setRegistrationError(null)}
                    className="mt-2 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

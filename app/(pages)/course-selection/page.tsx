"use client";
import React, { useState, useEffect } from "react";
import { Button, Checkbox, Select } from "flowbite-react";
import {
  HiAcademicCap,
  HiCurrencyDollar,
  HiTrash,
  HiArrowLeft,
} from "react-icons/hi";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";

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

export default function CourseSelectionPage() {
  const { user, isAuthenticated } = useAuth();
  const [selectedCourses, setSelectedCourses] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingCourse, setRemovingCourse] = useState<number | null>(null);
  const [selectedAdvisor, setSelectedAdvisor] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [advisorOptions, setAdvisorOptions] = useState<string[]>([]);

  // Calculate totals
  const totalCourses = selectedCourses.length;
  const totalCredits = selectedCourses.reduce(
    (sum, course) => sum + Number(course.credit),
    0
  );
  
  // Fetch cart items from API
  useEffect(() => {
    const fetchCartItems = async () => {
      if (!isAuthenticated || !user?.id) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const response = await fetch(`/api/course-selection/get-cart?userId=${user.id}`);
        
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
        const response = await fetch(`/api/advisors?departmentId=${user.departmentId}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch advisors");
        }
        
        const data = await response.json();
        if (data.advisors) {
          const options = data.advisors.map((advisor: any) => advisor.NAME);
          setAdvisorOptions(options);
        }
      } catch (err) {
        console.error("Error fetching advisors:", err);
        // Set some default options if API fails
        setAdvisorOptions([
          "Tajwone Chowdhury",
          "Jakaria",
          "Oli Ahmed",
          "Masum Pradhania",
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
      setSelectedCourses(prev => prev.filter(course => course.COURSE_ID !== courseId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error removing course from cart:", err);
    } finally {
      setRemovingCourse(null);
    }
  };

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

      {loading ? (
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
                {advisorOptions.map((advisor, index) => (
                  <option key={index} value={advisor}>
                    {advisor}
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
                <p>You haven't selected any courses yet.</p>
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
                      const costPerCredit = getCostPerCredit(course.department_id);
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
                              onClick={() => handleRemoveCourse(course.COURSE_ID)}
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
                    <span className="font-medium text-white">{totalCourses}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-400">Course Advisor:</span>
                    <span className="font-medium text-white">{selectedAdvisor || "Not selected"}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-400">Total Credits:</span>
                    <span className="font-medium text-white">{totalCredits}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-400">Total Cost:</span>
                    <span className="font-medium text-white">
                      ${selectedCourses.reduce((total, course) => {
                        const costPerCredit = getCostPerCredit(course.department_id);
                        return total + (costPerCredit * course.credit);
                      }, 0)}
                    </span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="mb-2 font-medium text-white">Important Notes:</h3>
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
                        I confirm that I have reviewed the courses and accept the
                        registration terms
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
                      <Link href="/registration-status">
                        <Button
                          size="sm"
                          disabled={!acceptedTerms || selectedAdvisor === "" || selectedCourses.length === 0}
                          className="flex items-center gap-2"
                          style={{
                            backgroundColor:
                              acceptedTerms && selectedAdvisor && selectedCourses.length > 0
                                ? "#92e3a9"
                                : "#4B5563",
                            color:
                              acceptedTerms && selectedAdvisor && selectedCourses.length > 0
                                ? "black"
                                : "white",
                          }}
                        >
                          Proceed to Registration
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

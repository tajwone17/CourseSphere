"use client";
import React, { useState } from "react";
import { Button, Checkbox } from "flowbite-react";
import {
  HiShoppingCart,
  HiAcademicCap,
  HiCurrencyDollar,
  HiTrash,
  HiArrowLeft,
} from "react-icons/hi";
import Link from "next/link";

export default function CartPage() {
  // Sample cart data - in a real app, this would come from a state management solution
  const [selectedCourses] = useState([
    {
      id: 1,
      code: "CS301",
      title: "Data Structures",
      credit: 3,
      instructor: "Dr. Jane Smith",
      cost: 1500,
    },
    {
      id: 2,
      code: "CS315",
      title: "Database Systems",
      credit: 3,
      instructor: "Prof. Robert Johnson",
      cost: 1500,
    },
  ]);

  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Calculate totals
  const totalCourses = selectedCourses.length;
  const totalCredits = selectedCourses.reduce(
    (sum, course) => sum + course.credit,
    0,
  );
  const totalCost = selectedCourses.reduce(
    (sum, course) => sum + course.cost,
    0,
  );
  const waiver = 10; // Sample waiver percentage
  const costAfterWaiver = totalCost * (1 - waiver / 100);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
      {/* Heading */}
      <div className="mb-8 text-center">
        <h1 className="mb-2 flex items-center justify-center gap-2 text-3xl font-bold">
          <HiShoppingCart className="text-[#92e3a9]" />
          Course Cart
        </h1>
        <p className="text-gray-400">
          Review your selected courses before proceeding to checkout.
        </p>
      </div>

      {/* Selected Courses */}
      <div className="rounded-lg border border-gray-800 bg-gray-900 p-6 shadow-xl">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
          <HiAcademicCap className="text-[#92e3a9]" />
          Selected Courses
        </h2>
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
              {selectedCourses.map((course) => (
                <tr key={course.id} className="bg-gray-900">
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
                    ${course.cost}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-red-500 hover:text-red-400">
                      <HiTrash className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Registration Summary */}
      <div className="rounded-lg border border-gray-800 bg-gray-900 p-6 shadow-xl">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
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
              <span className="text-gray-400">Total Credits:</span>
              <span className="font-medium text-white">{totalCredits}</span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
              <span className="text-gray-400">Total Cost:</span>
              <span className="font-medium text-white">${totalCost}</span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
              <span className="text-gray-400">Waiver:</span>
              <span className="font-medium text-[#92e3a9]">{waiver}%</span>
            </div>
            <div className="flex items-center justify-between text-lg font-semibold">
              <span className="text-gray-400">Total After Waiver:</span>
              <span className="text-[#92e3a9]">${costAfterWaiver}</span>
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
                  terms
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
                    Add More Courses
                  </Button>
                </Link>
                <Button
                  size="sm"
                  disabled={!acceptedTerms}
                  className="flex items-center gap-2"
                  style={{
                    backgroundColor: acceptedTerms ? "#92e3a9" : "#4B5563",
                    color: acceptedTerms ? "black" : "white",
                  }}
                >
                  Submit Registration
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

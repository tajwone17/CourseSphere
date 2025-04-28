"use client";
import React, { useState } from "react";
import { Button, Checkbox, Select } from "flowbite-react";
import {
  HiAcademicCap,
  HiCurrencyDollar,
  HiTrash,
  HiArrowLeft,
} from "react-icons/hi";
import Link from "next/link";

export default function CourseSelectionPage() {
  const [selectedCourses] = useState([
    {
      id: 1,
      code: "CSE301",
      title: "Database Management Systems",
      credit: 3,
      instructor: "Tajwone Chowdhury",
      cost: 1500,
    },
    {
      id: 2,
      code: "CSE311",
      title: "Computer Networks",
      credit: 3,
      instructor: "Jakaria",
      cost: 1500,
    },
    {
      id: 3,
      code: "CSE325",
      title: "Operating Systems",
      credit: 3,
      instructor: "Oli Ahmed",
      cost: 1500,
    },
    {
      id: 4,
      code: "CSE405",
      title: "Software Engineering",
      credit: 3,
      instructor: "Masum Pradhania",
      cost: 1500,
    },
  ]);

  const advisorOptions = [
    "Tajwone Chowdhury",
    "Jakaria",
    "Oli Ahmed",
    "Masum Pradhania",
  ];

  const [selectedAdvisor, setSelectedAdvisor] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const totalCourses = selectedCourses.length;
  const totalCredits = selectedCourses.reduce(
    (sum, course) => sum + course.credit,
    0,
  );

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
              <span className="font-medium text-white">{selectedAdvisor}</span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
              <span className="text-gray-400">Total Credits:</span>
              <span className="font-medium text-white">{totalCredits}</span>
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
                    disabled={!acceptedTerms || selectedAdvisor === ""}
                    className="flex items-center gap-2"
                    style={{
                      backgroundColor:
                        acceptedTerms && selectedAdvisor
                          ? "#92e3a9"
                          : "#4B5563",
                      color:
                        acceptedTerms && selectedAdvisor ? "black" : "white",
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
    </div>
  );
}

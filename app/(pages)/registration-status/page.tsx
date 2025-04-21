import React from "react";
import {
  MdCheckCircle,
  MdPayment,
  MdDescription,
  MdPerson,
} from "react-icons/md";
import { HiCheck, HiClock as HiPending } from "react-icons/hi";
import Link from "next/link";

export default function page() {
  const registrationDetails = [
    { label: "Student Name", value: "John Doe" },
    { label: "Student ID", value: "2024001" },
    { label: "Semester", value: "Fall 2024" },
    { label: "Program", value: "Computer Science" },
    { label: "Registration Date", value: "April 21, 2025" },
    { label: "Status", value: "Pending" },
  ];

  const courseApprovalData = [
    {
      courseCode: "CS101",
      courseTitle: "Introduction to Programming",
      credits: 3,
      advisorApproval: "Approved",
      hodApproval: "Pending",
      comments: "Prerequisites met",
    },
    {
      courseCode: "CS102",
      courseTitle: "Data Structures",
      credits: 4,
      advisorApproval: "Pending",
      hodApproval: "Pending",
      comments: "Waiting for advisor review",
    },
  ];

  const steps = [
    { name: "Form Submission", icon: MdDescription, status: "completed" },
    { name: "Advisor Review", icon: MdPerson, status: "current" },
    { name: "HOD Approval", icon: MdCheckCircle, status: "pending" },
    { name: "Payment", icon: MdPayment, status: "pending" },
    { name: "Confirmation", icon: MdCheckCircle, status: "pending" },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
      {/* Heading */}
      <div
        className="mb-8 text-center"
        data-aos="fade-down"
        data-aos-duration="1000"
      >
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-white lg:text-5xl">
          Registration Status
        </h1>
        <p className="mt-4 text-lg text-gray-400">
          Monitor your course registration approval process
        </p>
      </div>

      {/* Registration Progress */}
      <div
        className="rounded-lg border border-gray-800 bg-gray-900 p-6 shadow-xl"
        data-aos="fade-up"
        data-aos-duration="800"
      >
        <h2 className="mb-8 text-center text-xl font-semibold text-white">
          Registration Progress
        </h2>
        <div className="relative mx-auto max-w-4xl px-8">
          {/* Progress Line */}
          <div className="absolute top-6 left-0 h-0.5 w-full bg-gray-800"></div>

          {/* Steps */}
          <div className="relative flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="z-10 flex flex-col items-center"
                  style={{ width: "120px" }}
                >
                  <div
                    className={`mb-3 flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
                      step.status === "completed"
                        ? "bg-[#92e3a9] text-black"
                        : step.status === "current"
                          ? "bg-opacity-50 bg-[#92e3a9] text-black"
                          : "bg-gray-800 text-gray-400"
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-center text-sm text-gray-400">
                    {step.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Registration Details */}
      <div
        className="rounded-lg border border-gray-800 bg-gray-900 p-6 shadow-xl"
        data-aos="fade-up"
        data-aos-delay="400"
      >
        <h2 className="mb-4 text-xl font-semibold text-white">
          Registration Details
        </h2>
        <div
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
          data-aos="fade-up"
          data-aos-delay="600"
        >
          {registrationDetails.map((detail, index) => (
            <div key={index} className="rounded-md bg-gray-800 p-4">
              <p className="text-sm text-gray-400">{detail.label}</p>
              <p className="font-medium text-white">{detail.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Course Approval Status */}
      <div
        className="rounded-lg border border-gray-800 bg-gray-900 p-6 shadow-xl"
        data-aos="fade-up"
        data-aos-delay="800"
      >
        <h2 className="mb-4 text-xl font-semibold text-white">
          Course Approval Status
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Course Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Course Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Credits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Advisor Approval
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  HOD Approval
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Comments
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {courseApprovalData.map((course, index) => (
                <tr key={index} className="bg-gray-900">
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {course.courseCode}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {course.courseTitle}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {course.credits}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`flex w-fit items-center gap-1 rounded-full px-3 py-1 text-xs ${
                        course.advisorApproval === "Approved"
                          ? "bg-opacity-20 bg-[#92e3a9] text-black"
                          : "bg-yellow-900 text-yellow-300"
                      }`}
                    >
                      {course.advisorApproval === "Approved" ? (
                        <HiCheck className="h-4 w-4" />
                      ) : (
                        <HiPending className="h-4 w-4" />
                      )}
                      {course.advisorApproval}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`flex w-fit items-center gap-1 rounded-full px-3 py-1 text-xs ${
                        course.hodApproval === "Approved"
                          ? "bg-opacity-20 bg-[#92e3a9] text-black"
                          : "bg-yellow-900 text-yellow-300"
                      }`}
                    >
                      {course.hodApproval === "Approved" ? (
                        <HiCheck className="h-4 w-4" />
                      ) : (
                        <HiPending className="h-4 w-4" />
                      )}
                      {course.hodApproval}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                    {course.comments}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Information */}
      <div
        className="rounded-lg border border-gray-800 bg-gray-900 p-6 shadow-xl"
        data-aos="fade-up"
        data-aos-delay="1000"
      >
        <h2 className="mb-4 text-xl font-semibold text-white">
          Payment Information
        </h2>
        <div className="space-y-4">
          <div>
            <p className="font-medium text-white">Total Fee: $5,000</p>
            <p className="mt-1 text-gray-400">
              Payment is required to complete the registration process.
            </p>
          </div>

          <div>
            <p className="mb-2 font-medium text-white">Payment Methods:</p>
            <ul className="list-inside list-disc text-gray-400">
              <li>Credit/Debit Card</li>
              <li>Bank Transfer</li>
              <li>Online Banking</li>
            </ul>
          </div>

          <div className="mt-6 flex gap-4">
            <button className="rounded-md border border-gray-700 px-4 py-2 text-white transition-colors hover:bg-gray-800">
              Cancel
            </button>
            <Link href="/payment">
            <button className="hover:bg-opacity-90 rounded-md bg-[#92e3a9] px-4 py-2 text-black transition-colors cursor-pointer">
              Proceed to Payment
            </button>
            </Link>
          </div>
          
         
        </div>
      </div>
    </div>
  );
}

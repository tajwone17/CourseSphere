"use client";

import { Button, Select, Textarea, TextInput } from "flowbite-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaCheckCircle, FaTimesCircle, FaSave } from "react-icons/fa";

interface Course {
  id: string;
  code: string;
  title: string;
  credit: number;
  prerequisite: string;
  status: "pending" | "approved" | "rejected";
  comments: string;
}

const adminRole = typeof window !== "undefined" ? localStorage.getItem("adminRole") : null;

export default function RegistrationApproval() {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: "1",
      code: "CSE301",
      title: "Database Management Systems",
      credit: 3,
      prerequisite: "CSE201",
      status: "pending",
      comments: "",
    },
    {
      id: "2",
      code: "CSE311",
      title: "Computer Networks",
      credit: 3,
      prerequisite: "CSE251",
      status: "pending",
      comments: "",
    },
    {
      id: "3",
      code: "CSE325",
      title: "Operating Systems",
      credit: 3,
      prerequisite: "CSE221",
      status: "pending",
      comments: "",
    },
  ]);

  const [financials, setFinancials] = useState({
    feePerCredit: '',
    waiver: '',
    retakeFee: '',
    semesterFee: '',
    librarySecurityFee: '',
    laboratoryFee: '',
    librarySemesterFee: '',
    lateRegistrationFee: '',
    readmissionFee: '',
    makeupExamFee: '',
  });

  const [tuitionFee, setTuitionFee] = useState(0);
  const [totalPayable, setTotalPayable] = useState(0);

  const handleFinancialChange = (field: string, value: string) => {
    setFinancials(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const totalCredits = courses.reduce((sum, course) => sum + course.credit, 0);
    const grossTuition = totalCredits * (parseFloat(financials.feePerCredit) || 0);
    const discountedTuition = grossTuition * (1 - (parseFloat(financials.waiver) || 0) / 100);
    setTuitionFee(discountedTuition);
  }, [courses, financials.feePerCredit, financials.waiver]);

  useEffect(() => {
    const total =
      (tuitionFee || 0) +
      (parseFloat(financials.retakeFee) || 0) +
      (parseFloat(financials.semesterFee) || 0) +
      (parseFloat(financials.librarySecurityFee) || 0) +
      (parseFloat(financials.laboratoryFee) || 0) +
      (parseFloat(financials.librarySemesterFee) || 0) +
      (parseFloat(financials.lateRegistrationFee) || 0) +
      (parseFloat(financials.readmissionFee) || 0) +
      (parseFloat(financials.makeupExamFee) || 0);
    setTotalPayable(total);
  }, [tuitionFee, financials]);

  const handleStatusChange = (courseId: string, newStatus: "pending" | "approved" | "rejected") => {
    setCourses(courses.map(course => course.id === courseId ? { ...course, status: newStatus } : course));
  };

  const handleApproveAll = () => {
    setCourses(courses.map(course => ({ ...course, status: "approved" })));
  };

  const handleRejectAll = () => {
    setCourses(courses.map(course => ({ ...course, status: "rejected" })));
  };

  const handleSaveChanges = () => {
    console.log("Saving changes:", courses);
    console.log("Financial Info:", {
      tuitionFee,
      ...financials,
      totalPayable,
    });
  };

  return (
    <div className="mx-auto max-w-7xl p-8">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">Registration Review</h1>
        <p className="mt-2 text-lg text-gray-400">
          Review student&apos;s course registration requests
        </p>
      </div>

      {/* Student Details */}
      <div className="mb-8 rounded-lg border border-gray-700 bg-gray-800 p-6">
        <h2 className="mb-6 text-2xl font-semibold text-white">Student Details</h2>
        <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-gray-400">
              <span className="font-medium text-white">Name:</span> Tajwone Chowdhury
            </p>
            <p className="text-gray-400">
              <span className="font-medium text-white">Student ID:</span> 0562310005101031
            </p>
            <p className="text-gray-400">
              <span className="font-medium text-white">Email:</span> tajwone.chowdhury@neub.edu.bd
            </p>
          </div>
          <div>
            <p className="text-gray-400">
              <span className="font-medium text-white">Total Credit:</span> 21
            </p>
            <p className="text-gray-400">
              <span className="font-medium text-white">Semester:</span> Spring 2024
            </p>
            <p className="text-gray-400">
              <span className="font-medium text-white">Submission Date:</span> April 23, 2025
            </p>
          </div>
          <div>
            <p className="text-gray-400">
              <span className="font-medium text-white">Department:</span> CSE
            </p>
            <p className="text-gray-400">
              <span className="font-medium text-white">Advisor:</span> Jakaria
            </p>
            {adminRole === "accounts" && (
              <p className="text-gray-400">
                <span className="font-medium text-white">Amount:</span> {totalPayable.toFixed(2)} BDT
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Course Selection Review */}
      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold text-white">Course Selection Review</h2>
        <div className="overflow-x-auto rounded-lg border border-gray-700">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Course Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Credit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Prerequisite</th>
                {adminRole !== "accounts" && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 bg-gray-900">
              {courses.map(course => (
                <tr key={course.id} className="hover:bg-gray-800">
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-white">{course.code}</td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-white">{course.title}</td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-white">{course.credit}</td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-white">{course.prerequisite}</td>
                  {adminRole !== "accounts" && (
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      <Select
                        value={course.status}
                        onChange={e => handleStatusChange(course.id, e.target.value as "pending" | "approved" | "rejected")}
                        className="border-gray-700 bg-gray-800 text-white"
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </Select>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {adminRole === "accounts" &&(  
<>
       {/* Students Comments */}
       <div className="mb-8">
         <h2 className="mb-4 text-2xl font-semibold text-white">
           Students Comments
         </h2>
         <div className="rounded-lg bg-gray-900 p-10">
           lorerm ipsum dolor sit amet, consectetur adipiscing elit. Integer nec
           odio. Praesent libero. Sed cursus ante dapibus diam.
         </div>
       </div>
            {/* Admin Comments */}
            <div className="mb-8">
         <h2 className="mb-4 text-2xl font-semibold text-white">
           Admin Comments
         </h2>
         <Textarea
           className="p-10"
           placeholder="Enter any comments or feedback for student"
           name="Admin comment"
         />
       </div>
       </>)}
      {/* Accounts Office Financial Form */}
      {adminRole === "accounts" && (
        <div className="mb-10 rounded-lg border border-gray-700 bg-gray-800 p-6">
          <h2 className="mb-6 text-2xl font-semibold text-white">Accounts Section - Financial Calculation</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {Object.keys(financials).map((key) => (
              <TextInput
                key={key}
                type="number"
                value={financials[key as keyof typeof financials]}
                onChange={e => handleFinancialChange(key, e.target.value)}
                placeholder={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                addon={key.replace(/([A-Z])/g, ' $1')}
              />
            ))}
          </div>

          {/* Tuition Fee and Total Payable */}
          <div className="mt-6 text-white">
            <p>Calculated Tuition Fee: {tuitionFee.toFixed(2)} BDT</p>
            <p className="mt-2 font-bold text-xl">Total Payable: {totalPayable.toFixed(2)} BDT</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-8 flex flex-wrap items-center justify-between">
        <Link href="/dashboard/student-management">
          <Button className="flex items-center gap-2 bg-white text-black hover:bg-gray-300 mb-5" style={{backgroundColor:"white"}}>

            <FaArrowLeft />
            Back
          </Button>
        </Link>
        <div className="flex flex-wrap gap-4">
          <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700" onClick={handleApproveAll} style={{ backgroundColor: "green" }}>
            <FaCheckCircle />
            Approve All
          </Button>
          <Button className="flex items-center gap-2 bg-red-600 hover:bg-red-700" style={{ backgroundColor: "#DC3545" }} onClick={handleRejectAll}>
            <FaTimesCircle />
            Reject All
          </Button>
          <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700" onClick={handleSaveChanges}>
            <FaSave />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

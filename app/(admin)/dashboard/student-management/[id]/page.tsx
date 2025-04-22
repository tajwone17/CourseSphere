"use client";

import { Button, Select, Textarea } from "flowbite-react";
import { useState } from "react";

interface Course {
  id: string;
  code: string;
  title: string;
  credit: number;
  prerequisite: string;
  status: "pending" | "approved" | "rejected";
  comments: string;
}

export default function RegistrationApproval() {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: "1",
      code: "CSE4047",
      title: "Web Engineering",
      credit: 3,
      prerequisite: "CSE3015",
      status: "pending",
      comments: "",
    },
    {
      id: "2",
      code: "CSE4048",
      title: "Machine Learning",
      credit: 3,
      prerequisite: "CSE3016",
      status: "pending",
      comments: "",
    },
    // Add more sample courses as needed
  ]);

  const handleStatusChange = (
    courseId: string,
    newStatus: "pending" | "approved" | "rejected",
  ) => {
    setCourses(
      courses.map((course) =>
        course.id === courseId ? { ...course, status: newStatus } : course,
      ),
    );
  };

  const handleApproveAll = () => {
    setCourses(courses.map((course) => ({ ...course, status: "approved" })));
  };

  const handleRejectAll = () => {
    setCourses(courses.map((course) => ({ ...course, status: "rejected" })));
  };

  const handleSaveChanges = () => {
    // TODO: Implement save changes functionality
    console.log("Saving changes:", courses);
  };

  return (
    <div className="mx-auto max-w-7xl p-8">
      {/* Title Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">Registration Review</h1>
        <p className="mt-2 text-lg text-gray-400">
          Review student&apos;s course registration requests
        </p>
      </div>

      {/* Student Details */}
   
<div className="mb-8 rounded-lg border border-gray-700 bg-gray-800 p-6">
  <h2 className="mb-6 text-2xl font-semibold text-white">Student Details</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8">
    <div>
      <p className="text-gray-400">
        <span className="font-medium text-white">Name:</span> John Smith
      </p>
      <p className="text-gray-400">
        <span className="font-medium text-white">Student ID:</span> 2024CSE001
      </p>
      <p className="text-gray-400">
        <span className="font-medium text-white">Email:</span> john.smith@example.com
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
        <span className="font-medium text-white">Submission Date:</span> April 30, 2025
      </p>
    </div>
    <div>
      <p className="text-gray-400">
        <span className="font-medium text-white">Department:</span> CSE
      </p>
      <p className="text-gray-400">
        <span className="font-medium text-white">Advisor:</span> Dr. Allen Parker
      </p>
      <p className="text-gray-400">
        <span className="font-medium text-white">Department:</span> CSE
      </p>
    </div>
  </div>
</div>

      {/* Course Selection Review */}
      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold text-white">
          Course Selection Review
        </h2>
        <div className="overflow-x-auto rounded-lg border border-gray-700">
          <table className="min-w-full divide-y divide-gray-700">
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
                  Prerequisite
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 bg-gray-900">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-800">
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-white">
                    {course.code}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-white">
                    {course.title}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-white">
                    {course.credit}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-white">
                    {course.prerequisite}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap">
                    <Select
                      value={course.status}
                      onChange={(e) =>
                        handleStatusChange(
                          course.id,
                          e.target.value as "pending" | "approved" | "rejected",
                        )
                      }
                      className="border-gray-700 bg-gray-800 text-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Comments Section */}
      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold text-white">
          Students Comments
        </h2>
        <div className="rounded-lg bg-gray-900 p-10">
          lorerm ipsum dolor sit amet, consectetur adipiscing elit. Integer nec
          odio. Praesent libero. Sed cursus ante dapibus diam.
        </div>
      </div>
 {/* Comments Section Admin*/}
 <div className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold text-white">
          Admin Comments
        </h2>
      <Textarea className="p-10" placeholder="Enter any comments or feedback for student" name="Admin comment" id=""></Textarea>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-wrap justify-end gap-4">
        <Button
             style={{
              backgroundColor: "#92e3a9",
              color: "lightwhite",

          
              cursor: "pointer",
            }}
          onClick={handleApproveAll}
          className="bg-green-600 text-white hover:bg-green-700"
        >
          Approve All
        </Button>
        <Button
             style={{
              backgroundColor: "red",
              color: "white",

          
              cursor: "pointer",
            }}
          onClick={handleRejectAll}
          className="bg-red-600 text-white hover:bg-red-700"
        >
          Reject All
        </Button>
        <Button
             style={{
              backgroundColor: "royalblue",
              color: "white",

          
              cursor: "pointer",
            }}
          onClick={handleSaveChanges}
          className="bg-[#92e3a9] text-gray-900 hover:bg-[#7ac892]"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}

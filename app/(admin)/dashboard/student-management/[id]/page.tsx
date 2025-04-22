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

  const handleCommentChange = (courseId: string, comment: string) => {
    setCourses(
      courses.map((course) =>
        course.id === courseId ? { ...course, comments: comment } : course,
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
        <h2 className="mb-4 text-2xl font-semibold text-white">
          Student Details
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-gray-400">
              Name: <span className="text-white">John Smith</span>
            </p>
            <p className="text-gray-400">
              Student ID: <span className="text-white">2024CSE001</span>
            </p>
          </div>
          <div>
            <p className="text-gray-400">
              Email: <span className="text-white">john.smith@example.com</span>
            </p>
            <p className="text-gray-400">
              Semester: <span className="text-white">Spring 2024</span>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Comments
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
                  <td className="px-6 py-4 text-sm">
                    <Textarea
                      value={course.comments}
                      onChange={(e) =>
                        handleCommentChange(course.id, e.target.value)
                      }
                      className="border-gray-700 bg-gray-800 text-white"
                      rows={2}
                      placeholder="Add comments..."
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-end gap-4">
        <Button
          onClick={handleApproveAll}
          className="bg-green-600 text-white hover:bg-green-700"
        >
          Approve All
        </Button>
        <Button
          onClick={handleRejectAll}
          className="bg-red-600 text-white hover:bg-red-700"
        >
          Reject All
        </Button>
        <Button
          onClick={handleSaveChanges}
          className="bg-[#92e3a9] text-gray-900 hover:bg-[#7ac892]"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}

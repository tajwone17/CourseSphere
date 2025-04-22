"use client";

import { useState } from "react";
import { Button } from "flowbite-react";
import Link from "next/link";
import { HiArrowRight, HiCalendar, HiSpeakerphone } from "react-icons/hi";

interface Notice {
  title: string;
  date: string;
  description: string;
  createdBy: string;
  semester: string;
  registrationDeadline: string;
}

const notices: Notice[] = [
  {
    title: "Fall 2024 Course Registration",
    date: "2024-04-23",
    description:
      "Course registration for Fall 2024 semester is now open. Please complete your registration by the deadline.",
    createdBy: "Dr. Tajwone",
    semester: "Fall 2024",
    registrationDeadline: "2024-07-30",
  },
  {
    title: "Spring 2024 Registration Notice",
    date: "2024-04-22",
    description:
      "Registration for Spring 2024 semester courses is now available.",
    createdBy: "Dr. Chowdhury",
    semester: "Spring 2024",
    registrationDeadline: "2024-05-15",
  },
];

export default function NoticePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(notices.length / itemsPerPage);
  const currentNotices = notices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
      {/* Heading */}
      <div
        className="mb-8 text-center"
        data-aos="fade-down"
        data-aos-duration="1000"
      >
        <h1 className="mb-2 flex items-center justify-center gap-2 text-3xl font-bold tracking-tight text-gray-200 lg:text-5xl">
          <HiSpeakerphone className="text-[#92e3a9]" />
          Latest Notices
        </h1>
        <p className="mt-4 text-lg text-gray-400">
          Stay updated with important announcements and information
        </p>
      </div>

      {/* Notices Table */}
      <div
        className="rounded-lg border border-gray-800 bg-gray-900 p-6 shadow-xl"
        data-aos="fade-up"
        data-aos-duration="800"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Semester
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Deadline
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Posted By
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {currentNotices.map((notice, index) => (
                <tr
                  key={index}
                  className="bg-gray-900 transition-colors hover:bg-gray-800"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {notice.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">
                    {notice.semester}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-white">
                      <HiCalendar className="text-[#92e3a9]" />
                      {notice.registrationDeadline}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                    {notice.createdBy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex justify-center">
                      <Link href={`/notice/${index}`}>
                        <Button
                          size="sm"
                          className="flex items-center gap-2 transition-transform hover:scale-105"
                          style={{ backgroundColor: "#92e3a9", color: "black" }}
                        >
                          Read More <HiArrowRight size={16} />
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {currentNotices.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-gray-400"
                  >
                    No notices found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          className={`rounded-md px-4 py-2 font-medium transition-colors ${
            currentPage === 1
              ? "bg-gray-800 text-gray-500"
              : "bg-[#92e3a9] text-black hover:bg-[#7acc91]"
          }`}
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Prev
        </button>
        <span className="text-white">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className={`rounded-md px-4 py-2 font-medium transition-colors ${
            currentPage === totalPages
              ? "bg-gray-800 text-gray-500"
              : "bg-[#92e3a9] text-black hover:bg-[#7acc91]"
          }`}
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

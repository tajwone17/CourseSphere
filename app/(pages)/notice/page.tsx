"use client";

import { useState } from "react";
import { Button } from "flowbite-react";
import Link from "next/link";
import {
  HiArrowRight,
  HiCalendar,
  HiUser,
  HiSpeakerphone,
} from "react-icons/hi";

interface Notice {
  title: string;
  date: string;
  description: string;
  createdBy: string;
}

const notices: Notice[] = [
  {
    title: "Notice 1",
    date: "2023-10-01",
    description: "This is the description for Notice 1",
    createdBy: "Admin",
  },
  {
    title: "Notice 2",
    date: "2023-10-02",
    description: "This is the description for Notice 2",
    createdBy: "Admin",
  },
  {
    title: "Notice 3",
    date: "2023-10-03",
    description: "This is the description for Notice 3",
    createdBy: "Admin",
  },
  {
    title: "Notice 4",
    date: "2023-10-03",
    description: "This is the description for Notice 4",
    createdBy: "Admin",
  },
  {
    title: "Notice 5",
    date: "2023-10-03",
    description: "This is the description for Notice 5",
    createdBy: "Admin",
  },
  {
    title: "Notice 6",
    date: "2023-10-03",
    description: "This is the description for Notice 6",
    createdBy: "Admin",
  },
  {
    title: "Notice 7",
    date: "2023-10-03",
    description: "This is the description for Notice 7",
    createdBy: "Admin",
  },
];

export default function NoticePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h2 className="mb-6 flex items-center justify-center gap-2 text-3xl font-extrabold">
        <HiSpeakerphone className="text-[#92e3a9]" />
        LATEST NOTICES
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full table-auto rounded-md border text-left shadow">
          <thead
            style={{ backgroundColor: "#92e3a9" }}
            className="text-sm font-semibold text-black"
          >
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Date</th>
              <th className="p-3">Created By</th>
              <th className="p-3">Description</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentNotices.map((notice, index) => (
              <tr key={index} className="border-t transition">
                <td className="p-3 font-medium">{notice.title}</td>
                <td className="flex items-center gap-2 p-3">
                  <HiCalendar style={{ color: "#92e3a9" }} />
                  {notice.date}
                </td>

                <td className="items-center gap-2">
                  <div className="flex gap-2 p-3">
                    <HiUser style={{ color: "#92e3a9" }} />
                    {notice.createdBy}
                  </div>
                </td>

                <td className="p-3 text-sm text-white">{notice.description}</td>
                <td className="p-3">
                  <Link href={`/notice/${index}`} passHref>
                    <Button
                      size="sm"
                      className="text-black"
                      style={{ backgroundColor: "#92e3a9" }}
                    >
                      Read More <HiArrowRight className="ml-2" size={16} />
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
            {currentNotices.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No notices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-center gap-2">
        <Button
          size="sm"
          disabled={currentPage === 1}
          style={{ backgroundColor: "#92e3a9", color: "black" }}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </Button>
        <span className="flex items-center">{`Page ${currentPage} of ${totalPages}`}</span>
        <Button
          size="sm"
          disabled={currentPage === totalPages}
          style={{ backgroundColor: "#92e3a9", color: "black" }}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

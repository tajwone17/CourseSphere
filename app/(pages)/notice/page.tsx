"use client";

import { useState, useEffect } from "react";
import { Button } from "flowbite-react";
import Link from "next/link";
import { HiArrowRight, HiSpeakerphone } from "react-icons/hi";
import { useAuth } from "../../context/AuthContext";

interface Notice {
  ID: number;
  TITLE: string;
  DESCRIPTION: string;
  createdBy: string;
  CREATED_AT: string;
}

export default function NoticePage() {
  const { user } = useAuth();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchNotices = async () => {
      if (!user?.departmentId) return;
      setLoading(true);
      try {
        const res = await fetch(
          `/api/notices?departmentId=${user.departmentId}`,
        );
        const data = await res.json();
        console.log(data);
        setNotices(data.notices || []);
      } catch (err) {
        console.error("Error fetching notices:", err);
        setNotices([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, [user?.departmentId]);

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
                  Posted By
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-4 text-center text-gray-400"
                  >
                    Loading...
                  </td>
                </tr>
              ) : currentNotices.length > 0 ? (
                currentNotices.map((notice: Notice) => (
                  <tr
                    key={notice.ID}
                    className="bg-gray-900 transition-colors hover:bg-gray-800"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-white">
                      {notice.TITLE}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                      {notice.createdBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-center">
                        <Link href={`/notice/${notice.ID}`}>
                          <Button
                            size="sm"
                            className="flex items-center gap-2 transition-transform hover:scale-105"
                            style={{
                              backgroundColor: "#92e3a9",
                              color: "black",
                            }}
                          >
                            Read More <HiArrowRight size={16} />
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
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

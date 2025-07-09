"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "flowbite-react";
import { HiCalendar, HiUser, HiArrowLeft } from "react-icons/hi";

interface Notice {
  ID: number;
  TITLE: string;
  DESCRIPTION: string;
  CREATED_AT: string;
  createdBy: string;
}

interface PageProps {
  params: { id: string };
}

export default function NoticeDetailPage({ params }: PageProps) {
  const router = useRouter();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotice = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/notices/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setNotice(data.notice);
        } else {
          setNotice(null);
        }
      } catch {
        setNotice(null);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchNotice();
  }, [params.id]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
        <div className="text-xl text-white">Loading...</div>
      </div>
    );
  }

  if (!notice) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
        <div className="text-xl text-white">Notice not found.</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 px-4 backdrop-blur-sm">
      <div
        className="w-full max-w-2xl rounded-lg border border-gray-800 bg-gray-900 p-8 shadow-xl"
        data-aos="zoom-in"
      >
        <h1 className="mb-4 text-center text-3xl font-bold text-white">
          {notice.TITLE}
        </h1>

        <div className="mb-6 flex items-center justify-center gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <HiCalendar className="text-[#92e3a9]" />
            <span>
              Posted:{" "}
              {new Date(notice.CREATED_AT).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <HiUser className="text-[#92e3a9]" />
            <span>{notice.createdBy}</span>
          </div>
        </div>

        <div className="mb-8 rounded-lg bg-gray-800 p-6">
          <p className="text-lg leading-relaxed text-gray-200">
            {notice.DESCRIPTION}
          </p>
        </div>

        <div className="flex justify-center">
          <Button
            size="sm"
            className="flex items-center gap-2 transition-transform hover:scale-105"
            style={{ backgroundColor: "#92e3a9", color: "black" }}
            onClick={() => router.back()}
          >
            <HiArrowLeft size={16} />
            Back to Notices
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";
import React, { useEffect, useState, use, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "flowbite-react";
import { HiCalendar, HiUser, HiArrowLeft, HiX } from "react-icons/hi";

interface Notice {
  ID: number;
  TITLE: string;
  DESCRIPTION: string;
  CREATED_AT: string;
  createdBy: string;
}

interface PageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default function NoticeDetailPage({ params }: PageProps) {
  const router = useRouter();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  // Unwrap params with React.use() if it's a promise
  const paramsData = params instanceof Promise ? use(params) : params;
  const id = paramsData.id;

  // Handle navigation back in a controlled way
  const handleClose = useCallback(() => {
    setIsClosing(true);
    // Small delay to allow animation to complete before navigating
    setTimeout(() => {
      router.back();
    }, 300); // Increased delay to match transition duration
  }, [router]);

  useEffect(() => {
    const fetchNotice = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/notices/${id}`);
        if (res.ok) {
          const data = await res.json();
          setNotice(data.notice);
        } else {
          setNotice(null);
        }
      } catch (error) {
        console.error("Error fetching notice:", error);
        setNotice(null);
      } finally {
        setLoading(false);
      }
    };

    fetchNotice();
  }, [id]);

  // Handle escape key press to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 px-4 backdrop-blur-sm transition-opacity duration-300">
        <div className="animate-pulse rounded-lg bg-gray-900 p-6 text-xl text-white shadow-xl">
          Loading...
        </div>
      </div>
    );
  }

  if (!notice) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 px-4 backdrop-blur-sm">
        <div className="rounded-lg bg-gray-900 p-6 text-xl text-white shadow-xl">
          <p>Notice not found.</p>
          <div className="mt-4 flex justify-center">
            <Button
              size="sm"
              className="flex items-center gap-2 transition-transform hover:scale-105"
              style={{ backgroundColor: "#92e3a9", color: "black" }}
              onClick={handleClose}
            >
              <HiArrowLeft size={16} />
              Back to Notices
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 px-4 backdrop-blur-sm transition-opacity duration-300 ${isClosing ? "opacity-0" : "opacity-100"}`}
      onClick={handleClose}
    >
      <div
        className={`relative w-full max-w-2xl rounded-lg border border-gray-800 bg-gray-900 p-8 shadow-xl transition-all duration-300 ${isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"}`}
        data-aos="none"
        tabIndex={-1}
        role="dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          aria-label="Close"
        >
          <HiX size={20} />
        </button>

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
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
          >
            <HiArrowLeft size={16} />
            Back to Notices
          </Button>
        </div>
      </div>
    </div>
  );
}

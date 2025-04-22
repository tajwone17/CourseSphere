"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "flowbite-react";
import { HiCalendar, HiUser, HiArrowLeft } from "react-icons/hi";

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

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function NoticeDetailPage(props: PageProps) {
  const router = useRouter();
  const { id } = React.use(props.params);
  const notice = notices[Number(id)];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 px-4 backdrop-blur-sm">
      <div
        className="w-full max-w-2xl rounded-lg border border-gray-800 bg-gray-900 p-8 shadow-xl"
        data-aos="zoom-in"
      >
        <h1 className="mb-4 text-center text-3xl font-bold text-white">
          {notice.title}
        </h1>

        <div className="mb-6 flex items-center justify-center gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <HiCalendar className="text-[#92e3a9]" />
            <span>Posted: {notice.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <HiCalendar className="text-[#92e3a9]" />
            <span>Deadline: {notice.registrationDeadline}</span>
          </div>
          <div className="flex items-center gap-2">
            <HiUser className="text-[#92e3a9]" />
            <span>{notice.createdBy}</span>
          </div>
        </div>

        <div className="mb-4 text-center">
          <span className="rounded-full bg-gray-800 px-4 py-1 text-sm text-[#92e3a9]">
            {notice.semester}
          </span>
        </div>

        <div className="mb-8 rounded-lg bg-gray-800 p-6">
          <p className="text-lg leading-relaxed text-gray-200">
            {notice.description}
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

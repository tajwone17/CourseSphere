"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "flowbite-react";

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

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function NoticeDetailPage(props: PageProps) {
  const router = useRouter();
  const { id } = React.use(props.params);
  const notice = notices[Number(id)];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div
        className="w-full max-w-2xl rounded-xl border border-white bg-black/80 p-8 text-white shadow-2xl"
        data-aos="zoom-in"
      >
        <h1 className="mb-4 text-center text-3xl font-bold">{notice.title}</h1>
        <p className="mb-6 text-center text-sm text-gray-400">
          Posted on {notice.date} by {notice.createdBy}
        </p>
        <p className="mb-8 text-lg leading-relaxed text-gray-200">
          {notice.description}
        </p>
        <div className="flex justify-center">
          <Button
            className="text-black"
            style={{ backgroundColor: "#92e3a9", cursor: "pointer" }}
            onClick={() => router.back()}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

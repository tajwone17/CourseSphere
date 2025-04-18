"use client";
import { Button, Card } from "flowbite-react";
import Link from "next/link";
import {
  HiArrowRight,
  HiCalendar,
  HiUser,
  HiSpeakerphone,
} from "react-icons/hi";

interface notices {
  title: string;
  date: string;
  description: string;
  createdBy: string;
}

const notices: notices[] = [
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

export default function Component() {
  return (
    <div className="px-4 py-8">
      {/* Headline */}
      <h1 className="flex items-center justify-center gap-2 text-center text-3xl font-extrabold">
        Latest Notices
        <HiSpeakerphone className="text-4xl text-[#92e3a9]" />
      </h1>

      {/* Notice Cards */}
      <div className="mt-10 flex flex-wrap justify-center gap-x-4 gap-y-4 overflow-hidden">
        {notices.map((notice: notices, index: number) => (
          <Card
            data-aos="fade-left"
            key={index}
            style={{
              backgroundColor: "#000000",
              color: "#ffffff",
              width: "280px",
            }}
            className="rounded-lg border-2 border-white"
          >
            <h5 className="text-2xl font-bold tracking-tight">
              {notice.title}
            </h5>

            <p className="flex items-center gap-1 text-gray-300">
              <HiCalendar /> {notice.date}
            </p>

            <p className="flex items-center gap-1 text-gray-300">
              <HiUser /> {notice.createdBy}
            </p>

            <Link href={`/notice/${index}`} passHref>
              <Button
                className="mt-2 cursor-pointer"
                style={{
                  backgroundColor: "#92e3a9",
                  color: "#000000",
                }}
              >
                Read more
                <HiArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}

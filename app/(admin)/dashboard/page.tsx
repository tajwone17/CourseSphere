import React from "react";
import {
  HiUsers,
  HiAcademicCap,
  HiClipboardCheck,
  HiCurrencyDollar,
} from "react-icons/hi";

export default function Dashboard() {
  const stats = [
    {
      title: "Total Students",
      value: "1,234",
      icon: HiUsers,
      change: "+12%",
      description: "Active enrollments",
    },
    {
      title: "Total Courses",
      value: "45",
      icon: HiAcademicCap,
      change: "+5%",
      description: "Available courses",
    },
    {
      title: "Course Registrations",
      value: "2,345",
      icon: HiClipboardCheck,
      change: "+18%",
      description: "This semester",
    },
    {
      title: "Revenue",
      value: "$234,567",
      icon: HiCurrencyDollar,
      change: "+25%",
      description: "Current semester",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">Dashboard</h1>
        <p className="mt-4 text-lg text-gray-400">
          Welcome to the admin dashboard! Here you can manage courses and
          students.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="rounded-lg border border-gray-800 bg-gray-900 p-6 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="rounded-lg bg-gray-800 p-3">
                  <Icon className="h-6 w-6 text-[#92e3a9]" />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-white">
                    {stat.value}
                  </span>
                  <span className="text-sm font-medium text-green-400">
                    {stat.change}
                  </span>
                </div>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">
                {stat.title}
              </h3>
              <p className="mt-2 text-sm text-gray-400">{stat.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

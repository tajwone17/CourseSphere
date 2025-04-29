"use client";

import { Button, Navbar } from "flowbite-react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  HiHome,
  HiUserGroup,
  HiUsers,
  HiLogout,
  HiAcademicCap,
  HiSpeakerphone,
} from "react-icons/hi";
import { useEffect, useState } from "react";

export default function AdminNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    const adminRole = localStorage.getItem("adminRole");
    if (!adminRole) {
      router.push("/login");
      return;
    }
    setRole(adminRole);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("adminRole");
    localStorage.removeItem("adminEmail");
    router.push("/login");
  };

  // Define menu items for each role
  const getMenuItems = () => {
    switch (role) {
      case "superadmin":
        return [
          {
            name: "Manage HODs",
            href: "/dashboard/manage-hod",
            icon: HiUserGroup,
          },
        ];
      case "hod":
        return [
          { name: "Dashboard", href: "/dashboard", icon: HiHome },
          {
            name: "Student Management",
            href: "/dashboard/student-management",
            icon: HiUsers,
          },
          {
            name: "Manage Advisors",
            href: "/dashboard/manage-advisors",
            icon: HiUserGroup,
          },
          {
            name: "Manage Notices",
            href: "/dashboard/manage-notices",
            icon: HiSpeakerphone,
          },
          {
            name: "Account Approval",
            href: "/dashboard/account-approval",
            icon: HiUserGroup,
          },
        ];
      case "advisor":
        return [
          { name: "Dashboard", href: "/dashboard", icon: HiHome },
          {
            name: "Student Management",
            href: "/dashboard/student-management",
            icon: HiUsers,
          },
          {
            name: "Manage Notices",
            href: "/dashboard/manage-notices",
            icon: HiSpeakerphone,
          },
        ];
      case "accounts":
        return [
          { name: "Dashboard", href: "/dashboard", icon: HiHome },
          {
            name: "Student Management",
            href: "/dashboard/student-management",
            icon: HiUsers,
          },
        ];
      case "exam-controller":
        return [
          { name: "Dashboard", href: "/dashboard", icon: HiHome },
          {
            name: "Student Management",
            href: "/dashboard/student-management",
            icon: HiUsers,
          },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <Navbar fluid className="border-b border-gray-800 bg-gray-900">
      <div className="flex-1">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-xl font-semibold text-white"
        >
          <HiAcademicCap className="text-[#92e3a9]" />
          {role === "superadmin"
            ? "Super Admin"
            : role === "hod"
              ? "HOD Portal"
              : role === "exam-controller"
                ? "Exam Controller Portal"
                : role === "accounts"
                  ? "Accounts Office Portal"
                  : "Advisor Portal"}
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-gray-800 hover:text-[#92e3a9] ${
              pathname === item.href
                ? "bg-gray-800 text-[#92e3a9]"
                : "text-gray-300"
            }`}
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </Link>
        ))}

        <Button
          style={{
            backgroundColor: "#b23b3b",
            color: "white",

            width: "fit-content",
            cursor: "pointer",
          }}
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-900 transition-all duration-200 hover:bg-[#7ac892]"
        >
          <HiLogout className="h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </Navbar>
  );
}

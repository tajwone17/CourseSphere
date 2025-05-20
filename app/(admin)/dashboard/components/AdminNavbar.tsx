"use client";

import { Avatar, Button, Dropdown, DropdownItem, Navbar } from "flowbite-react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  HiHome,
  HiUserGroup,
  HiUsers,
  HiAcademicCap,
  HiSpeakerphone,
  HiMenu,
  HiCash,
} from "react-icons/hi";
import { useEffect, useState } from "react";

import ProfileModal from "@/app/components/ProfileModal";
import { useAuth } from "@/app/context/AuthContext";

export default function AdminNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [role, setRole] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const adminRole = localStorage.getItem("adminRole");
    const token = localStorage.getItem("adminToken");

    if (!adminRole || !token) {
      router.push("/login");
      return;
    }
    console.log(user);
    setRole(user.role);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRole");
    router.push("/login");
  };

  const getMenuItems = () => {
    console.log(role);
    switch (role) {
      case "admin":
        return [
          {
            name: "Manage HODs",
            href: "/dashboard/manage-hod",
            icon: HiUserGroup,
          },
          {
            name: "Manage Exam Controllers",
            href: "/dashboard/manage-exam-controllers",
            icon: HiAcademicCap,
          },
          {
            name: "Manage Accounts Admins",
            href: "/dashboard/manage-accounts",
            icon: HiCash,
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
            name: "Account Approval",
            href: "/dashboard/account-approval",
            icon: HiUserGroup,
          },
          {
            name: "Manage Advisors",
            href: "/dashboard/manage-advisors",
            icon: HiUserGroup,
          },

          {
            name: "Manage Courses",
            href: "/dashboard/manage-courses",
            icon: HiAcademicCap,
          },
          {
            name: "Manage Notices",
            href: "/dashboard/manage-notices",
            icon: HiSpeakerphone,
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
          // { name: "Dashboard", href: "/dashboard", icon: HiHome },
          {
            name: "Manage Results",
            href: "/dashboard/manage-results",
            icon: HiUsers,
          },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      <Navbar fluid className="border-b border-gray-800 bg-gray-900">
        <div className="min-w-0 flex-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 truncate text-xl font-semibold text-white"
          >
            <HiAcademicCap className="flex-shrink-0 text-[#92e3a9]" />
            <span className="truncate">
              {role === "admin"
                ? "Super Admin"
                : role === "hod"
                  ? "HOD Portal"
                  : role === "exam-controller"
                    ? "Exam Controller Portal"
                    : role === "accounts"
                      ? "Accounts Office Portal"
                      : "Advisor Portal"}
            </span>
          </Link>
        </div>

        {/* Hamburger menu for mobile */}
        <button
          className="ml-2 flex items-center justify-center rounded-md p-2 text-gray-300 hover:bg-gray-800 focus:ring-2 focus:ring-[#92e3a9] focus:outline-none md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Open main menu"
        >
          <HiMenu className="h-6 w-6" />
        </button>

        {/* Desktop menu */}
        <div className="hidden min-w-0 flex-wrap items-center justify-end gap-2 sm:gap-4 md:flex">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-gray-800 hover:text-[#92e3a9] sm:px-3 ${
                pathname === item.href
                  ? "bg-gray-800 text-[#92e3a9]"
                  : "text-gray-300"
              } max-w-full truncate`}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className="hidden truncate md:inline">{item.name}</span>
            </Link>
          ))}

          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="User settings"
                img="https://scontent.fzyl6-1.fna.fbcdn.net/v/t39.30808-6/372624737_3640915932896748_4744980592238643195_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeGUvmZnTEIB81Zzlg7HWNr50lPTtsFdLpzSU9O2wV0unKpLICPXB36mmKbTqmMDKwj2H2Wvy3HoZgbvSztt3mLD&_nc_ohc=je1Q2Zu5XIMQ7kNvwEHpa_b&_nc_oc=Adlx8h4yz_M36L65UGkdvIopzNIyLtRaLb4hSzRNKyO1NHR_jbPw9LHSHzN99WNpHUA&_nc_zt=23&_nc_ht=scontent.fzyl6-1.fna&_nc_gid=2SMSTQw7H8gehkRiZHT0xg&oh=00_AfEdhQHt-MbK7tjuhZLPFzM_wpDl1M9LhaOKfwCYQ5lUDQ&oe=6816E171"
                bordered
                rounded
                className="cursor-pointer"
              />
            }
            className="w-40"
            dismissOnClick={false}
          >
            <DropdownItem
              data-aos="zoom-in"
              data-aos-delay="400"
              style={{ backgroundColor: "gray-100", color: "#92E3A9 " }}
              onClick={() => setOpenModal(!openModal)}
            >
              Profile
            </DropdownItem>
            <DropdownItem
              style={{ backgroundColor: "#DC3545" }}
              onClick={handleLogout}
            >
              Sign out
            </DropdownItem>
          </Dropdown>
        </div>
      </Navbar>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="z-50 border-b border-gray-800 bg-gray-900 px-4 py-2 md:hidden">
          <div className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-gray-800 hover:text-[#92e3a9] ${
                  pathname === item.href
                    ? "bg-gray-800 text-[#92e3a9]"
                    : "text-gray-300"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span>{item.name}</span>
              </Link>
            ))}
            <div className="mt-2 flex items-center gap-2">
              <Avatar
                alt="User settings"
                img="https://scontent.fzyl6-1.fna.fbcdn.net/v/t39.30808-6/372624737_3640915932896748_4744980592238643195_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeGUvmZnTEIB81Zzlg7HWNr50lPTtsFdLpzSU9O2wV0unKpLICPXB36mmKbTqmMDKwj2H2Wvy3HoZgbvSztt3mLD&_nc_ohc=je1Q2Zu5XIMQ7kNvwEHpa_b&_nc_oc=Adlx8h4yz_M36L65UGkdvIopzNIyLtRaLb4hSzRNKyO1NHR_jbPw9LHSHzN99WNpHUA&_nc_zt=23&_nc_ht=scontent.fzyl6-1.fna&_nc_gid=2SMSTQw7H8gehkRiZHT0xg&oh=00_AfEdhQHt-MbK7tjuhZLPFzM_wpDl1M9LhaOKfwCYQ5lUDQ&oe=6816E171"
                bordered
                rounded
                className="h-8 w-8"
              />
              <Button
                color="gray"
                size="xs"
                onClick={() => {
                  setOpenModal(!openModal);
                  setMenuOpen(false);
                }}
              >
                Profile
              </Button>
              <Button
                color="failure"
                size="xs"
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
              >
                Sign out
              </Button>
            </div>
          </div>
        </div>
      )}
      {openModal && <ProfileModal onClose={() => setOpenModal(false)} />}
    </>
  );
}

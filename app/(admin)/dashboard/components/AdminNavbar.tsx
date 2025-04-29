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
} from "react-icons/hi";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { FaRocket } from "react-icons/fa";
import ProfileModal from "@/app/components/ProfileModal";

export default function AdminNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [role, setRole] = useState<string>("");

  const [openModal, setOpenModal] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const adminRole = localStorage.getItem("adminRole");
    if (!adminRole) {
      router.push("/login");
      return;
    }
    setRole(adminRole);
  }, [router]);

  const handleLogout = () => {
    logout();
    router.push("/");
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
          {
            name: "Manage Courses",
            href: "/dashboard/manage-courses",
            icon: HiAcademicCap,
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
    <>
      <Navbar fluid className="border-b border-gray-800 bg-gray-900">
        <div className="flex-1 min-w-0">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-xl font-semibold text-white truncate"
          >
            <HiAcademicCap className="text-[#92e3a9] flex-shrink-0" />
            <span className="truncate">
              {role === "superadmin"
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
          className="ml-2 flex items-center justify-center rounded-md p-2 text-gray-300 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#92e3a9] md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Open main menu"
        >
          <HiMenu className="h-6 w-6" />
        </button>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-2 sm:gap-4 flex-wrap justify-end min-w-0">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-2 rounded-lg px-2 py-2 sm:px-3 transition-colors hover:bg-gray-800 hover:text-[#92e3a9] ${
                pathname === item.href
                  ? "bg-gray-800 text-[#92e3a9]"
                  : "text-gray-300"
              } max-w-full truncate`}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className="hidden md:inline truncate">{item.name}</span>
            </Link>
          ))}

          {isAuthenticated ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar
                  alt="User settings"
                  img="https://scontent.fzyl6-1.fna.fbcdn.net/v/t39.30808-6/372624737_3640915932896748_4744980592238643195_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeGUvmZnTEIB81Zzlg7HWNr50lPTtsFdLpzSU9O2wV0unKpLICPXB36mmKbTqmMDKwj2H2Wvy3HoZgbvSztt3mLD&_nc_ohc=je1Q2Zu5XIMQ7kNvwEHpa_b&_nc_oc=Adlx8h4yz_M36L65UGkdvIopzNIyLtRaLb4hSzRNKyO1NHR_jbPw9LHSHzN99WNpHUA&_nc_zt=23&_nc_ht=scontent.fzyl6-1.fna&_nc_gid=2SMSTQw7H8gehkRiZHT0xg&oh=00_AfEdhQHt-MbK7tjuhZLPFzM_wpDl1M9LhaOKfwCYQ5lUDQ&oe=6816E171"
                  bordered
                  rounded
                  className="w-8 h-8"
                />
              }
              dismissOnClick={false}
            >
              <DropdownItem
                onClick={() => {
                  setOpenModal(!openModal);
                }}
              >
                Profile
              </DropdownItem>
              <DropdownItem
                style={{ color: "#DC3545" }}
                onClick={handleLogout}
              >
                Sign out
              </DropdownItem>
            </Dropdown>
          ) : (
            <Link href="/signin">
              <Button
                style={{
                  backgroundColor: "#000000",
                  color: "#ffffff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
                className="transition-all hover:scale-105 hover:bg-gray-900 px-2 py-1 sm:px-4 sm:py-2 text-sm sm:text-base"
              >
                <span className="hidden sm:inline">Get Started</span> <FaRocket />
              </Button>
            </Link>
          )}
        </div>
      </Navbar>
      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-gray-900 border-b border-gray-800 px-4 py-2 z-50">
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
            {isAuthenticated ? (
              <div className="flex items-center gap-2 mt-2">
                <Avatar
                  alt="User settings"
                  img="https://scontent.fzyl6-1.fna.fbcdn.net/v/t39.30808-6/372624737_3640915932896748_4744980592238643195_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeGUvmZnTEIB81Zzlg7HWNr50lPTtsFdLpzSU9O2wV0unKpLICPXB36mmKbTqmMDKwj2H2Wvy3HoZgbvSztt3mLD&_nc_ohc=je1Q2Zu5XIMQ7kNvwEHpa_b&_nc_oc=Adlx8h4yz_M36L65UGkdvIopzNIyLtRaLb4hSzRNKyO1NHR_jbPw9LHSHzN99WNpHUA&_nc_zt=23&_nc_ht=scontent.fzyl6-1.fna&_nc_gid=2SMSTQw7H8gehkRiZHT0xg&oh=00_AfEdhQHt-MbK7tjuhZLPFzM_wpDl1M9LhaOKfwCYQ5lUDQ&oe=6816E171"
                  bordered
                  rounded
                  className="w-8 h-8"
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
            ) : (
              <Link href="/signin">
                <Button
                  style={{ backgroundColor: "#000000", color: "#ffffff", cursor: "pointer" }}
                  className="w-full mt-2"
                  onClick={() => setMenuOpen(false)}
                >
                  Get Started
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
      {openModal && <ProfileModal onClose={() => setOpenModal(false)} />}
    </>
  );
}

"use client";

import { Dropdown, DropdownItem, Navbar } from "flowbite-react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  HiHome,
  HiUserGroup,
  HiUsers,
  HiAcademicCap,
  HiSpeakerphone,
  HiCash,
  HiUser,
  HiOutlineLogout,
} from "react-icons/hi";
import { useEffect, useState } from "react";

import ProfileModal from "@/app/components/ProfileModal";
// import { useAuth } from "@/app/context/AuthContext";
import { useAuth } from "@/app/context/AuthContext";
export default function AdminNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();
  const { user } = useAuth();
  const [role, setRole] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  useEffect(() => {
    // const adminRole = localStorage.getItem("adminRole");
    // const token = localStorage.getItem("adminToken");

    if (!user) {
      router.push("/login");
      return;
    }
    if (user.role === "student") {
      router.replace("/login");
      return;
    }

    // console.log(user);
    setRole(user.role);
  }, [router, user]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const getMenuItems = () => {
    // console.log(role);
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
        
        ];
      case "accounts_admin":
        return [
          { name: "Dashboard", href: "/dashboard", icon: HiHome },
          {
            name: "Student Management",
            href: "/dashboard/student-management",
            icon: HiUsers,
          },
        ];
      case "exam_controller":
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
        <div className="min-w-0 flex-1 flex items-center gap-2 truncate text-2xl font-semibold text-white">
        
            <HiAcademicCap className="flex-shrink-0 text-[#92e3a9] text-3xl" />
            <span className="truncate">
              {role === "admin"
                ? "Super Admin"
                : role === "hod"
                  ? "HOD Portal"
                  : role === "exam_controller"
                    ? "Exam Controller Portal"
                    : role === "accounts_admin"
                      ? "Accounts Office Portal"
                      : "Advisor Portal"}
            </span>
         
        </div>



        {/* Desktop menu */}
        <div className="min-w-0 flex-wrap items-center justify-end gap-2 sm:gap-4 flex">
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
              <span className="truncate">{item.name}</span>
            </Link>
          ))}

          <Dropdown
            arrowIcon={false}
            inline
            label={
              <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-[#92e3a9]">
                <HiUser className="text-4xl text-[#92e3a9]" />
              </div>
            }
            className="w-30"
            dismissOnClick={false}
          >
            <DropdownItem
              data-aos="zoom-in"
               style={{ backgroundColor: "black", color: "#92E3A9 ",border: "1px solid #92E3A9" }}
              onClick={() => setOpenModal(!openModal)}
            >
              <HiUser className="inline-block mr-2" />
              Profile
            </DropdownItem>
            <DropdownItem
              style={{ backgroundColor: "#DC3545",border: "1px solid #92E3A9" }}
              onClick={handleLogout}
            >
              <HiOutlineLogout className="inline-block mr-2" />
              Sign out
            </DropdownItem>
          </Dropdown>
        </div>
      </Navbar>


      {openModal && <ProfileModal onClose={() => setOpenModal(false)} />}
    </>
  );
}

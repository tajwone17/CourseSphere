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
  HiMenuAlt3,
  HiX,
} from "react-icons/hi";
import { useEffect, useState } from "react";

import ProfileModal from "@/app/components/ProfileModal";
import { useAuth } from "@/app/context/AuthContext";

export default function AdminNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();
  const { user } = useAuth();
  const [role, setRole] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.role === "student") {
      router.replace("/login");
      return;
    }

    setRole(user.role);
  }, [router, user]);

  useEffect(() => {
    // Close mobile menu when navigating to a new page
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const getMenuItems = () => {
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

  // Menu item component for reuse
  const MenuItem = ({
    item,
  }: {
    item: { name: string; href: string; icon: React.ElementType };
  }) => (
    <Link
      href={item.href}
      className={`flex items-center gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-gray-800 hover:text-[#92e3a9] sm:px-3 ${
        pathname === item.href ? "bg-gray-800 text-[#92e3a9]" : "text-gray-300"
      } max-w-full truncate`}
    >
      <item.icon className="h-5 w-5 flex-shrink-0" />
      <span className="truncate">{item.name}</span>
    </Link>
  );

  return (
    <>
      <Navbar fluid className="border-b border-gray-800 bg-gray-900">
        <div className="flex w-full items-center justify-between">
          {/* Logo and title */}
          <div className="flex min-w-0 flex-1 items-center gap-2 truncate text-2xl font-semibold text-white">
            <HiAcademicCap className="flex-shrink-0 text-3xl text-[#92e3a9]" />
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

          {/* Mobile menu toggle button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-lg p-2 text-gray-300 hover:bg-gray-800 hover:text-[#92e3a9]"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <HiX className="h-6 w-6" />
              ) : (
                <HiMenuAlt3 className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden min-w-0 flex-wrap items-center justify-end gap-2 sm:gap-4 md:flex">
            {menuItems.map((item) => (
              <MenuItem key={item.name} item={item} />
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
                style={{
                  backgroundColor: "black",
                  color: "#92E3A9 ",
                  border: "1px solid #92E3A9",
                }}
                onClick={() => setOpenModal(!openModal)}
              >
                <HiUser className="mr-2 inline-block" />
                Profile
              </DropdownItem>
              <DropdownItem
                style={{
                  backgroundColor: "#DC3545",
                  border: "1px solid #92E3A9",
                }}
                onClick={handleLogout}
              >
                <HiOutlineLogout className="mr-2 inline-block" />
                Sign out
              </DropdownItem>
            </Dropdown>
          </div>
        </div>
      </Navbar>

      {/* Mobile menu - slides from top */}
      {isMobileMenuOpen && (
        <div className="animate-slideDown fixed top-[65px] right-0 left-0 z-50 border-b border-gray-800 bg-gray-900 shadow-lg md:hidden">
          <div className="flex flex-col space-y-3 p-4">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 rounded-lg px-4 py-3 transition-colors hover:bg-gray-800 hover:text-[#92e3a9] ${
                  pathname === item.href
                    ? "bg-gray-800 text-[#92e3a9]"
                    : "text-gray-300"
                } w-full`}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span>{item.name}</span>
              </Link>
            ))}

            <div className="border-t border-gray-700 pt-3">
              <button
                onClick={() => setOpenModal(!openModal)}
                className="flex w-full items-center gap-2 rounded-lg px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-[#92e3a9]"
              >
                <HiUser className="h-5 w-5" />
                <span>Profile</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-lg px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-[#92e3a9]"
              >
                <HiOutlineLogout className="h-5 w-5" />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {openModal && <ProfileModal onClose={() => setOpenModal(false)} />}
    </>
  );
}

"use client";

import { FaRocket } from "react-icons/fa";
import {
  HiAcademicCap,
  HiHome,
  HiBookOpen,
  HiClipboardCheck,
  HiSpeakerphone,
  HiInformationCircle,
  HiMail,
} from "react-icons/hi";
import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  DropdownItem,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarToggle,
} from "flowbite-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/public/assets/icon";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import ProfileModal from "./ProfileModal";

interface navlinks {
  name: string;
  href: string;
  icon: React.ElementType;
}

export function MyNavbar() {
  const [openModal, setOpenModal] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();

  const navLinks: navlinks[] = [
    ...(isAuthenticated
      ? [{ name: "Dashboard", href: "/student-dashboard", icon: HiHome }]
      : [{ name: "Home", href: "/", icon: HiHome }]),
    ...(isAuthenticated
      ? [
          { name: "Courses", href: "/courses", icon: HiBookOpen },
          {
            name: "Registration Status",
            href: "/registration-status",
            icon: HiClipboardCheck,
          },
          { name: "Notice", href: "/notice", icon: HiSpeakerphone },
        ]
      : []),
    { name: "About", href: "/about", icon: HiInformationCircle },
    { name: "Contact", href: "/contact", icon: HiMail },
  ];

  const handleSignOut = () => {
    logout();
    router.push("/");
  };

  return (
    <>
      <Navbar fluid style={{ backgroundColor: "#92e3a9" }}>
        <NavbarBrand as={Link} href="/">
          <Logo className="mx-2 h-8 w-8 text-black" />
          <span className="self-center text-xl font-semibold text-black text-shadow-initial">
            CourseSphere
          </span>
        </NavbarBrand>

        <NavbarToggle />
        <NavbarCollapse>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              style={{
                color: pathname === link.href ? "#4B5563" : "#000",
                fontWeight: pathname === link.href ? "bold" : "normal",
              }}
              href={link.href}
              className="flex items-center gap-1 py-2 transition-colors hover:text-gray-700"
            >
              <link.icon className="h-5 w-5" />
              {link.name}
            </Link>
          ))}
        </NavbarCollapse>

        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <Link
              href="/course-selection"
              className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-[#92e3a9] transition-all hover:scale-105 hover:bg-gray-900"
            >
              <HiAcademicCap className="text-2xl" />
              <span className="text-m hidden font-bold sm:inline">
                Course Selection
              </span>
              <Badge
                style={{
                  border: "1px solid #92e3a9",
                  backgroundColor: "black",
                  color: "#92e3a9",
                }}
                className="ms-2 rounded-full px-1.5"
              >
                2
              </Badge>
            </Link>
          )}

          {isAuthenticated ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar
                  alt="User settings"
                  img="https://avatars.githubusercontent.com/u/139250082?v=4"
                  bordered
                  rounded
                  className="cursor-pointer"
                  placeholderInitials="TC"
                />
              }
              className="w-40"
              dismissOnClick={false}
            >
              <DropdownItem
                style={{ backgroundColor: "gray-100", color: "#92E3A9 " }}
                onClick={() => {
                  setOpenModal(!openModal);
                }}
              >
                Profile
              </DropdownItem>
              <DropdownItem
                style={{ backgroundColor: "#DC3545" }}
                onClick={handleSignOut}
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
                className="transition-all hover:scale-105 hover:bg-gray-900"
              >
                Get Started <FaRocket />
              </Button>
            </Link>
          )}
        </div>
      </Navbar>

      {openModal && <ProfileModal onClose={() => setOpenModal(false)} />}
    </>
  );
}

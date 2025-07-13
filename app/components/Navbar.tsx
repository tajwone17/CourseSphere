"use client";

import { FaRocket } from "react-icons/fa";
import {

  HiHome,
  HiBookOpen,
  HiClipboardCheck,
  HiSpeakerphone,
  HiInformationCircle,
  HiMail,
  HiUser,
  HiOutlineLogout,
} from "react-icons/hi";
import {

 
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
import { useState } from "react";
import ProfileModal from "./ProfileModal";
import { useAuth } from "../context/AuthContext";

interface navlinks {
  name: string;
  href: string;
  icon: React.ElementType;
}

export function MyNavbar() {
  const [openModal, setOpenModal] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, logout, user } = useAuth();

  // Check if the user is authenticated and their role is 'student'
  const isStudent = isAuthenticated && user.role === "student";

  const navLinks: navlinks[] = [
    ...(isStudent
      ? [{ name: "Dashboard", href: "/student-dashboard", icon: HiHome }]
      : [{ name: "Home", href: "/", icon: HiHome }]),
    ...(isStudent
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

          {isAuthenticated && user.role === "student" ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                 <div className="flex h-12 w-12 items-center justify-center rounded-full border border-black cursor-pointer">
                            <HiUser className="text-4xl text-black" />
                          </div>
              }
              className="w-30"
              dismissOnClick={false}
              style={{ backgroundColor: "black",color:"black" }}
            >
              <DropdownItem
                style={{ backgroundColor: "black", color: "#92E3A9 ",border: "1px solid #92E3A9" }}
                onClick={() => {
                  setOpenModal(!openModal);
                }}
              >
                <HiUser className="inline-block mr-2" />
                Profile
              </DropdownItem>
              <DropdownItem
                style={{ backgroundColor: "#DC3545",border: "1px solid #92E3A9" }}
                onClick={handleSignOut}
              >
                <HiOutlineLogout className="inline-block mr-2" />
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

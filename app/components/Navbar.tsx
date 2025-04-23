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
  HiLogout,
} from "react-icons/hi";
import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarToggle,
} from "flowbite-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/public/assets/icon";
import { useAuth } from "../context/AuthContext";

export function MyNavbar() {
  interface navlinks {
    name: string;
    href: string;
    icon: React.ElementType;
  }

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
          </Link>
        )}

        {isAuthenticated ? (
          <Button
            onClick={handleSignOut}
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
            Sign Out
            <HiLogout className="h-5 w-5" />
          </Button>
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
  );
}

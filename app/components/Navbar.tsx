"use client";

import { FaRocket } from "react-icons/fa";
import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarToggle,
} from "flowbite-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "@/public/assets/icon";

export function MyNavbar() {
  interface navlinks {
    name: string;
    href: string;
  }

  const pathname = usePathname();

  // Simulate login check with a static token
  const [loggedIn, setIsLoggedin] = useState(false);

  useEffect(() => {
    async function checkLogin() {
      try {
        // Simulate a static token for testing
        const staticToken = "sampleToken123"; // Replace this with your static token
        localStorage.setItem("token", staticToken); // Store token in localStorage

        // Check if token exists
        const token = localStorage.getItem("token");
        setIsLoggedin(!!token); // If there's a token, set loggedIn to true

        console.log("Token:", token);
        console.log("Logged in status:", loggedIn);

        //eslint-disable-next-line
      } catch (error: any) {
        console.log("Error checking login status:", error.message);
      }
    }
    checkLogin();
  }, []);

  const navLinks: navlinks[] = [
    {
      name: "Home",
      href: "/",
    },
    ...(loggedIn
      ? [
          {
            name: "Courses",
            href: "/courses",
          },
        ]
      : []),
    ...(loggedIn
      ? [
          {
            name: "Notice",
            href: "/notice",
          },
        ]
      : []),
    {
      name: "About",
      href: "/about",
    },
    {
      name: "Contact",
      href: "/contact",
    },
  ];

  return (
    <Navbar color="black" fluid style={{ backgroundColor: "#92e3a9" }}>
      <NavbarBrand as={Link} href="/">
        <Logo className="mx-2 h-7 w-7 text-black" />
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
              color: pathname === link.href ? "#fff" : "#000",
              fontWeight: pathname === link.href ? "bold" : "normal",
            }}
            href={link.href}
          >
            {link.name}
          </Link>
        ))}
      </NavbarCollapse>
      <Link href="/signup" className="hidden md:block">
        <Button
          style={{
            backgroundColor: "#000000",
            color: "#ffffff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          Get Started <FaRocket />
        </Button>
      </Link>
    </Navbar>
  );
}

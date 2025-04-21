"use client";

import { FaRocket } from "react-icons/fa";
import { HiShoppingCart } from "react-icons/hi";
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
  const [loggedIn, setIsLoggedin] = useState(false);

  useEffect(() => {
    const token =" abcd";
    setIsLoggedin(!!token);
  }, []);

  const navLinks: navlinks[] = [
    ...(loggedIn
      ? [{ name: "Dashboard", href: "/" }]
      : [{ name: "Home", href: "/" }]),
    ...(loggedIn
      ? [
          { name: "Courses", href: "/courses" },
          { name: "Registration Status", href: "/registration-status" },
          { name: "Notice", href: "/notice" },
        ]
      : []),
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <Navbar color="black" fluid style={{ backgroundColor: "#92e3a9" }}>
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
              color: pathname === link.href ? "#fff" : "#000",
              fontWeight: pathname === link.href ? "bold" : "normal",
            }}
            href={link.href}
          >
            {link.name}
          </Link>
        ))}
      </NavbarCollapse>

      <div className="flex items-center gap-4">
        {loggedIn && (
          <Link href="/cart">
            <HiShoppingCart className="cursor-pointer text-3xl text-black hover:text-white" />
          </Link>
        )}

        {loggedIn ? (
          <Button
            onClick={() => {
              localStorage.removeItem("token");
              setIsLoggedin(false);
              window.location.reload();
            }}
            style={{
              backgroundColor: "#000000",
              color: "#ffffff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            Sign Out
          </Button>
        ) : (
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
        )}
      </div>
    </Navbar>
  );
}

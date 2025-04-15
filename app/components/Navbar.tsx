"use client";

import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function MyNavbar() {
  interface navlinks {
    name: string;
    href: string;
  }

  const navLinks: navlinks[] = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "About",
      href: "/about",
    },
    {
      name: "Contact",
      href: "/contact",
    },
  ];

  const pathname = usePathname();

  return (
    <Navbar color="black" fluid style={{ backgroundColor: "#92e3a9" }}>
      <NavbarBrand as={Link} href="https://flowbite-react.com">
        <Image
          src="/favicon.ico"
          className="mr-3 h-6 w-full sm:h-9"
          alt="Flowbite React Logo"
          width={100}
          height={0}
        />
        <span className="self-center text-xl font-semibold whitespace-nowrap text-black">
          CourseSphere
        </span>
      </NavbarBrand>
      <NavbarToggle />
      <NavbarCollapse>
        {navLinks.map((link) => (
          <NavbarLink
            key={link.name}
            style={{
              color: pathname === link.href ? "#fff" : "#000",
              fontWeight: pathname === link.href ? "bold" : "normal",
            }}
            href={link.href}
          >
            {link.name}
          </NavbarLink>
        ))}
      </NavbarCollapse>
      <Button
        style={{
          backgroundColor: "#000",
          color: "#fff",
          cursor: "pointer",
        }}
        onClick={() => {
          window.location.href = "/signup";
        }}
      >
        Get Started
      </Button>
    </Navbar>
  );
}

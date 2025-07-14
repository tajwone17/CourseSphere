"use client";

import hero from "@/public/assets/hero.svg";
// import { useAuth } from "@/app/context/AuthContext";
import { Button } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiArrowRight } from "react-icons/hi";
import { useEffect } from "react";

export default function Home() {
  // const { isAuthenticated, user } = useAuth();
  // Mock authentication state for demonstration purposes
  const isAuthenticated = false; // TODO: Change this to true to simulate an authenticated user
  const user = null; // Change this to a mock user object to simulate an authenticated user
  const router = useRouter();

  useEffect(() => {
    // Redirect logged-in users to their appropriate dashboard
    if (isAuthenticated && user) {
      // Safely access userType property
      // const userType = user.userType;
      const userTypes = ["student", "admin", "advisor", "hod"];
      const userType = userTypes[Math.floor(Math.random() * userTypes.length)]; // Mock user type for demonstration

      if (userType === "student") {
        router.push("/student-dashboard");
      } else if (userType === "admin") {
        router.push("/admin/dashboard");
      } else if (userType === "advisor") {
        router.push("/advisor/dashboard");
      } else if (userType === "hod") {
        router.push("/hod/dashboard");
      }
    }
  }, [isAuthenticated, user, router]);

  // If user is authenticated, return null or loading indicator while redirecting
  if (isAuthenticated && user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl">Redirecting to dashboard...</div>
      </div>
    );
  }

  // Otherwise, show landing page for non-authenticated users
  return (
    <div className="flex min-h-screen flex-col-reverse items-center justify-between gap-10 overflow-hidden p-10 md:flex-row lg:p-24">
      <div className="flex w-full flex-col" data-aos="fade-right">
        <h1 className="text-4xl font-extrabold">CourseSphere </h1>

        <br />
        <h2 className="text-2xl font-bold italic">
          ~ Modern Course Registration Made Simple
        </h2>

        <p className="mt-4 text-lg font-normal">
          Welcome to CourseSphere, your all-in-one university course
          registration platform. Streamline your academic journey with our
          intuitive system for course selection, registration, and management.
          Students can easily browse available courses, create schedules, and
          track their registration progress. Faculty and administrators benefit
          from efficient approval workflows and comprehensive oversight tools.
          Say goodbye to paperwork and long queues – experience a seamless
          digital registration process.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex items-center">
            <div className="mr-2 rounded-full bg-[#92e3a9] p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-black"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="text-sm">Multi-step approval process</span>
          </div>
          <div className="flex items-center">
            <div className="mr-2 rounded-full bg-[#92e3a9] p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-black"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="text-sm">Real-time registration status</span>
          </div>
          <div className="flex items-center">
            <div className="mr-2 rounded-full bg-[#92e3a9] p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-black"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="text-sm">Secure online payments</span>
          </div>
          <div className="flex items-center">
            <div className="mr-2 rounded-full bg-[#92e3a9] p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-black"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="text-sm">Role-specific dashboards</span>
          </div>
        </div>
        <Link href="/signup">
          <Button
            style={{
              backgroundColor: "#92e3a9",
              color: "#000000",
              marginTop: "20px",
              width: "fit-content",
              cursor: "pointer",
            }}
          >
            Let`s Get Started
            <HiArrowRight className="ml-2" size={20} />
          </Button>
        </Link>
      </div>

      <div className="w-full" data-aos="fade-left">
        <Image src={hero} alt="Hero Icon" />
      </div>
    </div>
  );
}

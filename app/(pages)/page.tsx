"use client";

import hero from "@/public/assets/hero.svg";
import { useAuth } from "@/app/context/AuthContext";
import { Button } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiArrowRight } from "react-icons/hi";
import { useEffect } from "react";

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect logged-in users to their appropriate dashboard
    if (isAuthenticated && user) {
      // Safely access userType property
      const userType = user.userType;

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
          ~ Where Learning Meets Simplicity
        </h2>

        <p className="mt-4 text-lg font-normal">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod nostrum
          non delectus, ad quasi exercitationem assumenda nam excepturi alias
          molestiae fugit sunt illo ullam odit quisquam blanditiis temporibus,
          laudantium tempora minus, tenetur mollitia libero ea. Ipsam,
          consequatur. Voluptatibus, at tempore distinctio amet consequuntur
          repudiandae natus id sunt quas, unde magni?
        </p>
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

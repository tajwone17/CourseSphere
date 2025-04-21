"use client";

import hero from "@/public/assets/hero.svg";
import { Button } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import { HiArrowRight } from "react-icons/hi";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col-reverse items-center justify-between gap-10 overflow-hidden p-10 md:flex-row lg:p-24">
      <div
        className="flex w-full flex-col"
        data-aos="fade-right"
        data-aos-duration="1000"
      >
        <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl">
          CourseSphere
          <span className="block text-[#92e3a9]">
            Course Registration System
          </span>
        </h1>
        <h2 className="mt-4 text-2xl font-bold text-gray-300 italic">
          Where Learning Meets Simplicity
        </h2>

        <p className="mt-6 text-lg font-normal text-gray-400">
          Streamline your academic journey with our intuitive course
          registration platform. Select courses, track approvals, and manage
          your academic progress all in one place.
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

      <div className="w-full" data-aos="fade-left" data-aos-duration="1000">
        <Image src={hero} alt="Hero Icon" priority />
      </div>
    </div>
  );
}

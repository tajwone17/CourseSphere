"use client";

import hero from "@/public/assets/hero.svg";

import { Button } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import { HiArrowRight } from "react-icons/hi";
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col-reverse items-center justify-between gap-10 overflow-hidden p-10 md:flex-row lg:p-24">
      <div className="flex w-full flex-col" data-aos="fade-right">
        <h1 className="text-3xl font-extrabold">CourseSphere </h1>

        <br />
        <h2 className="text-2xl font-bold">
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

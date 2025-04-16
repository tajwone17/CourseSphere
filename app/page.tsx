"use client";

import hero from "@/public/assets/hero.svg";
import { Button } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import { HiArrowRight } from "react-icons/hi";
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between gap-10 p-24 md:flex-row">
      <div className="flex w-full flex-col">
        <h1 className="text-3xl font-extrabold">CourseSphere</h1>
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

      <div className="w-full">
        <Image src={hero} alt="Hero Icon" />
      </div>
    </div>
  );
}

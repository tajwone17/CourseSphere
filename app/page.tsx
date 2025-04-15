"use client";

import hero from "@/public/assets/hero.svg";
import { Button } from "flowbite-react";
import Image from "next/image";

export default function Home() {
  const handleClick = () => {
    window.location.href = "/signin";
  };

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
        <Button
          style={{
            backgroundColor: "#92e3a9",
            color: "#000000",
            marginTop: "20px",
            width: "fit-content",
            cursor: "pointer",
          }}
          onClick={handleClick}
        >
          Lets Get Started
        </Button>
      </div>

      <div className="w-full">
        <Image src={hero} alt="Hero Icon" />
      </div>
    </div>
  );
}

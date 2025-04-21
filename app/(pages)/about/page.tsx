import React from "react";
import { MdInfoOutline, MdSchool, MdGroup, MdStar } from "react-icons/md";

export default function About() {
  const features = [
    {
      icon: MdSchool,
      title: "Simple Course Registration",
      description:
        "Easy-to-use interface for course selection and registration",
    },
    {
      icon: MdGroup,
      title: "Quick Approval Process",
      description: "Streamlined approval workflow with instant status updates",
    },
    {
      icon: MdStar,
      title: "Smart Course Management",
      description:
        "Intelligent prerequisite checking and schedule conflict prevention",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-16">
      <div
        data-aos="zoom-in"
        data-aos-duration="1000"
        className="w-full max-w-4xl rounded-lg border-2 border-gray-800 bg-gray-900 p-8 shadow-xl"
      >
        <div className="mb-10 text-center">
          <div className="mb-6 flex items-center justify-center gap-2">
            <MdInfoOutline size={40} className="text-[#92e3a9]" />
            <h1 className="text-3xl font-extrabold tracking-tight text-white lg:text-5xl">
              About CourseSphere
           
            </h1>
          </div>
          <p className="mx-auto max-w-3xl text-lg text-gray-400">
            CourseSphere is a modern course registration system designed to
            streamline the academic process for students and faculty alike. Our
            platform brings efficiency and simplicity to course selection and
            management.
          </p>
        </div>

        <div
          className="mt-12 grid gap-8 md:grid-cols-3"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="rounded-lg border border-gray-800 bg-gray-900 p-6 shadow-xl transition-transform hover:scale-105"
                data-aos="fade-up"
                data-aos-delay={300 + index * 100}
              >
                <div className="mb-4 inline-block rounded-lg bg-gray-800 p-3">
                  <Icon className="h-6 w-6 text-[#92e3a9]" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

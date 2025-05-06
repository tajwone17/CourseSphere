"use client";

import React from "react";
import { MdCheckCircle, MdPerson } from "react-icons/md";
import { FaUserClock, FaUserCheck, FaUserTimes } from "react-icons/fa";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function AccountActivationStatus() {
  const searchParams = useSearchParams();
  const status = searchParams?.get("status") || "pending"; // default to pending

  // Define account status display information
  const statusInfo = {
    pending: {
      title: "Account Pending Activation",
      description:
        "Your account has been registered successfully and is awaiting activation from the Head of Department.",
      icon: FaUserClock,
      color: "text-yellow-300",
      bgColor: "bg-yellow-900/30",
      borderColor: "border-yellow-800",
    },
    active: {
      title: "Account Active",
      description:
        "Your account has been activated successfully. You can now log in to the system.",
      icon: FaUserCheck,
      color: "text-green-300",
      bgColor: "bg-green-900/30",
      borderColor: "border-green-800",
    },
    inactive: {
      title: "Account Inactive",
      description:
        "Your account is currently inactive. Please contact the administration for assistance.",
      icon: FaUserTimes,
      color: "text-red-300",
      bgColor: "bg-red-900/30",
      borderColor: "border-red-800",
    },
  };

  const currentStatus =
    statusInfo[status as keyof typeof statusInfo] || statusInfo.pending;
  const StatusIcon = currentStatus.icon;

  // Account activation steps
  const steps = [
    { name: "Registration", icon: MdPerson, status: "completed" },
    {
      name: "HOD Review",
      icon: MdPerson,
      status: status === "active" ? "completed" : "pending",
    },
    {
      name: "Account Activation",
      icon: MdCheckCircle,
      status: status === "active" ? "completed" : "pending",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-12">
      {/* Heading */}
      <div
        className="mb-8 text-center"
        data-aos="fade-down"
        data-aos-duration="1000"
      >
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-gray-200 lg:text-5xl">
          Account Status
        </h1>
        <p className="mt-4 text-lg text-gray-400">
          View your account activation status
        </p>
      </div>

      {/* Status Card */}
      <div
        className={`mx-auto max-w-3xl rounded-lg border ${currentStatus.borderColor} ${currentStatus.bgColor} p-8 shadow-xl`}
        data-aos="fade-up"
        data-aos-duration="800"
      >
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <div
            className={`flex h-24 w-24 items-center justify-center rounded-full border ${currentStatus.borderColor} ${currentStatus.bgColor}`}
          >
            <StatusIcon className={`h-12 w-12 ${currentStatus.color}`} />
          </div>

          <h2 className="text-2xl font-bold text-white">
            {currentStatus.title}
          </h2>
          <p className="max-w-lg text-gray-300">{currentStatus.description}</p>

          {status === "pending" && (
            <div className="mt-2 text-gray-400">
              <p>
                Please check back later or contact your department office for
                updates.
              </p>
            </div>
          )}

          {status === "active" && (
            <Link href="/signin">
              <button className="hover:bg-opacity-90 mt-4 rounded-md bg-[#92e3a9] px-6 py-3 font-medium text-black transition-all">
                Proceed to Login
              </button>
            </Link>
          )}

          {status === "inactive" && (
            <div className="mt-2 text-gray-400">
              <p>
                Please contact your department administrator for assistance.
              </p>
              <p className="mt-2">Contact: admin@coursesphere.edu</p>
            </div>
          )}
        </div>
      </div>

      {/* Registration Progress */}
      <div
        className="rounded-lg border border-gray-800 bg-gray-900 p-6 shadow-xl"
        data-aos="fade-up"
        data-aos-duration="800"
      >
        <h2 className="mb-8 text-center text-xl font-semibold text-white">
          Account Activation Process
        </h2>
        <div className="relative mx-auto max-w-3xl overflow-x-auto px-8">
          {/* Progress Line */}
          <div className="absolute top-6 left-0 h-0.5 w-full bg-gray-800"></div>

          {/* Steps */}
          <div className="relative flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="z-10 flex flex-col items-center"
                  style={{ minWidth: "120px" }}
                >
                  <div
                    className={`mb-3 flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
                      step.status === "completed"
                        ? "bg-[#92e3a9] text-black"
                        : step.status === "current"
                          ? "bg-opacity-50 bg-[#92e3a9] text-black"
                          : "bg-gray-800 text-gray-400"
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-center text-sm text-gray-400">
                    {step.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div
        className="rounded-lg border border-gray-800 bg-gray-900 p-6 shadow-xl"
        data-aos="fade-up"
        data-aos-delay="400"
      >
        <h2 className="mb-6 text-xl font-semibold text-white">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <div className="rounded-md bg-gray-800 p-4">
            <h3 className="font-medium text-white">
              How long does account activation take?
            </h3>
            <p className="mt-1 text-gray-400">
              Account activation is typically completed within 1-2 business days
              after registration.
            </p>
          </div>
          <div className="rounded-md bg-gray-800 p-4">
            <h3 className="font-medium text-white">
              What if my account remains pending?
            </h3>
            <p className="mt-1 text-gray-400">
              If your account remains pending for more than 2 business days,
              please contact your department office or send an email to
              support@coursesphere.edu.
            </p>
          </div>
          <div className="rounded-md bg-gray-800 p-4">
            <h3 className="font-medium text-white">
              Will I be notified when my account is activated?
            </h3>
            <p className="mt-1 text-gray-400">
              Yes, you will receive an email notification when your account has
              been activated by the Head of Department.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-center space-x-4 pt-4">
        <Link href="/">
          <button className="rounded-md border border-gray-700 px-4 py-2 text-white transition-colors hover:bg-gray-800">
            Back to Home
          </button>
        </Link>
        <Link href="/contact">
          <button className="rounded-md border border-[#92e3a9] px-4 py-2 text-[#92e3a9] transition-colors hover:bg-[#92e3a9]/10">
            Contact Support
          </button>
        </Link>
      </div>
    </div>
  );
}

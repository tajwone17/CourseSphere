"use client";

import React, { useState, useEffect } from "react";
import {
  MdCheckCircle,
  MdPayment,
  MdDescription,
  MdPerson,
} from "react-icons/md";
import {
  HiCheck,
  HiClock as HiPending,
  HiExclamation,
  HiBookOpen,
  HiArrowLeft,
} from "react-icons/hi";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { useSearchParams } from "next/navigation";

interface RegistrationData {
  ID: number;
  STUDENT_ID: number;
  SEMESTER: string;
  STATUS: string;
  HOD_APPROVAL: number;
  ADVISOR_APPROVAL: number;
  ACCOUNTS_ADMIN_APPROVAL: number;
  SUBMITTED_AT: string;
  PAYMENT_STATUS: string;
  TOTAL_AMOUNT: number;
  student_name: string;
  student_email: string;
  department_name: string;
  courses: CourseRegistration[];
  payments: Payment[];
  statusMessage: string;
  nextStep: string;
}

interface CourseRegistration {
  registration_id: number;
  COURSE_ID: number;
  STATUS: string;
  ADVISOR_COMMENT: string | null;
  course_title: string;
  course_code: string;
  course_credit: number;
  instructor: string;
  advisor_name: string;
  advisor_email: string;
  isRegistered?: boolean;
}

interface Payment {
  ID: number;
  BUNDLE_ID: number;
  AMOUNT: number;
  STATUS: string;
  PAYMENT_METHOD: string;
  TRANSACTION_ID: string | null;
  PAYMENT_DATE: string;
}

export default function RegistrationStatusPage() {
  const { user, isAuthenticated } = useAuth();
  const searchParams = useSearchParams();
  const bundleId = searchParams.get("bundleId");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registration, setRegistration] = useState<RegistrationData | null>(
    null,
  );
  const [hasActiveRegistration, setHasActiveRegistration] = useState(false);

  // Payment state
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [transactionId, setTransactionId] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const fetchRegistrationStatus = async () => {
      if (!isAuthenticated && !bundleId) {
        setLoading(false);
        setError("You must be logged in to view registration status");
        return;
      }

      try {
        const url = bundleId
          ? `/api/registration/status?bundleId=${bundleId}`
          : `/api/registration/status?userId=${user?.id}`;

        const response = await fetch(url);
        const data = await response.json();

        // If there's no registration found, handle it gracefully without setting an error
        if (!response.ok || !data.success || !data.registration) {
          // This is expected when no registration exists - don't treat as error
          if (
            response.status === 404 ||
            data.error?.includes("No registration found")
          ) {
            console.log("No registration found - showing empty state");
            setRegistration(null);
            localStorage.removeItem("hasActiveRegistration");
            setLoading(false);
            return;
          }

          // For other types of errors, throw an error
          throw new Error(data.error || "Failed to fetch registration status");
        }

        // Process valid registration data
        const parsedRegistration = {
          ...data.registration,
          TOTAL_AMOUNT: Number(data.registration.TOTAL_AMOUNT),
        };
        setRegistration(parsedRegistration);

        // Set the active registration flag if registration status is not COMPLETED or REJECTED
        const isActive =
          parsedRegistration.STATUS !== "COMPLETED" &&
          parsedRegistration.STATUS !== "REJECTED";
        setHasActiveRegistration(isActive);

        // Store active registration status in localStorage for other pages to check
        if (isActive) {
          localStorage.setItem("hasActiveRegistration", "true");
        } else {
          localStorage.removeItem("hasActiveRegistration");
        }
      } catch (err) {
        console.error("Error fetching registration status:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
        localStorage.removeItem("hasActiveRegistration");
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrationStatus();
  }, [isAuthenticated, user?.id, bundleId, paymentSuccess]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!registration) return;

    setProcessingPayment(true);
    setPaymentError(null);

    try {
      const amount = parseFloat(paymentAmount);

      if (isNaN(amount) || amount <= 0) {
        throw new Error("Please enter a valid payment amount");
      }

      const response = await fetch("/api/registration/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bundleId: registration.ID,
          amount,
          paymentMethod,
          transactionId: transactionId || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process payment");
      }

      if (data.success) {
        setPaymentSuccess(true);
        setShowPaymentForm(false);
        // Reset form
        setPaymentAmount("");
        setTransactionId("");
      }
    } catch (err) {
      console.error("Error processing payment:", err);
      setPaymentError(
        err instanceof Error ? err.message : "Payment processing failed",
      );
    } finally {
      setProcessingPayment(false);
    }
  };

  // Determine the current step in the registration process
  const determineStepStatus = () => {
    if (!registration) return [];

    const steps = [
      {
        name: "Form Submission",
        icon: MdDescription,
        status: "completed",
      },
      {
        name: "Advisor Review",
        icon: MdPerson,
        status: registration.ADVISOR_APPROVAL
          ? "completed"
          : registration.STATUS === "REJECTED"
            ? "rejected"
            : "current",
      },
      {
        name: "HOD Approval",
        icon: MdCheckCircle,
        status: registration.HOD_APPROVAL
          ? "completed"
          : !registration.ADVISOR_APPROVAL
            ? "pending"
            : registration.STATUS === "REJECTED"
              ? "rejected"
              : "current",
      },
      {
        name: "Accounts Office",
        icon: MdCheckCircle,
        status: registration.ACCOUNTS_ADMIN_APPROVAL
          ? "completed"
          : !registration.HOD_APPROVAL
            ? "pending"
            : registration.STATUS === "REJECTED"
              ? "rejected"
              : "current",
      },
      {
        name: "Payment",
        icon: MdPayment,
        status:
          registration.PAYMENT_STATUS === "PAID"
            ? "completed"
            : registration.PAYMENT_STATUS === "PARTIALLY_PAID"
              ? "in-progress"
              : !registration.ACCOUNTS_ADMIN_APPROVAL
                ? "pending"
                : registration.STATUS === "REJECTED"
                  ? "rejected"
                  : "current",
      },
      {
        name: "Confirmation",
        icon: MdCheckCircle,
        status:
          registration.STATUS === "COMPLETED"
            ? "completed"
            : registration.STATUS === "REJECTED"
              ? "rejected"
              : "pending",
      },
    ];

    return steps;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "APPROVED":
        return "text-green-400";
      case "PENDING":
        return "text-yellow-400";
      case "REJECTED":
        return "text-red-400";
      case "COMPLETED":
        return "text-green-500";
      default:
        return "text-gray-400";
    }
  };

  const renderStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case "APPROVED":
      case "COMPLETED":
        return <HiCheck className="text-green-500" />;
      case "PENDING":
        return <HiPending className="text-yellow-500" />;
      case "REJECTED":
        return <HiExclamation className="text-red-500" />;
      default:
        return <HiPending className="text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-[#92e3a9]"></div>
      </div>
    );
  }

  if (error && !error.includes("No registration found")) {
    return (
      <div className="mx-auto max-w-4xl py-10">
        <div className="rounded-lg border border-red-500 bg-red-900/20 p-6 text-center">
          <h1 className="mb-4 text-2xl font-bold text-red-400">Error</h1>
          <p className="mb-4 text-red-300">{error}</p>
          <Link href="/courses">
            <button className="rounded-md bg-[#92e3a9] px-6 py-2 text-black hover:bg-[#78c18f]">
              Browse Courses
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (!registration) {
    return (
      <div className="mx-auto max-w-4xl py-10">
        <div className="rounded-lg border border-gray-700 bg-gray-800 p-6 text-center">
          <h1 className="mb-4 text-2xl font-bold text-white">
            No Registration Found
          </h1>
          <p className="mb-4 text-gray-300">
            You don&apos;t have any active course registrations.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center space-y-4">
            <p className="text-gray-300">
              Ready to register for courses? Follow these steps:
            </p>
            <ol className="mb-4 list-decimal text-left text-gray-300">
              <li className="ml-6">
                Browse available courses for this semester
              </li>
              <li className="ml-6">
                Select the courses you want to register for
              </li>
              <li className="ml-6">
                Submit your course selection for approval
              </li>
            </ol>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/courses">
                <button className="flex items-center rounded-md bg-gray-700 px-6 py-3 font-medium text-white shadow-md transition-all duration-200 hover:bg-gray-600 hover:shadow-lg">
                  <HiBookOpen className="mr-2 text-lg" />
                  Browse Courses
                </button>
              </Link>
              <Link href="/course-selection">
                <button className="flex items-center rounded-md bg-[#92e3a9] px-6 py-3 font-medium text-black shadow-md transition-all duration-200 hover:bg-[#78c18f] hover:shadow-lg">
                  <HiCheck className="mr-2 text-lg" />
                  Select Courses
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const steps = determineStepStatus();
  const totalPaid = registration.payments.reduce(
    (sum, payment) => sum + Number(payment.AMOUNT),
    0,
  );
  const remainingAmount = Math.max(
    0,
    Number(registration.TOTAL_AMOUNT) - totalPaid,
  );

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-center text-4xl font-bold tracking-tight text-white">
        Course Registration Status
      </h1>

      {hasActiveRegistration && (
        <div className="mb-8 rounded-lg border-l-4 border-yellow-500 bg-yellow-900/20 p-5 shadow-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <HiExclamation className="h-6 w-6 text-yellow-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-base font-semibold text-yellow-400">
                Active Registration In Progress
              </h3>
              <div className="mt-2 text-sm text-yellow-300">
                <p className="leading-relaxed">
                  You have an ongoing course registration that requires
                  approval. While this registration is in progress, you cannot
                  select additional courses or start a new registration. Please
                  wait for your current registration to be completed or contact
                  the academic office for assistance.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {paymentSuccess && (
        <div className="mb-8 rounded-lg border-l-4 border-green-500 bg-green-900/20 p-5 shadow-md">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <HiCheck className="h-6 w-6 text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-base font-semibold text-green-300">
                Payment processed successfully!
              </p>
              <p className="mt-1 text-sm text-green-300/80">
                Your payment has been recorded and your registration is being
                updated.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Registration Summary */}
      <div className="overflow-hidden rounded-lg border border-gray-700 bg-gray-800/80 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl">
        <div className="border-b border-gray-700 bg-gray-900 px-6 py-5">
          <h2 className="flex items-center text-xl font-semibold text-white">
            <MdDescription className="mr-2 text-[#92e3a9]" />
            Registration Details
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
          <div>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-400">
                  Student Name
                </dt>
                <dd className="mt-1 text-base text-white">
                  {registration.student_name}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-400">
                  Student ID
                </dt>
                <dd className="mt-1 text-base text-white">
                  {registration.STUDENT_ID}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-400">
                  Department
                </dt>
                <dd className="mt-1 text-base text-white">
                  {registration.department_name}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-400">Semester</dt>
                <dd className="mt-1 text-base font-medium text-white">
                  {registration.SEMESTER}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-400">
                  Submission Date
                </dt>
                <dd className="mt-1 text-base text-white">
                  {formatDate(registration.SUBMITTED_AT)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-400">Status</dt>
                <dd
                  className={`mt-1 flex items-center text-base font-medium ${getStatusColor(registration.STATUS)}`}
                >
                  {renderStatusIcon(registration.STATUS)}
                  <span className="ml-1">{registration.STATUS}</span>
                </dd>
              </div>
            </dl>
          </div>
          <div className="border-t border-gray-700 pt-4 md:border-t-0 md:border-l md:pt-0 md:pl-8">
            <div className="mb-6">
              <h3 className="flex items-center text-base font-semibold text-gray-200">
                <MdPerson className="mr-2 text-[#92e3a9]" />
                Registration Progress
              </h3>
              <p className="mt-3 text-base leading-relaxed text-white">
                {registration.statusMessage}
              </p>
              <p className="mt-3 text-base font-medium text-[#92e3a9]">
                {registration.nextStep}
              </p>
            </div>

            <div className="mt-6">
              <h3 className="flex items-center text-base font-semibold text-gray-200">
                <MdPayment className="mr-2 text-[#92e3a9]" />
                Payment Status
              </h3>
              <div className="mt-3 flex items-center justify-between">
                <span
                  className={`text-base font-medium ${
                    registration.PAYMENT_STATUS === "PAID"
                      ? "text-green-400"
                      : registration.PAYMENT_STATUS === "PARTIALLY_PAID"
                        ? "text-yellow-400"
                        : "text-gray-400"
                  }`}
                >
                  {registration.PAYMENT_STATUS === "PAID"
                    ? "Fully Paid"
                    : registration.PAYMENT_STATUS === "PARTIALLY_PAID"
                      ? "Partially Paid"
                      : "Payment Pending"}
                </span>
                <span className="text-base font-medium text-white">
                  ${totalPaid.toFixed(2)} / $
                  {Number(registration.TOTAL_AMOUNT).toFixed(2)}
                </span>
              </div>
              <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-gray-700 shadow-inner">
                <div
                  className="h-full bg-[#92e3a9] transition-all duration-500 ease-in-out"
                  style={{
                    width: `${Math.min(100, (totalPaid / Number(registration.TOTAL_AMOUNT)) * 100)}%`,
                  }}
                ></div>
              </div>

              {/* Payment Action */}
              {registration.STATUS === "APPROVED" && remainingAmount > 0 && (
                <div className="mt-4">
                  {!showPaymentForm ? (
                    <button
                      onClick={() => setShowPaymentForm(true)}
                      className="mt-3 flex w-full items-center justify-center rounded-md bg-[#92e3a9] px-4 py-3 text-center font-medium text-black shadow-md transition-colors hover:bg-[#78c18f] hover:shadow-lg"
                    >
                      <MdPayment className="mr-2 text-lg" />
                      Make Payment
                    </button>
                  ) : (
                    <form
                      onSubmit={handlePayment}
                      className="mt-6 space-y-5 rounded-lg border border-gray-700 bg-gray-800/50 p-5 shadow-lg"
                    >
                      <h4 className="mb-2 text-base font-medium text-white">
                        Payment Details
                      </h4>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-300">
                          Payment Amount ($)
                        </label>
                        <input
                          type="number"
                          value={paymentAmount}
                          onChange={(e) => setPaymentAmount(e.target.value)}
                          min="1"
                          max={remainingAmount}
                          step="0.01"
                          required
                          className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2.5 text-white shadow-sm focus:border-[#92e3a9] focus:ring-[#92e3a9] focus:outline-none"
                          placeholder={`Amount (Max: $${remainingAmount.toFixed(2)})`}
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-300">
                          Payment Method
                        </label>
                        <select
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2.5 text-white shadow-sm focus:border-[#92e3a9] focus:ring-[#92e3a9] focus:outline-none"
                        >
                          <option value="Credit Card">Credit Card</option>
                          <option value="Bank Transfer">Bank Transfer</option>
                          <option value="Mobile Banking">Mobile Banking</option>
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-300">
                          Transaction ID (Optional)
                        </label>
                        <input
                          type="text"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2.5 text-white shadow-sm focus:border-[#92e3a9] focus:ring-[#92e3a9] focus:outline-none"
                          placeholder="Transaction ID if applicable"
                        />
                      </div>

                      {paymentError && (
                        <div className="rounded-md border-l-4 border-red-500 bg-red-900/20 p-4 text-sm text-red-300 shadow-md">
                          <div className="flex">
                            <HiExclamation className="mt-0.5 h-5 w-5 text-red-400" />
                            <div className="ml-3">
                              <p className="font-medium">{paymentError}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-3 pt-2">
                        <button
                          type="submit"
                          disabled={processingPayment}
                          className="flex flex-1 items-center justify-center rounded-md bg-[#92e3a9] px-4 py-2.5 text-base font-medium text-black shadow-md transition-all hover:bg-[#78c18f] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {processingPayment ? (
                            <>
                              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-black border-b-transparent"></div>
                              Processing...
                            </>
                          ) : (
                            "Submit Payment"
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowPaymentForm(false)}
                          className="rounded-md border border-gray-600 bg-transparent px-4 py-2.5 text-base font-medium text-white transition-colors hover:bg-gray-700"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Registration Progress Steps */}
      <div className="overflow-hidden rounded-lg border border-gray-700 bg-gray-800/80 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl">
        <div className="border-b border-gray-700 bg-gray-900 px-6 py-5">
          <h2 className="flex items-center text-xl font-semibold text-white">
            <MdCheckCircle className="mr-2 text-[#92e3a9]" />
            Registration Progress
          </h2>
        </div>
        <div className="p-8">
          <div className="overflow-hidden">
            <div className="mb-8 flex items-center justify-center">
              <ol className="flex w-full items-center">
                {steps.map((step, index) => (
                  <li
                    key={step.name}
                    className={`flex items-center ${index < steps.length - 1 ? "w-full" : ""}`}
                  >                      <div
                      className={`flex items-center justify-center ${
                        step.status === "completed"
                          ? "bg-green-600 ring-4 ring-green-600/20"
                          : step.status === "current"
                            ? "bg-blue-600 ring-4 ring-blue-600/20"
                            : step.status === "rejected"
                              ? "bg-red-600 ring-4 ring-red-600/20"
                              : step.status === "in-progress"
                                ? "bg-yellow-600 ring-4 ring-yellow-600/20"
                                : step.status === "pending"
                                  ? "bg-gray-700 ring-4 ring-gray-700/20"
                                  : "bg-gray-700 ring-4 ring-gray-700/20"
                      } h-12 w-12 rounded-full shadow-md transition-all duration-300`}
                    >
                      <step.icon className="h-6 w-6 text-white" />
                    </div>
                    <div
                      className={`hidden sm:ml-3 sm:block ${
                        step.status === "completed"
                          ? "text-green-400"
                          : step.status === "current"
                            ? "text-blue-400"
                            : step.status === "rejected"
                              ? "text-red-400"
                              : step.status === "in-progress"
                                ? "text-yellow-400"
                                : "text-gray-400"
                      }`}
                    >
                      <p className="text-sm font-medium">{step.name}</p>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="flex w-full items-center">
                        <div
                          className={`h-1 w-full ${
                            step.status === "completed"
                              ? "bg-gradient-to-r from-green-600 to-green-500"
                              : "bg-gray-700"
                          } transition-all duration-500`}
                        ></div>
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Course Registration Details */}
      <div className="overflow-hidden rounded-lg border border-gray-700 bg-gray-800/80 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl">
        <div className="border-b border-gray-700 bg-gray-900 px-6 py-5">
          <h2 className="flex items-center text-xl font-semibold text-white">
            <HiBookOpen className="mr-2 text-[#92e3a9]" />
            Registered Courses
          </h2>
          {registration.STATUS === "COMPLETED" && (
            <p className="mt-2 flex items-center text-sm text-green-400">
              <HiCheck className="mr-1 text-green-500" />
              Your courses have been officially registered for{" "}
              <span className="ml-1 font-semibold">
                {registration.SEMESTER}
              </span>
            </p>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-400 uppercase">
                  Course Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-400 uppercase">
                  Course Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-400 uppercase">
                  Credits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-400 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-400 uppercase">
                  Advisor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-400 uppercase">
                  Comments
                </th>
                {registration.STATUS === "COMPLETED" && (
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-400 uppercase">
                    Registration
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 bg-gray-800">
              {registration.courses.map((course) => (
                <tr key={course.registration_id}>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-white">
                    {course.course_code}
                  </td>
                  <td className="px-6 py-4 text-sm text-white">
                    {course.course_title}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-white">
                    {course.course_credit}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium ${
                        course.STATUS === "APPROVED" ||
                        course.STATUS === "COMPLETED"
                          ? "bg-green-900 text-green-300"
                          : course.STATUS === "PENDING"
                            ? "bg-yellow-900 text-yellow-300"
                            : "bg-red-900 text-red-300"
                      }`}
                    >
                      {course.STATUS}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-white">
                    {course.advisor_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {course.ADVISOR_COMMENT || "-"}
                  </td>
                  {registration.STATUS === "COMPLETED" && (
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      {course.isRegistered ? (
                        <span className="inline-flex items-center rounded-full bg-green-900 px-3 py-0.5 text-xs font-medium text-green-300">
                          Confirmed
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-yellow-900 px-3 py-0.5 text-xs font-medium text-yellow-300">
                          Processing
                        </span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment History */}
      {registration.payments.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-gray-700 bg-gray-800/80 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl">
          <div className="border-b border-gray-700 bg-gray-900 px-6 py-5">
            <h2 className="flex items-center text-xl font-semibold text-white">
              <MdPayment className="mr-2 text-[#92e3a9]" />
              Payment History
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-400 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-400 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-400 uppercase">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-400 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-400 uppercase">
                    Transaction ID
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 bg-gray-800">
                {registration.payments.map((payment) => (
                  <tr key={payment.ID}>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-white">
                      {formatDate(payment.PAYMENT_DATE)}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-white">
                      ${Number(payment.AMOUNT).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-white">
                      {payment.PAYMENT_METHOD || "Online"}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium ${
                          payment.STATUS === "COMPLETED"
                            ? "bg-green-900 text-green-300"
                            : payment.STATUS === "PENDING"
                              ? "bg-yellow-900 text-yellow-300"
                              : "bg-red-900 text-red-300"
                        }`}
                      >
                        {payment.STATUS}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-300">
                      {payment.TRANSACTION_ID || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-10 flex flex-wrap justify-center gap-6">
        <Link href="/courses">
          <button className="flex items-center rounded-md bg-gray-700 px-6 py-3 font-medium text-white shadow-md transition-all duration-200 hover:bg-gray-600 hover:shadow-lg">
            <HiBookOpen className="mr-2 text-lg" />
            Browse Courses
          </button>
        </Link>
        <Link href="/course-selection">
          <button className="flex items-center rounded-md bg-[#92e3a9] px-6 py-3 font-medium text-black shadow-md transition-all duration-200 hover:bg-[#78c18f] hover:shadow-lg">
            <HiArrowLeft className="mr-2 text-lg" />
            Back to Course Selection
          </button>
        </Link>
      </div>
    </div>
  );
}

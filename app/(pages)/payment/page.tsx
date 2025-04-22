"use client";

import { Button, Radio } from "flowbite-react";
import { useState, useEffect } from "react";
import {
  HiCreditCard,
  HiCash,
  HiDeviceMobile,
  HiChevronRight,
} from "react-icons/hi";
import { withAuth } from "@/app/utils/withAuth";

function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [studentData, setStudentData] = useState({
    name: "",
    id: "",
    department: "",
    email: "",
    waiver: ""
  });

  useEffect(() => {
    const email = localStorage.getItem("studentEmail");
    const name = localStorage.getItem("studentName");
    const id = localStorage.getItem("studentId");
    const department = localStorage.getItem("studentDepartment");
    const waiver = localStorage.getItem("studentWaiver") || "0";

    setStudentData({
      name: name || "",
      id: id || "",
      department: department || "",
      email: email || "",
      waiver: waiver
    });
  }, []);

  const totalFee = 5000;
  const waiverAmount = (totalFee * parseInt(studentData.waiver)) / 100;
  const finalAmount = totalFee - waiverAmount;

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      {/* Heading */}
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-gray-200 lg:text-4xl">
          Payment Details
        </h1>
        <p className="mt-4 text-lg text-gray-400">
          Complete your registration by making the payment
        </p>
      </div>

      {/* Student Information */}
      <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
        <h2 className="mb-4 text-xl font-semibold text-white">
          Student Information
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-gray-400">Name</p>
            <p className="font-medium text-white">{studentData.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Student ID</p>
            <p className="font-medium text-white">{studentData.id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Department</p>
            <p className="font-medium text-white">{studentData.department}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Email</p>
            <p className="font-medium text-white">{studentData.email}</p>
          </div>
        </div>
      </div>

      {/* Fee Details */}
      <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
        <h2 className="mb-4 text-xl font-semibold text-white">Fee Details</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-400">Total Fee</span>
            <span className="text-white">${totalFee}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Waiver ({studentData.waiver}%)</span>
            <span className="text-[#92e3a9]">-${waiverAmount}</span>
                  />
                </div>

                {/* Expiry and CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry" className="mb-2 block text-white">
                      Expiry Date
                    </Label>
                    <TextInput
                      id="expiry"
                      type="text"
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv" className="mb-2 block text-white">
                      CVV
                    </Label>
                    <TextInput
                      id="cvv"
                      type="text"
                      placeholder="123"
                      required
                      icon={HiLockClosed}
                    />
                  </div>
                </div>
              </>
            )}

            {paymentMethod === "bank-transfer" && (
              <div className="rounded-lg bg-gray-800 p-4">
                <h3 className="mb-2 font-medium text-white">
                  Bank Transfer Details
                </h3>
                <div className="space-y-2 text-gray-400">
                  <p>Bank: Example Bank</p>
                  <p>Account Name: CourseSphere University</p>
                  <p>Account Number: 1234567890</p>
                  <p>SWIFT/BIC: EXAMPLEBK</p>
                  <p className="mt-4 text-sm">
                    Please use your Student ID as the reference number
                  </p>
                </div>
              </div>
            )}

            {/* Payment Security Note */}
            <div className="flex items-start gap-2 rounded-lg bg-gray-800 p-4 text-sm text-gray-400">
              <HiInformationCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#92e3a9]" />
              <p>
                Your payment information is encrypted and secure. We use
                industry-standard security measures to protect your data.
              </p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-6 shadow-xl">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
              <HiCurrencyDollar className="text-[#92e3a9]" />
              <span className="text-white">Order Summary</span>
            </h2>

            {/* Course List */}
            <div className="mb-6 space-y-4">
              {orderDetails.courses.map((course, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between border-b border-gray-800 pb-4"
                >
                  <div>
                    <h3 className="font-medium text-white">{course.name}</h3>
                    <p className="text-sm text-gray-400">
                      {course.code} - {course.credits} Credits
                    </p>
                  </div>
                  <span className="text-white">${course.cost}</span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-3">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>${orderDetails.subTotal}</span>
              </div>
              <div className="flex justify-between text-[#92e3a9]">
                <span>Waiver ({orderDetails.waiver}%)</span>
                <span>-${orderDetails.waiverAmount}</span>
              </div>
              <div className="flex justify-between border-t border-gray-800 pt-3 text-lg font-bold text-white">
                <span>Total</span>
                <span>${orderDetails.total}</span>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              className="mt-6 w-full"
              style={{
                backgroundColor: "#92e3a9",
                color: "black",
              }}
            >
              <HiLockClosed className="mr-2 h-5 w-5" />
              Complete Payment
            </Button>

            <p className="mt-4 text-center text-sm text-gray-400">
              You will be redirected to a secure payment gateway
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

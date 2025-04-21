"use client";
import React, { useState } from "react";
import { Button, Label, TextInput, Select } from "flowbite-react";
import {
  HiCreditCard,
  HiCurrencyDollar,
  HiInformationCircle,
  HiLockClosed,
} from "react-icons/hi";

export default function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState("credit-card");

  // Sample payment details - in a real app, this would come from your cart/state management
  const orderDetails = {
    subTotal: 3000,
    waiver: 10,
    waiverAmount: 300,
    total: 2700,
    courses: [
      { code: "CS301", name: "Data Structures", credits: 3, cost: 1500 },
      { code: "CS315", name: "Database Systems", credits: 3, cost: 1500 },
    ],
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="mb-2 flex items-center justify-center gap-2 text-3xl font-bold">
          <HiCreditCard className="text-[#92e3a9]" />
          Payment Details
        </h1>
        <p className="text-gray-400">
          Complete your course registration payment
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Payment Form */}
        <div className="lg:col-span-2">
          <div className="space-y-6 rounded-lg border border-gray-800 bg-gray-900 p-6 shadow-xl">
            {/* Payment Method Selection */}
            <div>
              <Label htmlFor="payment-method" className="mb-2 block text-white">
                Payment Method
              </Label>
              <Select
                id="payment-method"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="border-gray-700 bg-gray-800 text-white"
              >
                <option value="credit-card">Credit/Debit Card</option>
                <option value="bank-transfer">Bank Transfer</option>
                <option value="online-banking">Online Banking</option>
              </Select>
            </div>

            {paymentMethod === "credit-card" && (
              <>
                {/* Card Number */}
                <div>
                  <Label
                    htmlFor="card-number"
                    className="mb-2 block text-white"
                  >
                    Card Number
                  </Label>
                  <div className="relative">
                    <TextInput
                      id="card-number"
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      required
                      icon={HiCreditCard}
                    />
                  </div>
                </div>

                {/* Name on Card */}
                <div>
                  <Label htmlFor="card-name" className="mb-2 block text-white">
                    Name on Card
                  </Label>
                  <TextInput
                    id="card-name"
                    type="text"
                    placeholder="John Doe"
                    required
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

"use client";

import { Button, Label, TextInput } from "flowbite-react";
import { MdEmail } from "react-icons/md";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual password reset logic here
    // For now, we'll just show a success message
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <div className="w-full max-w-md rounded-lg border-2 border-gray-300 px-4 py-8 shadow-lg">
          <h2 className="mb-4 text-center text-xl font-bold text-gray-900">
            Check Your Email
          </h2>
          <p className="mb-4 text-center text-gray-600">
            If an account exists with the email you entered, we`ve sent password
            reset instructions to your email address.
          </p>
          <div className="flex justify-center">
            <Link href="/signin">
              <Button style={{ backgroundColor: "#92e3a9", color: "#000000" }}>
                Return to Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="mt-10 mb-9 text-2xl font-extrabold">
        <h1>Reset Your Password</h1>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex h-full w-full max-w-md flex-col gap-6 rounded-lg border-2 border-gray-300 px-4 py-8 shadow-lg"
      >
        <div className="flex items-center gap-2">
          <MdEmail size={20} color="#92e3a9" />
          <div className="w-full">
            <div className="mb-2 block">
              <Label htmlFor="email">Your email</Label>
            </div>
            <TextInput
              id="email"
              type="email"
              placeholder="name@coursesphere.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              shadow
            />
          </div>
        </div>

        <Button
          type="submit"
          className="mt-4 font-medium"
          style={{ backgroundColor: "#92e3a9", color: "#000000" }}
        >
          Send Reset Instructions
        </Button>

        <Link
          className="text-center text-sm text-gray-600 hover:underline"
          href="/signin"
        >
          Back to Sign In
        </Link>
      </form>
    </div>
  );
}

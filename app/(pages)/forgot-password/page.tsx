"use client";

import { Button, Label, TextInput, Spinner, Alert } from "flowbite-react";
import { MdEmail, MdLock, MdVerifiedUser } from "react-icons/md";
import { HiInformationCircle } from "react-icons/hi";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send reset instructions");
      }

      setSuccess("Verification code sent to your email.");
      setStep(2);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpAndPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      setSuccess("Password reset successful!");
      // Redirect to sign in page after 2 seconds
      setTimeout(() => {
        router.push("/signin");
      }, 2000);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="mt-10 mb-9 text-2xl font-extrabold">
        <h1>Reset Your Password</h1>
      </div>

      {error && (
        <Alert color="failure" icon={HiInformationCircle} className="mb-4">
          <span className="font-medium">Error!</span> {error}
        </Alert>
      )}

      {success && (
        <Alert color="success" className="mb-4">
          <span className="font-medium">Success!</span> {success}
        </Alert>
      )}

      {step === 1 && (
        <form
          onSubmit={handleEmailSubmit}
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
                disabled={isLoading}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="mt-4 font-medium"
            style={{ backgroundColor: "#92e3a9", color: "#000000" }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Sending...
              </>
            ) : (
              "Send Verification Code"
            )}
          </Button>

          <Link
            className="text-center text-sm text-gray-600 hover:underline"
            href="/signin"
          >
            Back to Sign In
          </Link>
        </form>
      )}

      {step === 2 && (
        <form
          onSubmit={handleOtpAndPasswordSubmit}
          className="flex h-full w-full max-w-md flex-col gap-6 rounded-lg border-2 border-gray-300 px-4 py-8 shadow-lg"
        >
          <div className="flex items-center gap-2">
            <MdVerifiedUser size={20} color="#92e3a9" />
            <div className="w-full">
              <div className="mb-2 block">
                <Label htmlFor="otp">Verification Code</Label>
              </div>
              <TextInput
                id="otp"
                type="text"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                shadow
                disabled={isLoading}
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter the 6-digit code sent to {email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <MdLock size={20} color="#92e3a9" />
            <div className="w-full">
              <div className="mb-2 block">
                <Label htmlFor="newPassword">New Password</Label>
              </div>
              <TextInput
                id="newPassword"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                shadow
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <MdLock size={20} color="#92e3a9" />
            <div className="w-full">
              <div className="mb-2 block">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
              </div>
              <TextInput
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                shadow
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              color="light"
              className="mt-4 flex-1 font-medium"
              onClick={() => setStep(1)}
              disabled={isLoading}
            >
              Back
            </Button>
            <Button
              type="submit"
              className="mt-4 flex-1 font-medium"
              style={{ backgroundColor: "#92e3a9", color: "#000000" }}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

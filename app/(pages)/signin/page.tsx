"use client";

import { Button, Label, TextInput, Alert } from "flowbite-react";
import { MdEmail, MdLock, MdInfo } from "react-icons/md";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";

export default function Component() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Check for registration success message
  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setSuccess(
        "Registration successful! Please sign in with your credentials.",
      );
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        router.push("/student-dashboard");
      } else {
        setError(result.error || "Invalid email or password");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="mt-10 mb-9 text-2xl font-extrabold">
        <h1>Sign In to Access Your Account</h1>
      </div>

      {error && (
        <Alert color="failure" icon={MdInfo} className="mb-4">
          {error}
        </Alert>
      )}

      {success && (
        <Alert color="success" className="mb-4">
          {success}
        </Alert>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex h-full w-full max-w-md flex-col gap-6 rounded-lg border-2 border-gray-300 px-4 py-8 shadow-lg"
      >
        {/* Email */}
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
              value={formData.email}
              onChange={handleChange}
              required
              shadow
            />
          </div>
        </div>

        {/* Password */}
        <div className="flex items-center gap-2">
          <MdLock size={20} color="#92e3a9" />
          <div className="w-full">
            <div className="mb-2 block">
              <Label htmlFor="password">Your password</Label>
            </div>
            <TextInput
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              shadow
            />
          </div>
        </div>

        <div className="flex items-center justify-center">
          <Button
            type="submit"
            className="mt-4 font-medium"
            style={{ backgroundColor: "#92e3a9", color: "#000000" }}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </div>

        <Link
          className="mt-5 text-center font-medium underline"
          href="/forgot-password"
          style={{ color: "royalblue" }}
        >
          Forget Password?
        </Link>

        {/* Link to Sign up */}
        <p className="text-center text-xs text-gray-400">
          Don&apos;t have an account?{" "}
          <Link
            className="font-medium hover:underline"
            href="/signup"
            style={{ color: "royalblue" }}
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}

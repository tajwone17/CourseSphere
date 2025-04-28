"use client";

import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import { MdEmail, MdLock } from "react-icons/md";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";

export default function Component() {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Log in using the auth context
    login(formData.email);

    // (Optional) Handle Remember Me
    if (formData.rememberMe) {
      localStorage.setItem("rememberedEmail", formData.email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    // Navigate to dashboard
    router.push("/student-dashboard");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, type, checked, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="mt-10 mb-9 text-2xl font-extrabold">
        <h1>Sign In to Access Your Account</h1>
      </div>
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

        {/* Remember Me */}
        <div className="flex items-center gap-2 mb-0">
          <Checkbox
            id="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
          />
          <Label htmlFor="rememberMe" className="text-gray-600 text-sm">
            Remember Me
          </Label>
        </div>

        <div className="flex items-center justify-center">
          <Button
            type="submit"
            className=" font-medium w-full"
            style={{ backgroundColor: "#92e3a9", color: "#000000" }}
          >
            Sign In
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

"use client";

import { Button, Label, TextInput, Select, Checkbox } from "flowbite-react";
import {
  MdEmail,
  MdLock,
  MdSupervisorAccount,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { navigateAfterLogin } from "@/app/utils/auth-navigation";

export default function AdminLogin() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "hod",
    rememberMe: false,
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("Submitting login with:", {
        email: formData.email,
        password: "***", // Don't log passwords
        role: formData.role,
      });

      // Await the login function since it returns a promise
      const res = await login(formData.email, formData.password, formData.role);
      console.log("Login response:", res); // Handle the response
      if (res && res.success) {
        // Use the centralized navigation utility
        navigateAfterLogin(router, formData.role);
        console.log("Login successful");
      } else {
        // Display the error message from response
        setError(res?.error || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-900">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-gray-700 bg-gray-900 p-8 shadow-2xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Admin Portal
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Sign in to access your administrative panel
          </p>
        </div>{" "}
        {error && (
          <div className="mt-4 rounded-lg border border-red-400 bg-red-100 p-3 text-red-700">
            <p className="text-center">{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Role Selection */}
          <div className="space-y-2">
            <Label htmlFor="role" className="text-gray-300">
              Select Role
            </Label>
            <div className="flex items-center gap-2">
              <MdSupervisorAccount size={20} className="text-[#92e3a9]" />
              <Select
                id="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full rounded-lg border-gray-700 bg-gray-800 text-white focus:border-[#92e3a9] focus:ring-[#92e3a9]"
              >
                <option value="admin">Super Admin</option>
                <option value="advisor">Advisor</option>
                <option value="hod">Head of Department</option>
                <option value="exam_controller">Exam Controller Office</option>
                <option value="accounts_admin">Accounts Office</option>
              </Select>
            </div>
          </div>
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">
              Email Address
            </Label>
            <div className="flex items-center gap-2">
              <MdEmail size={20} className="text-[#92e3a9]" />
              <TextInput
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                required
                className="w-full rounded-lg border-gray-700 bg-gray-800 text-white focus:border-[#92e3a9] focus:ring-[#92e3a9]"
              />
            </div>
          </div>
          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300">
              Password
            </Label>
            <div className="relative flex items-center gap-2">
              <MdLock size={20} className="text-[#92e3a9]" />
              <TextInput
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full rounded-lg border-gray-700 bg-gray-800 text-white focus:border-[#92e3a9] focus:ring-[#92e3a9]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-gray-400 transition-colors hover:text-[#92e3a9]"
              >
                {showPassword ? (
                  <MdVisibilityOff size={20} />
                ) : (
                  <MdVisibility size={20} />
                )}
              </button>
            </div>
          </div>
          {/* Remember Me */}
          <div className="mb-3 flex items-center gap-2">
            <Checkbox
              id="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
            />
            <Label htmlFor="rememberMe" className="text-sm text-gray-600">
              Remember Me
            </Label>
          </div>{" "}
          <Button
            style={{
              backgroundColor: "#92e3a9",
              color: "#000000",
              width: "full",
              cursor: loading ? "wait" : "pointer",
            }}
            type="submit"
            disabled={loading}
            className="w-full bg-[#92e3a9] text-gray-900 transition-all duration-200 hover:bg-[#7ac892]"
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}

"use client";

import { Button, Label, TextInput, Select, Checkbox } from "flowbite-react";
import { MdEmail, MdLock, MdSupervisorAccount } from "react-icons/md";
// import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";

export default function AdminLogin() {
  const { login, user } = useAuth();
 
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "hod",
    rememberMe: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Store role and email in localStorage (temporary until backend is connected)
    // localStorage.setItem("adminRole", formData.role);
    // localStorage.setItem("adminEmail", formData.email);
    // localStorage.setItem("adminToken", "abcd");
    // Navigate based on role

    try {
      const res = login(formData.email, formData.password, formData.role);

      if (res.success) {
        user.role = formData.role;
      }
    } catch (error) {
      console.log("Login error:", error);
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
        </div>

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
                <option value="exam-controller">Exam Controller Office</option>
                <option value="accounts">Accounts Office</option>
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
            <div className="flex items-center gap-2">
              <MdLock size={20} className="text-[#92e3a9]" />
              <TextInput
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full rounded-lg border-gray-700 bg-gray-800 text-white focus:border-[#92e3a9] focus:ring-[#92e3a9]"
              />
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
          </div>
          <Button
            style={{
              backgroundColor: "#92e3a9",
              color: "#000000",

              width: "full",
              cursor: "pointer",
            }}
            type="submit"
            className="w-full bg-[#92e3a9] text-gray-900 transition-all duration-200 hover:bg-[#7ac892]"
          >
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}

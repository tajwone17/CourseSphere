"use client";

import {
  Button,
  Checkbox,
  Label,
  TextInput,
  Select,
  Alert,
} from "flowbite-react";
import {
  MdEmail,
  MdLock,
  MdLockOpen,
  MdPerson,
  MdSchool,
  MdPhone,
  MdInfo,
  MdCalendarToday,
} from "react-icons/md";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function Component() {
  const router = useRouter();
  const { register } = useAuth();
  const [departments, setDepartments] = useState<
    { id: number; department_name: string }[]
  >([]);

  const [formData, setFormData] = useState({
    name: "",
    registration_number: "",
    email: "",
    password: "",
    repeatPassword: "",
    department_id: "",
    mobile: "",
    agreeToTerms: false,
    session: "", // Add session field
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch departments list
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch("/api/departments");
        if (response.ok) {
          const data = await response.json();
          setDepartments(data.departments || []);
        }
      } catch (error) {
        console.error("Failed to fetch departments:", error);
        // Use sample departments as fallback
        setDepartments([
          { id: 1, department_name: "Computer Science Engineering" },
          { id: 2, department_name: "Electrical Engineering" },
          { id: 3, department_name: "Mechanical Engineering" },
        ]);
      }
    };

    fetchDepartments();
  }, []);

  // Generate session options (last 5 years with Fall/Spring options)
  const generateSessionOptions = () => {
    const currentYear = 2025; // Current year
    const sessions = [];

    for (let year = currentYear; year >= currentYear - 5; year--) {
      sessions.push(`Spring-${year}`);
      sessions.push(`Fall-${year - 1}`);
      sessions.push(`Summer-${year - 1}`);
    }

    return sessions;
  };

  const sessionOptions = generateSessionOptions();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target;
    setFormData((prev) => ({ ...prev, [id]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validate form data
    if (formData.password !== formData.repeatPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!formData.agreeToTerms) {
      setError("Please agree to the terms and conditions");
      setLoading(false);
      return;
    }

    if (!formData.session) {
      setError("Please select your session");
      setLoading(false);
      return;
    }

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        registration_number: formData.registration_number,
        department_id: parseInt(formData.department_id) || 1,
        mobile: formData.mobile,
        session: formData.session, // Include session in registration data
      });

      if (result.success) {
        router.push("/signin?registered=true");
      } else {
        setError(result.error || "Registration failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="mt-6 mb-6 text-2xl font-extrabold">
        <h1>Register Your Account</h1>
      </div>

      {error && (
        <Alert color="failure" icon={MdInfo} className="mb-4">
          {error}
        </Alert>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex h-full w-full max-w-md flex-col gap-6 rounded-lg border-2 border-gray-300 px-4 py-8 shadow-lg"
      >
        {/* Full Name */}
        <div className="flex items-center gap-2">
          <MdPerson size={20} color="#92e3a9" />
          <div className="w-full">
            <div className="mb-2 block">
              <Label htmlFor="name">Full Name</Label>
            </div>
            <TextInput
              id="name"
              type="text"
              placeholder="Your full name"
              value={formData.name}
              onChange={handleChange}
             
              shadow
            />
          </div>
        </div>

        {/* Registration ID */}
        <div className="flex items-center gap-2">
          <MdSchool size={20} color="#92e3a9" />
          <div className="w-full">
            <div className="mb-2 block">
              <Label htmlFor="registration_number">Registration ID</Label>
            </div>
            <TextInput
              id="registration_number"
              type="text"
              placeholder="Your registration ID"
              value={formData.registration_number}
              onChange={handleChange}
             
              shadow
            />
          </div>
        </div>

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
             
              shadow
            />
          </div>
        </div>

        {/* Session Selection - Add this new field */}
        <div className="flex items-center gap-2">
          <MdCalendarToday size={20} color="#92e3a9" />
          <div className="w-full">
            <div className="mb-2 block">
              <Label htmlFor="session">Academic Session</Label>
            </div>
            <Select
              id="session"
              value={formData.session}
              onChange={handleChange}
             
            >
              <option value="">Select your session</option>
              {sessionOptions.map((session) => (
                <option key={session} value={session}>
                  {session}
                </option>
              ))}
            </Select>
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
             
              shadow
            />
          </div>
        </div>

        {/* Repeat Password */}
        <div className="flex items-center gap-2">
          <MdLockOpen size={20} color="#92e3a9" />
          <div className="w-full">
            <div className="mb-2 block">
              <Label htmlFor="repeatPassword">Repeat password</Label>
            </div>
            <TextInput
              id="repeatPassword"
              type="password"
              placeholder="••••••••"
              value={formData.repeatPassword}
              onChange={handleChange}
             
              shadow
            />
          </div>
        </div>

        {/* Department */}
        <div className="flex items-center gap-2">
          <MdSchool size={20} color="#92e3a9" />
          <div className="w-full">
            <div className="mb-2 block">
              <Label htmlFor="department_id">Department</Label>
            </div>
            <Select
              id="department_id"
              value={formData.department_id}
              onChange={handleChange}
             
            >
              <option value="">Select your department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.department_name}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-2">
          <MdPhone size={20} color="#92e3a9" />
          <div className="w-full">
            <div className="mb-2 block">
              <Label htmlFor="mobile">Mobile Number</Label>
            </div>
            <TextInput
              id="mobile"
              type="text"
              placeholder="Your mobile number"
              value={formData.mobile}
              onChange={handleChange}
              shadow
            />
          </div>
        </div>

        {/* Checkbox for Terms and Conditions */}
        <div className="flex items-center gap-2">
          <Checkbox
            id="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleCheckboxChange}
          />
          <Label htmlFor="agreeToTerms" className="flex">
            I agree with the&nbsp;
            <Link
              href="#"
              className="text-cyan-600 hover:underline dark:text-cyan-500"
            >
              terms and conditions
            </Link>
          </Label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="mt-4 font-medium"
          style={{ backgroundColor: "#92e3a9", color: "#000000" }}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register new account"}
        </Button>

        {/* Link to Login */}
        <p className="text-center text-xs text-gray-400">
          Already have an account?{" "}
          <Link
            className="font-medium hover:underline"
            href="/signin"
            style={{ color: "royalblue" }}
          >
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}

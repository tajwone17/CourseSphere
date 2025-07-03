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

// import { useAuth } from "@/app/context/AuthContext";

// Define FieldErrors interface in the component file for clarity
interface FieldErrors {
  [key: string]: string | undefined;
}

// Helper function to silence unused variable warnings
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
const noop = (_: any) => {};

export default function Component() {
  const router = useRouter();
  // const { register } = useAuth();
  // Mock register function for demonstration purposes
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const register = async (userData: any) => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error };
      }

      return { success: true };
    } catch (error) {
      // Silence the lint warning
      noop(error);
      return { success: false, error: "An unexpected error occurred" };
    }
  };

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
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null);
  // Helper function to render field-specific errors with animation
  const renderFieldError = (error?: string, fieldId?: string) => {
    if (!error) return null;
    const errorId = fieldId ? `${fieldId}-error` : undefined;

    return (
      <div
        id={errorId}
        role="alert"
        aria-live="polite"
        className="mt-1 text-sm text-red-600 transition-all duration-300 ease-in-out"
        style={{
          opacity: error ? 1 : 0,
          height: error ? "auto" : 0,
          overflow: "hidden",
        }}
      >
        {error}
      </div>
    );
  };

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [depts, setDepts] = useState<any>([]);

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const res = await fetch("/api/departments", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        console.log(data.departments);
        setDepts(data.departments);
      } catch (error) {
        console.error("Failed to fetch departments:", error);
      }
    }

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
    const updatedFormData = { ...formData, [id]: value };
    setFormData(updatedFormData);

    // Check password match when either password or repeatPassword changes
    if (id === "password" || id === "repeatPassword") {
      const match =
        id === "password"
          ? value === formData.repeatPassword && value !== ""
          : formData.password === value && formData.password !== "";

      setPasswordsMatch(match);

      // Clear repeat password error if they match
      if (match && fieldErrors.repeatPassword) {
        setFieldErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.repeatPassword;
          return newErrors;
        });
      }
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target;
    setFormData((prev) => ({ ...prev, [id]: checked }));

    // Clear error for checkbox when changed
    if (fieldErrors[id]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };
  // Add focus handler to clear field errors
  const handleFocus = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { id } = e.target;

    if (fieldErrors[id]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }

    // If focusing on repeat password field, check match state
    if (
      id === "repeatPassword" &&
      formData.password &&
      formData.repeatPassword
    ) {
      setPasswordsMatch(formData.password === formData.repeatPassword);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setLoading(true);

    // Client-side validation with field-specific errors
    const localFieldErrors: FieldErrors = {};

    if (formData.password !== formData.repeatPassword) {
      localFieldErrors.repeatPassword = "Passwords do not match";
    }

    if (!formData.agreeToTerms) {
      localFieldErrors.agreeToTerms =
        "You must agree to the terms and conditions";
    }

    if (!formData.name) {
      localFieldErrors.name = "Name is required";
    }

    if (!formData.email) {
      localFieldErrors.email = "Email is required";
    }

    if (!formData.password) {
      localFieldErrors.password = "Password is required";
    }

    if (!formData.registration_number) {
      localFieldErrors.registration_number = "Registration number is required";
    }
    if (!formData.session) {
      localFieldErrors.session = "Session is required";
    }
    if (!formData.department_id) {
      localFieldErrors.department_id = "Department is required";
    }

    if (!formData.mobile) {
      localFieldErrors.mobile = "Mobile number is required";
    }
    // If there are client-side validation errors, don't submit
    if (Object.keys(localFieldErrors).length > 0) {
      setFieldErrors(localFieldErrors);
      setLoading(false);

      // Scroll to the first field with an error after a small delay to allow the DOM to update
      setTimeout(() => {
        const firstErrorField = Object.keys(localFieldErrors)[0];
        const firstErrorElement = document.getElementById(firstErrorField);
        if (firstErrorElement) {
          firstErrorElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          firstErrorElement.focus();
        }
      }, 100);

      return;
    }

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        registration_number: formData.registration_number,
        department_id: parseInt(formData.department_id) || 1,
        mobile: formData.mobile,
        session: formData.session, // Include session in registration data
      };

      const result = await register(userData);

      if (result.success) {
        router.push("/signin?registered=true");
      } else {
        // Handle both general error and field-specific errors
        // Always reset field errors first to ensure we start fresh
        // const newFieldErrors = result.fieldErrors || {};
        const newFieldErrors: FieldErrors = {};

        // Show field-specific errors
        if (Object.keys(newFieldErrors).length > 0) {
          setFieldErrors(newFieldErrors);

          // If we have field errors, don't show the general error at the top
          if (
            result.error &&
            result.error !== "Please fix the following errors" &&
            result.error !== "Account already exists"
          ) {
            setError(result.error);
          } else {
            setError(null);
          }

          // Scroll to the first field with an error after a small delay to allow the DOM to update
          setTimeout(() => {
            const firstErrorField = Object.keys(newFieldErrors)[0];
            const firstErrorElement = document.getElementById(firstErrorField);
            if (firstErrorElement) {
              firstErrorElement.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
              firstErrorElement.focus();
            }
          }, 100);
        } else {
          // If no field errors, show general error
          setError(result.error || "Registration failed");
        }
      }
    } catch (error) {
      // Silence the lint warning
      noop(error);

      // Error is handled with user-friendly message
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="mt-6 mb-6 text-2xl font-extrabold">
        <h1>Register Your Account</h1>
      </div>
      {error && Object.keys(fieldErrors).length === 0 && (
        <Alert
          color="failure"
          icon={MdInfo}
          className="mb-4"
          role="alert"
          aria-live="assertive"
        >
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
              onFocus={handleFocus}
              color={fieldErrors.name ? "failure" : undefined}
              shadow
              aria-describedby={fieldErrors.name ? "name-error" : undefined}
              aria-invalid={fieldErrors.name ? "true" : "false"}
            />
            {renderFieldError(fieldErrors.name, "name")}
          </div>
        </div>{" "}
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
              onFocus={handleFocus}
              color={fieldErrors.registration_number ? "failure" : undefined}
              shadow
              aria-describedby={
                fieldErrors.registration_number
                  ? "registration_number-error"
                  : undefined
              }
              aria-invalid={fieldErrors.registration_number ? "true" : "false"}
            />
            {renderFieldError(
              fieldErrors.registration_number,
              "registration_number",
            )}
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
              onFocus={handleFocus}
              color={fieldErrors.email ? "failure" : undefined}
              shadow
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
              aria-invalid={fieldErrors.email ? "true" : "false"}
            />
            {renderFieldError(fieldErrors.email, "email")}
          </div>
        </div>{" "}
        {/* Session Selection */}
        <div className="flex items-center gap-2">
          <MdCalendarToday size={20} color="#92e3a9" />
          <div className="w-full">
            <div className="mb-2 block">
              <Label htmlFor="session">Academic Session</Label>
              <span className="ml-2 text-xs text-gray-400">
                (e.g., Spring-2025, Fall-2024)
              </span>
            </div>
            <Select
              id="session"
              value={formData.session}
              onChange={handleChange}
              onFocus={handleFocus}
              color={fieldErrors.session ? "failure" : undefined}
              aria-describedby={
                fieldErrors.session ? "session-error" : undefined
              }
              aria-invalid={fieldErrors.session ? "true" : "false"}
            >
              <option value="">Select your session</option>
              {sessionOptions.map((session) => (
                <option key={session} value={session}>
                  {session}
                </option>
              ))}
            </Select>
            {renderFieldError(fieldErrors.session, "session")}
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
              onFocus={handleFocus}
              color={fieldErrors.password ? "failure" : undefined}
              shadow
              aria-describedby={
                fieldErrors.password ? "password-error" : undefined
              }
              aria-invalid={fieldErrors.password ? "true" : "false"}
            />
            <div className="mt-1 text-xs text-gray-500">
              Password must include at least 8 characters with uppercase,
              lowercase, numbers, and special characters
            </div>
            {renderFieldError(fieldErrors.password, "password")}
          </div>
        </div>{" "}
        {/* Repeat Password */}
        <div className="flex items-center gap-2">
          <MdLockOpen size={20} color="#92e3a9" />
          <div className="w-full">
            <div className="mb-2 block">
              <Label htmlFor="repeatPassword">Repeat password</Label>
            </div>
            <div className="relative">
              <TextInput
                id="repeatPassword"
                type="password"
                placeholder="••••••••"
                value={formData.repeatPassword}
                onChange={handleChange}
                onFocus={handleFocus}
                color={
                  fieldErrors.repeatPassword
                    ? "failure"
                    : passwordsMatch === true
                      ? "success"
                      : undefined
                }
                shadow
                aria-describedby={
                  fieldErrors.repeatPassword
                    ? "repeatPassword-error"
                    : undefined
                }
                aria-invalid={fieldErrors.repeatPassword ? "true" : "false"}
              />
              {passwordsMatch === true && formData.repeatPassword && (
                <div
                  className="absolute top-3 right-3 text-green-500"
                  aria-hidden="true"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
            {renderFieldError(fieldErrors.repeatPassword, "repeatPassword")}
            {!fieldErrors.repeatPassword &&
              passwordsMatch === true &&
              formData.repeatPassword && (
                <div className="mt-1 text-sm text-green-600">
                  Passwords match
                </div>
              )}
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
              onFocus={handleFocus}
              color={fieldErrors.department_id ? "failure" : undefined}
              aria-describedby={
                fieldErrors.department_id ? "department_id-error" : undefined
              }
              aria-invalid={fieldErrors.department_id ? "true" : "false"}
            >
              <option value="">Select your department</option>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {depts.map((dept: any) => (
                <option key={dept.ID} value={dept.ID}>
                  {dept.DEPARTMENT_NAME}
                </option>
              ))}
            </Select>
            {renderFieldError(fieldErrors.department_id, "department_id")}
          </div>
        </div>{" "}
        {/* Mobile */}
        <div className="flex items-center gap-2">
          <MdPhone size={20} color="#92e3a9" />
          <div className="w-full">
            {" "}
            <div className="mb-2 block">
              <Label htmlFor="mobile">Mobile Number</Label>
            </div>
            <TextInput
              id="mobile"
              type="text"
              placeholder="Your mobile number"
              value={formData.mobile}
              onChange={handleChange}
              onFocus={handleFocus}
              color={fieldErrors.mobile ? "failure" : undefined}
              shadow
              aria-describedby={fieldErrors.mobile ? "mobile-error" : undefined}
              aria-invalid={fieldErrors.mobile ? "true" : "false"}
            />{" "}
            {renderFieldError(fieldErrors.mobile, "mobile")}
          </div>
        </div>
        {/* Checkbox for Terms and Conditions */}
        <div className="flex items-center gap-2">
          {" "}
          <Checkbox
            id="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleCheckboxChange}
            color={fieldErrors.agreeToTerms ? "failure" : undefined}
            aria-describedby={
              fieldErrors.agreeToTerms ? "agreeToTerms-error" : undefined
            }
            aria-invalid={fieldErrors.agreeToTerms ? "true" : "false"}
          />
          <Label htmlFor="agreeToTerms" className="flex">
            I agree with the&nbsp;
            <Link
              href="/terms"
              className="text-cyan-600 hover:underline dark:text-cyan-500"
            >
              terms and conditions
            </Link>
          </Label>
          {renderFieldError(fieldErrors.agreeToTerms, "agreeToTerms")}
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

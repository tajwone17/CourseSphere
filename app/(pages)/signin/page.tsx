import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import {
  MdEmail,
  MdLock,
  MdLockOpen,
  MdPerson,
  MdSchool,
  MdPhone,
} from "react-icons/md"; // Icon imports
import Link from "next/link";

export default function Component() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="mt-6 mb-6 text-2xl font-extrabold">
        <h1>Register Your Account</h1>
      </div>
      <form className="flex h-full w-full max-w-md flex-col gap-6 rounded-lg border-2 border-gray-300 px-4 py-8 shadow-lg">
        {/* Full Name */}
        <div className="flex items-center gap-2">
          <MdPerson size={20} color="#92e3a9" />
          <div className="w-full">
            <div className="mb-2 block">
              <Label htmlFor="full-name">Full Name</Label>
            </div>
            <TextInput
              id="full-name"
              type="text"
              placeholder="Your full name"
              required
              shadow
            />
          </div>
        </div>

        {/* Registration ID */}
        <div className="flex items-center gap-2">
          <MdSchool size={20} color="#92e3a9" />
          <div className="w-full">
            <div className="mb-2 block">
              <Label htmlFor="registration-id">Registration ID</Label>
            </div>
            <TextInput
              id="registration-id"
              type="text"
              placeholder="Your registration ID"
              required
              shadow
            />
          </div>
        </div>

        {/* Email */}
        <div className="flex items-center gap-2">
          <MdEmail size={20} color="#92e3a9" />
          <div className="w-full">
            <div className="mb-2 block">
              <Label htmlFor="email2">Your email</Label>
            </div>
            <TextInput
              id="email2"
              type="email"
              placeholder="name@flowbite.com"
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
              <Label htmlFor="password2">Your password</Label>
            </div>
            <TextInput
              placeholder="............"
              id="password2"
              type="password"
              required
              shadow
            />
          </div>
        </div>

        {/* Repeat Password */}
        <div className="flex items-center gap-2">
          <MdLockOpen size={20} color="#92e3a9" />
          <div className="w-full">
            <div className="mb-2 block">
              <Label htmlFor="repeat-password">Repeat password</Label>
            </div>
            <TextInput
              placeholder="............"
              id="repeat-password"
              type="password"
              required
              shadow
            />
          </div>
        </div>

        {/* Department */}
        <div className="flex items-center gap-2">
          <MdSchool size={20} color="#92e3a9" />
          <div className="w-full">
            <div className="mb-2 block">
              <Label htmlFor="department">Department</Label>
            </div>
            <TextInput
              id="department"
              type="text"
              placeholder="Your department"
              required
              shadow
            />
          </div>
        </div>

        {/* Waiver (Percentage) */}
        <div className="flex items-center gap-2">
          <MdLock size={20} color="#92e3a9" />
          <div className="flex w-full items-center gap-1">
            <div className="w-full">
              <div className="mb-2 block">
                <Label htmlFor="waiver">Waiver</Label>
              </div>
              <TextInput
                id="waiver"
                type="number"
                placeholder="Enter percentage (e.g., 10)"
                required
                shadow
              />
            </div>
            <span className="mt-6 text-gray-500">%</span>{" "}
            {/* Percentage symbol */}
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
              required
              shadow
            />
          </div>
        </div>

        {/* Checkbox for Terms and Conditions */}
        <div className="flex items-center gap-2">
          <Checkbox id="agree" />
          <Label htmlFor="agree" className="flex">
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
        >
          Register new account
        </Button>

        {/* Link to Login */}
        <p className="text-center text-xs text-gray-400">
          Already have an account?{" "}
          <Link
            className="font-medium"
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

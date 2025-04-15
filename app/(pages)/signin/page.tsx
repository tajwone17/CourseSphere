import { Button, Label, TextInput } from "flowbite-react";
import { MdEmail, MdLock } from "react-icons/md"; // Icon imports
import Link from "next/link";

export default function Component() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="mt-10 mb-9 text-2xl font-extrabold">
        <h1>Sign In to Access Your Account</h1>
      </div>
      <form className="flex h-full w-full max-w-md flex-col gap-6 rounded-lg border-2 border-gray-300 px-4 py-8 shadow-lg">
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

        {/* Submit Button */}
        <Button
          type="submit"
          className="mt-4 font-medium"
          style={{ backgroundColor: "#92e3a9", color: "#000000" }}
        >
          Log In
        </Button>

        {/* Link to Login */}
        <p className="text-center text-xs text-gray-400">
          Don`t have an account?{" "}
          <Link
            className="font-medium"
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

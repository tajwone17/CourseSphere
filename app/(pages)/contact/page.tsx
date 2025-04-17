"use client";

import { Button, Label, Textarea, TextInput } from "flowbite-react";
import { MdContactMail } from "react-icons/md";
import Link from "next/link";

export default function Component() {
  return (
    <div className="flex h-screen items-center justify-center overflow-hidden">
      <div
        className="flex w-full max-w-4xl flex-col items-center rounded-lg border-2 border-white p-8"
        data-aos="zoom-in"
      >
        <div className="mb-6 flex items-center gap-2">
          <MdContactMail size={30} color="#92e3a9" />
          <h1 className="text-3xl font-extrabold">Contact</h1>
        </div>
        <form action="#" className="w-full max-w-3xl">
          <div className="mb-6">
            <Label htmlFor="email" className="mb-2 block">
              Your email
            </Label>
            <TextInput
              id="email"
              name="email"
              placeholder="name@company.com"
              type="email"
            />
          </div>
          <div className="mb-6">
            <Label htmlFor="subject" className="mb-2 block">
              Subject
            </Label>
            <TextInput
              id="subject"
              name="subject"
              placeholder="Let us know how we can help you"
            />
          </div>
          <div className="mb-6">
            <Label htmlFor="message" className="mb-2 block">
              Your message
            </Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Your message..."
              rows={4}
            />
          </div>
          <div className="mb-6">
            <Button
              style={{
                backgroundColor: "#92e3a9",
                color: "#000000",
                marginTop: "20px",
              }}
              type="submit"
              className="w-full"
            >
              Send message
            </Button>
          </div>
          <p className="mb-2 text-center text-sm text-gray-500 dark:text-gray-400">
            <Link href="mailto:info@company.com" className="hover:underline">
              North East University Bangladesh
            </Link>
          </p>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            <Link href="tel:2124567890" className="hover:underline">
              212-456-7890
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

"use client";

import { Button, Label, Textarea, TextInput } from "flowbite-react";
import { MdContactMail, MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import Link from "next/link";

export default function Component() {
  return (
    <div className="flex min-h-screen items-center justify-center overflow-hidden px-4 py-16">
      <div
        className="w-full max-w-4xl rounded-lg border-2 border-gray-800 bg-gray-900 p-8 shadow-xl"
        data-aos="zoom-in"
        data-aos-duration="1000"
      >
        <div className="mb-10 text-center">
          <div className="mb-6 flex items-center justify-center gap-2">
            <MdContactMail size={40} className="text-[#92e3a9]" />
            <h1 className="text-3xl font-extrabold tracking-tight text-white lg:text-5xl">
              Contact Us
         
            </h1>
          </div>
          <p className="mx-auto max-w-3xl text-lg text-gray-400">
            Have questions about course registration? We`re here to help!
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <form
            className="space-y-6"
            data-aos="fade-right"
            data-aos-delay="200"
          >
            <div>
              <Label htmlFor="email" className="mb-2 block text-white">
                Your Email
              </Label>
              <TextInput
                id="email"
                type="email"
                placeholder="name@university.edu"
                required
                icon={MdEmail}
              />
            </div>

            <div>
              <Label htmlFor="subject" className="mb-2 block text-white">
                Subject
              </Label>
              <TextInput
                id="subject"
                placeholder="How can we help you?"
                required
              />
            </div>

            <div>
              <Label htmlFor="message" className="mb-2 block text-white">
                Message
              </Label>
              <Textarea
                id="message"
                placeholder="Your message..."
                required
                rows={4}
              />
            </div>

            <Button
              type="submit"
              style={{
                backgroundColor: "#92e3a9",
                color: "#000000",
              }}
              className="w-full transition-transform hover:scale-105"
            >
              Send Message
            </Button>
          </form>

          <div className="space-y-6" data-aos="fade-left" data-aos-delay="400">
            <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
              <h2 className="mb-4 text-xl font-semibold text-white">
                Contact Information
              </h2>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MdLocationOn className="h-6 w-6 text-[#92e3a9]" />
                  <div>
                    <p className="font-medium text-white">Address</p>
                    <p className="text-gray-400">
                      North East University Bangladesh
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MdPhone className="h-6 w-6 text-[#92e3a9]" />
                  <div>
                    <p className="font-medium text-white">Phone</p>
                    <Link
                      href="tel:2124567890"
                      className="text-gray-400 hover:text-[#92e3a9]"
                    >
                      +880 2124567890
                    </Link>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MdEmail className="h-6 w-6 text-[#92e3a9]" />
                  <div>
                    <p className="font-medium text-white">Email</p>
                    <Link
                      href="mailto:info@neub.edu.bd"
                      className="text-gray-400 hover:text-[#92e3a9]"
                    >
                      info@neub.edu.bd
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
              <h2 className="mb-4 text-xl font-semibold text-white">
                Office Hours
              </h2>
              <div className="space-y-2 text-gray-400">
                <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
                <p>Saturday: 9:00 AM - 1:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { Button } from "flowbite-react";
import { MdArrowBack, MdGavel, MdSecurity, MdSchool } from "react-icons/md";

export default function TermsAndConditions() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/signup">
            <Button color="gray" size="sm" className="mb-4">
              <MdArrowBack className="mr-2 h-4 w-4" />
              Back to Registration
            </Button>
          </Link>

          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <MdGavel size={48} className="text-[#92e3a9]" />
            </div>
            <h1 className="mb-2 text-4xl font-bold text-white">
              Terms and Conditions
            </h1>
            <p className="text-lg text-gray-300">
              CourSphere Academic Management System
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Last updated: {currentDate}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="rounded-lg border border-gray-700 bg-gray-800 p-8 shadow-lg">
          <div className="prose max-w-none">
            {/* Introduction */}
            <section className="mb-8">
              <h2 className="mb-4 flex items-center text-2xl font-semibold text-white">
                <MdSchool className="mr-2 text-[#92e3a9]" />
                1. Introduction and Acceptance
              </h2>
              <p className="mb-4 leading-relaxed text-gray-300">
                Welcome to CourSphere, an academic management system designed to
                facilitate course registration, academic administration, and
                student services. By accessing or using our platform, you agree
                to be bound by these Terms and Conditions (&quot;Terms&quot;).
                If you do not agree to these Terms, please do not use our
                service.
              </p>
              <p className="leading-relaxed text-gray-300">
                These Terms constitute a legally binding agreement between you
                and CourSphere. We reserve the right to modify these Terms at
                any time, and such modifications will be effective immediately
                upon posting on our platform.
              </p>
            </section>

            {/* Definitions */}
            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold text-white">
                2. Definitions
              </h2>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <strong>&quot;Platform&quot;</strong> refers to the CourSphere
                  academic management system
                </li>
                <li>
                  <strong>&quot;User&quot;</strong> refers to any individual
                  accessing the platform (students, faculty, administrators)
                </li>
                <li>
                  <strong>&quot;Student&quot;</strong> refers to enrolled
                  students using the platform for academic purposes
                </li>
                <li>
                  <strong>&quot;Institution&quot;</strong> refers to the
                  educational institution implementing CourSphere
                </li>
                <li>
                  <strong>&quot;Services&quot;</strong> refers to all features
                  and functionalities provided by CourSphere
                </li>
              </ul>
            </section>

            {/* User Accounts and Registration */}
            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold text-white">
                3. User Accounts and Registration
              </h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  <strong>3.1 Account Creation:</strong> You must provide
                  accurate, complete, and current information during
                  registration. You are responsible for maintaining the
                  confidentiality of your account credentials.
                </p>

                <p>
                  <strong>3.2 Eligibility:</strong> Use of CourSphere is
                  restricted to:
                </p>
                <ul className="ml-6 list-disc space-y-1">
                  <li>Currently enrolled students of the institution</li>
                  <li>Authorized faculty and staff members</li>
                  <li>Approved administrative personnel</li>
                </ul>

                <p>
                  <strong>3.3 Account Security:</strong> You are solely
                  responsible for all activities that occur under your account.
                  Notify us immediately of any unauthorized use of your account.
                </p>

                <p>
                  <strong>3.4 Account Termination:</strong> We reserve the right
                  to suspend or terminate accounts that violate these Terms or
                  pose security risks.
                </p>
              </div>
            </section>

            {/* Acceptable Use Policy */}
            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold text-white">
                4. Acceptable Use Policy
              </h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  You agree to use CourSphere only for legitimate academic and
                  administrative purposes. Prohibited activities include:
                </p>

                <ul className="ml-6 list-disc space-y-2">
                  <li>
                    Attempting to gain unauthorized access to any part of the
                    system
                  </li>
                  <li>
                    Interfering with or disrupting the platform&apos;s
                    functionality
                  </li>
                  <li>
                    Using the platform for any illegal or fraudulent activities
                  </li>
                  <li>
                    Sharing your account credentials with unauthorized
                    individuals
                  </li>
                  <li>Attempting to reverse engineer or extract source code</li>
                  <li>Submitting false or misleading information</li>
                  <li>Harassing, threatening, or intimidating other users</li>
                  <li>
                    Violating any applicable laws or institutional policies
                  </li>
                </ul>
              </div>
            </section>

            {/* Academic Integrity */}
            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold text-white">
                5. Academic Integrity
              </h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  <strong>5.1 Honest Use:</strong> All information submitted
                  through CourSphere must be accurate and truthful. Academic
                  dishonesty, including but not limited to falsifying records or
                  unauthorized collaboration, is strictly prohibited.
                </p>

                <p>
                  <strong>5.2 Course Registration:</strong> Students are
                  responsible for ensuring they meet all prerequisites and
                  requirements for courses they register for through the
                  platform.
                </p>

                <p>
                  <strong>5.3 Compliance:</strong> Users must comply with all
                  institutional academic policies and honor codes while using
                  CourSphere.
                </p>
              </div>
            </section>

            {/* Privacy and Data Protection */}
            <section className="mb-8">
              <h2 className="mb-4 flex items-center text-2xl font-semibold text-white">
                <MdSecurity className="mr-2 text-[#92e3a9]" />
                6. Privacy and Data Protection
              </h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  <strong>6.1 Data Collection:</strong> We collect and process
                  personal information necessary for academic administration,
                  including but not limited to:
                </p>
                <ul className="ml-6 list-disc space-y-1">
                  <li>Student identification and contact information</li>
                  <li>Academic records and course enrollment data</li>
                  <li>Authentication and usage logs</li>
                  <li>Communication records within the platform</li>
                </ul>

                <p>
                  <strong>6.2 Data Use:</strong> Your data is used solely for
                  legitimate educational purposes, including course management,
                  academic advising, and institutional reporting.
                </p>

                <p>
                  <strong>6.3 Data Security:</strong> We implement appropriate
                  technical and organizational measures to protect your personal
                  information against unauthorized access, alteration,
                  disclosure, or destruction.
                </p>

                <p>
                  <strong>6.4 Data Sharing:</strong> We do not sell or share
                  your personal information with third parties except as
                  required by law or with your explicit consent.
                </p>
              </div>
            </section>

            {/* System Availability and Maintenance */}
            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold text-white">
                7. System Availability and Maintenance
              </h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  <strong>7.1 Service Availability:</strong> While we strive to
                  maintain continuous availability, CourSphere may experience
                  downtime for maintenance, updates, or unforeseen technical
                  issues.
                </p>

                <p>
                  <strong>7.2 Planned Maintenance:</strong> We will provide
                  reasonable notice for scheduled maintenance that may affect
                  system availability.
                </p>

                <p>
                  <strong>7.3 No Guarantee:</strong> We do not guarantee
                  uninterrupted or error-free operation of the platform.
                </p>
              </div>
            </section>

            {/* Intellectual Property */}
            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold text-white">
                8. Intellectual Property Rights
              </h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  <strong>8.1 Platform Rights:</strong> CourSphere and all its
                  components, including software, design, and content, are
                  protected by intellectual property laws and remain the
                  property of their respective owners.
                </p>

                <p>
                  <strong>8.2 User Content:</strong> You retain ownership of any
                  content you submit to the platform, but grant us a license to
                  use such content for providing our services.
                </p>

                <p>
                  <strong>8.3 Restrictions:</strong> You may not copy, modify,
                  distribute, or create derivative works based on CourSphere
                  without explicit written permission.
                </p>
              </div>
            </section>

            {/* Disclaimers and Limitations */}
            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold text-white">
                9. Disclaimers and Limitation of Liability
              </h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  <strong>9.1 &quot;As Is&quot; Basis:</strong> CourSphere is
                  provided on an &quot;as is&quot; and &quot;as available&quot;
                  basis without warranties of any kind, either express or
                  implied.
                </p>

                <p>
                  <strong>9.2 Limitation of Liability:</strong> To the maximum
                  extent permitted by law, we shall not be liable for any
                  indirect, incidental, special, consequential, or punitive
                  damages arising from your use of CourSphere.
                </p>

                <p>
                  <strong>9.3 Data Loss:</strong> While we implement backup
                  procedures, we are not responsible for any data loss that may
                  occur. Users are encouraged to maintain their own records.
                </p>
              </div>
            </section>

            {/* Indemnification */}
            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold text-white">
                10. Indemnification
              </h2>
              <p className="leading-relaxed text-gray-300">
                You agree to indemnify, defend, and hold harmless CourSphere and
                its affiliates from and against any claims, damages, losses,
                costs, and expenses (including reasonable attorney fees) arising
                from your use of the platform, violation of these Terms, or
                infringement of any third-party rights.
              </p>
            </section>

            {/* Governing Law */}
            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold text-white">
                11. Governing Law and Dispute Resolution
              </h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  <strong>11.1 Governing Law:</strong> These Terms shall be
                  governed by and construed in accordance with the laws of the
                  jurisdiction where the institution is located.
                </p>

                <p>
                  <strong>11.2 Dispute Resolution:</strong> Any disputes arising
                  from these Terms or your use of CourSphere shall be resolved
                  through binding arbitration or in the appropriate courts of
                  the institution&apos;s jurisdiction.
                </p>
              </div>
            </section>

            {/* Changes to Terms */}
            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold text-white">
                12. Changes to These Terms
              </h2>
              <p className="leading-relaxed text-gray-300">
                We reserve the right to modify these Terms at any time. Material
                changes will be communicated through the platform or via email.
                Your continued use of CourSphere after such modifications
                constitutes acceptance of the updated Terms.
              </p>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold text-white">
                13. Contact Information
              </h2>
              <div className="rounded-lg border border-gray-600 bg-gray-700 p-6">
                <p className="mb-4 text-gray-300">
                  If you have any questions about these Terms and Conditions,
                  please contact us:
                </p>
                <div className="space-y-2 text-gray-300">
                  <p>
                    <strong>Email:</strong> support@coursesphere.edu
                  </p>
                  <p>
                    <strong>Phone:</strong> +1 (555) 123-4567
                  </p>
                  <p>
                    <strong>Address:</strong> CourSphere Support Team
                    <br />
                    123 Academic Way
                    <br />
                    University Campus
                    <br />
                    City, State 12345
                  </p>
                </div>
              </div>
            </section>

            {/* Acknowledgment */}
            <section className="mb-8">
              <div className="bg-opacity-10 rounded-lg border border-[#92e3a9] bg-[#92e3a9] p-6">
                <h3 className="mb-3 text-lg font-semibold text-black">
                  Acknowledgment
                </h3>
                <p className="text-black">
                  By clicking &quot;I agree&quot; during registration or by
                  using CourSphere, you acknowledge that you have read,
                  understood, and agree to be bound by these Terms and
                  Conditions. You also confirm that you are authorized to access
                  and use the platform according to your designated role within
                  the institution.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

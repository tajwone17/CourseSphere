"use client";

import { useState, useEffect } from "react";
import { Button, Checkbox, Label } from "flowbite-react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { HiArrowLeft, HiCheck, HiX, HiAcademicCap } from "react-icons/hi";
import Link from "next/link";

interface CourseRegistration {
  ID: number;
  BUNDLE_ID: number;
  COURSE_ID: number;
  ADVISOR_ID: number | null;
  STATUS: string;
  ADVISOR_COMMENT: string | null;
  course_code: string;
  course_title: string;
  course_credit: number;
  instructor: string;
  advisor_name: string | null;
  advisor_email: string | null;
}

// interface Advisor {
//   ID: number;
//   NAME: string;
//   EMAIL: string;
// }

interface RegistrationBundle {
  ID: number;
  STUDENT_ID: number;
  SEMESTER: string;
  STATUS: string;
  HOD_APPROVAL: number;
  ADVISOR_APPROVAL: number;
  ACCOUNTS_ADMIN_APPROVAL: number;
  SUBMITTED_AT: string;
  PAYMENT_STATUS: string;
  TOTAL_AMOUNT: number;
  student_name: string;
  student_email: string;
  REGISTRATION_NUMBER: string;
  student_mobile: string;
  department_id: number;
  DEPARTMENT_NAME: string;
}

export default function RegistrationReviewPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const [bundle, setBundle] = useState<RegistrationBundle | null>(null);
  const [courses, setCourses] = useState<CourseRegistration[]>([]);
  // const [advisors, setAdvisors] = useState<Advisor[]>([]);

  // Form state
  const [approvalStatus, setApprovalStatus] = useState<boolean | null>(null);
  // const [advisorId, setAdvisorId] = useState<number | null>(null);
  const [coursesApproval, setCoursesApproval] = useState<{
    [key: number]: { approved: boolean };
  }>({});
  const [advisorComment, setAdvisorComment] = useState<string>("");
  const [totalAmount, setTotalAmount] = useState<string>("");

  // Fee adjustment state
  const [baseAmount, setBaseAmount] = useState<number>(0);
  const [waiverPercent, setWaiverPercent] = useState<string>("0");
  const [delayFine, setDelayFine] = useState<string>("0");
  const [libraryFee, setLibraryFee] = useState<string>("0");

  useEffect(() => {
    if (typeof window !== "undefined" && user && user.role) {
      setUserRole(user.role);
    }
  }, [user]);

  useEffect(() => {
    const fetchRegistrationDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/registration/bundle/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch registration details");
        }

        const data = await response.json();

        if (data.success) {
          setBundle(data.bundle);
          setCourses(data.courses);
          // setAdvisors(data.advisors);

          // Initialize course approvals
          const initialCoursesApproval: {
            [key: number]: { approved: boolean };
          } = {};
          data.courses.forEach((course: CourseRegistration) => {
            initialCoursesApproval[course.COURSE_ID] = {
              approved: course.STATUS === "APPROVED",
            };
          });
          setCoursesApproval(initialCoursesApproval);

          // Set total amount
          const total = Number(data.bundle.TOTAL_AMOUNT) || 0;
          setTotalAmount(total.toString());
          setBaseAmount(total);
        } else {
          throw new Error(data.error || "Failed to load registration details");
        }
      } catch (err) {
        console.error("Error fetching registration details:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrationDetails();
  }, [id]);

  const handleCourseApprovalChange = (courseId: number, approved: boolean) => {
    setCoursesApproval((prev) => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        approved,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bundle || !userRole) return;

    setProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      let endpoint = "";
      // eslint-disable-next-line
      let payload: any = {
        bundleId: bundle.ID,
      };

      // Validation checks
      if (approvalStatus === null) {
        throw new Error("Please select either Approve or Reject");
      }

      if (userRole === "accounts_admin" && approvalStatus === true) {
        const amount = parseFloat(totalAmount);
        if (isNaN(amount) || amount <= 0) {
          throw new Error(
            "Total amount must be greater than zero for approval",
          );
        }
      }

      // Format course approvals as array
      const courseApprovals = Object.keys(coursesApproval).map((courseId) => ({
        courseId: parseInt(courseId),
        approved: coursesApproval[parseInt(courseId)].approved,
      }));

      // Different payloads based on user role
      if (userRole === "advisor") {
        endpoint = "/api/registration/advisor-approval";
        payload = {
          ...payload,
          advisorId: user?.id,
          approved: approvalStatus,
          courseApprovals,
          advisorComment,
        };
      } else if (userRole === "hod") {
        endpoint = "/api/registration/hod-approval";
        payload = {
          ...payload,
          hodId: user?.id,
          approved: approvalStatus,
        };
      } else if (userRole === "accounts_admin") {
        endpoint = "/api/registration/accounts-approval";
        payload = {
          ...payload,
          accountsAdminId: user?.id,
          approved: approvalStatus,
          totalAmount: totalAmount ? Math.round(parseFloat(totalAmount)) : null,
        };
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process approval");
      }

      setSuccess(data.message || "Registration successfully processed");

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/dashboard/student-management");
      }, 2000);
    } catch (err) {
      console.error("Error processing approval:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate total amount based on adjustments
  useEffect(() => {
    if (userRole === "accounts_admin") {
      // Parse values, defaulting to 0 if invalid
      const waiverPercentValue = parseFloat(waiverPercent) || 0;
      const delayFineAmount = parseFloat(delayFine) || 0;
      const libraryFeeAmount = parseFloat(libraryFee) || 0;

      // Calculate waiver amount based on percentage
      const waiverAmount = Math.round((baseAmount * waiverPercentValue) / 100);

      // Calculate new total
      const newTotal = Math.round(
        baseAmount - waiverAmount + delayFineAmount + libraryFeeAmount,
      );

      // Ensure total is not negative
      const finalTotal = Math.max(0, newTotal);

      // Convert to integer and set as string
      setTotalAmount(Math.round(finalTotal).toString());
    }
  }, [baseAmount, waiverPercent, delayFine, libraryFee, userRole]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-[#92e3a9]"></div>
          <h2 className="text-xl font-semibold text-white">
            Loading Registration Details
          </h2>
          <p className="mt-2 text-gray-400">
            Please wait while we fetch the registration information...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl py-10">
        <div className="rounded-lg border border-red-500 bg-red-900/20 p-6 text-center">
          <h1 className="mb-4 text-2xl font-bold text-red-400">Error</h1>
          <p className="mb-4 text-red-300">{error}</p>
          <Link href="/dashboard/student-management">
            <Button color="gray" className="mt-4 !bg-gray-700">
              <HiArrowLeft className="mr-2" /> Back to List
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!bundle) {
    return (
      <div className="mx-auto max-w-4xl py-10">
        <div className="rounded-lg border border-gray-700 bg-gray-800 p-6 text-center">
          <h1 className="mb-4 text-2xl font-bold text-white">
            Registration Not Found
          </h1>
          <p className="mb-4 text-gray-300">
            The requested registration could not be found.
          </p>
          <Link href="/dashboard/student-management">
            <Button color="gray" className="mt-4 !bg-gray-700">
              <HiArrowLeft className="mr-2" /> Back to List
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Display different form based on role and current status
  const canApprove =
    (userRole === "advisor" && !bundle.ADVISOR_APPROVAL) ||
    (userRole === "hod" && bundle.ADVISOR_APPROVAL && !bundle.HOD_APPROVAL) ||
    (userRole === "accounts_admin" &&
      bundle.HOD_APPROVAL &&
      !bundle.ACCOUNTS_ADMIN_APPROVAL);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Registration Review</h1>
        <Link href="/dashboard/student-management">
          <Button color="gray" className="!bg-gray-700">
            <HiArrowLeft className="mr-2" /> Back to List
          </Button>
        </Link>
      </div>

      {success && (
        <div className="rounded-lg border border-green-500 bg-green-900/20 p-4 text-green-300">
          {success}
          <div className="mt-2">
            <span className="text-sm font-medium">
              Redirecting to registration list...
            </span>
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-gray-700">
              <div
                className="h-full animate-pulse rounded-full bg-green-500"
                style={{ width: "100%" }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Role-specific header information */}
      {!success && (
        <div className="rounded-lg border border-blue-500 bg-blue-900/20 p-4 text-blue-300">
          {userRole === "advisor" && (
            <div className="flex items-start">
              <div className="mt-1 mr-4 flex-shrink-0">
                <HiAcademicCap className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-blue-400">
                  Advisor Review
                </h3>
                <p>
                  As an advisor, you are the first to review this registration
                  request. You can approve or reject individual courses and
                  provide feedback to the student.
                </p>
              </div>
            </div>
          )}
          {userRole === "hod" && (
            <div className="flex items-start">
              <div className="mt-1 mr-4 flex-shrink-0">
                <HiAcademicCap className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-blue-400">
                  Head of Department Review
                </h3>
                <p>
                  As the Head of Department, you should review the advisor`s
                  decisions and either approve or reject the entire registration
                  request.
                </p>
              </div>
            </div>
          )}
          {userRole === "accounts_admin" && (
            <div className="flex items-start">
              <div className="mt-1 mr-4 flex-shrink-0">
                <HiAcademicCap className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-blue-400">
                  Accounts Office Review
                </h3>
                <p>
                  As the accounts admin, you should verify the total fees and
                  either approve or reject the registration request. After your
                  approval, the student will be able to make payment.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Student Information */}
      <div className="overflow-hidden rounded-lg border border-gray-700 bg-gray-800 shadow">
        <div className="border-b border-gray-700 bg-gray-900 px-6 py-4">
          <h2 className="text-lg font-medium text-white">
            Student Information
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
          <div>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-400">
                  Student Name
                </dt>
                <dd className="mt-1 text-sm text-white">
                  {bundle.student_name}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-400">
                  Student ID
                </dt>
                <dd className="mt-1 text-sm text-white">
                  {bundle.REGISTRATION_NUMBER}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-400">Email</dt>
                <dd className="mt-1 text-sm text-white">
                  {bundle.student_email}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-400">Mobile</dt>
                <dd className="mt-1 text-sm text-white">
                  {bundle.student_mobile || "N/A"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-400">
                  Department
                </dt>
                <dd className="mt-1 text-sm text-white">
                  {bundle.DEPARTMENT_NAME}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-400">Semester</dt>
                <dd className="mt-1 text-sm text-white">{bundle.SEMESTER}</dd>
              </div>
            </dl>
          </div>
          <div className="border-t border-gray-700 pt-4 md:border-t-0 md:border-l md:pt-0 md:pl-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-400">
                  Registration ID
                </dt>
                <dd className="mt-1 text-sm text-white">#{bundle.ID}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-400">
                  Submission Date
                </dt>
                <dd className="mt-1 text-sm text-white">
                  {formatDate(bundle.SUBMITTED_AT)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-400">
                  Advisor Approval
                </dt>
                <dd className="mt-1 text-sm text-white">
                  {bundle.ADVISOR_APPROVAL ? (
                    <span className="text-green-400">Approved</span>
                  ) : (
                    <span className="text-yellow-400">Pending</span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-400">
                  HOD Approval
                </dt>
                <dd className="mt-1 text-sm text-white">
                  {bundle.HOD_APPROVAL ? (
                    <span className="text-green-400">Approved</span>
                  ) : (
                    <span className="text-yellow-400">Pending</span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-400">
                  Accounts Approval
                </dt>
                <dd className="mt-1 text-sm text-white">
                  {bundle.ACCOUNTS_ADMIN_APPROVAL ? (
                    <span className="text-green-400">Approved</span>
                  ) : (
                    <span className="text-yellow-400">Pending</span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-400">
                  Total Amount
                </dt>
                <dd className="mt-1 text-sm text-white">
                  $
                  {bundle.TOTAL_AMOUNT
                    ? Number(bundle.TOTAL_AMOUNT).toFixed(2)
                    : "0.00"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-400">Status</dt>
                <dd className="mt-1 text-sm text-white">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      bundle.STATUS === "APPROVED"
                        ? "bg-green-100 text-green-800"
                        : bundle.STATUS === "PARTIALLY_APPROVED"
                          ? "bg-blue-100 text-blue-800"
                          : bundle.STATUS === "REJECTED"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {bundle.STATUS}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Course Information */}
      <div className="overflow-hidden rounded-lg border border-gray-700 bg-gray-800 shadow">
        <div className="border-b border-gray-700 bg-gray-900 px-6 py-4">
          <h2 className="text-lg font-medium text-white">Registered Courses</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-400 uppercase">
                  Course Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-400 uppercase">
                  Course Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-400 uppercase">
                  Credits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-400 uppercase">
                  Instructor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-400 uppercase">
                  Status
                </th>
                {userRole === "advisor" && canApprove && (
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-400 uppercase">
                    Approve
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 bg-gray-800">
              {courses.map((course) => (
                <tr key={course.ID}>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-white">
                    {course.course_code}
                  </td>
                  <td className="px-6 py-4 text-sm text-white">
                    {course.course_title}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-white">
                    {course.course_credit}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-white">
                    {course.instructor}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        course.STATUS === "APPROVED"
                          ? "bg-green-100 text-green-800"
                          : course.STATUS === "REJECTED"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {course.STATUS}
                    </span>
                  </td>
                  {userRole === "advisor" && canApprove && (
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      <div className="flex items-center">
                        <Checkbox
                          checked={
                            coursesApproval[course.COURSE_ID]?.approved || false
                          }
                          onChange={(e) =>
                            handleCourseApprovalChange(
                              course.COURSE_ID,
                              e.target.checked,
                            )
                          }
                          className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-green-500 focus:ring-2 focus:ring-green-500"
                        />
                        <Label
                          htmlFor={`approve-${course.COURSE_ID}`}
                          className="ml-2 text-white"
                        >
                          Approve
                        </Label>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approval Form */}
      {canApprove && (
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-lg border border-gray-700 bg-gray-800 p-6 shadow"
        >
          <h2 className="text-lg font-medium text-white">
            {userRole === "advisor"
              ? "Advisor Review"
              : userRole === "hod"
                ? "Head of Department Review"
                : "Accounts Office Review"}
          </h2>

          {error && (
            <div className="rounded-md border border-red-500 bg-red-900/20 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Decision Buttons */}
            <div>
              <Label
                htmlFor="decision"
                className="mb-2 block text-sm font-medium text-gray-400"
              >
                Decision <span className="text-red-400">*</span>
              </Label>
              <div className="flex space-x-4">
                <Button
                  type="button"
                  color="gray"
                  className={`flex items-center ${
                    approvalStatus === true
                      ? "border-green-500 !bg-green-600 hover:!bg-green-700"
                      : "!bg-gray-700 hover:!bg-gray-600"
                  }`}
                  onClick={() => setApprovalStatus(true)}
                >
                  <HiCheck className="mr-2" /> Approve
                </Button>
                <Button
                  type="button"
                  color="gray"
                  className={`flex items-center ${
                    approvalStatus === false
                      ? "border-red-500 !bg-red-600 hover:!bg-red-700"
                      : "!bg-gray-700 hover:!bg-gray-600"
                  }`}
                  onClick={() => setApprovalStatus(false)}
                >
                  <HiX className="mr-2" /> Reject
                </Button>
              </div>
              {approvalStatus === null && (
                <p className="mt-1 text-xs text-gray-400">
                  Please select whether to approve or reject this registration
                </p>
              )}
            </div>

            {/* Advisor Comment Section */}
            {userRole === "advisor" && (
              <div>
                <Label
                  htmlFor="advisorComment"
                  className="mb-2 block text-sm font-medium text-gray-400"
                >
                  Advisor Comment
                </Label>
                <textarea
                  id="advisorComment"
                  className="block w-full rounded-md border border-gray-600 bg-gray-700 p-2.5 text-sm text-white focus:border-green-500 focus:ring-green-500"
                  rows={3}
                  placeholder="Add your comments here (optional). This will be visible to the student."
                  value={advisorComment}
                  onChange={(e) => setAdvisorComment(e.target.value)}
                />
                <p className="mt-1 text-xs text-gray-400">
                  Provide feedback or reasons for your decision, especially if rejecting any courses.
                </p>
              </div>
            )}

            {/* Accounts Admin - Fee Adjustments */}
            {userRole === "accounts_admin" && (
              <div className="space-y-4">
                <h3 className="text-md border-b border-gray-700 pb-2 font-medium text-white">
                  Fee Adjustments
                </h3>

                {/* Base Amount - Read Only */}
                <div>
                  <Label
                    htmlFor="baseAmount"
                    className="mb-2 block text-sm font-medium text-gray-400"
                  >
                    Base Amount
                  </Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      $
                    </span>
                    <input
                      type="text"
                      id="baseAmount"
                      value={baseAmount.toFixed(2)}
                      readOnly
                      className="block w-full rounded-md border border-gray-600 bg-gray-800 pl-8 text-white"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-400">
                    Initial fee calculation based on credit hours
                  </p>
                </div>

                {/* Waiver Percentage */}
                <div>
                  <Label
                    htmlFor="waiverPercent"
                    className="mb-2 block text-sm font-medium text-gray-400"
                  >
                    Waiver Percentage
                  </Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      %
                    </span>
                    <input
                      type="number"
                      id="waiverPercent"
                      value={waiverPercent}
                      onChange={(e) => setWaiverPercent(e.target.value)}
                      min="0"
                      max="100"
                      step="0.1"
                      className="block w-full rounded-md border border-gray-600 bg-gray-700 pl-8 text-white focus:border-green-500 focus:ring-green-500"
                      placeholder="Enter waiver percentage"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-400">
                    Discount or scholarship percentage to deduct from total
                    (0-100%)
                  </p>
                  <p className="mt-1 text-xs text-green-400">
                    Waiver amount: $
                    {(
                      ((parseFloat(waiverPercent) || 0) * baseAmount) /
                      100
                    ).toFixed(2)}
                  </p>
                </div>

                {/* Delay Fine */}
                <div>
                  <Label
                    htmlFor="delayFine"
                    className="mb-2 block text-sm font-medium text-gray-400"
                  >
                    Delay Fine
                  </Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      $
                    </span>
                    <input
                      type="number"
                      id="delayFine"
                      value={delayFine}
                      onChange={(e) => setDelayFine(e.target.value)}
                      min="0"
                      step="0.01"
                      className="block w-full rounded-md border border-gray-600 bg-gray-700 pl-8 text-white focus:border-green-500 focus:ring-green-500"
                      placeholder="Enter delay fine"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-400">
                    Fine for late registration or payment
                  </p>
                </div>

                {/* Library Fee */}
                <div>
                  <Label
                    htmlFor="libraryFee"
                    className="mb-2 block text-sm font-medium text-gray-400"
                  >
                    Library Fee
                  </Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      $
                    </span>
                    <input
                      type="number"
                      id="libraryFee"
                      value={libraryFee}
                      onChange={(e) => setLibraryFee(e.target.value)}
                      min="0"
                      step="0.01"
                      className="block w-full rounded-md border border-gray-600 bg-gray-700 pl-8 text-white focus:border-green-500 focus:ring-green-500"
                      placeholder="Enter library fee"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-400">
                    Additional library access fees
                  </p>
                </div>

                {/* Total Amount - Read Only */}
                <div className="border-t border-gray-700 pt-2">
                  <Label
                    htmlFor="totalAmount"
                    className="mb-2 block text-sm font-medium text-gray-400"
                  >
                    Total Amount <span className="text-red-400">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      $
                    </span>
                    <input
                      type="text"
                      id="totalAmount"
                      value={totalAmount}
                      readOnly
                      className={`block w-full rounded-md border text-lg font-bold ${
                        approvalStatus === true &&
                        (!totalAmount || parseFloat(totalAmount) <= 0)
                          ? "border-red-500 bg-red-900/20"
                          : "border-green-600 bg-green-900/20"
                      } pl-8 text-white`}
                    />
                  </div>
                  <p className="mt-1 flex justify-between text-xs">
                    <span className="text-gray-400">
                      Final amount after all adjustments
                    </span>
                    {approvalStatus === true &&
                      (!totalAmount || parseFloat(totalAmount) <= 0) && (
                        <span className="text-red-400">
                          Required for approval
                        </span>
                      )}
                  </p>
                </div>

                {/* Calculation Summary */}
                <div className="mt-4 rounded-lg bg-gray-900/50 p-3">
                  <h4 className="mb-2 text-sm font-medium text-gray-300">
                    Fee Calculation
                  </h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Base Amount:</span>
                      <span className="text-white">
                        ${Math.round(baseAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">
                        Waiver ({waiverPercent}%):
                      </span>
                      <span className="text-red-400">
                        -$
                        {Math.round(
                          ((parseFloat(waiverPercent) || 0) * baseAmount) / 100,
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Delay Fine:</span>
                      <span className="text-green-400">
                        +${Math.round(parseFloat(delayFine) || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Library Fee:</span>
                      <span className="text-green-400">
                        +${Math.round(parseFloat(libraryFee) || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-gray-700 pt-1 font-medium">
                      <span className="text-gray-300">Final Amount:</span>
                      <span className="text-white">${totalAmount}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              color="gray"
              disabled={processing || approvalStatus === null}
              className="!bg-[#92e3a9] text-black hover:!bg-[#78c18f] disabled:!bg-gray-600 disabled:text-gray-400"
            >
              {processing ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-900 border-t-transparent"></div>
                  Processing...
                </>
              ) : (
                "Submit Review"
              )}
            </Button>
          </div>
        </form>
      )}

      {/* Read-only message if cannot approve */}
      {!canApprove && (
        <div className="rounded-lg border border-yellow-500 bg-yellow-900/20 p-6 text-center">
          <h2 className="mb-2 text-lg font-medium text-yellow-400">
            View Only Mode
          </h2>
          <p className="text-yellow-300">
            {userRole === "advisor" && bundle.ADVISOR_APPROVAL
              ? "You have already approved this registration. It is awaiting HOD approval."
              : userRole === "hod" && !bundle.ADVISOR_APPROVAL
                ? "This registration is awaiting advisor approval before you can review it."
                : userRole === "hod" && bundle.HOD_APPROVAL
                  ? "You have already approved this registration. It is awaiting accounts office approval."
                  : userRole === "accounts_admin" && !bundle.HOD_APPROVAL
                    ? "This registration needs HOD approval before you can review it."
                    : userRole === "accounts_admin" &&
                        bundle.ACCOUNTS_ADMIN_APPROVAL
                      ? "You have already approved this registration. It is now awaiting payment."
                      : "You cannot modify this registration at this stage."}
          </p>
        </div>
      )}
    </div>
  );
}

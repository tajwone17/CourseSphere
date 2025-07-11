"use client";

import { useState, useEffect } from 'react';
import { Button, Textarea, Select, Checkbox, Label } from 'flowbite-react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { HiArrowLeft, HiCheck, HiX, HiDocumentText, HiAcademicCap } from "react-icons/hi";
import Link from 'next/link';

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

interface Advisor {
  ID: number;
  NAME: string;
  EMAIL: string;
}

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
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  
  // Form state
  const [approvalStatus, setApprovalStatus] = useState<boolean | null>(null);
  const [advisorId, setAdvisorId] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [coursesApproval, setCoursesApproval] = useState<{[key: number]: {approved: boolean, comment: string}}>({});
  const [totalAmount, setTotalAmount] = useState<string>('');
  
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
          setAdvisors(data.advisors);
          
          // Initialize course approvals
          const initialCoursesApproval: {[key: number]: {approved: boolean, comment: string}} = {};
          data.courses.forEach((course: CourseRegistration) => {
            initialCoursesApproval[course.COURSE_ID] = {
              approved: course.STATUS === 'APPROVED',
              comment: course.ADVISOR_COMMENT || ''
            };
          });
          setCoursesApproval(initialCoursesApproval);
          
          // Set total amount
          if (data.bundle.TOTAL_AMOUNT) {
            setTotalAmount(data.bundle.TOTAL_AMOUNT.toString());
          }
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
    setCoursesApproval(prev => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        approved
      }
    }));
  };

  const handleCourseCommentChange = (courseId: number, comment: string) => {
    setCoursesApproval(prev => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        comment
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bundle || !userRole) return;
    
    setProcessing(true);
    setError(null);
    setSuccess(null);
    
    try {
      let endpoint = '';
      let payload: any = {
        bundleId: bundle.ID
      };
      
      // Validation checks
      if (approvalStatus === null) {
        throw new Error("Please select either Approve or Reject");
      }
      
      if (userRole === 'accounts_admin' && approvalStatus === true) {
        const amount = parseFloat(totalAmount);
        if (isNaN(amount) || amount <= 0) {
          throw new Error("Please enter a valid total amount");
        }
      }
      
      // Format course approvals as array
      const courseApprovals = Object.keys(coursesApproval).map(courseId => ({
        courseId: parseInt(courseId),
        approved: coursesApproval[parseInt(courseId)].approved,
        comment: coursesApproval[parseInt(courseId)].comment
      }));
      
      // Different payloads based on user role
      if (userRole === 'advisor') {
        endpoint = '/api/registration/advisor-approval';
        payload = {
          ...payload,
          advisorId: user?.id,
          approved: approvalStatus,
          comment,
          courseApprovals
        };
      } 
      else if (userRole === 'hod') {
        endpoint = '/api/registration/hod-approval';
        payload = {
          ...payload,
          hodId: user?.id,
          approved: approvalStatus,
          comment
        };
      }
      else if (userRole === 'accounts_admin') {
        endpoint = '/api/registration/accounts-approval';
        payload = {
          ...payload,
          accountsAdminId: user?.id,
          approved: approvalStatus,
          comment,
          totalAmount: totalAmount ? parseFloat(totalAmount) : null
        };
      }
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to process approval");
      }
      
      setSuccess(data.message || "Registration successfully processed");
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/dashboard/student-management');
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
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-[#92e3a9]"></div>
          <h2 className="text-xl font-semibold text-white">Loading Registration Details</h2>
          <p className="mt-2 text-gray-400">Please wait while we fetch the registration information...</p>
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
            <Button className="mt-4 bg-gray-700">
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
          <h1 className="mb-4 text-2xl font-bold text-white">Registration Not Found</h1>
          <p className="mb-4 text-gray-300">The requested registration could not be found.</p>
          <Link href="/dashboard/student-management">
            <Button className="mt-4 bg-gray-700">
              <HiArrowLeft className="mr-2" /> Back to List
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  // Display different form based on role and current status
  const canApprove = 
    (userRole === 'advisor' && !bundle.ADVISOR_APPROVAL) || 
    (userRole === 'hod' && bundle.ADVISOR_APPROVAL && !bundle.HOD_APPROVAL) ||
    (userRole === 'accounts_admin' && bundle.HOD_APPROVAL && !bundle.ACCOUNTS_ADMIN_APPROVAL);
  
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Registration Review</h1>
        <Link href="/dashboard/student-management">
          <Button className="bg-gray-700">
            <HiArrowLeft className="mr-2" /> Back to List
          </Button>
        </Link>
      </div>
      
      {success && (
        <div className="rounded-lg border border-green-500 bg-green-900/20 p-4 text-green-300">
          {success}
          <div className="mt-2">
            <span className="text-sm font-medium">Redirecting to registration list...</span>
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-gray-700">
              <div className="h-full animate-pulse rounded-full bg-green-500" style={{ width: "100%" }}></div>
            </div>
          </div>
        </div>
      )}
      
      {/* Role-specific header information */}
      {!success && (
        <div className="rounded-lg border border-blue-500 bg-blue-900/20 p-4 text-blue-300">
          {userRole === "advisor" && (
            <div className="flex items-start">
              <div className="mr-4 mt-1 flex-shrink-0">
                <HiAcademicCap className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-blue-400">Advisor Review</h3>
                <p>As an advisor, you are the first to review this registration request. You can approve or reject individual courses and provide feedback to the student.</p>
              </div>
            </div>
          )}
          {userRole === "hod" && (
            <div className="flex items-start">
              <div className="mr-4 mt-1 flex-shrink-0">
                <HiAcademicCap className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-blue-400">Head of Department Review</h3>
                <p>As the Head of Department, you should review the advisor's decisions and either approve or reject the entire registration request.</p>
              </div>
            </div>
          )}
          {userRole === "accounts_admin" && (
            <div className="flex items-start">
              <div className="mr-4 mt-1 flex-shrink-0">
                <HiAcademicCap className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-blue-400">Accounts Office Review</h3>
                <p>As the accounts admin, you should verify the total fees and either approve or reject the registration request. After your approval, the student will be able to make payment.</p>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Student Information */}
      <div className="overflow-hidden rounded-lg border border-gray-700 bg-gray-800 shadow">
        <div className="border-b border-gray-700 bg-gray-900 px-6 py-4">
          <h2 className="text-lg font-medium text-white">Student Information</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
          <div>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-400">Student Name</dt>
                <dd className="mt-1 text-sm text-white">{bundle.student_name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-400">Student ID</dt>
                <dd className="mt-1 text-sm text-white">{bundle.REGISTRATION_NUMBER}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-400">Email</dt>
                <dd className="mt-1 text-sm text-white">{bundle.student_email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-400">Mobile</dt>
                <dd className="mt-1 text-sm text-white">{bundle.student_mobile || "N/A"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-400">Department</dt>
                <dd className="mt-1 text-sm text-white">{bundle.DEPARTMENT_NAME}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-400">Semester</dt>
                <dd className="mt-1 text-sm text-white">{bundle.SEMESTER}</dd>
              </div>
            </dl>
          </div>
          <div className="border-t border-gray-700 pt-4 md:border-l md:border-t-0 md:pl-6 md:pt-0">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-400">Registration ID</dt>
                <dd className="mt-1 text-sm text-white">#{bundle.ID}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-400">Submission Date</dt>
                <dd className="mt-1 text-sm text-white">{formatDate(bundle.SUBMITTED_AT)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-400">Advisor Approval</dt>
                <dd className="mt-1 text-sm text-white">
                  {bundle.ADVISOR_APPROVAL ? 
                    <span className="text-green-400">Approved</span> : 
                    <span className="text-yellow-400">Pending</span>}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-400">HOD Approval</dt>
                <dd className="mt-1 text-sm text-white">
                  {bundle.HOD_APPROVAL ? 
                    <span className="text-green-400">Approved</span> : 
                    <span className="text-yellow-400">Pending</span>}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-400">Accounts Approval</dt>
                <dd className="mt-1 text-sm text-white">
                  {bundle.ACCOUNTS_ADMIN_APPROVAL ? 
                    <span className="text-green-400">Approved</span> : 
                    <span className="text-yellow-400">Pending</span>}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-400">Total Amount</dt>
                <dd className="mt-1 text-sm text-white">
                  ${bundle.TOTAL_AMOUNT ? Number(bundle.TOTAL_AMOUNT).toFixed(2) : '0.00'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-400">Status</dt>
                <dd className="mt-1 text-sm text-white">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    bundle.STATUS === 'APPROVED' ? 'bg-green-100 text-green-800' :
                    bundle.STATUS === 'PARTIALLY_APPROVED' ? 'bg-blue-100 text-blue-800' :
                    bundle.STATUS === 'REJECTED' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
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
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                  Course Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                  Course Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                  Credits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                  Instructor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                  Comments
                </th>
                {userRole === 'advisor' && canApprove && (
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                    Approve
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 bg-gray-800">
              {courses.map((course) => (
                <tr key={course.ID}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-white">
                    {course.course_code}
                  </td>
                  <td className="px-6 py-4 text-sm text-white">
                    {course.course_title}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-white">
                    {course.course_credit}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-white">
                    {course.instructor}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      course.STATUS === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      course.STATUS === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {course.STATUS}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {userRole === 'advisor' && canApprove ? (
                      <Textarea
                        value={coursesApproval[course.COURSE_ID]?.comment || ''}
                        onChange={(e) => handleCourseCommentChange(course.COURSE_ID, e.target.value)}
                        placeholder="Add comment for this course"
                        className="border-gray-600 bg-gray-700 text-white"
                        rows={2}
                      />
                    ) : (
                      course.ADVISOR_COMMENT || "No comments"
                    )}
                  </td>
                  {userRole === 'advisor' && canApprove && (
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <div className="flex items-center">
                        <Checkbox
                          checked={coursesApproval[course.COURSE_ID]?.approved || false}
                          onChange={(e) => handleCourseApprovalChange(course.COURSE_ID, e.target.checked)}
                          className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-green-500 focus:ring-2 focus:ring-green-500"
                        />
                        <Label htmlFor={`approve-${course.COURSE_ID}`} className="ml-2 text-white">
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
        <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-gray-700 bg-gray-800 p-6 shadow">
          <h2 className="text-lg font-medium text-white">
            {userRole === 'advisor' ? 'Advisor Review' : 
             userRole === 'hod' ? 'Head of Department Review' : 
             'Accounts Office Review'}
          </h2>
          
          {error && (
            <div className="rounded-md border border-red-500 bg-red-900/20 p-4 text-sm text-red-300">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            {/* Decision Buttons */}
            <div>
              <Label htmlFor="decision" className="mb-2 block text-sm font-medium text-gray-400">
                Decision <span className="text-red-400">*</span>
              </Label>
              <div className="flex space-x-4">
                <Button
                  type="button"
                  className={`flex items-center ${
                    approvalStatus === true ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  onClick={() => setApprovalStatus(true)}
                >
                  <HiCheck className="mr-2" /> Approve
                </Button>
                <Button
                  type="button"
                  className={`flex items-center ${
                    approvalStatus === false ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
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
            
            {/* Comments */}
            <div>
              <Label htmlFor="comment" className="mb-2 block text-sm font-medium text-gray-400">
                Comments
              </Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add your comments regarding this registration"
                className="border-gray-600 bg-gray-700 text-white"
                rows={3}
              />
            </div>
            
            {/* Accounts Admin - Total Amount */}
            {userRole === 'accounts_admin' && (
              <div>
                <Label htmlFor="totalAmount" className="mb-2 block text-sm font-medium text-gray-400">
                  Total Amount <span className="text-red-400">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">$</span>
                  <input
                    type="number"
                    id="totalAmount"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(e.target.value)}
                    min="0"
                    step="0.01"
                    className={`block w-full rounded-md border ${
                      approvalStatus === true && (!totalAmount || parseFloat(totalAmount) <= 0) 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-600 focus:border-green-500 focus:ring-green-500'
                    } bg-gray-700 pl-8 text-white`}
                    placeholder="Enter total amount"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  Current amount: ${Number(bundle.TOTAL_AMOUNT).toFixed(2)}
                  {approvalStatus === true && (!totalAmount || parseFloat(totalAmount) <= 0) && (
                    <span className="ml-2 text-red-400">Required for approval</span>
                  )}
                </p>
              </div>
            )}
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={processing || approvalStatus === null}
              className="bg-[#92e3a9] text-black hover:bg-[#78c18f] disabled:bg-gray-600 disabled:text-gray-400"
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
          <h2 className="mb-2 text-lg font-medium text-yellow-400">View Only Mode</h2>
          <p className="text-yellow-300">
            {userRole === 'advisor' && bundle.ADVISOR_APPROVAL ? 
              "You have already approved this registration. It is awaiting HOD approval." :
             userRole === 'hod' && !bundle.ADVISOR_APPROVAL ? 
              "This registration is awaiting advisor approval before you can review it." :
             userRole === 'hod' && bundle.HOD_APPROVAL ? 
              "You have already approved this registration. It is awaiting accounts office approval." :
             userRole === 'accounts_admin' && !bundle.HOD_APPROVAL ? 
              "This registration needs HOD approval before you can review it." :
             userRole === 'accounts_admin' && bundle.ACCOUNTS_ADMIN_APPROVAL ? 
              "You have already approved this registration. It is now awaiting payment." :
              "You cannot modify this registration at this stage."}
          </p>
        </div>
      )}
    </div>
  );
}

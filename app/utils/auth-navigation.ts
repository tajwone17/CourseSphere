"use client";

import { useRouter } from "next/navigation";

// Role-based routing map
const roleRouteMap: Record<string, string> = {
  student: "/student-dashboard",
  admin: "/dashboard/manage-hod",
  hod: "/dashboard",
  advisor: "/dashboard",
  "exam-controller": "/dashboard",
  accounts: "/dashboard"
};

/**
 * Get the appropriate route for a user based on their role
 * @param role The user's role
 * @returns The route path to navigate to
 */
export const getRouteByRole = (role: string): string => {
  return roleRouteMap[role] || "/dashboard";
};

/**
 * Navigate to the appropriate page after login
 * @param router The Next.js router instance
 * @param role The user's role
 */
export const navigateAfterLogin = (router: ReturnType<typeof useRouter>, role: string): void => {
  const targetRoute = getRouteByRole(role);
  router.push(targetRoute);
};

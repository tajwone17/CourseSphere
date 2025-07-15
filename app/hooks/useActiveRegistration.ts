"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";

export default function useActiveRegistration() {
  const { user, isAuthenticated } = useAuth();
  const [hasActiveRegistration, setHasActiveRegistration] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLocalStorage = () => {
      // First check if we have a stored value in localStorage
      const storedValue = localStorage.getItem("hasActiveRegistration");
      if (storedValue === "true") {
        setHasActiveRegistration(true);
        setLoading(false);
        return true;
      }
      return false;
    };

    const checkActiveRegistration = async () => {
      // Return early if not authenticated
      if (!isAuthenticated || !user?.id) {
        setLoading(false);
        return;
      }

      // Check localStorage first
      if (checkLocalStorage()) {
        return;
      }

      try {
        // If no stored value, make an API call to check
        const response = await fetch(
          `/api/registration/status?userId=${user.id}`,
        );

        if (!response.ok) {
          setLoading(false);
          return;
        }

        const data = await response.json();

        if (data.success && data.registration) {
          // Set the active registration flag if registration status is not COMPLETED or REJECTED
          const isActive =
            data.registration.STATUS !== "COMPLETED" &&
            data.registration.STATUS !== "REJECTED" &&
            data.registration.STATUS !== "CANCELLED";

          setHasActiveRegistration(isActive);

          // Update localStorage
          if (isActive) {
            localStorage.setItem("hasActiveRegistration", "true");
          } else {
            localStorage.removeItem("hasActiveRegistration");
          }
        }
      } catch (error) {
        console.error("Error checking active registration:", error);
      } finally {
        setLoading(false);
      }
    };

    checkActiveRegistration();
  }, [isAuthenticated, user?.id]);

  return { hasActiveRegistration, loading };
}

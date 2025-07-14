"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";

interface Deadline {
  id: number;
  department_id: number;
  course_registration_without_fine: string;
  course_registration_with_fine: string;
  admit_card_collection: string;
}

export function useDepartmentDeadlines() {
  const [deadlines, setDeadlines] = useState<Deadline | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDeadlines = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        let departmentId;

        // Get department ID based on user role
        if (
          user.role === "admin" ||
          user.role === "accounts_admin" ||
          user.role === "exam_controller"
        ) {
          // These roles may not have a specific department
          // We'll fetch the first available department's deadlines for them
          const deptResponse = await fetch("/api/departments");
          if (deptResponse.ok) {
            const deptData = await deptResponse.json();
            if (deptData.departments && deptData.departments.length > 0) {
              departmentId = deptData.departments[0].ID;
            }
          }
        } else if (["hod", "advisor", "student"].includes(user.role)) {
          departmentId = user.departmentId;
        }

        if (!departmentId) {
          setLoading(false);
          return;
        }

        const response = await fetch("/api/deadlines", {
          headers: {
            departmentid: departmentId.toString(),
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch deadlines");
        }

        const data = await response.json();
        if (data.deadlines && data.deadlines.length > 0) {
          setDeadlines(data.deadlines[0]);
        } else {
          // Set to null if no deadlines found
          setDeadlines(null);
        }
      } catch (err) {
        console.error("Error fetching deadlines:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchDeadlines();
  }, [user]);

  return { deadlines, loading, error };
}

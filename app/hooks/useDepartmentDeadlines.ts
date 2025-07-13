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
      if (!user || user.role === "accounts_admin") {
        setLoading(false);
        return;
      }

      try {
        let departmentId;

        // Get department ID based on user role
        if (user.role === "admin") {
          // Super admin might not have a specific department
          setLoading(false);
          return;
        } else if (["hod", "advisor"].includes(user.role)) {
          departmentId = user.departmentId;
        } else if (user.role === "student") {
          departmentId = user.departmentId;
        } else if (user.role === "exam_controller") {
          // Exam controller might see all departments or specific ones
          // For now, we'll skip fetching if role is exam_controller
          setLoading(false);
          return;
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
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchDeadlines();
  }, [user]);

  return { deadlines, loading, error };
}

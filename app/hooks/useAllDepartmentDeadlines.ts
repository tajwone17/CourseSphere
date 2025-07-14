"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";

interface DepartmentDeadline {
  id: number;
  department_id: number;
  DEPARTMENT_NAME: string;
  course_registration_without_fine: string;
  course_registration_with_fine: string;
  admit_card_collection: string;
}

export function useAllDepartmentDeadlines() {
  const [departmentDeadlines, setDepartmentDeadlines] = useState<
    DepartmentDeadline[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAllDeadlines = async () => {
      if (!user || user.role !== "accounts_admin") {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/deadlines/all");

        if (!response.ok) {
          throw new Error("Failed to fetch all department deadlines");
        }

        const data = await response.json();
        if (data.departmentDeadlines) {
          setDepartmentDeadlines(data.departmentDeadlines);
        } else {
          // Set to empty array if no deadlines found
          setDepartmentDeadlines([]);
        }
      } catch (err) {
        console.error("Error fetching all department deadlines:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchAllDeadlines();
  }, [user]);

  return { departmentDeadlines, loading, error };
}

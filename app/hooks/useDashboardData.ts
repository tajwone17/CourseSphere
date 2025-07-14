import { useState, useEffect } from "react";

interface DashboardStats {
  approvedCount: number;
  rejectedCount: number;
  pendingCount: number;
  hoursRemaining: number;
}

interface UrgentApproval {
  id: number;
  student: string;
  regId: string;
  submissionDate: string;
  courses: string[];
  deadline: string;
}

export const useDashboardData = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [urgentApprovals, setUrgentApprovals] = useState<UrgentApproval[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch stats
        const statsResponse = await fetch("/api/dashboard/stats");
        if (!statsResponse.ok) {
          throw new Error(`Error fetching stats: ${statsResponse.statusText}`);
        }
        const statsData = await statsResponse.json();

        // Fetch urgent approvals
        const approvalsResponse = await fetch(
          "/api/dashboard/urgent-approvals",
        );
        if (!approvalsResponse.ok) {
          throw new Error(
            `Error fetching urgent approvals: ${approvalsResponse.statusText}`,
          );
        }
        const approvalsData = await approvalsResponse.json();

        setStats(statsData);
        setUrgentApprovals(approvalsData);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return { stats, urgentApprovals, loading, error };
};

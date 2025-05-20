"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
// import { useRouter } from "next/navigation";

//eslint-disable-next-line @typescript-eslint/no-explicit-any
const AuthContext = createContext<any>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  // const router = useRouter();

  // Login function
  const login = async (email: string, password: string, role: string) => {
    setLoading(true);
    try {
      // Validation
      if (!email) return { success: false, error: "Email is required" };
      if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/))
        return { success: false, error: "Invalid email format" };
      if (!password) return { success: false, error: "Password is required" };
      if (password.length < 8)
        return {
          success: false,
          error: "Password must be at least 8 characters",
        };
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, role }),
      });
      if (!res.ok) {
        try {
          // Try to parse the error as JSON first
          const errorData = await res.json();
          console.log("Error response:", errorData);
          return { success: false, error: errorData.error || "Login failed" };
        } catch {
          // If it's not valid JSON, get the text
          const errorText = await res.text();
          const errorMsg = errorText.split("\n")[0];
          console.log("Error response:", errorText);
          return { success: false, error: errorMsg || "Login failed" };
        }
      }

      const { token, user } = await res.json();
      if (!token) {
        return {
          success: false,
          error: "Login failed: No authentication token received",
        };
      }

      // Store token
      localStorage.setItem("token", token);

      setUser({
        id: user.id,
        name: user.name,
        email: user.email,
        department: user.department || "",
        role: user.role || "",
      });
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
          department: user.department || "",
          role: user.role || "",
        }),
      );

      // router.push("/dashboard");
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      // router.push("/signin");
      setLoading(false);
    }
  };

  // Check authentication on component mount
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user") || "null"));
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

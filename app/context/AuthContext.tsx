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
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [departmentDetails, setDepartmentDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  // const router = useRouter();

  // Function to fetch department details
  const fetchDepartmentDetails = async (departmentId: string) => {
    try {
      const res = await fetch(`/api/departments/${departmentId}`);
      if (res.ok) {
        const data = await res.json();
        return data.department;
      }
      return null;
    } catch (error) {
      console.error("Error fetching department details:", error);
      return null;
    }
  };

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
         
          return { success: false, error: errorData.error || "Login failed" };
        } catch {
          // If it's not valid JSON, get the text
          const errorText = await res.text();
          const errorMsg = errorText.split("\n")[0];
      
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

      // Fetch department details if departmentId exists
     
      let departmentInfo = null;
      if (user.department) {
        departmentInfo = await fetchDepartmentDetails(user.department);
      }

      // Store token
      localStorage.setItem("token", token);

      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        registration_number: user.registration_number || "",
        departmentId: user.department || "",
        department: departmentInfo || {}, // Store full department object
        role: user.role || "",
      };

      setUser(userData);
      setDepartmentDetails(departmentInfo);
      
      localStorage.setItem("user", JSON.stringify(userData));

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
      localStorage.removeItem("user");
      setUser(null);
      setDepartmentDetails(null);
      // router.push("/signin");
      setLoading(false);
    }
  };

  // Check authentication on component mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    setUser(storedUser);
    
    // If user exists and has departmentId but no department details
    if (storedUser && storedUser.departmentId && !storedUser.department?.name) {
      // Fetch department details
      fetchDepartmentDetails(storedUser.departmentId).then(dept => {
        if (dept) {
          const updatedUser = {
            ...storedUser,
            department: dept
          };
          setUser(updatedUser);
          setDepartmentDetails(dept);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      });
    } else if (storedUser?.department) {
      setDepartmentDetails(storedUser.department);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        isAuthenticated: !!user, 
        department: departmentDetails,
        login, 
        logout, 
        loading 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
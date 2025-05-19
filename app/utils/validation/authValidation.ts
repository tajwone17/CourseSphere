// Utils for authentication-related validation

/**
 * Interface for student registration data
 */
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  registration_number: string;
  department_id: number | string;
  mobile: string;
  session: string;
  agreeToTerms?: boolean;
}

/**
 * Interface for database user results
 */
export interface UserResult {
  // Define both lowercase and uppercase variants since MySQL might return uppercase keys
  id?: number;
  ID?: number;
  email?: string;
  EMAIL?: string;
  password?: string;
  PASSWORD?: string;
  name?: string;
  NAME?: string;
  userType?: string;
  status?: number;
  STATUS?: number;
  // Add any other fields that might be relevant
  REGISTRATION_NUMBER?: string;
  DEPARTMENT_ID?: number;
  SESSION?: string;
  MOBILE?: string;
  CREATED_AT?: string;
  [key: string]: unknown; // For other properties that may vary between user types
}

/**
 * Interface for student database record
 */
export interface StudentRecord {
  id?: number;
  name: string;
  email: string;
  password: string;
  registration_number: string;
  department_id: number;
  mobile: string;
  session: string;
  status: string;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function isStrongPassword(password: string): boolean {
  // Password should be at least 8 characters with at least one uppercase, one lowercase, one number, and one special character
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

/**
 * Validate registration number format
 */
export function isValidRegistrationNumber(regNum: string): boolean {
  const regNumRegex = /^[A-Za-z0-9-]{5,20}$/;
  return regNumRegex.test(regNum);
}

/**
 * Validate mobile number format
 */
export function isValidMobileNumber(mobile: string | null): boolean {
  if (!mobile) return false; // Mobile is required
  const mobileRegex = /^[0-9]{10,15}$/;
  return mobileRegex.test(mobile);
}

/**
 * Validate session format
 */
export function isValidSession(session: string): boolean {
  // Accepts both YYYY, YYYY-YYYY and Spring/Fall/Summer-YYYY formats
  const sessionRegex = /^\d{4}$|^\d{4}-\d{4}$|^(Spring|Fall|Summer)-\d{4}$/;
  return sessionRegex.test(session);
}

/**
 * Store login attempts for rate limiting
 */
const loginAttempts: Record<string, { count: number; lastAttempt: number }> =
  {};

/**
 * Check rate limit for login attempts
 */
export function checkRateLimit(email: string): {
  allowed: boolean;
  message?: string;
} {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 5;

  // Clean up old entries
  Object.keys(loginAttempts).forEach((key) => {
    if (now - loginAttempts[key].lastAttempt > windowMs) {
      delete loginAttempts[key];
    }
  });

  // Check if this email has exceeded attempts
  if (!loginAttempts[email]) {
    loginAttempts[email] = { count: 1, lastAttempt: now };
    return { allowed: true };
  }

  // If within time window, check count
  if (loginAttempts[email].count >= maxAttempts) {
    const timeLeft = Math.ceil(
      (windowMs - (now - loginAttempts[email].lastAttempt)) / 60000,
    );
    return {
      allowed: false,
      message: `Too many login attempts. Please try again in ${timeLeft} minutes.`,
    };
  }

  // Increment count and update time
  loginAttempts[email].count += 1;
  loginAttempts[email].lastAttempt = now;
  return { allowed: true };
}

/**
 * Validate registration data
 */
export function validateRegistrationData(data: RegisterData): {
  valid: boolean;
  fieldErrors: Record<string, string>;
} {
  const fieldErrors: Record<string, string> = {};

  // Validate required fields
  if (!data.name) fieldErrors.name = "Name is required";
  if (!data.email) fieldErrors.email = "Email is required";
  if (!data.password) fieldErrors.password = "Password is required";
  if (!data.registration_number)
    fieldErrors.registration_number = "Registration number is required";
  if (!data.session) fieldErrors.session = "Session is required";
  if (!data.mobile) fieldErrors.mobile = "Mobile number is required";

  // If any required fields are missing, return early
  if (Object.keys(fieldErrors).length > 0) {
    return { valid: false, fieldErrors };
  }

  // Enhanced validations
  if (data.name.length < 2 || data.name.length > 100) {
    fieldErrors.name = "Name must be between 2 and 100 characters";
  }

  if (!isValidEmail(data.email)) {
    fieldErrors.email = "Invalid email format";
  }

  if (!isStrongPassword(data.password)) {
    fieldErrors.password =
      "Password must be at least 8 characters and include uppercase, lowercase, numbers, and special characters";
  }

  if (!isValidRegistrationNumber(data.registration_number)) {
    fieldErrors.registration_number =
      "Registration number must be 5-20 characters and can contain letters, numbers and hyphens";
  }

  if (!isValidMobileNumber(data.mobile)) {
    fieldErrors.mobile = "Mobile number must be 10-15 digits";
  }

  if (
    data.department_id &&
    (isNaN(Number(data.department_id)) || Number(data.department_id) <= 0)
  ) {
    fieldErrors.department_id = "Please select a valid department";
  }

  // Check if session is valid
  if (data.session && !isValidSession(data.session)) {
    fieldErrors.session =
      "Invalid session format. Use YYYY, YYYY-YYYY, Spring-YYYY, Fall-YYYY, or Summer-YYYY format";
  }

  return {
    valid: Object.keys(fieldErrors).length === 0,
    fieldErrors,
  };
}

/**
 * Validate login data
 */
export function validateLoginData(
  email?: string,
  password?: string,
): {
  valid: boolean;
  error?: string;
  status?: number;
} {
  if (!email || !password) {
    return {
      valid: false,
      error: "Email and password are required",
      status: 400,
    };
  }

  if (!isValidEmail(email)) {
    return {
      valid: false,
      error: "Invalid email format",
      status: 400,
    };
  }

  // Check password minimum length
  if (password.length < 8) {
    return {
      valid: false,
      error: "Password must be at least 8 characters",
      status: 400,
    };
  }

  // Check rate limit for this email
  const rateCheckResult = checkRateLimit(email);
  if (!rateCheckResult.allowed) {
    return {
      valid: false,
      error: rateCheckResult.message,
      status: 429, // Too Many Requests
    };
  }

  return { valid: true };
}

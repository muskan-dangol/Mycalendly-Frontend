import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Checks if a JWT token exists and is valid (not expired)
 * @param token - The JWT token string
 * @returns true if token exists and is not expired, false otherwise
 */
export function isTokenValid(token: string | null): boolean {
  if (!token) {
    return false;
  }

  try {
    // JWT tokens have 3 parts separated by dots: header.payload.signature
    const parts = token.split(".");
    if (parts.length !== 3) {
      return false;
    }

    // Decode the payload (second part)
    const payload = JSON.parse(atob(parts[1]));

    // Check if token has expiration claim
    if (payload.exp) {
      // exp is in seconds, Date.now() is in milliseconds
      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();

      // Token is valid if current time is before expiration
      return currentTime < expirationTime;
    }

    // If no expiration claim, assume token is valid (though this is not recommended)
    return true;
  } catch (error) {
    // If decoding fails, token is invalid
    console.error("Error decoding token:", error);
    return false;
  }
}

import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface DecodedJWT {
  exp: number;  // Expiration time (seconds since UNIX epoch)
  sub: string;  // Subject (user ID or similar)
  [key: string]: any;  // Other JWT claims (e.g., role, etc.)
}

// Function to retrieve the token (from Cookies or localStorage)
export const getToken = (): string | null => {
  return Cookies.get("token") || localStorage.getItem("token") || null;
};

// Decode the JWT token and return the payload
export const decodeJWT = (token: string): DecodedJWT | null => {
  try {
    return jwtDecode<DecodedJWT>(token);  
  } catch (error) {
    console.warn("Invalid JWT token:", error);
    return null;  
  }
};

// Check if the token is expired
export const isTokenExpired = (token: string): boolean => {
  const decodedToken = decodeJWT(token);
  if (!decodedToken) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return decodedToken.exp < currentTime; 
};

// Check token validity & return a usable token
export const checkTokenValidity = (): string | null => {
  const token = getToken();
  return token && !isTokenExpired(token) ? token : null;
};

// Remove token from storage (logout utility)
export const removeToken = (): void => {
  Cookies.remove("token");
  localStorage.removeItem("token");
};

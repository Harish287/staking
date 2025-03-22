import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface DecodedJWT {
  exp: number;  // Expiration time (in seconds since UNIX epoch)
  sub: string;  // Subject (user ID or similar)
  [key: string]: any;  // Other JWT claims (e.g., user_role, etc.)
}

// Get token from cookies
export const getTokenFromCookies = (): string | undefined => {
  return Cookies.get("token");  // Get the token from cookies
};

// Decode the JWT token and return the payload
export const decodeJWT = (token: string): DecodedJWT | null => {
  try {
    return jwtDecode<DecodedJWT>(token);  // Decode the JWT
  } catch (error) {
    console.error("Error decoding JWT token:", error);
    return null;  // Return null if there's an error decoding
  }
};

// Check if the token is expired
export const isTokenExpired = (token: string): boolean => {
  const decodedToken = decodeJWT(token);
  if (!decodedToken) return true;

  const currentTime = Math.floor(Date.now() / 1000);  
  return decodedToken.exp < currentTime; 
};

export const checkTokenValidity = (): string | null => {
  const token = getTokenFromCookies(); 
  if (!token || isTokenExpired(token)) {
    return null;  
  }
  return token; 
};

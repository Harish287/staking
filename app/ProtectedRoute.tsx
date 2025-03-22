import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAppSelector } from "../redux/hooks";
import { decodeJWT } from "../lib/auth"; // Ensure you have a function to decode JWT

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token, "token");

    if (!token) {
      router.replace("/auth/signin");
      return;
    }

    try {
      const decodedToken = decodeJWT(token);

      if (decodedToken?.user_role === "Administrator") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/user/dashboard");
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      router.replace("/auth/signin");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return children;
};

export default ProtectedRoute;

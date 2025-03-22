"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { decodeJWT } from "@/lib/auth";
import { Spinner } from "@/components/ui/spinner";

export default function Home() {
  const router = useRouter();
  console.log("Home page loading");

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Handle case where token does not exist
    if (!token) {
      console.log("No token found, redirecting to signin.");
      router.replace("/auth/signin");
      return;
    }

    try {
      // Decode the JWT token safely
      const decodedToken = decodeJWT(token);

      // Check if decodedToken and user_role exist
      if (decodedToken?.user_role) {
        const { user_role } = decodedToken;
        console.log("Decoded Token: ", decodedToken);

        // Redirect based on user role
        if (user_role === "Administrator") {
          router.replace("/admin/dashboard");
        } else if (user_role === "User") {
          router.replace("/user/dashboard");
        } else {
          console.warn("Unknown role, redirecting to signin.");
          router.replace("/auth/signin"); 
        }
      } else {
        console.warn("Invalid token, redirecting to signin.");
        router.replace("/auth/signin");
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      router.replace("/auth/signin");
    }
  }, [router]); // Adding router as a dependency

  return (
    <p className="flex items-center justify-center m-auto">
      <Spinner />
    </p>
  );
}

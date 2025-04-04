"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { decodeJWT } from "@/lib/auth";
import { Spinner } from "@/components/ui/spinner";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true); // Start with loading state
  const [error, setError] = useState<string | null>(null); // State to track errors

  useEffect(() => {
    if (typeof window === "undefined") return; // Make sure it's client-side

    const token = localStorage.getItem("token");

    // If no token exists, redirect to sign-in page
    if (!token) {
      console.log("No token found, redirecting to signin.");
      router.replace("/auth/signin");
      return;
    }

    try {
      const decodedToken = decodeJWT(token); // Decode the token

      if (decodedToken) {
        console.log("Decoded Token:", decodedToken);

        const { role } = decodedToken;

        if (role) {
          setLoading(false); // Stop loading before redirecting

          switch (role) {
            case "admin":
              router.replace("/admin/dashboard");
              break;
            case "customer":
              router.replace("/user/dashboard");
              break;
            default:
              console.warn("Unknown role, redirecting to signin.");
              router.replace("/auth/signin");
          }
        } else {
          console.warn("Invalid token, redirecting to signin.");
          router.replace("/auth/signin");
        }
      } else {
        // If decoding fails, redirect to sign-in
        console.error("Token decoding failed, redirecting to signin.");
        router.replace("/auth/signin");
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      setError("An error occurred during token validation.");
      router.replace("/auth/signin");
    }
  }, [router]);

  if (loading) {
    // Show a loading spinner until the authentication check is completed
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  // In case of error or no valid token, we redirect, no need to render further
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // This part is handled by redirect logic, so it will not return any other content.
  return null;
}

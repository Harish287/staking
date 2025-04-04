"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/slices/store";
import { registerUser,resendConfirmationEmail  } from "../../../store/slices/index";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import Logo from "../../../assets/logo2x.png";
import { useRouter, useSearchParams } from "next/navigation";


type FormData = {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
  mobile: string;
  referral_token?: string;
};

const RegisterPage: React.FC = () => {
  const searchParams = useSearchParams();
  const params: { [key: string]: string } = {};

  searchParams.forEach((value, key) => {
    if (key === "token") {
      params["referral_token"] = value;
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>();

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showResend, setShowResend] = useState(true);
  const [email, setEmail] = useState("");

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setShowResend(true); // Keep the Resend button visible
  
    if (data.password !== data.confirm_password) {
      setError("confirm_password", {
        type: "manual",
        message: "Passwords do not match",
      });
      setLoading(false);
      return;
    }
  
    const finalData = {
      ...data,
      referral_token: params.referral_token,
    };
  
    try {
      await dispatch(registerUser(finalData)).unwrap();
      setEmail(data.email); // Store email for later use
      alert("A verification email has been sent. Please check your inbox and verify your email to complete registration.");
      router.push(""); // Redirect to another page
    } catch (error: any) {
      console.error("Registration error:", error);
  
      // Show Resend button only if the backend says email verification is needed
      if (error.detail?.toLowerCase().includes("verify your email")) {
        setShowResend(true);
      }
  
      alert(error.detail || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  const [resendLoading, setResendLoading] = useState(false);

  const handleResendEmail = async (email: string) => {
    setResendLoading(true); // Show loading spinner

    try {
      await dispatch(resendConfirmationEmail({ email })).unwrap();
      alert("A new verification email has been sent.");
    } catch (error: any) {
      console.error("Error resending email:", error);
      alert(error || "Failed to resend email. Please try again later.");
    } finally {
      setResendLoading(false); // Hide loading spinner
    }

  };
  
  return (
    <div className="flex justify-center items-center lg:px-[160px] p-0 lg:py-[50px]">
      <div className="text-white w-[auto] h-[auto] bg-gradient-to-r from-pink-700 to-gray-800 flex container justify-center rounded-2xl">
        <div className="hidden w-1/2 relative overflow-hidden p-[50px] rounded-2xl lg:items-center bg-black lg:flex">
          <div>
            <Image src={Logo} alt="Logo" className="mx-auto mb-5" />
            <h1 className="text-2xl font-bold text-center">KAIT Staking</h1>
            <p className="mt-5 text-[15px] text-white">
              Our vision is to disrupt the current financial landscape and give
              everyday investors more control over their financial futures.
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center bg-transparent bg-gradient-to-r from-pink-700 to-gray-800 p-12 w-full lg:w-1/2 lg:mr-[30px] rounded-2xl">
          <Image src={Logo} alt="Logo" className="mx-auto mb-5" />
          <h1 className="text-2xl font-semibold pb-2">Sign Up</h1>

          <form className="w-full max-w-sm" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label htmlFor="name" className="block font-medium text-white">
                Name
              </label>
              <input
                className="w-full border text-white border-gray-300 rounded-md px-3 py-2 mt-1 focus:ring-2 focus:ring-pink-600"
                type="text"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block font-medium text-white">
                Email
              </label>
              <input
                className="w-full border text-white border-gray-300 rounded-md px-3 py-2 mt-1 focus:ring-2 focus:ring-pink-600"
                type="email"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block font-medium text-white">
                Password
              </label>
              <input
                className="w-full border text-white border-gray-300 rounded-md px-3 py-2 mt-1 focus:ring-2 focus:ring-pink-600"
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters long" },
                })}
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="confirm_password" className="block font-medium text-white">
                Confirm Password
              </label>
              <input
                className="w-full border text-white border-gray-300 rounded-md px-3 py-2 mt-1 focus:ring-2 focus:ring-pink-600"
                type="password"
                {...register("confirm_password", {
                  required: "Please confirm your password",
                })}
              />
              {errors.confirm_password && (
                <p className="text-red-500 text-sm">{errors.confirm_password.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="mobile" className="block font-medium text-white">
                Mobile
              </label>
              <input
                className="w-full border text-white border-gray-300 rounded-md px-3 py-2 mt-1 focus:ring-2 focus:ring-pink-600"
                type="tel"
                {...register("mobile", { required: "Mobile number is required" })}
              />
              {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile.message}</p>}
            </div>
       
   
            <button type="submit" className="w-full bg-gradient-to-r from-pink-700 to-gray-800 text-white font-semibold py-2 rounded-md mt-4 hover:scale-105" disabled={loading}>
              {loading ? <Spinner /> : "Sign Up"}
            </button>
          </form>
         {showResend && (
            <div className="mt-4">
              <button
                 className="w-full bg-red-500 text-white font-semibold py-2 rounded-md mt-4"
                onClick={() => handleResendEmail(email)}
                disabled={resendLoading}
              >
                {resendLoading ? <Spinner /> : "Resend Confirmation Email"}
              </button>
            </div>
          )}
       
          <p className="text-white text-sm mt-4">
            Already have an account?{" "}
            <a href="/auth/signin" className="text-pink-700 font-semibold hover:underline">
              Sign in here
            </a>
          </p>
        </div>
      </div>
             
    </div>
  );
};

export default RegisterPage;

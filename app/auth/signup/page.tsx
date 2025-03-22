"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/auth-slice/store"; // Update with your Redux store path
import { registerUser } from "../../../redux/auth-slice";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import Logo from "../../../assets/logo2x.png";
import { useRouter, useSearchParams } from "next/navigation";

type FormData = {
  name: string;
  email: string;
  password: string;
  mobile: string;
  referral_token?: string;
};

const RegisterPage: React.FC = () => {
  const searchParams = useSearchParams();

  const params: { [key: string]: string } = {};

  // Extract query params from the URL
  searchParams.forEach((value, key) => {
    if (key === 'token') {
      params['referral_token'] = value; // Assign the token value to referral_token
    }
  });

  console.log("Extracted referral_token:", params.referral_token); // For debugging purposes

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter(); // Initialize the router

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setMessage("");

    // Ensure referral_token is passed only if it exists
    const finalData = {
      ...data,
      referral_token: params.referral_token, // referral_token from URL param
    };

    try {
      const response = await dispatch(registerUser(finalData)).unwrap();
      setMessage("Registration successful!");

      // Navigate to login page on success
      router.push("/auth/signin"); // This will redirect to the login page after successful registration
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Registration failed. Please try again.";

      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center lg:px-[160px] p-0 lg:py-[50px]">
      <div className="text-white w-[auto] h-[auto] bg-gradient-to-r from-pink-700 to-gray-800 flex container justify-center rounded-2xl">
        {/* Left Side */}
        <div className="hidden w-1/2 relative overflow-hidden p-[50px] rounded-2xl lg:items-center bg-black lg:flex">
          <div>
            <Image src={Logo} alt="Logo" className="mx-auto mb-5" />
            <h1 className="text-2xl font-bold text-center">KAIT Staking</h1>
            <p className="mt-5  text-[15px] text-white">
              Our vision is to disrupt the current financial landscape and give
              everyday investors more control over their financial futures. We are
              focused on building this platform so that anyone can benefit from
              the Technology behind Crypto Assets by making investing in
              cryptocurrencies more accessible and secure for everyone.
            </p>
            <br />
            <p className=" text-[15px] text-white">
              With our platform, investors will have the ability to invest in the
              KAIT Coin and Its token of their choice at prices which are more
              representative of the underlying value of the asset and limit
              exposure to market volatility.
            </p>
          </div>
        </div>

        {/* Right Side (Register Form) */}
        <div className="flex flex-col justify-center items-center bg-transparent bg-gradient-to-r from-pink-700 to-gray-800 p-12 w-full lg:w-1/2 lg:mr-[30px] rounded-2xl">
          <Image src={Logo} alt="Logo" className="mx-auto mb-5" />
          <h1 className="text-2xl font-semibold pb-2">Sign Up</h1>
          <p className="text-lg text-white pb-6">with your KAIT Staking Account</p>

          <form className="w-full max-w-sm" onSubmit={handleSubmit(onSubmit)}>
            {message && <p className="text-center text-red-500">{message}</p>}

            <div className="mb-4">
              <label htmlFor="name" className="block font-medium text-white">
                Name
              </label>
              <input
                className="w-full border text-white border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-pink-600"
                type="text"
                id="name"
                placeholder="Enter your full name"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block font-medium text-white">
                Email
              </label>
              <input
                className="w-full border text-white border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-pink-600"
                type="email"
                id="email"
                placeholder="Enter your email"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block font-medium text-white">
                Password
              </label>
              <input
                className="w-full border text-white border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-pink-600"
                type="password"
                id="password"
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters long" },
                })}
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="mobile" className="block font-medium text-white">
                Mobile
              </label>
              <input
                className="w-full border text-white border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-pink-600"
                type="tel"
                id="mobile"
                placeholder="Enter your mobile number"
                {...register("mobile", { required: "Mobile number is required" })}
              />
              {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile.message}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-700 to-gray-800 text-white font-semibold py-2 rounded-md mt-4 transition-transform transform hover:scale-105"
              disabled={loading}
            >
              {loading ? <Spinner /> : "Sign Up"}
            </button>
          </form>

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

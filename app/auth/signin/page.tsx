
"use client";

import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { loginUser, checkAuth, setUser } from "../../../redux/auth-slice";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { decodeJWT } from "../../../lib/auth";
import Image from "next/image";
import Logo from "../../../assets/logo2x.png";
import { Spinner } from "@/components/ui/spinner";

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { isAuthenticated, isLoading, user } = useAppSelector(
    (state) => state.auth
  );

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const token = Cookies.get("token") || localStorage.getItem("token");

    if (token && isClient) {
      const decodedToken = decodeJWT(token);

      if (decodedToken) {
        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedToken.exp < currentTime) {
          handleLogout();
        } else {
          dispatch(checkAuth())
            .unwrap()
            .then((response) => {
              if (response.user) {
                dispatch(setUser(response.user));

                if (response.user.user_role === "Administrator") {
                  if (pathname !== "/admin/dashboard") {
                    router.push("/admin/dashboard");
                  }
                } else {
                  if (pathname !== "/user/dashboard") {
                    router.push("/user/dashboard");
                  }
                }
              }
            })
            .catch(() => handleLogout());
        }
      }
    } else {
      router.push("/auth/signin");
    }
  }, [dispatch, router, pathname, isClient]);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (
        user.user_role === "Administrator" &&
        pathname !== "/admin/dashboard"
      ) {
        router.push("/admin/dashboard");
      } else if (
        user.user_role !== "Administrator" &&
        pathname !== "/user/dashboard"
      ) {
        router.push("/user/dashboard");
      }
    }
  }, [isAuthenticated, user, router, pathname]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    dispatch(loginUser({ email, password }))
      .unwrap()
      .then((response) => {
        if (response.access_token) {

          if (rememberMe) {
            Cookies.set("token", response.access_token, { expires: 365 });
          } else {
            localStorage.setItem("token", response.access_token);
          }

          const decodedToken = decodeJWT(response.access_token);

          if (decodedToken) {
            dispatch(setUser(decodedToken));

            setTimeout(() => {
              if (decodedToken.user_role === "Administrator") {
                router.push("/admin/dashboard");
              } else {
                router.push("/user/dashboard");
              }
            }, 100);
          } else {
            setLoginError("Failed to decode the token. Please try again.");
          }
        }
      })
      .catch((err) => {
        setLoginError(err || "Login failed. Please check your credentials.");
        setShowErrorPopup(true);
      });
  };

  const handleLogout = () => {
    Cookies.remove("token");
    localStorage.removeItem("token");
    dispatch(setUser(null));
    router.push("/auth/signin");
  };

  return (
    <div className="flex justify-center items-center lg:px-[100px] p-0 lg:py-[50px]">
    <div className="  text-white bg-gradient-to-r from-pink-700 to-gray-800 w-[80%] flex container mx-auto justify-center rounded-2xl">
      {/* Left Side */}
      <div className="hidden w-1/2 relative overflow-hidden p-[50px] rounded-2xl lg:items-center bg-black lg:flex">
        <div>
          <Image src={Logo} alt="Logo" className="mx-auto mb-5" />
          <h1 className="text-2xl font-bold text-center">KAIT Staking</h1>
          <p className="mt-5 text-[15px] text-white ">
            Our vision is to disrupt the current financial landscape and give
            everyday investors more control over their financial futures. We are
            focused on building this platform so that anyone can benefit from
            the Technology behind Crypto Assets by making investing in
            cryptocurrencies more accessible and secure for everyone.
          </p>
          <br />
          <p>
            With our platform, investors will have the ability to invest in the
            KAIT Coin and Its token of their choice at prices which are more
            representative of the underlying value of the asset and limit
            exposure to market volatility.
          </p>
        </div>
      </div>


      <div className="flex flex-col justify-center items-center bg-transparent bg-gradient-to-r from-pink-700 to-gray-800 p-12 w-full lg:w-1/2 lg:mr-[30px] rounded-2xl">
        <Image src={Logo} alt="Logo" className="mx-auto mb-5" />
        <h1 className="text-3xl font-semibold pb-2">Sign In</h1>
        <p className="text-lg text-white pb-6">
          with your KAIT Staking Account
        </p>

        <form className="w-full max-w-sm" onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block font-medium text-white">
              Email
            </label>
            <input
              className="w-full border text-white border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-pink-600"
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>


          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="mr-2"
            />
            <label htmlFor="rememberMe" className="text-white">Remember Me</label>
          </div>

          <button
            className="w-full bg-gradient-to-r from-pink-700 to-gray-800 text-white font-semibold py-2 rounded-md mt-4 transition-transform transform hover:scale-105"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? <Spinner /> : "Sign In"}
          </button>
        </form>

        <p className="text-white text-sm mt-4">
          Don’t have an account
          <a
            href="/auth/signup"
            className="text-pink-700 font-semibold hover:underline"
          >
            Sign up here
          </a>
        </p>
      </div>

      {showErrorPopup && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg text-center">
            <h2 className="text-xl font-bold text-red-600">Login Failed</h2>
            <p className="text-gray-700 mt-2">{loginError}</p>
            <button
              className="mt-4 bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700"
              onClick={() => setShowErrorPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default LoginPage;


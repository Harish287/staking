"use client";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/slices/store";
import { resendConfirmationEmail } from "../../../store/slices/index"; 
import { RootState } from "@/store/slices/store"; 
import { useState } from "react";

const RegisterPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user); 
  const [showResend, setShowResend] = useState(false);

  const handleResendEmail = async () => {
    if (user?.email) {
      try {
        await dispatch(resendConfirmationEmail({ email: user.email })).unwrap();
        alert("Verification email resent! Please check your inbox.");
        setShowResend(false);
      } catch (error) {
        alert("Failed to resend verification email.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center lg:px-[160px] p-0 lg:py-[50px]">
      {/* Your form components here */}
      {showResend && (
        <button
          onClick={handleResendEmail}
          className="mt-4 text-pink-400 underline hover:text-pink-600"
        >
          Resend Verification Email
        </button>
      )}
    </div>
  );
};

export default RegisterPage;

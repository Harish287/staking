import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generateReferralLink } from "../../../redux/auth-slice";
import { store } from "@/redux/auth-slice/store";
import { ClipboardCopy } from "lucide-react";

interface AuthState {
  referralLink: string | null;
  isLoading: boolean;
  error: string | null;
}

const ReferralComponent: React.FC = () => {
  const dispatch = useDispatch<typeof store.dispatch>();
  const { referralLink, isLoading, error } = useSelector(
    (state: { auth: AuthState }) => state.auth
  );

  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  useEffect(() => {
    dispatch(generateReferralLink());
  }, [dispatch]);

  const handleCopy = () => {
    if (referralLink) {
      // Concatenate the base URL with the referral token
      const referralUrl = `http://localhost:3000/auth/signup?token=${referralLink}`;
      navigator.clipboard.writeText(referralUrl).then(
        () => {
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000); // Reset after 2 seconds
        },
        (err) => {
          console.error("Failed to copy: ", err);
        }
      );
    }
  };

  return (
    <div>
      {isLoading && <p>Loading referral link...</p>}
      {referralLink && (
        <div className="flex justify-center items-center">
          <span className="m-0 w-full overflow-hidden text-ellipsis whitespace-nowrap">
            {`http://localhost:3000/auth/signup?token=${referralLink}`} {/* Display full URL */}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center px-4 py-2 rounded-md"
          >
            {copySuccess ? "Copied!" : <ClipboardCopy />} {/* Correct ternary usage */}
          </button>
        </div>
      )}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default ReferralComponent;

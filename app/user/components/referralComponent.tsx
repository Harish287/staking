// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { generateReferralLink } from "../../../redux/auth-slice";
// import { AppDispatch, RootState } from "../../../redux/auth-slice/store";
// import { ClipboardCopy } from "lucide-react";

// const ReferralComponent: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { referralLink, isLoading, error, user } = useSelector(
//     (state: RootState) => ({
//       referralLink: state.auth.referralLink,
//       isLoading: state.auth.isLoading,
//       error: state.auth.error,
//       user: state.auth.user,
//     })
//   );

//   const [copySuccess, setCopySuccess] = useState(false);

//   useEffect(() => {
//     if (user?.kycVerified) {
//       dispatch(generateReferralLink());
//     }
//   }, [dispatch, user?.kycVerified]);

//   const handleCopy = () => {
//     if (referralLink) {
//       const referralUrl = `http://localhost:3000/auth/signup?token=${referralLink}`;
//       navigator.clipboard.writeText(referralUrl).then(() => {
//         setCopySuccess(true);
//         setTimeout(() => setCopySuccess(false), 2000);
//       });
//     }
//   };

//   return (
//     <div className="text-center">
//       {isLoading ? (
//         <p>Loading referral link...</p>
//       ) : !user?.kycVerified ? (
//         <p className="text-red-500 font-bold">KYC not verified</p>
//       ) : referralLink ? (
//         <div className="flex justify-center items-center gap-2 bg-gray-100 p-2 rounded-lg">
//           <span className="truncate w-full text-blue-600 font-medium">
//             {`http://localhost:3000/auth/signup?token=${referralLink}`}
//           </span>
//           <button
//             onClick={handleCopy}
//             className="flex items-center px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-700"
//           >
//             {copySuccess ? "Copied!" : <ClipboardCopy />}
//           </button>
//         </div>
//       ) : (
//         error && <p className="text-red-500">Error: {error}</p>
//       )}
//     </div>
//   );
// };

// export default ReferralComponent;


import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateReferralLink } from '../../../store/slices/index';
import { AppDispatch, RootState } from '../../../store/slices/store';
import { ClipboardCopy } from 'lucide-react';

const ReferralComponent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { referralLink, isLoading, error } = useSelector((state: RootState) => state.auth);

  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    dispatch(generateReferralLink());
  }, [dispatch]);

  const handleCopy = () => {
    if (referralLink) {
      const referralUrl = `http://localhost:3000/auth/signup?token=${referralLink}`;
      navigator.clipboard.writeText(referralUrl).then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      });
    }
  };

  return (
    <div className="text-center">
      {isLoading ? (
        <p>Loading referral link...</p>
      ) : referralLink ? (
        <div className="flex justify-center items-center gap-2  p-2 rounded-lg">
          <span className="truncate w-full  font-medium">
            {`http://localhost:3000/auth/signup?token=${referralLink}`}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-700"
          >
            {copySuccess ? 'Copied!' : <ClipboardCopy />}
          </button>
        </div>
      ) : (
        error && <p className="text-red-500">Error: {error}</p>
      )}
    </div>
  );
};

export default ReferralComponent;

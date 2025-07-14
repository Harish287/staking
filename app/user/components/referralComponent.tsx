'use client'

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { generateReferralLink } from '../../../store/slices/index'
import { AppDispatch, RootState } from '../../../store/store'
import { ClipboardCopy } from 'lucide-react'

const ReferralComponent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { referralLink, isLoading, error } = useSelector(
    (state: RootState) => state.auth,
  )

  const [copySuccess, setCopySuccess] = useState(false)

  useEffect(() => {
    dispatch(generateReferralLink())
  }, [dispatch])

  const handleCopy = () => {
    if (referralLink) {
      const referralUrl = `http://localhost:3000/auth/signup?token=${referralLink}`
      navigator.clipboard.writeText(referralUrl).then(() => {
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      })
    }
  }

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
            className="flex items-center px-3 py-1  bg-gradient-to-r from-blue-500 to-purple-700  hover:cursor-pointer text-white rounded-md hover:bg-blue-700"
          >
            {copySuccess ? 'Copied!' : <ClipboardCopy />}
          </button>
        </div>
      ) : (
        error && <p className="text-red-500">Error: {error}</p>
      )}
    </div>
  )
}

export default ReferralComponent

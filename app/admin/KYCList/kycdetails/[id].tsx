'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../store/store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const KycDetails = ({ params }: { params: { id: string } }) => {
  const router = useRouter()
  const { id } = params

  const kycApplications = useSelector(
    (state: RootState) => state.auth?.kycApplications ?? [],
  )

  const kycData = kycApplications.find((app) => app.user_id === id)

  if (!kycData) {
    return <p className="text-red-500">KYC data not found.</p>
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
      <Card className="p-6 shadow-xl rounded-xl bg-white w-[80%]">
        <h2 className="text-2xl font-semibold mb-4">KYC Details</h2>
        <p>
          <strong>Name:</strong> {kycData.name}
        </p>
        <p>
          <strong>Username:</strong> {kycData.user_name}
        </p>
        <p>
          <strong>User ID:</strong> {kycData.user_id}
        </p>
        <p>
          <strong>Document Type:</strong> {kycData.doc_type}
        </p>
        <p>
          <strong>Submitted On:</strong> {kycData.submitted}
        </p>
        <p>
          <strong>Status:</strong> {kycData.status}
        </p>

        <Button className="mt-4" onClick={() => router.back()}>
          Go Back
        </Button>
      </Card>
    </div>
  )
}

export default KycDetails

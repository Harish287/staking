'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchKycData } from '@/store/slices/admin/kycDetails'
import { RootState, AppDispatch } from '@/store/store'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, MoreVertical, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { downloadKycDocument } from '@/store/slices/kycList'
import Link from 'next/link'

const KycDetailsPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const searchParams = useSearchParams()

  const getMimeTypeFromFileName = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    switch (ext) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg'
      case 'png':
        return 'image/png'
      case 'pdf':
        return 'application/pdf'
      default:
        return 'application/octet-stream'
    }
  }

  const userId = searchParams.get('userId')
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('token') || getCookie('token')
      : null

  const { kycData, status, error } = useSelector(
    (state: RootState) => state.fetchKycData,
  )

  const [isZoomOpen, setIsZoomOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const openZoom = (file: string) => {
    setSelectedImage(file)
    setIsZoomOpen(true)
  }

  const closeZoom = () => {
    setIsZoomOpen(false)
    setSelectedImage(null)
  }

  const handleDownload = (userId: string, documentName: string) => {
    dispatch(
      downloadKycDocument({ user_id: userId, document_name: documentName }),
    )
  }

  useEffect(() => {
    if (userId && token) {
      dispatch(fetchKycData({ user_id: userId, token }))
    }
  }, [dispatch, userId, token])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (status === 'failed') {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Error: {typeof error === 'string' ? error : error?.detail}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Card className="max-w-5xl mx-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <Button variant="ghost" className="p-2">
                <Link href="http://localhost:3000/admin/KYCList">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <h1 className="text-xl font-semibold text-indigo-900">
                KYC Information of {kycData?.first_name} {kycData?.last_name}
              </h1>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Download Details</DropdownMenuItem>
                <DropdownMenuItem>Print</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="grid grid-cols-4 gap-6 p-4 bg-gray-50 rounded-lg mb-8">
            <div>
              <div className="text-sm text-gray-500">Submitted By</div>
              <div className="font-medium">{kycData?.user_name}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Checked By</div>
              <div className="font-medium">{kycData?.kyc_reviewed_by}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Checked On</div>
              <div className="font-medium">{kycData?.kyc_reviewed_at}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Status</div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium 
    ${
      kycData?.kyc_status === 'Approved'
        ? 'bg-green-100 text-green-800'
        : kycData?.kyc_status === 'Rejected'
          ? 'bg-red-100 text-red-800'
          : 'bg-yellow-100 text-yellow-800'
    }`}
              >
                {kycData?.kyc_status?.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Personal Information */}
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">PERSONAL INFORMATION</h2>
            <div className="grid grid-cols-1 gap-4">
              {[
                { label: 'First Name', value: kycData?.first_name },
                { label: 'Last Name', value: kycData?.last_name },
                { label: 'Email Address', value: kycData?.email },
                { label: 'Phone Number', value: kycData?.mobile },
                { label: 'Date of Birth', value: kycData?.dob },
                {
                  label: 'Address',
                  value: `${kycData?.address_1}, ${kycData?.address_2}`,
                },
                {
                  label: 'State & City',
                  value: ` ${kycData?.state}, ${kycData?.city} `,
                },
                { label: 'Postal Code ', value: kycData?.postal_code },

                { label: 'Country of Residence', value: kycData?.country },
              ].map((field, index) => (
                <div key={index} className="grid grid-cols-3 border-b py-3">
                  <div className="text-gray-600">{field.label}</div>
                  <div className="col-span-2">{field.value}</div>
                </div>
              ))}
            </div>
          </div>
          <h2 className="text-lg font-medium mt-8 mb-4">BANK INFORMATION</h2>
          <div className="grid grid-cols-1 gap-4">
            {[
              { label: 'Bank Name', value: kycData?.bank_data?.bank_name },
              {
                label: 'Account Type',
                value: kycData?.bank_data?.account_type,
              },
              {
                label: 'Account Number',
                value: kycData?.bank_data?.account_no,
              },
              { label: 'IFSC Code', value: kycData?.bank_data?.ifsc_code },
            ].map((field, index) => (
              <div key={index} className="grid grid-cols-3 border-b py-3">
                <div className="text-gray-600">{field.label}</div>
                <div className="col-span-2">{field.value || '—'}</div>
              </div>
            ))}
          </div>

          {kycData?.kyc_files && kycData.kyc_files.length > 0 && (
            <div>
              <h2 className="text-lg font-medium mb-4 mt-5">
                UPLOADED DOCUMENTS
              </h2>
              <div className="grid grid-cols-3 gap-6">
                {kycData.kyc_files.map((file, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">{file.file_name}</h3>
                    <div
                      className="aspect-video bg-gray-100 rounded-lg mb-2 cursor-pointer"
                      onClick={() => openZoom(file.file)}
                    >
                      <img
                        src={`data:image/png;base64,${file.file}`}
                        alt={file.file_name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="text-sm text-gray-500">
                      {file.file_name}
                    </div>

                    <Button
                      variant="link"
                      className="text-blue-600 text-xs hover:text-blue-800"
                      onClick={() => {
                        const mimeType = getMimeTypeFromFileName(file.file_name)
                        const byteCharacters = atob(file.file)
                        const byteNumbers = Array.from(byteCharacters).map(
                          (c) => c.charCodeAt(0),
                        )
                        const byteArray = new Uint8Array(byteNumbers)
                        const blob = new Blob([byteArray], { type: mimeType })

                        const blobUrl = URL.createObjectURL(blob)

                        const link = document.createElement('a')
                        link.href = blobUrl
                        link.download =
                          file.file_name_download ||
                          file.file_name ||
                          'document'
                        link.click()

                        URL.revokeObjectURL(blobUrl)
                      }}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Zoom Modal */}
          {isZoomOpen && selectedImage && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="relative bg-white p-4 rounded-lg max-w-4xl max-h-full overflow-auto">
                <button
                  className="absolute hover:cursor-pointer top-2 right-1 text-black shadow-2xs bg-gray-50 p-2 w-10 h-10 rounded-3xl"
                  onClick={closeZoom}
                >
                  ✖
                </button>
                <img
                  src={`data:image/jpeg;base64,${selectedImage}`}
                  alt="Zoomed Image"
                  className="max-w-full max-h-[90vh] object-contain"
                />
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))
  return match ? decodeURIComponent(match[2]) : null
}

export default KycDetailsPage

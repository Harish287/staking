'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../../../store/store'
import {
  submitKyc,
  suggestUsername,
  verifyUsername,
  verifyKYCStatus,
} from '../../../../store/slices/index'
import { Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import toast from 'react-hot-toast'
// import { toast } from 'sonner'

export default function KycVerification() {
  const dispatch = useDispatch<AppDispatch>()
  const {
    isLoading,
    error,
    kycVerified,
    kycStatusLoading,
    kycStatusError,
    kycRejected,
    kycPending,
  } = useSelector((state: RootState) => state.auth)

  const [usernameAvailability, setUsernameAvailability] = useState<
    string | null
  >(null)
  const [suggestedUsernames, setSuggestedUsernames] = useState<string[]>([])
  const [kycStatus, setKycStatus] = useState<string | null>(null)

  useEffect(() => {
    dispatch(verifyKYCStatus())
  }, [dispatch])

  useEffect(() => {
    if (kycVerified) {
      setKycStatus('Your identity has already been verified. Thank you!')
    } else if (kycRejected) {
      setKycStatus(
        'Your KYC application has been rejected. Please resubmit with valid documents.',
      )
    } else if (kycPending) {
      setKycStatus('KYC Application Submitted Successfully')
    } else {
      setKycStatus(null)
    }
  }, [kycVerified, kycRejected])

  const isKycPendingOrSubmitted =
    kycVerified || /pending|waiting for review/i.test(kycStatus ?? '')

  const genders = [
    { id: 'male', label: 'Male' },
    { id: 'female', label: 'Female' },
  ]

  const documentTypes = [
    { id: 'passport', name: 'Passport' },
    { id: 'badge', name: 'Badge' },
    { id: 'licence', name: 'Licence' },
  ]

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    dob: '',
    username: '',
    mobile: '',
    alternate_mobile: '',
    gender: '',
    country: '',
    state: '',
    city: '',
    postal_code: '',
    address_line_1: '',
    address_line_2: '',
    document_type: '',
    document_one: null as File | null,
    document_two: null as File | null,
    document_photo: null as File | null,
  })

  useEffect(() => {
    if (formData.first_name && formData.dob) {
      dispatch(
        suggestUsername({ name: formData.first_name, dob: formData.dob }),
      )
        .then((response) => {
          if (response.payload) setSuggestedUsernames(response.payload)
        })
        .catch(() => setSuggestedUsernames([]))
    }
  }, [formData.first_name, formData.dob, dispatch])

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData({ ...formData, username: value })

    if (!value || value.length < 3) {
      setUsernameAvailability(null)
      return
    }

    dispatch(verifyUsername(value))
      .then((response) => {
        const message = response.payload?.detail
        if (message?.toLowerCase().includes('available')) {
          setUsernameAvailability('✅ Username is available!')
        } else {
          setUsernameAvailability('❌ Username is taken')
        }
      })
      .catch(() => {
        setUsernameAvailability('⚠️ Something went wrong during verification')
      })
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setFormData({ ...formData, [e.target.id]: e.target.value })

  const handleSelectChange = (field: keyof typeof formData, value: string) =>
    setFormData({ ...formData, [field]: value })

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof typeof formData,
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({ ...formData, [field]: e.target.files[0] })
    }
  }

  const handleRemoveFile = (field: keyof typeof formData) =>
    setFormData({ ...formData, [field]: null })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const submissionData = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      if (value) submissionData.append(key, value as Blob | string)
    })

    const toastId = toast.loading('Submitting KYC...')

    dispatch(submitKyc({ formData: submissionData }))
      .then((response) => {
        toast.dismiss(toastId)
        const detail = response.payload?.detail?.toLowerCase()

        if (detail?.includes('waiting for review')) {
          setKycStatus('Your KYC Application is waiting for review')
          toast.success('KYC submitted successfully!')
        } else if (detail?.includes('rejected')) {
          setKycStatus('Your KYC application was rejected.')
          toast.error('KYC was rejected. Please try again.')
        } else {
          toast.error(
            'Submission failed. Please check your details and try again.',
          )
        }
      })
      .catch(() => {
        toast.dismiss(toastId)
        toast.error('Something went wrong during submission.')
      })
  }

  if (isKycPendingOrSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            KYC Application Status
          </h2>
          <p className="text-gray-700 mt-2">{kycStatus}</p>
        </div>
      </div>
    )
  }

  

  return (
    <div className="max-w-3xl mt-6 w-full mx-auto bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-2xl font-semibold text-center text-gray-900 mb-4">
        KYC Verification
      </h1>

      {error && (
        <Alert className="bg-red-50 text-red-600">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {kycStatus && (
        <p className="text-sm text-red-500 mb-4 text-center">{kycStatus}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {[
            ['first_name', 'First Name *'],
            ['last_name', 'Last Name *'],
            ['dob', 'Date of Birth *', 'date'],
            ['mobile', 'Mobile *'],
            ['alternate_mobile', 'Alternate Mobile'],
            ['country', 'Country *'],
            ['state', 'State *'],
            ['city', 'City *'],
            ['postal_code', 'Postal Code *'],
          ].map(([id, label, type = 'text']) => (
            <div key={id}>
              <Label htmlFor={id}>{label}</Label>
              <Input
                id={id}
                type={type}
                onChange={handleInputChange}
                required
              />
            </div>
          ))}

          <div>
            <Label htmlFor="gender">Gender *</Label>
            <Select onValueChange={(val) => handleSelectChange('gender', val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {genders.map((g) => (
                  <SelectItem key={g.id} value={g.id}>
                    {g.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="username">Username *</Label>
            <div className="relative">
              <Input
                id="username"
                value={formData.username}
                onChange={handleUsernameChange}
                required
              />
              {usernameAvailability && (
                <p className="text-sm text-gray-600">{usernameAvailability}</p>
              )}
              {suggestedUsernames.length > 0 && (
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="absolute right-2 top-2 text-sm text-blue-600 underline"
                    >
                      Suggestions
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-full bg-white">
                    <Select
                      onValueChange={(value) =>
                        setFormData({ ...formData, username: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pick a username" />
                      </SelectTrigger>
                      <SelectContent>
                        {[...new Set(suggestedUsernames)].map((name) => (
                          <SelectItem key={name} value={name}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="address_line_1">Address Line 1 *</Label>
          <Textarea id="address_line_1" onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="address_line_2">Address Line 2</Label>
          <Textarea id="address_line_2" onChange={handleInputChange} />
        </div>

        <div>
          <Label htmlFor="document_type">Document Type *</Label>
          <Select
            onValueChange={(val) => handleSelectChange('document_type', val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select document type" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {documentTypes.map((doc) => (
                <SelectItem key={doc.id} value={doc.id}>
                  {doc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          {[
            ['document_one', 'Front Document One *'],
            ['document_two', 'Back Document Two'],
            [
              'document_photo',
              'Upload Your Photo with holding Document in your hand *',
            ],
          ].map(([id, label]) => (
            <FileUpload
              key={id}
              id={id}
              label={label}
              file={formData[id as keyof typeof formData] as File | null}
              onFileChange={handleFileChange}
              onRemove={handleRemoveFile}
            />
          ))}
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8"
            disabled={isLoading}
          >
            {isLoading ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </form>
    </div>
  )
}

function FileUpload({
  id,
  label,
  file,
  onFileChange,
  onRemove,
}: {
  id: string
  label: string
  file: File | null
  onFileChange: any
  onRemove: any
}) {
  return (
    <div className="border-2 border-dashed p-4 text-center relative">
      <input
        id={id}
        type="file"
        className="hidden"
        onChange={(e) => onFileChange(e, id)}
      />
      {!file ? (
        <label htmlFor={id} className="cursor-pointer">
          <Upload className="h-12 w-12 text-gray-400 mb-2" />
          <p className="text-blue-600">{label}</p>
        </label>
      ) : (
        <div className="flex items-center justify-between p-2 bg-gray-100 rounded-lg">
          <span className="text-gray-800 truncate">{file.name}</span>
          <button
            type="button"
            onClick={() => onRemove(id)}
            className="text-red-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  )
}

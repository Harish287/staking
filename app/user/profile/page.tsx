'use client'

import { useState, useEffect } from 'react'
import { CheckCheck, Copy, QrCode } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription } from '@/components/ui/card'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchUserProfile,
  updateUserProfile,
} from '../../../store/slices/profileAPI'
import { RootState, AppDispatch } from '../../../store/store'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Possword from './password'
import NomineeComponent from './nominee'
import BankAccountPage from './bankAccount'
import ReferralComponent from '../components/referralComponent'

export default function ProfileDetails() {
  const [activeTab, setActiveTab] = useState('PERSONAL')
  const [copied, setCopied] = useState(false)
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const dispatch = useDispatch<AppDispatch>()
  const { userprofile, isLoading, error } = useSelector(
    (state: RootState) => state.profile.profile,
  )

  const { user } = useSelector((state: RootState) => state.auth)

  const [firstName, setFirstName] = useState(userprofile?.first_name || '')
  const [lastName, setLastName] = useState(userprofile?.last_name || '')
  const [dob, setDob] = useState(userprofile?.dob || '')

  const handleSubmit = async () => {
    if (!firstName || !lastName || !dob) {
      toast.error('All fields are required.')
      return
    }

    const updatedData = {
      first_name: firstName,
      last_name: lastName,
      dob: dob,
    }
    setIsButtonDisabled(true)

    try {
      const response = await dispatch(updateUserProfile(updatedData))

      if (response.payload?.details) {
        toast.success(response.payload.details)
        localStorage.setItem('profileUpdateStatus', 'success')
      } else {
        toast.error('Something went wrong!')
        localStorage.setItem('profileUpdateStatus', 'error')
      }

      setTimeout(() => {
        dispatch(fetchUserProfile())
      }, 1000)
    } catch (error) {
      toast.error('Failed to update profile!')
      localStorage.setItem('profileUpdateStatus', 'error')
    } finally {
      setIsButtonDisabled(false)
    }
  }

  const checkChanges = () => {
    const hasChanges =
      firstName !== userprofile?.first_name ||
      lastName !== userprofile?.last_name ||
      dob !== userprofile?.dob
    setIsButtonDisabled(!hasChanges)
  }

  useEffect(() => {
    dispatch(fetchUserProfile())

    const storedStatus = localStorage.getItem('profileUpdateStatus')
    if (storedStatus === 'success') {
      toast.success('Profile updated successfully!')
      localStorage.removeItem('profileUpdateStatus')
    } else if (storedStatus === 'error') {
      toast.error('Failed to update profile.')
      localStorage.removeItem('profileUpdateStatus')
    }
  }, [dispatch])

  useEffect(() => {
    if (userprofile) {
      setFirstName(userprofile.first_name || '')
      setLastName(userprofile.last_name || '')
      setDob(userprofile.dob || '')
    }
  }, [userprofile])

  useEffect(() => {
    checkChanges()
  }, [firstName, lastName, dob])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!userprofile) {
    return <div>No user data found.</div>
  }

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card className="p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Profile Details</h2>
              
              <CardContent>
              <CardDescription>Your Referral Link</CardDescription>
              <Card className="h-[30px] flex justify-center items-center">
                <div className="flex justify-center items-center w-[300px] h-full">
                  <span className="m-0 w-full overflow-hidden text-ellipsis whitespace-nowrap">
                    <ReferralComponent />
                  </span>
                </div>
              </Card>
            </CardContent>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="border-b w-full justify-start rounded-none gap-8">
                {[
                  'PERSONAL',
                  'NOMINEE',
                  'SETTINGS',
                  'PASSWORD',
                  'TRANS.PWD',
                  'BANK',
                ].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className={`pb-2 ${
                      activeTab === tab
                        ? 'text-red-600 border-b-2 border-red-600'
                        : 'text-gray-500'
                    }`}
                  >
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="PERSONAL" className="space-y-6 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">First Name</label>
                    <Input
                      // value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      defaultValue={userprofile?.first_name} // Default value
                    />
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">Last Name</label>
                    <Input
                      // value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      defaultValue={userprofile?.last_name} // Default value
                    />
                  </div>

                  {/* Email Address (Read Only) */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">
                      Email Address
                    </label>
                    <Input
                      defaultValue={userprofile?.email}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>

                  {/* Mobile Number (Read Only) */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">
                      Mobile Number
                    </label>
                    <Input
                      defaultValue={userprofile?.mobile} // Ensure userprofile has the mobile number
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>

                  {/* Date of Birth */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">
                      Date of Birth
                    </label>
                    <Input
                      type="date"
                      // value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      defaultValue={userprofile?.dob}
                    />
                  </div>
                </div>

                <Button
                  onClick={handleSubmit}
                  className="bg-red-600 hover:bg-red-700 text-white"
                  disabled={isButtonDisabled}
                >
                  Update Profile
                </Button>
              </TabsContent>
              <TabsContent value="NOMINEE" className="space-y-6 pt-6">
                <NomineeComponent />
              </TabsContent>
              <TabsContent value="PASSWORD" className="space-y-6 pt-6">
                <Possword />
              </TabsContent>
              <TabsContent value="BANK" className="space-y-6 pt-6">
                <BankAccountPage />
              </TabsContent>
            </Tabs>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Two-Factor Verification</h2>
            <p className="text-gray-600">
              Two-factor authentication is a method for protection of your
              account. When it is activated you are required to enter not only
              your password, but also a special code. You can receive this code
              in mobile app. Even if third party gets access to your password,
              they still won't be able to access your account without the 2FA
              code.
            </p>
            <div className="flex items-center justify-between">
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                Enable 2FA
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">CURRENT STATUS:</span>
                <Badge variant="secondary">DISABLED</Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Your Account Status</h2>
            <div className="flex gap-2">
              <Badge className="bg-emerald-500">Email Verified</Badge>
              <Badge
                className={`${user?.kycVerified ? 'bg-red-500-500' : 'bg-red-500'}`}
              >
                {user?.kycVerified ? (
                  <>
                    <CheckCheck /> Verified
                  </>
                ) : (
                  'Not Verified'
                )}
              </Badge>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Receiving Wallet</h2>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 break-all">
                0xb9fa443eb0a29245f4c838d49a9656b793f3e644
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  copyToClipboard('0xb9fa443eb0a29245f4c838d49a9656b793f3e644')
                }
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex justify-center">
              <QrCode className="h-32 w-32 text-gray-800" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              Identity Verification - KYC
            </h2>
            <p className="text-gray-600">
              To comply with regulation, participant will have to go through
              identity verification.
            </p>
            <div className="text-emerald-500 font-medium">
              Identity (KYC) has been verified.
            </div>
            <p className="text-gray-600">
              One for our team verified your identity. You are eligible to
              participate in our token sale.
            </p>
            <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
              View KYC
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

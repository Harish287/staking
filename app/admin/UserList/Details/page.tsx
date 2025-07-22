'use client'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { fetchInvestorDetails } from '@/store/slices/admin/investorSlice'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import TeamTreeMUI from '@/components/materialui/TeamTreeMUI'
import WalletManipulationDialog from '../walletmanupulatedialog'

import {
  ArrowLeft,
  MoreVertical,
  QrCode,
  CheckCircle2,
  Pencil,
  Mail,
  Wallet,
  Activity,
  Lock,
  Unlock,
  CreditCard,
  Power,
  MoreHorizontal,
  XCircle,
} from 'lucide-react'
import Link from 'next/link'
import { InvestorDetails } from '@/store/slices/admin/investorSlice'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { updateUserPermission } from '@/store/slices/admin/permisionSlice'
import toast from 'react-hot-toast'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import kaitimg from '../../../../assets/logo2x.png'

export default function InvestorDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  const dispatch = useDispatch<AppDispatch>()
  const { details, detailsLoading, detailsError } = useSelector(
    (state: RootState) => state.investor,
  )
  const searchParams = useSearchParams()
  const userId = searchParams.get('userId')
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const [walletDialogOpen, setWalletDialogOpen] = useState(false)
  const [walletUserId, setWalletUserId] = useState('')
  const [walletType, setWalletType] = useState('')
  const handleWalletManipulation = (userId: string, type: string) => {
    setWalletUserId(userId)
    setWalletType(type)
    setWalletDialogOpen(true)
  }

  console.log('Is window defined:', typeof window !== 'undefined')

  useEffect(() => {
    console.log('Route id:', userId)
    if (userId) {
      dispatch(fetchInvestorDetails(userId))
    }
  }, [userId, dispatch])

  if (detailsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (detailsError) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        {detailsError}
      </div>
    )
  }

  if (!details || !details.user_id) {
    return <div>No investor details available</div>
  }

  interface StatusBadge {
    label: string
    className: string
    condition: boolean
    disabledLabel?: string
  }
  const permissionLabels = {
    transfer: 'Transfer',
    withdraw: 'Withdraw',
    withdraw_staking: 'Withdraw Staking',
    level_income: 'Level Income',
    credit: 'Credit',
    suspend: 'Suspend',
    adhoc_income: 'Adhoc Income',
  } as const

  const getStatusBadges = (details: InvestorDetails): StatusBadge[] => {
    const badges: StatusBadge[] = [
      {
        label: 'Active',
        className: 'bg-green-500 text-white',
        condition: !details.suspend,
        disabledLabel: 'suspend',
      },
      {
        label: 'Transfer Enabled',
        className: 'bg-blue-500 text-white',
        condition: details.transfer,
        disabledLabel: 'Transfer Disabled',
      },
      {
        label: 'Withdraw Enabled',
        className: 'bg-purple-500 text-white',
        condition: details.withdraw,
        disabledLabel: 'Withdraw Disabled',
      },
      {
        label: 'Withdraw Stake Wallet Enable',
        className: 'bg-orange-500 text-white',
        condition: !details.withdraw_staking,
        disabledLabel: 'Withdraw Stake Wallet Disabled',
      },
      {
        label: 'Level Income Enabled',
        className: 'bg-teal-500 text-white',
        condition: !details.level_income_value,
        disabledLabel: 'Level Income Disabled',
      },
      {
        label: 'Adhoc Income Enabled',
        className: 'bg-indigo-500 text-white',
        condition: details.adhoc_income,
        disabledLabel: 'Adhoc Income Disabled',
      },
      {
        label: 'Credit',
        className: 'bg-red-500 text-white',
        condition: details.credit,
        disabledLabel: 'Credit',
      },
    ]

    return badges.map((b) => ({
      ...b,
      label: b.condition ? b.label : b.disabledLabel || b.label,
      className: b.condition ? b.className : 'bg-gray-400 text-white',
    }))
  }
  const handlePermissionChange = async (
    userId: string,
    permissionType: keyof typeof permissionLabels,
    permissionValue: boolean,
  ) => {
    const token = localStorage.getItem('token')

    if (!token) {
      toast.error('Authorization token missing. Please log in again.')
      return
    }

    const userName = details?.full_name || 'User'

    try {
      const resultAction = await dispatch(
        updateUserPermission({
          userId,
          permissionType,
          permissionValue,
          token,
        }),
      )

      if (updateUserPermission.fulfilled.match(resultAction)) {
        toast.success(
          `${permissionLabels[permissionType]} permission ${permissionValue ? 'enabled' : 'disabled'} for ${userName}`,
        )

        dispatch(fetchInvestorDetails(userId))
      } else {
        toast.error(
          `Failed to update ${permissionLabels[permissionType]} permission for ${userName}`,
        )
      }
    } catch (error) {
      console.error('Error updating permission:', error)
      toast.error(
        `An error occurred while updating ${permissionLabels[permissionType]} permission for ${userName}`,
      )
    }
  }

  const statusBadges = getStatusBadges(details)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Card className="max-w-7xl mx-auto bg-white">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <Link href="/admin/UserList">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => router.back()}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-xl font-semibold">
                User Details
                <span className="text-gray-400">› {details.user_name}</span>
              </h1>
            </div>
            <DropdownMenu> 
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                 className="bg-white z-50 max-h-80 overflow-y-auto"
              >
                <DropdownMenuItem>
                  <Pencil className="w-4 h-4 mr-2" /> Update User
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Mail className="w-4 h-4 mr-2" /> Send Email
                </DropdownMenuItem>
                {['KAIT', 'Income', 'Adhoc', 'ROS', 'Restaking'].map(
                  (wallet) => (
                    <DropdownMenuItem
                      key={wallet}
                      onClick={() =>
                        handleWalletManipulation(details.user_id, wallet)
                      }
                    >
                      <Wallet className="w-4 h-4 mr-2" /> {wallet} Wallet -
                      Manipulate
                    </DropdownMenuItem>
                  ),
                )}
                <DropdownMenuItem>
                  <Activity className="w-4 h-4 mr-2" /> Activities
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setOpen(true)}>
                  <Lock className="w-4 h-4 mr-2" /> Reset Password
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    handlePermissionChange(
                      details.user_id,
                      'transfer',
                      !details.transfer,
                    )
                  }
                >
                  {details.transfer ? (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Transfer Disable
                    </>
                  ) : (
                    <>
                      <Unlock className="w-4 h-4 mr-2" />
                      Transfer Enable
                    </>
                  )}
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() =>
                    handlePermissionChange(
                      details.user_id,
                      'withdraw',
                      !details.withdraw,
                    )
                  }
                >
                  {details.withdraw ? (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Withdraw Disable
                    </>
                  ) : (
                    <>
                      <Unlock className="w-4 h-4 mr-2" />
                      Withdraw Enable
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    handlePermissionChange(
                      details.user_id,
                      'withdraw_staking',
                      !details.withdraw_staking,
                    )
                  }
                >
                  {!details.withdraw_staking ? (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Withdraw Staking Disable
                    </>
                  ) : (
                    <>
                      <Unlock className="w-4 h-4 mr-2" />
                      Withdraw Staking Enable
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    handlePermissionChange(
                      details.user_id,
                      'level_income',
                      !details.level_income_value,
                    )
                  }
                >
                  {details.level_income_value ? (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Level Income Suspend
                    </>
                  ) : (
                    <>
                      <Unlock className="w-4 h-4 mr-2" />
                      Level Income Enable
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    handlePermissionChange(
                      details.user_id,
                      'adhoc_income',
                      !details.adhoc_income,
                    )
                  }
                >
                  {details.adhoc_income ? (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Adhoc Income Disable
                    </>
                  ) : (
                    <>
                      <Unlock className="w-4 h-4 mr-2" />
                      Adhoc Income Enable
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    handlePermissionChange(
                      details.user_id,
                      'credit',
                      !details.credit,
                    )
                  }
                >
                  {details.credit ? (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Remove Credit ID
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Set Credit ID
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    handlePermissionChange(
                      details.user_id,
                      'suspend',
                      !details.suspend,
                    )
                  }
                >
                  {!details.suspend ? (
                    <>
                      <Power className="w-4 h-4 mr-2 text-red-600" />
                      Suspend
                    </>
                  ) : (
                    <>
                      <Power className="w-4 h-4 mr-2 text-red-600" />
                      Activate
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Status Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            {statusBadges.map((badge, index) => (
              <span
                key={index}
                className={`px-3 py-1 rounded-full text-xs font-medium ${badge.className}`}
              >
                {badge.label}
              </span>
            ))}
          </div>

          {/* Investment Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="space-y-1 border-2">
              <div className="text-sm text-gray-500 ml-2">Fiat</div>
              <div className="flex items-center gap-2">
                <span className="text-red-500">
                  {' '}
                  <Image
                    src={kaitimg}
                    width={20}
                    height={20}
                    className=" object-contain ml-2"
                    alt="Picture of the author"
                  />
                </span>
                <span className="text-lg font-medium">
                  {details.fiat || '0'}
                </span>
              </div>
            </div>
            <div className="space-y-1 border-2">
              <div className="text-sm text-gray-500 ml-2">Invested</div>
              <div className="flex items-center gap-2">
                <span className="text-red-500">
                  {' '}
                  <Image
                    src={kaitimg}
                    width={20}
                    height={20}
                    className=" object-contain ml-2"
                    alt="Picture of the author"
                  />
                </span>
                <span className="text-lg font-medium">
                  {details.invested || '0'}
                </span>
              </div>
            </div>
            <div className="space-y-1 border-2">
              <div className="text-sm text-gray-500 ml-2">Team Business</div>
              <div className="flex items-center gap-2">
                <span className="text-red-500">
                  {' '}
                  <Image
                    src={kaitimg}
                    width={20}
                    height={20}
                    className=" object-contain ml-2"
                    alt="Picture of the author"
                  />
                </span>
                <span className="text-lg font-medium">
                  {details.team_business || '0'}
                </span>
              </div>
            </div>
            <div className="space-y-1 border-2">
              <div className="text-sm text-gray-500 ml-2">ROI</div>
              <div className="flex items-center gap-2">
                <span className="text-red-500">
                  {' '}
                  <Image
                    src={kaitimg}
                    width={20}
                    height={20}
                    className=" object-contain ml-2"
                    alt="Picture of the author"
                  />
                </span>
                <span className="text-lg font-medium">
                  {details.roi || '0'}
                </span>
              </div>
            </div>
            <div className="space-y-1 border-2">
              <div className="text-sm text-gray-500 ml-2">ROI Spent</div>
              <div className="flex items-center gap-2">
                <span className="text-red-500">
                  {' '}
                  <Image
                    src={kaitimg}
                    width={20}
                    height={20}
                    className=" object-contain ml-2"
                    alt="Picture of the author"
                  />
                </span>
                <span className="text-lg font-medium">
                  {details.roi_spent || '0'}
                </span>
              </div>
            </div>
            <div className="space-y-1 border-2">
              <div className="text-sm text-gray-500 ml-2">Level Income</div>
              <div className="flex items-center gap-2">
                <span className="text-red-500">
                  {' '}
                  <Image
                    src={kaitimg}
                    width={20}
                    height={20}
                    className=" object-contain ml-2"
                    alt="Picture of the author"
                  />
                </span>
                <span className="text-lg font-medium">
                  {details.level_income_value || '0'}
                </span>
              </div>
            </div>
            <div className="space-y-1 border-2">
              <div className="text-sm text-gray-500 ml-2">Total Earnings</div>
              <div className="flex items-center gap-2">
                <span className="text-red-500">
                  {' '}
                  <Image
                    src={kaitimg}
                    width={20}
                    height={20}
                    className=" object-contain ml-2"
                    alt="Picture of the author"
                  />
                </span>
                <span className="text-lg font-medium">
                  {details.total_earnings || '0'}
                </span>
              </div>
            </div>
            <div className="space-y-1 border-2">
              <div className="text-sm text-gray-500 ml-2">Balance</div>
              <div className="flex items-center gap-2">
                <span className="text-red-500">
                  <Image
                    src={kaitimg}
                    width={20}
                    height={20}
                    className=" object-contain ml-2"
                    alt="Picture of the author"
                  />
                </span>
                <span className="text-lg font-medium">
                  {details.balance || '0'}
                </span>
              </div>
            </div>
            <div className="space-y-1 border-2">
              <div className="text-sm text-gray-500 ml-2">Stake Wallet</div>
              <div className="flex items-center gap-2">
                <span className="text-red-500">
                  {' '}
                  <Image
                    src={kaitimg}
                    width={20}
                    height={20}
                    className=" object-contain ml-2"
                    alt="Picture of the author"
                  />
                </span>
                <span className="text-lg font-medium">
                  {details.stake_wallet || '0'}
                </span>
              </div>
            </div>
            <div className="flex gap-4 border-2 ">
              <div className="flex items-center gap-1">
                {details.email_verified ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                <span>Email</span>
              </div>
              <div className="flex items-center gap-1">
                {details.kyc_verified ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                <span>KYC</span>
              </div>
            </div>
          </div>

          {/* User Information */}
          <div className="space-y-6">
            <h2 className="text-lg font-medium">USER INFORMATION</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-gray-500">Full Name</label>
                <div className="font-medium">{details.full_name}</div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-500">Email Address</label>
                <div className="font-medium">{details.email}</div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-500">Mobile Number</label>
                <div className="font-medium">{details.mobile}</div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-500">Wallet Address</label>
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate">
                    {details.wallet || 0}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-500">Date of Birth</label>
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate">{details.dob}</span>
                </div>
              </div>

              <div className="space-y-2 ">
                <label className="text-sm text-gray-500  ">
                  Nominee Details
                </label>
                <div className="flex items-center gap-2">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-500 ">Name: </label>
                    <span className="font-medium truncate">
                      {details.nominee.name}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-500">Pan: </label>
                    <span className="font-medium truncate">
                      {details.nominee.pan}
                    </span>
                  </div>

                  <div className="space-y-2 ">
                    <label className="text-sm text-gray-500">Relation: </label>
                    <span className="font-medium truncate">
                      {details.nominee.relationship}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-500">Nationality</label>
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate">
                    {details.nationality}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-500">Bank Details</label>
                <div className="flex items-center gap-2">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-500">Account: </label>
                    <span className="font-medium truncate">
                      {details.bank.bank_name}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-500">IFSC: </label>
                    <span className="font-medium truncate">
                      {details.bank.ifsc_code}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-500">Account No:</label>
                    <span className="font-medium truncate">
                      {details.bank.account_no}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-500">Type: </label>
                    <span className="font-medium truncate">
                      {details.bank.account_type}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-lg font-medium mt-6">MORE INFORMATION</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-gray-500">Joining Date</label>
                <div className="font-medium">{details.joining_date}</div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-500">Sponsor</label>
                <div className="font-medium">{details.sponsor}</div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-500">total_members</label>
                <div className="font-medium">{details.total_members}</div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-medium mb-4">TEAM INFORMATION</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              {details.team_tree?.length > 0 ? (
                <TeamTreeMUI
                  team={
                    Array.isArray(details.team_tree) ? details.team_tree : []
                  }
                />
              ) : (
                <p className="text-sm text-gray-500">No team data available.</p>
              )}
            </div>
          </div>
        </div>
        <WalletManipulationDialog
          open={walletDialogOpen}
          onOpenChange={setWalletDialogOpen}
          userId={walletUserId}
          walletType={walletType}
        />
      </Card>
    </div>
  )
}

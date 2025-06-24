'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState, useAppSelector } from '@/store/store'
import { useSearchParams } from 'next/navigation'
import {
  fetchInvestorDetails,
  fetchInvestorList,
} from '@/store/slices/admin/investorSlice'
import { updateUserPermission } from '@/store/slices/admin/permisionSlice'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import kaitimg from '../../../assets/logo2x.png'

import {
  MoreHorizontal,
  Download,
  UserPlus,
  CheckCircle2,
  XCircle,
  Eye,
  Pencil,
  Mail,
  Wallet,
  Activity,
  Lock,
  Unlock,
  CreditCard,
  Power,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'react-hot-toast'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import ResetPasswordForm from './Resetpassword/page'
import { fetchDropdownOptions } from '@/store/slices/dropdownOptions'
import AddUserDialog from './AddUserDialog/page'

type permissionType =
  | 'transfer'
  | 'withdraw'
  | 'withdraw_staking'
  | 'level_income'
  | 'credit'
  | 'suspend'
  | 'adhoc_income'

export default function InvestorList() {
  const dispatch = useDispatch<AppDispatch>()
  const [open, setOpen] = useState(false)

  const [selectedUserId, setSelectedUserId] = useState<string>('')
  const handleResetPassword = (userId: string) => {
    setSelectedUserId(userId)
    setOpen(true)
  }
  const {
    loading,
    message,
    error: permissionError,
  } = useSelector((state: RootState) => state.updateUserPermission)

  const { list, isLoading, error, total } = useSelector(
    (state: RootState) => state.investor,
  )

  const searchParams = useSearchParams()

  const pageFromUrl = Number(searchParams.get('page')) || 1
  const [currentPage, setCurrentPage] = useState(pageFromUrl)

  const [searchQuery, setSearchQuery] = useState('')
  const pageSize = 10

  const totalPages = Math.ceil(total / pageSize)

  const router = useRouter()
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', currentPage.toString())
    router.push(`?${params.toString()}`)
  }, [currentPage])

  useEffect(() => {
    dispatch(fetchDropdownOptions())

    dispatch(
      fetchInvestorList({
        page: currentPage,
        page_size: pageSize,
        searchQuery,
      }),
    )
  }, [dispatch, currentPage, searchQuery])

  const {
    data: dropDownOptions,
    loading: loadingOptions,
    error: optionsError,
  } = useAppSelector((state: RootState) => state.dropDownOptions)

  const handlePermissionChange = async (
    userId: string,
    permissionType: permissionType,
    permissionValue: boolean | undefined,
  ) => {
    const token = localStorage.getItem('token')

    if (!token) {
      toast.error('Authorization token missing. Please log in again.')
      return
    }

    const investor = list.find((inv) => inv.user_id === userId)
    const userName = investor?.name || 'User'
    const permissionValueToSend =
      permissionValue === undefined ? false : permissionValue

    console.log('Attempting to update permission with values:', {
      userId,
      permissionType,
      permissionValueToSend,
    })

    try {
      const resultAction = await dispatch(
        updateUserPermission({
          userId,
          permissionType,
          permissionValue: permissionValueToSend,
          token,
        }),
      )

      if (updateUserPermission.fulfilled.match(resultAction)) {
        toast.success(
          `${permissionType} permission ${permissionValueToSend ? 'enabled' : 'disabled'} for ${userName}`,
        )

        dispatch(
          fetchInvestorList({
            page: currentPage,
            page_size: pageSize,
            searchQuery,
          }),
        )
      } else {
        toast.error(
          `Failed to update ${permissionType} permission for ${userName}`,
        )
      }
    } catch (error) {
      console.error('Error updating permission:', error)
      toast.error(
        `An error occurred while updating ${permissionType} permission for ${userName}`,
      )
    }
  }

  const handleViewDetails = async (userId: string) => {
    try {
      const resultAction = await dispatch(fetchInvestorDetails(userId))
      if (fetchInvestorDetails.fulfilled.match(resultAction)) {
        router.push(
          `/admin/UserList/Details?userId=${userId}&page=${currentPage}`,
        )
      } else {
        toast.error('Failed to fetch investor details.')
      }
    } catch (err) {
      console.error('Unexpected error:', err)
    }
  }

  const [activeTab, setActiveTab] = useState('Investor / Users')

  const tabs = ['Investor / Users']

  return (
    <div className="min-h-screen bg-blue-100 p-6">
      <Card className="container bg-white mx-auto max-w-7xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-indigo-900">
              Investor User List
            </h1>
            <div className="flex gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" /> Download Users
              </Button>
              {/* <Button className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"> */}
              {/* <UserPlus className="w-4 h-4" /> Add User */}
              <AddUserDialog />
              {/* </Button> */}
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-6">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`px-1 py-2 transition-colors ${
                    activeTab === tab
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <Input
              className="max-w-md"
              placeholder="Quick search with name/email/id/wallet address"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto" />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-10">{error}</div>
          ) : (
            <div className="relative overflow-x-auto z-10">
              <table className="w-full relative z-0">
                <thead>
                  <tr className="border-b text-left text-sm font-medium text-gray-500">
                    <th className="p-4">USER</th>
                    <th className="p-4">EMAIL</th>
                    <th className="p-4">INVESTMENT</th>
                    <th className="p-4">TEAM BUSINESS</th>
                    <th className="p-4">VERIFIED STATUS</th>
                    <th className="p-4">TRANSFER ENABLE</th>
                    <th className="p-4">WITHDRAW DISABLED</th>
                    <th className="p-4">STATUS</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {list?.map((investor) => (
                    <tr key={investor.user_id} className="border-b">
                      <td className="p-4">
                        <div>
                          <div className="flex gap-2">
                            <div className="font-medium">{investor.name}</div>
                            {investor.credit && (
                              <div className="bg-red-500 w-fit px-2 text-white">
                                C
                              </div>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {investor.referred_by}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">{investor.email}</td>
                      <td className="p-4 ">
                        <span className=" flex gap-2">
                          <Image
                            src={kaitimg}
                            width={20}
                            height={20}
                            className=" object-contain"
                            alt="Picture of the author"
                          />
                          {investor.investment}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className=" flex gap-2">
                          <Image
                            src={kaitimg}
                            width={20}
                            height={20}
                            className=" object-contain"
                            alt="Picture of the author"
                          />
                          {investor.team_business || 0}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <div className="flex items-center gap-1">
                            {investor.verified.email ? (
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500" />
                            )}
                            <span>Email</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {investor.verified.kyc ? (
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500" />
                            )}
                            <span>KYC</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Switch
                          checked={investor.transfer}
                          onCheckedChange={(checked) =>
                            handlePermissionChange(
                              investor.user_id,
                              'transfer',
                              checked,
                            )
                          }
                          disabled={isLoading}
                          className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-red-400"
                        />
                      </td>
                      <td className="p-4">
                        <Switch
                          checked={!investor.withdraw}
                          onCheckedChange={(checked) =>
                            handlePermissionChange(
                              investor.user_id,
                              'withdraw',
                              !checked,
                            )
                          }
                          disabled={isLoading}
                          className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-red-400"
                        />
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            investor.suspend
                              ? 'bg-gray-200 text-gray-600'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {investor.suspend ? 'InActive' : 'Active'}
                        </span>
                      </td>
                      <td className="p-4">
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
                            <DropdownMenuItem
                              onClick={() =>
                                handleViewDetails(investor.user_id)
                              }
                            >
                              <Eye className="w-4 h-4 mr-2" /> View Details
                            </DropdownMenuItem>

                            <DropdownMenuItem>
                              <Pencil className="w-4 h-4 mr-2" /> Update User
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="w-4 h-4 mr-2" /> Send Email
                            </DropdownMenuItem>
                            {[
                              'KAIT',
                              'Income',
                              'Adhoc',
                              'ROS',
                              'Restaking',
                            ].map((wallet) => (
                              <DropdownMenuItem key={wallet}>
                                <Wallet className="w-4 h-4 mr-2" /> {wallet}{' '}
                                Wallet - Manipulate
                              </DropdownMenuItem>
                            ))}
                            <DropdownMenuItem>
                              <Activity className="w-4 h-4 mr-2" /> Activities
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleResetPassword(investor.user_id)
                              }
                            >
                              <Lock className="w-4 h-4 mr-2" /> Reset Password
                            </DropdownMenuItem>
                            {/* <DropdownMenuItem
                              onClick={() =>
                                handlePermissionChange(
                                  investor.user_id,
                                  'transfer',
                                  !investor.transfer,
                                )
                              }
                            >
                              {investor.transfer ? (
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
                            {dropDownOptions?.permission_types?.map((type) => (
                              <DropdownMenuItem key={type.id} value={type.id}>
                                {type.value}
                              </DropdownMenuItem>
                            ))}

                            <DropdownMenuItem
                              onClick={() =>
                                handlePermissionChange(
                                  investor.user_id,
                                  'withdraw',
                                  !investor.withdraw,
                                )
                              }
                            >
                              {investor.withdraw ? (
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
                                  investor.user_id,
                                  'withdraw_staking',
                                  !investor.withdraw_staking,
                                )
                              }
                            >
                              {!investor.withdraw_staking ? (
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
                                  investor.user_id,
                                  'level_income',
                                  !investor.level_income,
                                )
                              }
                            >
                              {investor.level_income ? (
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
                                  investor.user_id,
                                  'adhoc_income',
                                  !investor.adhoc_income,
                                )
                              }
                            >
                              {investor.adhoc_income ? (
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
                                  investor.user_id,
                                  'credit',
                                  !investor.credit,
                                )
                              }
                            >
                              {investor.credit ? (
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
                                  investor.user_id,
                                  'suspend',
                                  !investor.suspend,
                                )
                              }
                            >
                              {!investor.suspend ? (
                                <>
                                  <Power className="w-4 h-4 mr-2 text-red-600" />
                                  Activate
                                </>
                              ) : (
                                <>
                                  <Power className="w-4 h-4 mr-2 text-red-600" />
                                  Suspend
                                </>
                              )}
                            </DropdownMenuItem> */}
                            {dropDownOptions?.permission_types?.map(
                              ({ id, value }) => {
                                let label = ''
                                let icon = null

                                const isEnabled =
                                  investor[id as keyof typeof investor]

                                switch (id) {
                                  case 'transfer':
                                    label = isEnabled
                                      ? 'Transfer Disable'
                                      : 'Transfer Enable'
                                    icon = isEnabled ? (
                                      <Lock className="w-4 h-4 mr-2" />
                                    ) : (
                                      <Unlock className="w-4 h-4 mr-2" />
                                    )
                                    break
                                  case 'withdraw':
                                    label = isEnabled
                                      ? 'Withdraw Disable'
                                      : 'Withdraw Enable'
                                    icon = isEnabled ? (
                                      <Lock className="w-4 h-4 mr-2" />
                                    ) : (
                                      <Unlock className="w-4 h-4 mr-2" />
                                    )
                                    break
                                  case 'withdraw_staking':
                                    label = !isEnabled
                                      ? 'Withdraw Staking Disable'
                                      : 'Withdraw Staking Enable'
                                    icon = isEnabled ? (
                                      <Unlock className="w-4 h-4 mr-2" />
                                    ) : (
                                      <Lock className="w-4 h-4 mr-2" />
                                    )
                                    break
                                  case 'level_income':
                                    label = isEnabled
                                      ? 'Level Income Suspend'
                                      : 'Level Income Enable'
                                    icon = isEnabled ? (
                                      <Lock className="w-4 h-4 mr-2" />
                                    ) : (
                                      <Unlock className="w-4 h-4 mr-2" />
                                    )
                                    break
                                  case 'adhoc_income':
                                    label = isEnabled
                                      ? 'Adhoc Income Disable'
                                      : 'Adhoc Income Enable'
                                    icon = isEnabled ? (
                                      <Lock className="w-4 h-4 mr-2" />
                                    ) : (
                                      <Unlock className="w-4 h-4 mr-2" />
                                    )
                                    break
                                  case 'adhoc_transfer':
                                    label = isEnabled
                                      ? 'Adhoc Transfer Disable'
                                      : 'Adhoc Transfer Enable'
                                    icon = isEnabled ? (
                                      <Lock className="w-4 h-4 mr-2" />
                                    ) : (
                                      <Unlock className="w-4 h-4 mr-2" />
                                    )
                                    break
                                  case 'credit':
                                    label = isEnabled
                                      ? 'Remove Credit ID'
                                      : 'Set Credit ID'
                                    icon = (
                                      <CreditCard className="w-4 h-4 mr-2" />
                                    )
                                    break
                                  case 'suspend':
                                    label = isEnabled ? 'Activate' : 'Suspend'
                                    icon = (
                                      <Power className="w-4 h-4 mr-2 text-red-600" />
                                    )
                                    break
                                  default:
                                    label = value
                                    icon = <Lock className="w-4 h-4 mr-2" />
                                }

                                return (
                                  <DropdownMenuItem
                                    key={id}
                                    onClick={() =>
                                      handlePermissionChange(
                                        investor.user_id,
                                        id as permissionType,
                                        !isEnabled,
                                      )
                                    }
                                  >
                                    {icon}
                                    {label}
                                  </DropdownMenuItem>
                                )
                              },
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="bg-[#F3EAD8] hover:bg-blue-50 transition-colors duration-2000">
                  <DialogHeader>
                    <DialogTitle></DialogTitle>
                  </DialogHeader>
                  <ResetPasswordForm userId={selectedUserId} />
                </DialogContent>
              </Dialog>
            </div>
          )}

          <div className="flex justify-between items-center mt-6 flex-wrap gap-2">
            <div className="flex gap-2">
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage <= 1}
              >
                PREV
              </Button>
              <Button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage >= totalPages}
              >
                NEXT
              </Button>
            </div>
            <div className="text-sm text-gray-600">
              Total Investors: <strong>{total}</strong>
            </div>
            <div className="flex items-center gap-2">
              <span>Page</span>
              <Select
                value={currentPage.toString()}
                onValueChange={(value) => setCurrentPage(Number(value))}
              >
                <SelectTrigger className="w-20">
                  <SelectValue placeholder={`Page ${currentPage}`} />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {Array.from({ length: totalPages }, (_, i) => {
                    const page = i + 1
                    return (
                      <SelectItem key={page} value={page.toString()}>
                        {page}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
              <span>of {totalPages}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
// function AddUserDialog() {
//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2">
//           <UserPlus className="w-4 h-4" /> Add User
//         </Button>
//       </DialogTrigger>

//       <DialogContent className="w-[75vw] !max-w-none bg-white rounded-xl">
//         <DialogHeader>
//           <DialogTitle>Add New User</DialogTitle>
//         </DialogHeader>

//         <form className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium mb-1">User Type</label>
//             <Select>
//               <SelectTrigger className="w-full">
//                 <SelectValue placeholder="Regular" />
//               </SelectTrigger>
//               <SelectContent className=" bg-white">
//                 <SelectItem value="regular">Regular</SelectItem>
//                 <SelectItem value="admin">Admin</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">
//                 First Name
//               </label>
//               <Input placeholder="User First Name" />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">
//                 Last Name
//               </label>
//               <Input placeholder="User Last Name" />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">
//                 Date Of Birth
//               </label>
//               <Input placeholder="Date Of Birth" />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">
//                 Email Address
//               </label>
//               <Input type="email" placeholder="Email address" />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Password</label>
//               <Input placeholder="Automatically generated if blank" />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">
//                 Confirm Password
//               </label>
//               <Input placeholder="Confirm Password" />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">
//                 Mobile Number
//               </label>
//               <Input placeholder="Mobile Number" />
//             </div>
//           </div>

//           <div className="flex items-center gap-2">
//             <input type="checkbox" id="verifyEmail" defaultChecked />
//             <label htmlFor="verifyEmail" className="text-sm">
//               Required Email Verification
//             </label>
//           </div>

//           <Button
//             type="submit"
//             className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
//           >
//             Add User
//           </Button>
//         </form>
//       </DialogContent>
//     </Dialog>
//   )
// }

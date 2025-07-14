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
  ChevronLeft,
  ChevronRight,
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
import WalletManipulationDialog from './walletmanupulatedialog'
import EmailDialog from './SendEmail'
import { downloadInvestorList } from '@/store/slices/admin/investorSlice'
import UpdateInvestorDialog from './updateInvestorDilog'
import { fetchEligibleUsers } from '@/store/slices/user/eligibleUserTransferSlice'

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
  const { downloadLoading } = useSelector((state: RootState) => state.investor)

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
  const [emailDialogOpen, setEmailDialogOpen] = useState(false)
  const [emailUserId, setEmailUserId] = useState('')

  const handleEmailDialogOpen = (userId: string) => {
    setEmailUserId(userId)
    setEmailDialogOpen(true)
  }

  const searchParams = useSearchParams()

  const pageFromUrl = Number(searchParams.get('page')) || 1
  const [currentPage, setCurrentPage] = useState(pageFromUrl)

  const [searchQuery, setSearchQuery] = useState('')
  const [pageSize, setPageSize] = useState(10)

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
  }, [dispatch, currentPage, pageSize, searchQuery])

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

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('Authorization token is missing')
        return
      }

      const blob = await dispatch(
        downloadInvestorList({
          token,
          page: currentPage,
          page_size: pageSize,
          search: searchQuery,
        }),
      ).unwrap()

      const url = window.URL.createObjectURL(new Blob([blob]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'investor_list.xlsx')
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      toast.success('Download started!')
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Failed to download investor list')
    }
  }
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
  const [selectedUserToUpdate, setSelectedUserToUpdate] = useState<any>(null)

  const generatePageNumbers = (totalPages: number, currentPage: number) => {
    const pages: (number | string)[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages)
      } else if (currentPage >= totalPages - 3) {
        pages.push(
          1,
          '...',
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        )
      } else {
        pages.push(
          1,
          '...',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          '...',
          totalPages,
        )
      }
    }
    return pages
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
  const [walletDialogOpen, setWalletDialogOpen] = useState(false)
  const [walletUserId, setWalletUserId] = useState('')
  const [walletType, setWalletType] = useState('')

  const handleWalletManipulation = (userId: string, type: string) => {
    setWalletUserId(userId)
    setWalletType(type)
    setWalletDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-6">
      <Card className="container bg-white mx-auto max-w-7xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-indigo-900">
              Investor User List
            </h1>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex items-center gap-2 text-white bg-gradient-to-r from-blue-500 to-purple-600"
                onClick={handleDownload}
                disabled={downloadLoading}
              >
                <Download className="w-4 h-4" />
                {downloadLoading ? 'Preparing...' : 'Download Users'}
              </Button>

              <AddUserDialog />
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
            <div className="relative overflow-x-auto z-10 ">
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
                            {investor.email_verified ? (
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500" />
                            )}
                            <span>Email</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {investor.kyc_verified ? (
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

                            <DropdownMenuItem
                              onClick={() => {
                                const firstName =
                                  investor.first_name ||
                                  investor.name?.split(' ')[0] ||
                                  ''
                                const lastName =
                                  investor.last_name ||
                                  investor.name?.split(' ')[1] ||
                                  ''

                                setSelectedUserToUpdate({
                                  user_id: investor.user_id,
                                  first_name: firstName,
                                  last_name: lastName,
                                  email: investor.email || '',
                                  mobile: investor.mobile || '',
                                  referral_user_id: investor.referred_by || '',
                                })

                                dispatch(fetchEligibleUsers(investor.user_id))

                                setUpdateDialogOpen(true)
                              }}
                            >
                              <Pencil className="w-4 h-4 mr-2" /> Update User
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() =>
                                handleEmailDialogOpen(investor.user_id)
                              }
                            >
                              <Mail className="w-4 h-4 mr-2" /> Send Email
                            </DropdownMenuItem>

                            {[
                              'KAIT',
                              'Income',
                              'Adhoc',
                              'ROS',
                              'Restaking',
                            ].map((wallet) => (
                              <DropdownMenuItem
                                key={wallet}
                                onClick={() =>
                                  handleWalletManipulation(
                                    investor.user_id,
                                    wallet,
                                  )
                                }
                              >
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

                <EmailDialog
                  open={emailDialogOpen}
                  onClose={() => setEmailDialogOpen(false)}
                  userId={emailUserId}
                />
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

          <div className="p-6 pb-0 b-0 bg-white">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                </Button>

                <div className="flex items-center space-x-2">
                  {generatePageNumbers(totalPages, currentPage).map(
                    (pageNum, idx) => (
                      <Button
                        key={idx}
                        variant={
                          pageNum === currentPage ? 'default' : 'outline'
                        }
                        size="sm"
                        disabled={pageNum === '...'}
                        onClick={() =>
                          typeof pageNum === 'number' && setCurrentPage(pageNum)
                        }
                        className={
                          pageNum === currentPage
                            ? 'bg-gradient-to-r from-blue-500 to-purple-700 text-white'
                            : ''
                        }
                      >
                        {pageNum}
                      </Button>
                    ),
                  )}
                </div>

                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              {/* Page Size Dropdown */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Rows per page:</span>
                <Select
                  value={pageSize.toString()}
                  onValueChange={(value) => {
                    const size = parseInt(value)
                    setPageSize(size)
                    setCurrentPage(1)
                  }}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Page size" />
                  </SelectTrigger>
                  <SelectContent>
                    {[10, 20, 50, 100].map((size) => (
                      <SelectItem key={size} value={size.toString()}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Info Summary */}
              <div className="text-sm text-gray-600">
                Page <strong>{currentPage}</strong> of{' '}
                <strong>{totalPages}</strong> • Showing{' '}
                <strong>{Math.min(pageSize, total)}</strong> of{' '}
                <strong>{total}</strong> users
              </div>
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
      {selectedUserToUpdate && (
        <UpdateInvestorDialog
          open={updateDialogOpen}
          onClose={() => setUpdateDialogOpen(false)}
          user={selectedUserToUpdate}
        />
      )}
    </div>
  )
}

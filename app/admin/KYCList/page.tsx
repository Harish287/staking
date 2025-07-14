'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  approveKycApplication,
  fetchKycApplications,
} from '../../../store/slices/index'
import { downloadKycDocument } from '../../../store/slices/kycList'
import { RootState, AppDispatch } from '../../../store/store'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  MoreVertical,
  SquareCheck,
  Trash2,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useDebounce } from 'use-debounce'
import { useAppSelector } from '@/store/hooks'
import { fetchDropdownOptions } from '@/store/slices/dropdownOptions'

const KycApplications = () => {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const searchParams = useSearchParams()

  const userIdString = searchParams.get('userId')
  const statusParam = (searchParams.get('status') || 'all').toLowerCase()
  const pageParam = parseInt(searchParams.get('page') || '1', 10)
  const pageSizeParam = parseInt(searchParams.get('page_size') || '10', 10)

  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch] = useDebounce(searchQuery, 300)
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [message, setMessage] = useState<string>('')

  const [actionLoading, setActionLoading] = useState(false)

  const kycApplications = useSelector(
    (state: RootState) => state.auth?.kycApplications ?? [],
  )

  const totalPages = useSelector(
    (state: RootState) => state.auth?.totalPages ?? 1,
  )

  const isLoading = useSelector(
    (state: RootState) => state.auth?.isLoading ?? false,
  )

  const error = useSelector((state: RootState) => state.auth?.error ?? null)

  useEffect(() => {
    const delay = setTimeout(() => {
      dispatch(fetchDropdownOptions())

      dispatch(
        fetchKycApplications({
          page: pageParam,
          page_size: pageSizeParam,
          status: statusParam,
          search: searchQuery,
        }),
      )
    }, 300)

    return () => clearTimeout(delay)
  }, [dispatch, pageParam, pageSizeParam, statusParam, searchQuery])

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (searchQuery) {
      params.set('search', searchQuery)
      params.set('page', '1')
    } else {
      params.delete('search')
      params.set('page', '1')
    }
    router.push(`/admin/KYCList?${params.toString()}`, { scroll: false })
  }, [searchQuery])

  const generatePageNumbers = (
    total: number,
    current: number,
  ): (number | string)[] => {
    const delta = 2
    const range = []
    for (
      let i = Math.max(2, current - delta);
      i <= Math.min(total - 1, current + delta);
      i++
    ) {
      range.push(i)
    }

    if (current - delta > 2) range.unshift('...')
    if (current + delta < total - 1) range.push('...')

    range.unshift(1)
    if (total > 1) range.push(total)

    return range
  }

  // const getDisplayStatus = (status: string) => {
  //   if (status === 'approved') return 'Approved'
  //   if (status === 'Rejected') return 'Rejected'
  //   return 'Pending'
  // }

  const filteredApplications = useMemo(() => {
    return kycApplications.filter((app) => {
      const userName = app.user_name ?? ''
      const userId = app.user_id ?? ''
      const search = debouncedSearch.toLowerCase()

      const matchesSearch =
        userName.toLowerCase().includes(search) ||
        userId.toLowerCase().includes(search)

      const appStatus = app.status?.trim().toLowerCase() || 'pending'

      const statusMatch =
        statusParam === 'all' ||
        statusParam === 'any' ||
        statusParam === appStatus ||
        (statusParam === 'unsubmitted' && !app.submitted) ||
        (statusParam === 'submitted' && !!app.submitted)

      return matchesSearch && statusMatch
    })
  }, [kycApplications, debouncedSearch, statusParam])

  const changePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage.toString())
    router.push(`/admin/KYCList?${params.toString()}`)
  }

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('status', value.toLowerCase())
    params.set('page', '1')
    router.push(`/admin/KYCList?${params.toString()}`)
  }

  const openDialog = (userId: string) => {
    setSelectedUserId(userId)
    setDialogOpen(true)
  }

  const closeDialog = () => {
    setDialogOpen(false)
    setSelectedUserId(null)
    setMessage('')
  }

  const handleDownload = (userId: string, documentName: string) => {
    dispatch(
      downloadKycDocument({ user_id: userId, document_name: documentName }),
    )
  }

  const {
    data: dropDownOptions,
    loading: loadingOptions,
    error: optionsError,
  } = useAppSelector((state: RootState) => state.dropDownOptions)

  const handleAction = (action: 'approve' | 'reject') => {
    if (!selectedUserId) return
    setActionLoading(true)

    dispatch(
      approveKycApplication({
        user_id: selectedUserId,
        action,
        message,
      }),
    )
      .unwrap()
      .then(({ user_id, newStatus, message }) => {
        closeDialog()

        // ✅ Refetch without changing the tab
        dispatch(
          fetchKycApplications({
            page: pageParam,
            page_size: pageSizeParam,
            status: statusParam,
            search: searchQuery,
          }),
        )

        toast.success(`${message}`)
      })
      .catch(() => {
        toast.error(`${action === 'approve' ? 'Approval' : 'Rejection'} failed`)
      })
      .finally(() => setActionLoading(false))
  }

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen py-6">
      <Card className="p-6 shadow-xl rounded-xl container m-auto w-[90%] bg-white">
        <h2 className="text-2xl font-semibold mb-6">KYC Applications</h2>

        <Input
          className="mb-4"
          placeholder="Search by Username or User ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <Tabs
          value={statusParam.toLowerCase()}
          onValueChange={(val) => handleTabChange(val.toLowerCase())}
          className="mb-4"
        >
          <TabsList className="bg-muted p-1 rounded-lg space-x-2">
            {dropDownOptions?.kyc_status?.map((type) => (
              <TabsTrigger
                key={type.id}
                value={type.id.toLowerCase()}
                className="text-sm px-4 py-2 rounded-md transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
              >
                {type.value}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {isLoading && <p className="text-gray-500">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!isLoading && filteredApplications.length > 0 ? (
          <>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100 text-[15px]">
                  <TableHead>Name</TableHead>
                  <TableHead>Document Type</TableHead>
                  <TableHead>Documents</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-[12px]">
                {filteredApplications.map((app) => (
                  <TableRow key={app.user_id}>
                    <TableCell>
                      <span className="font-bold">{app.name}</span>
                      <br />
                      <span className="text-gray-400">{app.user_name}</span>
                    </TableCell>
                    <TableCell>{app.doc_type}</TableCell>
                    <TableCell className="flex gap-4">
                      {app.docs && typeof app.docs === 'object' ? (
                        Object.entries(app.docs).map(([docType, files]) => (
                          <div key={docType}>
                            <div className="flex gap-4">
                              {files.map((file, index) => {
                                const cleanLabel =
                                  file
                                    .split('/')
                                    .pop()
                                    ?.replace(/^\d{14}_/, '') || 'Document'

                                return (
                                  <Button
                                    key={index}
                                    variant="link"
                                    className="text-blue-600 text-[12px] gap-1 p-0 hover:text-blue-800"
                                    onClick={() =>
                                      handleDownload(app.user_id, file)
                                    }
                                  >
                                    {cleanLabel}
                                    <Download />
                                  </Button>
                                )
                              })}
                            </div>
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-500 text-sm">
                          No documents
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{app.submitted}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-[12px] font-medium ${(() => {
                          const status = app.status?.trim().toLowerCase()
                          if (!status) return 'bg-yellow-100 text-yellow-700' // empty = Pending
                          if (status === 'approved')
                            return 'bg-green-100 text-green-700'
                          if (status === 'rejected')
                            return 'bg-red-100 text-red-700'
                          return 'bg-yellow-100 text-yellow-700' // fallback for others
                        })()}`}
                      >
                        {(() => {
                          const status = app.status?.trim()
                          return status ? status : 'Pending'
                        })()}
                      </span>
                    </TableCell>

                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="p-2">
                            <MoreVertical className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white">
                          <Link
                            href={`/admin/KYCList/kycdetails?userId=${encodeURIComponent(app.user_id)}`}
                          >
                            <DropdownMenuItem className="text-[12px] gap-2">
                              <Eye className="w-4 h-4" /> VIEW DETAILS
                            </DropdownMenuItem>
                          </Link>

                          <DropdownMenuItem
                            className="text-[12px]"
                            onClick={() => openDialog(app.user_id)}
                          >
                            <SquareCheck /> APPROVE OR REJECT
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-[12px]">
                            <Trash2 /> DELETE
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="p-6 pb-0 b-0 bg-white">
              <div className="flex items-center justify-between flex-wrap gap-4">
                {/* Pagination Controls */}
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    disabled={pageParam === 1}
                    onClick={() => changePage(pageParam - 1)}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                  </Button>

                  <div className="flex items-center space-x-2">
                    {generatePageNumbers(totalPages, pageParam).map(
                      (pageNum, idx) => (
                        <Button
                          key={idx}
                          variant={
                            pageNum === pageParam ? 'default' : 'outline'
                          }
                          size="sm"
                          disabled={pageNum === '...'}
                          onClick={() =>
                            typeof pageNum === 'number' && changePage(pageNum)
                          }
                          className={
                            pageNum === pageParam
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
                    disabled={pageParam === totalPages}
                    onClick={() => changePage(pageParam + 1)}
                  >
                    Next <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>

                {/* Page Size Dropdown */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Rows per page:</span>
                  <Select
                    value={pageSizeParam.toString()}
                    onValueChange={(value) => {
                      const newSize = parseInt(value)
                      const params = new URLSearchParams(
                        searchParams.toString(),
                      )
                      params.set('page_size', newSize.toString())
                      params.set('page', '1')
                      router.push(`/admin/KYCList?${params.toString()}`)
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
                  Page <strong>{pageParam}</strong> of{' '}
                  <strong>{totalPages}</strong> • Showing{' '}
                  <strong>{kycApplications.length}</strong> of{' '}
                  <strong>{kycApplications.length * totalPages}</strong> users
                </div>
              </div>
            </div>
          </>
        ) : (
          !isLoading && (
            <p className="text-gray-600">No KYC applications found.</p>
          )
        )}
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Take Action on KYC</DialogTitle>
            <DialogDescription>
              Please confirm your decision. You can also leave a message.
            </DialogDescription>

            <Input
              placeholder="Add optional message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-4"
            />
          </DialogHeader>

          <DialogFooter className="flex justify-end gap-4">
            {dropDownOptions?.kyc_application_actions?.map((type) => {
              const action = type.value.toLowerCase()

              if (action !== 'approve' && action !== 'reject') return null

              return (
                <Button
                  key={type.id}
                  className={`text-white ${
                    action === 'approve'
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-red-500 hover:bg-red-600'
                  }`}
                  disabled={actionLoading}
                  onClick={() => handleAction(action as 'approve' | 'reject')}
                >
                  {actionLoading ? 'Processing...' : type.value}
                </Button>
              )
            })}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default KycApplications

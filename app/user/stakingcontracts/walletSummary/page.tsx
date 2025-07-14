'use client'

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '@/store/store'
import {
  fetchWalletSummary,
  setWalletKind,
  setSearch,
  setPage,
} from '@/store/slices/user/userWalletSummary'
import { fetchDropdownOptions } from '@/store/slices/dropdownOptions'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Wallet,
  TrendingUp,
  Calendar,
  DollarSign,
  Filter,
  RefreshCw,
  Download,
  Eye,
  ArrowUpRight,
  ArrowDownLeft,
  Coins,
  CreditCard,
  Activity,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import Logo from '@/assets/logo2x.png'
import { MenuItem, Select, SelectChangeEvent } from '@mui/material'

const WalletSummaryPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const searchParams = useSearchParams()

  const { items, page, page_size, total, wallet_kind, search, loading, error } =
    useSelector((state: RootState) => state.UserWalletSummary)

  const {
    data: dropdowns,
    loading: dropdownLoading,
    error: dropdownError,
  } = useSelector((state: RootState) => state.dropDownOptions)

  const [searchInput, setSearchInput] = useState(search)

  useEffect(() => {
    if (!dropdowns && !dropdownLoading) {
      dispatch(fetchDropdownOptions())
    }
  }, [dispatch, dropdowns, dropdownLoading])

  useEffect(() => {
    const searchParam = searchParams.get('search') || ''
    const kindParam = searchParams.get('wallet_kind') || ''
    const pageParam = Number(searchParams.get('page')) || 1

    dispatch(setSearch(searchParam))
    dispatch(setWalletKind(kindParam))
    dispatch(setPage(pageParam))
    setSearchInput(searchParam)
  }, [searchParams, dispatch])

  useEffect(() => {
    dispatch(fetchWalletSummary({ wallet_kind, search, page, page_size }))
  }, [dispatch, wallet_kind, search, page, page_size])

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchInput) params.set('search', searchInput)
    if (wallet_kind) params.set('wallet_kind', wallet_kind)
    params.set('page', '1')

    router.push(`?${params.toString()}`)
    dispatch(setSearch(searchInput))
    dispatch(setPage(1))
  }

  const handleWalletKindChange = (value: string) => {
    const params = new URLSearchParams()
    if (searchInput) params.set('search', searchInput)
    if (value) params.set('wallet_kind', value)
    params.set('page', '1')

    router.push(`?${params.toString()}`)
    dispatch(setWalletKind(value))
    dispatch(setPage(1))
  }

  const handlePagination = (newPage: number) => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (wallet_kind) params.set('wallet_kind', wallet_kind)
    params.set('page', String(newPage))

    router.push(`?${params.toString()}`)
    dispatch(setPage(newPage))
  }

  const walletOptions = dropdowns?.ewallet_kinds ?? []

  const getTransactionIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'credit':
      case 'deposit':
        return <ArrowDownLeft className="w-4 h-4 text-green-500" />
      case 'debit':
      case 'withdrawal':
        return <ArrowUpRight className="w-4 h-4 text-red-500" />
      default:
        return <Activity className="w-4 h-4 text-blue-500" />
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'credit':
      case 'deposit':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'debit':
      case 'withdrawal':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200'
    }
  }

  if (dropdownLoading || loading) {
    return (
     <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-purple-700 border-b-gray-800 border-l-transparent border-r-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-5 rounded-lg shadow pt-5 bg-[#F3EAD8] hover:bg-blue-50 pb-[20px] transition-colors duration-2000">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center  bg-gradient-to-r from-blue-500 to-purple-700  p-5 rounded-2xl space-y-6">
          <div className="flex items-center justify-center space-x-4">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
              <Wallet className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                {wallet_kind
                  ? `${wallet_kind} Wallet Summary`
                  : 'Wallet Summary'}
              </h1>
              <p className="text-pink-100 text-lg">
                Track your transactions and wallet activity
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-100 text-sm">Total Transactions</p>
                  <p className="text-3xl font-bold">{total}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl">
                  <Activity className="w-6 h-6" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-100 text-sm">Current Page</p>
                  <p className="text-3xl font-bold">{page}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl">
                  <Eye className="w-6 h-6" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-100 text-sm">Total Pages</p>
                  <p className="text-3xl font-bold">
                    {Math.ceil(total / page_size)}
                  </p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl">
                  <CreditCard className="w-6 h-6" />
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Filters Section */}
        <Card className="p-6 bg-white/95 backdrop-blur-sm shadow-2xl border-0">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2  bg-gradient-to-r from-blue-500 to-purple-700 rounded-lg">
              <Filter className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Filters & Search
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Wallet Type Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Wallet Type
              </Label>
              <Select
                value={wallet_kind}
                onChange={(e: SelectChangeEvent) =>
                  handleWalletKindChange(e.target.value)
                }
                displayEmpty
                size="small"
                fullWidth
                sx={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  border: '2px solid #e5e7eb',
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 200,
                      overflowY: 'auto',
                    },
                  },
                }}
              >
                <MenuItem value="">All Wallets</MenuItem>
                {walletOptions.map((option) => (
                  <MenuItem key={option.id} value={option.value}>
                    {option.value}
                  </MenuItem>
                ))}
              </Select>
            </div>

            {/* Search Input */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Search Transactions
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search descriptions..."
                  className="pl-10 py-3 border-2 focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
                />
              </div>
            </div>

            {/* Search Button */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 opacity-0">
                Action
              </Label>
              <Button
                onClick={handleSearch}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-700 hover:from-blue-600 hover:to-purple-600 text-white py-3 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </Card>

        {/* Transactions Table */}
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2  bg-gradient-to-r from-blue-500 to-purple-700 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Transaction History
                </h2>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <RefreshCw className="w-8 h-8 animate-spin text-pink-600" />
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-600">
              <div className="p-4 bg-red-50 rounded-xl inline-block mb-4">
                <Activity className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-lg font-medium">{error}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center space-x-2">
                        <Activity className="w-4 h-4" />
                        <span>Description</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Date & Time</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center space-x-2">
                        <Coins className="w-4 h-4" />
                        <span>Amount</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center space-x-2">
                        <Filter className="w-4 h-4" />
                        <span>Type</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4" />
                        <span>Closing Balance</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center">
                        <div className="space-y-4">
                          <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                            <Wallet className="w-8 h-8 text-gray-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                              No transactions found
                            </h3>
                            <p className="text-gray-500">
                              Try adjusting your search criteria or filters.
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    items.map((item, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gradient-to-r from-pink-100 to-gray-100 rounded-lg">
                              {getTransactionIcon(item.transaction_type)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {item.description}
                              </p>
                              <p className="text-sm text-gray-500">
                                Transaction #{idx + 1}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <p className="font-medium text-gray-900">
                              {new Date(item.date_time).toLocaleDateString()}
                            </p>
                            <p className="text-gray-500">
                              {new Date(item.date_time).toLocaleTimeString()}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <div className="  rounded-full flex items-center justify-center">
                              <span className="">
                                <Image
                                  alt="KAIT Logo"
                                  src={Logo}
                                  width={20}
                                  height={20}
                                  className="object-contain"
                                />
                              </span>
                            </div>
                            <span className="font-semibold text-gray-900">
                              {item.amount}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getTransactionColor(item.transaction_type)}`}
                          >
                            {getTransactionIcon(item.transaction_type)}
                            <span className="ml-1">
                              {item.transaction_type}
                            </span>
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <div className=" rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">
                                <Image
                                  alt="KAIT Logo"
                                  src={Logo}
                                  width={20}
                                  height={20}
                                  className="object-contain"
                                />
                              </span>
                            </div>
                            <span className="font-semibold text-gray-900">
                              {item.closing_balance}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Pagination */}
        {total > page_size && (
          <Card className="p-6 bg-white/95 backdrop-blur-sm shadow-2xl border-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => handlePagination(page - 1)}
                  className="flex items-center space-x-2 disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </Button>

                <div className="flex items-center space-x-2">
                  {Array.from(
                    { length: Math.min(5, Math.ceil(total / page_size)) },
                    (_, i) => {
                      const pageNum = i + 1
                      return (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handlePagination(pageNum)}
                          className={
                            page === pageNum
                              ? ' bg-gradient-to-r from-blue-500 to-purple-700 text-white'
                              : ''
                          }
                        >
                          {pageNum}
                        </Button>
                      )
                    },
                  )}
                </div>

                <Button
                  variant="outline"
                  disabled={page >= Math.ceil(total / page_size)}
                  onClick={() => handlePagination(page + 1)}
                  className="flex items-center space-x-2 disabled:opacity-50"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              <div className="text-sm text-gray-600">
                <span className="font-medium">
                  Page {page} of {Math.ceil(total / page_size)}
                </span>
                <span className="mx-2">•</span>
                <span>{total} total transactions</span>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

export default WalletSummaryPage

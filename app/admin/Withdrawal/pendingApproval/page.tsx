'use client'

import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchWithdrawList } from '@/store/slices/admin/withdrawlistSlice'
import WithdrawAction from '../page'
import Image from 'next/image'
import kaitimg from '../../../../assets/logo2x.png'
import {
  Search,
  Filter,
  Eye,
  Calendar,
  User,
  Mail,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Download,
  X,
  CreditCard,
  FileText,
  TrendingUp,
  Users,
  Activity,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'

interface WithdrawItem {
  withdraw_request_id: string
  user_id: string
  date_time: string
  full_name: string
  email: string
  amount: number
  status: string
  beneficiary_nick_name: string
  description: string
}

export default function PendingWithdrawRequests() {
  const dispatch = useAppDispatch()
  const { items, loading, error, total, total_pages, page } = useAppSelector(
    (state) => state.withdrawList,
  )

  const [openDialog, setOpenDialog] = useState(false)
  const [selectedWithdrawId, setSelectedWithdrawId] = useState<string | null>(
    null,
  )
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('pending')
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  useEffect(() => {
    dispatch(
      fetchWithdrawList({
        review_status: statusFilter,
        page: currentPage,
        page_size: pageSize,
      }),
    )
  }, [dispatch, statusFilter, currentPage, pageSize])

  const handleOpenDialog = (withdrawId: string, userId: string) => {
    setSelectedWithdrawId(withdrawId)
    setSelectedUserId(userId)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedWithdrawId(null)
    setSelectedUserId(null)
  }

  const handleRefresh = () => {
    dispatch(
      fetchWithdrawList({
        review_status: statusFilter,
        page: currentPage,
        page_size: pageSize,
      }),
    )
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
    setCurrentPage(1) // Reset to first page when changing page size
  }

  const handleStatusFilterChange = (newStatus: string) => {
    setStatusFilter(newStatus)
    setCurrentPage(1) // Reset to first page when changing filter
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      // case 'processing':
      //   return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock size={14} />
      case 'approved':
        return <CheckCircle size={14} />
      case 'rejected':
        return <XCircle size={14} />
      // case 'processing':
      //   return <Activity size={14} />
      default:
        return <AlertCircle size={14} />
    }
  }

  const filteredItems = items.filter(
    (item: WithdrawItem) =>
      item.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.beneficiary_nick_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  )

  const totalAmount = filteredItems.reduce((sum, item) => sum + item.amount, 0)
  const totalRequests = filteredItems.length

  // Calculate pagination info
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, total)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-purple-700 flex items-center justify-center p-4">
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border border-white/30 shadow-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white font-medium text-center">
            Loading withdraw requests...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-purple-700 p-4 lg:p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30">
              <CreditCard className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                Withdraw Requests
              </h1>
              <p className="text-white/80 text-lg">
                Manage and review withdrawal requests
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/30 transition-all shadow-lg text-white"
            >
              <RefreshCw
                className={`${loading ? 'animate-spin' : ''}`}
                size={16}
              />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white shadow-xl hover:bg-white/20 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium mb-1">
                  Total Requests
                </p>
                <p className="text-3xl font-bold">{total.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl">
                <FileText className="text-white" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white shadow-xl hover:bg-white/20 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium mb-1">
                  Current Page
                </p>
                <p className="text-3xl font-bold">
                  {
                    filteredItems.filter(
                      (item) => item.status.toLowerCase() === 'pending',
                    ).length
                  }
                </p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl">
                <Clock className="text-white" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white shadow-xl hover:bg-white/20 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium mb-1">
                  Total Amount
                </p>
                <p className="text-3xl font-bold">
                  ₹{totalAmount.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl">
                <TrendingUp className="text-white" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white shadow-xl hover:bg-white/20 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium mb-1">
                  Unique Users
                </p>
                <p className="text-3xl font-bold">
                  {new Set(filteredItems.map((item) => item.user_id)).size}
                </p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl">
                <Users className="text-white" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search by name, email, or beneficiary..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80 bg-white shadow-sm"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <Filter
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <select
                  value={statusFilter}
                  onChange={(e) => handleStatusFilterChange(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white shadow-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  {/* <option value="processing">Processing</option> */}
                </select>
              </div>

              {/* Page Size Selector */}
            </div>

            {/* View Toggle */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'table'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                }`}
              >
                Table
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'cards'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                }`}
              >
                Cards
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6 shadow-lg">
          <div className="flex items-center space-x-3">
            <XCircle className="text-red-500 flex-shrink-0" size={20} />
            <div>
              <h3 className="text-red-800 font-medium">Error Loading Data</h3>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Data Info */}

      {/* Content */}
      {viewMode === 'table' ? (
        /* Table View */
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <Calendar size={14} />
                      <span>Date</span>
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <User size={14} />
                      <span>User</span>
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <Mail size={14} />
                      <span>Email</span>
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <DollarSign size={14} />
                      <span>Amount</span>
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <AlertCircle size={14} />
                      <span>Status</span>
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <CreditCard size={14} />
                      <span>Beneficiary</span>
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <FileText size={14} />
                      <span>Description</span>
                    </div>
                  </th>
                  {statusFilter === 'pending' && (
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Action
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={statusFilter === 'pending' ? 8 : 7}
                      className="px-6 py-12 text-center"
                    >
                      <div className="flex flex-col items-center">
                        <FileText className="h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No requests found
                        </h3>
                        <p className="text-gray-600">
                          {searchTerm
                            ? 'Try adjusting your search terms'
                            : 'No withdrawal requests match the selected filters'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item: WithdrawItem) => (
                    <tr
                      key={item.withdraw_request_id}
                      className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all"
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(item.date_time).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                            {item.full_name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-900">
                            {item.full_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {item.email}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Image
                            src={kaitimg}
                            width={20}
                            height={20}
                            className="object-contain"
                            alt="KAIT Logo"
                          />
                          <span className="font-bold text-gray-900">
                            {item.amount.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}
                        >
                          {getStatusIcon(item.status)}
                          <span className="capitalize">{item.status}</span>
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.beneficiary_nick_name}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 max-w-xs truncate">
                        {item.description}
                      </td>
                      {statusFilter === 'pending' && (
                        <td className="px-4 py-4 whitespace-nowrap">
                          <button
                            onClick={() =>
                              handleOpenDialog(
                                item.withdraw_request_id,
                                item.user_id,
                              )
                            }
                            className="inline-flex items-center space-x-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-md text-sm font-medium"
                          >
                            <Eye size={14} />
                            <span>View</span>
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No requests found
              </h3>
              <p className="text-gray-600">
                {searchTerm
                  ? 'Try adjusting your search terms'
                  : 'No withdrawal requests match the selected filters'}
              </p>
            </div>
          ) : (
            filteredItems.map((item: WithdrawItem) => (
              <div
                key={item.withdraw_request_id}
                className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                      {item.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {item.full_name}
                      </h3>
                      <p className="text-gray-500 text-sm">{item.email}</p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}
                  >
                    {getStatusIcon(item.status)}
                    <span className="capitalize">{item.status}</span>
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm font-medium">
                      Amount
                    </span>
                    <div className="flex items-center space-x-2">
                      <Image
                        src={kaitimg}
                        width={16}
                        height={16}
                        className="object-contain"
                        alt="KAIT Logo"
                      />
                      <span className="font-bold text-gray-900">
                        {item.amount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm font-medium">
                      Date
                    </span>
                    <span className="text-gray-900 text-sm">
                      {new Date(item.date_time).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm font-medium">
                      Beneficiary
                    </span>
                    <span className="text-gray-900 text-sm">
                      {item.beneficiary_nick_name}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-gray-100">
                    <span className="text-gray-600 text-sm font-medium">
                      Description
                    </span>
                    <p className="text-gray-900 text-sm mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>

                {statusFilter === 'pending' && (
                  <div className="pt-4 border-t border-gray-100">
                    <button
                      onClick={() =>
                        handleOpenDialog(item.withdraw_request_id, item.user_id)
                      }
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg font-medium"
                    >
                      <Eye size={16} />
                      <span>View Details</span>
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {total > 0 && (
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 mt-6 shadow-lg border border-white/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Page Info */}
          <div className="text-sm text-gray-600">
            Showing{' '}
            <span className="font-medium text-gray-900">{startItem}</span> to{' '}
            <span className="font-medium text-gray-900">{endItem}</span> of{' '}
            <span className="font-medium text-gray-900">{total}</span> results —
            Page{' '}
            <span className="font-medium text-gray-900">{currentPage}</span> of{' '}
            <span className="font-medium text-gray-900">{total_pages}</span>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-2">
            {/* First Page */}
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <ChevronsLeft size={20} />
            </button>

            {/* Prev */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <ChevronLeft size={20} />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {(() => {
                const pages = []
                const maxVisible = 5
                let startPage = Math.max(
                  1,
                  currentPage - Math.floor(maxVisible / 2),
                )
                let endPage = Math.min(total_pages, startPage + maxVisible - 1)

                if (endPage - startPage + 1 < maxVisible) {
                  startPage = Math.max(1, endPage - maxVisible + 1)
                }

                for (let i = startPage; i <= endPage; i++) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() => handlePageChange(i)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        i === currentPage
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      {i}
                    </button>,
                  )
                }
                return pages
              })()}
            </div>

            {/* Next */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === total_pages}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === total_pages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <ChevronRight size={20} />
            </button>

            {/* Last */}
            <button
              onClick={() => handlePageChange(total_pages)}
              disabled={currentPage === total_pages}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === total_pages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <ChevronsRight size={20} />
            </button>
          </div>

          {/* Page Size Selector */}

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <label className="font-medium text-gray-700">Show:</label>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>per page</span>
          </div>
        </div>
      )}

      {/* Dialog */}
      {openDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Withdraw Request Details
              </h2>
              <button
                onClick={handleCloseDialog}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {selectedWithdrawId && selectedUserId && (
                <WithdrawAction
                  withdraw_request_id={selectedWithdrawId}
                  user_id={selectedUserId}
                  onClose={handleCloseDialog}
                />
              )}
            </div>
            <div className="flex justify-end p-6 border-t border-gray-200">
              <button
                onClick={handleCloseDialog}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// 'use client'

// import React, { useEffect, useState } from 'react'
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   Typography,
// } from '@mui/material'
// import { useAppDispatch, useAppSelector } from '@/store/hooks'
// import { fetchWithdrawList } from '@/store/slices/admin/withdrawlistSlice'
// import WithdrawAction from '../page'
// import Image from 'next/image'
// import kaitimg from '../../../../assets/logo2x.png'

// export default function PendingWithdrawRequests() {
//   const dispatch = useAppDispatch()
//   const { items, loading, error } = useAppSelector(
//     (state) => state.withdrawList,
//   )

//   const [openDialog, setOpenDialog] = useState(false)
//   const [selectedWithdrawId, setSelectedWithdrawId] = useState<string | null>(
//     null,
//   )
//   const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

//   useEffect(() => {
//     dispatch(
//       fetchWithdrawList({ review_status: 'pending', page: 1, page_size: 10 }),
//     )
//   }, [dispatch])

//   const handleOpenDialog = (withdrawId: string, userId: string) => {
//     setSelectedWithdrawId(withdrawId)
//     setSelectedUserId(userId)
//     setOpenDialog(true)
//   }

//   const handleCloseDialog = () => {
//     setOpenDialog(false)
//     setSelectedWithdrawId(null)
//     setSelectedUserId(null)
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
//       </div>
//     )
//   }

//   return (
//     <div className="p-6 space-y-6 bg-blue-100">
//       <div style={{ padding: 24 }} className=" bg-white rounded-2xl">
//         <Typography variant="h5" gutterBottom>
//           Pending Withdraw Requests
//         </Typography>

//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Date</TableCell>
//               <TableCell>User</TableCell>
//               <TableCell>Email</TableCell>
//               <TableCell>Amount</TableCell>
//               <TableCell>Status</TableCell>
//               <TableCell>Beneficiary</TableCell>
//               <TableCell>Description</TableCell>
//               <TableCell>Action</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {items.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={8} align="center">
//                   No data found
//                 </TableCell>
//               </TableRow>
//             ) : (
//               items.map((item) => (
//                 <TableRow key={item.withdraw_request_id}>
//                   <TableCell>{item.date_time}</TableCell>
//                   <TableCell>{item.full_name}</TableCell>
//                   <TableCell>{item.email}</TableCell>
//                   <TableCell>
//                     <div className=" flex items-center">
//                       <Image
//                         src={kaitimg}
//                         width={20}
//                         height={20}
//                         className=" object-contain ml-2"
//                         alt="Picture of the author"
//                       />
//                       <span className=" ml-0.5">
//                         {item.amount.toLocaleString('en-IN')}
//                       </span>
//                     </div>
//                   </TableCell>
//                   <TableCell>{item.status}</TableCell>
//                   <TableCell>{item.beneficiary_nick_name}</TableCell>
//                   <TableCell>{item.description}</TableCell>
//                   <TableCell>
//                     <Button
//                       variant="outlined"
//                       size="small"
//                       onClick={() =>
//                         handleOpenDialog(item.withdraw_request_id, item.user_id)
//                       }
//                     >
//                       View
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>

//         <Dialog
//           open={openDialog}
//           onClose={handleCloseDialog}
//           fullWidth
//           maxWidth="sm"
//         >
//           <DialogTitle>Withdraw Request Details</DialogTitle>
//           <DialogContent dividers>
//             {selectedWithdrawId && selectedUserId && (
//               <WithdrawAction
//                 withdraw_request_id={selectedWithdrawId}
//                 user_id={selectedUserId}
//                 onClose={handleCloseDialog}
//               />
//             )}
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleCloseDialog}>Close</Button>
//           </DialogActions>
//         </Dialog>
//       </div>
//     </div>
//   )
// }

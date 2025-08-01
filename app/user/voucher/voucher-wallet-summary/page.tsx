'use client'

import {
  Box,
  CircularProgress,
  MenuItem,
  Select,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchVoucherWalletSummary } from '@/store/slices/user/voucher/voucherWalletSummary'
import { motion } from 'framer-motion'
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  FileText,
  DollarSign,
} from 'lucide-react'

const VoucherWalletSummary = () => {
  const dispatch = useAppDispatch()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const { items, total, total_pages, loading, error } = useAppSelector(
    (state) => state.voucherWalletSummary,
  )

  useEffect(() => {
    dispatch(fetchVoucherWalletSummary({ page, page_size: pageSize }))
  }, [dispatch, page, pageSize])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <CircularProgress color="secondary" />
          <Typography className="mt-4 text-gray-600 font-medium">
            Loading transactions...
          </Typography>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-700 rounded-2xl p-8 mb-8 shadow-2xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <div>
              <Typography variant="h4" className="text-white font-bold">
                Voucher Wallet
              </Typography>
              <Typography className="text-blue-100">
                Track your transaction history and balance
              </Typography>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {[
              {
                icon: <FileText className="w-6 h-6 text-white" />,
                label: 'Total Transactions',
                value: total,
              },
              {
                icon: <TrendingUp className="w-6 h-6 text-green-300" />,
                label: 'Credits',
                value: items.filter((i) => i.transaction_type === 'credit')
                  .length,
              },
              {
                icon: <TrendingDown className="w-6 h-6 text-red-300" />,
                label: 'Debits',
                value: items.filter((i) => i.transaction_type === 'debit')
                  .length,
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
              >
                <div className="flex items-center gap-3">
                  {stat.icon}
                  <div>
                    <Typography className="text-white/80 text-sm">
                      {stat.label}
                    </Typography>
                    <Typography className="text-white text-2xl font-bold">
                      {stat.value}
                    </Typography>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-500 to-purple-700 p-6">
            <Typography
              variant="h6"
              className="text-white font-bold flex items-center gap-2"
            >
              <DollarSign className="w-5 h-5" />
              Transaction History
            </Typography>
          </div>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <TableCell>Date</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="center">Type</TableCell>
                  <TableCell align="right">Closing Balance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.length > 0 ? (
                  items.map((tx, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        {new Date(tx.date_time).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </TableCell>
                      <TableCell>{tx.description}</TableCell>
                      <TableCell align="right">
                        $
                        {tx.amount.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                        })}
                      </TableCell>
                      <TableCell align="center">
                        {tx.transaction_type === 'credit' ? 'Credit' : 'Debit'}
                      </TableCell>
                      <TableCell align="right">
                        $
                        {tx.closing_balance.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                        })}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No transactions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </motion.div>

        {/* Material UI Pagination */}
        {total_pages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-8 bg-white p-6 rounded-2xl shadow">
            <Pagination
              count={total_pages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
            />

            <div className="flex items-center gap-4 mt-4 sm:mt-0">
              <Select
                size="small"
                value={pageSize}
                
                onChange={(e) => {
                  setPage(1)
                  setPageSize(Number(e.target.value))
                }}
              >
                {[5, 10, 25, 50].map((size) => (
                  <MenuItem key={size} value={size}>
                    {size} / page
                  </MenuItem>
                ))}
              </Select>
            </div>

            <Typography className="text-gray-600 font-medium ">
              <span className="">
                page {page} of {total_pages} . {total} total transaction 
              </span>
            </Typography>
          </div>
        )}

        {error && (
          <Typography className="text-red-500 text-sm mt-6 text-center">
            {error}
          </Typography>
        )}
      </motion.div>
    </div>
  )
}

export default VoucherWalletSummary

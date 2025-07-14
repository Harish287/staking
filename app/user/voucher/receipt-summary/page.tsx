'use client'

import {
  Box,
  Button,
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
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchVoucherUsageSummary } from '@/store/slices/user/voucher/voucherUsageSummarySlice'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Logo from '@/assets/logo2x.png'

const VoucherUsageSummary = () => {
  const dispatch = useAppDispatch()
  const [page, setPage] = useState(1)
  const pageSize = 10

  const { items, total, total_pages, loading, error } = useAppSelector(
    (state) => state.voucherUsageSummary
  )

  useEffect(() => {
    dispatch(fetchVoucherUsageSummary({ page, page_size: pageSize }))
  }, [dispatch, page])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-pink-700 border-b-gray-800 border-l-transparent border-r-transparent"></div>
      </div>
    )
  }

  return (
    <Box className="bg-white p-5 rounded-lg shadow">
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Voucher Usage Summary
      </Typography>

      <TableContainer component={Paper} className="shadow-sm rounded-md">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell style={{ padding: '20px' }}><strong>Date</strong></TableCell>
              <TableCell style={{ padding: '20px' }}><strong>Description</strong></TableCell>
              <TableCell style={{ padding: '20px' }}><strong>Voucher</strong></TableCell>
              <TableCell style={{ padding: '20px' }} align="right"><strong>Total Amount</strong></TableCell>
              <TableCell style={{ padding: '20px' }} align="right"><strong>Used</strong></TableCell>
              <TableCell style={{ padding: '20px' }} align="right"><strong>Remaining</strong></TableCell>
              <TableCell style={{ padding: '20px' }} align="right"><strong>Coin</strong></TableCell>
              <TableCell style={{ padding: '20px' }} align="right"><strong>Status</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length > 0 ? (
              items.map((tx, idx) => (
                <motion.tr
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                >
                  <TableCell style={{ padding: '20px' }}>{tx.date_time}</TableCell>
                  <TableCell style={{ padding: '20px' }}>{tx.description}</TableCell>
                  <TableCell style={{ padding: '20px' }}>{tx.voucher}</TableCell>
                  <TableCell style={{ padding: '20px' }} align="right"> {tx.total_amount}</TableCell>
                  <TableCell style={{ padding: '20px' }} align="right"> {tx.used_amount}</TableCell>
                  <TableCell style={{ padding: '20px' }} align="right"> {tx.remaining_amount}</TableCell>
                  <TableCell
                    style={{
                      padding: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: '6px',
                    }}
                  >
                    {tx.coin}
                    <Image src={Logo} alt="logo" width={15} height={15} />
                  </TableCell>
                  <TableCell style={{ padding: '20px' }} align="right">
                    {tx.is_redeemed ? (
                      <span className="text-green-600 font-semibold">Redeemed</span>
                    ) : (
                      <span className="text-yellow-600 font-semibold">Active</span>
                    )}
                  </TableCell>
                </motion.tr>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No voucher usage found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {total_pages > 1 && (
        <Box
          mt={3}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
        >
          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              size="small"
              disabled={page <= 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            >
              Prev
            </Button>
            <Button
              variant="outlined"
              size="small"
              disabled={page >= total_pages}
              onClick={() => setPage((prev) => Math.min(prev + 1, total_pages))}
            >
              Next
            </Button>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body2">Total: {total}</Typography>
            <Select
              size="small"
              value={page}
              onChange={(e) => setPage(Number(e.target.value))}
            >
              {Array.from({ length: total_pages }, (_, i) => (
                <MenuItem key={i + 1} value={i + 1}>
                  Page {i + 1}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>
      )}

      {error && items.length > 0 && (
        <Typography color="error" mt={2}>
          {error}
        </Typography>
      )}
    </Box>
  )
}

export default VoucherUsageSummary

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
  TextField,
  debounce,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchRestakeWalletSummary } from '@/store/slices/user/walletSummary/restakeWalletSummarySlice'
import { ArrowDown, ArrowUp } from 'lucide-react'
import Image from 'next/image'
import kaitimg from '../../../../assets/logo2x.png'
import { motion } from 'framer-motion'

const MotionTableRow = motion(TableRow)

const RestakeWalletSummary = () => {
  const dispatch = useAppDispatch()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [searchValue, setSearchValue] = useState('')

  const { items, total, total_pages, loading, error } = useAppSelector(
    (state) => state.RestakewalletSummary,
  )

  useEffect(() => {
    dispatch(fetchRestakeWalletSummary({ page, search }))
  }, [dispatch, page, search])

  // Debounced search trigger
  const debouncedSearch = debounce((val: string) => {
    setPage(1)
    setSearch(val)
  }, 500)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
    debouncedSearch(e.target.value)
  }

  return (
    <Box className="p-5 rounded-lg shadow pt-5 bg-[#F3EAD8] hover:bg-blue-50 pb-[20px] transition-colors duration-2000">
      <div className=" bg-white p-5">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6" className=" flex gap-1 items-center" fontWeight="bold">
            <Image
              alt="KAIT Logo"
              src={kaitimg}
              width={24}
              height={24}
              className="object-contain"
            />
            Restake Wallet Transactions
          </Typography>
          <TextField
            size="small"
            variant="outlined"
            placeholder="Search description"
            value={searchValue}
            onChange={handleSearchChange}
          />
        </Box>
        {loading ? (
          <Box className="flex items-center justify-center min-h-[200px]">
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer component={Paper} className="shadow-sm rounded-md">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ padding: '20px' }}>
                      <strong>Description</strong>
                    </TableCell>
                    <TableCell style={{ padding: '20px' }}>
                      <strong>Date</strong>
                    </TableCell>
                    <TableCell style={{ padding: '20px' }} align="right">
                      <strong>Amount</strong>
                    </TableCell>
                    <TableCell style={{ padding: '20px' }} align="right">
                      <strong>Balance</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {error ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        align="center"
                        style={{ padding: '20px', color: 'red' }}
                      >
                        {error}
                      </TableCell>
                    </TableRow>
                  ) : items.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        align="center"
                        style={{ padding: '20px' }}
                      >
                        No transactions found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    items.map((tx, idx) => (
                      <MotionTableRow
                        key={idx}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                      >
                        <TableCell style={{ padding: '20px' }}>
                          {tx.description}
                        </TableCell>
                        <TableCell style={{ padding: '20px' }}>
                          {tx.date_time}
                        </TableCell>
                        <TableCell style={{ padding: '20px' }} align="right">
                          <div
                            className={`font-semibold flex justify-end items-center ${
                              tx.transaction_type === 'debit'
                                ? 'text-red-500'
                                : 'text-green-600'
                            }`}
                          >
                            {tx.transaction_type === 'debit' ? (
                              <ArrowDown className="w-4 h-4" />
                            ) : (
                              <ArrowUp className="w-4 h-4" />
                            )}
                            <Image
                              src={kaitimg}
                              width={15}
                              height={15}
                              alt="kait"
                              className="ml-1"
                            />
                            <span className="ml-0.5">
                              {tx.amount}{' '}
                              {tx.transaction_type === 'debit' ? 'Dr' : 'Cr'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell style={{ padding: '20px' }} align="right">
                          <div className="text-xs flex justify-end items-center">
                            <span>Bal:</span>
                            <Image
                              src={kaitimg}
                              width={15}
                              height={15}
                              alt="kait"
                              className="ml-1"
                            />
                            <span className="ml-0.5">{tx.closing_balance}</span>
                          </div>
                        </TableCell>
                      </MotionTableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {!error && total_pages > 1 && (
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
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Prev
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    disabled={page >= total_pages}
                    onClick={() => setPage((p) => p + 1)}
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
          </>
        )}
      </div>
    </Box>
  )
}

export default RestakeWalletSummary

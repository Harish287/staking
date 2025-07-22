'use client'

import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchVoucherBalance } from '@/store/slices/user/voucher/voucherBalanceSlice'
import {
  generateVoucher,
  resetGenerateVoucherState,
} from '@/store/slices/user/voucher/voucherGenerateSlice'
import {
  transferWalletOtp,
  resetOtpState,
} from '@/store/slices/user/TransferWalletOtpSlice'
import { fetchVoucherSummary } from '@/store/slices/user/voucher/voucherSummarySlice'
import toast from 'react-hot-toast'
import Image from 'next/image'
import Logo from '@/assets/logo2x.png'
import { ReceiptIndianRupee } from 'lucide-react'

export default function VoucherPage() {
  const dispatch = useAppDispatch()

  const [amount, setAmount] = useState('')
  const [otp, setOtp] = useState('')
  const [transactionPin, setTransactionPin] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)

  const { balance, loading: balanceLoading } = useAppSelector(
    (state) => state.VoucherBalance,
  )
  const {
    loading: generating,
    success,
    error,
    message,
  } = useAppSelector((state) => state.generateVoucher)
  const {
    loading: otpLoading,
    success: otpSuccess,
    error: otpError,
  } = useAppSelector((state) => state.TranferwalletOpt)
  const {
    items,
    loading: summaryLoading,
    error: summaryError,
  } = useAppSelector((state) => state.voucherSummary)

  useEffect(() => {
    dispatch(fetchVoucherBalance())
    dispatch(fetchVoucherSummary({ page: 1, page_size: 10 }))
  }, [dispatch])

  useEffect(() => {
    if (otpSuccess) {
      toast.success('OTP sent successfully')
      setDialogOpen(true)
      dispatch(resetOtpState())
    }
    if (otpError) {
      toast.error(otpError)
      dispatch(resetOtpState())
    }
  }, [otpSuccess, otpError, dispatch])

  useEffect(() => {
    if (success) {
      toast.success(message || 'Voucher generated successfully')
      setDialogOpen(false)
      setOtp('')
      setTransactionPin('')
      setAmount('')
      dispatch(fetchVoucherBalance())
      dispatch(fetchVoucherSummary({ page: 1, page_size: 10 }))
    }

    if (error) {
      if (typeof error === 'string') {
        toast.error(error)
      } else if (typeof error === 'object' && Array.isArray(error.detail)) {
        error.detail.forEach((detail: any) => {
          toast.error(detail.msg)
        })
      } else {
        toast.error('An unknown error occurred')
      }
    }

    return () => {
      dispatch(resetGenerateVoucherState())
    }
  }, [success, error, message, dispatch])

  const handleSendOtp = () => {
    const amountValue = Number(amount)
    if (!amount || isNaN(amountValue) || amountValue <= 100) {
      toast.error('Amount must be more than ₹100')
      return
    }

    dispatch(transferWalletOtp())
  }

  const handleConfirm = () => {
    if (!otp.trim() || !transactionPin.trim()) {
      toast.error('Please fill all fields')
      return
    }

    dispatch(
      generateVoucher({
        otp,
        transaction_pin: transactionPin,
        amount: Number(amount),
      }),
    )
  }

  if (otpLoading || balanceLoading || summaryLoading || generating) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-pink-700 border-b-gray-800 border-l-transparent border-r-transparent"></div>
      </div>
    )
  }

  return (
    <div className="bg-[#F3EAD8] min-h-screen hover:bg-blue-50 transition-colors duration-2000">
      <div className="grid md:grid-cols-[40%_60%] sm:grid-cols-1 gap-6 pt-5 max-w-6xl m-auto py-10">
        <Box className="p-6 shadow rounded bg-white space-y-6">
          <Typography variant="h6" className="font-extrabold text-2xl">
            Voucher Generator
          </Typography>

          {balanceLoading ? (
            <div className="flex justify-center py-8">
              <CircularProgress />
            </div>
          ) : (
            <Box className=" bg-gradient-to-r from-blue-500 to-purple-700  text-white p-4 rounded-2xl space-y-2">
              <div className=" flex items-center gap-2">
                <div>
                  <ReceiptIndianRupee className=" w-[40px] h-[40px]" />
                </div>
                <div>
                  <Typography>
                    Total Voucher Wallet | Voucher Generated
                  </Typography>
                  <Typography className="gap-1 flex items-center">
                    <Image src={Logo} alt="Logo" width={20} height={20} />
                    {balance?.total}
                    <span>|</span>
                    <Image src={Logo} alt="Logo" width={20} height={20} />
                    {balance?.voucher_generated}
                  </Typography>
                </div>
              </div>
            </Box>
          )}

          <Box className="border p-4 rounded space-y-4 bg-white ">
            <TextField
              label="Amount"
              fullWidth
              type="number"
              style={{ marginBottom: '20px' }}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <Button
              fullWidth
              variant="contained"
              className=" bg-gradient-to-r from-blue-500 to-purple-700 text-white"
              onClick={handleSendOtp}
              disabled={otpLoading}
            >
              {otpLoading ? 'Sending OTP...' : 'Process Your Request'}
            </Button>
          </Box>

          <Typography className="flex items-center justify-center  gap-2">
            <div className=" border flex items-center rounded-xl p-2 border-red-500">
              {' '}
              KAIT Current Price :
              {/* <Image src={Logo} alt="Logo" width={20} height={20} /> */}₹
              {balance?.kait_value}
            </div>
          </Typography>

          <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
            <DialogTitle>Enter OTP and PIN</DialogTitle>
            <DialogContent dividers>
              <TextField
                fullWidth
                label="OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                margin="dense"
              />
              <TextField
                fullWidth
                label="Transaction PIN"
                type="password"
                value={transactionPin}
                onChange={(e) => setTransactionPin(e.target.value)}
                margin="dense"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button
                onClick={handleConfirm}
                variant="contained"
                disabled={generating}
                className=" bg-gradient-to-r from-blue-500 to-purple-700 text-white"
              >
                {generating ? 'Generating...' : 'Confirm'}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>

        {/* Right: Voucher Summary */}
        <Box className="bg-white p-6 rounded shadow space-y-4">
          <Typography variant="h6" className="text-2xl font-extrabold">
            Voucher Summary
          </Typography>

          {summaryLoading && <Typography>Loading summary...</Typography>}

          {summaryError && summaryError !== 'No records found' && (
            <Typography className="text-red-600">{summaryError}</Typography>
          )}

          {!summaryLoading && (
            <TableContainer component={Paper} className="shadow">
              <Table size="small">
                <TableHead>
                  <TableRow className="bg-blue-100">
                    <TableCell>Voucher</TableCell>
                    <TableCell>PIN</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Balance</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        Coin
                        <Image src={Logo} alt="logo" width={15} height={15} />
                      </div>
                    </TableCell>
                    <TableCell>Redeemed</TableCell>
                    <TableCell>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.length > 0 ? (
                    items.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{item.voucher}</TableCell>
                        <TableCell>{item.pin}</TableCell>
                        <TableCell>₹ {item.amount}</TableCell>
                        <TableCell>₹ {item.balance_amount}</TableCell>
                        <TableCell>
                          <Box className="flex items-center gap-1">
                            <span>{item.coin}</span>
                            <Image
                              src={Logo}
                              alt="logo"
                              width={15}
                              height={15}
                            />
                          </Box>
                        </TableCell>
                        <TableCell>
                          {item.is_redeemed ? (
                            <span className="text-green-600">Yes</span>
                          ) : (
                            <span className="text-red-600">No</span>
                          )}
                        </TableCell>
                        <TableCell>{item.description}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No voucher transactions found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </div>
    </div>
  )
}

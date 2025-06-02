'use client'

import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  initiateIncomeTransfer,
  resetTransferState,
} from '@/store/slices/user/incomeTransferSlice'
import { transferWalletOtp } from '@/store/slices/user/TransferWalletOtpSlice'
import { fetchEligibleUsers } from '@/store/slices/user/eligibleUserTransferSlice'
import { fetchTransferPinStatus } from '@/store/slices/user/transferPinStatusSlice'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from '@mui/material'

import Image from 'next/image'
import { ArrowRightLeft } from 'lucide-react'
import { unwrapResult } from '@reduxjs/toolkit'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

import FiatWalletImg from '../../../../assets/fiatwallet.jpg'

const IncomeTransferForm = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const {
    loading: transferLoading,
    success: transferSuccess,
    error: transferError,
  } = useAppSelector((state) => state.incometransfer)

  const {
    loading: otpLoading,
    success: otpSuccess,
    error: otpError,
  } = useAppSelector((state) => state.TranferwalletOpt)

  const { users: eligibleUsers, loading: eligibleLoading } = useAppSelector(
    (state) => state.eligibleUsersTransfer,
  )

  const walletBalance =
    useAppSelector((state) => state.auth.user?.income_wallet) || 0

  const [openDialog, setOpenDialog] = useState(false)

  const [form, setForm] = useState({
    receiver_user_id: '',
    amount: '',
    otp: '',
    transaction_pin: '',
  })

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const isEligible = eligibleUsers.some(
    (user) =>
      user.email.toLowerCase() === form.receiver_user_id.trim().toLowerCase(),
  )

  const handleStartTransfer = async () => {
    if (!form.receiver_user_id || !form.amount) {
      toast.error('Please fill out Receiver Email and Amount')
      return
    }

    if (!isEligible) {
      toast.error('Receiver is not eligible for transfer.')
      return
    }

    if (!token) {
      toast.error('Authentication token missing')
      return
    }

    try {
      const actionResult = await dispatch(fetchTransferPinStatus(token))
      const pinStatus = unwrapResult(actionResult)

      if (!pinStatus) {
        toast.error('Set your transaction password before transferring.')
        router.push('/user/profile?tab=TRANS.PWD')
        return
      }

      dispatch(transferWalletOtp())
      setOpenDialog(true)
    } catch {
      toast.error('Error checking transfer pin status.')
    }
  }

  const handleSubmit = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault()

    if (!token) {
      toast.error('Auth token missing')
      return
    }

    dispatch(
      initiateIncomeTransfer({
        ...form,
        amount: parseFloat(form.amount),
        token,
      }),
    )
    setOpenDialog(false)
  }

  useEffect(() => {
    if (token) {
      dispatch(fetchEligibleUsers(token))
    }
  }, [token, dispatch])

  useEffect(() => {
    if (transferSuccess || transferError) {
      setTimeout(() => dispatch(resetTransferState()), 3000)
    }
  }, [transferSuccess, transferError, dispatch])

  return (
    <div className="pt-5 bg-[#F3EAD8] hover:bg-blue-50 pb-[20px] transition-colors duration-2000  mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className=" container m-auto">
        <h1 className="  flex items-center text-2xl font-bold mb-6  mt-5">
          <ArrowRightLeft className="mr-2" /> Transfer Income Wallet
        </h1>
        <div className="bg-white  rounded-lg shadow-lg p-4">
          <h2 className="text-lg p-2   rounded-[10px] w-fit font-semibold mb-2 bg-gradient-to-r from-pink-700 to-gray-800 text-white">
            Income Wallet Balance: ₹{walletBalance}
          </h2>
          <div className="flex flex-col md:flex-row  p-6   gap-6">
            {/* Wallet Summary */}
            <div className="md:w-1/3 flex  items-center text-center">
              <Image
                src={FiatWalletImg}
                alt="Fiat Wallet"
                className="rounded-md h-[300px] w-full object-fill"
              />
            </div>

            {/* Transfer Form */}
            <form
              onSubmit={handleSubmit}
              className="w-full md:w-1/3 p-6  rounded-lg"
            >
              <h2 className="text-xl font-semibold mb-4">Transfer Form</h2>

              {transferSuccess && (
                <Typography color="success.main" className="mb-2">
                  Transfer successful!
                </Typography>
              )}
              {transferError && (
                <Typography color="error.main" className="mb-2">
                  Error: {transferError}
                </Typography>
              )}

              <TextField
                name="receiver_user_id"
                label="Receiver Email"
                type="email"
                placeholder="Enter receiver's email"
                value={form.receiver_user_id}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                error={form.receiver_user_id !== '' && !isEligible}
                helperText={
                  form.receiver_user_id !== '' ? (
                    isEligible ? (
                      <Typography
                        sx={{ color: 'green' }}
                        style={{ fontSize: '12px' }}
                      >
                        Eligible for transfer
                      </Typography>
                    ) : (
                      'This user is not eligible for transfer.'
                    )
                  ) : (
                    ''
                  )
                }
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor:
                        form.receiver_user_id === ''
                          ? undefined
                          : isEligible
                            ? 'green'
                            : 'red',
                    },
                    '&:hover fieldset': {
                      borderColor:
                        form.receiver_user_id === ''
                          ? undefined
                          : isEligible
                            ? 'green'
                            : 'red',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor:
                        form.receiver_user_id === ''
                          ? undefined
                          : isEligible
                            ? 'green'
                            : 'red',
                    },
                  },
                }}
              />

              <TextField
                label="Amount"
                name="amount"
                type="number"
                value={form.amount}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />

              <Button
                type="button"
                variant="contained"
                color="primary"
                onClick={handleStartTransfer}
                disabled={otpLoading}
                fullWidth
                sx={{ mt: 2 }}
              >
                {otpLoading ? 'Sending OTP...' : 'Process Request'}
              </Button>

              {/* OTP Modal */}
              <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Confirm Transfer</DialogTitle>
                <DialogContent>
                  <TextField
                    label="OTP"
                    name="otp"
                    value={form.otp}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                  />
                  <TextField
                    label="Transaction Pin"
                    name="transaction_pin"
                    type="password"
                    value={form.transaction_pin}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                  />
                  {otpSuccess && (
                    <Typography color="success.main" sx={{ mt: 1 }}>
                      OTP sent successfully!
                    </Typography>
                  )}
                  {otpError && (
                    <Typography color="error.main" sx={{ mt: 1 }}>
                      Error: {otpError}
                    </Typography>
                  )}
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpenDialog(false)} color="inherit">
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={transferLoading}
                  >
                    {transferLoading ? 'Processing...' : 'Process the Transfer'}
                  </Button>
                </DialogActions>
              </Dialog>
            </form>

            {/* Transfer Rules */}
            <div className="w-full md:w-1/3 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">
                About Income Wallet Transfer
              </h3>
              <div className="space-y-4 text-sm text-gray-700">
                {[
                  'Ensure receiver’s email is correct; we are not liable for incorrect transfers.',
                  'Only downline transfers are allowed — no cross-line transfers.',
                  '1st level recipients allowed by default.',
                  '2nd level allowed if you have 2 paid directs.',
                  '3rd level allowed if you have 3 paid directs.',
                  '4th level+ allowed only if you are Bronze.',
                  'Income Wallet can be transferred to your KAIT wallet or others’ income wallet.',
                  '10% deduction applies (2% admin + 8% leadership).',
                ].map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="font-semibold">{idx + 1}.</span>
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IncomeTransferForm

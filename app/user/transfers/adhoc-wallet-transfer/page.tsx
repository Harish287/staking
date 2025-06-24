'use client'

import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  initiateadhocTransfer,
  resetTransferState,
} from '@/store/slices/user/adhocTransferSlice'
import {
  resetOtpState,
  transferWalletOtp,
} from '@/store/slices/user/TransferWalletOtpSlice'
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
  Autocomplete,
} from '@mui/material'

import Image from 'next/image'
import { ArrowRightLeft } from 'lucide-react'
import { unwrapResult } from '@reduxjs/toolkit'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Logo from '../../../../assets/logo2x.png'
import FiatWalletImg from '../../../../assets/fiatwallet.jpg'

const AdhocWalletTransfer = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const {
    loading: transferLoading,
    success: transferSuccess,
    error: transferError,
    message: transferMessage,
  } = useAppSelector((state) => state.AdhocWalletTransfer)

  const {
    loading: otpLoading,
    success: otpSuccess,
    error: otpError,
  } = useAppSelector((state) => state.TranferwalletOpt)

  const { users: eligibleUsers } = useAppSelector(
    (state) => state.eligibleUsersTransfer,
  )

  const walletBalance =
    useAppSelector((state) => state.auth.user?.income_wallet) || 0

  const [openDialog, setOpenDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)

  const [form, setForm] = useState({
    receiver_user_id: '',
    receiver_user_email: '',
    amount: '',
    otp: '',
    transaction_pin: '',
  })

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleStartTransfer = async () => {
    if (!form.receiver_user_id || !form.amount) {
      toast.error('Please fill out recipient and amount')
      return
    }

    const amountNumber = parseFloat(form.amount)
    if (isNaN(amountNumber) || amountNumber <= 500) {
      toast.error('Amount should be greater than 500')
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

      await dispatch(transferWalletOtp())
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
      initiateadhocTransfer({
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
    if (transferSuccess) {
      toast.success(transferMessage || 'Transfer completed successfully')
      dispatch(resetTransferState())
      setForm({
        receiver_user_id: '',
        receiver_user_email: '',
        amount: '',
        otp: '',
        transaction_pin: '',
      })
      setSelectedUser(null)
    }

    if (transferError) {
      let errorMessage = 'An error occurred during transfer.'

      if (typeof transferError === 'string') {
        errorMessage = transferError
      } else if (
        transferError &&
        typeof transferError === 'object' &&
        typeof transferError.detail === 'string'
      ) {
        errorMessage = transferError.detail
      }

      toast.error(errorMessage)
      dispatch(resetTransferState())
    }
  }, [transferSuccess, transferError, transferMessage, dispatch])

  useEffect(() => {
    if (otpSuccess) {
      toast.success('OTP sent successfully')
      dispatch(resetOtpState())
    }
    if (otpError) {
      toast.error(otpError)
      dispatch(resetOtpState())
    }
  }, [otpSuccess, otpError, dispatch])

  return (
    <div className="pt-5 bg-[#F3EAD8] hover:bg-blue-50 pb-[20px] transition-colors duration-2000 mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="container m-auto">
        <h1 className="flex items-center text-2xl font-bold mb-6 mt-5">
          <ArrowRightLeft className="mr-2" /> Transfer Adhoc Wallet
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-lg p-2 rounded-[10px] flex  w-fit font-semibold mb-2 bg-gradient-to-r from-pink-700 to-gray-800 text-white">
            Adhoc Wallet Balance:
            <div className=" flex items-center ml-0.5">
              <Image
                src={Logo}
                alt="Logo"
                priority
                width={15}
                height={15}
                className=" mr-0.5"
              />
              <span>{walletBalance}</span>
            </div>
          </h2>
          <div className="flex flex-col md:flex-row pb-6 gap-6">
            <div className="md:w-1/3 flex items-center text-center">
              <Image
                src={FiatWalletImg}
                alt="Fiat Wallet"
                className="rounded-md h-[300px] w-full object-fill"
              />
            </div>

            <form
              onSubmit={handleSubmit}
              className="w-full md:w-1/3 rounded-lg"
            >
              <h2 className="text-xl flex items-center gap-1 font-semibold mb-4">
                <Image
                  src={Logo}
                  alt="Logo"
                  className="rounded-md h-[25px] w-[25px] object-fill"
                />
                Transfer Adhoc Wallet
              </h2>

              <Autocomplete
                options={eligibleUsers}
                getOptionLabel={(option) => option.email}
                isOptionEqualToValue={(option, value) =>
                  option.id === value?.id
                }
                value={
                  eligibleUsers.find(
                    (user) => user.id === form.receiver_user_id,
                  ) || null
                }
                onChange={(event, value) => {
                  setForm({
                    ...form,
                    receiver_user_id: value?.id || '',
                    receiver_user_email: value?.email || '',
                  })
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Recipient Email"
                    placeholder="Enter or select email"
                    required
                    fullWidth
                  />
                )}
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
                style={{ background: 'green' }}
                onClick={handleStartTransfer}
                disabled={otpLoading}
                fullWidth
                sx={{ mt: 2 }}
              >
                {otpLoading ? 'Sending OTP...' : 'Process Request'}
              </Button>

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

            <div className="w-full md:w-1/3 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">
                About Adhoc Wallet Transfer
              </h3>
              <div className="space-y-4 text-sm text-gray-700">
                {[
                  'Make Sure the email id of transferee is correct and right, we are not responsible for wrong Transfer',
                  'Transfer is restricted to your Downline & Upline of Kairaa Family ',
                  'Make Sure the Email Id of Receipient should be a part of your team',
                  'Deduction of 10% apply out of which 2% for Admin Charges and 8% for Adhoc Leadership Income',
                ].map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="font-semibold bg-blue-300 text-white px-2 py-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-[12px]">{rule}</span>
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

export default AdhocWalletTransfer

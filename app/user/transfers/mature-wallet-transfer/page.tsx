'use client'

import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  initiateFiatTransfer,
  resetTransferState,
} from '@/store/slices/user/fiatWalletTransfer'
import {
  transferWalletOtp,
  resetOtpState,
} from '@/store/slices/user/TransferWalletOtpSlice'
import { fetchEligibleUsers } from '@/store/slices/user/eligibleUserTransferSlice'
import { fetchTransferPinStatus } from '@/store/slices/user/transferPinStatusSlice'
import { fetchDropdownOptions } from '@/store/slices/dropdownOptions'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
} from '@mui/material'

import Image from 'next/image'
import { ArrowRightLeft } from 'lucide-react'
import { unwrapResult } from '@reduxjs/toolkit'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Logo from '../../../../assets/logo2x.png'
import FiatWalletImg from '../../../../assets/fiatwallet.jpg'
import { RootState } from '@/store/store'

const FiatTransferForm = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const {
    loading: transferLoading,
    success: transferSuccess,
    error: transferError,
    message: transferMessage,
  } = useAppSelector((state) => state.fiattransfer)

  const {
    loading: otpLoading,
    success: otpSuccess,
    error: otpError,
  } = useAppSelector((state) => state.TranferwalletOpt)

  const walletBalance =
    useAppSelector((state) => state.auth.user?.Fiat_wallet) || 0

  const {
    data: dropDownOptions,
    loading: loadingOptions,
    error: optionsError,
  } = useAppSelector((state: RootState) => state.dropDownOptions)

  const [openDialog, setOpenDialog] = useState(false)

  const [form, setForm] = useState({
    transfer_mode: '',
    amount: '',
    otp: '',
    transaction_pin: '',
  })

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleStartTransfer = async () => {
    if (!form.transfer_mode || !form.amount) {
      toast.error('Please select transfer mode and amount')
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
      initiateFiatTransfer({
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
      dispatch(fetchDropdownOptions())
    }
  }, [token, dispatch])

  useEffect(() => {
    if (transferSuccess) {
      toast.success(transferMessage || 'Transfer completed successfully')
      dispatch(resetTransferState())
      setForm({
        transfer_mode: '',
        amount: '',
        otp: '',
        transaction_pin: '',
      })
    }

    if (transferError) {
      const errorMessage =
        typeof transferError === 'string'
          ? transferError
          : transferError?.detail || 'An error occurred during transfer.'

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
    <div className="pt-5 bg-[#F3EAD8] hover:bg-blue-50 pb-10 transition-colors duration-2000 mx-auto px-4 sm:px-6 lg:px-8">
      <div className="container m-auto">
        <h1 className="flex items-center text-2xl font-bold mb-6 mt-5">
          <ArrowRightLeft className="mr-2" /> Transfer Maturity Wallet
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-lg p-2 rounded-[10px] w-fit font-semibold mb-4 bg-gradient-to-r from-pink-700 to-gray-800 text-white">
            Maturity Wallet Balance: ₹{walletBalance}
          </h2>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <Image
                src={FiatWalletImg}
                alt="Fiat Wallet"
                className="rounded-md h-[300px] w-full object-fill"
              />
            </div>

            <form onSubmit={handleSubmit} className="w-full md:w-1/3">
              <h2 className="text-xl flex items-center gap-2 font-semibold mb-4">
                <Image
                  src={Logo}
                  alt="Logo"
                  className="h-[25px] w-[25px] object-fill rounded-md"
                />{' '}
                Transfer Fiat Wallet
              </h2>

              <Autocomplete
                options={dropDownOptions?.fait_transfer_options || []}
                getOptionLabel={(option) => option.value}
                onChange={(e, value) =>
                  setForm({ ...form, transfer_mode: value?.id || '' })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Transfer Mode"
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
                sx={{ background: 'green', mt: 2 }}
                onClick={handleStartTransfer}
                disabled={otpLoading}
                fullWidth
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
                About Fiat Wallet Transfer
              </h3>
              <div className="space-y-4 text-sm text-gray-700">
                {[
                  'Ensure receiver’s email is correct; we are not liable for incorrect transfers.',
                  'Only downline transfers are allowed — no cross-line transfers.',
                  '1st level recipients allowed by default.',
                  '2nd level allowed if you have 2 paid directs.',
                  '3rd level allowed if you have 3 paid directs.',
                  '4th level+ allowed only if you are Bronze.',
                  'Fiat Wallet can be transferred to your KAIT wallet or others’ Fiat wallet.',
                  '10% deduction applies (2% admin + 8% leadership).',
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

export default FiatTransferForm

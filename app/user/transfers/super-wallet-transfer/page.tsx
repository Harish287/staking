'use client'

import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  initiateUplineDownlineTransfer,
  initiateSelfTransfer,
  resetTransferState,
} from '@/store/slices/user/superWalletTransferSlice'
import {
  transferWalletOtp,
  resetOtpState,
} from '@/store/slices/user/TransferWalletOtpSlice'
import { fetchEligibleUsers } from '@/store/slices/user/eligibleUserTransferSlice'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Autocomplete,
} from '@mui/material'
import { ArrowRightLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import Image from 'next/image'
import WalletImage from '../../../../assets/fiatwallet.jpg'
import Logo from '../../../../assets/logo2x.png'

const SuperWalletTransfer = () => {
  const dispatch = useAppDispatch()

  const { users: eligibleUsers } = useAppSelector(
    (state) => state.eligibleUsersTransfer,
  )

  const { loading, success, error } = useAppSelector(
    (state: any) => state.SuperWalletTransfer,
  )
  const {
    loading: otpLoading,
    success: otpSuccess,
    error: otpError,
  } = useAppSelector((state) => state.TranferwalletOpt)

  const [wallet, setWallet] = useState<
    'AdhocWallet' | 'IncomeWallet' | 'SuperWallet'
  >('AdhocWallet')

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

  useEffect(() => {
    if (token) {
      dispatch(fetchEligibleUsers(token))
    }
  }, [token, dispatch])

  useEffect(() => {
    if (success) {
      toast.success('Transfer completed successfully')
      dispatch(resetTransferState())
      resetForm()
    } else if (error) {
      const errMsg =
        typeof error === 'string'
          ? error
          : error?.detail || 'Transfer failed. Try again.'
      toast.error(errMsg)
      dispatch(resetTransferState())
    }
  }, [success, error, dispatch])

  useEffect(() => {
    if (otpSuccess) {
      toast.success('OTP sent successfully')
      dispatch(resetOtpState())
    } else if (otpError) {
      toast.error(otpError)
      dispatch(resetOtpState())
    }
  }, [otpSuccess, otpError, dispatch])

  const resetForm = () => {
    setWallet('AdhocWallet')
    setSelectedUser(null)
    setForm({
      receiver_user_id: '',
      receiver_user_email: '',
      amount: '',
      otp: '',
      transaction_pin: '',
    })
  }

  const handleStartTransfer = async () => {
    const amount = parseFloat(form.amount)
    if (isNaN(amount) || amount <= 500) {
      toast.error('Amount must be greater than 500')
      return
    }

    if (
      wallet === 'SuperWallet' &&
      (!form.receiver_user_id || !form.receiver_user_email)
    ) {
      toast.error('Please select a valid recipient')
      return
    }

    try {
      await dispatch(transferWalletOtp())
      setOpenDialog(true)
    } catch {
      toast.error('OTP sending failed')
    }
  }

  const handleConfirmTransfer = (e: React.FormEvent) => {
    e.preventDefault()

    const { otp, transaction_pin, amount, receiver_user_id } = form
    if (
      !otp ||
      otp.length < 4 ||
      !transaction_pin ||
      transaction_pin.length < 4
    ) {
      toast.error('Enter valid OTP and Transaction PIN')
      return
    }

    const parsedAmount = parseFloat(amount)

    if (wallet === 'SuperWallet') {
      dispatch(
        initiateUplineDownlineTransfer({
          otp,
          transaction_pin,
          receiver_user_id,
          amount: parsedAmount,
        }),
      )
    } else {
      dispatch(
        initiateSelfTransfer({
          otp,
          transaction_pin,
          wallet,
          amount: parsedAmount,
        }),
      )
    }

    setOpenDialog(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  return (
    <div className="pt-5 bg-[#F3EAD8] hover:bg-blue-50 pb-10 transition-colors duration-2000 mx-auto px-4 sm:px-6 lg:px-8">
      <div className="container m-auto">
        <h1 className="flex items-center text-2xl font-bold mb-6 mt-5">
          <ArrowRightLeft className="mr-2" /> Super Wallet Transfer
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <Image
                src={WalletImage}
                alt="Wallet"
                className="rounded-md h-[300px] w-full object-fill"
              />
            </div>

            <form
              onSubmit={handleConfirmTransfer}
              className="w-full md:w-1/3 space-y-4"
            >
              <h2 className="text-xl flex items-center gap-2 font-semibold mb-4">
                <Image src={Logo} alt="Logo" width={25} height={25} />
                Transfer Super Wallet
              </h2>

              <TextField
                label="Wallet Type"
                select
                style={{ marginBottom: '20px' }}
                fullWidth
                value={wallet}
                onChange={(e) =>
                  setWallet(
                    e.target.value as
                      | 'AdhocWallet'
                      | 'IncomeWallet'
                      | 'SuperWallet',
                  )
                }
              >
                <MenuItem value="AdhocWallet">My Adhoc Wallet</MenuItem>
                <MenuItem value="IncomeWallet">My Income Wallet</MenuItem>
                <MenuItem value="SuperWallet">Others Super Wallet</MenuItem>
              </TextField>

              {wallet === 'SuperWallet' && (
                <Autocomplete
                  value={selectedUser}
                  onChange={(e, value) => {
                    setSelectedUser(value)
                    setForm({
                      ...form,
                      receiver_user_id: value?.id || '',
                      receiver_user_email: value?.email || '',
                    })
                  }}
                  options={eligibleUsers}
                  getOptionLabel={(option) => option.email}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value?.id
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Recipient Email" required />
                  )}
                />
              )}

              <TextField
                label="Amount"
                name="amount"
                type="number"
                value={form.amount}
                onChange={handleChange}
                fullWidth
                required
              />

              <Button
                type="button"
                variant="contained"
                sx={{ background: 'green', mt: 2 }}
                onClick={handleStartTransfer}
                fullWidth
              >
                {otpLoading ? 'Sending OTP...' : 'Send OTP'}
              </Button>
            </form>

            {/* Right Section Info */}
            <div className="w-full md:w-1/3 p-4">
              <h3 className="text-lg font-semibold mb-4">
                Super Wallet Transfer Info
              </h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Minimum amount is 500.</li>
                <li>• Transaction PIN required to proceed.</li>
                <li>• Downline transfers only when selecting others.</li>
                <li>• Cross-level restrictions may apply.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* OTP + PIN Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Enter OTP & Transaction PIN</DialogTitle>
        <DialogContent className="space-y-4 mt-2">
          <TextField
            label="OTP"
            name="otp"
            fullWidth
            value={form.otp}
            onChange={handleChange}
          />
          <TextField
            label="Transaction PIN"
            name="transaction_pin"
            type="password"
            fullWidth
            value={form.transaction_pin}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirmTransfer}
          >
            {loading ? 'Processing...' : 'Confirm Transfer'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default SuperWalletTransfer

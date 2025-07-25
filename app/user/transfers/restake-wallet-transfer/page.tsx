'use client'
import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  initiateRestake,
  resetRestakeState,
} from '@/store/slices/user/restakeTransferSlice'
import {
  resetOtpState,
  transferWalletOtp,
} from '@/store/slices/user/TransferWalletOtpSlice'
import { fetchTransferPinStatus } from '@/store/slices/user/transferPinStatusSlice'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import FiatWalletImg from '../../../../assets/fiatwallet.jpg'
import Image from 'next/image'
import { ArrowRightLeft } from 'lucide-react'
import Logo from '../../../../assets/logo2x.png'
import { fetchUserData } from '@/store/slices/user/userTreeDataReducer'
import { fetchWalletBalance } from '@/store/slices/user/TransferBalanceSlice'

const RestakeWalletTransfer = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const { loading, success, error } = useAppSelector(
    (state) => state.restaketransfer,
  )
  const {
    success: otpSuccess,
    error: otpError,
    loading: otpLoading,
  } = useAppSelector((state) => state.TranferwalletOpt)

  const {
    balances,
    loading: balanceloading,
    error: adhocerror,
  } = useAppSelector((state) => state.transferBalance)

  useEffect(() => {
    dispatch(fetchWalletBalance('ReStakeWallet'))
  }, [dispatch])

  const [amount, setAmount] = useState<number>(0)
  const [otp, setOtp] = useState('')
  const [transactionPin, setTransactionPin] = useState('')
  const [openDialog, setOpenDialog] = useState(false)

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''

  const handleStartRestake = async () => {
    if (!amount || amount <= 500) {
      toast.error('Amount Should be Greater than 500')
      return
    }

    if (!token) {
      toast.error('Authentication token missing')
      return
    }

    try {
      const result = await dispatch(fetchTransferPinStatus(token)).unwrap()
      if (!result) {
        toast.error('Please set your transaction pin first')
        router.push('/user/profile?tab=TRANS.PWD')
        return
      }

      dispatch(transferWalletOtp())
      setOpenDialog(true)
    } catch (error) {
      toast.error('Failed to check pin status')
    }
  }

  const handleSubmit = () => {
    if (!otp || otp.length < 4) {
      toast.error('Please enter a valid OTP.')
      return
    }

    if (!transactionPin || transactionPin.length < 4) {
      toast.error('Please enter a valid transaction pin.')
      return
    }

    if (!token) {
      toast.error('Authentication token missing.')
      return
    }

    dispatch(
      initiateRestake({ otp, transaction_pin: transactionPin, amount, token }),
    )
    setOpenDialog(false)
  }

  useEffect(() => {
    if (error && typeof error === 'string' && error.trim()) {
      toast.error(error)
    }
  }, [error])

  useEffect(() => {
    if (success) {
      toast.success('Restake successful!')
    }
  }, [success])

  useEffect(() => {
    if (success || error) {
      setTimeout(() => dispatch(resetRestakeState()), 3000)
    }
  }, [success, error, dispatch])

  useEffect(() => {
    if (error) {
      let errorMessage = 'Ros failed'

      if (typeof error === 'string') {
        errorMessage = error
      } else if (typeof error === 'object' && error !== null) {
        if (typeof error.detail === 'string' && error.detail.trim() !== '') {
          errorMessage = error.detail
        } else {
          errorMessage = JSON.stringify(error) || errorMessage
        }
      }

      toast.error(errorMessage)
    }
  }, [error])

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

  if (otpLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-pink-700 border-b-gray-800 border-l-transparent border-r-transparent"></div>
      </div>
    )
  }
  return (
    <div className="pt-5 bg-[#F3EAD8] pb-[20px] transition-colors duration-2000 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <h1 className="flex items-center text-2xl font-bold mb-6 mt-5">
          <ArrowRightLeft className="mr-2" /> Transfer Restake Wallet
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-lg p-2 rounded-[10px] flex  w-fit font-semibold mb-2  bg-gradient-to-r from-blue-500 to-purple-700 text-white">
            Restake Wallet Balance:
            <div className=" flex items-center ml-0.5">
              <Image
                src={Logo}
                alt="Logo"
                priority
                width={15}
                height={15}
                className=" mr-0.5"
              />
              {Number(balances?.ReStakeWallet?.total ?? 0).toLocaleString()}
            </div>
          </h2>
          <span className="text-[12px] p-2 rounded-md font-semibold mb-2 w-fit  text-black flex items-center">
            Available To Withdraw:
            <Image
              src={Logo}
              alt="Logo"
              width={14}
              height={14}
              className="ml-2 mr-1"
            />
            {Number(
              balances?.ReStakeWallet?.max_allowed_to_withdraw ?? 0,
            ).toLocaleString()}
          </span>
          <div className="flex flex-col md:flex-row gap-6 pb-6">
            {/* Image */}
            <div className="md:w-1/3 flex items-center text-center">
              <Image
                src={FiatWalletImg}
                alt="Fiat Wallet"
                className="rounded-md h-[300px] w-full object-fill"
              />
            </div>

            {/* Form */}
            <div className="w-full md:w-1/3 rounded-lg flex flex-col justify-center items-center">
              <h2 className="text-xl flex items-center gap-1 font-semibold mb-4">
                <Image
                  src={Logo}
                  alt="Logo"
                  className="rounded-md h-[25px] w-[25px] object-fill"
                />
                Transfer Restake Wallet
              </h2>

              <TextField
                label="Amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                fullWidth
                margin="normal"
                required
              />

              <Button
                type="button"
                variant="contained"
                style={{ background: 'green' }}
                onClick={handleStartRestake}
                disabled={otpLoading}
                fullWidth
                sx={{ mt: 2 }}
              >
                {otpLoading ? 'Sending OTP...' : 'Process Request'}
              </Button>
            </div>

            {/* Info Section */}
            <div className="w-full md:w-1/3 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">
                About Restake Wallet Transfer
              </h3>
              <div className="space-y-4 text-sm text-gray-700">
                {[
                  'Make Sure the email id of transferee is correct and right, we are not responsible for wrong Transfer',
                  'Transfer is only happened to your Downline, no Cross line',
                  'Restake Wallet can be transfered either your KAIT Wallet or Others Restake Wallet',
                  'Minimum of 500 KAIT to be transferable...',
                  'Deduction of 10% apply out of which 2% for Admin Charges and 8% for Adhoc Leadership Income',
                ].map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="font-semibold bg-blue-300 text-white px-2 py-0.5">
                      {idx + 1}
                    </span>
                    <span className=" text-[12px]">{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* OTP Modal */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Confirm Restake</DialogTitle>
          <DialogContent>
            <TextField
              label="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Transaction Pin"
              type="password"
              value={transactionPin}
              onChange={(e) => setTransactionPin(e.target.value)}
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
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Restake Now'}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  )
}

export default RestakeWalletTransfer

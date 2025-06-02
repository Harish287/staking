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
import { transferWalletOtp } from '@/store/slices/user/TransferWalletOtpSlice'
import { fetchTransferPinStatus } from '@/store/slices/user/transferPinStatusSlice'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

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

  const [amount, setAmount] = useState<number>(0)
  const [otp, setOtp] = useState('')
  const [transactionPin, setTransactionPin] = useState('')
  const [openDialog, setOpenDialog] = useState(false)

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''

  const handleStartRestake = async () => {
    if (!amount || amount <= 500) {
      toast.error('Amount Should be Greater then 500')
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
    if (!token) {
      toast.error('Authentication token missing')
      return
    }

    dispatch(
      initiateRestake({ otp, transaction_pin: transactionPin, amount, token }),
    )
    setOpenDialog(false)
  }

  useEffect(() => {
    if (error) {
      if (typeof error === 'string' && error.trim()) {
        toast.error(error)
      }
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

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-4">Restake</h2>

      <input
        type="number"
        placeholder="Enter Amount"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="mb-4 p-2 border w-full"
      />

      <button
        onClick={handleStartRestake}
        disabled={otpLoading}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        {otpLoading ? 'Sending OTP...' : 'Process Request'}
      </button>

      {/* OTP & PIN Modal */}
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
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Restake Now'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default RestakeWalletTransfer

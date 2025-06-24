'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchRosWalletBalance } from '@/store/slices/user/walletWithdrawal/rosWallet'
import {
  withdrawRos,
  resetWithdrawState,
} from '@/store/slices/user/walletWithdrawal/rosWithdrawForm'
import {
  transferWalletOtp,
  resetOtpState,
} from '@/store/slices/user/TransferWalletOtpSlice'
import { fetchRosWithdrawSummary } from '@/store/slices/user/walletWithdrawal/rosWithdrawSummary'
import toast from 'react-hot-toast'
import Logo from '../../../../assets/logo2x.png'
import Image from 'next/image'
import { fetchEligibleBeneficiaries } from '@/store/slices/user/beneficiaryeligible'
import type { BeneficiaryEligible } from '@/store/slices/user/beneficiaryeligible'

export default function RosWalletSummary() {
  const dispatch = useAppDispatch()

  const rosState = useAppSelector((state) => state.Roswithdraw)
  const withdrawState = useAppSelector((state) => state.RoswithdrawForm)
  const { success: otpSuccess, error: otpError } = useAppSelector(
    (state) => state.TranferwalletOpt,
  )
  const {
    items,
    loading: summaryLoading,
    error: summaryError,
  } = useAppSelector((state) => state.RosWalletSummary)

  const { beneficiaries } = useAppSelector((state) => state.BeneficiaryEligible)

  const [formData, setFormData] = useState({
    amount: 0,
    beneficiary_id: '',
    otp: '',
    transaction_pin: '',
  })
  const [selectedBeneficiary, setSelectedBeneficiary] =
    useState<BeneficiaryEligible | null>(null)
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<'loading' | 'loaded'>('loading')
  const [sendingOtp, setSendingOtp] = useState(false)

  const fetchSummary = () =>
    dispatch(
      fetchRosWithdrawSummary({
        review_status: 'any',
        page: 1,
        page_size: 10,
      }),
    )

  useEffect(() => {
    dispatch(fetchRosWalletBalance())
    fetchSummary().finally(() => setStatus('loaded'))
    dispatch(fetchEligibleBeneficiaries())
  }, [dispatch])

  useEffect(() => {
    if (otpSuccess) {
      toast.success('OTP sent successfully')
      setOpen(true)
      dispatch(resetOtpState())
    }
    if (otpError) {
      toast.error(otpError)
      dispatch(resetOtpState())
    }
  }, [otpSuccess, otpError, dispatch])

  useEffect(() => {
    if (withdrawState.success) {
      toast.success('Withdrawal successful')
      setOpen(false)
      setFormData({
        amount: 0,
        beneficiary_id: '',
        otp: '',
        transaction_pin: '',
      })
      setSelectedBeneficiary(null)
      dispatch(fetchRosWalletBalance())
      fetchSummary()
      setTimeout(() => dispatch(resetWithdrawState()), 3000)
    }
    if (withdrawState.error) {
      toast.error(withdrawState.error)
      dispatch(resetWithdrawState())
    }
  }, [withdrawState.success, withdrawState.error, dispatch])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amount' ? Number(value) : value,
    }))
  }

  const validateWithdrawForm = () => {
    if (formData.amount < 501) {
      toast.error('Amount should be greater than 500')
      return false
    }
    if (!formData.beneficiary_id.trim()) {
      toast.error('Beneficiary is required')
      return false
    }
    return true
  }

  const handleSendOtp = () => {
    if (!validateWithdrawForm()) return
    setSendingOtp(true)
    dispatch(transferWalletOtp()).finally(() => setSendingOtp(false))
  }

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.otp.trim()) {
      toast.error('OTP is required')
      return
    }
    if (!formData.transaction_pin.trim()) {
      toast.error('Transaction PIN is required')
      return
    }
    dispatch(withdrawRos(formData))
  }

  const {
    total,
    max_allowed_to_withdraw,
    eligible,
    remaining_days,
    last_request_date,
  } = rosState.Ros || {}

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-pink-700 border-b-gray-800 border-l-transparent border-r-transparent"></div>
      </div>
    )
  }

  return (
    <div className="bg-[#F3EAD8] hover:bg-blue-50 transition-colors duration-2000">
      <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-6 pt-5 max-w-5xl m-auto py-10">
        <Box className="space-y-8 max-w-2xl">
          <Box className="p-4 shadow rounded bg-white">
            <div className="flex justify-between mb-5">
              <Typography variant="h6" className="font-extrabold text-2xl">
                Ros Wallet (Limit of 40,000)
              </Typography>
              <Button
                className="bg-gradient-to-r from-pink-700 to-gray-800  hover:shadow-xl"
                href="/user/beneficiary"
                style={{ color: 'white' }}
              >
                Add Beneficiary
              </Button>
            </div>

            <div className="bg-gradient-to-r from-pink-700 to-gray-800 rounded-2xl flex">
              <div className="flex justify-center items-center p-6 pr-0">
                <Image src={Logo} alt="Logo" priority width={50} height={50} />
              </div>
              <div className="p-5 text-white">
                <div className="flex gap-1">
                  <Typography>Total</Typography>
                  <span className="text-xl">|</span>
                  <Typography>Max Withdrawable</Typography>
                </div>

                <div className="flex gap-1 text-2xl">
                  <Typography
                    className="flex gap-2 items-center"
                    style={{ fontSize: '20px' }}
                  >
                    <Image
                      src={Logo}
                      alt="Logo"
                      priority
                      width={20}
                      height={20}
                    />
                    {total ?? 0}
                  </Typography>
                  <span className="text-2xl">|</span>
                  <Typography
                    className="flex gap-2 items-center"
                    style={{ fontSize: '20px' }}
                  >
                    <Image
                      src={Logo}
                      alt="Logo"
                      priority
                      width={20}
                      height={20}
                    />
                    {max_allowed_to_withdraw ?? 0}
                  </Typography>
                </div>

                <Typography
                  className="flex items-center text-black p-2 gap-2 bg-white rounded-xl w-fit"
                  style={{ fontSize: '16px' }}
                >
                  Balance:
                  <Image
                    src={Logo}
                    alt="Logo"
                    priority
                    width={20}
                    height={20}
                  />
                  {total ?? 0}
                </Typography>

                <div className="flex gap-2 mt-5">
                  <Typography
                    className="bg-white text-black p-2 rounded-xl"
                    style={{ fontSize: '11px' }}
                  >
                    Eligibility: {eligible ? 'Yes' : 'No'}
                  </Typography>
                  <Typography
                    className="bg-white p-2 text-black rounded-xl"
                    style={{ fontSize: '11px' }}
                  >
                    Remaining Days: {remaining_days ?? 'N/A'}
                  </Typography>
                  <Typography
                    className="bg-white p-2 text-black rounded-xl"
                    style={{ fontSize: '11px' }}
                  >
                    Last Request Date: {last_request_date ?? 'N/A'}
                  </Typography>
                </div>
              </div>
            </div>

            <Box
              component="form"
              className="p-4 flex flex-col gap-6 border rounded mt-6 bg-white space-y-4"
            >
              <Typography variant="h6" className="text-pink-800">
                Withdraw ROS
              </Typography>

              <TextField
                fullWidth
                name="amount"
                label="Amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
              />

              <Autocomplete
                value={selectedBeneficiary}
                options={beneficiaries}
                getOptionLabel={(option) => option.nick_name}
                onChange={(_, value) => {
                  setSelectedBeneficiary(value)
                  setFormData((prev) => ({
                    ...prev,
                    beneficiary_id: value?.beneficiary_id || '',
                  }))
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Select Beneficiary" fullWidth />
                )}
              />
              {beneficiaries.length === 0 && (
                <Typography variant="body2" color="error">
                  No eligible beneficiaries found. Please add one first.
                </Typography>
              )}

              <Button
                variant="contained"
                className="bg-gradient-to-r from-pink-700 to-gray-800"
                onClick={handleSendOtp}
                fullWidth
                disabled={sendingOtp}
              >
                {sendingOtp ? 'Sending OTP...' : 'Process Your Request'}
              </Button>
            </Box>
          </Box>

          <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>Confirm Withdrawal</DialogTitle>
            <Box component="form" onSubmit={handleWithdrawSubmit}>
              <DialogContent dividers>
                <TextField
                  fullWidth
                  name="otp"
                  label="OTP"
                  value={formData.otp}
                  onChange={handleChange}
                  margin="dense"
                  required
                />
                <TextField
                  fullWidth
                  name="transaction_pin"
                  label="Transaction PIN"
                  type="password"
                  value={formData.transaction_pin}
                  onChange={handleChange}
                  margin="dense"
                  required
                />
                {withdrawState.error && (
                  <Typography color="error" variant="body2" mt={1}>
                    {withdrawState.error}
                  </Typography>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpen(false)}>Cancel</Button>
                <Button
                  type="submit"
                  variant="contained"
                  className="bg-gradient-to-r from-pink-700 to-gray-800"
                  disabled={withdrawState.loading}
                >
                  {withdrawState.loading ? 'Withdrawing...' : 'Confirm'}
                </Button>
              </DialogActions>
            </Box>
          </Dialog>
        </Box>

        <Box className="space-y-4 bg-white p-6">
          <Typography variant="h6" className="text-2xl font-extrabold">
            ROS Withdrawal Summary
          </Typography>

          {summaryLoading && <Typography>Loading summary...</Typography>}

          {summaryError && (
            <Typography className="text-red-500">{summaryError}</Typography>
          )}

          {!summaryLoading && !summaryError && items.length === 0 && (
            <Typography>No transactions found.</Typography>
          )}

          {!summaryLoading && items.length > 0 && (
            <TableContainer component={Paper} className="shadow">
              <Table size="small" aria-label="ROS Withdrawal Table">
                <TableHead>
                  <TableRow className="bg-pink-100">
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>
                      <div className=" flex items-center">
                        <span>Amount</span>
                        <Image
                          src={Logo}
                          alt="Logo"
                          priority
                          width={15}
                          height={15}
                          className=" ml-0.5"
                        />
                      </div>
                    </TableCell>
                    <TableCell>Beneficiary</TableCell>
                    <TableCell>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        {new Date(item.date_time).toLocaleString()}
                      </TableCell>
                      <TableCell>{item.status}</TableCell>
                      <TableCell>
                        <div className=' flex items-center'>
                          <span>{item.amount}</span>
                          <Image
                            src={Logo}
                            alt="Logo"
                            priority
                            width={15}
                            height={15}
                            className=" ml-0.5"
                          />
                        </div>
                      </TableCell>
                      <TableCell>{item.beneficiary_nick_name}</TableCell>
                      <TableCell>{item.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </div>
    </div>
  )
}

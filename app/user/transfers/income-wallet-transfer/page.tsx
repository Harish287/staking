// 'use client'

// import React, { useEffect, useState } from 'react'
// import { useAppDispatch, useAppSelector } from '@/store/hooks'
// import {
//   initiateIncomeTransfer,
//   resetTransferState,
// } from '@/store/slices/user/incomeTransferSlice'
// import {
//   transferWalletOtp,
//   resetOtpState,
// } from '@/store/slices/user/TransferWalletOtpSlice'
// import { fetchEligibleUsers } from '@/store/slices/user/eligibleUserTransferSlice'
// import { fetchTransferPinStatus } from '@/store/slices/user/transferPinStatusSlice'

// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Autocomplete,
// } from '@mui/material'

// import Image from 'next/image'
// import { ArrowRightLeft } from 'lucide-react'
// import { unwrapResult } from '@reduxjs/toolkit'
// import { useRouter } from 'next/navigation'
// import toast from 'react-hot-toast'
// import Logo from '../../../../assets/logo2x.png'
// import FiatWalletImg from '../../../../assets/fiatwallet.jpg'

// const IncomeTransferForm = () => {
//   const dispatch = useAppDispatch()
//   const router = useRouter()

//   const {
//     loading: transferLoading,
//     success: transferSuccess,
//     error: transferError,
//     message: transferMessage,
//   } = useAppSelector((state) => state.incometransfer)

//   const {
//     loading: otpLoading,
//     success: otpSuccess,
//     error: otpError,
//   } = useAppSelector((state) => state.TranferwalletOpt)

//   const { users: eligibleUsers } = useAppSelector(
//     (state) => state.eligibleUsersTransfer,
//   )

//   const walletBalance =
//     useAppSelector((state) => state.auth.user?.income_wallet) || 0

//   const [openDialog, setOpenDialog] = useState(false)
//   const [selectedUser, setSelectedUser] = useState<any>(null)

//   const [form, setForm] = useState({
//     receiver_user_id: '',
//     receiver_user_email: '',
//     amount: '',
//     otp: '',
//     transaction_pin: '',
//   })

//   const token =
//     typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value })
//   }

//   const handleStartTransfer = async () => {
//     if (!form.receiver_user_id || !form.amount) {
//       toast.error('Please fill out recipient and amount')
//       return
//     }

//     const amountNumber = parseFloat(form.amount)
//     if (isNaN(amountNumber) || amountNumber <= 500) {
//       toast.error('Amount should be greater than 500')
//       return
//     }

//     if (!token) {
//       toast.error('Authentication token missing')
//       return
//     }

//     try {
//       const actionResult = await dispatch(fetchTransferPinStatus(token))
//       const pinStatus = unwrapResult(actionResult)

//       if (!pinStatus) {
//         toast.error('Set your transaction password before transferring.')
//         router.push('/user/profile?tab=TRANS.PWD')
//         return
//       }

//       await dispatch(transferWalletOtp())
//       setOpenDialog(true)
//     } catch {
//       toast.error('Error checking transfer pin status.')
//     }
//   }

//   const handleSubmit = (e: React.FormEvent | React.MouseEvent) => {
//     e.preventDefault()

//     if (!token) {
//       toast.error('Auth token missing')
//       return
//     }

//     dispatch(
//       initiateIncomeTransfer({
//         ...form,
//         amount: parseFloat(form.amount),
//         token,
//       }),
//     )
//     setOpenDialog(false)
//   }

//   useEffect(() => {
//     if (token) {
//       dispatch(fetchEligibleUsers(token))
//     }
//   }, [token, dispatch])

//   useEffect(() => {
//     if (transferSuccess) {
//       toast.success(transferMessage || 'Transfer completed successfully')
//       dispatch(resetTransferState())
//       setForm({
//         receiver_user_id: '',
//         receiver_user_email: '',
//         amount: '',
//         otp: '',
//         transaction_pin: '',
//       })
//       setSelectedUser(null)
//     }

//     if (transferError) {
//       const errorMessage =
//         typeof transferError === 'string'
//           ? transferError
//           : transferError?.detail || 'An error occurred during transfer.'

//       toast.error(errorMessage)
//       dispatch(resetTransferState())
//     }
//   }, [transferSuccess, transferError, transferMessage, dispatch])

//   useEffect(() => {
//     if (otpSuccess) {
//       toast.success('OTP sent successfully')
//       dispatch(resetOtpState())
//     }
//     if (otpError) {
//       toast.error(otpError)
//       dispatch(resetOtpState())
//     }
//   }, [otpSuccess, otpError, dispatch])

//   if (otpLoading || transferLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-pink-700 border-b-gray-800 border-l-transparent border-r-transparent"></div>
//       </div>
//     )
//   }

//   return (
//     <div className="pt-5 bg-[#F3EAD8] hover:bg-blue-50 pb-10 transition-colors duration-2000 mx-auto px-4 sm:px-6 lg:px-8">
//       <div className="container m-auto">
//         <h1 className="flex items-center text-2xl font-bold mb-6 mt-5">
//           <ArrowRightLeft className="mr-2" /> Transfer Income Wallet
//         </h1>
//         <div className="bg-white rounded-lg shadow-lg p-4">
//           <h2 className="text-lg p-2 rounded-[10px] flex  w-fit font-semibold mb-2  bg-gradient-to-r from-blue-500 to-purple-700 text-white">
//             Income Wallet Balance:
//             <div className=" flex items-center ml-0.5">
//               <Image
//                 src={Logo}
//                 alt="Logo"
//                 priority
//                 width={15}
//                 height={15}
//                 className=" mr-0.5"
//               />
//               <span>{walletBalance}</span>
//             </div>
//           </h2>
//           <div className="flex flex-col md:flex-row gap-6">
//             {/* Wallet Summary */}
//             <div className="md:w-1/3">
//               <Image
//                 src={FiatWalletImg}
//                 alt="Fiat Wallet"
//                 className="rounded-md h-[300px] w-full object-fill"
//               />
//             </div>

//             {/* Transfer Form */}
//             <form onSubmit={handleSubmit} className="w-full md:w-1/3">
//               <h2 className="text-xl flex items-center gap-2 font-semibold mb-4">
//                 <Image
//                   src={Logo}
//                   alt="Logo"
//                   className="h-[25px] w-[25px] object-fill rounded-md"
//                 />{' '}
//                 Transfer Income Wallet
//               </h2>

//               <Autocomplete
//                 value={selectedUser}
//                 onChange={(event, value) => {
//                   setSelectedUser(value)
//                   setForm({
//                     ...form,
//                     receiver_user_id: value?.id || '',
//                     receiver_user_email: value?.email || '',
//                   })
//                 }}
//                 options={eligibleUsers}
//                 getOptionLabel={(option) => option.email}
//                 isOptionEqualToValue={(option, value) =>
//                   option.id === value?.id
//                 }
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     label="Recipient Email"
//                     required
//                     fullWidth
//                   />
//                 )}
//               />

//               <TextField
//                 label="Amount"
//                 name="amount"
//                 type="number"
//                 value={form.amount}
//                 onChange={handleChange}
//                 fullWidth
//                 margin="normal"
//                 required
//               />

//               <Button
//                 type="button"
//                 variant="contained"
//                 sx={{ background: 'green', mt: 2 }}
//                 onClick={handleStartTransfer}
//                 disabled={otpLoading}
//                 fullWidth
//               >
//                 {otpLoading ? 'Sending OTP...' : 'Process Request'}
//               </Button>

//               {/* OTP Modal */}
//               <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
//                 <DialogTitle>Confirm Transfer</DialogTitle>
//                 <DialogContent>
//                   <TextField
//                     label="OTP"
//                     name="otp"
//                     value={form.otp}
//                     onChange={handleChange}
//                     fullWidth
//                     margin="normal"
//                     required
//                   />
//                   <TextField
//                     label="Transaction Pin"
//                     name="transaction_pin"
//                     type="password"
//                     value={form.transaction_pin}
//                     onChange={handleChange}
//                     fullWidth
//                     margin="normal"
//                     required
//                   />
//                 </DialogContent>
//                 <DialogActions>
//                   <Button onClick={() => setOpenDialog(false)} color="inherit">
//                     Cancel
//                   </Button>
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     onClick={handleSubmit}
//                     disabled={transferLoading}
//                   >
//                     {transferLoading ? 'Processing...' : 'Process the Transfer'}
//                   </Button>
//                 </DialogActions>
//               </Dialog>
//             </form>

//             {/* Transfer Rules */}
//             <div className="w-full md:w-1/3 p-6 rounded-lg">
//               <h3 className="text-xl font-semibold mb-4">
//                 About Income Wallet Transfer
//               </h3>
//               <div className="space-y-4 text-sm text-gray-700">
//                 {[
//                   'Ensure receiver’s email is correct; we are not liable for incorrect transfers.',
//                   'Only downline transfers are allowed — no cross-line transfers.',
//                   '1st level recipients allowed by default.',
//                   '2nd level allowed if you have 2 paid directs.',
//                   '3rd level allowed if you have 3 paid directs.',
//                   '4th level+ allowed only if you are Bronze.',
//                   'Income Wallet can be transferred to your KAIT wallet or others’ income wallet.',
//                   '10% deduction applies (2% admin + 8% leadership).',
//                 ].map((rule, idx) => (
//                   <div key={idx} className="flex items-start gap-2">
//                     <span className="font-semibold bg-blue-300 text-white px-2 py-0.5">
//                       {idx + 1}
//                     </span>
//                     <span className="text-[12px]">{rule}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default IncomeTransferForm
'use client'

import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  initiateTransferIncomeToSuper,
  resetTransferState,
} from '@/store/slices/user/incomeToSuperTransferSlice'
import {
  transferWalletOtp,
  resetOtpState,
} from '@/store/slices/user/TransferWalletOtpSlice'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material'

import Image from 'next/image'
import { ArrowRightLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import Logo from '@/assets/logo2x.png'
import FiatWalletImg from '@/assets/fiatwallet.jpg'
import { useRouter } from 'next/navigation'
import { fetchTransferPinStatus } from '@/store/slices/user/transferPinStatusSlice'
import { unwrapResult } from '@reduxjs/toolkit'

const IncomeToSuperTransferForm = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const {
    loading: transferLoading,
    success,
    error,
  } = useAppSelector((state) => state.IncomeToSuperTranfer)
  const {
    loading: otpLoading,
    success: otpSuccess,
    error: otpError,
  } = useAppSelector((state) => state.TranferwalletOpt)

  const { data: userData, loading: userLoading } = useAppSelector(
    (state) => state.UserTree,
  )
  const walletBalance =
    useAppSelector((state) => userData?.fiat_wallet || '0') || 0
    // income wallet data pending

  const [openDialog, setOpenDialog] = useState(false)
  const [form, setForm] = useState({
    amount: '',
    otp: '',
    transaction_pin: '',
  })

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleRequestOtp = async () => {
    const amountNumber = parseFloat(form.amount)
    if (isNaN(amountNumber) || amountNumber <= 500) {
      toast.error('Amount must be greater than ₹500')
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

      await dispatch(transferWalletOtp()).unwrap()
      toast.success('OTP sent successfully')
      setOpenDialog(true)
    } catch (err) {
      toast.error('Failed to check PIN status or send OTP')
    }
  }

  const handleSubmit = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault()
    dispatch(
      initiateTransferIncomeToSuper({
        otp: form.otp,
        transaction_pin: form.transaction_pin,
        amount: parseFloat(form.amount),
      }),
    )
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setForm({ ...form, otp: '', transaction_pin: '' })
  }

  useEffect(() => {
    if (success) {
      toast.success('Transfer successful')
      dispatch(resetTransferState())
      dispatch(resetOtpState())
      handleCloseDialog()
      setForm({ amount: '', otp: '', transaction_pin: '' })
    }

    if (error) {
      toast.error(typeof error === 'string' ? error : 'Transfer failed')
      dispatch(resetTransferState())
    }

    if (otpError) {
      toast.error(typeof otpError === 'string' ? otpError : 'OTP Error')
      dispatch(resetOtpState())
    }
  }, [success, error, otpError, dispatch])

  return (
    <div className="pt-5 bg-[#F3EAD8] pb-10 mx-auto px-4 sm:px-6 lg:px-8">
      <div className="container m-auto">
        <h1 className="flex items-center text-2xl font-bold mb-6 mt-5">
          <ArrowRightLeft className="mr-2" /> Transfer Income Wallet
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-lg p-2 rounded-md font-semibold mb-2 w-fit bg-gradient-to-r from-blue-500 to-purple-700 text-white flex items-center">
            Income Wallet Balance:
            <Image
              src={Logo}
              alt="Logo"
              width={20}
              height={20}
              className="ml-2 mr-1"
            />
            {walletBalance}
          </h2>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Wallet Image */}
            <div className="md:w-1/3">
              <Image
                src={FiatWalletImg}
                alt="Wallet Preview"
                className="rounded-md h-[300px] w-full object-fill"
              />
            </div>

            {/* Transfer Form */}
            <form onSubmit={handleSubmit} className="w-full md:w-1/3 space-y-4">
              <h2 className="text-xl flex items-center gap-2 font-semibold mb-4">
                <Image
                  src={Logo}
                  alt="Logo"
                  className="h-[25px] w-[25px] object-fill rounded-md"
                />
                Transfer Income Wallet
              </h2>

              <div className=" mt-5">
                <TextField
                  style={{ marginTop: '20px' }}
                  label="Mode of Transfer"
                  value="Super Wallet"
                  fullWidth
                  disabled
                />
                <TextField
                  style={{ marginTop: '20px' }}
                  label="Amount"
                  name="amount"
                  type="number"
                  value={form.amount}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </div>

              <Button
                type="button"
                variant="contained"
                color="success"
                onClick={handleRequestOtp}
                disabled={otpLoading}
                fullWidth
              >
                {otpLoading ? 'Sending OTP...' : 'Proceed to Transfer'}
              </Button>

              {/* OTP Modal */}
              <Dialog open={openDialog} onClose={handleCloseDialog}>
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
                  <Button onClick={handleCloseDialog} color="inherit">
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={transferLoading}
                  >
                    {transferLoading ? 'Processing...' : 'Confirm Transfer'}
                  </Button>
                </DialogActions>
              </Dialog>
            </form>

            {/* Transfer Rules */}
            <div className="w-full md:w-1/3 p-4 text-sm text-gray-700 space-y-2">
              <h3 className="text-xl font-semibold mb-2">Important Info</h3>
              <div className="space-y-2 text-[13px]">
                {[
                  'Income Wallet can be transferred to your Super Wallet.',
                  'Maintain a minimum of ₹250 in your Income Wallet, above which can be transferred.',
                  'OTP and transaction PIN are required.',
                  'Deduction of 10% applies: 2% Admin Charges, 8% Adhoc Leadership Income.',
                  'You can only transfer to your own Super Wallet.',
                ].map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="font-semibold bg-blue-300 text-white px-2 py-0.5">
                      {idx + 1}
                    </span>
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

export default IncomeToSuperTransferForm

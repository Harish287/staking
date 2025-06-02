import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/index'
import tokenAuthReducer from './slices/tokenAuth'
import profileReducer from './slices/profileSlice'
import nomineeReducer from './slices/nomineeslice'
import Kyc from './slices/kycList'
import bankReducer from './slices/user/bankSlice'
import investorReducer from './slices/admin/investorSlice'
import updateUserPermission from './slices/admin/permisionSlice'
import stakingReducer from './slices/user/stakeSlice'
import changePasswordReducer from './slices/user/changePasswordSlice'
import stakePlansReducer from './slices/admin/stakePlansSlice'
import resetPasswordSlice from './slices/admin/passwordReset'
import kycSlice from './slices/admin/kycDetails'
import KycListSlice from './slices/admin/kyclist'
import transactionpassReducer from './slices/user/transactionPassSlice'
import transactionOtpReducer from './slices/user/transactionPassSlice'
import incomeTransferReducer from './slices/user/incomeTransferSlice'
import transferWalletOtpReducer from './slices/user/TransferWalletOtpSlice'
import transferPinStatusReducer from './slices/user/transferPinStatusSlice'
import eligibleUsersTransferReducer from './slices/user/eligibleUserTransferSlice'
import restakeWalletReducer from './slices/user/restakeTransferSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tokenAuth: tokenAuthReducer,
    profile: profileReducer,
    nominee: nomineeReducer,
    kyc: Kyc,
    kyclist: KycListSlice,
    fetchKycData: kycSlice,
    BankAccount: bankReducer,
    investor: investorReducer,
    updateUserPermission: updateUserPermission,
    stakingPlans: stakingReducer,
    changePassword: changePasswordReducer,
    stakePlans: stakePlansReducer,
    resetpassword: resetPasswordSlice,
    transactionPin: transactionpassReducer,
    transactionOtp: transactionOtpReducer,
    incometransfer: incomeTransferReducer,
    restaketransfer: restakeWalletReducer,
    TranferwalletOpt: transferWalletOtpReducer,
    transferPinStatus: transferPinStatusReducer,
    eligibleUsersTransfer: eligibleUsersTransferReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/index'
import tokenAuthReducer from './slices/tokenAuth'
import profileReducer from './slices/profileSlice'
import nomineeReducer from './slices/nomineeslice'
import Kyc from './slices/kycList'
import bankReducer from './slices/user/bankSlice'
import investorReducer from './slices/admin/investorSlice'
import updateUserPermission from './slices/admin/permisionSlice'
export const store = configureStore({
  reducer: {
    auth: authReducer,
    tokenAuth: tokenAuthReducer,
    profile: profileReducer,
    nominee: nomineeReducer,
    kyc: Kyc,
    BankAccount: bankReducer,
    investor: investorReducer,
    updateUserPermission: updateUserPermission,
  },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

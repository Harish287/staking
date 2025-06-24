import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

export const fetchUserData = createAsyncThunk(
  'user/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${baseURL}user/data`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      return res.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Error fetching user data')
    }
  }
)

export interface TeamMember {
  name: string | null
  user_name: string | null
  email: string | null
  club: string | null
  level: number
  total_staking: number
  team_staking: number
  children: TeamMember[]
}

export interface Nominee {
  name: string
  pan: string
  relationship: string
}

export interface Bank {
  bank_name: string
  account_type: 'savings' | 'current'
  account_no: string
  ifsc_code: string
}

export interface UserData {
  user_id: string
  user_role: string
  full_name: string
  user_name: string
  email: string
  mobile: string
  wallet: string
  dob: string
  nominee: Nominee
  nationality: string
  bank: Bank
  joining_date: string
  sponsor: string
  total_members: number
  withdraw: boolean
  withdraw_staking: boolean
  adhoc_income: boolean
  adhoc_transfer: boolean
  suspend: boolean
  transfer: boolean
  level_income: boolean
  credit: boolean
  invested: number
  team_business: number
  kiat_wallet: number
  fiat_wallet: number
  restake_wallet: number
  ros_wallet: number
  adhoc_wallet: number
  vpay_voucher: number
  ecommerce_voucher: number
  verified: Record<string, any> 
  next_progress: Record<string, any> 
  team_tree: TeamMember[]
}

interface UserState {
  data: UserData | null
  loading: boolean
  error: string | null
}

const initialState: UserState = {
  data: null,
  loading: false,
  error: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default userSlice.reducer

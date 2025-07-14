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
  name: string | null
  pan: string | null
  relationship: string | null
}

export interface Bank {
  bank_name: string | null
  account_type: 'savings' | 'current' | null
  account_no: string | null
  ifsc_code: string | null
}

export interface ProgressRequirement {
  title: string
  current: number | string
  required: number
  status: boolean
  remaining: number | string
}

export interface NextProgress {
  next_club: string
  progress: ProgressRequirement[]
}

export interface Level {
  level: number
  total_users: number
  total_volume: string
}

export interface LevelInfo {
  total_levels: number
  levels: Level[]
}

export interface IncomeEligibility {
  user_max_income_limit: number
  total_income: number | string
  available_space: number | string
}

export interface Verified {
  email: boolean
  kyc: boolean
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
  // level_income: boolean
  credit: boolean
  invested: number
  team_business: number
  kiat_wallet: number
  fiat_wallet: number
  restake_wallet: number
  income_wallet: number
  level_income:Number
  ros_wallet: number
  adhoc_wallet: number
  roi: number
  roc: number
  vpay_voucher: number
  ecommerce_voucher: number
  total_withdraw: number
  verified: Verified
  next_progress: NextProgress
  level_info: LevelInfo
  club_counts: Record<string, number>
  income_eligibility: IncomeEligibility
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

// ---------- Slice ----------

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

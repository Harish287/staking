import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { serverHooks } from 'next/dist/server/app-render/entry-base'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

export interface TeamMember {
  id: string
  user_id: string
  name: string | null
  user_name: string | null
  email: string | null
  club: string | null
  level: number
  total_staking: number
  team_staking: number
  children: TeamMember[]
}

interface Level {
  total_users: any
  level: number
  total_staking: number
  user_count: number
  total_volume: number
}

interface LevelInfo {
  levels: Level[]
}

interface Verified {
  email: boolean
  kyc: boolean
}

interface ClubCounts {
  Basic: number
  Bronze: number
  Silver: number
  Gold: number
  Platinum: number
  Diamond: number
  DoubleDiamond: number
  TripleDiamond: number
  KaitKing: number
}

interface Wallets {
  kiat_wallet: number
  fiat_wallet: number
  restake_wallet: number
  income_wallet: number
  super_wallet: number
  roi: number
  roc: number
  adhoc_wallet: number
  vpay_voucher: number
  ecommerce_voucher: number
  total_withdraw: number
}

interface IncomeEligibility {
  user_max_income_limit: number
  total_income: string
  available_space: string
}

interface ProgressItem {
  title: string
  current: number
  required: number
  status: boolean
  remaining: number
}

interface NextProgress {
  next_club: string
  progress: ProgressItem[]
}

export interface UserData {
  id: string
  name: string
  email: string
  user_name: string
  total_users:number
  verified: Verified
  wallet: string
  club: string
  total_staking: number
  team_staking: number
  referral_code: string
  joining_date: string
  sponsor: string
  sponsor_name: string
  sponsor_username: string
  withdraw:string
  sponsor_email: string
  level_info: LevelInfo
  team_tree: TeamMember[]
  club_counts?: ClubCounts
  wallets?: Wallets
  income_eligibility?: IncomeEligibility
  next_progress?: NextProgress
}

export const fetchUserData = createAsyncThunk<
  UserData,
  string | undefined,
  { rejectValue: string }
>('user/fetchData', async (user_id, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${baseURL}user/data`, {
      params: user_id ? { user_id } : {},
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })

    const response = res.data

    const normalizeTeamTree = (members: any[]): TeamMember[] => {
      return members.map((member) => ({
        id: member.id,
        user_id: member.id,
        name: member.name,
        user_name: member.user_name,
        email: member.email,
        club: member.club,
        level: member.level,
        total_staking: member.total_staking,
        team_staking: member.team_staking,
        children: member.children ? normalizeTeamTree(member.children) : [],
      }))
    }

    const normalizedData: UserData = {
      id: response.user_id,
      name: response.full_name,
      withdraw:response.withdraw,
      wallet: response.wallet,
      sponsor: response.sponsor,
      email: response.email,
      joining_date: response.joining_date,
      user_name: response.user_name,
      verified: {
        email: response.email_verified,
        kyc: response.kyc_verified,
      },
      club: response.club || 'Basic',
      total_staking: response.invested,
      total_users:response.total_users,
      team_staking: response.team_business,
      referral_code: response.user_id,
      sponsor_name: response.sponsor?.split('(')[0]?.trim() || '',
      sponsor_username: '',
      sponsor_email: response.sponsor?.match(/\(([^)]+)\)/)?.[1] || '',
      level_info: {
        levels:
          response.level_info?.levels?.map((lvl: any) => ({
            ...lvl,
            total_volume: lvl.total_staking,
            user_count: lvl.total_users,
          })) || [],
      },
      team_tree: normalizeTeamTree(response.team_tree || []),
      club_counts: {
        Basic: response.club_counts?.Basic || 0,
        Bronze: response.club_counts?.Bronze || 0,
        Silver: response.club_counts?.Silver || 0,
        Gold: response.club_counts?.Gold || 0,
        Platinum: response.club_counts?.Platinum || 0,
        Diamond: response.club_counts?.Diamond || 0,
        DoubleDiamond: response.club_counts?.['Double Diamond'] || 0,
        TripleDiamond: response.club_counts?.['Triple Diamond'] || 0,
        KaitKing: response.club_counts?.['Kait King'] || 0,
      },
      wallets: {
        kiat_wallet: response.kiat_wallet,
        fiat_wallet: response.fiat_wallet,
        restake_wallet: response.restake_wallet,
        income_wallet: response.income_wallet,
        super_wallet: response.super_wallet,
        roi: response.roi,
        roc: response.roc,
        adhoc_wallet: response.adhoc_wallet,
        vpay_voucher: response.vpay_voucher,
        ecommerce_voucher: response.ecommerce_voucher,
        total_withdraw: response.total_withdraw,
      },
      income_eligibility: response.income_eligibility,
      next_progress: response.next_progress,
    }

    return normalizedData
  } catch (err: any) {
    return rejectWithValue(err.response?.data || 'Error fetching user data')
  }
})

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
        state.error = action.payload || 'Something went wrong'
      })
  },
})

export default userSlice.reducer

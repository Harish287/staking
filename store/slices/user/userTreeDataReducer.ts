import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

export interface TeamMember {
  id:string
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

export interface UserData {
  id: string
  name: string
  email: string
  user_name: string
  verified: Verified
  club: string
  total_staking: number
  team_staking: number
  referral_code: string
  sponsor_name: string
  sponsor_username: string
  sponsor_email: string
  level_info: LevelInfo
  team_tree: TeamMember[]
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
      id: response.id,
      name: response.name,
      email: response.email,
      user_name: response.user_name,
      verified: {
        email: response.email_verified,
        kyc: response.kyc_verified,
      },
      club: response.club,
      total_staking: response.total_staking,
      team_staking: response.team_staking,
      referral_code: response.referral_code,
      sponsor_name: response.sponsor_name,
      sponsor_username: response.sponsor_username,
      sponsor_email: response.sponsor_email,
      level_info: {
        levels:
          response.level_info?.levels?.map((lvl: any) => ({
            ...lvl,
            total_volume: lvl.total_staking,
          })) || [],
      },
      team_tree: normalizeTeamTree(response.team_tree || []),
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

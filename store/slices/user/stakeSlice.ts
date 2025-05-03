import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import Cookies from 'js-cookie'


const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

interface StakingPlan {
  name: string
  frequency: number
  apy: number
  min_value: number
  bonus: number
  kait_wallet: number
  adhoc_wallet: number
}

interface StackingState {
  plans: StakingPlan[]
  loading: boolean
  error: string | null
}

const initialState: StackingState = {
  plans: [],
  loading: false,
  error: null,
}




export const fetchStakingPlans = createAsyncThunk<StakingPlan[], void, { rejectValue: string }>(
    'staking/fetchStakingPlans',
    async (_, { rejectWithValue }) => {
      try {
        const token = Cookies.get('token') || localStorage.getItem('token')
        if (!token) {
          return rejectWithValue('No token found')
        }
  
        const response = await axios.get(`${baseURL}stake/plans`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        })
  
        return response.data
      } catch (error: any) {
        if (error.response && error.response.data) {
          return rejectWithValue(error.response.data.message || 'Server Error')
        } else {
          return rejectWithValue(error.message || 'Network Error')
        }
      }
    }
  )

const stakingSlice = createSlice({
  name: 'staking',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStakingPlans.pending, (state) => {
        ;(state.loading = true), (state.error = null)
      })
      .addCase(fetchStakingPlans.fulfilled, (state, action) => {
        state.loading = false
        state.plans = action.payload
      })
      .addCase(fetchStakingPlans.rejected, (state, action) =>   {
        state.loading = false
        state.error = action.error.message || 'failed to fetch the plans'
      })
  },
})

export default stakingSlice.reducer

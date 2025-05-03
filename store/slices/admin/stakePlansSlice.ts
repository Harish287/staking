// store/slices/stakePlansSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

interface StakePlan {
  plan_id: string
  name: string
  frequency: number
  apy: number
  iroi: number
  level: number
  status: boolean
  contract_address: string
  total_liquidity: number
  major_pair: string
  amount: number
  bonus: number
  stake_wallet_share_percent: number
  created_at: string
  updated_at: string
}

interface StakePlansState {
  stakePlans: StakePlan[]
  loading: boolean
  error: string | null
}

const initialState: StakePlansState = {
  stakePlans: [],
  loading: false,
  error: null,
}

// Fetch Stake Plans thunk
export const fetchStakePlans = createAsyncThunk(
  'stakePlans/fetchStakePlans',
  async (_, { rejectWithValue }) => {
    try {
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('token') : null

      const response = await fetch(`${baseURL}stake/detailed_plans`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data.detail || 'Something went wrong')
      }

      return data
    } catch (error) {
      return rejectWithValue('Failed to fetch stake plans')
    }
  },
)

// Update Stake Plan thunk
export const updateStakePlan = createAsyncThunk(
  'stakePlans/updateStakePlan',
  async (
    payload: {
      plan_id: string
      name: string
      frequency: number
      apy: number
      iroi: number
      level: number
      status: boolean
      contract_address: string
      total_liquidity: number
      major_pair: string
      amount: number
      bonus: number
      stake_wallet_share_percent: number
    },
    { rejectWithValue },
  ) => {
    try {
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('token') : null

      const response = await fetch(`${baseURL}stake/plan`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          ...payload,
          total_liquidity: parseFloat(payload.total_liquidity.toFixed(2)), // Ensure total_liquidity remains a number
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data.detail || 'Failed to update stake plan')
      }

      return data
    } catch (error) {
      return rejectWithValue('Failed to update stake plan')
    }
  },
)

// Create Stake Plan thunk
export const createStakePlan = createAsyncThunk(
  'stakePlans/createStakePlan',
  async (
    payload: {
      name: string
      frequency: number
      apy: number
      iroi: number
      level: number
      contract_address: string
      total_liquidity: number
      major_pair: string
      amount: number
      bonus: number
      stake_wallet_share_percent: number
    },
    { rejectWithValue },
  ) => {
    try {
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('token') : null

      const response = await fetch(`${baseURL}stake/plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        // Correctly parse all number fields as decimals where needed
        body: JSON.stringify({
            ...payload,
            amount: Number(payload.amount), 
            total_liquidity: Number(payload.total_liquidity),
            apy: Number(payload.apy),
            iroi: Number(payload.iroi),
            bonus: Number(payload.bonus),
            stake_wallet_share_percent: Number(payload.stake_wallet_share_percent),
            frequency: Number(payload.frequency),
            level: Number(payload.level),
          })
          
      })

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data.detail || 'Failed to create stake plan')
      }

      return data
    } catch (error) {
      return rejectWithValue('Failed to create stake plan')
    }
  },
)

const stakePlansSlice = createSlice({
  name: 'stakePlans',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStakePlans.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchStakePlans.fulfilled, (state, action) => {
        state.loading = false
        state.stakePlans = action.payload
      })
      .addCase(fetchStakePlans.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(updateStakePlan.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateStakePlan.fulfilled, (state, action) => {
        state.loading = false
        const updatedPlan = action.payload
        const index = state.stakePlans.findIndex(
          (plan) => plan.plan_id === updatedPlan.plan_id,
        )
        if (index !== -1) {
          state.stakePlans[index] = updatedPlan
        }
      })
      .addCase(updateStakePlan.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(createStakePlan.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createStakePlan.fulfilled, (state, action) => {
        state.loading = false
        state.stakePlans.push(action.payload)
      })
      .addCase(createStakePlan.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default stakePlansSlice.reducer

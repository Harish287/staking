// store/slices/stakePlansSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

const getToken = () =>
  typeof window !== 'undefined' ? localStorage.getItem('token') : null

export interface StakePlan {
  plan_id: string
  name: string
  description: string
  min_amount: number
  lock_in_period: number
  return_on_staking: number
  ros_pay_out_frenquency: 'daily' | 'monthly' | 'quarterly' | string
  capital_pay_out_frequency: 'daily' | 'monthly' | 'quarterly' | string
  status: boolean
  contract_address: string
  total_liquidity: number
  major_pair: string
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

// Fetch Stake Plans
export const fetchStakePlans = createAsyncThunk<
  StakePlan[],
  void,
  { rejectValue: string }
>('stakePlans/fetchStakePlans', async (_, { rejectWithValue }) => {
  try {
    const token = getToken()
    const response = await fetch(`${baseURL}plan/detailed_list`, {
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

    return data as StakePlan[]
  } catch {
    return rejectWithValue('Failed to fetch stake plans')
  }
})

// Update Stake Plan
export const updateStakePlan = createAsyncThunk<
  StakePlan,
  {
    plan_id: string
    plan_name: string
    description: string
    min_amount: number
    lock_in_period: number
    return_on_staking: number
    ros_pay_out_frenquency: string
    capital_pay_out_frequency: string
    status: boolean
    contract_address: string
    total_liquidity: number
    major_pair: string
  },
  { rejectValue: string }
>('stakePlans/updateStakePlan', async (payload, { rejectWithValue }) => {
  try {
    const token = getToken()

    const formData = new URLSearchParams({
      plan_id: payload.plan_id,
      plan_name: payload.plan_name,
      description: payload.description,
      min_amount: payload.min_amount.toString(),
      lock_in_period: payload.lock_in_period.toString(),
      return_on_staking: payload.return_on_staking.toString(),
      ros_pay_out_frenquency: payload.ros_pay_out_frenquency,
      capital_pay_out_frequency: payload.capital_pay_out_frequency,
      plan_status: payload.status.toString(),
      contract_address: payload.contract_address,
      total_liquidity: payload.total_liquidity.toFixed(2),
      major_pair: payload.major_pair,
    })

    const response = await fetch(`${baseURL}plan/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
      body: formData.toString(),
    })

    const data = await response.json()
    if (!response.ok) {
      return rejectWithValue(data.detail || 'Failed to update stake plan')
    }

    return data
  } catch {
    return rejectWithValue('Failed to update stake plan')
  }
})

// Create Stake Plan
export const createStakePlan = createAsyncThunk<
  StakePlan,
  {
    plan_name: string
    description: string
    min_amount: number
    lock_in_period: number
    return_on_staking: number
    ros_pay_out_frenquency: string
    capital_pay_out_frequency: string
    plan_status: boolean
    total_liquidity: number
    major_pair: string
  },
  { rejectValue: string }
>('stakePlans/createStakePlan', async (payload, { rejectWithValue }) => {
  try {
    const token = getToken()

    const formBody = new URLSearchParams()
    formBody.append('plan_name', payload.plan_name)
    formBody.append('description', payload.description)
    formBody.append('min_amount', String(payload.min_amount))
    formBody.append('lock_in_period', String(payload.lock_in_period))
    formBody.append('return_on_staking', String(payload.return_on_staking))
    formBody.append('ros_pay_out_frenquency', payload.ros_pay_out_frenquency)
    formBody.append('capital_pay_out_frequency', payload.capital_pay_out_frequency)
    formBody.append('plan_status', String(payload.plan_status))
    formBody.append('total_liquidity', String(payload.total_liquidity))
    formBody.append('major_pair', payload.major_pair)

    const response = await fetch(`${baseURL}plan/plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
      body: formBody.toString(),
    })

    const data = await response.json()
    if (!response.ok) {
      return rejectWithValue(data.detail || 'Failed to create stake plan')
    }

    return data
  } catch {
    return rejectWithValue('Failed to create stake plan')
  }
})

const stakePlansSlice = createSlice({
  name: 'stakePlans',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
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
      // Update
      .addCase(updateStakePlan.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateStakePlan.fulfilled, (state, action) => {
        state.loading = false
        const updatedPlan = action.payload
        const index = state.stakePlans.findIndex(
          (plan) => plan.plan_id === updatedPlan.plan_id
        )
        if (index !== -1) {
          state.stakePlans[index] = updatedPlan
        }
      })
      .addCase(updateStakePlan.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Create
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

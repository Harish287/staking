// store/slices/investorAPI.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { Key, JSX } from 'react'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

interface Investor {
  withdraw_staking: any
  level_income: any
  adhoc_income: any
  credit: any
  map(
    arg0: (investor: { user_id: Key | null | undefined }) => JSX.Element,
  ): import('react').ReactNode

  suspend: boolean

  user_id: string
  name: string
  referred_by: string
  email: string
  investment: number
  team_business: number
  verified: {
    email: boolean
    kyc: boolean
  }
  transfer: boolean
  withdraw: boolean
  // status: boolean
}

export interface InvestorDetails {
  user_id: string
  // userId:string
  team_business: string
  invested: string
  fiat: string
  user_name: string
  full_name: string
  email: string
  mobile: string
  wallet: string
  dob: string
  nominee: {
    name: string
    pan: string
    relation: string
  }
  nationality: string
  bank: {
    account: string
    ifsc: string
    bank: string
    type: string
  }
  joining_date: string
  sponsor: string
  total_members: number
  team_tree: Record<string, any>
  withdraw: boolean
  withdraw_staking: boolean
  adhoc_income: boolean
  suspend: boolean
  transfer: boolean
  level_income_value: boolean
  credit: boolean
  roi?: number
  roi_spent?: number
  total_earnings?: number
  balance?: number
  stake_wallet?: number
}

interface InvestorState {
  list: Investor[]
  isLoading: boolean
  error: string | null
  total: number
  details: InvestorDetails | null
  detailsLoading: boolean
  detailsError: string | null
}

const initialState: InvestorState = {
  list: [],
  isLoading: false,
  error: null,
  total: 1,
  details: null,
  detailsLoading: false,
  detailsError: null,
}

export const fetchInvestorList = createAsyncThunk<
  Investor[],
  { page: number; page_size: number; searchQuery: string },
  { rejectValue: string }
>('investor/fetchList', async ({ page, page_size, searchQuery }, thunkAPI) => {
  try {
    const token = localStorage.getItem('token')
    let url = `${baseURL}user/investor_list?page=${page}&page_size=${page_size}`

    // Add search query to the API call if present
    if (searchQuery) {
      url += `&search=${searchQuery}`
    }

    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })

    return res.data
  } catch (err: any) {
    console.error('[Investor API] Error:', {
      message: err.message,
      response: err.response,
      status: err.response?.status,
      data: err.response?.data,
    })

    return thunkAPI.rejectWithValue(
      err.response?.data?.message || 'Failed to fetch investor list',
    )
  }
})

export const fetchInvestorDetails = createAsyncThunk(
  'investorDetails/fetchInvestorDetails',
  async (userId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')

      if (!token) {
        return rejectWithValue('Authorization token is missing.')
      }

      const encodedUserId = encodeURIComponent(userId)

      const response = await axios.get(
        `${baseURL}user/investor?user_id=${encodedUserId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        },
      )

      return response.data
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch investor details'
      return rejectWithValue(errorMessage)
    }
  },
)

const investorSlice = createSlice({
  name: 'investor',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvestorList.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchInvestorList.fulfilled, (state, action) => {
        state.isLoading = false
        state.list = action.payload
      })
      .addCase(fetchInvestorList.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || 'Failed to fetch investor list'
      })
      .addCase(fetchInvestorDetails.pending, (state) => {
        state.detailsLoading = true
        state.detailsError = null
        state.details = null
      })
      .addCase(fetchInvestorDetails.fulfilled, (state, action) => {
        state.detailsLoading = false
        state.details = action.payload
      })
      .addCase(fetchInvestorDetails.rejected, (state, action) => {
        state.detailsLoading = false
        state.detailsError = action.payload as string
      })
  },
})

export default investorSlice.reducer

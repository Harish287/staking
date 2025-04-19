// store/slices/investorAPI.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

interface Investor {
  credit: any
  suspend: any
  withdraw_staking: any
  level_income: any
  adhoc_income: any
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
  status: boolean
}

interface InvestorState {
  list: Investor[]
  isLoading: boolean
  error: string | null
  total: number
}

const initialState: InvestorState = {
  list: [],
  isLoading: false,
  error: null,
  total: 1,
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

    return res.data // Assuming the backend returns an object with 'data' and 'total'
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
  },
})

export default investorSlice.reducer

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

interface WithdrawItem {
  withdraw_request_id: string
  user_id: string
  full_name: string
  email: string
  status: string
  date_time: string
  source_wallet: string
  amount: number
  wallet: string
  beneficiary_nick_name: string
  transaction: string | null
  transaction_link: string
  description: string
}

interface WithdrawListState {
  items: WithdrawItem[]
  total: number
  total_pages: number
  page: number
  loading: boolean
  error: string | null
}

const initialState: WithdrawListState = {
  items: [],
  total: 0,
  total_pages: 0,
  page: 1,
  loading: false,
  error: null,
}

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL


export const fetchWithdrawList = createAsyncThunk(
  'withdraw/list',
  async (
    {
      review_status,
      page,
      page_size,
    }: { review_status: string; page: number; page_size: number },
    thunkAPI
  ) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      const response = await axios.get(
        `${baseURL}withdraw/list?review_status=${review_status}&page=${page}&page_size=${page_size}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      )
      return response.data
    } catch (error: any) {
      if (error.response?.status === 404 && error.response?.data?.detail === 'No records found') {
        return {
          items: [],
          total: 0,
          page,
          total_pages: 0,
        }
      }
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch')
    }
  }
)

const withdrawListSlice = createSlice({
  name: 'withdrawList',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWithdrawList.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWithdrawList.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.items || []
        state.total = action.payload.total || 0
        state.page = action.payload.page || 1
        state.total_pages = action.payload.total_pages || 0
      })

      .addCase(fetchWithdrawList.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default withdrawListSlice.reducer

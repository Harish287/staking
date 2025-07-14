import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

export const fetchVoucherUsageSummary = createAsyncThunk(
  'voucher/fetchVoucherusageSummary',
  async (
    { page = 1, page_size = 10 }: { page: number; page_size?: number },
    { rejectWithValue },
  ) => {
    try {
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''
      const response = await axios.get(
        `${baseURL}voucher/usage/summary?page=${page}&page_size=${page_size}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        },
      )
      return response.data
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.detail || 'Failed to fetch voucher wallet summary',
      )
    }
  },
)

interface VoucherUsageItems {
  voucher: string
  date_time: string
  total_amount: number
  used_amount: number
  remaining_amount: number
  description: string
  coin: number
  is_redeemed: boolean
}

interface voucherUsageSummaryState {
  total: number
  page: number
  page_size: number
  total_pages: number
  items: VoucherUsageItems[]
  loading: boolean
  error: string | null
}

const initialState: voucherUsageSummaryState = {
  total: 0,
  page: 1,
  items: [],
  page_size: 0,
  total_pages: 0,
  loading: false,
  error: null,
}

const voucherUsageSummarySlice = createSlice({
  name: 'voucherUsageSummary',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVoucherUsageSummary.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchVoucherUsageSummary.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.items
        state.total = action.payload.total
        state.total_pages = action.payload.total_pages
        state.page = action.payload.page
      })
      .addCase(fetchVoucherUsageSummary.rejected, (state, action) => {
        state.loading = false
        const error = action.payload as string
        if (
          error === 'No records found' ||
          error.includes('400') ||
          error.includes('404')
        ) {
          state.items = []
          state.error = null
          state.total = 0
          state.total_pages = 0
        } else {
          state.error = error
        }
      })
  },
})

export default voucherUsageSummarySlice.reducer

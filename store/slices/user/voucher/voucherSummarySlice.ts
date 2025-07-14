// src/store/slices/user/voucher/voucherSummarySlice.ts

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import Cookies from 'js-cookie'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

interface VoucherItem {
  description: string
  voucher: string
  pin: string
  amount: number
  used_amount: number
  balance_amount: number
  coin: number
  is_redeemed: boolean
}

interface VoucherSummaryState {
  items: VoucherItem[]
  total: number
  page: number
  page_size: number
  total_pages: number
  loading: boolean
  error: string | null
}

const initialState: VoucherSummaryState = {
  items: [],
  total: 0,
  page: 1,
  page_size: 10,
  total_pages: 1,
  loading: false,
  error: null,
}

export const fetchVoucherSummary = createAsyncThunk(
  'voucher/summary',
  async (
    { page = 1, page_size = 10 }: { page: number; page_size: number },
    { rejectWithValue },
  ) => {
    try {
      const token = Cookies.get('token')
      const response = await axios.get(`${baseURL}voucher/summary`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        params: { page, page_size },
      })
      return response.data
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.detail || 'Failed to fetch summary',
      )
    }
  },
)

const voucherSummarySlice = createSlice({
  name: 'voucherSummary',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVoucherSummary.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchVoucherSummary.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.items
        state.total = action.payload.total
        state.page = action.payload.page
        state.page_size = action.payload.page_size
        state.total_pages = action.payload.total_pages
      })
      .addCase(fetchVoucherSummary.rejected, (state, action) => {
        state.loading = false

        if ((action.payload as string) === 'No records found') {
          state.items = []
          state.total = 0
          state.error = null
        } else {
          state.error = action.payload as string
        }
      })
  },
})

export default voucherSummarySlice.reducer

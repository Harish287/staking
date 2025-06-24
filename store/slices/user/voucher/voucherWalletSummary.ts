import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

interface TransactionItem {
  description: string
  date_time: string
  amount: number
  transaction_type: string
  closing_balance: number
}

interface WalletSummaryState {
  items: TransactionItem[]
  total: number
  total_pages: number
  page_size: number
  page: number
  loading: boolean
  error: string | null
}

const initialState: WalletSummaryState = {
  items: [],
  total: 0,
  total_pages: 1,
  page_size: 0,
  page: 1,
  loading: false,
  error: null,
}

export const fetchVoucherWalletSummary = createAsyncThunk(
  'wallet/fetchVoucherWalletSummary',
  async (
    { page = 1, page_size = 10 }: { page: number; page_size?: number },
    { rejectWithValue },
  ) => {
    try {
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''
      const response = await axios.get(
        `${baseURL}voucher/wallet/summary?page=${page}&page_size=${page_size}`,
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

const voucherWalletSummarySlice = createSlice({
  name: 'voucherWalletSummary',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVoucherWalletSummary.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchVoucherWalletSummary.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.items
        state.total = action.payload.total
        state.total_pages = action.payload.total_pages
        state.page = action.payload.page
      })
      .addCase(fetchVoucherWalletSummary.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default voucherWalletSummarySlice.reducer

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

export interface StakeItem {
  user: string
  email: string
  contract: string
  invested: number
  invested_on: string
  plan: string
  completed: number
  remaining: number
  total: number
  ros_earned: number
  matured: boolean
}

export interface StakeListResponse {
  total: number
  page: number
  page_size: number
  total_pages: number
  items: StakeItem[]
}

interface StakeListState {
  items: StakeItem[]
  total: number
  page: number
  totalPages: number
  loading: boolean
  error: string | null
}

const initialState: StakeListState = {
  items: [],
  total: 0,
  page: 1,
  totalPages: 1,
  loading: false,
  error: null,
}

export const fetchStakeList = createAsyncThunk<
  StakeListResponse,
  { stake_status?: string; search?: string; page?: number; page_size?: number }
>('stake/fetchList', async (params, { rejectWithValue }) => {
  try {
    const token =
      localStorage.getItem('token') || (typeof window !== 'undefined' ? document.cookie : '')

    const res = await axios.get(`${baseURL}stake/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      params: {
        stake_status: params.stake_status ?? 'any',
        search: params.search ?? '',
        page: params.page ?? 1,
        page_size: params.page_size ?? 10,
      },
    })

    return res.data
  } catch (err: any) {
    const message = err.response?.data?.detail || err.message

    if (message === 'No records found') {
      return {
        items: [],
        total: 0,
        page: params.page ?? 1,
        page_size: params.page_size ?? 10,
        total_pages: 1,
      }
    }

    return rejectWithValue(message || 'Failed to fetch stake list')
  }
})

const stakeListSlice = createSlice({
  name: 'stakeList',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStakeList.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchStakeList.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.items
        state.total = action.payload.total
        state.page = action.payload.page
        state.totalPages = action.payload.total_pages
      })
      .addCase(fetchStakeList.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default stakeListSlice.reducer

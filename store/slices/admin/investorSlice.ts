import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL


export interface Investor {
  mobile: string
  last_name: string
  first_name: string
  user_id: string
  name: string
  referred_by: string
  email: string
  investment: number
  team_business: number
  email_verified: boolean
  kyc_verified: boolean
  transfer: boolean
  withdraw: boolean
  withdraw_staking: boolean
  level_income: boolean
  adhoc_income: boolean
  credit: boolean
  suspend: boolean
}

export interface InvestorDetails {
  email_verified: boolean
  kyc_verified: boolean
  user_id: string
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
    relationship: string
    name: string
    pan: string
  }
  nationality: string
  bank: {
    account_no: string
    account_type: string
    bank_name: string
    ifsc_code: string
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

interface InvestorListResponse {
  items: Investor[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface DownloadInvestorParams {
  page?: number
  page_size?: number
  search?: string
  token: string
}

// --- State ---

interface InvestorState {
  list: Investor[]
  isLoading: boolean
  error: string | null
  total: number
  details: InvestorDetails | null
  detailsLoading: boolean
  detailsError: string | null
  currentPage: number
  pageSize: number
  searchQuery: string
  downloadLoading: boolean
  downloadError: string | null
}

const initialState: InvestorState = {
  list: [],
  isLoading: false,
  error: null,
  total: 0,
  details: null,
  detailsLoading: false,
  detailsError: null,
  currentPage: 1,
  pageSize: 10,
  searchQuery: '',
  downloadLoading: false,
  downloadError: null,
}


export const fetchInvestorList = createAsyncThunk<
  { data: Investor[]; total: number },
  { page: number; page_size: number; searchQuery: string },
  { rejectValue: string }
>('investor/fetchList', async ({ page, page_size, searchQuery }, thunkAPI) => {
  try {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null

    let url = `${baseURL}user/investor_list?page=${page}&page_size=${page_size}`

    if (searchQuery) {
      url += `&search=${encodeURIComponent(searchQuery)}`
    }

    const res = await axios.get<InvestorListResponse>(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })

    return {
      data: res.data.items,
      total: res.data.total,
    }
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || 'Failed to fetch investor list',
    )
  }
})

export const fetchInvestorDetails = createAsyncThunk<
  InvestorDetails,
  string,
  { rejectValue: string }
>('investorDetails/fetch', async (userId, thunkAPI) => {
  try {
    const token = localStorage.getItem('token')

    if (!token) {
      return thunkAPI.rejectWithValue('Authorization token is missing.')
    }

    const response = await axios.get(
      `${baseURL}user/investor?user_id=${encodeURIComponent(userId)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      },
    )

    return response.data
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message ||
        error.message ||
        'Failed to fetch investor details',
    )
  }
})

export const downloadInvestorList = createAsyncThunk<
  Blob,
  DownloadInvestorParams,
  { rejectValue: string }
>('investor/download', async (params, { rejectWithValue }) => {
  try {
    const { token, ...query } = params
    const searchParams = new URLSearchParams()

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString())
      }
    })

    const response = await axios.get(
      `${baseURL}user/investor_list/download?${searchParams}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        responseType: 'blob',
      },
    )

    return response.data
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.detail || err.message || 'Download failed',
    )
  }
})

// --- Slice ---

const investorSlice = createSlice({
  name: 'investor',
  initialState,
  reducers: {
    resetInvestorDetails(state) {
      state.details = null
      state.detailsLoading = false
      state.detailsError = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvestorList.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchInvestorList.fulfilled, (state, action) => {
        state.isLoading = false
        state.list = action.payload.data
        state.total = action.payload.total
        state.currentPage = action.meta.arg.page
        state.pageSize = action.meta.arg.page_size
        state.searchQuery = action.meta.arg.searchQuery
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
        state.detailsError =
          action.payload || 'Failed to fetch investor details'
      })

      .addCase(downloadInvestorList.pending, (state) => {
        state.downloadLoading = true
        state.downloadError = null
      })
      .addCase(downloadInvestorList.fulfilled, (state) => {
        state.downloadLoading = false
      })
      .addCase(downloadInvestorList.rejected, (state, action) => {
        state.downloadLoading = false
        state.downloadError = action.payload || 'Download failed'
      })
  },
})

export const { resetInvestorDetails } = investorSlice.actions
export default investorSlice.reducer

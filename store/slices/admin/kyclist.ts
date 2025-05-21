import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import Cookies from 'js-cookie'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

export interface KycApplication {
  user_id: string
  name: string
  user_name: string
  doc_type: string
  docs: Record<string, string[]>
  submitted: string
  status: string
  kycVerified: boolean
}

interface KycListResponse {
  total: number
  page: number
  page_size: number
  total_pages: number
  items: KycApplication[]
}

interface KycState {
  kycApplications: KycApplication[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  isLoading: boolean
  error: string | null
}

const initialState: KycState = {
  kycApplications: [],
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 1,
  isLoading: false,
  error: null,
}

export const fetchKycApplications = createAsyncThunk<
  { applications: KycApplication[]; total: number; totalPages: number },
  { page: number; page_size: number },
  { rejectValue: string }
>(
  'kyc/fetchKycApplications',
  async ({ page, page_size }, { rejectWithValue }) => {
    try {
      const token =
        Cookies.get('token') || (typeof window !== 'undefined' && localStorage.getItem('token'))

      if (!token) throw new Error('No token found')

      const response = await axios.get<KycListResponse>(
        `${baseURL}kyc/list?page=${page}&page_size=${page_size}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      )

      const { items = [], total = 0, total_pages = 1 } = response.data

      return {
        applications: items,
        total,
        totalPages: total_pages,
      }
    } catch (error: any) {
      console.error('Error fetching KYC applications:', error)
      return rejectWithValue(
        error.response?.data?.detail || 'Failed to fetch KYC applications. Please try again.'
      )
    }
  }
)

const kycSlice = createSlice({
  name: 'kyc',
  initialState,
  reducers: {
    setKycPage(state, action) {
      state.page = action.payload
    },
    setKycPageSize(state, action) {
      state.pageSize = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchKycApplications.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchKycApplications.fulfilled, (state, action) => {
        console.log('Fetched KYC Applications:', action.payload.applications)
        console.log('Total Applications:', action.payload.total)
        console.log('Total Pages:', action.payload.totalPages)
      
        state.isLoading = false
        state.kycApplications = action.payload.applications
        state.total = action.payload.total
        state.totalPages = action.payload.totalPages
      })
      
      .addCase(fetchKycApplications.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { setKycPage, setKycPageSize } = kycSlice.actions

export default kycSlice.reducer

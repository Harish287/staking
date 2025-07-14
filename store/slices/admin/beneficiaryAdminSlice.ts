import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

interface Beneficiary {
  beneficiary_id: string
  user_id: string
  nick_name: string
  wallet_address: string
  email: string
  mobile: string
  limit: number
  status: string
}

interface BeneficiaryState {
  items: Beneficiary[]
  loading: boolean
  error: string | null
  actionLoading: boolean
}

const initialState: BeneficiaryState = {
  items: [],
  loading: false,
  error: null,
  actionLoading: false,
}

export const fetchBeneficiaries = createAsyncThunk(
  'beneficiary/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(
        `${baseURL}beneficiary/admin/list?review_status=any&page=1&page_size=10`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      return response.data.items || []
    } catch (error: any) {
      const status = error.response?.status
      const detail = error.response?.data?.detail

      // If API returns 404 with "No records found", treat as empty list
      if (status === 404 && detail === 'No records found') {
        return []
      }

      return rejectWithValue(detail || 'Failed to fetch data')
    }
  }
)


export const decideBeneficiary = createAsyncThunk(
  'beneficiary/decide',
  async (
    {
      beneficiary_id,
      user_id,
      action,
      comment,
      notify_user,
    }: {
      beneficiary_id: string
      user_id: string
      action: 'approve' | 'reject'
      comment: string
      notify_user: boolean
    },
    { rejectWithValue },
  ) => {
    try {
      const token = localStorage.getItem('token')
      const formData = new URLSearchParams()
      formData.append('beneficiary_id', beneficiary_id)
      formData.append('user_id', user_id)
      formData.append('action', action)
      formData.append('comment', comment)
      formData.append('notify_user', String(notify_user))

      const response = await axios.put(
        `${baseURL}beneficiary/admin/decide`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Action failed')
    }
  },
)

const beneficiarySlice = createSlice({
  name: 'beneficiary',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBeneficiaries.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBeneficiaries.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })

      .addCase(fetchBeneficiaries.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      .addCase(decideBeneficiary.pending, (state) => {
        state.actionLoading = true
      })
      .addCase(decideBeneficiary.fulfilled, (state) => {
        state.actionLoading = false
      })
      .addCase(decideBeneficiary.rejected, (state, action) => {
        state.actionLoading = false
        state.error = action.payload as string
      })
  },
})

export default beneficiarySlice.reducer

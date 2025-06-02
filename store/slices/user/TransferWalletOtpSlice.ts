import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import Cookies from 'js-cookie'

interface SendOtpState {
  loading: boolean
  success: boolean
  error: string | null
}

const initialState: SendOtpState = {
  loading: false,
  success: false,
  error: null,
}

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

export const transferWalletOtp = createAsyncThunk(
  'otp/transferWalletOtp',
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get('token')
      const response = await axios.post(
        `${baseURL}transfer/confirmation_otp`, // ✅ FIXED
        '',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        },
      )
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to send OTP',
      )
    }
  },
)

const transferWalletOtpSlice = createSlice({
  name: 'transferWalletOtp',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(transferWalletOtp.pending, (state) => {
        state.loading = true
        state.success = false
        state.error = null
      })
      .addCase(transferWalletOtp.fulfilled, (state) => {
        state.loading = false
        state.success = true
      })
      .addCase(transferWalletOtp.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default transferWalletOtpSlice.reducer

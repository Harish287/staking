import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

interface TransferPayload {
  otp: string
  transaction_pin: string
  amount: number
}

interface TransferState {
  loading: boolean
  success: boolean
  error: string | null
}

const initialState: TransferState = {
  loading: false,
  success: false,
  error: null,
}

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

export const initiateTransferIncomeToSuper = createAsyncThunk(
  'transfer/initiateIncomeToSuper',
  async (payload: TransferPayload, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      const formData = new URLSearchParams()
      formData.append('otp', payload.otp)
      formData.append('transaction_pin', payload.transaction_pin)
      formData.append('amount', payload.amount.toString())

      const response = await axios.post(
        `${baseURL}transfer/intiate/income/to/super`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
          },
        },
      )

      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.response?.data?.detail ||
          'Transfer failed',
      )
    }
  },
)

const transferSlice = createSlice({
  name: 'transfer',
  initialState,
  reducers: {
    resetTransferState: (state) => {
      state.loading = false
      state.success = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initiateTransferIncomeToSuper.pending, (state) => {
        state.loading = true
        state.success = false
        state.error = null
      })
      .addCase(initiateTransferIncomeToSuper.fulfilled, (state) => {
        state.loading = false
        state.success = true
      })
      .addCase(initiateTransferIncomeToSuper.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { resetTransferState } = transferSlice.actions
export default transferSlice.reducer

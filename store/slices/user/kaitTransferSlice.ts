import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

interface TransferErrorObject {
  detail?: string
  [key: string]: any
}
interface TransferState {
  loading: boolean
  success: boolean
  error: string | TransferErrorObject | null
  message: string | null
}

const initialState: TransferState = {
  loading: false,
  success: false,
  error: null,
  message: null,
}

interface TransferPayload {
  otp: string
  transaction_pin: string
  receiver_user_id: string
  amount: number
  token: string
}

export const initiatekaitTransfer = createAsyncThunk(
  'transfer/initiatekaitTransfer',
  async (
    { otp, transaction_pin, receiver_user_id, amount, token }: TransferPayload,
    thunkAPI,
  ) => {
    try {
      const response = await axios.post(
        `${baseURL}transfer/intiate/kait`,
        new URLSearchParams({
          otp,
          transaction_pin,
          receiver_user_id,
          amount: amount.toString(),
        }),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
      return response.data
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message)
    }
  },
)

const kaittransferSlice = createSlice({
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
      .addCase(initiatekaitTransfer.pending, (state) => {
        state.loading = true
        state.success = false
        state.error = null
      })
      .addCase(initiatekaitTransfer.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.error = null
        state.message =
          action.payload?.message || 'Transfer completed successfully'
      })

      .addCase(initiatekaitTransfer.rejected, (state, action) => {
        state.loading = false
        state.success = false
        state.error = action.payload || 'Something went wrong'
      })
  },
})

export const { resetTransferState } = kaittransferSlice.actions
export default kaittransferSlice.reducer

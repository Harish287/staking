import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

interface TransferErrorObject {
  detail?: string
  [key: string]: any
}

interface RosState {
  loading: boolean
  success: boolean
  error: string | TransferErrorObject | null
}

const initialState: RosState = {
  loading: false,
  success: false,
  error: null,
}

interface RestakePayload {
  otp: string
  transaction_pin: string
  amount: number
  token: string
}

export const initiateRestake = createAsyncThunk(
  'transfer/initiateRestake',
  async ({ otp, transaction_pin, amount, token }: RestakePayload, thunkAPI) => {
    try {
      const response = await axios.post(
        `${baseURL}transfer/intiate/restake`,
        new URLSearchParams({
          otp,
          transaction_pin,
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

const restakeSlice = createSlice({
  name: 'restake',
  initialState,
  reducers: {
    resetRestakeState: (state) => {
      state.loading = false
      state.success = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initiateRestake.pending, (state) => {
        state.loading = true
        state.success = false
        state.error = null
      })
      .addCase(initiateRestake.fulfilled, (state) => {
        state.loading = false
        state.success = true
        state.error = null
      })
      .addCase(initiateRestake.rejected, (state, action) => {
        state.loading = false
        state.success = false
        state.error = action.payload || 'Something went wrong'
      })
  },
})

export const { resetRestakeState } = restakeSlice.actions
export default restakeSlice.reducer

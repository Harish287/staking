import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const initiateSelfTransfer = createAsyncThunk(
  'wallet/initiateSelfTransfer',
  async (
    {
      otp,
      transaction_pin,
      wallet,
      amount,
    }: {
      otp: string
      transaction_pin: string
      wallet: string
      amount: number
    },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem('token')
      const data = new URLSearchParams()
      data.append('otp', otp)
      data.append('transaction_pin', transaction_pin)
      data.append('wallet', wallet)
      data.append('amount', String(amount))

      const res = await axios.post(
        'http://localhost/transfer/intiate/super/to/self',
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )
      return res.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Self transfer failed')
    }
  }
)

export const initiateUplineDownlineTransfer = createAsyncThunk(
  'wallet/initiateUplineDownlineTransfer',
  async (
    {
      otp,
      transaction_pin,
      receiver_user_id,
      amount,
    }: {
      otp: string
      transaction_pin: string
      receiver_user_id: string
      amount: number
    },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem('token')
      const data = new URLSearchParams()
      data.append('otp', otp)
      data.append('transaction_pin', transaction_pin)
      data.append('receiver_user_id', receiver_user_id)
      data.append('amount', String(amount))

      const res = await axios.post(
        'http://localhost/transfer/intiate/super/to/upline/downline',
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )
      return res.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Transfer to upline/downline failed')
    }
  }
)

interface TransferState {
  loading: boolean
  error: string | null
  success: boolean
}

const initialState: TransferState = {
  loading: false,
  error: null,
  success: false,
}

const transferSlice = createSlice({
  name: 'SuperWalletTransfer',
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
      .addCase(initiateSelfTransfer.pending, (state) => {
        state.loading = true
      })
      .addCase(initiateSelfTransfer.fulfilled, (state) => {
        state.loading = false
        state.success = true
      })
      .addCase(initiateSelfTransfer.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(initiateUplineDownlineTransfer.pending, (state) => {
        state.loading = true
      })
      .addCase(initiateUplineDownlineTransfer.fulfilled, (state) => {
        state.loading = false
        state.success = true
      })
      .addCase(initiateUplineDownlineTransfer.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { resetTransferState } = transferSlice.actions
export default transferSlice.reducer

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import qs from 'qs'

interface LoadWalletParams {
  user_id: string
  wallet_kind: string
  transaction_type: 'credit' | 'debit'
  comment: string
  amount: number
  token: string
}

export const loadWallet = async ({
  user_id,
  wallet_kind,
  transaction_type,
  comment,
  amount,
  token,
}: LoadWalletParams) => {
  const data = qs.stringify({
    user_id,
    wallet_kind,
    transaction_type,
    comment,
    amount,
  })

  const response = await axios.post('http://localhost/wallet/load', data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}

interface WalletState {
  loading: boolean
  success: boolean
  error: string | null
}

const initialState: WalletState = {
  loading: false,
  success: false,
  error: null,
}

export const loadWalletThunk = createAsyncThunk(
  'wallet/load',
  async (
    {
      user_id,
      wallet_kind,
      transaction_type,
      comment,
      amount,
      token,
    }: {
      user_id: string
      wallet_kind: string
      transaction_type: 'credit' | 'debit'
      comment: string
      amount: number
      token: string
    },
    { rejectWithValue },
  ) => {
    try {
      return await loadWallet({
        user_id,
        wallet_kind,
        transaction_type,
        comment,
        amount,
        token,
      })
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Wallet load failed')
    }
  },
)

const loadWalletSlice = createSlice({
  name: 'loadWallet',
  initialState,
  reducers: {
    resetWalletLoad: (state) => {
      state.loading = false
      state.success = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadWalletThunk.pending, (state) => {
        state.loading = true
        state.success = false
        state.error = null
      })
      .addCase(loadWalletThunk.fulfilled, (state) => {
        state.loading = false
        state.success = true
      })
      .addCase(loadWalletThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { resetWalletLoad } = loadWalletSlice.actions
export default loadWalletSlice.reducer

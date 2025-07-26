import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

export interface UserTreeNode {
  parent_id: null
  id: string
  name: string
  user_name: string | null
  email: string
  club: string
  level: number
  total_staking: number
  team_staking: number
}

interface UserTreeState {
  data: UserTreeNode[]
  loading: boolean
  error: string | null
}

const initialState: UserTreeState = {
  data: [],
  loading: false,
  error: null,
}

export const fetchUserTree = createAsyncThunk<
  UserTreeNode[],
  { root_user_id: string; filter_user_id: string; token: string }
>('userTree/fetchUserTree', async ({ root_user_id, filter_user_id, token }, { rejectWithValue }) => {
  try {
    const response = await axios.get<UserTreeNode[]>('http://localhost/user/user_tree', {
      params: { root_user_id, filter_user_id },
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch user tree')
  }
})

const userTreeSlice = createSlice({
  name: 'userTree',
  initialState,
  reducers: {
    resetUserTree: (state) => {
      state.data = []
      state.loading = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserTree.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserTree.fulfilled, (state, action: PayloadAction<UserTreeNode[]>) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchUserTree.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { resetUserTree } = userTreeSlice.actions
export default userTreeSlice.reducer

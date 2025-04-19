import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

interface PermissionPayload {
  userId: string
  permissionType:
    | 'transfer'
    | 'withdraw'
    | 'withdraw_staking'
    | 'level_income'
    | 'credit'
    | 'suspend'
    | 'adhoc_income'
  permissionValue: boolean
  token: string
}

interface PermissionState {
  loading: boolean
  error: string | null
  message: string | null
}

const initialState: PermissionState = {
  loading: false,
  error: null,
  message: null,
}

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

export const updateUserPermission = createAsyncThunk<
  { detail: string },
  PermissionPayload,
  { rejectValue: string }
>(
  'permissions/updateUserPermission',
  async ({ userId, permissionType, permissionValue, token }, thunkAPI) => {
    try {
      const url = `${baseURL}user/permission?user_id=${encodeURIComponent(
        userId,
      )}&permission_type=${permissionType}&permission_value=${permissionValue}`

      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error?.detail || 'Failed to update permission')
      }

      return await res.json()
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Something went wrong')
    }
  }
)

const permissionSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    clearPermissionState: (state) => {
      state.loading = false
      state.error = null
      state.message = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUserPermission.pending, (state) => {
        state.loading = true
        state.error = null
        state.message = null
      })
      .addCase(
        updateUserPermission.fulfilled,
        (state, action: PayloadAction<{ detail: string }>) => {
          state.loading = false
          state.message = action.payload.detail
          // Show success toast
          toast.success(action.payload.detail)
        }
      )
      .addCase(updateUserPermission.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to update permission'
        // Show error toast
        toast.error(state.error)
      })
  },
})

export const { clearPermissionState } = permissionSlice.actions
export default permissionSlice.reducer

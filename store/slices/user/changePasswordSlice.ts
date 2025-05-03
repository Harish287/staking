// redux/slices/changePasswordSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  error: string | null;
  loading: boolean;
  success: boolean;
}

const initialState: AuthState = {
  token: null,
  error: null,
  loading: false,
  success: false,
};

interface ChangePasswordPayload {
  token: string;
  new_password: string;
  confirm_password: string;
}

// Async thunk to change password
export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (
    { token, new_password, confirm_password }: ChangePasswordPayload,
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch('http://localhost/user/change_password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          token, // ✅ INCLUDE HERE
          new_password,
          confirm_password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data.detail || 'Password reset failed')
      }

      return data
    } catch (error) {
      return rejectWithValue('An error occurred while changing the password.')
    }
  }
)

const changePasswordSlice = createSlice({
  name: 'changePassword',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    clearToken: (state) => {
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setToken, clearToken } = changePasswordSlice.actions;

export default changePasswordSlice.reducer;

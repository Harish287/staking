import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';
import { encode } from '../../utils/base64';

export interface AuthState {
  verifiedUsername: any;
  suggestedUsernames: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  error: string | null;
  referralLink: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  error: null,
  referralLink: null,
  verifiedUsername: undefined,
  suggestedUsernames: undefined,
};
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
// 🔹 REGISTER USER
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (
    { name, email, password, mobile, referral_token }: any,
    { rejectWithValue }
  ) => {
    try {
      // Add referral_token to the request body if it exists
      const requestData: any = {
        name,
        email,
        password,
        mobile,
      };

      // Only add referral_token if it's available
      if (referral_token) {
        requestData.referral_token = referral_token;
      }

      const response = await axios.post(
        `${baseURL}user/register`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            accept: 'application/json',
          },
        }
      );
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Registration failed');
    }
  }
);


export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get('token') || localStorage.getItem('token');

      if (!token) throw new Error('No token found');

      await axios.get(`${baseURL}user/logout`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      localStorage.removeItem('token');
      Cookies.remove('token');

      return null;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Logout failed.');
    }
  },
);

export const suggestUsername = createAsyncThunk(
  'auth/suggestUsername',
  async (
    { name, dob, email }: { name: string; dob: string; email: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await axios.post(
        `${baseURL}user/suggest_username`,
        { name, dob, email },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('token') || localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            accept: 'application/json',
          },
        },
      );
      return response.data.details;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || 'Failed to fetch username suggestions',
      );
    }
  },
);

export const verifyUsername = createAsyncThunk(
  'auth/verifyUsername',
  async (username: string, { rejectWithValue }) => {
    try {
      const token = Cookies.get('token');
      if (!token) throw new Error('No token found');

      const response = await axios.get(
        `${baseURL}user/verify_username?username=${username}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.details) {
        return response.data.details; // Expecting a message like "username is available"
      }
      throw new Error('Unexpected response format');
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data ||
          error.message ||
          'An error occurred while verifying the username',
      );
    }
  },
);

// 🔹 LOGIN USER
export const loginUser = createAsyncThunk(
  'auth/signin',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const token = encode(`${email}:${password}`);
      const response = await axios.post(
        `${baseURL}user/token`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Basic ${token}`,
          },
        },
      );

      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        Cookies.set('token', response.data.access_token, { expires: 1 });
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Login failed');
    }
  },
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const token = Cookies.get('token');
      if (!token) throw new Error('No token found');

      const response = await axios.get(`${baseURL}user/check_token`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error: any) {
      dispatch(logoutUser());
      return rejectWithValue('Session expired. Please log in again.');
    }
  },
);


export const generateReferralLink = createAsyncThunk(
  'auth/generateReferralLink',
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get('token') || localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await axios.get(`${baseURL}user/generate_referral_token`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      return response.data.referral_token; // ✅ Fix: Extract correct key
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || 'Failed to generate referral link'
      );
    }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = action.payload !== null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = (action.payload as string) || 'Registration failed.';
      })

      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = action.payload.success;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = 'Login failed.';
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = 'Session expired. Please log in again.';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(generateReferralLink.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(generateReferralLink.fulfilled, (state, action) => {
        state.isLoading = false;
        state.referralLink = action.payload;
      })
      .addCase(generateReferralLink.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || 'Failed to generate referral link.';
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;

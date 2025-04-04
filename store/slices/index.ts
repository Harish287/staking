import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { encode } from "../../utils/base64";

interface KycApplication {
  user_id: string;
  name: string;
  user_name: string;
  doc_type: string;
  docs: Record<string, string[]>;
  submitted: string;
  status: string;   
}

export interface AuthState {
  verifiedUsername: any;
  suggestedUsernames: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  error: string | null;
  referralLink: string | null;
  kycApplications: KycApplication[]; 
  totalPages: number;
  name: string | null;
  user_id: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  error: null,
  referralLink: null,
  verifiedUsername: undefined,
  suggestedUsernames: undefined,
  kycApplications: [],  
  totalPages: 1,
  name: null,
  user_id: null,
};


const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

// users

// LOGIN USER
export const loginUser = createAsyncThunk(
  "auth/signin",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const token = encode(`${email}:${password}`);
      const response = await axios.post(
        `${baseURL}user/token`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Basic ${token}`,
          },
        }
      );

      if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
        Cookies.set("token", response.data.access_token, { expires: 1 });
        // Cookies.set("user_id", response.data.user_id);
        // Cookies.set("name", response.data.name);

        // Store name & user_id
        localStorage.setItem("user_id", response.data.user_id);
        localStorage.setItem("name", response.data.name);
      }

      return response.data;
      console.log("API Response:", response.data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);


// logout
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get("token") || localStorage.getItem("token");

      if (!token) throw new Error("No token found");

      await axios.get(`${baseURL}user/logout`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      localStorage.removeItem("token");
      Cookies.remove("token");

      return null;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Logout failed.");
    }
  }
);

//check_token
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("No token found");

      const response = await axios.get(`${baseURL}user/check_token`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error: any) {
      dispatch(logoutUser());
      return rejectWithValue("Session expired. Please log in again.");
    }
  }
);

//generate_referral_toke
export const generateReferralLink = createAsyncThunk(
  "auth/generateReferralLink",
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get("token") || localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await axios.get(
        `${baseURL}user/generate_referral_token`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      return response.data.referral_token; // ✅ Fix: Extract correct key
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to generate referral link"
      );
    }
  }
);



// REGISTER USER
export const registerUser = createAsyncThunk<any, // Success response type
  {
    name: string;
    email: string;
    password: string;
    mobile: string;
    referral_token?: string;
  }, // Input type
  { rejectValue: { detail: string } } // Error response type
>(
  "auth/registerUser",
  async (
    { name, email, password, mobile, referral_token },
    { rejectWithValue }
  ) => {
    try {
      const requestData: any = { name, email, password, mobile };

      if (referral_token) {
        requestData.referral_token = referral_token;
      }

      const response = await axios.post(
        `${baseURL}user/register`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
        }
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || { detail: "Registration failed" }
      );
    }
  }
);

// RESEND CONFIRMATION EMAIL
export const resendConfirmationEmail = createAsyncThunk(
  "auth/resendConfirmationEmail",
  async ({ email }: { email: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${baseURL}user/email_resend`,
        { email }, // API might not need this
        {
          headers: {
            Authorization: `Basic ${btoa(`${email}:your_password`)}`, // Fix authentication
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || "Failed to resend confirmation email"
      );
    }
  }
);




// KYC
//suggestUsername
export const suggestUsername = createAsyncThunk(
  "kyc/suggestUsername",
  async ({ name, dob }: { name: string; dob: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${baseURL}kyc/suggest_username`, // Updated endpoint
        { name, dob },
        {
          headers: {
            Authorization: `Bearer ${
              Cookies.get("token") || localStorage.getItem("token")
            }`,
            "Content-Type": "application/json",
            accept: "application/json",
          },
        }
      );
      return response.data.details;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch username suggestions"
      );
    }
  }
);

//verifyUsername
export const verifyUsername = createAsyncThunk(
  "kyc/verifyUsername",
  async (username: string, { rejectWithValue }) => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("No token found");

      const response = await axios.get(
        `${baseURL}kyc/verify_username?username=${username}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.details) {
        return response.data.details;
      }
      throw new Error("Unexpected response format");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data ||
          error.message ||
          "An error occurred while verifying the username"
      );
    }
  }
);

//verifyKYCStatus
export const verifyKYCStatus = createAsyncThunk(
  "kyc/verifyKYCStatus",
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get("token") || localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await axios.get(`${baseURL}kyc/verify_status`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      return response.data.details; // "string" (as per API response)
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || "KYC verification failed"
      );
    }
  }
);

//KYCAPPLICATION
export const submitKyc = createAsyncThunk(
  "kyc/submitKyc",
  async ({ formData }: { formData: FormData }, { rejectWithValue }) => {
    try {
      // Get the token from cookies
      const token = Cookies.get("token");

      if (!token) {
        return rejectWithValue("Authentication token is missing");
      }

      const response = await axios.post(
        `${baseURL}kyc/kyc_application`, // Ensure baseURL ends with `/` if needed
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      let errorMessage = "Failed to submit KYC";

      if (axios.isAxiosError(error)) {
        if (error.response) {
          const responseData = error.response.data;
          if (typeof responseData === "string") {
            errorMessage = responseData;
          } else if (responseData?.detail) {
            errorMessage = responseData.detail;
          } else {
            errorMessage = JSON.stringify(responseData);
          }
        } else if (error.request) {
          errorMessage = "No response from the server. Please try again.";
        } else {
          errorMessage = error.message;
        }
      }

      return rejectWithValue(errorMessage);
    }
  }
);

// Fetch KYC Applications
export const fetchKycApplications = createAsyncThunk<
  { applications: KycApplication[] }, // No total_pages
  { page: number; page_size: number },
  { rejectValue: string }
>(
  "auth/fetchKycApplications",
  async ({ page, page_size }, { rejectWithValue }) => {
    try {
      const token = Cookies.get("token") || localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      console.log(`Fetching KYC Applications (Page: ${page}, Size: ${page_size})...`);

      const response = await axios.get(
        `${baseURL}kyc/kyc_application_list?page=${page}&page_size=${page_size}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      const applications = Array.isArray(response.data) ? response.data : response.data.applications ?? [];
      console.log("KYC API Response Processed:", applications);
      console.log("KYC API Response:", response.data);

      return {
        applications: Array.isArray(response.data) ? response.data : [], // Ensure array
      };

    } catch (error: any) {
      console.error("Error Fetching KYC Applications:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || "Failed to fetch KYC applications");
    }
  }
);





// Approve or Reject KYC Application
export const approveKycApplication = createAsyncThunk< string, { user_id: string; action: "approve" | "reject" },{ rejectValue: string }
>(
  "auth/approveKycApplication",
  async ({ user_id, action }, { rejectWithValue }) => {
    try {
      const token = Cookies.get("token") || localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await axios.post(
        `${baseURL}kyc/approve`, // Changed from GET to POST
        { user_id, action }, // Sending user_id in the request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      return response.data.details;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to process KYC approval");
    }
  }
);


const authSlice = createSlice({
  name: "auth",
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

        if (typeof action.payload === "string") {
          state.error = action.payload;
        } else if (
          action.payload &&
          typeof action.payload === "object" &&
          "detail" in action.payload
        ) {
          state.error = (action.payload as { detail: string }).detail;
        } else {
          state.error = "Registration failed.";
        }
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
        state.error = "Login failed.";
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
        state.error = "Session expired. Please log in again.";
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
          (action.payload as string) || "Failed to generate referral link.";
      })
      .addCase(verifyKYCStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyKYCStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = { ...state.user, kycVerified: true };
      })
      .addCase(verifyKYCStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.user = { ...state.user, kycVerified: false };
      })
      .addCase(submitKyc.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitKyc.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.user) {
          state.user.kycVerified = true;
        }
      })
      .addCase(submitKyc.rejected, (state, action) => {
        state.isLoading = false;

        if (typeof action.payload === "string") {
          state.error = action.payload;
        } else if (
          action.payload &&
          typeof action.payload === "object" &&
          "detail" in action.payload
        ) {
          state.error = (action.payload as { detail: string }).detail;
        } else {
          state.error = "KYC submission failed.";
        }
      })
      .addCase(resendConfirmationEmail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resendConfirmationEmail.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null; 
      })
      .addCase(resendConfirmationEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchKycApplications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchKycApplications.fulfilled, (state, action) => {
        console.log("Redux: Fetched Data ->", action.payload); 
      
        state.isLoading = false; // ✅ Ensure loading stops
        state.kycApplications = action.payload.applications ?? [];
        state.totalPages = Math.ceil((state.kycApplications?.length || 0) / 10);
      })
      
      
      
      
      .addCase(fetchKycApplications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string; 
      })
      .addCase(approveKycApplication.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(approveKycApplication.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(approveKycApplication.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;


// import { configureStore } from "@reduxjs/toolkit";
// import authReducer from "./authslice"; 
// import kycReducer from "./kycSlice"; 


// export const store = configureStore({
//   reducer: {
//     auth: authReducer, 
//     kyc: kycReducer, 
//   },
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

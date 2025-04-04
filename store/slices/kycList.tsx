// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import api from "../slices/index"; // Replace with your API setup

// // ✅ Fetch KYC Applications
// export const fetchKycApplications = createAsyncThunk(
//   "auth/fetchKycApplications",
//   async ({ page, page_size }: { page: number; page_size: number }) => {
//     const response = await api.get(`/kyc-applications?page=${page}&page_size=${page_size}`);
//     return response.data; // Ensure this returns the expected data
//   }
// );

// const authSlice = createSlice({
//   name: "auth",
//   initialState: {
//     kycApplications: [],
//     isLoading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchKycApplications.pending, (state) => {
//         state.isLoading = true;
//         state.error = null; // Reset errors
//       })
//       .addCase(fetchKycApplications.fulfilled, (state, action) => {
//         state.kycApplications = action.payload.applications; // Make sure API returns `.applications`
//         state.isLoading = false;
//       })
//       .addCase(fetchKycApplications.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.error.message;
//       });
//   },
// });

// export default authSlice.reducer;

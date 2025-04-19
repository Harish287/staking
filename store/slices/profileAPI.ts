import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import Cookies from 'js-cookie'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      // Retrieve the token from cookies or localStorage
      const token = Cookies.get('token') || localStorage.getItem('token')

      if (!token) {
        throw new Error('No token found') // Ensure there's a token for authentication
      }

      // Make the API call to fetch the user profile
      const response = await axios.get(`${baseURL}user/personal_info`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      })

      return response.data // Assuming the response has user data in the `data` property
    } catch (error: any) {
      // Log the error for debugging purposes
      console.error('Error fetching user profile:', error)

      // Handle errors and return the error message if it fails
      return rejectWithValue(
        error.response?.data || error.message || 'Failed to fetch user profile',
      )
    }
  },
)
export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (
    userData: { first_name: string; last_name: string; dob: string },
    { rejectWithValue },
  ) => {
    try {
      // Retrieve the token from cookies or localStorage
      const token = Cookies.get('token') || localStorage.getItem('token')

      if (!token) {
        throw new Error('No token found') // Ensure there's a token for authentication
      }

      // Make the API call to update the user profile
      const response = await axios.put(
        `${baseURL}user/personal_info`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      )

      return response.data // Return the updated profile data
    } catch (error: any) {
      // Log the error for debugging purposes
      console.error('Error updating user profile:', error)

      // Handle errors and return the error message if it fails
      return rejectWithValue(
        error.response?.data ||
          error.message ||
          'Failed to update user profile',
      )
    }
  },
)

export const resetUserPassword = createAsyncThunk(
  'auth/resetUserPassword',
  async (
    passwordData: {
      old_password: string
      new_password: string
      confirm_password: string
    },
    { rejectWithValue },
  ) => {
    try {
      const token = Cookies.get('token') || localStorage.getItem('token')

      if (!token) throw new Error('No token found')
      console.log('Authorization token:', token)

      const response = await axios.put(
        `${baseURL}user/password`, // ✅ now safe from double slashes
        passwordData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      )
      console.log('Response status:', response.status)
      console.log('Response data:', response.data)
      return response.data
    } catch (error: any) {
      console.error('Error resetting password:', error)
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Failed to reset password',
      )
    }
  },
)

import React, { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { resetUserPassword } from '../../../store/slices/profileAPI'
import { resetPasswordState } from '../../../store/slices/profileSlice'
import { RootState } from '../../../store/store'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

const ResetPasswordForm = () => {
  const dispatch = useAppDispatch()
  const { isLoading, success, error } = useAppSelector(
    (state: RootState) => state.profile.password,
  )

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    if (success) {
      toast.success('Password reset successfully!')
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
      dispatch(resetPasswordState())
    }
    if (error) {
      toast.error(error)
      dispatch(resetPasswordState())
    }
  }, [success, error, dispatch])

  const handleSubmit = () => {
    // Validate fields are filled
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('All fields are required.')
      return
    }

    // Check if old password and new password are the same
    if (oldPassword === newPassword) {
      toast.error('New password cannot be the same as the old password.')
      return
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.')
      return
    }

    // Check password length
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters.')
      return
    }

    // Dispatch reset password action
    dispatch(
      resetUserPassword({
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      }),
    )
  }

  return (
    <div className="space-y-4 max-w-md mx-auto p-4">
      <div>
        <label className="block mb-1 font-medium text-gray-700">
          Current Password
        </label>
        <Input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          placeholder="Enter current password"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium text-gray-700">
          New Password
        </label>
        <Input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium text-gray-700">
          Confirm New Password
        </label>
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
        />
      </div>

      <Button
        onClick={handleSubmit}
        disabled={isLoading}
        className="bg-blue-600 text-white hover:bg-blue-700"
      >
        {isLoading ? 'Resetting...' : 'Reset Password'}
      </Button>
    </div>
  )
}

export default ResetPasswordForm

'use client'

import React, { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  decideWithdrawRequest,
  resetWithdrawAction,
} from '@/store/slices/admin/withdrawDecideSlice'
import {
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  TextField,
  Typography,
  Box,
} from '@mui/material'
import { toast } from 'react-hot-toast'

interface Props {
  withdraw_request_id: string
  user_id: string
  onClose?: () => void
}

export default function WithdrawAction({
  withdraw_request_id,
  user_id,
  onClose,
}: Props) {
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((state) => state.withdrawAction)
  const [comment, setComment] = useState('Approved by admin')
  const [notifyUser, setNotifyUser] = useState(true)

  const handleAction = async (action: 'approve' | 'reject') => {
    const result = await dispatch(
      decideWithdrawRequest({
        withdraw_request_id,
        user_id,
        action,
        comment,
        notify_user: notifyUser,
      })
    )

    if (decideWithdrawRequest.fulfilled.match(result)) {
      toast.success(`Withdrawal ${action}d successfully`)
      if (onClose) onClose()
    } else {
      toast.error(result.payload as string)
    }

    dispatch(resetWithdrawAction())
  }

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <TextField
        fullWidth
        label="Comment"
        multiline
        minRows={2}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={notifyUser}
            onChange={(e) => setNotifyUser(e.target.checked)}
          />
        }
        label="Notify user"
      />

      <Box display="flex" gap={2}>
        <Button
          variant="contained"
          color="success"
          onClick={() => handleAction('approve')}
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} /> : 'Approve'}
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => handleAction('reject')}
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} /> : 'Reject'}
        </Button>
      </Box>

      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}
    </Box>
  )
}

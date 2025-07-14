'use client'

import { useEffect, useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Menu,
  MenuItem,
  TextField,
} from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  fetchBeneficiaries,
  decideBeneficiary,
} from '@/store/slices/admin/beneficiaryAdminSlice'
import { EllipsisVertical } from 'lucide-react'
import toast from 'react-hot-toast'

export default function BeneficiaryListPage() {
  const dispatch = useAppDispatch()
  const { items, loading, error, actionLoading } = useAppSelector(
    (state) => state.adminbeneficiary,
  )

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedAction, setSelectedAction] = useState<{
    beneficiary_id: string
    user_id: string
    action: 'approve' | 'reject'
  } | null>(null)
  const [comment, setComment] = useState('')
  const [openDialog, setOpenDialog] = useState(false)

  useEffect(() => {
    dispatch(fetchBeneficiaries())
  }, [dispatch])

  useEffect(() => {
    if (error && error !== 'No user found') {
      toast.error(error)
    }
  }, [error])

  const handleMenuClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    beneficiary_id: string,
    user_id: string,
  ) => {
    setAnchorEl(e.currentTarget)
    setSelectedAction({ beneficiary_id, user_id, action: 'approve' })
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleSelectAction = (action: 'approve' | 'reject') => {
    if (selectedAction) {
      setSelectedAction({ ...selectedAction, action })
      setComment('')
      setOpenDialog(true)
    }
    handleMenuClose()
  }

  const handleConfirm = async () => {
    if (!selectedAction) return

    try {
      const response = await dispatch(
        decideBeneficiary({
          ...selectedAction,
          comment,
          notify_user: true,
        }),
      ).unwrap()

      toast.success(
        response.detail ||
          `Successfully ${selectedAction.action}ed beneficiary.`,
      )
    } catch (err: any) {
      toast.error(
        err?.detail || `Failed to ${selectedAction.action} beneficiary.`,
      )
    } finally {
      setOpenDialog(false)
      dispatch(fetchBeneficiaries())
    }
  }

  return (
    <div className="min-h-screen bg-blue-100 p-6">
      <div className="container bg-white mx-auto max-w-7xl p-6 rounded-2xl">
        <h1 className="text-xl font-bold mb-4">Beneficiaries</h1>

        {loading ? (
          <p>Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-center py-10 text-gray-500 text-lg font-medium">
            No beneficiary users found.
          </p>
        ) : (
          <table className="min-w-full text-sm border border-gray-200 rounded overflow-hidden">
            <thead className="bg-gray-100 text-gray-700 text-left">
              <tr>
                {[
                  'Nick Name',
                  'Wallet',
                  'Email',
                  'Mobile',
                  'Limit',
                  'Status',
                  'Actions',
                ].map((title) => (
                  <th key={title} className="p-3 font-medium">
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((b) => (
                <tr
                  key={b.beneficiary_id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-3">{b.nick_name}</td>
                  <td className="p-3 break-all">{b.wallet_address}</td>
                  <td className="p-3">{b.email}</td>
                  <td className="p-3">{b.mobile}</td>
                  <td className="p-3">{b.limit}</td>
                  <td className="p-3 capitalize">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        b.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : b.status === 'rejected'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={(e) =>
                        handleMenuClick(e, b.beneficiary_id, b.user_id)
                      }
                    >
                      <EllipsisVertical className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleSelectAction('approve')}>
          Approve
        </MenuItem>
        <MenuItem onClick={() => handleSelectAction('reject')}>Reject</MenuItem>
      </Menu>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add Comment for {selectedAction?.action}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Comment"
            fullWidth
            multiline
            rows={2}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            disabled={actionLoading || !comment.trim()}
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

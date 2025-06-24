'use client'

import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  addBeneficiary,
  resetBeneficiaryState,
} from '@/store/slices/user/addBeneficiary'
import {
  updateBeneficiary,
  resetUpdateState,
} from '@/store/slices/user/updateBeneficiary'
import { fetchBeneficiaries } from '@/store/slices/user/listBeneficiary'
import { RootState } from '@/store/store'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog'
import toast from 'react-hot-toast'

const REVIEW_STATUSES = ['any', 'approved', 'pending', 'rejected'] as const

export default function AddBeneficiaryForm() {
  const dispatch = useAppDispatch()

  const {
    loading: addLoading,
    success,
    error: addError,
  } = useAppSelector((state) => state.addbeneficiary)

  const {
    loading: updateLoading,
    success: updateSuccess,
    error: updateError,
  } = useAppSelector((state) => state.updateBeneficiary)

  const {
    items,
    loading: listLoading,
    error: listError,
    total_pages,
    page,
  } = useAppSelector((state: RootState) => state.listbeneficiary)

  const [currentPage, setCurrentPage] = useState(1)
  const [reviewStatus, setReviewStatus] = useState<
    'any' | 'approved' | 'pending' | 'rejected'
  >('any')

  const [formData, setFormData] = useState({
    nick_name: '',
    wallet_address: '',
    mobile: '',
    email: '',
    limit: '',
  })

  const [editMode, setEditMode] = useState(false)
  const [editingUserId, setEditingUserId] = useState<string | null>(null)

  const [editingBeneficiaryId, setEditingBeneficiaryId] = useState<
    string | null
  >(null)
  const [openDialog, setOpenDialog] = useState(false)

  useEffect(() => {
    dispatch(
      fetchBeneficiaries({ page: currentPage, review_status: reviewStatus }),
    )
  }, [dispatch, currentPage, reviewStatus])

  useEffect(() => {
    if (success) {
      toast.success('Beneficiary added successfully!')
      resetForm()
      dispatch(
        fetchBeneficiaries({ page: currentPage, review_status: reviewStatus }),
      )
      setTimeout(() => dispatch(resetBeneficiaryState()), 2000)
    }
  }, [success])

  useEffect(() => {
    if (updateSuccess) {
      toast.success('Beneficiary updated successfully!')
      resetForm()
      dispatch(
        fetchBeneficiaries({ page: currentPage, review_status: reviewStatus }),
      )
      setTimeout(() => dispatch(resetUpdateState()), 2000)
    }
  }, [updateSuccess])

  useEffect(() => {
    if (addError) {
      toast.error(renderError(addError))
    }
    if (updateError) {
      toast.error(renderError(updateError))
    }
  }, [addError, updateError])

  const resetForm = () => {
    setFormData({
      nick_name: '',
      wallet_address: '',
      mobile: '',
      email: '',
      limit: '',
    })
    setEditMode(false)
    setEditingBeneficiaryId(null)
    setEditingUserId(null)
    setOpenDialog(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      ...formData,
      limit: formData.limit === '' ? null : Number(formData.limit),
    }

    if (editMode && editingBeneficiaryId) {
      dispatch(
        updateBeneficiary({
          ...payload,
          beneficiary_id: editingBeneficiaryId!,
          user_id: editingUserId!,
        }),
      )
    } else {
      dispatch(addBeneficiary(payload))
    }
  }

  const renderError = (error: any) => {
    if (!error) return null
    return typeof error === 'string'
      ? error
      : error?.detail || 'An unexpected error occurred.'
  }

  const filteredItems =
    reviewStatus === 'any'
      ? items
      : items.filter((b) => b.status === reviewStatus)

  if (listLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-pink-700 border-b-gray-800 border-l-transparent border-r-transparent"></div>
      </div>
    )
  }
   if (addLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-pink-700 border-b-gray-800 border-l-transparent border-r-transparent"></div>
      </div>
    )
  } if (updateLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-pink-700 border-b-gray-800 border-l-transparent border-r-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 max-w-6xl mx-auto mb-6 mt-6">
        <div className="flex justify-between">
          <h2 className="text-xl font-bold mb-4">Beneficiary List</h2>

          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button
                className="bg-gradient-to-r from-pink-700 to-gray-800 text-white"
                onClick={() => {
                  setEditMode(false)
                  setFormData({
                    nick_name: '',
                    wallet_address: '',
                    mobile: '',
                    email: '',
                    limit: '',
                  })
                  setOpenDialog(true)
                }}
              >
                Add Users
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg bg-white">
              <DialogHeader>
                <DialogTitle>
                  {editMode ? 'Edit Beneficiary' : 'Add New Beneficiary'}
                </DialogTitle>
                <DialogDescription>
                  {editMode
                    ? 'Update the beneficiary details below.'
                    : 'Enter the details to add a new beneficiary.'}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  name="nick_name"
                  placeholder="Nick Name"
                  value={formData.nick_name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
                <input
                  name="wallet_address"
                  placeholder="Wallet Address"
                  value={formData.wallet_address}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
                <input
                  name="mobile"
                  placeholder="Mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
                <input
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
                <input
                  name="limit"
                  placeholder="Limit (optional)"
                  value={formData.limit}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />

                <div className="flex justify-end space-x-2">
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditMode(false)
                        setEditingBeneficiaryId(null)
                      }}
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={addLoading || updateLoading}>
                    {addLoading || updateLoading
                      ? editMode
                        ? 'Updating...'
                        : 'Adding...'
                      : editMode
                        ? 'Update'
                        : 'Add'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex space-x-2 mb-4">
          {REVIEW_STATUSES.map((status) => (
            <Button
              key={status}
              variant="ghost"
              className={`rounded-none text-[18px] ${
                reviewStatus === status
                  ? 'border-b-2 border-red-500 font-semibold'
                  : 'text-gray-500'
              }`}
              onClick={() => {
                setReviewStatus(status)
                setCurrentPage(1)
              }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>

        {listLoading && <p>Loading list...</p>}
        {/* {listError && <p className="text-red-500">{renderError(listError)}</p>} */}

        {!listLoading && filteredItems.length === 0 ? (
          <p className="text-center text-gray-500 mt-4">No records found.</p>
        ) : (
          <>
            <table className="w-full text-sm table-auto">
              <thead>
                <tr className="text-left border-b text-base text-gray-700 bg-gray-50">
                  <th className="px-4 py-3">Nickname</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Wallet</th>
                  <th className="px-4 py-3">Beneficiary ID</th>
                  <th className="px-4 py-3">Mobile</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length > 0 ? (
                  filteredItems.map((b) => (
                    <tr
                      key={b.beneficiary_id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-2">{b.nick_name || '—'}</td>
                      <td className="px-4 py-2 break-words">
                        {b.email || '—'}
                      </td>
                      <td className="px-4 py-2 break-all">
                        {b.wallet_address || '—'}
                      </td>
                      <td className="px-4 py-2">{b.beneficiary_id}</td>
                      <td className="px-4 py-2">{b.mobile || '—'}</td>
                      <td className="px-4 py-2 capitalize">
                        {b.status || '—'}
                      </td>
                      <td className="px-4 py-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditMode(true)
                            setEditingBeneficiaryId(b.beneficiary_id)
                            setEditingUserId(b.user_id)
                            setFormData({
                              nick_name: b.nick_name || '',
                              wallet_address: b.wallet_address || '',
                              mobile: b.mobile || '',
                              email: b.email || '',
                              limit: b.limit?.toString() || '',
                            })
                            setOpenDialog(true)
                          }}
                          className="text-xs"
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-4 text-center text-gray-500"
                    >
                      No beneficiaries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="flex justify-between mt-4">
              <Button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Previous
              </Button>
              <p>
                Page {page} of {total_pages}
              </p>
              <Button
                disabled={currentPage === total_pages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}

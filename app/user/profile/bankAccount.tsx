'use client'

import { useEffect, useState, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  fetchBankAccount,
  updateBankAccount,
} from '../../../store/slices/user/bankSlice'
import { BankAccount } from '../../../store/slices/user/bankSlice'

export default function BankAccountPage() {
  const dispatch = useAppDispatch()
  const { account, loading, error } = useAppSelector(
    (state) => state.BankAccount,
  )

  const [formData, setFormData] = useState<BankAccount>({
    bank_name: '',
    account_type: 'savings',
    account_no: '',
    ifsc_code: '',
  })

  useEffect(() => {
    dispatch(fetchBankAccount())
  }, [dispatch])

  useEffect(() => {
    if (account) setFormData(account)
  }, [account])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(updateBankAccount(formData))
      .unwrap()
      .then(() => alert('✅ Bank details updated!'))
      .catch(() => alert('❌ Update failed'))
  }

  const isFormChanged = useMemo(() => {
    if (!account) return true
    return (
      formData.bank_name !== account.bank_name ||
      formData.account_no !== account.account_no ||
      formData.account_type !== account.account_type ||
      formData.ifsc_code !== account.ifsc_code
    )
  }, [formData, account])

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Bank Account Info</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">Bank Name</label>
          <input
            type="text"
            name="bank_name"
            value={formData.bank_name}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block">Account Number</label>
          <input
            type="text"
            name="account_no"
            value={formData.account_no}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block">Account Type</label>
          <select
            name="account_type"
            value={formData.account_type}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="savings">Savings</option>
            <option value="current">Current</option>
          </select>
        </div>

        <div>
          <label className="block">IFSC Code</label>
          <input
            type="text"
            name="ifsc_code"
            value={formData.ifsc_code}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <button
          type="submit"
          disabled={!isFormChanged || loading}
          className={`px-4 py-2 rounded text-white ${
            !isFormChanged || loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  )
}

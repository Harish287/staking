'use client'

import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import {
  fetchStakePlans,
  createStakePlan,
  updateStakePlan,
} from '@/store/slices/admin/stakePlansSlice'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'

interface StakePlanForm {
  name: string
  frequency: string
  apy: string
  iroi: string
  level: string
  contract_address: string
  total_liquidity: string
  major_pair: string
  amount: string
  bonus: string
  stake_wallet_share_percent: string
}

export default function StakePlansPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { stakePlans, loading, error } = useSelector(
    (state: RootState) => state.stakePlans,
  )

  const [showAll, setShowAll] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState<StakePlanForm>({
    name: '',
    frequency: '',
    apy: '',
    iroi: '',
    level: '',
    contract_address: '',
    total_liquidity: '',
    major_pair: '',
    amount: '',
    bonus: '',
    stake_wallet_share_percent: '',
  })

  const [selectedPlan, setSelectedPlan] = useState<any | null>(null)
  const [editMode, setEditMode] = useState(false)

  const formRef = useRef<HTMLDivElement>(null)
  const detailsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    dispatch(fetchStakePlans())
  }, [dispatch])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if ((name === 'bonus' || name === 'apy') && parseFloat(value) > 100) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: `${name.replace(/_/g, ' ')} should be 100 or below.`,
      }))
    } else if (!value.trim()) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: `${name.replace(/_/g, ' ')} is required.`,
      }))
    } else {
      setFormErrors((prev) => ({ ...prev, [name]: '' }))
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const sanitizeFormData = (data: StakePlanForm) => ({
    name: data.name,
    contract_address: data.contract_address,
    major_pair: data.major_pair,
    frequency: parseInt(data.frequency, 10) || 0,
    apy: Math.min(parseFloat(data.apy) || 0, 100),
    iroi: parseFloat(data.iroi) || 0,
    level: parseInt(data.level, 10) || 0,
    amount: parseFloat(data.amount) || 0,
    bonus: Math.min(parseFloat(data.bonus) || 0, 100),
    stake_wallet_share_percent:
      parseFloat(data.stake_wallet_share_percent) || 0,
    total_liquidity: parseFloat(data.total_liquidity) || 0,
  })

  const hasEmptyFields = (form: StakePlanForm) =>
    Object.entries(form).some(([key, val]) => {
      if (!val.trim()) {
        setFormErrors((prev) => ({
          ...prev,
          [key]: `${key.replace(/_/g, ' ')} is required.`,
        }))
        return true
      }
      return false
    })

  const handleSubmit = async () => {
    if (
      Object.values(formErrors).some((err) => err) ||
      hasEmptyFields(formData)
    ) {
      toast.error('Please fix the errors before submitting.')
      return
    }

    const payload = sanitizeFormData(formData)

    try {
      if (editMode && selectedPlan) {
        await dispatch(
          updateStakePlan({
            ...payload,
            plan_id: selectedPlan.plan_id,
            status: selectedPlan.status,
          }),
        ).unwrap()
        toast.success('Stake plan updated successfully!')
      } else {
        await dispatch(createStakePlan(payload)).unwrap()
        toast.success('Stake plan created successfully!')
      }

      dispatch(fetchStakePlans())
      resetForm()
    } catch (err: any) {
      handleError(err)
    }
  }

  const handleError = (err: any) => {
    if (typeof err === 'string') {
      toast.error(err)
    } else if (typeof err === 'object' && err !== null) {
      const firstError = Object.values(err)[0]
      toast.error(
        typeof firstError === 'string' ? firstError : 'Validation error',
      )
    } else {
      toast.error('Something went wrong.')
    }
  }

  const handleEdit = (plan: any) => {
    setFormData({
      name: plan.name || '',
      frequency: plan.frequency?.toString() || '',
      apy: plan.apy?.toString() || '',
      iroi: plan.iroi?.toString() || '',
      level: plan.level?.toString() || '',
      contract_address: plan.contract_address || '',
      total_liquidity: plan.total_liquidity?.toString() || '',
      major_pair: plan.major_pair || '',
      amount: plan.amount?.toString() || '',
      bonus: plan.bonus?.toString() || '',
      stake_wallet_share_percent:
        plan.stake_wallet_share_percent?.toString() || '',
    })
    setSelectedPlan(plan)
    setEditMode(true)
    formRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleViewMore = (plan: any) => {
    setSelectedPlan(plan)
    setEditMode(false)
    detailsRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleCreate = () => {
    resetForm()
    formRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const resetForm = () => {
    setFormData({
      name: '',
      frequency: '',
      apy: '',
      iroi: '',
      level: '',
      contract_address: '',
      total_liquidity: '',
      major_pair: '',
      amount: '',
      bonus: '',
      stake_wallet_share_percent: '',
    })
    setSelectedPlan(null)
    setEditMode(false)
    setFormErrors({})
  }

  const placeholders: Record<string, string> = {
    name: 'e.g. Basic Plan',
    frequency: 'e.g. 30 (days)',
    apy: 'e.g. 12 (for 12%)',
    iroi: 'e.g. 2.5 (Initial ROI %)',
    level: 'e.g. 1 (user level)',
    contract_address: 'e.g. 0x123...abc',
    total_liquidity: 'e.g. 1.5',
    major_pair: 'e.g. ETH/USDT',
    amount: 'e.g. 500 (minimum amount)',
    bonus: 'e.g. 5 (bonus %)',
    stake_wallet_share_percent: 'e.g. 20 (percent)',
  }

  const displayedPlans = showAll ? stakePlans : stakePlans.slice(0, 5)

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="p-4 bg-[#DBEAFE]">
      <h1 className="text-2xl font-bold mb-4">Stake Plans</h1>

      <div className="overflow-x-auto border rounded mb-6 bg-white">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 font-semibold">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">APY</th>
              <th className="px-4 py-2">IROI</th>
              <th className="px-4 py-2">Level</th>
              <th className="px-4 py-2">Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {displayedPlans.map((plan, i) => (
              <tr key={i} className="border-t">
                <td className="px-4 py-2">{plan.name}</td>
                <td className="px-4 py-2">{plan.amount}</td>
                <td className="px-4 py-2">{plan.apy}</td>
                <td className="px-4 py-2">{plan.iroi}%</td>
                <td className="px-4 py-2">{plan.level}</td>
                <td className="px-4 py-2">{String(plan.status)}</td>
                <td>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white z-50">
                      <DropdownMenuItem onClick={() => handleViewMore(plan)}>
                        View More
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(plan)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleCreate}>
                        Create
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {stakePlans.length > 5 && (
          <div className="text-center mt-2">
            <button
              onClick={() => setShowAll((prev) => !prev)}
              className="text-blue-600 underline"
            >
              {showAll ? 'View Less' : 'View More'}
            </button>
          </div>
        )}
      </div>

      {/* View More Section */}
      {selectedPlan && !editMode && (
        <div
          ref={detailsRef}
          className="border  bg-white p-4 rounded shadow-md mt-6"
        >
          <h2 className="text-lg font-semibold mb-4">Stake Plan Details</h2>
          <div className=" grid  md:grid-cols-2 sm:grid-cols-1 gap-4 ">
            {Object.entries(selectedPlan)
              .filter(([key]) => key !== 'created_at' && key !== 'updated_at')
              .map(([key, value]) => (
                <p
                  key={key}
                  className=" p-2 border-2  bg-amber-50 hover:bg-blue-50 hover:shadow-2xl duration-1000 rounded-xl"
                >
                  <strong>{key.replace(/_/g, ' ')}:</strong> {String(value)}
                </p>
              ))}
          </div>
        </div>
      )}

      {/* Form Section */}
      <div
        ref={formRef}
        className="border p-4  bg-white rounded shadow-md mt-6"
      >
        <h2 className="text-lg font-semibold mb-4">
          {editMode ? 'Edit Stake Plan' : 'Create New Stake Plan'}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(formData).map(([key, val]) => (
            <div key={key}>
              <label className="block text-sm font-medium capitalize">
                {key.replace(/_/g, ' ')}
              </label>
              <input
                type="text"
                name={key}
                value={val}
                placeholder={placeholders[key]}
                onChange={handleInputChange}
                className={`mt-1 block w-full border px-2 py-1 rounded ${
                  formErrors[key] ? 'border-red-500' : ''
                }`}
              />
              {formErrors[key] && (
                <p className="text-red-500 text-sm mt-1">{formErrors[key]}</p>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white py-2 px-6 rounded"
          >
            {editMode ? 'Update' : 'Create'}
          </button>
          {editMode && (
            <button
              onClick={resetForm}
              className="ml-4 py-2 px-6 border rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

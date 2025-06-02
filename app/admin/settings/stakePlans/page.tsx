'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  fetchStakePlans,
  createStakePlan,
  updateStakePlan,
} from '@/store/slices/admin/stakePlansSlice'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import toast from 'react-hot-toast'

interface FormState {
  plan_name: string
  description: string
  min_amount: number
  lock_in_period: number
  return_on_staking: number
  ros_pay_out_frenquency: string
  capital_pay_out_frequency: string
  plan_status: boolean
  total_liquidity: number
  major_pair: string
  contract_address: string
}

const initialFormState: FormState = {
  plan_name: '',
  description: '',
  min_amount: 0,
  lock_in_period: 0,
  return_on_staking: 0,
  ros_pay_out_frenquency: 'monthly',
  capital_pay_out_frequency: 'monthly',
  plan_status: true,
  total_liquidity: 0,
  major_pair: '',
  contract_address: '',
}

export default function StakePlansAdmin() {
  const dispatch = useAppDispatch()
  const { stakePlans, loading, error } = useAppSelector(
    (state) => state.stakePlans,
  )

  const formRef = useRef<HTMLDivElement | null>(null)

  const [formState, setFormState] = useState<FormState>(initialFormState)
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})

  useEffect(() => {
    dispatch(fetchStakePlans())
  }, [dispatch])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target
    const newValue =
      type === 'checkbox' && 'checked' in e.target
        ? (e.target as HTMLInputElement).checked
        : value

    setFormState((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(newValue) : newValue,
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {}

    if (!formState.plan_name.trim()) newErrors.plan_name = 'Plan Name is required'
    if (!formState.description.trim()) newErrors.description = 'Description is required'
    if (!formState.major_pair.trim()) newErrors.major_pair = 'Major pair is required'
    if (formState.min_amount <= 0) newErrors.min_amount = 'Min amount must be greater than 0'
    if (formState.lock_in_period <= 0) newErrors.lock_in_period = 'Lock-in period is required'
    if (formState.return_on_staking <= 0)
      newErrors.return_on_staking = 'Return on staking is required'
    if (formState.total_liquidity < 0) newErrors.total_liquidity = 'Total liquidity cannot be negative'

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

const handleSubmit = async () => {
  if (!validateForm()) {
    toast.error('Please fix the form errors before submitting.')
    return
  }

  const payload = {
    ...formState,
  }

  try {
    if (editingPlanId) {
      await dispatch(
        updateStakePlan({
          plan_id: editingPlanId,
          ...payload,
          status: payload.plan_status,
        }),
      ).unwrap()
      toast.success('Stake plan updated successfully!')
    } else {
      await dispatch(createStakePlan(payload)).unwrap()
      toast.success('Stake plan created successfully!')
    }

    setFormState(initialFormState)
    setEditingPlanId(null)
    setErrors({})

    dispatch(fetchStakePlans())
  } catch (err) {
    toast.error('Something went wrong. Please try again.')
  }
}


  const handleEdit = (plan: any) => {
    setEditingPlanId(plan.plan_id)
    setFormState({
      plan_name: plan.name,
      description: plan.description,
      min_amount: plan.min_amount,
      lock_in_period: plan.lock_in_period,
      return_on_staking: plan.return_on_staking,
      ros_pay_out_frenquency: plan.ros_pay_out_frenquency,
      capital_pay_out_frequency: plan.capital_pay_out_frequency,
      plan_status: plan.status,
      total_liquidity: plan.total_liquidity,
      major_pair: plan.major_pair,
      contract_address: plan.contract_address ?? '',
    })

    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  return (
    <div className="p-6 space-y-6 bg-blue-100">
      <div className=" space-y-6 bg-white p-6 border-1 rounded-2xl">
        <Card>
          <div className="flex justify-between items-center">
            <CardHeader>
              <CardTitle ref={formRef}>
                {editingPlanId ? 'Edit' : 'Create'} Stake Plan
              </CardTitle>
            </CardHeader>

            <Button
              className="bg-green-500 text-white w-fit mr-3"
              onClick={() => {
                setFormState(initialFormState)
                setEditingPlanId(null)
                setErrors({})
                setTimeout(() => {
                  formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }, 100)
              }}
            >
              + Create Stake Plan
            </Button>
          </div>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField name="plan_name" label="Plan Name" value={formState.plan_name} onChange={handleChange} error={errors.plan_name} />
            <InputField name="description" label="Description" value={formState.description} onChange={handleChange} error={errors.description} />
            <InputField name="min_amount" type="number" label="Min Amount" value={formState.min_amount} onChange={handleChange} error={errors.min_amount} />
            <InputField name="lock_in_period" type="number" label="Lock-in Period" value={formState.lock_in_period} onChange={handleChange} error={errors.lock_in_period} />
            <InputField name="return_on_staking" type="number" label="Return on Staking (%)" value={formState.return_on_staking} onChange={handleChange} error={errors.return_on_staking} />
            <SelectField name="ros_pay_out_frenquency" value={formState.ros_pay_out_frenquency} onChange={handleChange} label="ROS Frequency" />
            <SelectField name="capital_pay_out_frequency" value={formState.capital_pay_out_frequency} onChange={handleChange} label="Capital Frequency" />
            <InputField name="major_pair" label="Major Pair" value={formState.major_pair} onChange={handleChange} error={errors.major_pair} />
            <InputField name="total_liquidity" type="number" label="Total Liquidity (0 allowed)" value={formState.total_liquidity} onChange={handleChange} error={errors.total_liquidity} />

            <div className="flex items-center gap-2 mt-2">
              <span>Status</span>
              <Switch
                checked={formState.plan_status}
                onCheckedChange={(value) =>
                  setFormState((prev) => ({ ...prev, plan_status: value }))
                }
              />
            </div>

            <Button
              className="col-span-full bg-blue-400"
              onClick={handleSubmit}
              disabled={loading}
            >
              {editingPlanId ? 'Update Plan' : 'Create Plan'}
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stakePlans.map((plan) => (
            <Card key={plan.plan_id} className="p-4">
              <CardTitle className="text-lg">{plan.name}</CardTitle>
              <div className="text-sm text-muted-foreground mb-2">
                {plan.description}
              </div>
              <div className="text-sm">
                ROI: {plan.return_on_staking}% | Lock-in: {plan.lock_in_period} days
              </div>
              <div className="text-sm">Min: {plan.min_amount}</div>
              <div className="text-sm">Liquidity: {plan.total_liquidity}</div>
              <div className="text-sm">Major Pair: {plan.major_pair}</div>
              <Button
                size="sm"
                className="mt-3 bg-blue-300"
                onClick={() => handleEdit(plan)}
              >
                Edit
              </Button>
            </Card>
          ))}
        </div>

        {loading && <p className="text-center text-sm">Loading...</p>}
        {error && <p className="text-center text-red-500 text-sm">{error}</p>}
      </div>
    </div>
  )
}

// Reusable Input Field with Error
function InputField({
  name,
  value,
  onChange,
  label,
  type = 'text',
  error,
}: {
  name: string
  value: string | number
  onChange: React.ChangeEventHandler<HTMLInputElement>
  label: string
  type?: string
  error?: string
}) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <Input
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={label}
        className={error ? 'border-red-500' : ''}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

// Reusable Select Field
function SelectField({
  name,
  value,
  onChange,
  label,
}: {
  name: string
  value: string
  onChange: React.ChangeEventHandler<HTMLSelectElement>
  label: string
}) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background"
      >
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
        <option value="quarterly">Quarterly</option>
        <option value="halfly">Halfly</option>
        <option value="yearly">Yearly</option>
        <option value="maturity">Maturity</option>
      </select>
    </div>
  )
}

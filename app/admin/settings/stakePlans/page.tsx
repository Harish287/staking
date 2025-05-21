'use client'

import React, { useEffect, useState } from 'react'
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

  const [formState, setFormState] = useState<FormState>(initialFormState)
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null)

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

  const handleSubmit = () => {
    const {
      plan_name,
      description,
      major_pair,
      min_amount,
      lock_in_period,
      return_on_staking,
      total_liquidity,
    } = formState

    if (
      !plan_name.trim() ||
      !description.trim() ||
      !major_pair.trim() ||
      min_amount <= 0 ||
      lock_in_period <= 0 ||
      return_on_staking <= 0 ||
      total_liquidity <= 0
    ) {
      alert('Please fill all fields correctly before submitting.')
      return
    }

    const payload = {
      ...formState,
      min_amount: Number(min_amount),
      lock_in_period: Number(lock_in_period),
      return_on_staking: Number(return_on_staking),
      total_liquidity: Number(total_liquidity),
    }

    if (editingPlanId) {
      dispatch(
        updateStakePlan({
          plan_id: editingPlanId,
          plan_name: payload.plan_name,
          description: payload.description,
          min_amount: payload.min_amount,
          lock_in_period: payload.lock_in_period,
          return_on_staking: payload.return_on_staking,
          ros_pay_out_frenquency: payload.ros_pay_out_frenquency,
          capital_pay_out_frequency: payload.capital_pay_out_frequency,
          status: payload.plan_status,
          contract_address: payload.contract_address,
          total_liquidity: payload.total_liquidity,
          major_pair: payload.major_pair,
        }),
      )
      setEditingPlanId(null)
    } else {
      dispatch(createStakePlan(payload))
    }

    setFormState(initialFormState)
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
  }

  return (
    <div className="p-6 space-y-6">
      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>{editingPlanId ? 'Edit' : 'Create'} Stake Plan</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField name="plan_name" value={formState.plan_name} onChange={handleChange} label="Plan Name" />
          <InputField name="description" value={formState.description} onChange={handleChange} label="Description" />
          <InputField name="min_amount" type="number" value={formState.min_amount} onChange={handleChange} label="Min Amount" />
          <InputField name="lock_in_period" type="number" value={formState.lock_in_period} onChange={handleChange} label="Lock-in Period" />
          <InputField name="return_on_staking" type="number" value={formState.return_on_staking} onChange={handleChange} label="Return on Staking (%)" />
          <SelectField name="ros_pay_out_frenquency" value={formState.ros_pay_out_frenquency} onChange={handleChange} label="ROS Frequency" />
          <SelectField name="capital_pay_out_frequency" value={formState.capital_pay_out_frequency} onChange={handleChange} label="Capital Frequency" />
          <InputField name="major_pair" value={formState.major_pair} onChange={handleChange} label="Major Pair" />
          <InputField name="total_liquidity" type="number" value={formState.total_liquidity} onChange={handleChange} label="Total Liquidity" />
          <div className="flex items-center gap-2">
            <span>Status</span>
            <Switch
              checked={formState.plan_status}
              onCheckedChange={(value) =>
                setFormState((prev) => ({ ...prev, plan_status: value }))
              }
            />
          </div>
          <Button
            className="col-span-full"
            onClick={handleSubmit}
            disabled={loading}
          >
            {editingPlanId ? 'Update Plan' : 'Create Plan'}
          </Button>
        </CardContent>
      </Card>

      {/* Plans list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stakePlans.map((plan) => (
          <Card key={plan.plan_id} className="p-4">
            <CardTitle className="text-lg">{plan.name}</CardTitle>
            <div className="text-sm text-muted-foreground mb-2">{plan.description}</div>
            <div className="text-sm">ROI: {plan.return_on_staking}% | Lock-in: {plan.lock_in_period} days</div>
            <div className="text-sm">Min: {plan.min_amount}</div>
            <div className="text-sm">Liquidity: {plan.total_liquidity}</div>
            <div className="text-sm">Major Pair: {plan.major_pair}</div>
            <Button size="sm" className="mt-3 bg-blue-300" onClick={() => handleEdit(plan)}>
              Edit
            </Button>
          </Card>
        ))}
      </div>

      {/* Status indicators */}
      {loading && <p className="text-center text-sm">Loading...</p>}
      {error && <p className="text-center text-red-500 text-sm">{error}</p>}
    </div>
  )
}

// Reusable input field
function InputField({
  name,
  value,
  onChange,
  label,
  type = 'text',
}: {
  name: string
  value: string | number
  onChange: React.ChangeEventHandler<HTMLInputElement>
  label: string
  type?: string
}) {
  return (
    <div>
      <h3>{label}</h3>
      <Input name={name} value={value} onChange={onChange} type={type} placeholder={label} />
    </div>
  )
}

// Reusable select field
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
      <h3 className="text-sm font-medium mb-1">{label}</h3>
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

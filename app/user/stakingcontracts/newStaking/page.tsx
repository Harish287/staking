'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { HourglassIcon } from 'lucide-react'
import Image from 'next/image'
import BgImg from '../../../../assets/cib.png'
import Kait from '../../../../assets/logo2x.png'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { fetchStakingPlans } from '@/store/slices/user/stakeSlice'
import toast from 'react-hot-toast'

const submitStakingRequest = async ({
  planId,
  walletType,
  amount,
}: {
  planId: string
  walletType: string
  amount: number
}) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true }), 1000)
  })
}

export default function StakingContract() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [stakeAmount, setStakeAmount] = useState('')
  const [walletType, setWalletType] = useState('kait-100')
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const dispatch = useDispatch<AppDispatch>()
  const { plans, loading, error } = useSelector(
    (state: RootState) => state.stakingPlans,
  )

  useEffect(() => {
    dispatch(fetchStakingPlans())
  }, [dispatch])

  const walletBalances = {
    kait: 10000,
    income: 5000,
    adhoc: 3000,
  }

  const selectedPlanObj = plans.find((plan) => plan.name === selectedPlan)

  const handleStakeSubmit = async () => {
    if (!selectedPlan || !stakeAmount || !walletType || !agreedToTerms) {
      toast.error('Please fill in all required fields.')
      return
    }
  
    const amountNum = Number(stakeAmount)
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Enter a valid staking amount.')
      return
    }
  
    if (selectedPlanObj && amountNum < selectedPlanObj.min_value) {
      toast.error(
        `Minimum staking amount for this plan is ${selectedPlanObj.min_value}`,
      )
      return
    }
  
    try {
      setIsSubmitting(true)
      const res = await submitStakingRequest({
        planId: selectedPlanObj?.name || '',
        walletType,
        amount: amountNum,
      })
      if ((res as any).success) {
        toast.success('Staking Request Submitted Successfully!')
        setSelectedPlan(null)
        setStakeAmount('')
        setWalletType('') 
        setAgreedToTerms(false)
      } else {
        toast.error('Failed to submit staking request.')
      }
    } catch (error) {
      toast.error('Error submitting staking request.')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  if (loading) return <div>Loading...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className="min-h-screen bg-[#F3EAD8] hover:bg-blue-50 transition-colors duration-2000 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-6 gap-2">
          <Image
            src={Kait}
            alt="kait"
            className="w-[40px] object-cover rounded-lg"
          />
          <h1 className="text-2xl font-bold">Get into the Staking Contract</h1>
        </div>

        <Card className="p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="text-[#105895]">
              <HourglassIcon className="h-8 w-8 fill-[#eb232b]" />
            </div>
            <h2 className="text-xl font-semibold">Staking Contract</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Info Section */}
            <div className="space-y-4">
              <div className="h-[300px] relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src={BgImg}
                    alt="Staking Illustration"
                    className="w-full h-full object-cover rounded-lg opacity-75"
                  />
                </div>
              </div>
              <div className="space-y-4 text-gray-600">
                <p>
                  Staking is a process in which cryptocurrency holders volunteer
                  to validate blockchain transactions and earn crypto rewards.
                </p>
                <p>
                  It’s like earning interest while holding onto your assets.
                </p>
              </div>
            </div>

            {/* Right: Form */}
            <div className="space-y-8">
              {/* Plan Selection */}
              <div>
                <h3 className="text-lg font-semibold text-green-600 mb-2">
                  Choose the Contract
                </h3>
                <p className="text-sm text-gray-600 mb-4">Select a Package</p>

                <div className="grid md:grid-cols-2 gap-3">
                  {plans.map((plan, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedPlan(plan.name)}
                      className={`w-full p-4 rounded-lg text-left transition ${
                        selectedPlan === plan.name
                          ? 'bg-purple-500 text-white hover:bg-purple-600'
                          : 'bg-blue-50 text-gray-700 hover:bg-blue-100'
                      }`}
                    >
                      <div className="font-medium">{plan.name}</div>
                      <div className="text-sm">
                        {plan.frequency === 1 ? 'Daily' : 'Monthly'} ROS & APY:{' '}
                        {plan.apy}% | Bonus: {plan.bonus}% | Min:{' '}
                        {plan.min_value}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Wallet Type */}
              {selectedPlanObj && (
                <div>
                  <h3 className="text-lg font-semibold text-green-600 mb-2">
                    Stake From
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Pick how your funds will be split across wallets
                  </p>

                  <RadioGroup
                    value={walletType}
                    onValueChange={setWalletType}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="kait-100" id="kait-100" />
                      <Label htmlFor="kait-100">KAIT Wallet - 100%</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={`kait-adhoc-${selectedPlanObj.name}`}
                        id={`kait-adhoc-${selectedPlanObj.name}`}
                      />
                      <Label htmlFor={`kait-adhoc-${selectedPlanObj.name}`}>
                        KAIT Wallet {selectedPlanObj.kait_wallet}% + Adhoc Wallet
                        {selectedPlanObj.adhoc_wallet}%
                      </Label>
                    </div>
                  </RadioGroup>

                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {Object.entries(walletBalances).map(([key, value]) => (
                      <div key={key} className="space-y-1">
                        <Label className="text-sm text-gray-600 capitalize">
                          {key} Wallet Balance:
                        </Label>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{value}</span>
                          <Image
                            src={Kait}
                            alt="kait"
                            className="w-5 h-5 rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stake Amount */}
              <div>
                <h3 className="text-lg font-semibold text-green-600 mb-2">
                  Amount (KAIT) to stake
                </h3>
                <Input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  placeholder="3000"
                  className="text-lg"
                />
              </div>

              {/* Terms  Submit */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) =>
                      setAgreedToTerms(checked as boolean)
                    }
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the{' '}
                    <span className="text-red-500">Terms & Conditions</span>
                  </Label>
                </div>

                <Button
                  className="w-full bg-green-500 hover:bg-green-600 text-white h-12 text-lg"
                  disabled={
                    !selectedPlan ||
                    !stakeAmount ||
                    !agreedToTerms ||
                    isSubmitting
                  }
                  onClick={handleStakeSubmit}
                >
                  {isSubmitting ? 'Processing...' : 'Process your Request'}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

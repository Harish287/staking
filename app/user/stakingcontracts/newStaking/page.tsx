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
import {
  fetchStakingPlans,
  fetchWalletSplits,
  performStake,
} from '@/store/slices/user/stakeSlice'
import toast from 'react-hot-toast'

export default function StakingContract() {
  const [selectedPlanId, setSelectedPlanId] = useState<string>('')
  const [stakeAmount, setStakeAmount] = useState('')
  const [selectedWalletSplitId, setSelectedWalletSplitId] = useState<string>('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [topMessage, setTopMessage] = useState<string | null>(null)

  const dispatch = useDispatch<AppDispatch>()
  const stakingPlansState = useSelector((state: RootState) => state.stakingPlans)
  const plans = stakingPlansState?.plans || []
  const walletSplits = stakingPlansState?.walletSplits || []
  const loading = stakingPlansState?.loading || false

  useEffect(() => {
    if (topMessage) {
      const timer = setTimeout(() => setTopMessage(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [topMessage])

  useEffect(() => {
    dispatch(fetchStakingPlans())
    dispatch(fetchWalletSplits())
  }, [dispatch])

  useEffect(() => {
    setSelectedWalletSplitId('')
    setStakeAmount('')
  }, [selectedPlanId])

  const selectedPlanObj = plans.find((plan) => plan.plan_id === selectedPlanId)

  const formatWalletSplitLabel = (splitValue: Record<string, number>) => {
    return Object.entries(splitValue)
      .map(([wallet, percent]) => `${wallet} - ${percent}%`)
      .join(' + ')
  }

  const handleStakeSubmit = async () => {
    if (!selectedPlanId || !stakeAmount || !selectedWalletSplitId || !agreedToTerms) {
      toast.error('Please fill in all required fields.')
      return
    }

    const amountNum = Number(stakeAmount)
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Enter a valid staking amount.')
      return
    }

    if (selectedPlanObj && amountNum < selectedPlanObj.min_amount) {
      toast.error(`Minimum staking amount for this plan is ${selectedPlanObj.min_amount}`)
      return
    }

    try {
      setIsSubmitting(true)
      await dispatch(
        performStake({
          plan_id: selectedPlanId,
          wallet_split_id: selectedWalletSplitId,
          amount: amountNum,
        }),
      ).unwrap()

      toast.success('Staking Request Submitted Successfully!')
      setSelectedPlanId('')
      setStakeAmount('')
      setSelectedWalletSplitId('')
      setAgreedToTerms(false)
    } catch (err: any) {
      const errorMessage = err || 'Failed to submit staking request.'
      setTopMessage(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading || isSubmitting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F3EAD8] hover:bg-blue-50 transition-colors duration-2000 p-6">
      <div className="max-w-7xl mx-auto">
        {topMessage && (
          <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-md font-medium">
            {topMessage}
          </div>
        )}

        <div className="flex items-center mb-6 gap-2">
          <Image src={Kait} alt="kait" className="w-[40px] object-cover rounded-lg" />
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
            {/* Left Illustration Section */}
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
                <p>It’s like earning interest while holding onto your assets.</p>
              </div>
            </div>

            {/* Right Form Section */}
            <div className="space-y-8">
              {/* Plan Selection */}
              <div>
                <h3 className="text-lg font-semibold text-green-600 mb-2">Choose the Contract</h3>
                <p className="text-sm text-gray-600 mb-4">Select a Package</p>
                <div className="grid md:grid-cols-2 gap-3">
                  {plans.map((plan) => (
                    <button
                      key={plan.plan_id}
                      onClick={() => setSelectedPlanId(plan.plan_id)}
                      className={`w-full p-5 rounded-lg text-left transition relative ${
                        selectedPlanId === plan.plan_id
                          ? 'bg-purple-500 text-white hover:bg-purple-600'
                          : 'bg-blue-100 text-gray-700 hover:bg-blue-200'
                      }`}
                    >
                      {selectedPlanId === plan.plan_id && (
                        <span className="absolute top-[-5] right-[-5] flex size-3">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pink-500 opacity-75"></span>
                          <span className="relative inline-flex size-3 rounded-full bg-pink-500"></span>
                        </span>
                      )}

                      <div className="font-bold text-[14px] text-center">{plan.name}</div>
                      <div className="text-[10px]">{plan.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Wallet Split & Balance */}
              {selectedPlanObj && (
                <>
                  <div>
                    <h3 className="text-lg font-semibold text-green-600 mb-2">Stake From</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Pick your wallet split configuration
                    </p>
                    <RadioGroup
                      value={selectedWalletSplitId}
                      onValueChange={setSelectedWalletSplitId}
                      className="space-y-3"
                    >
                      {walletSplits.map((split) => (
                        <div key={split.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={split.id} id={split.id} />
                          <Label htmlFor={split.id} className="text-sm">
                            {formatWalletSplitLabel(split.value)}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>

                    <h4 className="mt-5 font-bold text-green-600">Wallet Balance</h4>
                    {selectedWalletSplitId && (() => {
                      const selectedSplit = walletSplits.find(split => split.id === selectedWalletSplitId)
                      if (!selectedSplit?.balance) return null

                      return (
                        <div className="ml-6 mt-3 text-sm flex gap-6 text-gray-800">
                          {Object.entries(selectedSplit.balance).map(([wallet, amount]) => (
                            <div key={wallet} className="text-center">
                              <div className="text-[15px] font-bold mb-1">{wallet}</div>
                              <div className="flex items-center justify-center gap-1">
                                <Image
                                  src={Kait}
                                  alt="kait"
                                  className="w-[20px] h-[20px] object-cover rounded-full"
                                />
                                <span>{Number(amount).toLocaleString()}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )
                    })()}
                  </div>

                  {/* Amount Input */}
                  <div>
                    <h3 className="text-lg font-semibold text-green-600 mb-2">
                      Amount (KAIT) to stake
                    </h3>
                    <Input
                      type="number"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      placeholder={selectedPlanObj.min_amount.toString()}
                      className="text-lg"
                    />
                  </div>

                  {/* Agreement and Submit */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        checked={agreedToTerms}
                        onCheckedChange={(checked) => setAgreedToTerms(!!checked)}
                      />
                      <Label htmlFor="terms" className="text-sm">
                        I agree to the{' '}
                        <span className="text-red-500 cursor-pointer">Terms & Conditions</span>
                      </Label>
                    </div>

                    <Button
                      className="w-full bg-green-500 hover:bg-green-600 text-white h-12 text-lg flex items-center justify-center"
                      disabled={
                        !selectedPlanId ||
                        !stakeAmount ||
                        !selectedWalletSplitId ||
                        !agreedToTerms ||
                        isSubmitting
                      }
                      onClick={handleStakeSubmit}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-white mr-2"></span>
                          Processing...
                        </>
                      ) : (
                        'Process your Request'
                      )}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

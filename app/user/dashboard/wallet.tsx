'use client'

import { useEffect, useState } from 'react'
import { FaEllipsisH, FaTimes } from 'react-icons/fa'
import {
  Wallet,
  PiggyBank,
  TrendingUp,
  DollarSign,
  Gift,
  ArrowUpRight,
} from 'lucide-react'
import Image from 'next/image'
import Logo from '@/assets/logo2x.png'
import {
  fetchUserData,
  TeamMember,
} from '@/store/slices/user/userTreeDataReducer'
import { useAppDispatch, useAppSelector } from '@/store/store'

type WalletData = {
  title: string
  amount: string
  list: string[] | string
  isOpen: boolean
  onToggle: () => void
  icon: React.ReactNode
  gradient: string
  accentColor: string
}

const WalletCard = ({
  title,
  amount,
  list,
  isOpen,
  onToggle,
  icon,
  gradient,
  accentColor,
}: WalletData) => {
  const dropdownItems = Array.isArray(list) ? list : [list]

  return (
    <div className="group relative">
      {/* Floating background glow */}
      <div
        className={`absolute -inset-1 ${gradient} rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-pulse`}
      ></div>
      {/* Main card */}
      <div className="relative  dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-gray-100 to-transparent transform rotate-12 scale-150"></div>
        </div>

        {/* Header with icon - keeping original title */}
        <div className={`relative ${gradient} p-4 text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                {icon}
              </div>
              <div>
                <h3 className="font-semibold text-sm leading-tight">{title}</h3>
              </div>
            </div>

            {/* Action button - using original icons */}
            <div className="relative">
              {/* Toggle Button */}
              <button
                onClick={onToggle}
                className="p-2 hover:bg-white/20 rounded-lg transition-all duration-300 transform hover:scale-110 hover:rotate-180"
              >
                {isOpen ? (
                  <FaTimes className="w-4 h-4" />
                ) : (
                  <FaEllipsisH className="w-4 h-4" />
                )}
              </button>

              {/* Dropdown List */}
              {isOpen && (
                <div className="absolute right-0 mt-2 z-50 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  {(Array.isArray(list) ? list : [list]).map((item, idx) => (
                    <button
                      key={idx}
                      onClick={onToggle}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Amount section - keeping original logo and amount */}
        <div className="relative px-6 py-2 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 relative">
                <Image
                  alt="KAIT Logo"
                  src={Logo}
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                {amount}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full ${gradient} rounded-full transition-all duration-1000 ease-out transform origin-left`}
              style={{
                width: `${Math.min(parseInt(amount.replace(/,/g, '')) / 100, 100)}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Dropdown menu - keeping original content */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden animate-in slide-in-from-top-2 duration-300">
            <div className="py-2">
              {dropdownItems.map((item, idx) => (
                <button
                  key={idx}
                  className="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-3 group/item"
                  onClick={onToggle}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${gradient} opacity-60 group-hover/item:opacity-100 transition-opacity`}
                  ></div>
                  <span className="group-hover/item:translate-x-1 transition-transform duration-200">
                    {item}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Floating particles effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-4 right-4 w-1 h-1 bg-white rounded-full opacity-60 animate-ping"></div>
          <div
            className="absolute bottom-6 left-6 w-1 h-1 bg-white rounded-full opacity-40 animate-ping"
            style={{ animationDelay: '1s' }}
          ></div>
          <div
            className="absolute top-1/2 left-1/3 w-0.5 h-0.5 bg-white rounded-full opacity-30 animate-ping"
            style={{ animationDelay: '2s' }}
          ></div>
        </div>
      </div>
    </div>
  )
}

const AnimatedWallets = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const dispatch = useAppDispatch()
  const { data: userData, loading } = useAppSelector((state) => state.UserTree)

  useEffect(() => {
    dispatch(fetchUserData())
  }, [dispatch])
 if (loading || !userData) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex space-x-2">
        <span className="w-3 h-3 bg-pink-700 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-3 h-3 bg-pink-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-3 h-3 bg-pink-500 rounded-full animate-bounce"></span>
      </div>
    </div>
  )
}

  const walletIcons = [
    <Wallet className="w-4 h-4" />,
    <PiggyBank className="w-4 h-4" />,
    <TrendingUp className="w-4 h-4" />,
    <DollarSign className="w-4 h-4" />,
    <TrendingUp className="w-4 h-4" />,
    <Gift className="w-4 h-4" />,
    <Gift className="w-4 h-4" />,
    <Wallet className="w-4 h-4" />,
    <ArrowUpRight className="w-4 h-4" />,
  ]

  const gradients = [
    'bg-gradient-to-r from-pink-700 to-gray-800 ',
    'bg-gradient-to-r from-pink-700 to-gray-800 ',
    'bg-gradient-to-r from-pink-700 to-gray-800 ',
    'bg-gradient-to-r from-pink-700 to-gray-800 ',
    'bg-gradient-to-r from-pink-700 to-gray-800 ',
    'bg-gradient-to-r from-pink-700 to-gray-800 ',
    'bg-gradient-to-r from-pink-700 to-gray-800 ',
    'bg-gradient-to-r from-pink-700 to-gray-800 ',
    'bg-gradient-to-r from-pink-700 to-gray-800 ',
  ]

  const accentColors = [
    'bg-pink-100 text-purple-700',
    'bg-pink-100 text-pink-700',
    'bg-pink-100 text-blue-700',
    'bg-pink-100 text-green-700',
    'bg-pink-100 text-orange-700',
    'bg-pink-100 text-indigo-700',
    'bg-pink-100 text-teal-700',
    'bg-pink-100 text-red-700',
    'bg-pink-100 text-cyan-700',
  ]

  const data = [
    {
      title: 'KAIT Wallet',
      amount: userData.kiat_wallet.toLocaleString(),
      list: 'View Wallet',
    },
    {
      title: 'Total Staking',
      amount: userData.invested.toLocaleString(),
      list: ['New Staking', 'All Staking'],
    },
    {
      title: 'Regular - ROS',
      amount: userData.ros_wallet.toLocaleString(),
      list: ['Summary', 'Re-Stake'],
    },
    {
      title: 'Fixed - ROS',
      amount: '0',
      list: 'Summary',
    },
    {
      title: 'Total Earnings',
      amount: '0',
      list: 'Summary',
    },
    {
      title: 'Adhoc Wallet',
      amount: userData.adhoc_wallet.toLocaleString(),
      list: 'Summary',
    },
    {
      title: 'Voucher',
      amount: userData.vpay_voucher.toLocaleString(),
      list: 'Summary',
    },
    {
      title: 'Income Wallet',
      amount: '0',
      list: 'Summary',
    },
    {
      title: 'Withdrawal',
      amount: '0',
      list: 'Summary',
    },
  ]

  return (
    <div className="min-h-screen  dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {data.map((wallet, index) => (
            <WalletCard
              key={index}
              title={wallet.title}
              amount={wallet.amount}
              list={wallet.list}
              isOpen={openIndex === index}
              onToggle={() =>
                setOpenIndex((prev) => (prev === index ? null : index))
              }
              icon={walletIcons[index]}
              gradient={gradients[index]}
              accentColor={accentColors[index]}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default AnimatedWallets

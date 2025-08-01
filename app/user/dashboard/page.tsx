'use client'

import React, { useEffect, useRef, useState } from 'react'
import Autoplay from 'embla-carousel-autoplay'
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../../../store/store'
import { verifyKYCStatus } from '../../../store/slices/index'
import { Bell, ClipboardCopy, Siren } from 'lucide-react'
import ReferralComponent from '@/app/user/components/referralComponent'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import Image from 'next/image'
import Bg1 from '../../../assets/new_s1.jpg'
import Bg2 from '../../../assets/new_s2.jpg'
import Bg3 from '../../../assets/new_s3.jpg'
import Bg4 from '../../../assets/new_s4.jpg'
import Wallets from './wallet'
import Link from 'next/link'
import { useAppSelector } from '@/store/hooks'
import { motion } from 'framer-motion'
import { fetchUserData } from '@/store/slices/user/userTreeDataReducer'
import {
  FaHandPointRight,
  FaList,
  FaTrophy,
  FaUser,
  FaUserPlus,
  FaWallet,
} from 'react-icons/fa'
import { FaSquareCheck } from 'react-icons/fa6'
import Logo from '@/assets/logo2x.png'
import { IconButton, Menu, MenuItem, Divider } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import CountUp from 'react-countup'

function UserDashboard() {
  const dispatch = useDispatch<AppDispatch>()
  const { kycVerified, kycStatusLoading } = useAppSelector(
    (state) => state.auth,
  )

  const { data: userData, loading: userLoading } = useAppSelector(
    (state) => state.UserTree,
  )
  const latestBalance = userData?.wallets?.restake_wallet || '0'

  useEffect(() => {
    dispatch(fetchUserData())
    dispatch(verifyKYCStatus())
  }, [dispatch])

  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }))
  const BgImage = [{ img: Bg1 }, { img: Bg2 }, { img: Bg3 }, { img: Bg4 }]

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const levelChartData =
    userData?.level_info?.levels.map((level) => ({
      name: `L${level.level}`,
      users: level.total_users,
      volume: Number(level.total_volume),
    })) || []

  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (userData?.wallet) {
      navigator.clipboard.writeText(userData?.wallet)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (kycStatusLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-purple-700 border-b-gray-800 border-l-transparent border-r-transparent"></div>
      </div>
    )
  }
  return (
    <div className="pt-5 bg-[#F3EAD8] hover:bg-blue-50  pb-[20px]  transition-colors duration-2000">
      <div className="items-center mx-auto px-[20px] w-auto h-[180px ] grid grid-cols-1 lg:grid-cols-3 container mb-[20px]">
        <div className="col-span-1 lg:col-span-3 h-[180px] ">
          <Carousel
            plugins={[plugin.current]}
            className="lg:px-7 px-0"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent>
              {BgImage.map((image, imgIndex) => (
                <CarouselItem key={imgIndex}>
                  <div className="p-1 rounded-2xl h-[180px]">
                    <Card className="border-none p-0">
                      <CardContent className="flex p-0 aspect-square items-center h-[180px] justify-center">
                        <div key={imgIndex} className="relative w-full h-full">
                          <Image
                            src={image.img}
                            alt={`Background ${imgIndex + 1}`}
                            fill
                            style={{ objectFit: 'cover' }}
                            className="rounded-lg w-full h-full"
                            sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>

      <div className="container px-[20px] mx-auto lg:grid lg:grid-cols-3 grid-cols-1 gap-4">
        <div className="col-span-full lg:col-span-2">
          <Wallets />
        </div>

        <div className="flex flex-col items-center justify-start gap-4 mt-6 lg:mt-0 h-full py-8">
          <Card className="w-full  p-3 bg-white">
            <CardHeader>
              <CardTitle className="text-center flex justify-between items-center">
                <p className="flex items-center gap-1 text-[14px] text-gray-600">
                  <span>KYC Status</span> <FaHandPointRight />
                </p>
                <div className="flex items-center">
                  <span
                    className={`text-[12px] flex items-center gap-1 ${
                      kycVerified ? 'text-green-600' : 'text-red-500'
                    }`}
                  >
                    {kycVerified ? (
                      <>
                        <FaSquareCheck /> Verified
                      </>
                    ) : (
                      'Not Verified'
                    )}
                  </span>
                  {!kycVerified && (
                    <Link href="/user/kyc">
                      <p className="text-[12px] font-normal border-2 bg-blue-200 p-0.5 ml-3">
                        Submit KYC
                      </p>
                    </Link>
                  )}
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent>
              <CardDescription className="text-gray-600 font-bold flex items-center gap-1 mb-1">
                <FaUserPlus className="w-5 h-5" />
                <span>Your Referral Link</span>
              </CardDescription>

              <Card className="py-0 px-2 bg-gray-100">
                <div className="w-full overflow-hidden">
                  <ReferralComponent />
                </div>
              </Card>
            </CardContent>
          </Card>
          <Card className="w-full  p-3 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2 text-gray-600">
                <Bell className="w-5 h-5 text-red-500" />
                Flash Notification
              </CardTitle>
              <div className="overflow-hidden w-full p-3 mt-2 rounded-2xl  bg-gradient-to-r from-blue-500 to-purple-700 border border-purple-700 shadow-lg shadow-purple-200/50">
                <motion.div
                  className="whitespace-nowrap"
                  animate={{ x: ['100%', '-100%'] }}
                  transition={{
                    repeat: Infinity,
                    duration: 10,
                    ease: 'linear',
                  }}
                >
                  <CardDescription className="text-white text-[15px] flex gap-1">
                    <Siren color="red" className="h-5 w-5" />
                    Welcome to KAIT Staking Platform
                  </CardDescription>
                </motion.div>
              </div>
            </CardHeader>

            <CardContent>
              <Card className="h-[30px] flex justify-center items-center border-purple-700 shadow-lg shadow-purple-200/50">
                <div className="flex gap-1 text-gray-600">
                  <span>Membership Since</span>
                  <span className="font-bold">{userData?.joining_date}</span>
                </div>
              </Card>
            </CardContent>

            <CardContent>
              <div className="flex flex-col text-sm font-medium text-gray-700">
                <span className="text-gray-500 flex gap-1 items-center">
                  <FaUser /> Sponsor
                </span>
                <span className="text-black">{userData?.sponsor}</span>
              </div>
            </CardContent>

            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <span className="border px-3 py-1 border-red-700 text-purple-700 rounded-xl flex items-center gap-2 text-sm">
                  <FaWallet /> Restake Wallet
                </span>

                <span className="text-sm text-gray-800 font-semibold">
                  Balance:
                  <div className="flex items-center">
                    <span className="text-black flex items-center gap-1 ml-1">
                      <Image
                        alt="KAIT Logo"
                        src={Logo}
                        width={20}
                        height={20}
                        className="object-contain"
                      />
                      {latestBalance}
                    </span>
                    <div>
                      <IconButton
                        aria-label="more"
                        aria-controls="wallet-menu"
                        aria-haspopup="true"
                        onClick={handleMenuOpen}
                        size="small"
                        sx={{ padding: '4px', fontSize: '16px' }}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>

                      <Menu
                        id="wallet-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleMenuClose}
                        slotProps={{
                          list: { 'aria-labelledby': 'wallet-button' },
                        }}
                      >
                        <Link
                          href="/user/stakingcontracts/walletSummary?wallet_kind=ReStakeWallet&page=1"
                          passHref
                        >
                          <MenuItem
                            component="a"
                            onClick={handleMenuClose}
                            sx={{ fontSize: '15px', px: 1 }}
                          >
                            View Wallet
                          </MenuItem>
                        </Link>
                        <Divider />
                        <MenuItem
                          onClick={handleMenuClose}
                          sx={{ fontSize: '15px', px: 1 }}
                        >
                          Restake from Wallet
                        </MenuItem>
                      </Menu>
                    </div>
                  </div>
                </span>
              </div>
            </CardContent>
          </Card>

          {/* KYC Card */}
        </div>

        <div className="col-span-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="bg-white gap-2 p-4">
              <h4 className="text-[15px] flex gap-1 items-center font-semibold mb-4">
                <Image
                  alt="KAIT Logo"
                  src={Logo}
                  width={20}
                  height={20}
                  className="object-contain"
                />
                Available KAIT Wallet
              </h4>

              <div className="bg-white shadow rounded-xl p-4 w-full">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Invested</span>
                  <span>Kiat Wallet</span>
                </div>

                <div className="relative group">
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <span className="flex items-center gap-1">
                      Total:
                      <Image
                        alt="KAIT Logo"
                        src={Logo}
                        width={14}
                        height={14}
                        className="object-contain"
                      />
                      <CountUp
                        end={
                          (userData?.wallets?.kiat_wallet ?? 0) +
                          (userData?.total_staking ?? 0)
                        }
                        duration={1.5}
                        separator=","
                      />
                    </span>
                  </div>

                  <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden flex">
                    {(() => {
                      const invested = userData?.total_staking ?? 0
                      const wallet = userData?.wallets?.kiat_wallet ?? 0
                      const total = Math.max(wallet + invested)

                      const investedPercent = total
                        ? Math.min((invested / total) * 100, 100)
                        : 0

                      const remainingPercent = total
                        ? Math.max(((total - invested) / total) * 100, 0)
                        : 0

                      return (
                        <>
                          <div
                            className="bg-emerald-400 transition-all duration-1000"
                            style={{
                              width: `${Math.max(investedPercent, 2)}%`,
                            }}
                          />
                          {remainingPercent > 0 && (
                            <div
                              className="bg-red-400 transition-all duration-1000"
                              style={{
                                width: `${remainingPercent}%`,
                              }}
                            />
                          )}
                        </>
                      )
                    })()}
                  </div>
                </div>

                <div className="mt-2 text-xs text-gray-600 font-medium flex justify-between">
                  <span className="flex items-center gap-1">
                    Invested:
                    <span className="text-green-500 flex items-center gap-1">
                      <Image
                        alt="KAIT Logo"
                        src={Logo}
                        width={14}
                        height={14}
                        className="object-contain"
                      />
                      <CountUp
                        end={userData?.total_staking ?? 0}
                        duration={1.5}
                        separator=","
                      />
                    </span>
                  </span>
                  <span className="flex items-center gap-1">
                    Remaining:
                    <span className="text-red-500 flex items-center gap-1">
                      <Image
                        alt="KAIT Logo"
                        src={Logo}
                        width={14}
                        height={14}
                        className="object-contain"
                      />
                      <CountUp
                        end={Math.max(userData?.wallets?.kiat_wallet ?? 0, 0)}
                        duration={1.5}
                        separator=","
                      />
                    </span>
                  </span>
                </div>
              </div>
            </Card>

            <Card className="bg-white p-4">
              <h4> Club Based Monthly Volume (Live)</h4>
            </Card>

            <Card className="bg-white p-4 flex flex-col gap-4 overflow-hidden">
              <h4 className="text-base font-semibold text-gray-700">
                Your Team Metrics – Total of {userData?.total_users ?? 0}{' '}
                Members
              </h4>

              {userData?.club_counts &&
              Object.keys(userData.club_counts).length > 0 ? (
                <div className="text-sm text-gray-700 flex flex-wrap gap-3">
                  {Object.entries(userData.club_counts).map(([club, count]) => {
                    const countNum = Number(count)

                    return (
                      <span
                        key={club}
                        className={`px-3 py-1 rounded-full border transition
              ${
                countNum === 0
                  ? 'text-gray-400 border-gray-200 bg-gray-50'
                  : 'text-purple-700 font-semibold border-purple-200 bg-purple-50'
              }`}
                      >
                        {countNum === 0
                          ? club
                          : countNum === 1
                            ? `${club}`
                            : `${club} - ${countNum}`}
                      </span>
                    )
                  })}
                </div>
              ) : (
                <span className="text-sm text-red-500 font-medium">
                  No Club Members associated with you !!!
                </span>
              )}
            </Card>
          </div>
        </div>

        <div className="col-span-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="bg-white p-4">
              <div className="p-2">
                <h4 className="text-lg font-bold text-center mb-2">
                  <span className="flex justify-center items-center text-[15px] gap-1">
                    <FaTrophy className="w-4 h-4" /> Club & Reward Details
                  </span>
                </h4>
                <h5 className="font-semibold text-purple-700 border mt-6 border-purple-700 shadow-lg shadow-purple-700 px-4 py-2 rounded-xl mx-auto w-fit text-center">
                  <span>Current Status:</span>
                  <span className="ml-2">
                    {userData?.team_tree?.[0]?.club || '—'}
                  </span>
                </h5>

                <div className="overflow-hidden w-full p-3 mt-5 rounded-2xl inline-block  bg-gradient-to-r from-blue-500 to-purple-700 border border-purple-700 shadow-lg shadow-purple-200/50">
                  <CardDescription
                    className=" text-white text-[15px] animate-bounce
                  flex gap-1"
                  >
                    <Siren color="red" className=" h-5 w-5 " /> To Achive the
                    Target of {userData?.next_progress?.next_club || '—'}
                  </CardDescription>
                </div>

                <div className="mt-4 space-y-4">
                  {userData?.next_progress?.progress.map((item, idx) => {
                    const total = Number(item.required) || 1
                    const current = Number(item.current) || 0
                    const remaining = total - current
                    const currentPercent = Math.min(
                      (current / total) * 100,
                      100,
                    )
                    const remainingPercent = 100 - currentPercent

                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between items-center text-sm text-gray-700">
                          <span className="font-medium">{item.title}</span>
                          <span className="text-xs">
                            {current} / {total} {item.status && '✅'}
                          </span>
                        </div>

                        <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden flex">
                          <div
                            className="bg-emerald-400 h-full transition-all duration-700"
                            style={{ width: `${currentPercent}%` }}
                          ></div>
                          <div
                            className="bg-red-400 h-full transition-all duration-700"
                            style={{ width: `${remainingPercent}%` }}
                          ></div>
                        </div>

                        {!item.status && (
                          <div className="text-xs text-gray-400 text-right font-medium">
                            {remaining} remaining
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </Card>

            <Card className="bg-white p-4">
              <h4 className="text-lg font-bold text-center mb-4">
                <span className=" flex justify-center items-center gap-1 text-[14px]">
                  <FaList className="w-3 h-3" /> Your Team Volume Metrics
                </span>
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={levelChartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="users" fill="#8884d8" name="Users" />
                  <Bar dataKey="volume" fill="#82ca9d" name="Volume" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="bg-white p-4 flex flex-col gap-2 overflow-hidden">
              <h2 className="text-lg font-semibold text-gray-700">
                Wallet Address
              </h2>
              <div className="flex items-center gap-2 border border-purple-700 shadow-xl shadow-purple-300 rounded px-3 py-2 w-full overflow-hidden">
                <span
                  className="text-[15px] whitespace-nowrap overflow-hidden text-ellipsis flex-1"
                  title={userData?.wallet}
                >
                  {userData?.wallet || '—'}
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center px-3 py-1  bg-gradient-to-r from-blue-500 to-purple-700  hover:cursor-pointer text-white rounded-md hover:bg-blue-700"
                  title="Copy"
                >
                  <ClipboardCopy size={20} />
                </button>
              </div>
              {copied && (
                <span className="text-sm text-green-600 mt-1">Copied!</span>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard

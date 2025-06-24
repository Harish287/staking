'use client'

import React, { useEffect, useRef, useState } from 'react'
import Autoplay from 'embla-carousel-autoplay'
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../../../store/store'
import { verifyKYCStatus } from '../../../store/slices/index'
import { Bell, Siren } from 'lucide-react'
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
import { FaHandPointRight, FaUser, FaUserPlus, FaWallet } from 'react-icons/fa'
import { FaSquareCheck } from 'react-icons/fa6'
import Logo from '@/assets/logo2x.png'
import { IconButton, Menu, MenuItem, Divider } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Padding } from '@mui/icons-material'

function UserDashboard() {
  const dispatch = useDispatch<AppDispatch>()
  const { kycVerified, kycStatusLoading } = useAppSelector(
    (state) => state.auth,
  )

  const { data: userData, loading: userLoading } = useAppSelector(
    (state) => state.UserTree,
  )
  const latestBalance = userData?.restake_wallet || '0'

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

  if (kycStatusLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-pink-700 border-b-gray-800 border-l-transparent border-r-transparent"></div>
      </div>
    )
  }
  return (
    <div className="pt-5 bg-[#F3EAD8] hover:bg-blue-50  pb-[20px] transition-colors duration-2000">
      <div className="items-center mx-auto px-[20px] w-auto h-[180px ] grid grid-cols-1 lg:grid-cols-3 container mb-[20px]">
        <div className="col-span-1 lg:col-span-2 h-[180px] ">
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

        <div className="flex h-auto items-center justify-center">
          <Card className="w-[350px]  bg-white">
            <CardHeader>
              <CardTitle className="text-center flex justify-evenly">
                <p className="flex justify-center items-center gap-1 text-[14px] text-gray-600">
                  <span>KYC Status</span> <FaHandPointRight />
                </p>
                <div className="flex justify-center items-center">
                  <span
                    className={`flex items-center text-[12px] ${
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
                      <p className="text-[12px] font-normal flex justify-center items-center border-2 bg-blue-200 p-0.5 ml-3">
                        Submit KYC
                      </p>
                    </Link>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 font-bold flex items-center gap-1 mb-1">
                <FaUserPlus className=" w-5 h-5" />
                <span>Your Referral Link</span>
              </CardDescription>

              <Card className="h-[30px] flex justify-center items-center">
                <div className="flex justify-center items-center w-full h-full">
                  <span className="m-0 w-full overflow-hidden text-ellipsis whitespace-nowrap">
                    <ReferralComponent />
                  </span>
                </div>
              </Card>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="container px-[20px] justify-center items-center m-auto lg:grid lg:grid-cols-3 grid-cols-1">
        <div className="col-span-full lg:col-span-2">
          <Wallets />
        </div>

        <div className="flex justify-center lg:justify-center items-center mt-6 lg:mt-0 h-[100%] p-8">
          <Card className="w-[350px] h-[100%] bg-white">
            <CardHeader>
              <CardTitle className=" justify-center items-center flex gap-1 text-gray-600">
                <Bell className=" w-5 h-5 text-red-500" />
                Flash Notification
              </CardTitle>
              <div className="overflow-hidden w-full p-3 mt-2 rounded-2xl inline-block bg-gradient-to-r from-pink-700 to-gray-800 border border-pink-700 shadow-lg shadow-pink-200/50">
                <motion.div
                  className="whitespace-nowrap"
                  animate={{ x: ['100%', '-100%'] }}
                  transition={{
                    repeat: Infinity,
                    duration: 10,
                    ease: 'linear',
                  }}
                >
                  <CardDescription className=" text-white text-[15px] flex gap-1">
                    <Siren color="red" className=" h-5 w-5" /> Welcome to KAIT
                    Staking Platform
                  </CardDescription>
                </motion.div>
              </div>
            </CardHeader>
            <CardContent>
              <Card className="h-[30px] flex justify-center items-center  border-pink-700 shadow-lg shadow-pink-200/50">
                <div className=" flex gap-1 text-gray-600">
                  <span> Membership Since </span>
                  <span className=" font-bold">{userData?.joining_date}</span>
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
                <span className="border px-3 py-1 border-red-700 text-pink-700 rounded-xl flex items-center gap-2 text-sm">
                  <FaWallet /> Restake Wallet
                </span>

                <span className="text-sm text-gray-800 font-semibold">
                  Balance:
                  <div className=" flex items-center">
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
                        <MenuItem
                          onClick={handleMenuClose}
                          sx={{
                            fontSize: '15px',
                            padding: '0px 5px',
                            fontWeight: 300,
                            margin: 0,
                            width: 'fit',
                          }}
                        >
                          <Link
                            href="/user/stakingcontracts/restakewalletSummary"
                            passHref
                          >
                            <span className="w-full block">View Wallet</span>
                          </Link>
                        </MenuItem>

                        <Divider />
                        <MenuItem
                          onClick={() => {
                            handleMenuClose()
                          }}
                          sx={{
                            fontSize: '15px',
                            padding: '0px 5px',
                            fontWeight: 300,
                            margin: 0,
                            width: 'fit',
                          }}
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
            
        </div>
         <Card className=' w-full bg-white'><div > Club & Reward Details</div></Card>
      </div>
    </div>
  )
}

export default UserDashboard

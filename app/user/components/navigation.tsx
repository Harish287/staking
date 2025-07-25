'use client'
import Image from 'next/image'
import Link from 'next/link'
import { RiWallet3Line } from 'react-icons/ri'
import { MdOutlineDashboard } from 'react-icons/md'
import { GrShareOption } from 'react-icons/gr'
import { TbTransfer } from 'react-icons/tb'
import { PiUserListBold } from 'react-icons/pi'
import { LuSettings } from 'react-icons/lu'
import Logo from '../../../assets/logo2x.png'
import { LuCircleUserRound } from 'react-icons/lu'
import { FaUsers } from 'react-icons/fa6'
import { PiHandbagFill } from 'react-icons/pi'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { usePathname, useRouter } from 'next/navigation'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu'
import { Button } from '../../../components/ui/button'
import {
  ArrowLeftRight,
  ArrowUpFromLine,
  Briefcase,
  ChartBar,
  Download,
  Eye,
  NotebookText,
  Power,
  User,
} from 'lucide-react'
import useLogout from '../../../components/hooks/userLogout'
import { decodeJWT } from '../../../lib/auth'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { verifyKYCStatus } from '../../../store/slices/index'

function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [decodedToken, setDecodedToken] = useState<any>(null) // To store decoded token data

  const router = useRouter()
  const { handleLogout } = useLogout()

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(verifyKYCStatus())
  }, [dispatch])

  const { kycVerified } = useAppSelector((state) => state.auth)
  const { user } = useAppSelector((state) => state.auth)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decoded = decodeJWT(token)
        setDecodedToken(decoded)

        if (decoded?.userName) {
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error('Error decoding the token:', error)
        setIsAuthenticated(false)
      }
    } else {
      setIsAuthenticated(false)
    }
  }, [user])
  const pathname = usePathname()
  const isKaitWalletActive = pathname.startsWith('/user/kaitwallet')
  const isStakingActive = pathname.startsWith('/user/stakingcontracts')
  const isvoucher = pathname.startsWith('/user/voucher')
  const isTransfer = pathname.startsWith('/user/transfers')
  return (
    <div className="bg-white box-border shadow-xl">
      {/* bg-gradient-to-r from-pink-700 to-gray-800 */}
      <nav className=" bg-gradient-to-r from-blue-500 to-purple-700 ">
        <div className=" container m-auto flex h-14 justify-between items-center px-4 md:px-20">
          <Image
            className=" w-[45px] h-[45px] border-[white] border-4 rounded-[60px] items-center flex "
            src={Logo}
            alt="Logo"
          />
          <div className=" flex justify-center items-center font-bold text-white">
            <h2>KAIT Staking - User Panel</h2>
          </div>
          <div className="flex items-center text-gray-100">
            <div className=" items-center flex  ">
              {decodedToken?.name ? `Hello! / ${decodedToken.name}` : '/user'}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="p-0 w-11 h-11">
                    <LuCircleUserRound
                      style={{ width: '32px', height: '32px' }}
                    />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-40 mr-20 bg-white">
                  <DropdownMenuLabel>
                    {decodedToken?.name
                      ? `Welcome, ${decodedToken.name}`
                      : '/user'}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className=" bg-black" />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Link
                        href="/user/profile"
                        className="gap-1 flex  w-full items-center border-b border-gray-100 font-semibold text-purple-800 hover:text-purple-700 md:mx-2"
                      >
                        <User />
                        My Profile
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Link
                        href=""
                        className=" gap-1 flex  w-full items-center  border-b border-gray-100 font-semibold text-purple-800 hover:text-purple-700 md:mx-2"
                      >
                        <Eye /> Activity
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  {/* <DropdownMenuSeparator className=" bg-black" /> */}
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Link
                        href="/auth/signin"
                        onClick={handleLogout}
                        className="gap-1 flex  w-full items-center border-b border-gray-100 font-semibold text-purple-800 hover:text-purple-700 md:mx-2"
                      >
                        <Power /> Logout
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-white"
          >
            {!isOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6 transition-all duration-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6 transition-all duration-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </button>
        </div>
      </nav>

      <nav
        className={`flex flex-col lg:flex-row md:flex-col sm:flex-col container m-auto justify-center items-center
           gap-6  bg-transparent   ${
             isOpen ? 'block' : 'hidden'
           } lg:flex transition-all duration-300`}
      >
        <Link
          href="/user/dashboard"
          className={`flex justify-center text-[14px] items-center py-[12px] gap-[5px] text-purple-800 ${
            pathname === '/user/dashboard'
              ? 'border-b-2 border-purple-800 font-semibold'
              : ''
          }`}
        >
          <MdOutlineDashboard className=" text-[14px]" /> Dashboard
        </Link>

        <div className="flex">
          <div className="group relative cursor-pointer">
            <div
              className={`flex items-center justify-center py-[12px] text-purple-800 ${
                isKaitWalletActive
                  ? 'border-b-2 border-purple-800 font-semibold'
                  : ''
              }`}
            >
              <Link
                href="#"
                className="menu-hover text-[14px] font-medium flex items-center justify-center gap-[5px]"
              >
                <RiWallet3Line className="text-[14px]" /> KAIT Wallet
              </Link>
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-6 w-6 m-0"
                >
                  <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </span>
            </div>

            <div className="invisible absolute z-50 text-[14px] flex w-max h-auto flex-col bg-gray-100 py-1 px-4 text-purple-800 shadow-xl group-hover:visible">
              <Link
                href="/user/kaitwallet/summary "
                className="my-2 flex border-b items-center border-gray-100  text-purple-800 hover:text-purple-700 md:mx-2"
              >
                <NotebookText className="w-[14px] mr-[2px]" />
                Summary
              </Link>
            </div>
          </div>
        </div>

        <div className="flex">
          <div className="group relative cursor-pointer">
            <div
              className={`flex items-center justify-center py-[12px] text-purple-800 ${
                isStakingActive
                  ? 'border-b-2 border-purple-800 font-semibold'
                  : ''
              }`}
            >
              <Link
                href="#"
                className="menu-hover text-[14px] font-medium text-purple-800 flex items-center justify-center  gap-[5px]"
              >
                <GrShareOption className=" text-[14px]" /> Staking Contracts
              </Link>
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-6 w-6 m-0"
                >
                  <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </span>
            </div>

            <div className="invisible text-[14px] absolute z-50 flex w-max h-auto flex-col bg-gray-100 py-1 px-4 text-purple-800 shadow-xl group-hover:visible">
              <Link
                href="/user/stakingcontracts/newStaking"
                className="my-2 flex border-b border-gray-100 items-center text-purple-800 hover:text-purple-700 md:mx-2"
              >
                <ArrowUpFromLine className=" mr-2 w-[15px]" />
                New Staking
              </Link>
              <Link
                href="/user/stakingcontracts/yourstakingcontracts"
                className="my-2 flex border-b border-gray-100 items-center text-purple-800 hover:text-purple-700 md:mx-2"
              >
                <ArrowUpFromLine className=" mr-2 w-[15px]" /> Your Staking
                Contracts
              </Link>
              <Link
                href="/user/stakingcontracts/walletSummary"
                className="my-2 flex border-b border-gray-100 items-center text-purple-800 hover:text-purple-700 md:mx-2"
              >
                <ChartBar className=" mr-2 w-[15px]" />
                Wallet Summary
              </Link>
              {/* <Link
                href="/user/stakingcontracts/roswalletsummary"
                className="my-2 flex border-b border-gray-100 items-center text-purple-800 hover:text-purple-700 md:mx-2"
              >
                <ChartBar className=" mr-2 w-[15px]" />
                ROS Wallet Summary
              </Link>

              <Link
                href="/user/stakingcontracts/incomewalletsummary"
                className="my-2 flex border-b border-gray-100 items-center text-purple-800 hover:text-purple-700 md:mx-2"
              >
                <ChartBar className=" mr-2 w-[15px]" />
                Income Wallet Summary
              </Link>
              <Link
                href="/user/stakingcontracts/adhocwalletsummary"
                className="my-2 flex border-b border-gray-100 items-center text-purple-800 hover:text-purple-700 md:mx-2"
              >
                <ChartBar className=" mr-2 w-[15px]" />
                Adhoc Wallet Summary
              </Link>
              <Link
                href="/user/stakingcontracts/bonuswalletsummary"
                className="my-2 flex border-b border-gray-100 items-center text-purple-800 hover:text-purple-700 md:mx-2"
              >
                <ChartBar className=" mr-2 w-[15px]" />
                Bonus Wallet Summary
              </Link>
              <Link
                href="/user/stakingcontracts/restakewalletSummary"
                className="my-2 flex border-b border-gray-100 items-center text-purple-800 hover:text-purple-700 md:mx-2"
              >
                <ChartBar className=" mr-2 w-[15px]" />
                Restake Wallet Summary
              </Link> */}
              {/* <Link
                href="/user/stakingcontracts/incomewithdrawal"
                className="my-2 block border-b border-gray-100  text-purple-800 hover:text-purple-700 md:mx-2"
              >
                Income-Widthrawal
              </Link> */}
              <Link
                href="/user/stakingcontracts/roswithdrawal"
                className="my-2 flex border-b border-gray-100 items-center text-purple-800 hover:text-purple-700 md:mx-2"
              >
                <Download className=" mr-2 w-[15px]" />
                ROS - Widthrawal
              </Link>
              <Link
                href="/user/stakingcontracts/fiatwithdrawal"
                className="my-2 flex border-b border-gray-100 items-center text-purple-800 hover:text-purple-700 md:mx-2"
              >
                <Download className=" mr-2 w-[15px]" />
                Fiat - Widthrawal
              </Link>
            </div>
          </div>
        </div>

        <Link
          href="/user/teamsummary"
          className={`flex justify-center text-[14px] items-center py-[12px] gap-[5px] text-purple-800 ${
            pathname === '/user/teamsummary'
              ? 'border-b-2 border-purple-800 font-semibold'
              : ''
          }`}
        >
          <FaUsers className=" text-[14px]" /> Team Summary
        </Link>

        <div className="flex">
          <div className="group relative cursor-pointer">
            <div
              className={`flex items-center justify-center py-[12px] text-purple-800 ${
                isvoucher ? 'border-b-2 border-purple-800 font-semibold' : ''
              }`}
            >
              <Link
                href="#"
                className="menu-hover text-[14px] font-medium text-purple-800 flex items-center justify-center  gap-[5px]"
              >
                <PiHandbagFill className=" text-[14px]" />
                Voucher
              </Link>
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-6 w-6 m-0"
                >
                  <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </span>
            </div>

            <div className="invisible text-[14px] absolute z-50 flex w-max h-auto flex-col bg-gray-100 py-1 px-4 text-purple-800 shadow-xl group-hover:visible">
              <Link
                href="/user/voucher/generate-receipt"
                className="my-2 flex items-center border-b border-gray-100  text-purple-800 hover:text-purple-700 md:mx-2"
              >
                <Briefcase className=" mr-2 w-[15px]" /> Generate Recepit
              </Link>
              <Link
                href="/user/voucher/voucher-wallet-summary"
                className="my-2 flex items-center border-b border-gray-100  text-purple-800 hover:text-purple-700 md:mx-2"
              >
                <ChartBar className=" mr-2 w-[15px]" />
                Voucher Wallet Summary
              </Link>
              <Link
                href="/user/voucher/receipt-summary"
                className="my-2 flex items-center border-b border-gray-100  text-purple-800 hover:text-purple-700 md:mx-2"
              >
                <ChartBar className=" mr-2 w-[15px]" />
                Receipt Usage
              </Link>
            </div>
          </div>
        </div>

        <div className="flex">
          <div className="group relative cursor-pointer">
            <div
              className={`flex items-center justify-center py-[12px] text-purple-800 ${
                isTransfer ? 'border-b-2 border-purple-800 font-semibold' : ''
              }`}
            >
              <Link
                href="#"
                className="menu-hover text-[14px] font-medium text-purple-800 flex items-center justify-center  gap-[5px]"
              >
                <TbTransfer className=" text-[14px]" /> Transfers
              </Link>
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-6 w-6 m-0"
                >
                  <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </span>
            </div>

            <div className="invisible absolute z-50 text-[14px] flex w-max h-auto flex-col bg-gray-100 py-1 px-4 text-purple-800 shadow-xl group-hover:visible">
              <Link
                href="/user/transfers/kait-wallet-transfer  "
                className="my-2 flex items-center border-b border-gray-100  text-purple-800 hover:text-purple-700 md:mx-2"
              >
                <Image
                  className=" w-[15px] h-[15px]  items-center flex  mr-2"
                  src={Logo}
                  alt="Logo"
                />
                Kait Wallet Transfer
              </Link>
              <Link
                href="/user/transfers/mature-wallet-transfer  "
                className="my-2 flex items-center border-b border-gray-100  text-purple-800 hover:text-purple-700 md:mx-2"
              >
                <ArrowLeftRight className=" mr-2 w-[15px]" /> Mature Wallet
                Transfer
              </Link>
              <Link
                href="/user/transfers/income-wallet-transfer"
                className="my-2 flex items-center border-b border-gray-100 text-purple-800 hover:text-purple-700 md:mx-2"
              >
                <Briefcase className=" mr-2 w-[15px]" /> Income Wallet Transfer
              </Link>
              <Link
                href="/user/transfers/restake-wallet-transfer"
                className="my-2 flex items-center border-b border-gray-100  text-purple-800 hover:text-purple-700 md:mx-2"
              >
                <ArrowLeftRight className=" mr-2 w-[15px]" />
                Restake Wallet Transfer
              </Link>
              <Link
                href="/user/transfers/ros-wallet-transfer"
                className="my-2 flex items-center border-b border-gray-100  text-purple-800 hover:text-purple-700 md:mx-2"
              >
                <ArrowLeftRight className=" mr-2 w-[15px]" /> ROS Wallet
                Transfer
              </Link>
              <Link
                href="/user/transfers/adhoc-wallet-transfer"
                className="my-2 flex items-center border-b border-gray-100  text-purple-800 hover:text-purple-700 md:mx-2"
              >
                <Briefcase className=" mr-2 w-[15px]" /> Adhoc Wallet Transfer
              </Link>
              <Link
                href=" /user/transfers/super-wallet-transfer"
                className="my-2 flex items-center border-b border-gray-100  text-purple-800 hover:text-purple-700 md:mx-2"
              >
                <Briefcase className=" mr-2 w-[15px]" /> Super Wallet Transfer
              </Link>
            </div>
          </div>
        </div>

        <Link
          href="/user/profile"
          className={`flex justify-center text-[14px] items-center py-[12px] gap-[5px] text-purple-800 ${
            pathname === '/user/profile'
              ? 'border-b-2 border-purple-800 font-semibold'
              : ''
          }`}
        >
          <PiUserListBold className=" text-[14px]" /> Profile
        </Link>

        <div className="flex items-center">
          {kycVerified === null ? (
            <p className="text-[12px] ml-3 text-gray-400">Checking KYC...</p>
          ) : !kycVerified ? (
            <Link href="/user/kyc">
              <p className="text-[12px] font-normal flex justify-center items-center border-2 bg-blue-200 p-0.5 ml-3">
                Submit KYC
              </p>
            </Link>
          ) : (
            <span className="text-[12px] font-normal flex justify-center items-center border-2 p-0.5 ml-3 text-green-500 ">
              KYC Approved
            </span>
          )}
        </div>
      </nav>
    </div>
  )
}

export default Navigation

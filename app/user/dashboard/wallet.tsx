import { useState } from 'react'
import { FaEllipsisH, FaTimes } from 'react-icons/fa'
import Logo from '../../../assets/logo2x.png'
import Image from 'next/image'

type WalletData = {
  title: string
  amount: string
  list: string[] | string
  isOpen: boolean
  onToggle: () => void
}

const WalletCard = ({ title, amount, list, isOpen, onToggle }: WalletData) => {
  const dropdownItems = Array.isArray(list) ? list : [list]

  return (
    <div className="relative w-[140px] mx-auto h-[100px] mt-[70px]">
      <div className="absolute -top-8 left-0 w-full h-[110px] justify-center bg-white shadow-lg rounded-b-xl flex items-end p-2 z-10">
        <p className="text-sm font-medium text-black ">{title}</p>
      </div>

      <div className="bg-gradient-to-r from-pink-700 to-gray-800 z-10 mt-[-52px] gap-10 left-[-19px] w-[140px] h-[100px]  text-white rounded-b-2xl rounded-tl-2xl shadow-xl  justify-center items-center flex px-4 relative">
        <div
          className="absolute top-0 right-0 w-5 h-5 mr-[-19px]"
          style={{
            background:
              'linear-gradient(to top right, #AD111C 49%, transparent 53%)',
          }}
        ></div>

        <div className="flex flex-col items-center space-y-2">
          <span className="text-2xl flex font-bold items-center text-[20px] gap-1">
            <Image alt="" src={Logo} className="h-[20px] w-[20px]" />
            {amount}
          </span>

          <div className="relative">
            <button onClick={onToggle}>
              {isOpen ? <FaTimes /> : <FaEllipsisH />}
            </button>

            {isOpen && (
              <div className="absolute bottom-[110%] left-1/2 -translate-x-1/2 w-44 bg-white text-gray-800 shadow-xl rounded-md z-[999] border border-gray-300">
                {dropdownItems.map((item, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className="block px-4 py-2 text-sm hover:bg-gray-200"
                    onClick={onToggle}
                  >
                    {item}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const Wallets = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const data: Omit<WalletData, 'isOpen' | 'onToggle'>[] = [
    { title: 'KAIT Wallet', amount: '10.0', list: 'View Wallet' },
    {
      title: 'Total Staking',
      amount: '10,000',
      list: ['New Staking', 'All Staking'],
    },
    { title: 'Regular - ROS', amount: '0', list: ['Summary', 'Re-Stake'] },
    { title: 'Fixed - ROS', amount: '3,600', list: 'Summary' },
    { title: 'Total Earnings', amount: '8,000', list: 'Summary' },
    { title: 'Adhoc Wallet', amount: '0', list: 'Summary' },
    { title: 'Voucher', amount: '400', list: 'Summary' },
    { title: 'Income Wallet', amount: '6,800', list: 'Summary' },
    { title: 'Withdrawal', amount: '0', list: 'Summary' },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 mb-[20px] p-5 justify-items-center">
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
        />
      ))}
    </div>
  )
}

export default Wallets

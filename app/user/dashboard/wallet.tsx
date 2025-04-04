import { useState } from "react";
import { FaEllipsisH, FaTimes } from "react-icons/fa";


type Props = {
    title: string;
    amount: string;
  };
  
const WalletCard = ({ title, amount }: Props) => {
  const [isOpen, setIsOpen] = useState(false);


  return (
    <div className="relative group w-full mt-5  ">
      <div className="bg-white text-black mb-0 absolute  shadow-lg p-5 w-[140px] h-[110px] gap-5 ">
        <p className="text-sm mt-[62px]">{title}</p>
      </div>
      <div className="bg-gradient-to-r from-pink-700 to-gray-800 text-white  mt-[-20px] relative rounded-b-2xl rounded-tl-2xl left-[-10px] shadow-lg p-5 h-[100px] w-[120px] ">
        <div
          className="absolute top-0 right-[-20] h-5 w-5"
          style={{
            background:
              "linear-gradient(to top right, #AD111C 49%, transparent 53%)",
          }}
        ></div>
        <div className=" justify-between items-center text-center">
          <span className="text-2xl font-bold">{amount}</span>
          <br />
          <button className="text-white" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FaTimes /> : <FaEllipsisH />}
          </button>
          <div
            onClick={() => setIsOpen(!isOpen)}
            className={`absolute top-full left-0 bg-white text-gray-800 shadow-md rounded-md mt-1 p-2 w-40 ${
              isOpen ? "block" : "hidden"
            } group-hover:block`}
          >
            <a
              href="#"
              className="block px-3 py-2 text-sm hover:bg-gray-200 rounded-md"
            >
              Summary
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
// Wallets Component
const Wallets = () => {
  const data = [
    { title: "KAIT Wallet", amount: " 10.0" },
    { title: "Total Staking", amount: " 10,000" },
    { title: "Regular - ROS", amount: "0" },
    { title: "Fixed - ROS", amount: "3,600" },
    { title: "Total Earnings", amount: "8,000" },
    { title: "Adhoc Wallet", amount: "0" },
    { title: "Voucher", amount: "400" },
    { title: "Income Wallet", amount: "6,800" },
    { title: "Withdrawal", amount: "0" },
  ];

  return (
    <div className="grid lg:grid-cols-4  md:grid-cols-3 grid-cols-1 gap-15 p-5">
      {data.map((wallet, index) => (
        <WalletCard key={index} title={wallet.title} amount={wallet.amount} />
      ))}
    </div>
  );
};

export default Wallets;
"use client";
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { useState } from "react";
import { FaEllipsisH, FaTimes } from "react-icons/fa";
import Bg1 from "../../../assets/new_s1.jpg";
import Bg2 from "../../../assets/new_s2.jpg";
import Bg3 from "../../../assets/new_s3.jpg";
import Bg4 from "../../../assets/new_s4.jpg";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import ReferralComponent from "@/app/user/components/referralComponent";
import { ClipboardCopy } from "lucide-react";

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
            className={`absolute top-full left-0 bg-white text-gray-800 shadow-md rounded-md mt-1 p-2 w-40 ${isOpen ? "block" : "hidden"} group-hover:block`}
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

function UserDashboard() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  const BgImage = [{ img: Bg1 }, { img: Bg2 }, { img: Bg3 }, { img: Bg4 }];

  return (
    <div className="pt-5 bg-[#F3EAD8] hover:bg-blue-50 transition-colors duration-2000">
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
                            style={{ objectFit: "cover" }}
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
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle className=" text-center">KYC Status</CardTitle>
              <CardDescription>Your Referral Link</CardDescription>
            </CardHeader>
            <CardContent>
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
        <div className="col-span-2 flex justify-center items-center">
          <Wallets />
        </div>

        <div className="flex justify-center lg:justify-center items-center mt-6 lg:mt-0 h-[100%]">
          <Card className="w-[350px] h-[100%] ">
            <CardHeader>
              <CardTitle>KYC Status</CardTitle>
              <CardDescription>Your Referral Link</CardDescription>
            </CardHeader>
            <CardContent>
              <Card className="h-[30px] flex justify-center items-center">
                Name
              </Card>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;

"use client";

import React, { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../../store/slices/store";
import { verifyKYCStatus } from "../../../store/slices/index";
import { BadgeCheck, CheckCheck, ChevronsRight } from "lucide-react";
import ReferralComponent from "@/app/user/components/referralComponent";
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
import Bg1 from "../../../assets/new_s1.jpg";
import Bg2 from "../../../assets/new_s2.jpg";
import Bg3 from "../../../assets/new_s3.jpg";
import Bg4 from "../../../assets/new_s4.jpg";
import Wallets from "./wallet";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function UserDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));
  const BgImage = [{ img: Bg1 }, { img: Bg2 }, { img: Bg3 }, { img: Bg4 }];

  React.useEffect(() => {
    dispatch(verifyKYCStatus());
  }, [dispatch]);

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
              <CardTitle className="text-center flex justify-evenly">
                <p className="flex justify-center items-center">
                  KYC Status <ChevronsRight />
                </p>{" "}
                <div className="flex justify-center items-center">
                  <span
                    className={`flex items-center text-[12px] ${
                      user?.kycVerified ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {user?.kycVerified ? (
                      <>
                        <CheckCheck /> Verified
                      </>
                    ) : (
                      "Not Verified"
                    )}
                  </span>
                  {!user?.kycVerified && (
                    <Link href="/user/kyc">
                      <p className=" text-[12px] font-normal flex justify-center item-center border-2 bg-blue-200 p-0.5 ml-3">
                        Submit KYC
                      </p>
                    </Link>
                  )}
                </div>
              </CardTitle>
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
          <Card className="w-[350px] h-[100%]">
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

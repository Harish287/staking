import { Button } from '@/components/ui/button'
import React from 'react'
 
const Dashboard = () => {
  return (
    <div className="bg-[#eef2f8] min-h-screen p-6">
      <div className="grid grid-cols-3 grid-rows-5 gap-5 container mx-auto mt-5">
        
        <div className="bg-white w-full  m-auto h-[150px] shadow-lg rounded-xl p-4">
          <h3 className="text-lg font-semibold">Total Contracts</h3>
          <p className="text-xl font-bold text-gray-700">304,452,912</p>
          <Button className="mt-2 text-blue-500 cursor-pointer p-0">View</Button>
        </div>

        <div className="bg-white m-auto w-full h-[150px] shadow-lg rounded-xl p-4 ">
        <h3 className="text-lg font-semibold">Total Contracts</h3>
          <p className="text-xl font-bold text-gray-700">304,452,912</p>
          <Button className="mt-2  text-blue-500 cursor-pointer p-0">View</Button>
        </div>

        <div className="bg-white m-auto w-full h-[150px] shadow-lg rounded-xl p-4">
        <h3 className="text-lg font-semibold">Total Contracts</h3>
          <p className="text-xl font-bold text-gray-700">304,452,912</p>
          <Button className="mt-2  text-blue-500 cursor-pointer p-0">View</Button>
        </div>

        <div className="bg-white m-auto w-full h-[150px] shadow-lg rounded-xl p-4 ">
          <p>4</p>
        </div>

        <div className="col-span-2 bg-white h-[150px] shadow-lg rounded-xl p-4 ">
          <p>5</p>
        </div>

        <div className=" col-span-2  row-start-3 bg-white h-[150px] shadow-lg rounded-xl p-4 ">
          <p>6</p>
        </div>

        <div className=" col-start-3 row-start-3 bg-white h-[150px] shadow-lg rounded-xl p-4 ">
          <p>7</p>
        </div>

      </div>
    </div>
  )
}

export default Dashboard

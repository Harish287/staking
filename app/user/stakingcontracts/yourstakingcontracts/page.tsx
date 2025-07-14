'use client'

import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchStakeBalance } from '@/store/slices/user/stakeBalanceSlice'
import { fetchStakeList } from '@/store/slices/user/stakeListSlice'
import Image from 'next/image'
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Pagination,
} from '@mui/material'
import image from '../../../../assets/contract1.jpg'
import Logo from '../../../../assets/logo2x.png'
import { Share } from 'lucide-react'

const YourStakingContracts = () => {
  const dispatch = useAppDispatch()
  const [page, setPage] = useState(1)

  const {
    data: stakeBalanceData,
    loading: balanceLoading,
    error: balanceError,
  } = useAppSelector((state) => state.stakeBalance)

  const {
    data: stakeListData,
    loading: listLoading,
    error: listError,
  } = useAppSelector((state) => state.stakeList)

  useEffect(() => {
    dispatch(fetchStakeBalance())
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchStakeList({ page, page_size: 10 }))
  }, [dispatch, page])

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="bg-[#F3EAD8] p-5 md:p-10">
      <div className="bg-white rounded-xl shadow-md p-5 md:p-8">
        <h1 className="flex text-2xl font-bold items-center gap-2 mb-6 text-gray-800">
          <Share size={24} /> Your Staking Contracts
        </h1>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <Image
              src={image}
              alt="Staking Contract"
              width={400}
              height={400}
              className="rounded-lg shadow"
            />
          </div>

          <div className="flex-1">
            <Box mb={5}>
              {balanceLoading ? (
                <CircularProgress />
              ) : balanceError ? (
                <Typography color="error">{balanceError}</Typography>
              ) : stakeBalanceData ? (
                <div className="flex flex-wrap justify-evenly">
                  <div className="bg-red-500 text-white px-4 py-2 rounded-xl flex items-center gap-2">
                    Total Stake:
                    <Image src={Logo} alt="Logo" width={20} height={20} />
                    {stakeBalanceData.total_stake.toLocaleString()}
                  </div>
                  <div className="bg-red-500 text-white px-4 py-2 rounded-xl flex items-center gap-2">
                    Total ROS:
                    <Image src={Logo} alt="Logo" width={20} height={20} />
                    {stakeBalanceData.total_ros.toLocaleString()}
                  </div>
                </div>
              ) : null}
            </Box>

            <Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Stake List
              </Typography>

              {listLoading ? (
                <CircularProgress sx={{ mt: 2 }} />
              ) : listError ? (
                <Typography color="error" sx={{ mt: 2 }}>
                  {listError}
                </Typography>
              ) : !stakeListData?.items?.length ? (
                <Typography sx={{ mt: 2 }} color="text.secondary">
                  No staking contracts found.
                </Typography>
              ) : (
                <>
                  <Box className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {stakeListData.items.map((item) => (
                      <Paper
                        key={item.contract}
                        className="p-4 shadow rounded-lg relative overflow-hidden"
                      >
                        <div
                          className={`absolute top-2 right-[-40px] w-[120px] text-center rotate-45 text-xs font-bold py-1 shadow-md ${
                            item.status
                              ? 'bg-green-500 text-white'
                              : 'bg-yellow-400 text-white'
                          }`}
                        >
                          {item.status ? 'Completed' : 'Active'}
                        </div>

                        <div className="text-center">
                          <Typography
                            fontWeight="bold"
                            fontSize="15px"
                            className="inline-block bg-red-500 px-2 py-1 rounded text-white"
                          >
                            {item.contract}
                          </Typography>
                        </div>

                        <div className="space-y-1 mt-4 text-center text-sm text-gray-700">
                          <div className="flex justify-center items-center gap-1">
                            <Typography style={{ fontSize:"12px"}} fontWeight="bold">
                              Invested:
                            </Typography>
                            <Image
                              src={Logo}
                              alt="Logo"
                              width={12}
                              height={12}
                            />
                            <Typography style={{ fontSize:"12px"}} fontWeight="bold">
                              {item.invested.toLocaleString()}
                            </Typography>
                          </div>
                          <div>
                            <Typography style={{ fontSize:"12px"}}>{item.plan}</Typography>
                          </div>
                          <div>
                            <Typography style={{ fontSize:"12px"}}>{item.description}</Typography>
                          </div>
                          <div>
                            <Typography style={{ fontSize:"12px"}} fontWeight="medium">
                              Invested On: {item.invested_on}
                            </Typography>
                          </div>
                          <div>
                            <Typography style={{ fontSize:"12px", fontWeight:"bold"}}>Completed: {item.completed} Days</Typography>
                          </div>
                          <div>
                            <Typography style={{ fontSize:"12px"}}>Remaining: {item.remaining}</Typography>
                          </div>
                          <div className="flex justify-center items-center gap-1">
                            <Typography style={{ fontSize:"12px", fontWeight:'bold'}}>ROS Earned:</Typography>
                            <Image
                              src={Logo}
                              alt="Logo"
                              width={12}
                              height={12}
                            />
                            <Typography>{item.ros_earned}</Typography>
                          </div>
                        </div>
                      </Paper>
                    ))}
                  </Box>

                  {stakeListData?.total_pages && (
                    <Box mt={4}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        flexWrap="wrap"
                        mb={2}
                      >
                        <Typography variant="body2" color="textSecondary">
                          Page {page} of {stakeListData.total_pages}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Total: {stakeListData.total}
                        </Typography>
                      </Box>

                      <Box display="flex" justifyContent="center">
                        <Pagination
                          count={stakeListData.total_pages}
                          page={page}
                          onChange={handlePageChange}
                          color="primary"
                          shape="rounded"
                          siblingCount={1}
                          boundaryCount={1}
                          showFirstButton
                          showLastButton
                        />
                      </Box>
                    </Box>
                  )}
                </>
              )}
            </Box>
          </div>
        </div>
      </div>
    </div>
  )
}

export default YourStakingContracts

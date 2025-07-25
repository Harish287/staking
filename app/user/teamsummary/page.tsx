'use client'

import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  fetchUserData,
  TeamMember,
} from '@/store/slices/user/userTreeDataReducer'
import TeamTreeMUI from './teamTree'
import { CircularProgress, Box, Typography } from '@mui/material'
import Groups2Icon from '@mui/icons-material/Groups2'
import Kait from '../../../assets/logo2x.png'
import Image from 'next/image'

export default function TeamPage() {
  const dispatch = useAppDispatch()
  const { data, loading, error } = useAppSelector((state) => state.UserTree)

  useEffect(() => {
    dispatch(fetchUserData())
  }, [dispatch])

  const hasTeamData = !!data?.team_tree?.length

  const calculateTotalTeamStake = (
    team: TeamMember[] | null | undefined,
  ): number => {
    if (!team || !Array.isArray(team)) return 0

    return team.reduce((sum, member) => {
      const childrenStake = member.children?.length
        ? calculateTotalTeamStake(member.children)
        : 0
      return sum + (member.team_staking || 0) + childrenStake
    }, 0)
  }

  const totalTeamStake =
    hasTeamData && data ? calculateTotalTeamStake(data.team_tree) : 0

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Referral Tree - {data?.full_name ?? 'User'}
      </Typography>

      <div className=" flex items-center  bg-gradient-to-r from-blue-500 to-purple-700 p-2 text-white">
        <Groups2Icon
          className=" ml-2"
          style={{ width: '40px', height: '40px' }}
        />
        {hasTeamData && (
          <h2 className=" ml-5">
            Total Team Staking Contracts <br />{' '}
            <span className=" flex items-center">
              {' '}
              <Image
                className=""
                src={Kait}
                alt="Kait Coin"
                width={20}
                height={20}
              />
              {totalTeamStake.toLocaleString()}
            </span>
          </h2>
        )}
      </div>
      {loading && <CircularProgress sx={{ mt: 3 }} />}

      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {!loading && !error && hasTeamData && data && (
        <Box mt={2}>
          <TeamTreeMUI team={data?.team_tree ?? []} />
        </Box>
      )}

      {!loading && !error && !hasTeamData && (
        <Typography variant="body2" sx={{ mt: 2 }}>
          No team data found.
        </Typography>
      )}
    </Box>
  )
}

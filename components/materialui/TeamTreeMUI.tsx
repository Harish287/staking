import * as React from 'react'
import IndeterminateCheckBoxRoundedIcon from '@mui/icons-material/IndeterminateCheckBoxRounded'
import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded'
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded'
import { styled, alpha } from '@mui/material/styles'
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView'
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem'
import { User } from 'lucide-react'
import { Tooltip } from '@mui/material'
import { EmojiEvents } from '@mui/icons-material'
import DiamondIcon from '@mui/icons-material/Diamond'
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech'
import GradeIcon from '@mui/icons-material/Grade'
interface TeamMember {
  name: string
  user_name: string
  email: string
  club: string
  level: number
  total_staking: number
  team_staking: number
  children: TeamMember[]
}

interface TeamTreeMUIProps {
  team: TeamMember[]
}

const CustomTreeItem = styled(TreeItem)(({ theme }) => ({
  position: 'relative',
  [`& .${treeItemClasses.content}`]: {
    padding: theme.spacing(0.5, 1),
    margin: theme.spacing(0.2, 0),
    position: 'relative',
  },
  [`& .${treeItemClasses.groupTransition}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
    position: 'relative',
  },
  [`& .${treeItemClasses.content}::before`]: {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: -18,
    width: 18,
    height: 1,
    backgroundColor: alpha(theme.palette.text.primary, 0.4),
  },
}))

function ExpandIcon(props: React.PropsWithoutRef<typeof AddBoxRoundedIcon>) {
  return <AddBoxRoundedIcon {...props} sx={{ opacity: 0.8 }} />
}

function CollapseIcon(
  props: React.PropsWithoutRef<typeof IndeterminateCheckBoxRoundedIcon>,
) {
  return <IndeterminateCheckBoxRoundedIcon {...props} sx={{ opacity: 0.8 }} />
}

function EndIcon(
  props: React.PropsWithoutRef<typeof DisabledByDefaultRoundedIcon>,
) {
  return <DisabledByDefaultRoundedIcon {...props} sx={{ opacity: 0.3 }} />
}

const renderTree = (member: TeamMember, idPrefix = '0'): React.ReactNode => {
  const label = (
    <span className="gap-1 flex items-center text-[12px]">
      {member.club === 'Basic' ? (
        <User className="w-4 h-4" />
      ) : member.club === 'Bronze' ? (
        <MilitaryTechIcon
          sx={{ width: 30, height: 30 }}
          className="text-amber-700"
        />
      ) : member.club === 'Silver' ? (
        <MilitaryTechIcon
          sx={{ width: 30, height: 30 }}
          className="text-gray-500"
        />
      ) : member.club === 'Gold' ? (
        <MilitaryTechIcon
          sx={{ width: 30, height: 30 }}
          className="text-yellow-500"
        />
      ) : member.club === 'Platinum' ? (
        <GradeIcon sx={{ width: 30, height: 30 }} className="text-gray-400" />
      ) : member.club === 'Diamond' ? (
        <DiamondIcon
          sx={{ width: 30, height: 30 }}
          className="text-amber-700"
        />
      ) : member.club === 'Double Diamond' ? (
        <DiamondIcon sx={{ width: 30, height: 30 }} className="text-gray-500" />
      ) : member.club === 'Triple Diamond' ? (
        <DiamondIcon
          sx={{ width: 30, height: 30 }}
          className="text-yellow-500"
        />
      ) : member.club === 'Kait King' ? (
        <EmojiEvents
          sx={{ width: 30, height: 30 }}
          className="text-yellow-600"
        />
      ) : (
        <User className="w-4 h-4" />
      )}

      {member.level !== 0 && <div>Level: L{member.level}</div>}
      {/* {member.club && (
        <div className="bg-red-400 p-0.5 rounded-[5px]">{member.club}</div>
      )} */}

      <Tooltip
        title={
          <div className="text-xs p-1">
            {member.level !== 0 && <div>Level: L{member.level}</div>}
            {member.club && <div>Club: {member.club}</div>}
            <div>Name: {member.name}</div>
            <div>Email: {member.email}</div>
            <div>Total Staking: {member.total_staking}</div>
            <div>Team Staking: {member.team_staking}</div>
          </div>
        }
        placement="bottom"
        arrow
      >
        <span className="cursor-pointer text-blue-600">
          [Id:{member.user_name}]
        </span>
      </Tooltip>
    </span>
  )

  const nodeId = `${idPrefix}-${member.user_name}`

  return (
    <CustomTreeItem key={nodeId} itemId={nodeId} label={label}>
      {member.children?.map((child, idx) =>
        renderTree(child, `${nodeId}-${idx}`),
      )}
    </CustomTreeItem>
  )
}

export default function TeamTreeMUI({ team }: TeamTreeMUIProps) {
  return (
    <SimpleTreeView
      aria-label="Team Tree"
      defaultExpandedItems={['0']}
      slots={{
        expandIcon: ExpandIcon,
        collapseIcon: CollapseIcon,
        endIcon: EndIcon,
      }}
      sx={{
        overflowX: 'auto',
        minHeight: 270,
        flexGrow: 1,
        width: '100%',
      }}
    >
      {team.map((member, index) => renderTree(member, `${index}`))}
    </SimpleTreeView>
  )
}

// components/TeamTreeMUI.tsx
import * as React from 'react'
import IndeterminateCheckBoxRoundedIcon from '@mui/icons-material/IndeterminateCheckBoxRounded'
import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded'
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded'
import { styled, alpha } from '@mui/material/styles'
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView'
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem'
import { User } from 'lucide-react'

interface TeamMember {
  name: string
  username: string
  email: string
  club: string
  level: number
  total: number
  team: number
  children: TeamMember[]
}

interface TeamTreeMUIProps {
  team: TeamMember[]
}

const CustomTreeItem = styled(TreeItem)(({ theme }) => ({
  [`& .${treeItemClasses.content}`]: {
    padding: theme.spacing(0.5, 1),
    margin: theme.spacing(0.2, 0),
  },
  [`& .${treeItemClasses.iconContainer}`]: {
    '& .close': {
      opacity: 0.3,
    },
  },
  [`& .${treeItemClasses.groupTransition}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
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
    <span className=" gap-1 flex items-center text-[12px]">
      <span className="">
        <User />
      </span>
      {member.level !== 0 && `L${member.level}`}
      <span
        className={
          member.club ? ' rounded-[5px] text-white bg-red-400 p-0.5' : ''
        }
      >
        {member.club || ''}
      </span>
      <span>{member.name}</span>
      [Id:{member.username}]
      {member.level === 1 && <span>Email: {member.email} |</span>}
      <span>Staking:{member.total}</span>|
      <span> Team Staking:{member.team}</span>
    </span>
  )
  const nodeId = `${idPrefix}-${member.username}`

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

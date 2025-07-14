'use client'

import * as React from 'react'
import IndeterminateCheckBoxRoundedIcon from '@mui/icons-material/IndeterminateCheckBoxRounded'
import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded'
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded'
import { styled, alpha } from '@mui/material/styles'
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView'
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem'
import { User } from 'lucide-react'
import { Tooltip, TextField } from '@mui/material'
import { EmojiEvents } from '@mui/icons-material'
import DiamondIcon from '@mui/icons-material/Diamond'
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech'
import GradeIcon from '@mui/icons-material/Grade'

interface TeamMember {
  name: string | null
  user_name: string | null
  email: string | null
  club: string | null
  level: number
  total_staking: number
  team_staking: number
  children: TeamMember[]
}

export interface TeamTreeMUIProps {
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

function ExpandIcon(props: React.ComponentProps<typeof AddBoxRoundedIcon>) {
  return <AddBoxRoundedIcon {...props} sx={{ opacity: 0.8 }} />
}

function CollapseIcon(
  props: React.ComponentProps<typeof IndeterminateCheckBoxRoundedIcon>,
) {
  return <IndeterminateCheckBoxRoundedIcon {...props} sx={{ opacity: 0.8 }} />
}

function EndIcon(
  props: React.ComponentProps<typeof DisabledByDefaultRoundedIcon>,
) {
  return <DisabledByDefaultRoundedIcon {...props} sx={{ opacity: 0.3 }} />
}

const filterTeam = (members: TeamMember[], query: string): TeamMember[] => {
  if (!query) return members

  return members
    .map((member) => {
      const name = member.name || ''
      const username = member.user_name || ''
      const email = member.email || ''

      const matched =
        name.toLowerCase().includes(query) ||
        username.toLowerCase().includes(query) ||
        email.toLowerCase().includes(query)

      const filteredChildren = filterTeam(member.children || [], query)

      if (matched || filteredChildren.length > 0) {
        return {
          ...member,
          children: filteredChildren,
        }
      }

      return null
    })
    .filter((m): m is TeamMember => m !== null)
}

const renderTree = (member: TeamMember, idPrefix = '0'): React.ReactNode => {
  const label = (
    <span className="gap-1 flex items-center text-[12px]">
      {member.club === 'Basic' ? (
        <User className="w-[30px] h-[30px] text-gray-600 bg-white rounded-2xl border-gray-600 border-4 " />
      ) : member.club === 'Bronze' ? (
        <MilitaryTechIcon
          sx={{ width: 30, height: 30 }}
          className="text-amber-700 bg-white w-5 h-5 rounded-2xl border-amber-700 border-4 "
        />
      ) : member.club === 'Silver' ? (
        <MilitaryTechIcon
          sx={{ width: 30, height: 30 }}
          className="text-gray-500 bg-white w-5 h-5 rounded-2xl border-gray-500 border-4"
        />
      ) : member.club === 'Gold' ? (
        <MilitaryTechIcon
          sx={{ width: 30, height: 30 }}
          className="text-yellow-500 bg-white w-5 h-5 rounded-2xl border-yellow-500 border-4"
        />
      ) : member.club === 'Platinum' ? (
        <GradeIcon sx={{ width: 30, height: 30 }} className="text-gray-400" />
      ) : member.club === 'Diamond' ? (
        <DiamondIcon
          sx={{ width: 30, height: 30 }}
          className="text-amber-700 bg-white w-5 h-5 rounded-2xl border-amber-700 border-4"
        />
      ) : member.club === 'Double Diamond' ? (
        <DiamondIcon sx={{ width: 30, height: 30 }} className="text-gray-500" />
      ) : member.club === 'Triple Diamond' ? (
        <DiamondIcon
          sx={{ width: 30, height: 30 }}
          className="text-yellow-500 bg-white w-5 h-5 rounded-2xl border-yellow-500 border-4"
        />
      ) : member.club === 'Kait King' ? (
        <EmojiEvents
          sx={{ width: 30, height: 30 }}
          className="text-yellow-600 bg-white w-5 h-5 rounded-2xl border-yellow-600 border-4"
        />
      ) : (
        <User className="w-[30px] h-[30px] text-gray-600 bg-white rounded-2xl border-gray-600 border-4 " />
      )}

      {member.level !== 0 && <div>Level: L{member.level}</div>}

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
  const [query, setQuery] = React.useState('')

  const filtered = React.useMemo(() => {
    return filterTeam(team, query.toLowerCase())
  }, [team, query])

  return (
    <div>
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        placeholder="Search name, email or username"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        sx={{ mb: 2 }}
      />

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
        {filtered.map((member, index) => renderTree(member, `${index}`))}
      </SimpleTreeView>
    </div>
  )
}

// 'use client'

// import * as React from 'react'
// import { User, Search, ChevronRight, ChevronDown, Eye, EyeOff, Minus, Plus } from 'lucide-react'
// import { Tooltip } from '@mui/material'
// import { EmojiEvents } from '@mui/icons-material'
// import DiamondIcon from '@mui/icons-material/Diamond'
// import MilitaryTechIcon from '@mui/icons-material/MilitaryTech'
// import GradeIcon from '@mui/icons-material/Grade'
// import { Card } from '@/components/ui/card'
// import { Input } from '@/components/ui/input'
// import { Button } from '@/components/ui/button'

// interface TeamMember {
//   name: string | null
//   user_name: string | null
//   email: string | null
//   club: string | null
//   level: number
//   total_staking: number
//   team_staking: number
//   children: TeamMember[]
// }

// export interface HorizontalTeamTreeProps {
//   team: TeamMember[]
// }

// const getClubIcon = (club: string | null) => {
//   switch (club) {
//     case 'Bronze':
//       return <MilitaryTechIcon className="w-6 h-6 text-amber-700 border-2 bg-white rounded-2xl" />
//     case 'Silver':
//       return <MilitaryTechIcon className="w-6 h-6 text-gray-500 border-2 bg-white rounded-2xl" />
//     case 'Gold':
//       return <MilitaryTechIcon className="w-6 h-6 text-yellow-500 border-2 bg-white rounded-2xl" />
//     case 'Platinum':
//       return <GradeIcon className="w-6 h-6 text-gray-400 border-2 bg-white rounded-2xl" />
//     case 'Diamond':
//       return <DiamondIcon className="w-6 h-6 text-blue-500 border-2 bg-white rounded-2xl" />
//     case 'Double Diamond':
//       return <DiamondIcon className="w-6 h-6 text-purple-500 border-2 bg-white rounded-2xl" />
//     case 'Triple Diamond':
//       return <DiamondIcon className="w-6 h-6 text-pink-500 border-2 bg-white rounded-2xl" />
//     case 'Kait King':
//       return <EmojiEvents className="w-6 h-6 text-yellow-600 border-2 bg-white rounded-2xl" />
//     default:
//       return <User className="w-6 h-6 text-gray-600 border-2 bg-white rounded-2xl" />
//   }
// }

// const getClubColor = (club: string | null) => {
//   switch (club) {
//     case 'Bronze': return 'from-amber-600 to-amber-700'
//     case 'Silver': return 'from-gray-400 to-gray-500'
//     case 'Gold': return 'from-yellow-400 to-yellow-500'
//     case 'Platinum': return 'from-gray-300 to-gray-400'
//     case 'Diamond': return 'from-blue-400 to-blue-500'
//     case 'Double Diamond': return 'from-purple-400 to-purple-500'
//     case 'Triple Diamond': return 'from-pink-400 to-pink-500'
//     case 'Kait King': return 'from-yellow-500 to-orange-500'
//     default: return 'from-gray-400 to-gray-500'
//   }
// }

// const filterTeam = (members: TeamMember[], query: string): TeamMember[] => {
//   if (!query) return members

//   return members
//     .map((member) => {
//       const name = member.name || ''
//       const username = member.user_name || ''
//       const email = member.email || ''

//       const matched =
//         name.toLowerCase().includes(query) ||
//         username.toLowerCase().includes(query) ||
//         email.toLowerCase().includes(query)

//       const filteredChildren = filterTeam(member.children || [], query)

//       if (matched || filteredChildren.length > 0) {
//         return {
//           ...member,
//           children: filteredChildren,
//         }
//       }

//       return null
//     })
//     .filter((m): m is TeamMember => m !== null)
// }

// const TreeNode: React.FC<{
//   member: TeamMember;
//   level: number;
//   expandedNodes: Set<string>;
//   onToggleNode: (nodeId: string) => void;
//   maxVisibleLevel: number;
// }> = ({ member, level, expandedNodes, onToggleNode, maxVisibleLevel }) => {
//   const hasChildren = member.children && member.children.length > 0
//   const nodeId = `${member.user_name}-${level}`
//   const isExpanded = expandedNodes.has(nodeId)
//   const shouldShowChildren = isExpanded && level < maxVisibleLevel

//   return (
//     <div className="flex items-center ">
//       {/* Current Node */}
//       <div className="flex flex-col items-center relative ">
//         <Tooltip
//           title={
//             <div className="text-xs p-2  space-y-1">
//               <div><strong>Name:</strong> {member.name || 'N/A'}</div>
//               <div><strong>Username:</strong> {member.user_name || 'N/A'}</div>
//               <div><strong>Email:</strong> {member.email || 'N/A'}</div>
//               <div><strong>Level:</strong> L{member.level}</div>
//               <div><strong>Club:</strong> {member.club || 'Basic'}</div>
//               <div><strong>Total Staking:</strong> {member.total_staking}</div>
//               <div><strong>Team Staking:</strong> {member.team_staking}</div>
//             </div>
//           }
//           placement="top"
//           arrow
//         >
//           <div className={`
//             relative w-8 h-8 rounded-full bg-gradient-to-br ${getClubColor(member.club)}
//             flex items-center justify-center cursor-pointer
//             shadow-lg hover:shadow-xl transition-all duration-300
//             border-2 border-white hover:scale-110
//           `}>
//             {getClubIcon(member.club)}

//             {/* Level Badge */}
//             {member.level > 0 && (
//               <div className="absolute -top-2 -right-2 bg-red-500 p-2 text-white text-xs rounded-full w-3 h-3 flex items-center justify-center font-bold">
//                 L{member.level}
//               </div>
//             )}

//             {/* Expand/Collapse Button */}
//             {hasChildren && (
//               <button
//                 onClick={() => onToggleNode(nodeId)}
//                 className="absolute -bottom-0 -right-1 bg-blue-500 hover:bg-blue-600 text-white rounded-full w-3  h-3 flex items-center justify-center transition-colors duration-200 shadow-md"
//               >
//                 {isExpanded ? (
//                   <Minus className="w-3 h-3" />
//                 ) : (
//                   <Plus className="w-3 h-3" />
//                 )}
//               </button>
//             )}
//           </div>
//         </Tooltip>

//         {/* Member Info */}
//         <div className="mt-2 text-center max-w-20">
//           <div className="text-xs font-semibold text-gray-800 truncate">
//             {member.name || 'Unknown'}
//           </div>
//           <div className="text-xs text-gray-600 truncate">
//             {member.user_name || 'N/A'}
//           </div>
//         </div>

//         {/* {hasChildren && shouldShowChildren && (
//           <div className="absolute top-8 -right-3 -z-10 w-8 h-0.5 bg-gray-400"></div>
//         )} */}

//         {/* Collapsed Children Indicator */}
//         {hasChildren && !shouldShowChildren && (
//           <div className="absolute top-2 right-0 flex items-center">
//             <div className="w-6  h-0.5 -z-10 bg-gray-400"></div>
//             <div className="w-4 h-4 -mr-5 bg-gray-200 border-2 border-gray-400 rounded-full flex items-center justify-center">
//               <span className="text-xs font-bold text-gray-600">{member.children.length}</span>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Children */}
//       {hasChildren && shouldShowChildren && (
//         <div className="ml-8 flex flex-col space-y-4">
//           {member.children.map((child, index) => (
//             <div key={`${child.user_name}-${index}`} className="relative">
//               {/* Vertical connector line */}
//               {index > 0 && (
//                 <div className="absolute -top-14 -left-5 w-0.5 h-22 bg-gray-400"></div>
//               )}

//               {/* Horizontal connector line */}
//               <div className="absolute top-8 -left-5 w-8 h-0.5 bg-gray-400"></div>

//               <TreeNode
//                 member={child}
//                 level={level + 1}
//                 expandedNodes={expandedNodes}
//                 onToggleNode={onToggleNode}
//                 maxVisibleLevel={maxVisibleLevel}
//               />
//             </div>
//           ))}

//           {/* Vertical line connecting all children */}
//           {member.children.length > 1 && (
//             <div className={`
//               absolute top-8 -left-8 w-0.5 bg-gray-400
//             `} style={{
//               height: `${(member.children.length - 1) * 112}px` // 112px = node height + spacing
//             }}></div>
//           )}
//         </div>
//       )}
//     </div>
//   )
// }

// export default function HorizontalTeamTree({ team }: HorizontalTeamTreeProps) {
//   const [query, setQuery] = React.useState('')
//   const [expandedNodes, setExpandedNodes] = React.useState<Set<string>>(new Set())
//   const [maxVisibleLevel, setMaxVisibleLevel] = React.useState(3)

//   // Get maximum level in the tree
//   const getMaxLevel = (members: TeamMember[]): number => {
//     let maxLevel = 0
//     const traverse = (member: TeamMember) => {
//       maxLevel = Math.max(maxLevel, member.level)
//       member.children?.forEach(traverse)
//     }
//     members.forEach(traverse)
//     return maxLevel
//   }

//   const maxLevel = React.useMemo(() => getMaxLevel(team), [team])

//   const filtered = React.useMemo(() => {
//     return filterTeam(team, query.toLowerCase())
//   }, [team, query])

//   const handleToggleNode = (nodeId: string) => {
//     setExpandedNodes(prev => {
//       const newSet = new Set(prev)
//       if (newSet.has(nodeId)) {
//         newSet.delete(nodeId)
//       } else {
//         newSet.add(nodeId)
//       }
//       return newSet
//     })
//   }

//   const expandAll = () => {
//     const allNodeIds = new Set<string>()
//     const traverse = (member: TeamMember, level: number) => {
//       if (member.children?.length > 0) {
//         allNodeIds.add(`${member.user_name}-${level}`)
//         member.children.forEach(child => traverse(child, level + 1))
//       }
//     }
//     filtered.forEach(member => traverse(member, 0))
//     setExpandedNodes(allNodeIds)
//   }

//   const collapseAll = () => {
//     setExpandedNodes(new Set())
//   }

//   const expandToLevel = (level: number) => {
//     const nodeIds = new Set<string>()
//     const traverse = (member: TeamMember, currentLevel: number) => {
//       if (member.children?.length > 0 && currentLevel < level) {
//         nodeIds.add(`${member.user_name}-${currentLevel}`)
//         member.children.forEach(child => traverse(child, currentLevel + 1))
//       }
//     }
//     filtered.forEach(member => traverse(member, 0))
//     setExpandedNodes(nodeIds)
//   }

//   return (
//     <div className="min-h-screen container m-auto bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
//       <div className="max-w-full mx-auto space-y-6">
//         {/* Header */}
//         <div className="text-center space-y-4">
//           <h1 className="text-3xl font-bold text-gray-900">Team Structure</h1>
//           <p className="text-gray-600">Explore your team hierarchy and member details</p>
//         </div>

//         {/* Controls */}
//         <Card className="p-6 bg-white/80 backdrop-blur-sm">
//           <div className="space-y-4">
//             {/* Search */}
//             <div className="relative max-w-md mx-auto">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <Input
//                 placeholder="Search by name, email, or username..."
//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}
//                 className="pl-10 bg-white border-2 focus:border-indigo-500"
//               />
//             </div>

//             {/* Level Controls */}
//             <div className="flex flex-wrap items-center justify-center gap-4">
//               <div className="flex items-center  space-x-2">
//                 <span className="text-sm font-medium text-gray-700">Max Level:</span>
//                 <select
//                   value={maxVisibleLevel}
//                   onChange={(e) => setMaxVisibleLevel(Number(e.target.value))}
//                   className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 >
//                   {Array.from({ length: maxLevel + 1 }, (_, i) => (
//                     <option key={i} value={i + 1}>Level {i + 1}</option>
//                   ))}
//                   <option value={999}>All Levels</option>
//                 </select>
//               </div>

//               <div className="flex space-x-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={expandAll}
//                   className="text-xs"
//                 >
//                   <Eye className="w-3 h-3 mr-1" />
//                   Expand All
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={collapseAll}
//                   className="text-xs"
//                 >
//                   <EyeOff className="w-3 h-3 mr-1" />
//                   Collapse All
//                 </Button>
//               </div>

//               <div className="flex space-x-1">
//                 {[1, 2, 3, 4, 5].map(level => (
//                   <Button
//                     key={level}
//                     variant="outline"
//                     size="sm"
//                     onClick={() => expandToLevel(level)}
//                     className="text-xs px-2 py-1"
//                     disabled={level > maxLevel}
//                   >
//                     L{level}
//                   </Button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </Card>

//         {/* Tree Container */}
//         <Card className="p-8 bg-white/90 backdrop-blur-sm overflow-auto">
//           <div className="min-w-max">
//             {filtered.length > 0 ? (
//               <div className="space-y-8">
//                 {filtered.map((member, index) => (
//                   <TreeNode
//                     key={`${member.user_name}-${index}`}
//                     member={member}
//                     level={0}
//                     expandedNodes={expandedNodes}
//                     onToggleNode={handleToggleNode}
//                     maxVisibleLevel={maxVisibleLevel}
//                   />
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-12">
//                 <div className="text-gray-400 mb-4">
//                   <User className="w-16 h-16 mx-auto" />
//                 </div>
//                 <h3 className="text-lg font-medium text-gray-600 mb-2">No team members found</h3>
//                 <p className="text-gray-500">
//                   {query ? 'Try adjusting your search criteria' : 'No team data available'}
//                 </p>
//               </div>
//             )}
//           </div>
//         </Card>

//         {/* Legend */}
//         <Card className="p-4 bg-white/80 backdrop-blur-sm">
//           <h3 className="text-lg font-semibold mb-4 text-center">Club Levels</h3>
//           <div className="flex flex-wrap justify-center gap-4">
//             {[
//               { club: 'Basic', label: 'Basic' },
//               { club: 'Bronze', label: 'Bronze' },
//               { club: 'Silver', label: 'Silver' },
//               { club: 'Gold', label: 'Gold' },
//               { club: 'Platinum', label: 'Platinum' },
//               { club: 'Diamond', label: 'Diamond' },
//               { club: 'Double Diamond', label: 'Double Diamond' },
//               { club: 'Triple Diamond', label: 'Triple Diamond' },
//               { club: 'Kait King', label: 'Kait King' },
//             ].map(({ club, label }) => (
//               <div key={club} className="flex items-center space-x-2">
//                 <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getClubColor(club)} flex items-center justify-center`}>
//                   {getClubIcon(club)}
//                 </div>
//                 <span className="text-sm font-medium text-gray-700">{label}</span>
//               </div>
//             ))}
//           </div>
//         </Card>

//         {/* Instructions */}
//         <Card className="p-4 bg-blue-50/80 backdrop-blur-sm border-blue-200">
//           <div className="text-center space-y-2">
//             <h4 className="font-semibold text-blue-900">How to Use</h4>
//             <div className="text-sm text-blue-700 space-y-1">
//               <p>• Click the <Plus className="w-3 h-3 inline mx-1" />/<Minus className="w-3 h-3 inline mx-1" /> buttons on nodes to expand/collapse their children</p>
//               <p>• Use "Max Level" to limit how deep the tree displays</p>
//               <p>• Numbers in gray circles show collapsed children count</p>
//               <p>• Use level buttons (L1, L2, etc.) to expand to specific levels</p>
//             </div>
//           </div>
//         </Card>
//       </div>
//     </div>
//   )
// }

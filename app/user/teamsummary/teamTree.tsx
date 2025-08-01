'use client'

import * as React from 'react'
import IndeterminateCheckBoxRoundedIcon from '@mui/icons-material/IndeterminateCheckBoxRounded'
import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded'
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded'
import { styled, alpha } from '@mui/material/styles'
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView'
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem'
import { Tooltip, TextField, CircularProgress, Box } from '@mui/material'
import { useAppDispatch } from '@/store/hooks'
import { fetchUserTree } from '@/store/slices/user/userTreeApiList'
import buildTeamTree from './buildersTeamTree'
import {
  EmojiEvents,
  Diamond as DiamondIcon,
  MilitaryTech as MilitaryTechIcon,
  Grade as GradeIcon,
} from '@mui/icons-material'
import { User } from 'lucide-react'

export interface TeamMember {
  user_id: string
  id: string
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
  root_user_id: string
  onNodeClick: (id: string) => void
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

const getClubIcon = (club: string) => {
  const iconProps = {
    sx: { width: 30, height: 30 },
    className: 'bg-white w-5 h-5 rounded-2xl border-4',
  }
  switch (club) {
    case 'Bronze':
      return (
        <MilitaryTechIcon
          {...iconProps}
          className="text-amber-700 border-amber-700"
        />
      )
    case 'Silver':
      return (
        <MilitaryTechIcon
          {...iconProps}
          className="text-gray-500 border-gray-500"
        />
      )
    case 'Gold':
      return (
        <MilitaryTechIcon
          {...iconProps}
          className="text-yellow-500 border-yellow-500"
        />
      )
    case 'Platinum':
      return (
        <GradeIcon {...iconProps} className="text-gray-400 border-gray-500" />
      )
    case 'Diamond':
      return (
        <DiamondIcon
          {...iconProps}
          className="text-amber-700 border-amber-700"
        />
      )
    case 'Double Diamond':
      return <DiamondIcon {...iconProps} className="text-gray-500" />
    case 'Triple Diamond':
      return (
        <DiamondIcon
          {...iconProps}
          className="text-yellow-500 border-yellow-500"
        />
      )
    case 'Kait King':
      return (
        <EmojiEvents
          {...iconProps}
          className="text-yellow-600 border-yellow-600"
        />
      )
    default:
      return (
        <User className="w-[30px] h-[30px] text-gray-600 border-gray-600 border-4 rounded-2xl" />
      )
  }
}

const insertChildren = (
  nodes: TeamMember[],
  targetUserId: string,
  newChildren: TeamMember[],
): TeamMember[] =>
  nodes.map((node) =>
    node.user_id === targetUserId
      ? { ...node, children: newChildren }
      : {
          ...node,
          children: insertChildren(
            node.children || [],
            targetUserId,
            newChildren,
          ),
        },
  )

export default function TeamTreeMUI({ team }: TeamTreeMUIProps) {
  const [query, setQuery] = React.useState('')
  const [expandedItems, setExpandedItems] = React.useState<string[]>([])
  const [treeData, setTreeData] = React.useState<TeamMember[]>(team)
  const [loadingNodeId, setLoadingNodeId] = React.useState<string | null>(null)
  const dispatch = useAppDispatch()

  const handleNodeClick = async (user_id: string) => {
    const root_user_id = team[0]?.id
    const token = localStorage.getItem('token') || ''
    if (root_user_id && user_id && token) {
      try {
        setLoadingNodeId(user_id)
        const response = await dispatch(
          fetchUserTree({ root_user_id, filter_user_id: user_id, token }),
        ).unwrap()
        const children = buildTeamTree(response)
        const updated = insertChildren(treeData, user_id, children)
        setTreeData(updated)
      } catch (err) {
        console.error('Subtree fetch failed:', err)
      } finally {
        setLoadingNodeId(null)
      }
    }
  }

  const handleExpansionToggle = async (
    event: React.SyntheticEvent | null,
    nodeId: string,
    isExpanding: boolean,
  ) => {
    event?.stopPropagation()

    const elBefore = document.getElementById(nodeId)
    const rectBefore = elBefore?.getBoundingClientRect()

    const userId = nodeId
    const node = findNodeById(treeData, userId)

    if (isExpanding && node && (!node.children || node.children.length === 0)) {
      await handleNodeClick(userId)
    }

    setExpandedItems((prev) =>
      isExpanding && !prev.includes(nodeId)
        ? [...prev, nodeId]
        : !isExpanding
          ? prev.filter((id) => id !== nodeId)
          : prev,
    )

    requestAnimationFrame(() => {
      const elAfter = document.getElementById(nodeId)
      if (elAfter && rectBefore) {
        const rectAfter = elAfter.getBoundingClientRect()
        const deltaY = rectAfter.top - rectBefore.top
        window.scrollBy({ top: deltaY, behavior: 'auto' })
        elAfter.focus({ preventScroll: true })
      }
    })
  }

  const findNodeById = (nodes: TeamMember[], id: string): TeamMember | null => {
    for (const node of nodes) {
      if (node.user_id === id) return node
      if (node.children) {
        const child = findNodeById(node.children, id)
        if (child) return child
      }
    }
    return null
  }

  const renderTree = (member: TeamMember): React.ReactNode => {
    const nodeId = member.user_id
    return (
      <CustomTreeItem
        key={nodeId}
        itemId={nodeId}
        id={nodeId}
        label={
          <Box display="flex" alignItems="center" gap={1}>
            <span className="gap-1 flex items-center text-[12px]">
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
                <span
                  className="cursor-pointer text-blue-600 underline flex items-center gap-1"
                  onClick={async (e) => {
                    e.stopPropagation()

                    const elBefore = document.getElementById(nodeId)
                    const rectBefore = elBefore?.getBoundingClientRect()

                    await handleNodeClick(member.user_id)

                    setExpandedItems((prev) =>
                      prev.includes(nodeId) ? prev : [...prev, nodeId],
                    )

                    requestAnimationFrame(() => {
                      const elAfter = document.getElementById(nodeId)
                      if (elAfter && rectBefore) {
                        const rectAfter = elAfter.getBoundingClientRect()
                        const deltaY = rectAfter.top - rectBefore.top
                        window.scrollBy({ top: deltaY, behavior: 'auto' })
                        elAfter.focus({ preventScroll: true })
                      }
                    })
                  }}
                >
                  {getClubIcon(member.club || '')} [Id:{member.user_name}]
                </span>
              </Tooltip>
            </span>
            {loadingNodeId === member.user_id && <CircularProgress size={16} />}
          </Box>
        }
        onClick={(e) =>
          handleExpansionToggle(e, nodeId, !expandedItems.includes(nodeId))
        }
      >
        {member.children?.map((child) => renderTree(child))}
      </CustomTreeItem>
    )
  }

  const filtered = React.useMemo(() => {
    if (!query) return treeData
    const lower = query.toLowerCase()
    const filter = (members: TeamMember[]): TeamMember[] =>
      members
        .map((m) => {
          const match =
            m.name?.toLowerCase().includes(lower) ||
            m.user_name?.toLowerCase().includes(lower) ||
            m.email?.toLowerCase().includes(lower)
          const children = filter(m.children || [])
          return match || children.length > 0 ? { ...m, children } : null
        })
        .filter(Boolean) as TeamMember[]
    return filter(treeData)
  }, [query, treeData])

  return (
    <div>
      <TextField
        fullWidth
        size="small"
        placeholder="Search name, email or username"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        sx={{ mb: 2 }}
      />

      <SimpleTreeView
        aria-label="Team Tree"
        expandedItems={expandedItems}
        onItemExpansionToggle={(e, id, expanding) =>
          handleExpansionToggle(e, id, expanding)
        }
        slots={{
          expandIcon: AddBoxRoundedIcon,
          collapseIcon: IndeterminateCheckBoxRoundedIcon,
          endIcon: AddBoxRoundedIcon,
        }}
        sx={{ overflowX: 'auto', minHeight: 270, flexGrow: 1 }}
      >
        {filtered.map((m) => renderTree(m))}
      </SimpleTreeView>
    </div>
  )
}

// import * as React from 'react'
// import { useState, useMemo, useCallback } from 'react'
// import { Tooltip, TextField, CircularProgress, Box } from '@mui/material'
// import { useAppDispatch } from '@/store/hooks'
// import { fetchUserTree } from '@/store/slices/user/userTreeApiList'
// import buildTeamTree from './buildersTeamTree'
// import {
//   EmojiEvents,
//   Diamond as DiamondIcon,
//   MilitaryTech as MilitaryTechIcon,
//   Grade as GradeIcon,
// } from '@mui/icons-material'
// import { User } from 'lucide-react'

// export interface TeamMember {
//   user_id: string
//   id: string
//   name: string | null
//   user_name: string | null
//   email: string | null
//   club: string | null
//   level: number
//   total_staking: number
//   team_staking: number
//   children: TeamMember[]
// }

// export interface TeamTreeMUIProps {
//   team: TeamMember[]
//   root_user_id: string
//   onNodeClick: (id: string) => void
// }

// interface NodePosition {
//   x: number
//   y: number
//   member: TeamMember
//   level: number
//   parent?: NodePosition
// }

// const getClubColor = (club: string) => {
//   switch (club) {
//     case 'Bronze':
//       return '#92400e'
//     case 'Silver':
//       return '#6b7280'
//     case 'Gold':
//       return '#eab308'
//     case 'Platinum':
//       return '#9ca3af'
//     case 'Diamond':
//       return '#92400e'
//     case 'Double Diamond':
//       return '#6b7280'
//     case 'Triple Diamond':
//       return '#eab308'
//     case 'Kait King':
//       return '#d97706'
//     default:
//       return '#4b5563'
//   }
// }

// const getClubIcon = (club: string, size = 24) => {
//   const iconProps = { width: size, height: size }
//   switch (club) {
//     case 'Bronze':
//       return <MilitaryTechIcon {...iconProps} />
//     case 'Silver':
//       return <MilitaryTechIcon {...iconProps} />
//     case 'Gold':
//       return <MilitaryTechIcon {...iconProps} />
//     case 'Platinum':
//       return <GradeIcon {...iconProps} />
//     case 'Diamond':
//       return <DiamondIcon {...iconProps} />
//     case 'Double Diamond':
//       return <DiamondIcon {...iconProps} />
//     case 'Triple Diamond':
//       return <DiamondIcon {...iconProps} />
//     case 'Kait King':
//       return <EmojiEvents {...iconProps} />
//     default:
//       return <User size={size} />
//   }
// }

// const insertChildren = (
//   nodes: TeamMember[],
//   targetUserId: string,
//   newChildren: TeamMember[],
// ): TeamMember[] =>
//   nodes.map((node) =>
//     node.user_id === targetUserId
//       ? { ...node, children: newChildren }
//       : {
//           ...node,
//           children: insertChildren(
//             node.children || [],
//             targetUserId,
//             newChildren,
//           ),
//         },
//   )

// export default function RadialTreeView({ team }: TeamTreeMUIProps) {
//   const [query, setQuery] = useState('')
//   const [treeData, setTreeData] = useState<TeamMember[]>(team)
//   const [loadingNodeId, setLoadingNodeId] = useState<string | null>(null)
//   const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())
//   const [hoveredNode, setHoveredNode] = useState<string | null>(null)
//   const dispatch = useAppDispatch()

//   const handleNodeClick = async (user_id: string) => {
//     const root_user_id = team[0]?.id
//     const token = localStorage.getItem('token') || ''
//     if (root_user_id && user_id && token) {
//       try {
//         setLoadingNodeId(user_id)
//         const response = await dispatch(
//           fetchUserTree({ root_user_id, filter_user_id: user_id, token }),
//         ).unwrap()
//         const children = buildTeamTree(response)
//         const updated = insertChildren(treeData, user_id, children)
//         setTreeData(updated)
//         setExpandedNodes(prev => new Set([...prev, user_id]))
//       } catch (err) {
//         console.error('Subtree fetch failed:', err)
//       } finally {
//         setLoadingNodeId(null)
//       }
//     }
//   }

//   const calculateNodePositions = useCallback((data: TeamMember[]): NodePosition[] => {
//     const positions: NodePosition[] = []
//     const startX = 150
//     const levelWidth = 250
//     const nodeHeight = 40
//     const verticalSpacing = 50

//     let globalY = 100

//     const traverse = (
//       nodes: TeamMember[],
//       level: number,
//       parent?: NodePosition
//     ) => {
//       nodes.forEach((node) => {
//         const position: NodePosition = {
//           x: startX + level * levelWidth,
//           y: globalY,
//           member: node,
//           level,
//           parent
//         }

//         positions.push(position)
//         globalY += verticalSpacing

//         // Process children if node is expanded
//         if (expandedNodes.has(node.user_id) && node.children && node.children.length > 0) {
//           traverse(node.children, level + 1, position)
//         }
//       })
//     }

//     if (data.length > 0) {
//       traverse(data, 0)
//     }

//     return positions
//   }, [expandedNodes])

//   const filtered = useMemo(() => {
//     if (!query) return treeData
//     const lower = query.toLowerCase()
//     const filter = (members: TeamMember[]): TeamMember[] =>
//       members
//         .map((m) => {
//           const match =
//             m.name?.toLowerCase().includes(lower) ||
//             m.user_name?.toLowerCase().includes(lower) ||
//             m.email?.toLowerCase().includes(lower)
//           const children = filter(m.children || [])
//           return match || children.length > 0 ? { ...m, children } : null
//         })
//         .filter(Boolean) as TeamMember[]
//     return filter(treeData)
//   }, [query, treeData])

//   const nodePositions = calculateNodePositions(filtered)

//   const createCurvedPath = (start: NodePosition, end: NodePosition): string => {
//     const controlX1 = start.x + 100
//     const controlX2 = end.x - 100

//     return `M ${start.x + 80} ${start.y} C ${controlX1} ${start.y} ${controlX2} ${end.y} ${end.x - 80} ${end.y}`
//   }

//   const toggleNode = (nodeId: string) => {
//     if (expandedNodes.has(nodeId)) {
//       setExpandedNodes(prev => {
//         const newSet = new Set(prev)
//         newSet.delete(nodeId)
//         return newSet
//       })
//     } else {
//       handleNodeClick(nodeId)
//     }
//   }

//   const maxX = Math.max(...nodePositions.map(p => p.x), 800)
//   const maxY = Math.max(...nodePositions.map(p => p.y), 600)

//   return (
//     <div className="w-full">
//       <TextField
//         fullWidth
//         size="small"
//         placeholder="Search name, email or username"
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//         sx={{ mb: 2 }}
//       />

//       <div className="relative bg-gray-50 rounded-lg border overflow-auto" style={{ height: '600px' }}>
//         <svg width={maxX + 200} height={maxY + 100} viewBox={`0 0 ${maxX + 200} ${maxY + 100}`}>
//           {/* Grid background */}
//           <defs>
//             <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
//               <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
//             </pattern>
//           </defs>
//           <rect width="100%" height="100%" fill="url(#grid)" opacity="0.3" />

//           {/* Connection lines */}
//           {nodePositions.map((node) =>
//             node.parent ? (
//               <path
//                 key={`line-${node.member.user_id}`}
//                 d={createCurvedPath(node.parent, node)}
//                 stroke="#94a3b8"
//                 strokeWidth="2"
//                 fill="none"
//                 opacity="0.6"
//               />
//             ) : null
//           )}

//           {/* Nodes */}
//           {nodePositions.map((position) => (
//             <g key={position.member.user_id}>
//               {/* Node background */}
//               <ellipse
//                 x={position.x - 80}
//                 y={position.y - 20}
//                 cx={position.x}
//                 cy={position.y}
//                 rx="80"
//                 ry="15"
//                 fill={hoveredNode === position.member.user_id ? '#f3f4f6' : '#ffffff'}
//                 stroke={getClubColor(position.member.club || '')}
//                 strokeWidth="2"
//                 className="cursor-pointer transition-all duration-200"
//                 onClick={() => toggleNode(position.member.user_id)}
//                 onMouseEnter={() => setHoveredNode(position.member.user_id)}
//                 onMouseLeave={() => setHoveredNode(null)}
//               />

//               {/* Node circle */}
//               <circle
//                 cx={position.x - 65}
//                 cy={position.y}
//                 r="12"
//                 fill={getClubColor(position.member.club || '')}
//                 stroke="#ffffff"
//                 strokeWidth="2"
//                 className="cursor-pointer"
//                 onClick={() => toggleNode(position.member.user_id)}
//               />

//               {/* Node text */}
//               <text
//                 x={position.x - 45}
//                 y={position.y - 5}
//                 className="text-sm font-medium fill-gray-800 pointer-events-none"
//                 style={{ fontSize: '12px' }}
//               >
//                 {position.member.user_name || position.member.name || 'Unknown'}
//               </text>

//               {/* Level indicator */}
//               {position.member.level > 0 && (
//                 <text
//                   x={position.x - 45}
//                   y={position.y + 8}
//                   className="text-xs fill-gray-500 pointer-events-none"
//                   style={{ fontSize: '10px' }}
//                 >
//                   Level {position.member.level}
//                 </text>
//               )}

//               {/* Loading indicator */}
//               {loadingNodeId === position.member.user_id && (
//                 <foreignObject
//                   x={position.x + 45}
//                   y={position.y - 10}
//                   width="20"
//                   height="20"
//                 >
//                   <CircularProgress size={20} />
//                 </foreignObject>
//               )}

//               {/* Expansion indicator */}
//               {position.member.children && position.member.children.length > 0 && (
//                 <circle
//                   cx={position.x + 60}
//                   cy={position.y}
//                   r="8"
//                   fill={expandedNodes.has(position.member.user_id) ? '#ef4444' : '#22c55e'}
//                   stroke="#ffffff"
//                   strokeWidth="2"
//                   className="cursor-pointer"
//                   onClick={(e) => {
//                     e.stopPropagation()
//                     toggleNode(position.member.user_id)
//                   }}
//                 />
//               )}

//               {/* Plus/Minus icon */}
//               {position.member.children && position.member.children.length > 0 && (
//                 <text
//                   x={position.x + 60}
//                   y={position.y + 3}
//                   textAnchor="middle"
//                   className="text-xs fill-white pointer-events-none font-bold"
//                   style={{ fontSize: '12px' }}
//                 >
//                   {expandedNodes.has(position.member.user_id) ? '−' : '+'}
//                 </text>
//               )}

//               {/* Large clickable area */}
//               <rect
//                 x={position.x - 80}
//                 y={position.y - 15}
//                 width="160"
//                 height="30"
//                 fill="transparent"
//                 className="cursor-pointer"
//                 onClick={() => toggleNode(position.member.user_id)}
//                 onMouseEnter={() => setHoveredNode(position.member.user_id)}
//                 onMouseLeave={() => setHoveredNode(null)}
//               />
//             </g>
//           ))}
//         </svg>

//         {/* Tooltips */}
//         {nodePositions.map((position) => (
//           hoveredNode === position.member.user_id && (
//             <div
//               key={`tooltip-${position.member.user_id}`}
//               className="absolute bg-white border rounded-lg shadow-lg p-3 text-sm z-10 pointer-events-none"
//               style={{
//                 left: `${position.x + 100}px`,
//                 top: `${position.y - 80}px`,
//                 minWidth: '200px'
//               }}
//             >
//               <div className="space-y-1">
//                 <div className="font-semibold text-gray-900">
//                   {position.member.name || 'Unknown'}
//                 </div>
//                 <div className="text-gray-600">
//                   Username: {position.member.user_name || 'N/A'}
//                 </div>
//                 <div className="text-gray-600">
//                   Email: {position.member.email || 'N/A'}
//                 </div>
//                 {position.member.level > 0 && (
//                   <div className="text-gray-600">
//                     Level: L{position.member.level}
//                   </div>
//                 )}
//                 {position.member.club && (
//                   <div className="text-gray-600">
//                     Club: {position.member.club}
//                   </div>
//                 )}
//                 <div className="text-gray-600">
//                   Total Staking: {position.member.total_staking}
//                 </div>
//                 <div className="text-gray-600">
//                   Team Staking: {position.member.team_staking}
//                 </div>
//               </div>
//             </div>
//           )
//         ))}
//       </div>

//       {/* Controls */}
//       <div className="mt-4 flex gap-2 text-sm text-gray-600">
//         <div className="flex items-center gap-1">
//           <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//           <span>Click to expand</span>
//         </div>
//         <div className="flex items-center gap-1">
//           <div className="w-3 h-3 bg-red-500 rounded-full"></div>
//           <span>Click to collapse</span>
//         </div>
//       </div>
//     </div>
//   )
// }

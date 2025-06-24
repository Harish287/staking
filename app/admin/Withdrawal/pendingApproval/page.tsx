'use client'

import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
} from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchWithdrawList } from '@/store/slices/admin/withdrawlistSlice'
import WithdrawAction from '../page'
import Image from 'next/image'
import kaitimg from '../../../../assets/logo2x.png'

export default function PendingWithdrawRequests() {
  const dispatch = useAppDispatch()
  const { items, loading, error } = useAppSelector(
    (state) => state.withdrawList,
  )

  const [openDialog, setOpenDialog] = useState(false)
  const [selectedWithdrawId, setSelectedWithdrawId] = useState<string | null>(
    null,
  )
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  useEffect(() => {
    dispatch(
      fetchWithdrawList({ review_status: 'pending', page: 1, page_size: 10 }),
    )
  }, [dispatch])

  const handleOpenDialog = (withdrawId: string, userId: string) => {
    setSelectedWithdrawId(withdrawId)
    setSelectedUserId(userId)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedWithdrawId(null)
    setSelectedUserId(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 bg-blue-100">
      <div style={{ padding: 24 }} className=" bg-white rounded-2xl">
        <Typography variant="h5" gutterBottom>
          Pending Withdraw Requests
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Beneficiary</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.withdraw_request_id}>
                  <TableCell>{item.date_time}</TableCell>
                  <TableCell>{item.full_name}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>
                    <div className=" flex items-center">
                      <Image
                        src={kaitimg}
                        width={20}
                        height={20}
                        className=" object-contain ml-2"
                        alt="Picture of the author"
                      />
                      <span className=" ml-0.5">
                        {item.amount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>{item.beneficiary_nick_name}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() =>
                        handleOpenDialog(item.withdraw_request_id, item.user_id)
                      }
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Withdraw Request Details</DialogTitle>
          <DialogContent dividers>
            {selectedWithdrawId && selectedUserId && (
              <WithdrawAction
                withdraw_request_id={selectedWithdrawId}
                user_id={selectedUserId}
                onClose={handleCloseDialog}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Close</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  )
}

// 'use client'

// import React, { useEffect, useState } from 'react'
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   Typography,
//   CircularProgress,
// } from '@mui/material'
// import { useAppDispatch, useAppSelector } from '@/store/hooks'
// import { fetchWithdrawList } from '@/store/slices/admin/withdrawlistSlice'
// import WithdrawAction from '../decide'

// export default function WithdrawPendingApproval() {
//   const dispatch = useAppDispatch()
//   const { items, loading, error } = useAppSelector(
//     (state) => state.withdrawList,
//   )

//   const [openDialog, setOpenDialog] = useState(false)
//   const [selectedWithdrawId, setSelectedWithdrawId] = useState<string | null>(
//     null,
//   )
//   const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

//   useEffect(() => {
//     dispatch(
//       fetchWithdrawList({ review_status: 'any', page: 1, page_size: 10 }),
//     )
//   }, [dispatch])

//   const handleOpenDialog = (withdrawId: string, userId: string) => {
//     setSelectedWithdrawId(withdrawId)
//     setSelectedUserId(userId)
//     setOpenDialog(true)
//   }

//   const handleCloseDialog = () => {
//     setOpenDialog(false)
//     setSelectedWithdrawId(null)
//     setSelectedUserId(null)
//   }

//   return (
//     <div style={{ padding: 24 }}>
//       <Typography variant="h5" gutterBottom>
//         Withdraw Requests
//       </Typography>

//       {loading && <CircularProgress />}
//       {error && <Typography color="error">Error: {error}</Typography>}

//       <Table>
//         <TableHead>
//           <TableRow>
//             <TableCell>Date</TableCell>
//             <TableCell>User</TableCell>
//             <TableCell>Email</TableCell>
//             <TableCell>Amount</TableCell>
//             <TableCell>Status</TableCell>
//             <TableCell>Beneficiary</TableCell>
//             <TableCell>Description</TableCell>
//             <TableCell>Action</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {items.map((item) => (
//             <TableRow key={item.withdraw_request_id}>
//               <TableCell>{item.date_time}</TableCell>
//               <TableCell>{item.full_name}</TableCell>
//               <TableCell>{item.email}</TableCell>
//            <TableCell>       <Image
//                                      src={kaitimg}
//                                      width={15}
//                                      height={15}
//                                      className=" object-contain ml-1"
//                                      alt="Picture of the author"
//                                    />{item.amount.toLocaleString('en-IN')}</TableCell>
//               <TableCell>{item.status}</TableCell>
//               <TableCell>{item.beneficiary_nick_name}</TableCell>
//               <TableCell>{item.description}</TableCell>
//               <TableCell>
//                 <Button
//                   variant="contained"
//                   size="small"
//                   onClick={() =>
//                     handleOpenDialog(item.withdraw_request_id, item.user_id)
//                   }
//                 >
//                   Review
//                 </Button>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>

//       <Dialog
//         open={openDialog}
//         onClose={handleCloseDialog}
//         fullWidth
//         maxWidth="sm"
//       >
//         <DialogTitle>Review Withdraw Request</DialogTitle>
//         <DialogContent dividers>
//           {selectedWithdrawId && selectedUserId && (
//             <WithdrawAction
//               withdraw_request_id={selectedWithdrawId}
//               user_id={selectedUserId}
//               onClose={handleCloseDialog}
//             />
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDialog}>Close</Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   )
// }

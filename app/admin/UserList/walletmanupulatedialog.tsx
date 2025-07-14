'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import {
  loadWalletThunk,
  resetWalletLoad,
} from '@/store/slices/admin/loadWalletSlice'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'

interface WalletManipulationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  walletType: string
}

const walletKindMap: Record<string, string> = {
  KAIT: 'KaitWallet',
  Income: 'IncomeWallet',
  Adhoc: 'AdhocWallet',
  ROS: 'RosWallet',
  Restaking: 'ReStakeWallet',
  Fiat: 'FiatWallet',
  Vpay: 'VpayVoucher',
  Ecommerce: 'EcommerceVoucher',
}

export default function WalletManipulationDialog({
  open,
  onOpenChange,
  userId,
  walletType,
}: WalletManipulationDialogProps) {
  const dispatch = useDispatch<AppDispatch>()
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')
  const [transactionType, setTransactionType] =
    useState<'credit' | 'debit'>('credit')

  const { loading } = useSelector((state: RootState) => state.loadWallet)

  const handleSubmit = async () => {
    if (!amount || Number(amount) <= 0) {
      toast.error('Valid amount is required.')
      return
    }

    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Missing token. Please login again.')
      return
    }

    const formattedWalletKind = walletKindMap[walletType] || walletType

    try {
      const resultAction = await dispatch(
        loadWalletThunk({
          user_id: userId,
          wallet_kind: formattedWalletKind,
          transaction_type: transactionType,
          comment: 'Load Wallet For Testing', // Required exact match
          amount: Number(amount),
          token,
        }),
      )

      if (loadWalletThunk.fulfilled.match(resultAction)) {
        toast.success(`${formattedWalletKind} ${transactionType} successful`)
        setAmount('')
        setReason('')
        onOpenChange(false)
        dispatch(resetWalletLoad())
      } else {
        toast.error(resultAction.payload as string)
      }
    } catch (error) {
      toast.error('Unexpected error while loading wallet')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold mb-2">
            Manipulate {walletType} Wallet
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Select
            value={transactionType}
            onValueChange={(val: 'credit' | 'debit') => setTransactionType(val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Transaction Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="credit">Add</SelectItem>
              <SelectItem value="debit">Deduct</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Reason (optional, not sent to API)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Processing...' : 'Submit'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

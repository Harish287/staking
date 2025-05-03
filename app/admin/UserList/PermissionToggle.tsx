import { useDispatch, useSelector } from 'react-redux'
import { updateUserPermission } from '@/store/slices/admin/permisionSlice' // Ensure this import is correct
import { AppDispatch } from '@/store/store'
import { MoreVertical } from 'lucide-react'
import { Menubar, MenubarItem, MenubarMenu } from '@/components/ui/menubar'
import { RootState } from '@/store/store' // Import RootState to access the Redux store

type PermissionType =
  | 'transfer'
  | 'withdraw'
  | 'withdraw_staking'
  | 'level_income'
  | 'credit'
  | 'suspend'
  | 'adhoc_income'

export default function MoreMenu({
  userId,
  token,
}: {
  userId: string
  token: string
}) {
  const dispatch = useDispatch<AppDispatch>()
  const investorDetails = useSelector(
    (state: RootState) => state.investor.details,
  ) // Get the details of the current investor from Redux store

  // Check if investor details are available and find the current permission status
  const currentPermissions = investorDetails ? investorDetails : null

  const handlePermissionChange = (
    permissionType: PermissionType,
    permissionValue: boolean,
  ) => {
    dispatch(
      updateUserPermission({ userId, permissionType, permissionValue, token }),
    )
  }

  // Helper function to check the current permission status
  const getPermissionStatus = (permissionType: PermissionType) => {
    if (!currentPermissions) return false // Default to false if no details are found
    return currentPermissions[permissionType] // Get the permission status from investor details
  }

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarItem
          onClick={() =>
            handlePermissionChange('transfer', !getPermissionStatus('transfer'))
          }
        >
          {getPermissionStatus('transfer')
            ? 'Disable Transfer'
            : 'Enable Transfer'}
        </MenubarItem>
        <MenubarItem
          onClick={() =>
            handlePermissionChange('withdraw', !getPermissionStatus('withdraw'))
          }
        >
          {getPermissionStatus('withdraw')
            ? 'Disable Withdraw'
            : 'Enable Withdraw'}
        </MenubarItem>
        <MenubarItem
          onClick={() =>
            handlePermissionChange(
              'withdraw_staking',
              !getPermissionStatus('withdraw_staking'),
            )
          }
        >
          {getPermissionStatus('withdraw_staking')
            ? 'Disable Withdraw Staking'
            : 'Enable Withdraw Staking'}
        </MenubarItem>
        {/* Add more items as needed */}
      </MenubarMenu>
      <MenubarItem>
        <MoreVertical className="h-4 w-4" />
      </MenubarItem>
    </Menubar>
  )
}

// export default MoreMenu

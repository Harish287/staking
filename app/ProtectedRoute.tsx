import { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAppSelector } from '../store/hooks'
import { decodeJWT } from '../lib/auth'

interface ProtectedRouteProps {
  children: ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter()
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true) 

    const token = localStorage.getItem('token')
    console.log(token, 'token')

    if (!token) {
      router.replace('/auth/signin')
      return
    }

    try {
      const decodedToken = decodeJWT(token)

      if (decodedToken?.role === 'admin') {
        router.replace('/admin/dashboard')
      } else {
        router.replace('/user/dashboard')
      }
    } catch (error) {
      console.error('Error decoding token:', error)
      router.replace('/auth/signin')
    }
  }, [router])

  if (!isClient || !isAuthenticated) {
    
    return null
  }

  return <>{children}</>
}

export default ProtectedRoute
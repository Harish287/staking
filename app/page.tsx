'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { decodeJWT } from '@/lib/auth'
import { Spinner } from '@/components/ui/spinner'

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
  
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')

      if (!token) {
        console.log('No token found, redirecting to signin.')
        router.replace('/auth/signin')
        return
      }

      try {
        const decodedToken = decodeJWT(token)
        if (decodedToken) {
          console.log('Decoded Token:', decodedToken)

          const { role } = decodedToken

          if (role) {
            setLoading(false)

            switch (role) {
              case 'admin':
                router.replace('/admin/dashboard')
                break
              case 'customer':
                router.replace('/user/dashboard')
                break
              default:
                console.warn('Unknown role, redirecting to signin.')
                router.replace('/auth/signin')
            }
          } else {
            console.warn('Invalid token, redirecting to signin.')
            router.replace('/auth/signin')
          }
        } else {
          console.error('Token decoding failed, redirecting to signin.')
          router.replace('/auth/signin')
        }
      } catch (error) {
        console.error('Error decoding token:', error)
        setError('An error occurred during token validation.')
        router.replace('/auth/signin')
      }
    }
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return null
}

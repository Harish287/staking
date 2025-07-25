'use client'

import React, { useState, useEffect, useLayoutEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { loginUser, checkAuth, setUser } from '../../../store/slices/index'
import { useRouter, usePathname } from 'next/navigation'
import Cookies from 'js-cookie'
import { decodeJWT } from '../../../lib/auth'
import Image from 'next/image'
import Logo from '../../../assets/logo2x.png'
import { Spinner } from '@/components/ui/spinner'
import { TextField } from '@mui/material'
import { IconButton, InputAdornment } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const pathname = usePathname()
  const [showPassword, setShowPassword] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [showErrorPopup, setShowErrorPopup] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const { isAuthenticated, isLoading, user } = useAppSelector(
    (state) => state.auth,
  )

  const [isClient, setIsClient] = useState(false)

  useLayoutEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const token = Cookies.get('token') || localStorage.getItem('token')
    if (!token) {
      router.replace('/auth/signin')
      return
    }

    const decodedToken = decodeJWT(token)
    if (decodedToken) {
      const currentTime = Math.floor(Date.now() / 1000)
      if (decodedToken.exp < currentTime) {
        handleLogout()
      } else {
        dispatch(checkAuth())
          .unwrap()
          .then((response: { user: { role: string } }) => {
            if (response.user) {
              dispatch(setUser(response.user))
              if (response.user.role === 'admin') {
                router.push('/admin/dashboard')
              } else {
                router.push('/user/dashboard')
              }
            }
          })
          .catch(() => handleLogout())
      }
    }
  }, [dispatch, router, pathname, isClient])

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin' && pathname !== '/admin/dashboard') {
        router.push('/admin/dashboard')
      } else if (user.role !== 'admin' && pathname !== '/user/dashboard') {
        router.push('/user/dashboard')
      }
    }
  }, [isAuthenticated, user, router, pathname])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')

    dispatch(loginUser({ email, password }))
      .unwrap()
      .then((response) => {
        if (response.access_token) {
          if (rememberMe) {
            Cookies.set('token', response.access_token, { expires: 365 })
          } else {
            localStorage.setItem('token', response.access_token)
          }

          const decodedToken = decodeJWT(response.access_token)
          console.log('token', decodedToken)

          if (decodedToken) {
            dispatch(setUser(decodedToken))

            setTimeout(() => {
              if (decodedToken.role === 'admin') {
                router.push('/admin/dashboard')
              } else {
                router.push('/user/dashboard')
              }
            }, 100)
          } else {
            setLoginError('Failed to decode the token. Please try again.')
            setShowErrorPopup(true)
          }
        }
      })
      .catch((err) => {
        console.error('Login error:', err)
        if (typeof err === 'string') {
          setLoginError(err)
        } else if (err?.detail === 'User not found') {
          setLoginError('User not found. Please register.')
        } else {
          setLoginError('Login failed. Please check your credentials.')
        }
        setShowErrorPopup(true)
      })
  }

  const handleLogout = () => {
    Cookies.remove('token')
    localStorage.removeItem('token')
    dispatch(setUser(null))
    router.push('/auth/signin')
  }

  return (
    <div className="flex justify-center items-center lg:px-[100px] p-0 lg:py-[50px]">
      <div className="  text-white  bg-gradient-to-r from-blue-500 to-purple-700 w-[80%] flex container mx-auto justify-center rounded-2xl">
        {/* Left Side */}
        <div className="hidden w-1/2 relative overflow-hidden p-[50px] rounded-2xl lg:items-center bg-black lg:flex">
          <div>
            <Image src={Logo} alt="Logo" className="mx-auto mb-5" />
            <h1 className="text-2xl font-bold text-center">KAIT Staking</h1>
            <p className="mt-5 text-[15px] text-white ">
              Our vision is to disrupt the current financial landscape and give
              everyday investors more control over their financial futures. We
              are focused on building this platform so that anyone can benefit
              from the Technology behind Crypto Assets by making investing in
              cryptocurrencies more accessible and secure for everyone.
            </p>
            <br />
            <p>
              With our platform, investors will have the ability to invest in
              the KAIT Coin and Its token of their choice at prices which are
              more representative of the underlying value of the asset and limit
              exposure to market volatility.
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center bg-transparent  bg-gradient-to-r from-blue-500 to-purple-700 p-12 w-full lg:w-1/2 lg:mr-[30px] rounded-2xl">
          <Image src={Logo} alt="Logo" className="mx-auto mb-5" />
          <h1 className="text-3xl font-semibold pb-2">Sign In</h1>
          <p className="text-lg text-white pb-6">
            with your KAIT Staking Account
          </p>
          <form className="w-full max-w-sm" onSubmit={handleLogin}>
            <div className="mb-4">
              <TextField
                name="Email"
                label="Email"
                variant="outlined"
                placeholder="Enter your email"
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                slotProps={{
                  input: {
                    style: { color: 'white' },
                  },
                  inputLabel: {
                    style: { color: 'white' },
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'gray' },
                    '&:hover fieldset': { borderColor: '#ec4899' },
                    '&.Mui-focused fieldset': { borderColor: '#ec4899' },
                  },
                }}
              />
            </div>
            <div className="mb-4">
              <TextField
                variant="outlined"
                type={showPassword ? 'text' : 'password'}
                label="Password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
                placeholder="Enter your password"
                slotProps={{
                  input: {
                    type: showPassword ? 'text' : 'password',
                    endAdornment: (
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                        sx={{ color: 'white' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    ),
                    style: { color: 'white' },
                  },
                  inputLabel: {
                    style: { color: 'white' },
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'gray' },
                    '&:hover fieldset': { borderColor: '#ec4899' },
                    '&.Mui-focused fieldset': { borderColor: '#ec4899' },
                  },
                }}
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
              <label
                htmlFor="rememberMe"
                className="flex items-center text-white cursor-pointer"
              >
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="mr-2 accent-purple-500"
                />
                Remember Me
              </label>

              <a
                href="/auth/forgot_Password"
                className="text-sm text-pink-200 hover:text-white hover:underline"
              >
                Forgot Password?
              </a>
            </div>

            <button
              className="w-full  bg-gradient-to-r from-blue-500 to-purple-700 text-white font-semibold py-2 rounded-md mt-4 transition-transform transform hover:scale-105"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? <Spinner /> : 'Sign In'}
            </button>
          </form>

          <div className=" flex gap-2 items-center mt-4">
            <p className="text-white text-sm ">Don’t have an account</p>
            <a
              href="/auth/signup"
              className="text-red-600 font-semibold hover:underline "
            >
              Sign up here
            </a>
          </div>
        </div>

        {showErrorPopup && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-lg text-center">
              <h2 className="text-xl font-bold text-red-300">Login Failed</h2>
              <p className="text-gray-700 mt-2">{loginError}</p>
              <button
                className="mt-4 bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700"
                onClick={() => setShowErrorPopup(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LoginPage

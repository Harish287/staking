
'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store/store'
import {
  registerUser,
  resendConfirmationEmail,
} from '../../../store/slices/index'
import { Spinner } from '@/components/ui/spinner'
import Image from 'next/image'
import Logo from '../../../assets/logo2x.png'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  TextField,
  IconButton,
  InputAdornment,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import toast, { Toaster } from 'react-hot-toast'

type FormData = {
  first_name: string
  last_name: string
  dob: string
  email: string
  password: string
  confirm_password: string
  mobile: string
  referral_token?: string
}

const RegisterPage: React.FC = () => {
  const searchParams = useSearchParams()
  const params: { [key: string]: string } = {}

  searchParams.forEach((value, key) => {
    if (key === 'token') {
      params['referral_token'] = value
    }
  })

  const hasReferralToken = !!params.referral_token

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm<FormData>()

  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [showResend, setShowResend] = useState(false)
  const [email, setEmail] = useState('')
  const [resendLoading, setResendLoading] = useState(false)
  const [timer, setTimer] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
    } else if (interval) {
      clearInterval(interval)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [timer])

  const onSubmit = async (data: FormData) => {
    setLoading(true)

    if (data.password !== data.confirm_password) {
      setError('confirm_password', {
        type: 'manual',
        message: 'Passwords do not match',
      })
      setLoading(false)
      return
    }

    const finalData = {
      ...data,
      referral_token: params.referral_token,
    }

    try {
      await dispatch(registerUser(finalData)).unwrap()
      setEmail(data.email)
      toast.success(
        'Verification email sent. Please check your inbox to complete registration.',
      )
      setShowResend(true)
      setTimer(30)
    } catch (error: any) {
      console.error('Registration error:', error)

      const message =
        error?.detail || error?.message || 'An unexpected error occurred.'

      if (
        error?.code === 'email_not_verified' ||
        message.toLowerCase().includes('not verified')
      ) {
        setEmail(data.email)
        toast.error(
          'Email already registered but not verified. You can resend it.',
        )
        setShowResend(true)
        setTimer(30)
      } else {
        toast.error(message)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResendEmail = async (email: string) => {
    setResendLoading(true)
    try {
      await dispatch(resendConfirmationEmail({ email })).unwrap()
      toast.success('Verification email resent successfully.')
      setTimer(30)
    } catch (error: any) {
      console.error('Resend error:', error)
      toast.error(
        error?.detail || error?.message || 'Failed to resend. Try again later.',
      )
    } finally {
      setResendLoading(false)
    }
  }

  const password = watch('password')

  return (
    <div className="flex justify-center items-center lg:px-[160px] p-0 lg:py-[50px]">
      <Toaster position="top-right" />
      <div className="text-white w-auto h-auto bg-gradient-to-r from-blue-500 to-purple-700 flex container justify-center rounded-2xl">
        <div className="hidden w-1/2 relative overflow-hidden p-[50px] rounded-2xl lg:items-center bg-black lg:flex">
          <div>
            <Image src={Logo} alt="Logo" className="mx-auto mb-5" />
            <h1 className="text-2xl font-bold text-center">KAIT Staking</h1>
            <p className="mt-5 text-[15px] text-white mb-5">
              Our vision is to disrupt the current financial landscape and give
              everyday investors more control over their financial futures.
            </p>
            <p className="text-[15px] text-white">
              With our platform, investors will be able to invest securely in
              cryptocurrencies and gain from market opportunities.
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center bg-transparent bg-gradient-to-r from-blue-500 to-purple-700 p-12 w-full lg:w-1/2 lg:mr-[30px] rounded-2xl">
          <Image src={Logo} alt="Logo" className="mx-auto mb-5" />
          <h1 className="text-2xl font-semibold pb-2">Sign Up</h1>

          <form className="w-full max-w-sm" onSubmit={handleSubmit(onSubmit)}>
            {[
              {
                name: 'first_name',
                label: 'First Name',
                type: 'text',
                required: 'First name is required',
              },
              {
                name: 'last_name',
                label: 'Last Name',
                type: 'text',
                required: 'Last name is required',
              },
              {
                name: 'dob',
                type: 'date',
                required: 'Date of birth is required',
              },
              {
                name: 'email',
                label: 'Email',
                type: 'email',
                required: 'Email is required',
              },
              {
                name: 'password',
                label: 'Password',
                type: showPassword ? 'text' : 'password',
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
                endAdornment: (
                  <IconButton className=' text-white' onClick={() => setShowPassword((prev) => !prev)}>
                    {showPassword ? <VisibilityOff className=' text-white'/> : <Visibility className=' text-white' />}
                  </IconButton>
                ),
              },
              {
                name: 'confirm_password',
                label: 'Confirm Password',
                type: showConfirmPassword ? 'text' : 'password',
                required: 'Please confirm your password',
                endAdornment: (
                  <IconButton className=' text-white' onClick={() => setShowConfirmPassword((prev) => !prev)}>
                    {showConfirmPassword ? <VisibilityOff className=' text-white'/> : <Visibility className=' text-white' />}
                  </IconButton>
                ),
              },
              {
                name: 'mobile',
                label: 'Mobile',
                type: 'tel',
                required: 'Mobile number is required',
              },
            ].map((field) => (
              <div className="mb-4" key={field.name}>
                <TextField
                  type={field.type}
                  label={field.label}
                  fullWidth
                  variant="outlined"
                  slotProps={{
                    input: {
                      style: { color: 'white' },
                      endAdornment: field.endAdornment ? (
                        <InputAdornment position="end">
                          {field.endAdornment}
                        </InputAdornment>
                      ) : undefined,
                    },
                    inputLabel: { style: { color: 'white' } },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'gray' },
                      '&:hover fieldset': { borderColor: '#ec4899' },
                      '&.Mui-focused fieldset': { borderColor: '#ec4899' },
                    },
                  }}
                  {...register(field.name as keyof FormData, {
                    required: field.required,
                    ...(field.minLength ? { minLength: field.minLength } : {}),
                    validate:
                      field.name === 'confirm_password'
                        ? (value) =>
                            value === password ||
                            'Passwords do not match'
                        : undefined,
                  })}
                />
                {errors[field.name as keyof FormData] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[field.name as keyof FormData]?.message as string}
                  </p>
                )}
              </div>
            ))}

            {hasReferralToken ? (
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-700 text-white font-semibold py-2 rounded-md mt-4 hover:scale-105"
                disabled={loading}
              >
                {loading ? <Spinner /> : 'Sign Up'}
              </button>
            ) : (
              <div className="w-full bg-red-500 text-white font-semibold py-2 rounded-md mt-4 text-center">
                Sorry, you are not supposed to register without a Referral. Use
                the correct link.
              </div>
            )}
          </form>

          {showResend && (
            <div className="mt-4">
              {timer > 0 && (
                <p className="text-yellow-500 text-sm mb-2">
                  Resend available in {timer} seconds.
                </p>
              )}
              <button
                className="w-full bg-red-500 text-white font-semibold py-2 rounded-md mt-4"
                onClick={() => handleResendEmail(email)}
                disabled={timer > 0 || resendLoading}
              >
                {resendLoading ? <Spinner /> : 'Resend Confirmation Email'}
              </button>
            </div>
          )}

          <p className="text-white text-sm mt-4">
            Already have an account?{' '}
            <a
              href="/auth/signin"
              className="text-red-300 font-semibold hover:underline"
            >
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage

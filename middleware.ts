import { NextResponse, type NextRequest } from 'next/server'
import { decodeJWT } from './lib/auth'

interface DecodedToken {
  exp: number
  role: 'admin' | 'customer' | string
}

const roleAccess: Record<string, Set<string>> = {
  admin: new Set(['/admin']),
  customer: new Set(['/user']),
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value
  if (!token)
    return redirectWithCookieClear(req, '/auth/signin', 'Missing token')

  const decodedToken = decodeJWT(token)
  if (
    !decodedToken ||
    typeof decodedToken.exp !== 'number' ||
    typeof decodedToken.role !== 'string'
  ) {
    return redirectWithCookieClear(req, '/auth/signin', 'Invalid token')
  }

  if (decodedToken.exp < Math.floor(Date.now() / 1000)) {
    return redirectWithCookieClear(req, '/auth/signin', 'Token expired')
  }

  const allowedPaths = roleAccess[decodedToken.role]
  if (
    !allowedPaths ||
    ![...allowedPaths].some((path) => req.nextUrl.pathname.startsWith(path))
  ) {
    return NextResponse.redirect(new URL('/access-denied', req.url))
  }

  return NextResponse.next()
}

function redirectWithCookieClear(
  req: NextRequest,
  path: string,
  reason: string,
) {
  if (process.env.NODE_ENV !== 'production')
    console.log(`Middleware Redirect: ${reason}`)

  return NextResponse.redirect(new URL(path, req.url), {
    headers: { 'Set-Cookie': 'token=; Path=/; HttpOnly; Max-Age=0' },
  })
}

export const config = {
  matcher: ['/admin/:path*', '/user/:path*'],
}

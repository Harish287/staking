import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJWT } from "./lib/auth";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

 
  if (!token) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }


  const decodedToken = decodeJWT(token);


  if (!decodedToken) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }


  const currentTime = Math.floor(Date.now() / 1000); 
  if (decodedToken.exp < currentTime) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));  
  }

 
  if (req.nextUrl.pathname.startsWith("/admin") && decodedToken.user_role !== "Administrator") {
    return NextResponse.redirect(new URL("/access-denied", req.url));  
  }

  if (req.nextUrl.pathname.startsWith("/user") && decodedToken.user_role !== "Customer") {
    return NextResponse.redirect(new URL("/access-denied", req.url));  
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"], // Paths you want to protect with this middleware
};

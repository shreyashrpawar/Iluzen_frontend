// // middleware.js
// import { NextResponse } from 'next/server'

// export function middleware(request) {
//   const token = request.cookies.get('token')?.value || 
//                 request.headers.get('authorization')?.replace('Bearer ', '')

//   // Define protected routes
//   const protectedRoutes = ['/dashboard', '/profile', '/admin']
//   const isProtectedRoute = protectedRoutes.some(route => 
//     request.nextUrl.pathname.startsWith(route)
//   )

//   if (isProtectedRoute && !token) {
//     return NextResponse.redirect(new URL('/login', request.url))
//   }

//   return NextResponse.next()
// }

// export const config = {
//   matcher: ['/dashboard/:path*', '/profile/:path*', '/admin/:path*']
// }
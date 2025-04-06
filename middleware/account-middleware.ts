import { type NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  // if not logged in
  // return NextResponse.next()



  // if not authenticated
  // return NextResponse.redirect(new URL("/login", request.url))


  // if (request.nextUrl.pathname.startsWith("/admin") && decoded.role !== "admin") {
  //   return NextResponse.redirect(new URL("/worker/dashboard", request.url))
  // }

  // if (request.nextUrl.pathname.startsWith("/worker") && decoded.role !== "worker" && decoded.role !== "admin") {
  //   return NextResponse.redirect(new URL("/login", request.url))
  // }

  console.log("Hello world - middleware running on path:", request.nextUrl.pathname)
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
}


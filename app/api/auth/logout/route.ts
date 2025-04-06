// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json(
      { message: 'Logout successful' },
      { status: 200 }
    )

    response.cookies.set({
      name: 'next-auth.session-token',
      value: '',
      expires: new Date(0),
      path: '/',
    })

    return response
  } catch (error) {
    return NextResponse.json(
      { message: 'Logout failed', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
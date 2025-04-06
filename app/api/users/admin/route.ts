// app/api/users/admin/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import argon2d from 'argon2'

// CREATE admin
export async function POST(request: Request) {

  try {
    const body = await request.json()

    if (body.password !== body.confirmPassword) {
      return NextResponse.json({ message: 'Passwords do not match' }, { status: 400 })
    }

    const hashedPassword = await argon2d.hash(body.password)

    const newAdmin = await prisma.user.create({
      data: {
        email: body.email,
        firstname: body.firstname,
        lastname: body.lastname,
        middlename: body.middlename,
        password: hashedPassword,
        role: 'admin',
        birthday: new Date()
      },
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        middlename: true,
        createdAt: true
      }
    })

    return NextResponse.json(newAdmin, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { message: 'Error creating admin', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// GET all admins
export async function GET(request: Request) {


  try {
    const admins = await prisma.user.findMany({
      where: { role: 'admin' },
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        middlename: true,
        createdAt: true
      }
    })

    return NextResponse.json(admins)
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching admins', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
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
    const { searchParams } = new URL(request.url)

    // Pagination
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')

    // Base filter for admins
    const where: any = { role: 'admin' }

    // Additional filters
    if (searchParams.get('name')) {
      const name = searchParams.get('name')!.toLowerCase()
      where.OR = [
        { firstname: { contains: name } },
        { lastname: { contains: name } }
      ]
    }
    if (searchParams.get('email')) where.email = { contains: searchParams.get('email') }

    // Sorting
    const orderBy: any = {}
    const sort = searchParams.get('sort')
    if (sort) {
      const [sortField, sortDirection] = sort.split(':')
      orderBy[sortField] = sortDirection || 'asc'
    }

    const admins = await prisma.user.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        middlename: true,
        createdAt: true
      }
    })

    const total = await prisma.user.count({ where })

    return NextResponse.json({
      data: admins,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    })
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
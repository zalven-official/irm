// app/api/users/worker/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import argon2d from 'argon2'

// GET all workers with filters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    // Pagination
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')

    // Base filter for workers
    const where: any = { role: 'worker' }

    // Additional filters
    if (searchParams.get('email')) where.email = { contains: searchParams.get('email') }
    if (searchParams.get('churchId')) where.churchId = parseInt(searchParams.get('churchId')!)
    if (searchParams.get('positionId')) where.positionId = parseInt(searchParams.get('positionId')!)
    if (searchParams.get('status')) where.status = searchParams.get('status')

    // Date filters
    if (searchParams.get('createdAtFrom') || searchParams.get('createdAtTo')) {
      where.createdAt = {}
      if (searchParams.get('createdAtFrom')) where.createdAt.gte = new Date(searchParams.get('createdAtFrom')!)
      if (searchParams.get('createdAtTo')) where.createdAt.lte = new Date(searchParams.get('createdAtTo')!)
    }

    // Sorting
    const orderBy: any = {}
    const sort = searchParams.get('sort')
    if (sort) {
      const [sortField, sortDirection] = sort.split(':')
      orderBy[sortField] = sortDirection || 'asc'
    }

    const users = await prisma.user.findMany({
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
        contact: true,
        address: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        church: true,
        position: true,
        userSubjects: {
          include: {
            subject: true
          }
        },
        children: true,
        eudcationalAttainment: true, // Note: Check spelling in your schema
        cases: true
      }
    })

    const total = await prisma.user.count({ where })

    return NextResponse.json({
      data: users,
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

export async function POST(request: Request) {
  try {


    const body = await request.json()
    const hashedPassword = await argon2d.hash(body.password)

    const newUser = await prisma.user.create({
      data: {
        ...body,
        password: hashedPassword,
        role: 'worker',
        userSubjects: {
          create: body.subjects?.map((subjectId: number) => ({
            subject: { connect: { id: subjectId } }
          }))
        }
      },
      include: {
        church: true,
        position: true,
        userSubjects: true
      }
    })

    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { message: 'Error creating worker', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
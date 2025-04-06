// app/api/users/route.ts
import { NextResponse } from 'next/server'
import { UserRoles, UserGender, UserStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = Object.fromEntries(searchParams.entries())

    // Pagination
    const page = parseInt(query.page) || 1
    const limit = parseInt(query.limit) || 10
    const skip = (page - 1) * limit

    // Build filter
    const where: any = {}
    const validFilters = [
      'role', 'gender', 'status', 'churchId', 'positionId', 'email',
      'contact', 'address', 'createdAt', 'updatedAt'
    ]

    validFilters.forEach(filter => {
      if (query[filter]) where[filter] = query[filter]
    })

    // Date filters
    if (query.birthdayFrom || query.birthdayTo) {
      where.birthday = {
        gte: query.birthdayFrom ? new Date(query.birthdayFrom) : undefined,
        lte: query.birthdayTo ? new Date(query.birthdayTo) : undefined
      }
    }

    // Search
    if (query.search) {
      where.OR = [
        { firstname: { contains: query.search, mode: 'insensitive' } },
        { lastname: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } }
      ]
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        include: {
          church: true,
          position: true,
          children: true,
          eudcationalAttainment: true,
          cases: true,
          subject: true
        }
      }),
      prisma.user.count({ where })
    ])

    return NextResponse.json({
      data: users,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}


export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validation
    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if church exists if provided
    if (body.churchId) {
      const existingChurch = await prisma.church.findUnique({
        where: { id: body.churchId }
      });
      if (!existingChurch) {
        return NextResponse.json(
          { error: 'Church not found' },
          { status: 404 }
        );
      }
    }

    // Check if position exists if provided
    if (body.positionId) {
      const existingPosition = await prisma.position.findUnique({
        where: { id: body.positionId }
      });
      if (!existingPosition) {
        return NextResponse.json(
          { error: 'Position not found' },
          { status: 404 }
        );
      }
    }

    const newUser = await prisma.user.create({
      data: {
        ...body,
        birthday: new Date(body.birthday),
        role: body.role || 'worker',
        church: body.churchId ? { connect: { id: body.churchId } } : undefined,
        position: body.positionId ? { connect: { id: body.positionId } } : undefined,
        children: body.children ? {
          createMany: { data: body.children }
        } : undefined,
        eudcationalAttainment: body.eudcationalAttainment ? {
          createMany: { data: body.eudcationalAttainment }
        } : undefined,
        cases: body.cases ? {
          createMany: { data: body.cases }
        } : undefined,
        subject: body.subject ? {
          createMany: { data: body.subject }
        } : undefined
      },
      include: {
        church: true,
        position: true,
        children: true,
        eudcationalAttainment: true,
        cases: true,
        subject: true
      }
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
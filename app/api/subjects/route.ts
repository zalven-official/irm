// app/api/subjects/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    // Pagination
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')

    // Filtering
    const where: any = {}
    if (searchParams.get('name')) where.name = { contains: searchParams.get('name') }
    if (searchParams.get('description')) where.description = { contains: searchParams.get('description') }
    if (searchParams.has('disabled')) where.disabled = searchParams.get('disabled') === 'true'

    // Date range filter
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

    // Include users relationship
    const includeUsers = searchParams.get('includeUsers') === 'true'

    const subjects = await prisma.subject.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        userSubjects: includeUsers ? {
          include: {
            user: true
          }
        } : false
      }
    })

    const total = await prisma.subject.count({ where })

    return NextResponse.json({
      data: subjects,
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

    const newSubject = await prisma.subject.create({
      data: {
        name: body.name,
        description: body.description,
        disabled: body.disabled || false
      }
    })

    return NextResponse.json(newSubject, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { message: 'Error creating subject', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
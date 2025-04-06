import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = Object.fromEntries(searchParams.entries())

    // Pagination
    const page = parseInt(query.page) || 1
    const limit = parseInt(query.limit) || 10
    const skip = (page - 1) * limit

    // Filtering
    const where: any = {}
    if (query.name) where.name = { contains: query.name, mode: 'insensitive' }
    if (query.description) where.description = { contains: query.description, mode: 'insensitive' }

    // Sorting
    const sortField = query.sortBy || 'createdAt'
    const sortOrder = query.sortOrder || 'desc'

    const [positions, total] = await Promise.all([
      prisma.position.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortField]: sortOrder },
        include: {
          User: true
        }
      }),
      prisma.position.count({ where })
    ])

    return NextResponse.json({
      data: positions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch positions' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.description) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      )
    }

    const newPosition = await prisma.position.create({
      data: {
        name: body.name,
        description: body.description
      }
    })

    return NextResponse.json(newPosition, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create position' },
      { status: 500 }
    )
  }
}
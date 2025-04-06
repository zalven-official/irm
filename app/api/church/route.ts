// app/api/churches/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// GET all churches with filters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    // Pagination
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')

    // Filtering
    const where: any = {}
    if (searchParams.get('address')) where.address = { contains: searchParams.get('address') }
    if (searchParams.get('latitude')) where.latitude = parseInt(searchParams.get('latitude')!)
    if (searchParams.get('longitude')) where.longitude = parseInt(searchParams.get('longitude')!)

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

    const churches = await prisma.church.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { images: true }
    })

    const total = await prisma.church.count({ where })

    return NextResponse.json({
      data: churches,
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

// POST create new church with images
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { images, ...churchData } = body

    const newChurch = await prisma.church.create({
      data: {
        ...churchData,
        images: {
          create: images || []
        }
      },
      include: { images: true }
    })

    return NextResponse.json(newChurch, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { message: 'Error creating church', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
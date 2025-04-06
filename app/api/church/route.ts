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
    if (query.address) where.address = { contains: query.address, mode: 'insensitive' }
    if (query.latitude) where.latitude = parseInt(query.latitude)
    if (query.longitude) where.longitude = parseInt(query.longitude)

    // Range filters
    if (query.latitudeFrom || query.latitudeTo) {
      where.latitude = {
        gte: query.latitudeFrom ? parseInt(query.latitudeFrom) : undefined,
        lte: query.latitudeTo ? parseInt(query.latitudeTo) : undefined
      }
    }

    if (query.longitudeFrom || query.longitudeTo) {
      where.longitude = {
        gte: query.longitudeFrom ? parseInt(query.longitudeFrom) : undefined,
        lte: query.longitudeTo ? parseInt(query.longitudeTo) : undefined
      }
    }

    // Date filters
    if (query.createdAtFrom || query.createdAtTo) {
      where.createdAt = {
        gte: query.createdAtFrom ? new Date(query.createdAtFrom) : undefined,
        lte: query.createdAtTo ? new Date(query.createdAtTo) : undefined
      }
    }

    // Sorting
    const sortField = query.sortBy || 'createdAt'
    const sortOrder = query.sortOrder || 'desc'

    const [churches, total] = await Promise.all([
      prisma.church.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortField]: sortOrder },
        include: {
          images: true,
          User: true
        }
      }),
      prisma.church.count({ where })
    ])

    return NextResponse.json({
      data: churches,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch churches' },
      { status: 500 }
    )
  }
}


export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.address || !body.latitude || !body.longitude) {
      return NextResponse.json(
        { error: 'Address, latitude and longitude are required' },
        { status: 400 }
      )
    }

    const newChurch = await prisma.church.create({
      data: {
        address: body.address,
        latitude: parseInt(body.latitude),
        longitude: parseInt(body.longitude),
        images: {
          create: body.images?.map((image: string) => ({ image })) || []
        }
      },
      include: {
        images: true
      }
    })

    return NextResponse.json(newChurch, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create church' },
      { status: 500 }
    )
  }
}
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = Object.fromEntries(searchParams.entries())

    // Pagination and filtering
    const where: any = {}
    if (query.name) where.name = { contains: query.name, mode: 'insensitive' }
    if (query.description) where.description = { contains: query.description, mode: 'insensitive' }
    if (query.disabled) where.disabled = query.disabled === 'true'
    if (query.userId) where.userId = parseInt(query.userId)

    const [subjects, total] = await Promise.all([
      prisma.subject.findMany({
        where,
        include: {
          User: true
        }
      }),
      prisma.subject.count({ where })
    ])

    return NextResponse.json({
      data: subjects,
      total
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch subjects' },
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

    const newSubject = await prisma.subject.create({
      data: {
        name: body.name,
        description: body.description,
        disabled: body.disabled || false,
        userId: body.userId ? parseInt(body.userId) : undefined
      }
    })

    return NextResponse.json(newSubject, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create subject' },
      { status: 500 }
    )
  }
}
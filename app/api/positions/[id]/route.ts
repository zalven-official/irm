import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const position = await prisma.position.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        User: true
      }
    })

    if (!position) {
      return NextResponse.json({ error: 'Position not found' }, { status: 404 })
    }

    return NextResponse.json(position)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch position' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    if (body.description && typeof body.description !== 'string') {
      return NextResponse.json(
        { error: 'Description must be a string' },
        { status: 400 }
      )
    }

    const updatedPosition = await prisma.position.update({
      where: { id: parseInt(params.id) },
      data: {
        name: body.name,
        description: body.description
      }
    })

    return NextResponse.json(updatedPosition)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update position' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.position.delete({
      where: { id: parseInt(params.id) }
    })

    return NextResponse.json({ message: 'Position deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete position' },
      { status: 500 }
    )
  }
}
// app/api/positions/[id]/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const position = await prisma.position.findUnique({
      where: { id: parseInt(params.id) },
      include: { User: true }
    })

    if (!position) {
      return NextResponse.json({ message: 'Position not found' }, { status: 404 })
    }

    return NextResponse.json(position)
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching position', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

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
      { message: 'Error updating position', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check if position has associated users
    const usersWithPosition = await prisma.user.count({
      where: { positionId: parseInt(params.id) }
    })

    if (usersWithPosition > 0) {
      return NextResponse.json(
        { message: 'Cannot delete position with associated users' },
        { status: 400 }
      )
    }

    await prisma.position.delete({
      where: { id: parseInt(params.id) }
    })

    return NextResponse.json({ message: 'Position deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { message: 'Error deleting position', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
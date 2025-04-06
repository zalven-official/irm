import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const subject = await prisma.subject.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        User: true
      }
    })

    if (!subject) {
      return NextResponse.json({ error: 'Subject not found' }, { status: 404 })
    }

    return NextResponse.json(subject)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch subject' },
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

    // Validate input
    if (body.disabled && typeof body.disabled !== 'boolean') {
      return NextResponse.json(
        { error: 'Disabled must be a boolean value' },
        { status: 400 }
      )
    }

    if (body.userId && isNaN(body.userId)) {
      return NextResponse.json(
        { error: 'userId must be a valid number' },
        { status: 400 }
      )
    }

    const updatedSubject = await prisma.subject.update({
      where: { id: parseInt(params.id) },
      data: {
        name: body.name,
        description: body.description,
        disabled: body.disabled,
        userId: body.userId ? parseInt(body.userId) : undefined
      }
    })

    return NextResponse.json(updatedSubject)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update subject' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.subject.delete({
      where: { id: parseInt(params.id) }
    })

    return NextResponse.json({ message: 'Subject deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete subject' },
      { status: 500 }
    )
  }
}
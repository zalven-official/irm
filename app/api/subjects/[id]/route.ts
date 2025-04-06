// app/api/subjects/[id]/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const subject = await prisma.subject.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        userSubjects: {
          include: {
            user: true
          }
        }
      }
    })

    if (!subject) {
      return NextResponse.json({ message: 'Subject not found' }, { status: 404 })
    }

    return NextResponse.json(subject)
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching subject', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    const updatedSubject = await prisma.subject.update({
      where: { id: parseInt(params.id) },
      data: {
        name: body.name,
        description: body.description,
        disabled: body.disabled
      }
    })

    return NextResponse.json(updatedSubject)
  } catch (error) {
    return NextResponse.json(
      { message: 'Error updating subject', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check if subject has associated users
    const userSubjectsCount = await prisma.userSubjects.count({
      where: { subjectId: parseInt(params.id) }
    })

    if (userSubjectsCount > 0) {
      return NextResponse.json(
        { message: 'Cannot delete subject with associated users' },
        { status: 400 }
      )
    }

    await prisma.subject.delete({
      where: { id: parseInt(params.id) }
    })

    return NextResponse.json({ message: 'Subject deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { message: 'Error deleting subject', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
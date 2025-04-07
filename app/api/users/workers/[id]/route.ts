// app/api/users/worker/[id]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET single worker with cases
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(params.id), role: 'worker' },
      include: {
        church: true,
        position: true,
        userSubjects: {
          include: { subject: true }
        },
        children: true,
        eudcationalAttainment: true,
        cases: true
      }
    })

    if (!user) return NextResponse.json({ message: 'Worker not found' }, { status: 404 })

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching worker', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// UPDATE worker with cases
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(params.id) },
      data: {
        ...body,
        userSubjects: {
          deleteMany: {},
          create: body.subjects?.map((subjectId: number) => ({
            subject: { connect: { id: subjectId } }
          }))
        },
        cases: {
          deleteMany: { userId: parseInt(params.id) },
          create: body.cases?.map((c: any) => ({
            year: c.year,
            where: c.where,
            case: c.case,
            reason: c.reason
          }))
        }
      },
      include: {
        church: true,
        position: true,
        userSubjects: true,
        cases: true
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    return NextResponse.json(
      { message: 'Error updating worker', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// DELETE worker with cases
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Delete related cases first
    await prisma.userCase.deleteMany({
      where: { userId: parseInt(params.id) }
    })

    await prisma.user.delete({
      where: { id: parseInt(params.id) }
    })

    return NextResponse.json({ message: 'Worker and associated cases deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { message: 'Error deleting worker', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}